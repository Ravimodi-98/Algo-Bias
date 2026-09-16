import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Tv, 
  Users, 
  Layers, 
  ArrowLeft, 
  StopCircle, 
  CheckCircle2, 
  SkipForward, 
  RefreshCw,
  ShieldCheck,
  Target,
  Sparkles,
  CheckCheck
} from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { LoadingState } from '../../shared/components/LoadingState';
import { gameService } from '../../services/game/gameService';
import { storage } from '../../shared/utils/storage';
import { supabase } from '../../services/supabase/client';
import { getRoundData } from '../../shared/data/rounds';
import type { DbGameSession, DbPlayer, DbResponse } from '../../shared/types';

export const HostGamePage: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<DbGameSession | null>(null);
  const [players, setPlayers] = useState<DbPlayer[]>([]);
  const [responses, setResponses] = useState<DbResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdvancing, setIsAdvancing] = useState<boolean>(false);
  const [isEnding, setIsEnding] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const hostSession = storage.getHostSession();
  const hostId = hostSession?.hostId || 'HOST-DEMO';

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
    } finally {
      setIsLoading(false);
    }
  }, [hostId, navigate]);

  useEffect(() => {
    loadActiveGame();
  }, [loadActiveGame]);

  const currentRound = Math.max(1, Math.min(session?.current_round || 1, 7));

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
              return [...prev, newResp];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.id, currentRound]);

  const handleNextRound = async () => {
    if (!session) return;
    const nextRoundNumber = Math.min((session.current_round || 1) + 1, 7);
    setIsAdvancing(true);

    const result = await gameService.updateGameState(
      session.id, 
      hostId, 
      'active', 
      nextRoundNumber
    );

    setIsAdvancing(false);

    if (result.success) {
      setSession((prev) => prev ? { ...prev, current_round: nextRoundNumber } : null);
      // Fetch responses for the new round
      const newRoundResponses = await gameService.getSessionRoundResponses(session.id, nextRoundNumber);
      setResponses(newRoundResponses);

      setActionNotice(`ROUND ADVANCED TO ROUND ${nextRoundNumber}. All student screens updated.`);
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  const handleEndGame = async () => {
    if (!session) return;
    setIsEnding(true);
    await gameService.closeGameSession(session.id, hostId);
    setIsEnding(false);
    navigate('/host/dashboard');
  };

  if (isLoading) {
    return <LoadingState message="Connecting to Live Round Controller..." />;
  }

  if (!session) return null;

  const roundData = getRoundData(currentRound);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Top Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1.25rem 1.5rem',
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-purple)',
        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Badge variant="success" pulse>
            <Play size={12} style={{ marginRight: '4px' }} />
            SIMULATION ACTIVE
          </Badge>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
            ROUND {currentRound} OF 7 &bull; PRESENTER CONSOLE
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button
            variant="secondary"
            size="small"
            icon={<Tv size={14} />}
            onClick={() => navigate('/host/lobby')}
          >
            Lobby & QR
          </Button>
          <Button
            variant="ghost"
            size="small"
            icon={<ArrowLeft size={14} />}
            onClick={() => navigate('/host/dashboard')}
          >
            Dashboard
          </Button>
          <Button
            variant="ghost"
            size="small"
            icon={<RefreshCw size={14} />}
            onClick={loadActiveGame}
            title="Refresh"
          />
        </div>
      </div>

      {actionNotice && (
        <div style={{
          background: 'rgba(2, 132, 199, 0.08)',
          border: '1px solid var(--accent-cyan)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: 'var(--accent-cyan)',
          fontSize: '0.9rem',
          fontWeight: 700
        }}>
          <CheckCircle2 size={18} />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Grid: Round Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem'
      }}>
        <Card glow="cyan">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>ROOM CODE</span>
            <Tv size={16} color="var(--accent-cyan)" />
          </div>
          <span className="font-mono text-cyan" style={{ fontSize: '2rem', fontWeight: 900 }}>
            {session.game_code}
          </span>
        </Card>

        <Card glow="purple">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>CONNECTED PARTICIPANTS</span>
            <Users size={16} color="var(--accent-purple)" />
          </div>
          <span className="font-mono" style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            {players.length}
          </span>
        </Card>

        <Card glow="purple">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>RESPONSES LOGGED</span>
            <CheckCheck size={16} color="var(--color-success)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
            <span className="font-mono" style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-success)' }}>
              {responses.length}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              / {players.length}
            </span>
          </div>
        </Card>

        <Card glow="purple">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>ACTIVE ROUND</span>
            <Layers size={16} color="var(--color-warning)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
            <span className="font-mono" style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-warning)' }}>
              {currentRound}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>/ 7</span>
          </div>
        </Card>
      </div>

      {/* Active Round Scenario Information for Presenter */}
      <Card glow="cyan">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', padding: '0.25rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={16} color="var(--accent-cyan)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-cyan)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              ROUND {currentRound}: {roundData.title}
            </span>
          </div>

          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Target Role: {roundData.role}
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0', lineHeight: 1.45 }}>
              {roundData.context}
            </p>
          </div>

          <div style={{
            background: 'var(--bg-surface-secondary)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem'
          }}>
            <Sparkles size={15} color="var(--accent-purple)" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              <strong style={{ color: 'var(--text-primary)' }}>Educational Focus:</strong> {roundData.educationalPurpose}
            </div>
          </div>
        </div>
      </Card>

      {/* Host Round Controls Card */}
      <Card glow="purple">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.5rem 0' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Badge variant="purple">PRESENTER ROUND CONTROL</Badge>
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Round Progression Controller
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
              Advancing the round updates the authoritative game session in Supabase. Connected student devices will automatically receive the update, start a fresh 30s countdown, and load the next scenario.
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
            gap: '1rem'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>
                GLOBAL GAME STATE
              </span>
              <span className="font-mono text-cyan" style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                Active Round: {currentRound} / 7 &bull; {responses.length} / {players.length} submitted
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Button
                variant="primary"
                size="normal"
                icon={<SkipForward size={16} />}
                onClick={handleNextRound}
                disabled={isAdvancing || currentRound >= 7}
                id="btn-host-next-round"
              >
                {isAdvancing 
                  ? 'ADVANCING...' 
                  : currentRound >= 7 
                    ? 'FINAL ROUND REACHED' 
                    : `ADVANCE TO ROUND ${currentRound + 1}`}
              </Button>

              <Button
                variant="danger"
                size="normal"
                icon={<StopCircle size={16} />}
                onClick={handleEndGame}
                disabled={isEnding}
                id="btn-host-end-game"
              >
                {isEnding ? 'ENDING...' : 'END SIMULATION'}
              </Button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <ShieldCheck size={14} color="var(--color-success)" />
            <span>Authorized Host ({hostId}). Realtime distribution to {players.length} participants.</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
