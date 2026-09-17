import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Users, 
  Copy, 
  Check, 
  Play, 
  Tv, 
  RefreshCw, 
  AlertCircle, 
  Maximize, 
  Minimize,
  Radio,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { LoadingState } from '../../shared/components/LoadingState';
import { gameService } from '../../services/game/gameService';
import { storage } from '../../shared/utils/storage';
import { supabase } from '../../services/supabase/client';
import type { DbGameSession, DbPlayer } from '../../shared/types';

export const HostLobbyPage: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<DbGameSession | null>(null);
  const [players, setPlayers] = useState<DbPlayer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const hostSession = storage.getHostSession();
  const hostId = hostSession?.hostId || 'HOST-DEMO';

  // Load host active session
  const loadSession = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const activeGame = await gameService.getActiveHostSession(hostId);
      if (!activeGame) {
        // If host has no active game, redirect to dashboard to create one
        navigate('/host/dashboard');
        return;
      }

      setSession(activeGame);
      const playerList = await gameService.getSessionPlayers(activeGame.id);
      setPlayers(playerList);
    } catch {
      setErrorMessage('Failed to connect to game session.');
    } finally {
      setIsLoading(false);
    }
  }, [hostId, navigate]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // Supabase Realtime Subscription for new players joining
  useEffect(() => {
    if (!session?.id) return;

    const channel = supabase
      .channel(`host-lobby-players-${session.id}`)
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

  const joinUrl = session ? `${window.location.origin}/join?game=${session.game_code}` : '';

  const handleCopyCode = () => {
    if (!session?.game_code) return;
    navigator.clipboard.writeText(session.game_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    if (!joinUrl) return;
    navigator.clipboard.writeText(joinUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleStartGame = async () => {
    if (!session) return;
    setIsStarting(true);
    setErrorMessage(null);

    // Host authorization verification and state update
    const result = await gameService.updateGameState(session.id, hostId, 'active', 1);

    setIsStarting(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Failed to start game session.');
      return;
    }

    // Redirect host to live game control page
    navigate('/host/game');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (isLoading) {
    return <LoadingState message="Connecting to Classroom Projector Lobby..." />;
  }

  if (!session) return null;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Top Status Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1rem 1.5rem',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Badge variant="purple" pulse>
            <Radio size={12} style={{ marginRight: '4px' }} />
            STATUS: {session.status.toUpperCase()}
          </Badge>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            THE DECISION — HOST CONTROL LOBBY
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Button 
            variant="secondary" 
            size="small" 
            onClick={toggleFullscreen}
            icon={isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
          >
            {isFullscreen ? 'Exit Projector' : 'Projector Mode'}
          </Button>

          <Button 
            variant="ghost" 
            size="small" 
            onClick={loadSession}
            icon={<RefreshCw size={14} />}
          >
            Sync
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          color: 'var(--color-danger)'
        }}>
          <AlertCircle size={20} />
          <span style={{ fontSize: '0.9rem' }}>{errorMessage}</span>
        </div>
      )}

      {/* Main Projector Layout Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        alignItems: 'stretch'
      }}>
        
        {/* Left Column: QR Code & Joining Instructions */}
        <Card glow="cyan" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem 1.5rem' }}>
          
          <Badge variant="cyan" style={{ marginBottom: '1rem' }}>
            <Tv size={12} style={{ marginRight: '4px' }} />
            SCAN TO JOIN
          </Badge>

          {/* High-Contrast Crisp QR Code Container */}
          <div style={{
            background: '#FFFFFF',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-lg)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem'
          }}>
            <QRCodeSVG 
              value={joinUrl}
              size={240}
              level="H"
              includeMargin={false}
            />
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Point your smartphone camera at the QR code to enter immediately
          </p>

          <div style={{ width: '100%', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
            <span style={{
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              fontWeight: 700,
              color: 'var(--text-muted)',
              display: 'block',
              marginBottom: '0.25rem'
            }}>
              OR ENTER CODE
            </span>

            {/* Giant Game Code Display */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              margin: '0.5rem 0'
            }}>
              <span className="font-mono text-cyan" style={{
                fontSize: '2.8rem',
                fontWeight: 900,
                letterSpacing: '0.15em'
              }}>
                {session.game_code}
              </span>

              <Button
                variant="secondary"
                size="small"
                onClick={handleCopyCode}
                icon={copiedCode ? <Check size={14} color="var(--color-success)" /> : <Copy size={14} />}
              >
                {copiedCode ? 'COPIED!' : 'COPY'}
              </Button>
            </div>

            {/* Web Direct Link */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.75rem',
              fontSize: '0.82rem',
              color: 'var(--text-muted)'
            }}>
              <span className="font-mono" style={{ wordBreak: 'break-all' }}>{joinUrl}</span>
              <button 
                onClick={handleCopyLink}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-cyan)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'inline-flex'
                }}
                title="Copy Direct Link"
              >
                {copiedLink ? <Check size={14} color="var(--color-success)" /> : <ExternalLink size={14} />}
              </button>
            </div>
          </div>
        </Card>

        {/* Right Column: Live Player Roster & Start Control */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Top Metric Card: Players Joined + Start Action */}
          <Card glow="purple">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                    LIVE ROSTER
                  </span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '0.5rem',
                    marginTop: '0.25rem'
                  }}>
                    <span className="font-mono" style={{
                      fontSize: '3.2rem',
                      fontWeight: 900,
                      color: 'var(--accent-purple)',
                      lineHeight: 1
                    }}>
                      {players.length}
                    </span>
                    <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {players.length === 1 ? 'student joined' : 'students joined'}
                    </span>
                  </div>
                </div>

                <div style={{
                  padding: '0.75rem',
                  borderRadius: '50%',
                  background: 'rgba(124, 58, 237, 0.08)',
                  border: '1px solid rgba(124, 58, 237, 0.25)',
                  color: 'var(--accent-purple)'
                }}>
                  <Users size={32} />
                </div>
              </div>

              {/* Prominent Host START GAME Button */}
              <Button
                variant="primary"
                size="large"
                block
                icon={<Play size={20} />}
                onClick={handleStartGame}
                disabled={isStarting}
                id="btn-host-start-game"
                style={{
                  padding: '1.1rem',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em'
                }}
              >
                {isStarting ? 'STARTING GAME...' : 'START GAME'}
              </Button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <ShieldAlert size={14} color="var(--accent-cyan)" />
                <span>Only you (Session Owner) can initiate rounds. Players update automatically.</span>
              </div>
            </div>
          </Card>

          {/* Student Callsign Roster Card */}
          <Card style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Connected Students
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                Realtime Sync Active
              </span>
            </div>

            {players.length === 0 ? (
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2.5rem 1rem',
                textAlign: 'center',
                border: '1px dashed var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-muted)'
              }}>
                <Users size={36} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 0.25rem 0' }}>
                  Waiting for students to join...
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                  Tell students to scan the QR code or enter code <span className="font-mono text-cyan">{session.game_code}</span> at <span className="font-mono">/join</span>
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '0.6rem',
                maxHeight: '280px',
                overflowY: 'auto',
                paddingRight: '0.25rem'
              }}>
                {players.map((p, index) => (
                  <div
                    key={p.id}
                    className="animate-fade-in"
                    style={{
                      background: 'var(--bg-surface-secondary)',
                      padding: '0.6rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-purple)', fontWeight: 700 }}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-mono" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.anonymous_name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
