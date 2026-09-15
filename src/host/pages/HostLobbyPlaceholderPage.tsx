import React from 'react';
import { Users } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';

export const HostLobbyPlaceholderPage: React.FC = () => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Badge variant="cyan">
        <Users size={12} style={{ marginRight: '4px' }} />
        PRESENTER LOBBY & QR
      </Badge>

      <Card glow="cyan">
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Full-Screen Projector Lobby
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Displays high-resolution QR code, animated live player counter, and anonymous student callsign roster for projection before game start. Queued for Phase 2.
        </p>
      </Card>
    </div>
  );
};
