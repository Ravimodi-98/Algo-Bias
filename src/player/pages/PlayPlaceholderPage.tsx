import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, ArrowLeft, Radio, Sparkles } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { storage } from '../../shared/utils/storage';

export const PlayPlaceholderPage: React.FC = () => {
  const navigate = useNavigate();
  const session = storage.getPlayerSession();

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Badge variant="success" pulse>
          <Radio size={12} style={{ marginRight: '4px' }} />
          LIVE SESSION ACTIVE
        </Badge>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <span style={{
          fontSize: '0.8rem',
          letterSpacing: '0.2em',
          fontWeight: 700,
          color: 'var(--accent-purple)',
          textTransform: 'uppercase'
        }}>
          THE DECISION
        </span>

        <h1 style={{
          fontSize: '2rem',
          fontWeight: 900,
          color: 'var(--accent-cyan)',
          letterSpacing: '-0.02em',
          margin: 0
        }}>
          GAME STARTING...
        </h1>

        <p style={{
          fontSize: '1.1rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: 0
        }}>
          Round 1 is about to begin.
        </p>
      </div>

      <Card glow="cyan">
        <div style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>
          
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(2, 132, 199, 0.08)',
            border: '1px solid var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)',
            boxShadow: 'var(--shadow-cyan)'
          }}>
            <PlayCircle size={32} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxWidth: '380px' }}>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              The host has initiated the simulation. You will be acting as an automated screening algorithm evaluating candidate profiles.
            </p>
          </div>

          {session && (
            <div style={{
              width: '100%',
              background: 'var(--bg-surface-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '0.9rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem',
              border: '1px solid var(--border-subtle)',
              textAlign: 'left'
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>ROOM</span>
                <span className="font-mono text-cyan" style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                  {session.gameCode}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>OPERATOR</span>
                <span className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {session.anonymousName}
                </span>
              </div>
            </div>
          )}

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(124, 58, 237, 0.08)',
            padding: '0.6rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(124, 58, 237, 0.25)',
            fontSize: '0.8rem',
            color: 'var(--accent-purple)'
          }}>
            <Sparkles size={14} />
            <span>Candidate evaluation scenarios scheduled for Case 4.</span>
          </div>
        </div>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="secondary" size="small" onClick={() => navigate('/lobby')} icon={<ArrowLeft size={16} />}>
          Return to Lobby
        </Button>
      </div>
    </div>
  );
};
