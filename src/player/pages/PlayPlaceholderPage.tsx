import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, ArrowLeft } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';

export const PlayPlaceholderPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
      <Badge variant="cyan">
        <PlayCircle size={12} style={{ marginRight: '4px' }} />
        DECISION ROUNDS
      </Badge>

      <Card glow="cyan">
        <div style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Candidate Decision Arena
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            The decision rounds engine is scheduled for development in Phase 3. In the full experiment, you will evaluate fictional candidate profiles and make automated selection calls.
          </p>
          <div style={{
            background: 'var(--bg-surface-secondary)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8rem',
            color: 'var(--accent-cyan)'
          }}>
            Status: Foundation established. Engine queued for Phase 3.
          </div>
        </div>
      </Card>

      <Button variant="secondary" onClick={() => navigate('/lobby')} icon={<ArrowLeft size={16} />}>
        Return to Lobby
      </Button>
    </div>
  );
};
