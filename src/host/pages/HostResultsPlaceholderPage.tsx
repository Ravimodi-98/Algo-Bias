import React from 'react';
import { BarChart3 } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';

export const HostResultsPlaceholderPage: React.FC = () => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Badge variant="cyan">
        <BarChart3 size={12} style={{ marginRight: '4px' }} />
        COLLECTIVE RESULTS
      </Badge>

      <Card glow="cyan">
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Collective Classroom Results Display
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Large-format animated percentage bars for projector presentation showing candidate selection distribution and decision influence data. Queued for Phase 5.
        </p>
      </Card>
    </div>
  );
};
