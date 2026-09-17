import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Play } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { storage } from '../../shared/utils/storage';

export const ResultsPlaceholderPage: React.FC = () => {
  const navigate = useNavigate();
  const [hasSession, setHasSession] = useState<boolean>(false);

  useEffect(() => {
    const player = storage.getPlayerSession();
    if (player?.sessionId) {
      setHasSession(true);
    }
  }, []);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center' }}>
      <Badge variant="cyan">
        <Sparkles size={12} style={{ marginRight: '4px' }} />
        CASE 10 &bull; FINAL RESULTS & REFLECTION
      </Badge>

      <Card glow="cyan">
        <div style={{ padding: '1.25rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            The Decision: Conclusion
          </h2>
          
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            Classroom results and student reflections are live-synchronized with the presenter display during Case 10.
          </p>

          <div style={{
            background: 'var(--bg-surface-secondary)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.85rem',
            color: 'var(--text-primary)',
            lineHeight: 1.45,
            fontWeight: 600
          }}>
            DATA &rarr; ALGORITHM &rarr; DECISION &rarr; IMPACT
            <br />
            <span style={{ color: 'var(--accent-purple)', fontWeight: 800 }}>THINK BEFORE YOU AUTOMATE.</span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {hasSession ? (
              <Button 
                variant="primary" 
                onClick={() => navigate('/play')} 
                icon={<Play size={16} />}
              >
                GO TO LIVE GAME SCREEN
              </Button>
            ) : (
              <Button 
                variant="primary" 
                onClick={() => navigate('/join')} 
                icon={<ArrowRight size={16} />}
              >
                JOIN A GAME SESSION
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
