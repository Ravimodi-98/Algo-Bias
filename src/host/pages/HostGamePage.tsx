import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Tv, 
  Users, 
  ArrowLeft, 
  StopCircle, 
  CheckCircle2, 
  SkipForward, 
  RefreshCw,
  ShieldCheck,
  Target,
  Clock,
  Eye,
  AlertTriangle,
  Award
} from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { LoadingState } from '../../shared/components/LoadingState';
import { AggregateResultsView } from '../components/AggregateResultsView';
import { gameService } from '../../services/game/gameService';
import { storage } from '../../shared/utils/storage';
import { supabase } from '../../services/supabase/client';
import { getRoundData, ROUND_TIME_LIMIT } from '../../shared/data/rounds';
import type { DbGameSession, DbPlayer, DbResponse, RoundAggregate } from '../../shared/types';

export const HostGamePage: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<DbGameSession | null>(null);
  const [players, setPlayers] = useState<DbPlayer[]>([]);
  const [responses, setResponses] = useState<DbResponse[]>([]);
  const [aggregate, setAggregate] = useState<RoundAggregate>({
    roundNumber: 1,
    totalResponses: 0,
    candidateA: { count: 0, percentage: 0 },
    candidateB: { count: 0, percentage: 0 }
  });
  const [timeLeft, setTimeLeft] = useState<number>(ROUND_TIME_LIMIT);
  const [isTimedOut, setIsTimedOut] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isActionInProgress, setIsActionInProgress] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const actionLockRef = useRef<boolean>(false);
  const hostSession = storage.getHostSession();
  const hostId = hostSession?.hostId || 'HOST-DEMO';

  // Helper to recompute aggregate in-memory or from database
  const computeAggregate = useCallback((roundNum: number, respList: DbResponse[]): RoundAggregate => {
    let countA = 0;
    let countB = 0;
    respList.forEach((r) => {
      if (r.round_number === roundNum) {
        if (r.selected_candidate === 'A') countA++;
        else if (r.selected_candidate === 'B') countB++;
      }
    });
    const total = countA + countB;
    const percentageA = total > 0 ? Math.round((countA / total) * 100) : 0;
    const percentageB = total > 0 ? 100 - percentageA : 0;

    return {
      roundNumber: roundNum,
      totalResponses: total,
      candidateA: { count: countA, percentage: percentageA },
      candidateB: { count: countB, percentage: percentageB }
    };
  }, []);

  const loadActiveGame = useCallback(async () => {
    setIsLoading(true);
    try {
      const active = await gameService.getActiveHostSession(hostId);
      if (!active) {
        navigate('/host/dashboard');
        return;
      }
      setSession(active);
      const playerList = await gameService.getSessionPlayers(active.id);
      setPlayers(playerList);

      const roundNum = Math.max(1, Math.min(active.current_round || 1, 7));
      const roundResponses = await gameService.getSessionRoundResponses(active.id, roundNum);
      setResponses(roundResponses);
      setAggregate(computeAggregate(roundNum, roundResponses));

      // Synchronize timer
      const startTimeStr = active.round_started_at || active.updated_at;
      if (startTimeStr) {
        const elapsed = Math.max(0, Math.floor((Date.now() - new Date(startTimeStr).getTime()) / 1000));
        const remaining = Math.max(0, ROUND_TIME_LIMIT - elapsed);
        setTimeLeft(remaining);
        setIsTimedOut(remaining === 0);
      } else {
        setTimeLeft(ROUND_TIME_LIMIT);
        setIsTimedOut(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [hostId, navigate, computeAggregate]);

  useEffect(() => {
    loadActiveGame();
  }, [loadActiveGame]);

  const currentRound = Math.max(1, Math.min(session?.current_round || 1, 7));
  const resultsVisible = Boolean(session?.results_visible);

  // Authoritative Countdown Timer Ticker
  useEffect(() => {
    if (!session?.round_started_at) return;

    const timer = setInterval(() => {
      const startTime = new Date(session.round_started_at!).getTime();
      const elapsed = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
      const remaining = Math.max(0, ROUND_TIME_LIMIT - elapsed);

      setTimeLeft(remaining);
      if (remaining === 0) {
        setIsTimedOut(true);
      } else {
        setIsTimedOut(false);
      }
    }, 500);

    return () => clearInterval(timer);
  }, [session?.round_started_at]);

  // 1. Realtime subscription for new players joining
  useEffect(() => {
    if (!session?.id) return;

    const channel = supabase
      .channel(`host-game-players-${session.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'players',
          filter: `session_id=eq.${session.id}`
        },
        (payload) => {
          const newPlayer = payload.new as DbPlayer;
          setPlayers((prev) => {
            if (prev.some((p) => p.id === newPlayer.id)) return prev;
            return [...prev, newPlayer];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.id]);

  // 2. Realtime subscription for student decision submissions
  useEffect(() => {
    if (!session?.id) return;

    const channel = supabase
      .channel(`host-game-responses-${session.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'responses',
          filter: `session_id=eq.${session.id}`
        },
        (payload) => {
          const newResp = payload.new as DbResponse;
          if (newResp.round_number === currentRound) {
            setResponses((prev) => {
              if (prev.some((r) => r.id === newResp.id)) return prev;
              const nextList = [...prev, newResp];
              setAggregate(computeAggregate(currentRound, nextList));
              return nextList;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.id, currentRound, computeAggregate]);

  // 3. Realtime subscription for session updates (e.g. multiple host tabs or external events)
  useEffect(() => {
    if (!session?.id) return;

    const channel = supabase
      .channel(`host-game-session-${session.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_sessions',
          filter: `id=eq.${session.id}`
        },
        (payload) => {
          const updated = payload.new as DbGameSession;
          if (updated) {
            setSession(updated);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.id]);

  // Handler: Reveal Aggregate Results
  const handleShowResults = async () => {
    if (!session || actionLockRef.current || isActionInProgress) return;
    actionLockRef.current = true;
    setIsActionInProgress(true);

    try {
      const result = await gameService.showRoundResults(session.id, hostId);
      if (result.success) {
        setSession((prev) => prev ? { ...prev, results_visible: true } : null);
        setActionNotice(`CLASSROOM RESULTS REVEALED. All student devices updated.`);
        setTimeout(() => setActionNotice(null), 4000);
      } else {
        setActionNotice(result.error || 'Failed to reveal results.');
        setTimeout(() => setActionNotice(null), 4000);
      }
    } finally {
      setIsActionInProgress(false);
      actionLockRef.current = false;
    }
  };

  // Handler: Advance to Next Round
  const handleNextRound = async () => {
    if (!session || actionLockRef.current || isActionInProgress) return;
    actionLockRef.current = true;
    setIsActionInProgress(true);

    try {
      const nextRoundNumber = Math.min((session.current_round || 1) + 1, 7);
      const result = await gameService.updateGameState(
        session.id, 
        hostId, 
        'active', 
        nextRoundNumber
      );

      if (result.success) {
        setSession((prev) => prev ? { 
          ...prev, 
          current_round: nextRoundNumber,
          round_started_at: new Date().toISOString(),
          results_visible: false 
        } : null);

        // Fetch / reset responses for the new round
        const newRoundResponses = await gameService.getSessionRoundResponses(session.id, nextRoundNumber);
        setResponses(newRoundResponses);
        setAggregate(computeAggregate(nextRoundNumber, newRoundResponses));
        setTimeLeft(ROUND_TIME_LIMIT);
        setIsTimedOut(false);

        setActionNotice(`ROUND ADVANCED TO ROUND ${nextRoundNumber}. All student screens updated.`);
        setTimeout(() => setActionNotice(null), 4000);
      } else {
        setActionNotice(result.error || 'Failed to advance round.');
        setTimeout(() => setActionNotice(null), 4000);
      }
    } finally {
      setIsActionInProgress(false);
      actionLockRef.current = false;
    }
  };

  const handleEndGame = async () => {
    if (!session || actionLockRef.current || isActionInProgress) return;
    actionLockRef.current = true;
    setIsActionInProgress(true);

    try {
      await gameService.closeGameSession(session.id, hostId);
      navigate('/host/dashboard');
    } finally {
      setIsActionInProgress(false);
      actionLockRef.current = false;
    }
  };

  if (isLoading) {
    return <LoadingState message="Connecting to Live Host Control Center..." />;
  }

  if (!session) return null;

  const roundData = getRoundData(currentRound);
  const totalPlayersCount = players.length;
  const responsesCount = responses.length;
  const responsePercentage = totalPlayersCount > 0 
    ? Math.min(100, Math.round((responsesCount / totalPlayersCount) * 100)) 
    : 0;
  const allResponded = totalPlayersCount > 0 && responsesCount >= totalPlayersCount;

  // Format Time Remaining (e.g. 00:14)
  const formattedTime = `00:${timeLeft < 10 ? '0' : ''}${timeLeft}`;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Top Projector-First Navigation & Status Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1.25rem 1.75rem',
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 2px 12px rgba(15, 23, 42, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Badge variant="cyan" pulse>
            <Play size={13} style={{ marginRight: '4px' }} />
            LIVE EXPERIMENT IN PROGRESS
          </Badge>
          <span style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 800 }}>
            ROUND {currentRound} OF 7 &bull; PRESENTER CONTROL CENTER
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button
            variant="secondary"
            size="small"
            icon={<Tv size={15} />}
            onClick={() => navigate('/host/lobby')}
          >
            Lobby & QR
          </Button>
          <Button
            variant="ghost"
            size="small"
            icon={<ArrowLeft size={15} />}
            onClick={() => navigate('/host/dashboard')}
          >
            Dashboard
          </Button>
          <Button
            variant="ghost"
            size="small"
            icon={<RefreshCw size={15} />}
            onClick={loadActiveGame}
            title="Refresh game data"
          />
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionNotice && (
        <div style={{
          background: 'rgba(2, 132, 199, 0.08)',
          border: '1px solid var(--accent-cyan)',
          borderRadius: 'var(--radius-md)',
          padding: '0.9rem 1.4rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: 'var(--accent-cyan)',
          fontSize: '0.95rem',
          fontWeight: 800
        }}>
          <CheckCircle2 size={20} />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Large Projector Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Game Code Card */}
        <Card glow="cyan">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>GAME CODE</span>
            <Tv size={18} color="var(--accent-cyan)" />
          </div>
          <span className="font-mono text-cyan" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '0.05em' }}>
            {session.game_code}
          </span>
        </Card>

        {/* Connected Players Card */}
        <Card glow="purple">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>CONNECTED PLAYERS</span>
            <Users size={18} color="var(--accent-purple)" />
          </div>
          <span className="font-mono" style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            {totalPlayersCount}
          </span>
        </Card>

        {/* Live Responses Card */}
        <Card glow={allResponded ? 'cyan' : 'purple'}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>RESPONSES LOGGED</span>
            <Award size={18} color={allResponded ? 'var(--color-success)' : 'var(--accent-purple)'} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span className="font-mono" style={{ 
              fontSize: '2.5rem', 
              fontWeight: 900, 
              color: allResponded ? 'var(--color-success)' : 'var(--text-primary)' 
            }}>
              {responsesCount}
            </span>
            <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              / {totalPlayersCount}
            </span>
          </div>
        </Card>

        {/* Synchronized Round Timer Card */}
        <Card glow={isTimedOut ? 'purple' : 'cyan'}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>ROUND TIMER</span>
            <Clock size={18} color={isTimedOut ? 'var(--color-warning)' : 'var(--accent-cyan)'} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span className="font-mono" style={{ 
              fontSize: '2.5rem', 
              fontWeight: 900, 
              color: isTimedOut ? 'var(--color-warning)' : 'var(--accent-cyan)' 
            }}>
              {formattedTime}
            </span>
            <span style={{ fontSize: '0.85rem', color: isTimedOut ? 'var(--color-warning)' : 'var(--text-muted)', fontWeight: 700 }}>
              {isTimedOut ? 'EXPIRED' : 'LEFT'}
            </span>
          </div>
        </Card>
      </div>

      {/* Live Response Progress & Status Center */}
      <Card glow="cyan">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.25rem 0' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Dynamic State Indicator */}
              {resultsVisible ? (
                <Badge variant="success" pulse>
                  <Eye size={12} style={{ marginRight: '4px' }} />
                  RESULTS REVEALED TO CLASSROOM
                </Badge>
              ) : allResponded ? (
                <Badge variant="success" pulse>
                  <CheckCircle2 size={12} style={{ marginRight: '4px' }} />
                  ALL RESPONSES RECEIVED
                </Badge>
              ) : isTimedOut ? (
                <Badge variant="warning">
                  <AlertTriangle size={12} style={{ marginRight: '4px' }} />
                  DECISION WINDOW CLOSED
                </Badge>
              ) : (
                <Badge variant="cyan" pulse>
                  <Play size={12} style={{ marginRight: '4px' }} />
                  ROUND ACTIVE
                </Badge>
              )}

              <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {resultsVisible
                  ? 'Aggregate results are projected and visible on student devices'
                  : allResponded
                    ? 'All connected students have responded. Ready to reveal results.'
                    : isTimedOut
                      ? `Time expired. ${responsesCount} of ${totalPlayersCount} players submitted.`
                      : 'Students are currently evaluating candidates and submitting decisions'}
              </span>
            </div>

            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
              <span className="font-mono text-cyan">{responsesCount}</span> of <span className="font-mono">{totalPlayersCount}</span> players responded ({responsePercentage}%)
            </div>
          </div>

          {/* Projector-Optimized Visual Response Progress Bar */}
          <div style={{
            height: '18px',
            width: '100%',
            background: 'var(--bg-surface-secondary)',
            borderRadius: '9px',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden',
            boxShadow: 'inset 0 1px 3px rgba(15, 23, 42, 0.06)'
          }}>
            <div
              style={{
                height: '100%',
                width: `${responsePercentage}%`,
                background: allResponded 
                  ? 'linear-gradient(90deg, #10b981, #059669)' 
                  : 'linear-gradient(90deg, #0284c7, #38bdf8)',
                borderRadius: '9px',
                transition: 'width 0.5s ease-out'
              }}
            />
          </div>

        </div>
      </Card>

      {/* Aggregate Results Component (Concealed until revealed or Host Peeks) */}
      <AggregateResultsView
        aggregate={aggregate}
        roundData={roundData}
        resultsVisible={resultsVisible}
        totalPlayers={totalPlayersCount}
        onShowResults={handleShowResults}
        isActionInProgress={isActionInProgress}
      />

      {/* Scenario Overview Details */}
      <Card glow="purple">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', padding: '0.25rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={16} color="var(--accent-purple)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-purple)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              ROUND {currentRound} SCENARIO SPECIFICATION
            </span>
          </div>

          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {roundData.title} &bull; Target Role: {roundData.role}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0.3rem 0 0 0', lineHeight: 1.45 }}>
              {roundData.context}
            </p>
          </div>

          <div style={{
            background: 'var(--bg-surface-secondary)',
            padding: '0.85rem 1.15rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.45
          }}>
            <strong style={{ color: 'var(--text-primary)' }}>Educational Scenario Purpose:</strong> {roundData.educationalPurpose}
          </div>
        </div>
      </Card>

      {/* Host Command Center Controls */}
      <Card glow="cyan">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.5rem 0' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Badge variant="cyan">PRESENTER GAME CONTROLLER</Badge>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              Classroom Presentation Actions
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
              Control the classroom presentation flow. Click <strong>SHOW RESULTS</strong> to broadcast collective results to students, then click <strong>NEXT ROUND</strong> when ready.
            </p>
          </div>

          <div style={{
            background: 'var(--bg-surface-secondary)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>
                CURRENT ROUND STATE
              </span>
              <span className="font-mono text-cyan" style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                Round {currentRound} of 7 &bull; {resultsVisible ? 'Results Revealed to Classroom' : 'Results Concealed'}
              </span>
            </div>

            {/* Action Buttons (Protected against double clicks) */}
            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              
              {/* Button: Show Results */}
              <Button
                variant={resultsVisible ? 'secondary' : 'primary'}
                size="normal"
                icon={<Eye size={16} />}
                onClick={handleShowResults}
                disabled={isActionInProgress || resultsVisible}
                id="btn-host-show-results"
                style={{ minHeight: '44px' }}
              >
                {resultsVisible 
                  ? 'RESULTS VISIBLE TO CLASS' 
                  : isActionInProgress 
                    ? 'BROADCASTING...' 
                    : 'SHOW RESULTS'}
              </Button>

              {/* Button: Next Round */}
              <Button
                variant={resultsVisible ? 'primary' : 'secondary'}
                size="normal"
                icon={<SkipForward size={16} />}
                onClick={handleNextRound}
                disabled={isActionInProgress || currentRound >= 7}
                id="btn-host-next-round"
                style={{ minHeight: '44px' }}
              >
                {isActionInProgress 
                  ? 'ADVANCING...' 
                  : currentRound >= 7 
                    ? 'FINAL ROUND REACHED' 
                    : `NEXT ROUND (${currentRound + 1} / 7)`}
              </Button>

              {/* Button: End Game */}
              <Button
                variant="danger"
                size="normal"
                icon={<StopCircle size={16} />}
                onClick={handleEndGame}
                disabled={isActionInProgress}
                id="btn-host-end-game"
                style={{ minHeight: '44px' }}
              >
                {isActionInProgress ? 'ENDING...' : 'END SIMULATION'}
              </Button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            <ShieldCheck size={15} color="var(--color-success)" />
            <span>
              Host authorized ({hostId}). Actions execute authoritatively in Supabase and synchronize to all {totalPlayersCount} student devices.
            </span>
          </div>
        </div>
      </Card>

    </div>
  );
};
