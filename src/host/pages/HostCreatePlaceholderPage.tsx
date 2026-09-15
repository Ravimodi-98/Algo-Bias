import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';

export const HostCreatePlaceholderPage: React.FC = () => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Badge variant="purple">
        <PlusCircle size={12} style={{ marginRight: '4px' }} />
        CREATE SESSION
      </Badge>

      <Card glow="purple">
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Create New Classroom Game Session
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          This interface allows configuring custom candidate scenarios, timer duration (default 15s), and generating a new unique room code. Queued for Phase 2 implementation.
        </p>
      </Card>
    </div>
  );
};
