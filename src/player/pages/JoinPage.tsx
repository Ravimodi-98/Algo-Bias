import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn, Key, User, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '../../shared/components/Button';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { ErrorMessage } from '../../shared/components/ErrorMessage';
import { generateAnonymousPlayerId, normalizeGameCode } from '../../shared/utils/idGenerator';
import { storage } from '../../shared/utils/storage';
import { gameService } from '../../services/game/gameService';

export const JoinPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [gameCode, setGameCode] = useState('');
  const [anonymousName, setAnonymousName] = useState('');
  const [defaultId, setDefaultId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [isQrJoined, setIsQrJoined] = useState<boolean>(false);

  useEffect(() => {
    // Generate a default anonymous identifier
    const generated = generateAnonymousPlayerId();
    setDefaultId(generated);

    const existingSession = storage.getPlayerSession();
    if (existingSession?.anonymousName) {
      setAnonymousName(existingSession.anonymousName);
    } else {
      setAnonymousName(generated);
    }

    // Read game code from QR code URL (?game=A7K92B or ?code=A7K92B)
    const queryCode = searchParams.get('game') || searchParams.get('code') || '';
    if (queryCode) {
      const clean = normalizeGameCode(queryCode);
      setGameCode(clean);
      setIsQrJoined(true);
    } else if (existingSession?.gameCode) {
      setGameCode(existingSession.gameCode);
    }
  }, [searchParams]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = normalizeGameCode(gameCode);

    if (!cleanCode) {
      setError('Please enter the Game Code shown on the presenter screen.');
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
      setError(gameError || 'GAME NOT FOUND. Please check the code and try again.');
      return;
    }

    const finalName = anonymousName.trim() || defaultId;

    // 2. Check if player was already registered in this session
    const existingSession = storage.getPlayerSession();
    const existingPlayerId = (existingSession?.sessionId === session.id || existingSession?.gameCode === session.game_code)
      ? existingSession.playerId
      : undefined;

    // 3. Register or restore anonymous player record in Supabase
    const { player, error: playerError } = await gameService.joinPlayer(
      session.id, 
      finalName,
      existingPlayerId
    );

    setIsJoining(false);

    if (playerError || !player) {
      setError(playerError || 'Could not join game session. Please try again.');
      return;
    }

    // 4. Store verified anonymous player session locally
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
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <button
        onClick={() => navigate('/')}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
          padding: '0.25rem 0',
          alignSelf: 'flex-start'
        }}
        aria-label="Back to landing page"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Screen Header Communicating Objective */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
        <Badge variant="cyan">
          <Sparkles size={12} style={{ marginRight: '4px' }} />
          THE DECISION
        </Badge>
        <h1 style={{
          fontSize: '1.85rem',
          fontWeight: 900,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          margin: 0
        }}>
          JOIN GAME
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--accent-cyan)', fontWeight: 600, margin: 0 }}>
          Would you make a fair algorithm?
        </p>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
          Enter the 6-character room code from the presenter screen
        </p>
      </div>

      {error && (
        <ErrorMessage
          title="Entry Error"
          message={error}
          onRetry={() => setError(null)}
        />
      )}

      <Card glow="cyan">
        <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label 
              htmlFor="input-game-code"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--accent-cyan)',
                marginBottom: '0.5rem',
                letterSpacing: '0.05em'
              }}
            >
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
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              maxLength={12}
              disabled={isJoining}
              style={{
                fontSize: '1.35rem',
                fontWeight: 900,
                textAlign: 'center',
                letterSpacing: '0.18em',
                padding: '0.75rem 1rem'
              }}
              required
            />
            {isQrJoined && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                color: 'var(--color-success)',
                marginTop: '0.45rem',
                fontWeight: 700
              }}>
                <CheckCircle2 size={13} color="var(--color-success)" />
                <span>Code automatically scanned from QR code</span>
              </div>
            )}
          </div>

          <div>
            <label 
              htmlFor="input-anonymous-name"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
                letterSpacing: '0.05em'
              }}
            >
              <User size={14} /> ANONYMOUS CALLSIGN
            </label>
            <input
              type="text"
              id="input-anonymous-name"
              className="input-control font-mono"
              placeholder={defaultId || 'PLAYER-4821'}
              value={anonymousName}
              onChange={(e) => setAnonymousName(e.target.value)}
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              maxLength={16}
              disabled={isJoining}
            />
            <span style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              marginTop: '0.35rem',
              display: 'block',
              lineHeight: 1.4
            }}>
              Anonymous callsign generated for your session. Never use real names.
            </span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            block
            icon={<LogIn size={18} />}
            disabled={isJoining || !gameCode.trim()}
            id="btn-submit-join"
          >
            {isJoining ? 'VERIFYING CODE...' : 'ENTER SIMULATOR'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
