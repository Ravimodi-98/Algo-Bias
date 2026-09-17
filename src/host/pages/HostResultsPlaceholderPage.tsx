import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Play, ArrowRight, ShieldCheck } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { storage } from '../../shared/utils/storage';
import { gameService } from '../../services/game/gameService';
import type { DbGameSession } from '../../shared/types';
import { TOTAL_ROUNDS } from '../../shared/data/rounds';

export const HostResultsPlaceholderPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSession, setActiveSession] = useState<DbGameSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const hostSession = storage.getHostSession();
  const hostId = hostSession?.hostId || 'HOST-DEMO';

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      try {
        const session = await gameService.getActiveHostSession(hostId);
        setActiveSession(session);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [hostId]);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <Badge variant="cyan">
          <BarChart3 size={13} style={{ marginRight: '4px' }} />
          COLLECTIVE RESULTS CENTER
        </Badge>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Host Control &bull; Light Theme Projector Edition
        </span>
      </div>

      <Card glow="cyan">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            Live Classroom Collective Results
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            In <strong>THE DECISION</strong>, live results are integrated directly into the live Game Control Room at <code>/host/game</code> to provide presenters with seamless round progression and immediate projector visibility.
          </p>

          <div style={{
            background: 'var(--bg-surface-secondary)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block' }}>
                ACTIVE GAME STATUS
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {loading 
                  ? 'Checking active sessions...' 
                  : activeSession 
                    ? `Session ${activeSession.game_code} &bull; Round ${activeSession.current_round || 1} of ${TOTAL_ROUNDS}`
                    : 'No active session currently running'}
              </span>
            </div>

            {activeSession ? (
              <Button
                variant="primary"
                size="normal"
                icon={<Play size={16} />}
                onClick={() => navigate('/host/game')}
              >
                OPEN LIVE GAME CONSOLE
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="normal"
                icon={<ArrowRight size={16} />}
                onClick={() => navigate('/host/dashboard')}
              >
                GO TO DASHBOARD
              </Button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            <ShieldCheck size={15} color="var(--color-success)" />
            <span>
              All results are calculated authoritatively and anonymized. Individual student identities are never exposed.
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};
