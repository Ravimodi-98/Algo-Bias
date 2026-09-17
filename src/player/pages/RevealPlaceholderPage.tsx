import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { LoadingState } from '../../shared/components/LoadingState';
import { PlayerRevealView } from '../components/PlayerRevealView';
import { storage } from '../../shared/utils/storage';
import { gameService } from '../../services/game/gameService';
import { supabase } from '../../services/supabase/client';
import type { DbGameSession, RoundAggregate } from '../../shared/types';

export const RevealPlaceholderPage: React.FC = () => {
  const navigate = useNavigate();
  const [gameSession, setGameSession] = useState<DbGameSession | null>(null);
  const [standaloneStep, setStandaloneStep] = useState<number>(1);
  const [allAggregates, setAllAggregates] = useState<Record<number, RoundAggregate>>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Realistic sample aggregates from candidate rounds for standalone exploration
  const defaultAggregates: Record<number, RoundAggregate> = {
    1: { roundNumber: 1, totalResponses: 24, candidateA: { count: 21, percentage: 88 }, candidateB: { count: 3, percentage: 12 } },
    2: { roundNumber: 2, totalResponses: 24, candidateA: { count: 18, percentage: 75 }, candidateB: { count: 6, percentage: 25 } },
    3: { roundNumber: 3, totalResponses: 24, candidateA: { count: 17, percentage: 71 }, candidateB: { count: 7, percentage: 29 } },
    4: { roundNumber: 4, totalResponses: 24, candidateA: { count: 16, percentage: 67 }, candidateB: { count: 8, percentage: 33 } },
    5: { roundNumber: 5, totalResponses: 24, candidateA: { count: 19, percentage: 79 }, candidateB: { count: 5, percentage: 21 } },
    6: { roundNumber: 6, totalResponses: 24, candidateA: { count: 15, percentage: 62 }, candidateB: { count: 9, percentage: 38 } },
    7: { roundNumber: 7, totalResponses: 24, candidateA: { count: 17, percentage: 71 }, candidateB: { count: 7, percentage: 29 } },
  };

  const playerSession = storage.getPlayerSession();

  const loadSession = useCallback(async () => {
    if (!playerSession?.sessionId) {
      setAllAggregates(defaultAggregates);
      setLoading(false);
      return;
    }
    try {
      const session = await gameService.getSessionById(playerSession.sessionId);
      setGameSession(session);

      if (session) {
        const aggs = await gameService.getSessionAllRoundsAggregates(session.id);
        const hasVotes = Object.values(aggs).some((a) => a.totalResponses > 0);
        setAllAggregates(hasVotes ? aggs : defaultAggregates);
      } else {
        setAllAggregates(defaultAggregates);
      }
    } catch {
      setAllAggregates(defaultAggregates);
    } finally {
      setLoading(false);
    }
  }, [playerSession?.sessionId]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // Realtime subscription for reveal step progression
  useEffect(() => {
    if (!playerSession?.sessionId) return;

    const channel = supabase
      .channel(`player-reveal-session-${playerSession.sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_sessions',
          filter: `id=eq.${playerSession.sessionId}`
        },
        (payload) => {
          const updated = payload.new as DbGameSession;
          if (updated) {
            setGameSession(updated);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [playerSession?.sessionId]);

  if (loading) {
    return <LoadingState message="Connecting to Educational Bias Reveal..." />;
  }

  const isLiveSynchronized = Boolean(gameSession && gameSession.game_stage === 'reveal');
  const activeStep = isLiveSynchronized ? (gameSession?.reveal_step || 1) : standaloneStep;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Educational Header Banner */}
      <div style={{
        background: '#ffffff',
        padding: '0.85rem 1rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Badge variant="purple" pulse={isLiveSynchronized}>
            <Sparkles size={11} style={{ marginRight: '4px' }} />
            {isLiveSynchronized ? 'LIVE CLASSROOM REVEAL' : 'CASE 8: BIAS REVEAL'}
          </Badge>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {isLiveSynchronized 
              ? 'Synchronized with presenter' 
              : 'Interactive 9-Step Educational Sequence'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Button
            variant="secondary"
            size="small"
            icon={<ArrowLeft size={13} />}
            onClick={() => navigate('/')}
          >
            HOME
          </Button>
          {playerSession && (
            <Button
              variant="primary"
              size="small"
              onClick={() => navigate('/play')}
            >
              GAMEPLAY
            </Button>
          )}
        </div>
      </div>

      {/* Main 9-Step Player Presentation View */}
      <PlayerRevealView
        currentStep={activeStep}
        allAggregates={allAggregates}
      />

      {/* Interactive Step Navigation Bar for Standalone / Exploration Mode */}
      {!isLiveSynchronized && (
        <Card style={{ padding: '0.85rem 1rem', background: '#ffffff' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <Button
              variant="secondary"
              size="small"
              icon={<ArrowLeft size={14} />}
              onClick={() => setStandaloneStep((s) => Math.max(1, s - 1))}
              disabled={standaloneStep <= 1}
              id="btn-reveal-prev-standalone"
            >
              PREV STEP
            </Button>

            <span className="font-mono text-purple" style={{ fontSize: '0.85rem', fontWeight: 800 }}>
              STEP {standaloneStep} OF 9
            </span>

            <Button
              variant="primary"
              size="small"
              icon={<ArrowRight size={14} />}
              onClick={() => setStandaloneStep((s) => Math.min(9, s + 1))}
              disabled={standaloneStep >= 9}
              id="btn-reveal-next-standalone"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #0284c7)' }}
            >
              NEXT STEP
            </Button>
          </div>
        </Card>
      )}

    </div>
  );
};
