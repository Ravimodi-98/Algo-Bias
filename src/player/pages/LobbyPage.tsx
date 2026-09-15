import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, Clock, LogOut, AlertCircle, RefreshCw } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { storage } from '../../shared/utils/storage';
import { gameService } from '../../services/game/gameService';
import { supabase } from '../../services/supabase/client';
import type { PlayerSession } from '../../shared/types';

export const LobbyPage: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<PlayerSession | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [reconnectError, setReconnectError] = useState<string | null>(null);
  const [gameState, setGameState] = useState<string>('waiting');

  const verifySession = useCallback(async () => {
    const activeSession = storage.getPlayerSession();
    if (!activeSession) {
      navigate('/join');
      return;
    }

    setSession(activeSession);
    setIsVerifying(true);
    setReconnectError(null);

    // Verify player and session validity in Supabase
    if (activeSession.sessionId && activeSession.playerId) {
      const verified = await gameService.verifyPlayer(activeSession.playerId, activeSession.sessionId);
      if (!verified) {
        setReconnectError('Session interrupted or game room closed. Please re-enter.');
        setIsVerifying(false);
        return;
      }
    }

    setIsVerifying(false);
  }, [navigate]);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  // Periodic heartbeat to maintain connection presence
  useEffect(() => {
    if (!session?.playerId || !session?.sessionId) return;

    const interval = setInterval(() => {
      gameService.verifyPlayer(session.playerId, session.sessionId);
    }, 25000);

    return () => clearInterval(interval);
  }, [session?.playerId, session?.sessionId]);

  // Supabase Realtime Subscription for host game state changes
  useEffect(() => {
    if (!session?.sessionId) return;

    const channel = supabase
      .channel(`player-lobby-${session.sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_sessions',
          filter: `id=eq.${session.sessionId}`
        },
        (payload) => {
          const updatedGame = payload.new as { status: string; current_round: number };
          if (updatedGame?.status) {
            setGameState(updatedGame.status);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.sessionId]);

  const handleLeave = () => {
    storage.clearPlayerSession();
    navigate('/join');
  };

  if (isVerifying) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Verifying player connection...</p>
      </div>
    );
  }

  if (reconnectError) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
        <Card glow="purple">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
            <AlertCircle size={36} color="var(--color-warning)" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              CONNECTION NOTICE
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {reconnectError}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', width: '100%' }}>
              <Button variant="secondary" block onClick={verifySession} icon={<RefreshCw size={16} />}>
                RETRY
              </Button>
              <Button variant="primary" block onClick={handleLeave}>
                JOIN NEW GAME
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Badge variant={gameState === 'active' ? 'success' : 'purple'} pulse>
          <Radio size={12} style={{ marginRight: '4px' }} />
          {gameState === 'active' ? 'GAME STARTING...' : 'CONNECTED TO SIMULATOR'}
        </Badge>
        
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          marginTop: '0.25rem'
        }}>
          WAITING FOR HOST
        </h1>

        <p style={{
          fontSize: '1.1rem',
          fontWeight: 600,
          color: 'var(--accent-cyan)'
        }}>
          You're in.
        </p>
      </div>

      <Card glow="purple">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center', textAlign: 'center' }}>
          {/* Animated Radar Pulse */}
          <div style={{
            position: 'relative',
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'rgba(139, 92, 246, 0.15)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              animation: 'lobby-pulse 2.5s infinite ease-out'
            }} />
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--bg-surface-secondary)',
              border: '1px solid var(--accent-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-purple)',
              boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)',
              zIndex: 2
            }}>
              <Clock size={22} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <p style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 500 }}>
              Waiting for the host to start the game...
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Keep this screen open. When the host initiates Round 1 on the main display, your screen will advance automatically.
            </p>
          </div>

          {/* Session Identification Info */}
          <div style={{
            width: '100%',
            background: 'var(--bg-surface-secondary)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            border: '1px solid var(--border-subtle)',
            marginTop: '0.5rem'
          }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
                ROOM CODE
              </span>
              <span className="font-mono text-cyan" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                {session.gameCode}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
                YOUR CALLSIGN
              </span>
              <span className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {session.anonymousName}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={handleLeave}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.82rem',
            cursor: 'pointer',
            padding: '0.5rem',
            transition: 'color var(--transition-fast)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-danger)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <LogOut size={14} /> Leave Game
        </button>
      </div>

      <style>{`
        @keyframes lobby-pulse {
          0% { transform: scale(0.85); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
