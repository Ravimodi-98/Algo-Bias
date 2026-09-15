import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, ArrowLeft } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';

export const FairnessPlaceholderPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
      <Badge variant="success">
        <Scale size={12} style={{ marginRight: '4px' }} />
        FAIRNESS CHALLENGE
      </Badge>

      <Card>
        <div style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Make It Fair Challenge
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            In this phase, players redesign the algorithmic criteria by deciding which candidate attributes should be prioritized by an automated decision system.
          </p>
          <div style={{
            background: 'var(--bg-surface-secondary)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8rem',
            color: 'var(--color-success)'
          }}>
            Status: Foundation established. Fairness challenge queued for Phase 8.
          </div>
        </div>
      </Card>

      <Button variant="secondary" onClick={() => navigate('/lobby')} icon={<ArrowLeft size={16} />}>
        Return to Lobby
      </Button>
    </div>
  );
};
