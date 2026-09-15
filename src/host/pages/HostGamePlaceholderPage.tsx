import React from 'react';
import { Play } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';

export const HostGamePlaceholderPage: React.FC = () => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Badge variant="purple">
        <Play size={12} style={{ marginRight: '4px' }} />
        LIVE ROUND CONTROLLER
      </Badge>

      <Card glow="purple">
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Host Live Round Controller
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Live response progress monitor, real-time submission percentage, and projector round controls. Queued for Phase 3.
        </p>
      </Card>
    </div>
  );
};
