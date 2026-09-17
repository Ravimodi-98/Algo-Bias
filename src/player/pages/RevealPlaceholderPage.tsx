import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio } from 'lucide-react';
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
  const [allAggregates, setAllAggregates] = useState<Record<number, RoundAggregate>>({});
  const [loading, setLoading] = useState<boolean>(true);

  const playerSession = storage.getPlayerSession();

  const loadSession = useCallback(async () => {
    if (!playerSession?.sessionId) {
      setLoading(false);
      return;
    }
    try {
      const session = await gameService.getSessionById(playerSession.sessionId);
      setGameSession(session);

      if (session) {
        const aggs = await gameService.getSessionAllRoundsAggregates(session.id);
        setAllAggregates(aggs);
      }
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
    return <LoadingState message="Connecting to Classroom Reveal..." />;
  }

  if (!playerSession || !gameSession) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
        <Card glow="purple">
          <Badge variant="purple">SESSION NOT FOUND</Badge>
          <p style={{ margin: '1rem 0', color: 'var(--text-secondary)' }}>
            Please join a game session to view the educational reveal.
          </p>
          <Button variant="primary" onClick={() => navigate('/join')}>
            JOIN A GAME
          </Button>
        </Card>
      </div>
    );
  }

  if (gameSession.game_stage !== 'reveal') {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
        <Card glow="purple">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
            <Radio size={36} color="var(--accent-purple)" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              STAND BY FOR REVEAL
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '360px', margin: 0 }}>
              The presenter has not initiated the Educational Bias Reveal yet. Please return to gameplay or wait for the host.
            </p>
            <Button variant="primary" onClick={() => navigate('/play')}>
              RETURN TO GAMEPLAY
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <PlayerRevealView
      currentStep={gameSession.reveal_step || 1}
      allAggregates={allAggregates}
    />
  );
};
