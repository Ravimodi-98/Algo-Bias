import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertCircle, 
  Radio, 
  Sparkles,
  Wifi,
  WifiOff,
  LogOut
} from 'lucide-react';
import { GameProgressBar } from '../components/GameProgressBar';
import { CandidateCard, CandidateProfile } from '../components/CandidateCard';
import { DecisionPanel } from '../components/DecisionPanel';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { LoadingState } from '../../shared/components/LoadingState';
import { storage } from '../../shared/utils/storage';
import { gameService } from '../../services/game/gameService';
import { supabase } from '../../services/supabase/client';
import type { PlayerSession, DbGameSession } from '../../shared/types';

// Fictional round candidates generator for Case 4 gameplay shell
const getFictionalCandidatesForRound = (round: number): { a: CandidateProfile; b: CandidateProfile } => {
  return {
    a: {
      id: 'A',
      name: `Candidate ${String(round).padStart(2, '0')}-A`,
      role: 'Software Systems Engineer',
      experience: `${3 + (round % 3)} years experience building distributed backend services and real-time processing pipelines.`,
      education: 'B.S. in Computer Science, State University (Honors Graduate)',
      skills: ['Python', 'TypeScript', 'Distributed Systems', 'PostgreSQL', 'Docker'],
      projects: 'Architected high-throughput data synchronization engine processing 40k events/sec.',
      highlightMetric: 'Top 5% Technical Screening Score'
    },
    b: {
      id: 'B',
      name: `Candidate ${String(round).padStart(2, '0')}-B`,
      role: 'Software Systems Engineer',
      experience: `${4 + (round % 2)} years experience in enterprise systems architecture, fault tolerance, and API performance.`,
      education: 'B.S. in Software Engineering, Institute of Technology',
      skills: ['Go', 'Kubernetes', 'Cloud Architecture', 'Redis', 'Microservices'],
      projects: 'Engineered mission-critical payment settlement gateway maintaining 99.99% uptime.',
      highlightMetric: 'Extensive Production Architecture Experience'
    }
  };
};

export const PlayPage: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<PlayerSession | null>(null);
  const [gameSession, setGameSession] = useState<DbGameSession | null>(null);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [selectedCandidate, setSelectedCandidate] = useState<'A' | 'B' | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'reconnecting'>('connected');
  const [roundNotification, setRoundNotification] = useState<string | null>(null);

  // 1. Session Verification & State Initialization
  const loadAndVerifySession = useCallback(async () => {
    setIsLoading(true);
    setErrorNotice(null);

    const activePlayer = storage.getPlayerSession();
    if (!activePlayer || !activePlayer.sessionId || !activePlayer.playerId) {
      setErrorNotice('NO_SESSION');
      setIsLoading(false);
      return;
    }

    setSession(activePlayer);

    // Verify player against Supabase
    const verified = await gameService.verifyPlayer(activePlayer.playerId, activePlayer.sessionId);
    if (!verified) {
      setErrorNotice('SESSION_INTERRUPTED');
      setIsLoading(false);
      return;
    }

    // Fetch authoritative game session from Supabase
    const game = await gameService.getSessionById(activePlayer.sessionId);
    if (!game) {
      setErrorNotice('GAME_NOT_FOUND');
      setIsLoading(false);
      return;
    }

    setGameSession(game);

    if (game.status === 'waiting') {
      // Game has not started yet
      setErrorNotice('GAME_NOT_STARTED');
      setIsLoading(false);
      return;
    }

    if (game.status === 'completed') {
      setErrorNotice('GAME_ENDED');
      setIsLoading(false);
      return;
    }

    const roundNum = game.current_round > 0 ? game.current_round : 1;
    setCurrentRound(roundNum);

    // Check if decision was already recorded for this round in local storage
    const savedRoundDecision = localStorage.getItem(`decision_${activePlayer.sessionId}_round_${roundNum}`);
    if (savedRoundDecision === 'A' || savedRoundDecision === 'B') {
      setSelectedCandidate(savedRoundDecision);
      setHasSubmitted(true);
    } else {
      setSelectedCandidate(null);
      setHasSubmitted(false);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadAndVerifySession();
  }, [loadAndVerifySession]);

  // 2. Realtime Heartbeat Presence
  useEffect(() => {
    if (!session?.playerId || !session?.sessionId) return;

    const interval = setInterval(async () => {
      const ping = await gameService.verifyPlayer(session.playerId, session.sessionId);
      if (!ping) {
        setConnectionStatus('reconnecting');
      } else {
        setConnectionStatus('connected');
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [session?.playerId, session?.sessionId]);

  // 3. Supabase Realtime Subscription for Game State Changes
  useEffect(() => {
    if (!session?.sessionId) return;

    const channel = supabase
      .channel(`player-game-round-${session.sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_sessions',
          filter: `id=eq.${session.sessionId}`
        },
        (payload) => {
          const updated = payload.new as DbGameSession;
          if (updated) {
            setGameSession(updated);

            if (updated.status === 'completed') {
              setErrorNotice('GAME_ENDED');
              return;
            }

            if (updated.status === 'active' && updated.current_round !== currentRound) {
              const nextRound = updated.current_round;
              setCurrentRound(nextRound);
              setSelectedCandidate(null);
              setHasSubmitted(false);
              setRoundNotification(`ROUND ${nextRound} INITIATED BY HOST`);
              setTimeout(() => setRoundNotification(null), 4000);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.sessionId, currentRound]);

  // 4. Decision Submission Handler
  const handleSubmitDecision = () => {
    if (!selectedCandidate || !session) return;
    setIsSubmitting(true);

    // Save decision state for current round
    localStorage.setItem(`decision_${session.sessionId}_round_${currentRound}`, selectedCandidate);

    setTimeout(() => {
      setIsSubmitting(false);
      setHasSubmitted(true);
    }, 400);
  };

  const handleLeaveGame = () => {
    storage.clearPlayerSession();
    navigate('/join');
  };

  // --- RENDERING STATES ---

  if (isLoading) {
    return <LoadingState message="Synchronizing with Live Simulation Engine..." />;
  }

  // Error / Recovery State 1: No session found
  if (errorNotice === 'NO_SESSION') {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
        <Card glow="purple">
          <div style={{ padding: '1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <AlertCircle size={40} color="var(--accent-purple)" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              SESSION NOT FOUND
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '340px', lineHeight: 1.5 }}>
              Please join a game session using the 6-character room code from your host or projector display.
            </p>
            <Button variant="primary" size="large" onClick={() => navigate('/join')}>
              JOIN A GAME
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Error / Recovery State 2: Game not started yet
  if (errorNotice === 'GAME_NOT_STARTED') {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
        <Card glow="purple">
          <div style={{ padding: '1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Radio size={36} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              GAME NOT STARTED
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '340px' }}>
              The host has not started the session yet. Please stand by in the game waiting room.
            </p>
            <Button variant="primary" size="normal" onClick={() => navigate('/lobby')}>
              GO TO LOBBY
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Error / Recovery State 3: Game ended
  if (errorNotice === 'GAME_ENDED') {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
        <Card glow="cyan">
          <div style={{ padding: '1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Sparkles size={40} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              THIS GAME HAS ENDED
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '340px' }}>
              Thanks for participating in THE DECISION algorithmic fairness simulation.
            </p>
            <Button variant="secondary" onClick={handleLeaveGame}>
              JOIN ANOTHER GAME
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const candidates = getFictionalCandidatesForRound(currentRound);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Network Status & Callsign Info Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Badge variant={connectionStatus === 'connected' ? 'cyan' : 'warning'}>
            {connectionStatus === 'connected' ? (
              <>
                <Wifi size={12} style={{ marginRight: '4px' }} />
                ACTIVE & SYNCED
              </>
            ) : (
              <>
                <WifiOff size={12} style={{ marginRight: '4px' }} />
                RECONNECTING...
              </>
            )}
          </Badge>

          <span className="font-mono text-cyan" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
            {session?.anonymousName}
          </span>
        </div>

        <button
          onClick={handleLeaveGame}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.75rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
          title="Exit Session"
        >
          <LogOut size={12} /> Exit
        </button>
      </div>

      {/* Round Notification Banner */}
      {roundNotification && (
        <div 
          className="animate-fade-in"
          style={{
            background: 'linear-gradient(90deg, rgba(0, 240, 255, 0.2), rgba(139, 92, 246, 0.2))',
            border: '1px solid var(--accent-cyan)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            textAlign: 'center',
            fontSize: '0.88rem',
            fontWeight: 800,
            color: 'var(--accent-cyan)',
            letterSpacing: '0.05em'
          }}
        >
          {roundNotification}
        </div>
      )}

      {/* Accessible Game Progress Bar */}
      <GameProgressBar 
        currentRound={currentRound} 
        totalRounds={7} 
        gameCode={gameSession?.game_code || session?.gameCode} 
      />

      {/* Instruction Note */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.82rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.4
      }}>
        <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>SCENARIO:</span> Compare Candidate A and Candidate B below. Determine which candidate your automated screening system selects.
      </div>

      {/* Candidate Comparison Cards Grid (Mobile-First 1 Column, Desktop 2 Columns) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        <CandidateCard
          candidate={candidates.a}
          isSelected={selectedCandidate === 'A'}
          onSelect={(id) => !hasSubmitted && setSelectedCandidate(id)}
          disabled={hasSubmitted}
        />

        <CandidateCard
          candidate={candidates.b}
          isSelected={selectedCandidate === 'B'}
          onSelect={(id) => !hasSubmitted && setSelectedCandidate(id)}
          disabled={hasSubmitted}
        />
      </div>

      {/* Decision Area & Submitted Waiting Transition */}
      <DecisionPanel
        selectedCandidate={selectedCandidate}
        onSelectCandidate={(id) => !hasSubmitted && setSelectedCandidate(id)}
        onSubmitDecision={handleSubmitDecision}
        isSubmitting={isSubmitting}
        hasSubmitted={hasSubmitted}
        currentRound={currentRound}
      />
    </div>
  );
};
