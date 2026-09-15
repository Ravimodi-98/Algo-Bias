import React, { useState } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';

export const HostDashboardPage: React.FC = () => {
  const [gameStatus, setGameStatus] = useState<'WAITING' | 'ACTIVE' | 'RESULTS' | 'REVEAL' | 'COMPLETED'>('WAITING');
  const [playerCount, setPlayerCount] = useState<number>(0);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);

  const roomCode = 'DECIDE-2026';

  const triggerAction = (actionName: string, nextStatus?: typeof gameStatus) => {
    if (nextStatus) {
      setGameStatus(nextStatus);
    }
    setLastActionMessage(`Command acknowledged: [${actionName}]. Engine integration scheduled for Phase 2/3.`);
    setTimeout(() => setLastActionMessage(null), 4000);
  };

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

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end'
          }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              ACTIVE ROOM CODE
            </span>
            <span className="font-mono text-cyan" style={{ fontSize: '1.35rem', fontWeight: 800 }}>
              {roomCode}
            </span>
          </div>
          <Badge variant="purple" pulse>
            LIVE ROOM
          </Badge>
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
                <Badge variant={gameStatus === 'ACTIVE' ? 'success' : 'warning'} pulse={gameStatus === 'ACTIVE'}>
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
              Join URL: <code className="text-cyan font-mono">/join?code={roomCode}</code>
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
                  {playerCount}
                </span>
                <Badge variant={playerCount > 0 ? 'success' : 'cyan'}>
                  {playerCount === 0 ? 'Awaiting Students' : `${playerCount} Connected`}
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
              <span>Anonymous identities protected</span>
              <button
                onClick={() => setPlayerCount(prev => prev + 1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-cyan)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                + Demo Join
              </button>
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
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ 7 total</span>
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
              Educational bias scenario: {currentRound === 0 ? 'None active' : `Scenario ${currentRound}`}
            </div>
          </div>
        </Card>

      </div>

      {/* SECTION 4: HOST-ONLY CONTROLS */}
      <Card glow="purple" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
              These buttons control the live classroom state. They are never rendered or accessible in the student interface.
            </p>
          </div>

          {/* 5 Dedicated Host Buttons */}
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
              onClick={() => {
                setCurrentRound(1);
                triggerAction('Start Game', 'ACTIVE');
              }}
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
                setCurrentRound(prev => (prev < 7 ? prev + 1 : 1));
                triggerAction('Next Round', 'ACTIVE');
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
              onClick={() => triggerAction('Show Results', 'RESULTS')}
            >
              Show Results
            </Button>

            {/* Button 4: Reveal Bias */}
            <Button
              id="host-btn-reveal-bias"
              variant="outline-cyan"
              size="normal"
              icon={<Eye size={16} />}
              onClick={() => triggerAction('Reveal Bias', 'REVEAL')}
            >
              Reveal Bias
            </Button>

            {/* Button 5: End Game */}
            <Button
              id="host-btn-end-game"
              variant="danger"
              size="normal"
              icon={<StopCircle size={16} />}
              onClick={() => {
                setCurrentRound(0);
                triggerAction('End Game', 'COMPLETED');
              }}
            >
              End Game
            </Button>

          </div>
        </div>
      </Card>

    </div>
  );
};
