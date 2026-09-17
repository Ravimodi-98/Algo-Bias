import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  SkipForward, 
  BarChart3, 
  Eye, 
  StopCircle, 
  Users, 
  Tv, 
  Layers, 
  Clock, 
  CheckCircle2,
  PlusCircle,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { LoadingState } from '../../shared/components/LoadingState';
import { gameService } from '../../services/game/gameService';
import { storage } from '../../shared/utils/storage';
import { supabase } from '../../services/supabase/client';
import type { DbGameSession, DbPlayer } from '../../shared/types';
import { TOTAL_ROUNDS } from '../../shared/data/rounds';

export const HostDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSession, setActiveSession] = useState<DbGameSession | null>(null);
  const [players, setPlayers] = useState<DbPlayer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hostSession = storage.getHostSession();
  const hostId = hostSession?.hostId || 'HOST-DEMO';

  const loadActiveGame = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const session = await gameService.getActiveHostSession(hostId);
      if (session) {
        setActiveSession(session);
        const playerList = await gameService.getSessionPlayers(session.id);
        setPlayers(playerList);
      } else {
        setActiveSession(null);
        setPlayers([]);
      }
    } catch {
      setErrorMessage('Failed to load active host session.');
    } finally {
      setIsLoading(false);
    }
  }, [hostId]);

  useEffect(() => {
    loadActiveGame();
  }, [loadActiveGame]);

  // Supabase Realtime Subscription for new players joining
  useEffect(() => {
    if (!activeSession?.id) return;

    const channel = supabase
      .channel(`host-players-${activeSession.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'players',
          filter: `session_id=eq.${activeSession.id}`
        },
        (payload) => {
          const newPlayer = payload.new as DbPlayer;
          setPlayers((prev) => {
            if (prev.some((p) => p.id === newPlayer.id)) return prev;
            return [...prev, newPlayer];
          });
          setLastActionMessage(`New player joined: ${newPlayer.anonymous_name}`);
          setTimeout(() => setLastActionMessage(null), 3500);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeSession?.id]);

  const handleCreateGame = async () => {
    setIsCreating(true);
    setErrorMessage(null);
    const { session, error } = await gameService.createGameSession(hostId);
    setIsCreating(false);

    if (error || !session) {
      setErrorMessage(error || 'Failed to create game session.');
      return;
    }

    setActiveSession(session);
    setPlayers([]);
    // Redirect to Host Lobby as required by Step 2
    navigate('/host/lobby');
  };

  const handleCloseAndCreateNew = async () => {
    if (activeSession) {
      setIsCreating(true);
      await gameService.closeGameSession(activeSession.id, hostId);
      const { session, error } = await gameService.createGameSession(hostId);
      setIsCreating(false);

      if (error || !session) {
        setErrorMessage(error || 'Failed to create new game session.');
        return;
      }

      setActiveSession(session);
      setPlayers([]);
      navigate('/host/lobby');
    }
  };

  const triggerAction = async (actionName: string, nextStatus?: 'waiting' | 'active' | 'completed', roundNumber?: number) => {
    if (activeSession && nextStatus) {
      const result = await gameService.updateGameState(
        activeSession.id, 
        hostId,
        nextStatus, 
        typeof roundNumber === 'number' ? roundNumber : activeSession.current_round
      );
      if (result.success) {
        setActiveSession(prev => prev ? { 
          ...prev, 
          status: nextStatus, 
          current_round: typeof roundNumber === 'number' ? roundNumber : prev.current_round 
        } : null);
        setLastActionMessage(`Command acknowledged: [${actionName}].`);
      } else {
        setErrorMessage(result.error || `Failed to execute ${actionName}.`);
      }
    }
    setTimeout(() => setLastActionMessage(null), 4000);
  };

  const roomCode = activeSession?.game_code || '------';
  const gameStatus = (activeSession?.status || 'NO ACTIVE GAME').toUpperCase();
  if (isLoading) {
    return <LoadingState message="Connecting to Supabase Host Console..." />;
  }

  const currentRound = activeSession?.current_round ?? 0;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Banner / Projector Header */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid var(--accent-purple)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-purple)'
          }}>
            <Tv size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              HOST PRESENTATION CONSOLE
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Classroom & Projector Controller for THE DECISION
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {activeSession ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end'
            }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                ACTIVE GAME CODE
              </span>
              <span className="font-mono text-cyan" style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.08em' }}>
                {roomCode}
              </span>
            </div>
          ) : (
            <Button
              variant="primary"
              size="normal"
              icon={<PlusCircle size={16} />}
              onClick={handleCreateGame}
              disabled={isCreating}
              id="host-btn-create-game-banner"
            >
              {isCreating ? 'CREATING...' : 'CREATE GAME'}
            </Button>
          )}

          <Badge variant={activeSession ? 'purple' : 'warning'} pulse={!!activeSession}>
            {activeSession ? 'LIVE ROOM' : 'NO GAME'}
          </Badge>

          <button
            onClick={loadActiveGame}
            title="Refresh game status"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.35rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Action Notification Toast */}
      {lastActionMessage && (
        <div style={{
          background: 'rgba(0, 240, 255, 0.1)',
          border: '1px solid var(--accent-cyan)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: 'var(--accent-cyan)',
          fontSize: '0.9rem'
        }}>
          <CheckCircle2 size={18} />
          <span>{lastActionMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid var(--color-danger)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.25rem',
          color: '#fca5a5',
          fontSize: '0.9rem'
        }}>
          {errorMessage}
        </div>
      )}

      {/* Active Game Handling Banner (Step 17) */}
      {activeSession && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(0, 240, 255, 0.08) 100%)',
          border: '1px solid var(--accent-purple)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 0 20px rgba(139, 92, 246, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(139, 92, 246, 0.2)',
              color: 'var(--accent-purple)'
            }}>
              <Tv size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Badge variant="purple" pulse>ACTIVE GAME</Badge>
                <span className="font-mono text-cyan" style={{ fontWeight: 800, fontSize: '1.1rem' }}>{activeSession.game_code}</span>
              </div>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                You already have a game in progress with {players.length} {players.length === 1 ? 'student' : 'students'} joined.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              size="normal"
              icon={<Tv size={16} />}
              onClick={() => navigate('/host/lobby')}
              id="btn-open-host-lobby"
            >
              OPEN HOST LOBBY & QR
            </Button>

            <Button
              variant="secondary"
              size="normal"
              icon={<PlusCircle size={16} />}
              onClick={handleCloseAndCreateNew}
              disabled={isCreating}
            >
              CLOSE & CREATE NEW
            </Button>
          </div>
        </div>
      )}

      {/* Grid: 3 Main Metrics Cards (GAME, PLAYERS, ROUND) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        
        {/* SECTION 1: GAME STATUS */}
        <Card glow="purple">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                GAME
              </span>
              <Clock size={16} color="var(--accent-purple)" />
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>
                Game Status
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.25rem' }}>
                <span className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {gameStatus}
                </span>
                <Badge variant={gameStatus === 'ACTIVE' ? 'success' : gameStatus === 'WAITING' ? 'warning' : 'danger'}>
                  {gameStatus}
                </Badge>
              </div>
            </div>

            <div style={{
              background: 'var(--bg-surface-secondary)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)'
            }}>
              {activeSession ? (
                <span>Join Code: <strong className="text-cyan font-mono">{roomCode}</strong></span>
              ) : (
                <span>Click <strong>CREATE GAME</strong> to launch a session</span>
              )}
            </div>
          </div>
        </Card>

        {/* SECTION 2: PLAYERS */}
        <Card glow="cyan">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                PLAYERS
              </span>
              <Users size={16} color="var(--accent-cyan)" />
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>
                Players Joined
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                <span className="font-mono text-cyan" style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>
                  {players.length}
                </span>
                <Badge variant={players.length > 0 ? 'success' : 'cyan'}>
                  {players.length === 0 ? 'Awaiting Students' : `${players.length} Connected`}
                </Badge>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
              color: 'var(--text-muted)'
            }}>
              <span>Anonymous identities in Supabase</span>
              {players.length > 0 && (
                <span className="font-mono text-cyan" style={{ fontSize: '0.75rem' }}>
                  Latest: {players[players.length - 1].anonymous_name}
                </span>
              )}
            </div>
          </div>
        </Card>

        {/* SECTION 3: ROUND */}
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                ROUND
              </span>
              <Layers size={16} color="var(--color-warning)" />
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>
                Current Round
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
                <span className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {currentRound === 0 ? 'Not Started' : `Round ${currentRound}`}
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ {TOTAL_ROUNDS} total</span>
              </div>
            </div>

            <div style={{
              background: 'var(--bg-surface-secondary)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)'
            }}>
              Simulation state: {activeSession ? (currentRound === 0 ? 'Lobby Waiting' : `Active Round ${currentRound}`) : 'Inactive'}
            </div>
          </div>
        </Card>

      </div>

      {/* CASE 8: EDUCATIONAL BIAS REVEAL SHORTCUT */}
      <Card glow="purple" style={{ padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.06) 0%, rgba(2, 132, 199, 0.06) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(124, 58, 237, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-purple)'
            }}>
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Badge variant="purple">CASE 8 ACTIVE</Badge>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Presenter Educational Bias Reveal Console
                </span>
              </div>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                9-step structured classroom sequence: Data &rarr; Algorithm &rarr; Decision &rarr; Impact (Automation &ne; Fairness).
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="normal"
            icon={<Sparkles size={16} />}
            onClick={() => navigate('/host/reveal')}
            id="btn-open-host-reveal-dashboard"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #0284c7)' }}
          >
            OPEN REVEAL CONSOLE
          </Button>
        </div>
      </Card>

      {/* SECTION 4: HOST-ONLY CONTROLS */}
      <Card glow="purple" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <Badge variant="purple">ADMINISTRATIVE ONLY</Badge>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-warning)' }}>
                  &bull; Strictly isolated from player application
                </span>
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Classroom & Round Controls
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Control live session state stored in Supabase. These controls are never accessible in the player interface.
              </p>
            </div>

            {activeSession && (
              <Button
                variant="outline-cyan"
                size="normal"
                icon={<Sparkles size={16} />}
                onClick={handleCreateGame}
                disabled={isCreating}
              >
                CREATE NEW GAME
              </Button>
            )}
          </div>

          {!activeSession ? (
            <div style={{
              background: 'rgba(139, 92, 246, 0.08)',
              border: '1px dashed var(--border-purple)',
              borderRadius: 'var(--radius-md)',
              padding: '2rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                No active session found for your host profile. Launch a session to allow students to join.
              </p>
              <Button
                variant="primary"
                size="large"
                icon={<PlusCircle size={18} />}
                onClick={handleCreateGame}
                disabled={isCreating}
                id="host-btn-create-game-empty"
              >
                {isCreating ? 'GENERATING CODE...' : 'CREATE GAME SESSION'}
              </Button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem'
            }}>
              
              {/* Button 1: Start Game */}
              <Button
                id="host-btn-start-game"
                variant="primary"
                size="normal"
                icon={<Play size={16} />}
                onClick={() => triggerAction('Start Game', 'active', 1)}
              >
                Start Game
              </Button>

              {/* Button 2: Next Round */}
              <Button
                id="host-btn-next-round"
                variant="purple"
                size="normal"
                icon={<SkipForward size={16} />}
                onClick={() => {
                  const nextRound = currentRound < 7 ? currentRound + 1 : 1;
                  triggerAction(`Advanced to Round ${nextRound}`, 'active', nextRound);
                }}
              >
                Next Round
              </Button>

              {/* Button 3: Show Results */}
              <Button
                id="host-btn-show-results"
                variant="secondary"
                size="normal"
                icon={<BarChart3 size={16} />}
                onClick={() => triggerAction('Show Results')}
              >
                Show Results
              </Button>

              {/* Button 4: Reveal Bias */}
              <Button
                id="host-btn-reveal-bias"
                variant="purple"
                size="normal"
                icon={<Eye size={16} />}
                onClick={() => navigate('/host/reveal')}
              >
                Reveal Bias (Case 8)
              </Button>

              {/* Button 5: End Game */}
              <Button
                id="host-btn-end-game"
                variant="danger"
                size="normal"
                icon={<StopCircle size={16} />}
                onClick={() => triggerAction('End Game', 'completed', 0)}
              >
                End Game
              </Button>

            </div>
          )}
        </div>
      </Card>

    </div>
  );
};
