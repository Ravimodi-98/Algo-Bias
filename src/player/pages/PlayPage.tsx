import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertCircle, 
  Radio, 
  Sparkles,
  Wifi,
  WifiOff,
  LogOut,
  Target
} from 'lucide-react';
import { GameProgressBar } from '../components/GameProgressBar';
import { CandidateCard } from '../components/CandidateCard';
import { DecisionPanel } from '../components/DecisionPanel';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { LoadingState } from '../../shared/components/LoadingState';
import { storage } from '../../shared/utils/storage';
import { gameService } from '../../services/game/gameService';
import { supabase } from '../../services/supabase/client';
import { getRoundData } from '../../shared/data/rounds';
import type { PlayerSession, DbGameSession } from '../../shared/types';

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
      setErrorNotice('GAME_NOT_STARTED');
      setIsLoading(false);
      return;
    }

    if (game.status === 'completed') {
      setErrorNotice('GAME_ENDED');
      setIsLoading(false);
      return;
    }

    const roundNum = Math.max(1, Math.min(game.current_round || 1, 7));
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
              const nextRound = Math.max(1, Math.min(updated.current_round || 1, 7));
              setCurrentRound(nextRound);
              
              // Restore previously recorded decision if player already voted in this round
              const saved = localStorage.getItem(`decision_${session.sessionId}_round_${nextRound}`);
              if (saved === 'A' || saved === 'B') {
                setSelectedCandidate(saved);
                setHasSubmitted(true);
              } else {
                setSelectedCandidate(null);
                setHasSubmitted(false);
              }

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
    }, 350);
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

  // Authoritative Round Data for current round
  const roundData = getRoundData(currentRound);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Network Status & Callsign Bar */}
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

          <span className="font-mono text-cyan" style={{ fontSize: '0.8rem', fontWeight: 800 }}>
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
            gap: '0.25rem',
            padding: '0.25rem 0.5rem'
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
            background: 'rgba(2, 132, 199, 0.08)',
            border: '1px solid var(--accent-cyan)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            textAlign: 'center',
            fontSize: '0.88rem',
            fontWeight: 800,
            color: 'var(--accent-cyan)',
            letterSpacing: '0.04em'
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

      {/* Scenario Context Card */}
      <div style={{
        background: '#ffffff',
        padding: '1rem 1.15rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Target size={14} color="var(--accent-cyan)" />
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
            color: 'var(--accent-cyan)',
            textTransform: 'uppercase'
          }}>
            ROUND {currentRound} &bull; {roundData.title}
          </span>
        </div>

        <h1 style={{
          fontSize: '1.15rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          margin: 0,
          letterSpacing: '-0.01em'
        }}>
          {roundData.role}
        </h1>

        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.45,
          margin: 0
        }}>
          {roundData.context}
        </p>
      </div>

      {/* Candidate A Card */}
      <CandidateCard
        candidate={roundData.candidateA}
        isSelected={selectedCandidate === 'A'}
        onSelect={(id) => !hasSubmitted && setSelectedCandidate(id)}
        disabled={hasSubmitted}
      />

      {/* Mobile-Friendly VS Divider */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0.1rem 0'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          fontWeight: 900,
          letterSpacing: '0.05em'
        }}>
          VS
        </div>
      </div>

      {/* Candidate B Card */}
      <CandidateCard
        candidate={roundData.candidateB}
        isSelected={selectedCandidate === 'B'}
        onSelect={(id) => !hasSubmitted && setSelectedCandidate(id)}
        disabled={hasSubmitted}
      />

      {/* Decision Area & Submitted Waiting State */}
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
