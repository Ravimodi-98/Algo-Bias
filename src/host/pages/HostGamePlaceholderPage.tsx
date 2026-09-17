import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Tv, Users, Layers, ArrowLeft, StopCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { LoadingState } from '../../shared/components/LoadingState';
import { gameService } from '../../services/game/gameService';
import { storage } from '../../shared/utils/storage';
import type { DbGameSession, DbPlayer } from '../../shared/types';
import { TOTAL_ROUNDS } from '../../shared/data/rounds';

export const HostGamePlaceholderPage: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<DbGameSession | null>(null);
  const [players, setPlayers] = useState<DbPlayer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEnding, setIsEnding] = useState<boolean>(false);

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
    } finally {
      setIsLoading(false);
    }
  }, [hostId, navigate]);

  useEffect(() => {
    loadActiveGame();
  }, [loadActiveGame]);

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
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-purple)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Badge variant="success" pulse>
            <Play size={12} style={{ marginRight: '4px' }} />
            LIVE SIMULATION ACTIVE
          </Badge>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            ROUND {session.current_round || 1} IN PROGRESS
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
        </div>
      </div>

      {/* Grid: Round Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
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
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>CONNECTED PLAYERS</span>
            <Users size={16} color="var(--accent-purple)" />
          </div>
          <span className="font-mono" style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            {players.length}
          </span>
        </Card>

        <Card glow="purple">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>SIMULATION ROUND</span>
            <Layers size={16} color="var(--color-warning)" />
          </div>
          <span className="font-mono" style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-warning)' }}>
            {session.current_round || 1} / {TOTAL_ROUNDS}
          </span>
        </Card>
      </div>

      {/* Main Status Information Card */}
      <Card glow="purple">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.5rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-success)'
            }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Game Started Successfully
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                State synchronized in Supabase: <code className="font-mono text-cyan">status = 'active'</code>, <code className="font-mono text-cyan">current_round = 1</code>.
              </p>
            </div>
          </div>

          <div style={{
            background: 'var(--bg-surface-secondary)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6
          }}>
            <p style={{ margin: '0 0 0.75rem 0' }}>
              All connected student devices have automatically received the Realtime status update and transitioned away from the waiting lobby to their decision console.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-purple)', fontWeight: 600 }}>
              <Sparkles size={16} />
              <span>Case 4 will implement the candidate decision cards, voting timer, and live response aggregation.</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button
              variant="danger"
              size="normal"
              icon={<StopCircle size={16} />}
              onClick={handleEndGame}
              disabled={isEnding}
            >
              {isEnding ? 'ENDING GAME...' : 'END GAME'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
