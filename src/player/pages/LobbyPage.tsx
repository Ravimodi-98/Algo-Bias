import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, LogOut, AlertCircle, RefreshCw, Users, ShieldCheck, Wifi, WifiOff } from 'lucide-react';
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
  const [playerCount, setPlayerCount] = useState<number>(1);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'reconnecting' | 'disconnected'>('connected');

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
        setConnectionStatus('disconnected');
        return;
      }

      // Check current game status in case game already started
      const game = await gameService.getSessionById(activeSession.sessionId);
      if (game) {
        if (game.status === 'active') {
          navigate('/play');
          return;
        }
        setGameState(game.status);
      }

      // Fetch initial player count
      const existingPlayers = await gameService.getSessionPlayers(activeSession.sessionId);
      setPlayerCount(existingPlayers.length > 0 ? existingPlayers.length : 1);
      setConnectionStatus('connected');
    }

    setIsVerifying(false);
  }, [navigate]);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  // Periodic heartbeat to maintain connection presence
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

  // Supabase Realtime Subscriptions for:
  // 1. Host game state changes (waiting -> active -> transition to /play)
  // 2. Realtime player joins (updating aggregate player counter)
  useEffect(() => {
    if (!session?.sessionId) return;

    // Game state channel
    const gameChannel = supabase
      .channel(`player-game-${session.sessionId}`)
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
            if (updatedGame.status === 'active') {
              navigate('/play');
            }
          }
        }
      )
      .subscribe();

    // Player joins channel
    const playerChannel = supabase
      .channel(`player-lobby-roster-${session.sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'players',
          filter: `session_id=eq.${session.sessionId}`
        },
        () => {
          setPlayerCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(gameChannel);
      supabase.removeChannel(playerChannel);
    };
  }, [session?.sessionId, navigate]);

  const handleLeave = () => {
    storage.clearPlayerSession();
    navigate('/join');
  };

  if (isVerifying) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Verifying simulator connection...</p>
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
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Network Status Pill */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Badge variant={connectionStatus === 'connected' ? 'cyan' : 'warning'}>
          {connectionStatus === 'connected' ? (
            <>
              <Wifi size={12} style={{ marginRight: '4px' }} />
              ONLINE &bull; {gameState.toUpperCase()}
            </>
          ) : (
            <>
              <WifiOff size={12} style={{ marginRight: '4px' }} />
              RECONNECTING...
            </>
          )}
        </Badge>

        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Session ID: {session.playerId.slice(0, 8)}...
        </span>
      </div>

      {/* Main Waiting Header */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
        <Badge variant="purple">
          THE DECISION
        </Badge>

        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: 900,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          margin: '0.25rem 0 0 0'
        }}>
          YOU'RE IN
        </h1>

        <div className="font-mono text-cyan" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.05em' }}>
          {session.anonymousName}
        </div>

        <p style={{
          fontSize: '0.92rem',
          color: 'var(--text-secondary)',
          margin: 0
        }}>
          Waiting for the host to start the game...
        </p>
      </div>

      {/* Waiting Card */}
      <Card glow="purple">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', alignItems: 'center', textAlign: 'center' }}>
          
          {/* Animated Radar Pulse */}
          <div style={{
            position: 'relative',
            width: '84px',
            height: '84px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '0.25rem'
          }}>
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'rgba(124, 58, 237, 0.1)',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              animation: 'lobby-pulse 2.5s infinite ease-out'
            }} />
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '2px solid var(--accent-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-purple)',
              boxShadow: '0 4px 16px rgba(124, 58, 237, 0.25)',
              zIndex: 2
            }}>
              <Clock size={24} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 700 }}>
              Stand by at your console
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '380px' }}>
              Keep this screen open. When the presenter initiates Round 1 on the main display, your device will advance automatically.
            </p>
          </div>

          {/* Session Details Grid */}
          <div style={{
            width: '100%',
            background: 'var(--bg-surface-secondary)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>
                GAME CODE
              </span>
              <span className="font-mono text-cyan" style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '0.08em' }}>
                {session.gameCode}
              </span>
            </div>

            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>
                YOUR CALLSIGN
              </span>
              <span className="font-mono" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {session.anonymousName}
              </span>
            </div>
          </div>

          {/* Live Player Counter */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.55rem 1.15rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(2, 132, 199, 0.08)',
            border: '1px solid rgba(2, 132, 199, 0.25)',
            color: 'var(--accent-cyan)',
            fontSize: '0.88rem',
            fontWeight: 700
          }}>
            <Users size={16} />
            <span>{playerCount} {playerCount === 1 ? 'player' : 'players'} joined</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={14} color="var(--color-success)" />
            <span>Anonymous session active. No personal information stored.</span>
          </div>
        </div>
      </Card>

      {/* Leave Game Action */}
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
            fontWeight: 600,
            cursor: 'pointer',
            padding: '0.5rem',
            transition: 'color var(--transition-fast)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-danger)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          aria-label="Leave Game"
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
