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
      padding: '0.85rem 1.25rem',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(2, 132, 199, 0.08)',
          border: '1px solid rgba(2, 132, 199, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-cyan)'
        }}>
          <Cpu size={18} />
        </div>
        <div>
          <div style={{
            fontSize: '0.92rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            color: 'var(--text-primary)',
            lineHeight: 1.15
          }}>
            THE DECISION
          </div>
          <div style={{
            fontSize: '0.68rem',
            letterSpacing: '0.08em',
            color: 'var(--accent-cyan)',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700
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
          fontFamily: 'var(--font-mono)',
          fontWeight: 600
        }}>
          PLAYER MODE
        </span>
      )}
    </header>
  );
};
