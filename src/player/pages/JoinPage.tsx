import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Key, User, ArrowLeft } from 'lucide-react';
import { Button } from '../../shared/components/Button';
import { Card } from '../../shared/components/Card';
import { ErrorMessage } from '../../shared/components/ErrorMessage';
import { generateAnonymousPlayerId, normalizeGameCode } from '../../shared/utils/idGenerator';
import { storage } from '../../shared/utils/storage';
import { gameService } from '../../services/game/gameService';

export const JoinPage: React.FC = () => {
  const navigate = useNavigate();
  const [gameCode, setGameCode] = useState('');
  const [anonymousName, setAnonymousName] = useState('');
  const [defaultId, setDefaultId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState<boolean>(false);

  useEffect(() => {
    // Generate a default anonymous identifier
    const generated = generateAnonymousPlayerId();
    setDefaultId(generated);
    setAnonymousName(generated);
  }, []);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = normalizeGameCode(gameCode);

    if (!cleanCode) {
      setError('Please enter a valid Game Code from your host or projector.');
      return;
    }

    if (cleanCode.length < 3) {
      setError('Game Code must be at least 3 characters.');
      return;
    }

    setIsJoining(true);
    setError(null);

    // 1. Validate game code against Supabase
    const { session, error: gameError } = await gameService.getGameByCode(cleanCode);

    if (gameError || !session) {
      setIsJoining(false);
      setError(gameError || 'GAME NOT FOUND. Check the code and try again.');
      return;
    }

    const finalName = anonymousName.trim() || defaultId;

    // 2. Register anonymous player record in Supabase
    const { player, error: playerError } = await gameService.joinPlayer(session.id, finalName);

    setIsJoining(false);

    if (playerError || !player) {
      setError(playerError || 'Could not join game session. Please try again.');
      return;
    }

    // 3. Store verified anonymous player session locally
    storage.setPlayerSession({
      playerId: player.id,
      sessionId: session.id,
      anonymousName: player.anonymous_name,
      gameCode: session.game_code,
      joinedAt: player.joined_at
    });

    navigate('/lobby');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <button
        onClick={() => navigate('/')}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.88rem',
          cursor: 'pointer',
          padding: 0,
          alignSelf: 'flex-start'
        }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: '0.35rem'
        }}>
          JOIN GAME
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Enter the room code shown on the presenter's screen
        </p>
      </div>

      {error && (
        <ErrorMessage
          title="Entry Error"
          message={error}
          onRetry={() => setError(null)}
        />
      )}

      <Card>
        <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--accent-cyan)',
              marginBottom: '0.5rem',
              letterSpacing: '0.05em'
            }}>
              <Key size={14} /> GAME CODE
            </label>
            <input
              type="text"
              id="input-game-code"
              className="input-control font-mono"
              placeholder="e.g. A7K92B"
              value={gameCode}
              onChange={(e) => {
                setGameCode(e.target.value.toUpperCase());
                if (error) setError(null);
              }}
              autoFocus
              maxLength={12}
              disabled={isJoining}
            />
          </div>

          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: '0.5rem',
              letterSpacing: '0.05em'
            }}>
              <User size={14} /> ANONYMOUS CALLSIGN (OPTIONAL)
            </label>
            <input
              type="text"
              id="input-anonymous-name"
              className="input-control font-mono"
              placeholder={defaultId || 'PLAYER-4821'}
              value={anonymousName}
              onChange={(e) => setAnonymousName(e.target.value)}
              maxLength={16}
              disabled={isJoining}
            />
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginTop: '0.35rem',
              display: 'block'
            }}>
              Leave as is or customize. Never use your real name or personal information.
            </span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            block
            icon={<LogIn size={18} />}
            disabled={isJoining}
            id="btn-submit-join"
          >
            {isJoining ? 'VERIFYING CODE...' : 'ENTER SIMULATOR'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
