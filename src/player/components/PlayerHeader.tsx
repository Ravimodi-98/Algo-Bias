import React from 'react';
import { Cpu, UserCheck } from 'lucide-react';
import { Badge } from '../../shared/components/Badge';
import { storage } from '../../shared/utils/storage';

export const PlayerHeader: React.FC = () => {
  const session = storage.getPlayerSession();

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 1.25rem',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(8, 10, 15, 0.8)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(0, 240, 255, 0.1)',
          border: '1px solid rgba(0, 240, 255, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-cyan)'
        }}>
          <Cpu size={18} />
        </div>
        <div>
          <div style={{
            fontSize: '0.95rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: 'var(--text-primary)',
            lineHeight: 1.1
          }}>
            THE DECISION
          </div>
          <div style={{
            fontSize: '0.68rem',
            letterSpacing: '0.06em',
            color: 'var(--accent-cyan)',
            fontFamily: 'var(--font-mono)'
          }}>
            AI SIMULATOR
          </div>
        </div>
      </div>

      {session?.anonymousName ? (
        <Badge variant="cyan" pulse>
          <UserCheck size={12} style={{ marginRight: '2px' }} />
          <span className="font-mono">{session.anonymousName}</span>
        </Badge>
      ) : (
        <span style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)'
        }}>
          PLAYER MODE
        </span>
      )}
    </header>
  );
};
