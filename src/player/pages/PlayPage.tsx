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
import { CountdownTimer } from '../components/CountdownTimer';
import { CandidateCard } from '../components/CandidateCard';
import { DecisionPanel } from '../components/DecisionPanel';
import { PlayerResultsCard } from '../components/PlayerResultsCard';
import { PlayerRevealView } from '../components/PlayerRevealView';
import { PlayerFairnessView } from '../components/PlayerFairnessView';
import { PlayerFinalView } from '../components/PlayerFinalView';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { LoadingState } from '../../shared/components/LoadingState';
import { storage } from '../../shared/utils/storage';
import { gameService } from '../../services/game/gameService';
import { supabase } from '../../services/supabase/client';
import { getRoundData, ROUND_TIME_LIMIT } from '../../shared/data/rounds';
import type { 
  PlayerSession, 
  DbGameSession, 
  RoundAggregate,
  FairnessClassroomAggregates,
  FairnessStepNumber,
  FinalStepNumber,
  SessionFinalSummary
} from '../../shared/types';

export const PlayPage: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<PlayerSession | null>(null);
  const [gameSession, setGameSession] = useState<DbGameSession | null>(null);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [selectedCandidate, setSelectedCandidate] = useState<'A' | 'B' | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isTimedOut, setIsTimedOut] = useState<boolean>(false);
  const [resultsVisible, setResultsVisible] = useState<boolean>(false);
  const [roundAggregate, setRoundAggregate] = useState<RoundAggregate | null>(null);
  const [allAggregates, setAllAggregates] = useState<Record<number, RoundAggregate>>({});
  const [fairnessAggregates, setFairnessAggregates] = useState<FairnessClassroomAggregates | null>(null);
  const [finalSummary, setFinalSummary] = useState<SessionFinalSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'reconnecting'>('connected');
  const [roundNotification, setRoundNotification] = useState<string | null>(null);

  const fetchAggregate = useCallback(async (sessionId: string, roundNum: number) => {
    try {
      const agg = await gameService.getRoundAggregates(sessionId, roundNum);
      setRoundAggregate(agg);
    } catch (err) {
      console.error('Error fetching round aggregates on player:', err);
    }
  }, []);

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

    // Authoritative current round (clamped 1 to 7)
    const roundNum = Math.max(1, Math.min(game.current_round || 1, 7));
    setCurrentRound(roundNum);

    // Check results visibility
    if (game.results_visible) {
      setResultsVisible(true);
      await fetchAggregate(game.id, roundNum);
    } else {
      setResultsVisible(false);
    }

    if (game.game_stage === 'reveal' || (game.current_round && game.current_round >= 7)) {
      try {
        const aggs = await gameService.getSessionAllRoundsAggregates(game.id);
        setAllAggregates(aggs);
      } catch (err) {
        console.error('Error fetching all aggregates in loadAndVerifySession:', err);
      }
    }

    if (game.game_stage === 'fairness') {
      try {
        const fAggs = await gameService.getFairnessClassroomAggregates(game.id);
        setFairnessAggregates(fAggs);
      } catch (err) {
        console.error('Error fetching fairness aggregates in loadAndVerifySession:', err);
      }
    }

    if (game.game_stage === 'final' || game.game_stage === 'completed' || game.status === 'completed') {
      try {
        const fSummary = await gameService.getSessionFinalSummary(game.id);
        setFinalSummary(fSummary);
      } catch (err) {
        console.error('Error fetching final summary in loadAndVerifySession:', err);
      }
    }

    // Check if decision was already recorded in database
    const dbResponse = await gameService.getPlayerResponse(activePlayer.sessionId, activePlayer.playerId, roundNum);
    if (dbResponse) {
      setSelectedCandidate(dbResponse.selected_candidate);
      setHasSubmitted(true);
      setIsTimedOut(false);
    } else {
      // Check local storage fallback
      const savedRoundDecision = localStorage.getItem(`decision_${activePlayer.sessionId}_round_${roundNum}`);
      if (savedRoundDecision === 'A' || savedRoundDecision === 'B') {
        setSelectedCandidate(savedRoundDecision);
        setHasSubmitted(true);
        setIsTimedOut(false);
      } else {
        setSelectedCandidate(null);
        setHasSubmitted(false);

        // Check if authoritative round timer has expired
        const startTimeStr = game.round_started_at || game.updated_at;
        if (startTimeStr) {
          const elapsed = (Date.now() - new Date(startTimeStr).getTime()) / 1000;
          if (elapsed >= ROUND_TIME_LIMIT) {
            setIsTimedOut(true);
          } else {
            setIsTimedOut(false);
          }
        }
      }
    }

    setIsLoading(false);
  }, [fetchAggregate]);

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
        async (payload) => {
          const updated = payload.new as DbGameSession;
          if (updated) {
            setGameSession(updated);

            // Results visibility change
            if (typeof updated.results_visible === 'boolean') {
              if (updated.results_visible) {
                setResultsVisible(true);
                await fetchAggregate(session.sessionId, updated.current_round || currentRound);
              } else {
                setResultsVisible(false);
              }
            }

            // Bias Reveal Stage Sync
            if (updated.game_stage === 'reveal') {
              const aggs = await gameService.getSessionAllRoundsAggregates(session.sessionId);
              setAllAggregates(aggs);
            }

            // Fairness Stage Sync
            if (updated.game_stage === 'fairness') {
              try {
                const fAggs = await gameService.getFairnessClassroomAggregates(session.sessionId);
                setFairnessAggregates(fAggs);
              } catch (err) {
                console.error('Error fetching fairness aggregates in Realtime:', err);
              }
            }

            // Final Stage & Completed Sync (Case 10)
            if (updated.game_stage === 'final' || updated.game_stage === 'completed' || updated.status === 'completed') {
              try {
                const fSummary = await gameService.getSessionFinalSummary(session.sessionId);
                setFinalSummary(fSummary);
              } catch (err) {
                console.error('Error fetching final summary in Realtime:', err);
              }
            }

            // Round advancement initiated by host
            if (updated.status === 'active' && updated.current_round !== currentRound) {
              const nextRound = Math.max(1, Math.min(updated.current_round || 1, 7));
              setCurrentRound(nextRound);
              setIsTimedOut(false);
              setResultsVisible(Boolean(updated.results_visible));
              setRoundAggregate(null);

              // Check if player already submitted response for this round
              const existingResponse = await gameService.getPlayerResponse(session.sessionId, session.playerId, nextRound);
              if (existingResponse) {
                setSelectedCandidate(existingResponse.selected_candidate);
                setHasSubmitted(true);
              } else {
                setSelectedCandidate(null);
                setHasSubmitted(false);
              }

              setRoundNotification(`ROUND ${nextRound} INITIATED BY HOST`);
              setTimeout(() => setRoundNotification(null), 3500);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.sessionId, session?.playerId, currentRound, fetchAggregate]);

  // 4. Decision Submission Handler (Database Persisted)
  const handleSubmitDecision = async () => {
    if (!selectedCandidate || !session || isSubmitting || isTimedOut) return;
    setIsSubmitting(true);

    try {
      // Save in Supabase responses table with duplicate protection
      await gameService.submitResponse(
        session.sessionId,
        session.playerId,
        currentRound,
        selectedCandidate
      );

      // Fallback local storage backup
      localStorage.setItem(`decision_${session.sessionId}_round_${currentRound}`, selectedCandidate);

      setHasSubmitted(true);
    } catch (err) {
      console.error('Error submitting response:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimeout = () => {
    if (!hasSubmitted) {
      setIsTimedOut(true);
    }
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
              SIMULATION CONCLUDED
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '340px' }}>
              All decision rounds have been completed. Thank you for participating in THE DECISION.
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
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
      
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
            padding: '0.65rem 1rem',
            textAlign: 'center',
            fontSize: '0.85rem',
            fontWeight: 800,
            color: 'var(--accent-cyan)',
            letterSpacing: '0.04em'
          }}
        >
          {roundNotification}
        </div>
      )}

      {/* Accessible Game Progress Bar (Only during rounds) */}
      {gameSession?.game_stage !== 'reveal' && 
       gameSession?.game_stage !== 'fairness' && 
       gameSession?.game_stage !== 'final' && 
       gameSession?.game_stage !== 'completed' && 
       gameSession?.status !== 'completed' && (
        <GameProgressBar 
          currentRound={currentRound} 
          totalRounds={7} 
          gameCode={gameSession?.game_code || session?.gameCode} 
        />
      )}

      {/* CONDITIONAL DISPLAY: Reveal Stage vs Fairness Stage vs Final Stage vs Results vs Gameplay Flow */}
      {gameSession?.game_stage === 'reveal' ? (
        <PlayerRevealView
          currentStep={((gameSession.reveal_step || 1) as any)}
          allAggregates={allAggregates}
        />
      ) : gameSession?.game_stage === 'fairness' ? (
        <PlayerFairnessView
          currentStep={((gameSession.fairness_step ?? 0) as FairnessStepNumber)}
          session={session!}
          classroomAggregates={fairnessAggregates || undefined}
        />
      ) : (gameSession?.game_stage === 'final' || gameSession?.game_stage === 'completed' || gameSession?.status === 'completed') ? (
        <PlayerFinalView
          currentStep={((gameSession?.final_step ?? 0) as FinalStepNumber)}
          session={session!}
          summary={finalSummary}
          isCompleted={gameSession?.status === 'completed' || gameSession?.game_stage === 'completed'}
        />
      ) : resultsVisible ? (
        roundAggregate ? (
          /* 1. Classroom Result Screen (Triggered by Host SHOW RESULTS) */
          <PlayerResultsCard
            aggregate={roundAggregate}
            roundData={roundData}
            userSelection={selectedCandidate}
            currentRound={currentRound}
          />
        ) : (
          <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
            <LoadingState message="Aggregating classroom decisions in real time..." />
          </div>
        )
      ) : (
        /* 2. Active Decision & Waiting Experience */
        <>
          {/* Synchronized Countdown Timer */}
          <CountdownTimer
            roundStartedAt={gameSession?.round_started_at || gameSession?.updated_at}
            isSubmitted={hasSubmitted}
            onTimeout={handleTimeout}
            timeLimit={ROUND_TIME_LIMIT}
          />

          {/* Compact Scenario Header Card */}
          <div style={{
            background: '#ffffff',
            padding: '0.75rem 0.95rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Target size={13} color="var(--accent-cyan)" />
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: 'var(--accent-cyan)',
                textTransform: 'uppercase'
              }}>
                ROUND {currentRound} &bull; {roundData.title}
              </span>
            </div>

            <p style={{
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.4,
              margin: 0
            }}>
              {roundData.context}
            </p>
          </div>

          {/* Candidate A Card (Compact) */}
          <CandidateCard
            candidate={roundData.candidateA}
            isSelected={selectedCandidate === 'A'}
            onSelect={(id) => !hasSubmitted && !isTimedOut && setSelectedCandidate(id)}
            disabled={hasSubmitted || isTimedOut}
          />

          {/* Mobile-Friendly VS Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0.05rem 0'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              boxShadow: '0 1px 4px rgba(15, 23, 42, 0.06)',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 900,
              letterSpacing: '0.05em'
            }}>
              VS
            </div>
          </div>

          {/* Candidate B Card (Compact) */}
          <CandidateCard
            candidate={roundData.candidateB}
            isSelected={selectedCandidate === 'B'}
            onSelect={(id) => !hasSubmitted && !isTimedOut && setSelectedCandidate(id)}
            disabled={hasSubmitted || isTimedOut}
          />

          {/* Decision Area & Submitted/Timeout Waiting State */}
          <DecisionPanel
            selectedCandidate={selectedCandidate}
            onSelectCandidate={(id) => !hasSubmitted && !isTimedOut && setSelectedCandidate(id)}
            onSubmitDecision={handleSubmitDecision}
            isSubmitting={isSubmitting}
            hasSubmitted={hasSubmitted}
            isTimedOut={isTimedOut}
            currentRound={currentRound}
          />
        </>
      )}

    </div>
  );
};
