import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Radio } from 'lucide-react';
import { HostRevealView } from '../components/HostRevealView';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { LoadingState } from '../../shared/components/LoadingState';
import { gameService } from '../../services/game/gameService';
import { storage } from '../../shared/utils/storage';
import { supabase } from '../../services/supabase/client';
import type { DbGameSession, RoundAggregate } from '../../shared/types';

export const HostRevealPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSession, setActiveSession] = useState<DbGameSession | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [allAggregates, setAllAggregates] = useState<Record<number, RoundAggregate>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const hostSession = storage.getHostSession();
  const hostId = hostSession?.hostId || 'HOST-DEMO';

  // Realistic sample aggregates for demonstration/preview when no live votes exist
  const sampleAggregates: Record<number, RoundAggregate> = {
    1: { roundNumber: 1, totalResponses: 24, candidateA: { count: 21, percentage: 88 }, candidateB: { count: 3, percentage: 12 } },
    2: { roundNumber: 2, totalResponses: 24, candidateA: { count: 18, percentage: 75 }, candidateB: { count: 6, percentage: 25 } },
    3: { roundNumber: 3, totalResponses: 24, candidateA: { count: 17, percentage: 71 }, candidateB: { count: 7, percentage: 29 } },
    4: { roundNumber: 4, totalResponses: 24, candidateA: { count: 16, percentage: 67 }, candidateB: { count: 8, percentage: 33 } },
    5: { roundNumber: 5, totalResponses: 24, candidateA: { count: 19, percentage: 79 }, candidateB: { count: 5, percentage: 21 } },
    6: { roundNumber: 6, totalResponses: 24, candidateA: { count: 15, percentage: 62 }, candidateB: { count: 9, percentage: 38 } },
    7: { roundNumber: 7, totalResponses: 24, candidateA: { count: 17, percentage: 71 }, candidateB: { count: 7, percentage: 29 } },
  };

  const loadSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const session = await gameService.getActiveHostSession(hostId);
      if (session) {
        setActiveSession(session);
        setCurrentStep(session.reveal_step && session.reveal_step > 0 ? session.reveal_step : 1);

        // Fetch actual round aggregates if available
        try {
          const aggregates = await gameService.getSessionAllRoundsAggregates(session.id);
          const hasResponses = Object.values(aggregates).some(a => a.totalResponses > 0);
          setAllAggregates(hasResponses ? aggregates : sampleAggregates);
        } catch {
          setAllAggregates(sampleAggregates);
        }
      } else {
        setAllAggregates(sampleAggregates);
      }
    } finally {
      setIsLoading(false);
    }
  }, [hostId]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // Supabase Realtime subscription for session changes
  useEffect(() => {
    if (!activeSession?.id) return;

    const channel = supabase
      .channel(`host_reveal_${activeSession.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_sessions',
          filter: `id=eq.${activeSession.id}`
        },
        (payload) => {
          const updated = payload.new as DbGameSession;
          if (updated) {
            setActiveSession(updated);
            if (updated.reveal_step) {
              setCurrentStep(updated.reveal_step);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeSession?.id]);

  const handleSetStep = async (step: number) => {
    setCurrentStep(step);
    if (activeSession) {
      setIsSyncing(true);
      try {
        await gameService.setRevealStep(activeSession.id, hostId, step);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const handleStartLiveBroadcast = async () => {
    if (activeSession) {
      setIsSyncing(true);
      try {
        await gameService.startBiasReveal(activeSession.id, hostId);
        setCurrentStep(1);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const handleTransitionToFairness = async () => {
    if (activeSession) {
      setIsSyncing(true);
      try {
        await gameService.transitionToFairnessStage(activeSession.id, hostId);
        navigate('/host/game');
      } finally {
        setIsSyncing(false);
      }
    } else {
      navigate('/host/game');
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading Presenter Bias Reveal Console..." />;
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Presenter Status Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '0.85rem 1.25rem',
        background: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 1px 4px rgba(15, 23, 42, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Badge variant="purple" pulse={!!activeSession}>
            <Sparkles size={12} style={{ marginRight: '4px' }} />
            CASE 8: BIAS REVEAL CONSOLE
          </Badge>
          {activeSession ? (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Live Room: <strong className="font-mono text-cyan">{activeSession.game_code}</strong>
              {activeSession.game_stage === 'reveal' ? (
                <span className="text-purple" style={{ marginLeft: '8px', fontWeight: 700 }}>&bull; BROADCASTING TO CLASS</span>
              ) : (
                <span style={{ marginLeft: '8px', color: 'var(--color-warning)' }}>&bull; STANDBY MODE</span>
              )}
            </span>
          ) : (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Interactive Presenter Preview Mode &bull; Step through 9 Educational Slides
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {activeSession && activeSession.game_stage !== 'reveal' && (
            <Button
              variant="primary"
              size="small"
              icon={<Radio size={14} />}
              onClick={handleStartLiveBroadcast}
              disabled={isSyncing}
              style={{ background: 'linear-gradient(135deg, #7c3aed, #0284c7)' }}
            >
              {isSyncing ? 'STARTING...' : 'BROADCAST TO STUDENTS'}
            </Button>
          )}

          <Button
            variant="secondary"
            size="small"
            icon={<ArrowLeft size={14} />}
            onClick={() => navigate('/host/game')}
          >
            RETURN TO GAME
          </Button>
        </div>
      </div>

      {/* Main 9-Step Projector View */}
      <HostRevealView
        currentStep={currentStep}
        onSetStep={handleSetStep}
        onTransitionToFairness={handleTransitionToFairness}
        allAggregates={allAggregates}
      />

    </div>
  );
};
