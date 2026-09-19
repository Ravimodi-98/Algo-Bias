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
  Award,
  Sparkles
} from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { LoadingState } from '../../shared/components/LoadingState';
import { AggregateResultsView } from '../components/AggregateResultsView';
import { HostRevealView } from '../components/HostRevealView';
import { HostFairnessView } from '../components/HostFairnessView';
import { HostFinalView } from '../components/HostFinalView';
import { gameService } from '../../services/game/gameService';
import { storage } from '../../shared/utils/storage';
import { supabase } from '../../services/supabase/client';
import { getRoundData, ROUND_TIME_LIMIT, TOTAL_ROUNDS } from '../../shared/data/rounds';
import { FAIRNESS_STEPS_META } from '../../shared/data/fairnessSteps';
import type { 
  DbGameSession, 
  DbPlayer, 
  DbResponse, 
  RoundAggregate,
  FairnessStepNumber,
  FairnessClassroomAggregates,
  FinalStepNumber,
  SessionFinalSummary,
  ReflectionAggregate
} from '../../shared/types';

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
  const [allAggregates, setAllAggregates] = useState<Record<number, RoundAggregate>>({});
  const [timeLeft, setTimeLeft] = useState<number>(ROUND_TIME_LIMIT);
  const [isTimedOut, setIsTimedOut] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isActionInProgress, setIsActionInProgress] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [showEndGameModal, setShowEndGameModal] = useState<boolean>(false);

  const [fairnessAggregates, setFairnessAggregates] = useState<FairnessClassroomAggregates | null>(null);
  const [fairnessReadyCount, setFairnessReadyCount] = useState<number>(0);
  const [fairnessStageResponseCount, setFairnessStageResponseCount] = useState<number>(0);

  const [finalSummary, setFinalSummary] = useState<SessionFinalSummary | null>(null);
  const [reflectionsAggregate, setReflectionsAggregate] = useState<ReflectionAggregate | null>(null);

  const actionLockRef = useRef<boolean>(false);
  const hostSession = storage.getHostSession();
  const hostId = hostSession?.hostId || 'HOST-DEMO';

  // Helper to load fairness responses and aggregate classroom statistics
  const loadFairnessData = useCallback(async (sessionId: string, stepNum: number) => {
    try {
      const aggs = await gameService.getFairnessClassroomAggregates(sessionId);
      setFairnessAggregates(aggs);

      const readyCount = await gameService.getFairnessStageResponseCount(sessionId, 'ready');
      setFairnessReadyCount(readyCount);

      const stepMeta = FAIRNESS_STEPS_META.find((s) => s.stepNumber === stepNum) || FAIRNESS_STEPS_META[0];
      const stageCount = await gameService.getFairnessStageResponseCount(sessionId, stepMeta.stageKey);
      setFairnessStageResponseCount(stageCount);
    } catch (err) {
      console.error('Error loading fairness data in HostGamePage:', err);
    }
  }, []);

  // Helper to load final results summary and reflection aggregates (Case 10)
  const loadFinalData = useCallback(async (sessionId: string) => {
    try {
      const summary = await gameService.getSessionFinalSummary(sessionId);
      setFinalSummary(summary);
      const refAgg = await gameService.getSessionReflectionsAggregate(sessionId);
      setReflectionsAggregate(refAgg);
    } catch (err) {
      console.error('Error loading final data in HostGamePage:', err);
    }
  }, []);

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

      const roundNum = Math.max(1, Math.min(active.current_round || 1, TOTAL_ROUNDS));
      const roundResponses = await gameService.getSessionRoundResponses(active.id, roundNum);
      setResponses(roundResponses);
      setAggregate(computeAggregate(roundNum, roundResponses));

      const allAggs = await gameService.getSessionAllRoundsAggregates(active.id);
      setAllAggregates(allAggs);

      // Load fairness challenge state if active
      if (active.game_stage === 'fairness') {
        await loadFairnessData(active.id, active.fairness_step || 0);
      }

      // Load final results & reflection state if active
      if (active.game_stage === 'final' || active.game_stage === 'completed' || active.status === 'completed') {
        await loadFinalData(active.id);
      }

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
  }, [hostId, navigate, computeAggregate, loadFairnessData, loadFinalData]);

  useEffect(() => {
    loadActiveGame();
  }, [loadActiveGame]);

  const currentRound = Math.max(1, Math.min(session?.current_round || 1, TOTAL_ROUNDS));
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

  // 4. Realtime subscription for fairness challenge responses
  useEffect(() => {
    if (!session?.id) return;

    const channel = supabase
      .channel(`host-game-fairness-${session.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'fairness_responses',
          filter: `session_id=eq.${session.id}`
        },
        async () => {
          const currentFStep = session.fairness_step || 0;
          await loadFairnessData(session.id, currentFStep);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.id, session?.fairness_step, loadFairnessData]);

  // 5. Realtime subscription for student reflection submissions (Case 10)
  useEffect(() => {
    if (!session?.id) return;

    const channel = supabase
      .channel(`host-game-reflections-${session.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reflections',
          filter: `session_id=eq.${session.id}`
        },
        async () => {
          await loadFinalData(session.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.id, loadFinalData]);

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
      const nextRoundNumber = Math.min((session.current_round || 1) + 1, TOTAL_ROUNDS);
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

  // Handler: Start Bias Reveal
  const handleStartReveal = async () => {
    if (!session || actionLockRef.current || isActionInProgress) return;
    actionLockRef.current = true;
    setIsActionInProgress(true);

    try {
      const allAggs = await gameService.getSessionAllRoundsAggregates(session.id);
      setAllAggregates(allAggs);

      const result = await gameService.startBiasReveal(session.id, hostId);
      if (result.success) {
        setSession((prev) => prev ? {
          ...prev,
          game_stage: 'reveal',
          reveal_step: 1,
          results_visible: true
        } : null);
        setActionNotice('EDUCATIONAL BIAS REVEAL INITIATED. Synchronizing with all student devices.');
        setTimeout(() => setActionNotice(null), 4000);
      } else {
        setActionNotice(result.error || 'Failed to start bias reveal.');
        setTimeout(() => setActionNotice(null), 4000);
      }
    } finally {
      setIsActionInProgress(false);
      actionLockRef.current = false;
    }
  };

  // Handler: Step Navigation in Reveal
  const handleSetRevealStep = async (step: number) => {
    if (!session || actionLockRef.current || isActionInProgress) return;
    actionLockRef.current = true;
    setIsActionInProgress(true);

    try {
      const result = await gameService.setRevealStep(session.id, hostId, step);
      if (result.success) {
        setSession((prev) => prev ? { ...prev, reveal_step: step } : null);
        if (step === 2) {
          const freshAggs = await gameService.getSessionAllRoundsAggregates(session.id);
          setAllAggregates(freshAggs);
        }
      } else {
        setActionNotice(result.error || 'Failed to update reveal step.');
        setTimeout(() => setActionNotice(null), 3000);
      }
    } finally {
      setIsActionInProgress(false);
      actionLockRef.current = false;
    }
  };

  // Handler: Transition from Reveal to Fairness Stage
  const handleTransitionToFairness = async () => {
    if (!session || actionLockRef.current || isActionInProgress) return;
    actionLockRef.current = true;
    setIsActionInProgress(true);

    try {
      const result = await gameService.transitionToFairnessStage(session.id, hostId);
      if (result.success) {
        setSession((prev) => prev ? { ...prev, game_stage: 'fairness', fairness_step: 0 } : null);
        await loadFairnessData(session.id, 0);
        setActionNotice('TRANSITIONING TO FAIRNESS CHALLENGE (CASE 9)');
        setTimeout(() => setActionNotice(null), 4000);
      } else {
        setActionNotice(result.error || 'Failed to transition stage.');
        setTimeout(() => setActionNotice(null), 4000);
      }
    } finally {
      setIsActionInProgress(false);
      actionLockRef.current = false;
    }
  };

  // Handler: Step Navigation in Fairness Challenge
  const handleSetFairnessStep = async (step: FairnessStepNumber) => {
    if (!session || actionLockRef.current || isActionInProgress) return;
    actionLockRef.current = true;
    setIsActionInProgress(true);

    try {
      const result = await gameService.setFairnessStep(session.id, hostId, step);
      if (result.success) {
        setSession((prev) => prev ? { ...prev, fairness_step: step } : null);
        await loadFairnessData(session.id, step);
      } else {
        setActionNotice(result.error || 'Failed to update fairness step.');
        setTimeout(() => setActionNotice(null), 3000);
      }
    } finally {
      setIsActionInProgress(false);
      actionLockRef.current = false;
    }
  };

  // Handler: Transition from Fairness to Final Stage (Case 10)
  const handleTransitionToFinalStage = async () => {
    if (!session || actionLockRef.current || isActionInProgress) return;
    actionLockRef.current = true;
    setIsActionInProgress(true);

    try {
      const result = await gameService.transitionToFinalStage(session.id, hostId);
      if (result.success) {
        setSession((prev) => prev ? { ...prev, game_stage: 'final', final_step: 0 } : null);
        await loadFinalData(session.id);
        setActionNotice('TRANSITIONED TO CASE 10: FINAL RESULTS & REFLECTION');
        setTimeout(() => setActionNotice(null), 4000);
      } else {
        setActionNotice(result.error || 'Failed to transition to final stage.');
        setTimeout(() => setActionNotice(null), 4000);
      }
    } finally {
      setIsActionInProgress(false);
      actionLockRef.current = false;
    }
  };

  // Handler: Step Navigation in Final Stage
  const handleSetFinalStep = async (step: FinalStepNumber) => {
    if (!session || actionLockRef.current || isActionInProgress) return;
    actionLockRef.current = true;
    setIsActionInProgress(true);

    try {
      const result = await gameService.setFinalStep(session.id, hostId, step);
      if (result.success) {
        setSession((prev) => prev ? { ...prev, final_step: step } : null);
        await loadFinalData(session.id);
      } else {
        setActionNotice(result.error || 'Failed to update final step.');
        setTimeout(() => setActionNotice(null), 3000);
      }
    } finally {
      setIsActionInProgress(false);
      actionLockRef.current = false;
    }
  };

  // Handler: Complete Game Session (Case 10 Final Step)
  const handleCompleteGameSession = async () => {
    if (!session || actionLockRef.current || isActionInProgress) return;
    actionLockRef.current = true;
    setIsActionInProgress(true);

    try {
      const result = await gameService.completeGameSession(session.id, hostId);
      if (result.success) {
        setSession((prev) => prev ? { ...prev, status: 'completed', game_stage: 'completed' } : null);
        await loadFinalData(session.id);
        setActionNotice('SIMULATION MARKED COMPLETED. Session preserved.');
        setTimeout(() => setActionNotice(null), 4000);
      } else {
        setActionNotice(result.error || 'Failed to complete game session.');
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
            ROUND {currentRound} OF {TOTAL_ROUNDS} &bull; PRESENTER CONTROL CENTER
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

      {session.game_stage === 'reveal' ? (
        /* Bias Reveal Presentation Mode */
        <HostRevealView
          currentStep={session.reveal_step || 1}
          onSetStep={handleSetRevealStep}
          onTransitionToFairness={handleTransitionToFairness}
          allAggregates={allAggregates}
          totalPlayers={totalPlayersCount}
          isActionInProgress={isActionInProgress}
        />
      ) : session.game_stage === 'fairness' ? (
        /* Case 9 Make It Fair Challenge View */
        <HostFairnessView
          currentStep={((session.fairness_step ?? 0) as FairnessStepNumber)}
          onSetStep={handleSetFairnessStep}
          onTransitionToFinal={handleTransitionToFinalStage}
          classroomAggregates={fairnessAggregates || {
            totalParticipants: totalPlayersCount,
            factorsCount: { skills: 0, experience: 0, projects: 0, education: 0, location: 0, name: 0, presentation_style: 0 },
            rulesCount: {
              skills: { HIGH: 0, MEDIUM: 0, LOW: 0, EXCLUDE: 0 },
              experience: { HIGH: 0, MEDIUM: 0, LOW: 0, EXCLUDE: 0 },
              projects: { HIGH: 0, MEDIUM: 0, LOW: 0, EXCLUDE: 0 },
              education: { HIGH: 0, MEDIUM: 0, LOW: 0, EXCLUDE: 0 },
              location: { HIGH: 0, MEDIUM: 0, LOW: 0, EXCLUDE: 0 },
              name: { HIGH: 0, MEDIUM: 0, LOW: 0, EXCLUDE: 0 },
              presentation_style: { HIGH: 0, MEDIUM: 0, LOW: 0, EXCLUDE: 0 }
            },
            applyDecisions: { candidateA: 0, candidateB: 0 },
            fairnessTestAnswers: { YES: 0, NO: 0, DEPENDS: 0 },
            consistencyTestAnswers: { YES: 0, NO: 0, DEPENDS: 0 },
            transparencyTestAnswers: { YES: 0, NO: 0 },
            humanOversightAnswers: { YES: 0, NO: 0 }
          }}
          totalPlayers={totalPlayersCount}
          readyPlayersCount={fairnessReadyCount}
          stageResponseCount={fairnessStageResponseCount}
          isActionInProgress={isActionInProgress}
        />
      ) : (session.game_stage === 'final' || session.game_stage === 'completed' || session.status === 'completed') ? (
        /* Case 10 Final Results + Reflection View */
        <HostFinalView
          currentStep={((session.final_step ?? 0) as FinalStepNumber)}
          onSetStep={handleSetFinalStep}
          summary={finalSummary}
          reflectionsAggregate={reflectionsAggregate}
          isCompleted={session.status === 'completed' || session.game_stage === 'completed'}
          onCompleteGame={handleCompleteGameSession}
          isActionInProgress={isActionInProgress}
        />
      ) : (
        /* Active Simulation Rounds View (Rounds 1 to 7) */
        <>
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
                  {currentRound >= TOTAL_ROUNDS
                    ? `All ${TOTAL_ROUNDS} rounds completed! Click START BIAS REVEAL to transition the classroom into the educational explanation.`
                    : 'Control the classroom presentation flow. Click SHOW RESULTS to broadcast collective results to students, then click NEXT ROUND when ready.'}
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
                    Round {currentRound} of {TOTAL_ROUNDS} &bull; {resultsVisible ? 'Results Revealed to Classroom' : 'Results Concealed'}
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

                  {/* Button: Next Round OR Start Bias Reveal */}
                  {currentRound >= TOTAL_ROUNDS ? (
                    <Button
                      variant="primary"
                      size="normal"
                      icon={<Sparkles size={16} />}
                      onClick={handleStartReveal}
                      disabled={isActionInProgress}
                      id="btn-host-start-reveal"
                      style={{
                        minHeight: '44px',
                        background: 'linear-gradient(135deg, #7c3aed, #0284c7)',
                        boxShadow: '0 4px 14px rgba(124, 58, 237, 0.25)'
                      }}
                    >
                      {isActionInProgress ? 'STARTING REVEAL...' : 'START BIAS REVEAL'}
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant={resultsVisible ? 'primary' : 'secondary'}
                        size="normal"
                        icon={<SkipForward size={16} />}
                        onClick={handleNextRound}
                        disabled={isActionInProgress}
                        id="btn-host-next-round"
                        style={{ minHeight: '44px' }}
                      >
                        {isActionInProgress 
                          ? 'ADVANCING...' 
                          : `NEXT ROUND (${currentRound + 1} / ${TOTAL_ROUNDS})`}
                      </Button>

                      <Button
                        variant="purple"
                        size="normal"
                        icon={<Sparkles size={16} />}
                        onClick={handleStartReveal}
                        disabled={isActionInProgress}
                        id="btn-host-jump-reveal"
                        style={{ minHeight: '44px' }}
                        title="Jump directly to Case 8 Bias Reveal without completing remaining rounds"
                      >
                        JUMP TO BIAS REVEAL
                      </Button>
                    </>
                  )}

                  {/* Button: End Game with Confirmation Modal */}
                  <Button
                    variant="danger"
                    size="normal"
                    icon={<StopCircle size={16} />}
                    onClick={() => setShowEndGameModal(true)}
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
        </>
      )}

      {/* Confirmation Modal for Accidental End Game Prevention */}
      {showEndGameModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            maxWidth: '460px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            textAlign: 'center'
          }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--color-danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto'
            }}>
              <AlertTriangle size={28} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                END SIMULATION EARLY?
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: '0.5rem 0 0 0', lineHeight: 1.5 }}>
                Are you sure you want to end this active session early? All active candidate rounds will be closed and student screens will lock.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <Button
                variant="secondary"
                size="normal"
                onClick={() => setShowEndGameModal(false)}
                disabled={isActionInProgress}
              >
                CANCEL
              </Button>
              <Button
                variant="danger"
                size="normal"
                icon={<StopCircle size={16} />}
                onClick={() => {
                  setShowEndGameModal(false);
                  handleEndGame();
                }}
                disabled={isActionInProgress}
                id="btn-confirm-end-simulation"
              >
                {isActionInProgress ? 'ENDING...' : 'CONFIRM END GAME'}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
