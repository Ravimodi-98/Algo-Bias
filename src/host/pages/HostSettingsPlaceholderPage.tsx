import React from 'react';
import { Settings } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';

export const HostSettingsPlaceholderPage: React.FC = () => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Badge variant="purple">
        <Settings size={12} style={{ marginRight: '4px' }} />
        CONSOLE SETTINGS
      </Badge>

      <Card>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Presentation & Room Settings
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Projector color modes, timer configurations, audio cues, and database synchronization preferences. Queued for Phase 9.
        </p>
      </Card>
    </div>
  );
};
