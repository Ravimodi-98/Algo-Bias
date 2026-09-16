import React from 'react';
import { CheckCircle2, Clock, Send, ShieldCheck } from 'lucide-react';
import { Button } from '../../shared/components/Button';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';

export interface DecisionPanelProps {
  selectedCandidate: 'A' | 'B' | null;
  onSelectCandidate: (id: 'A' | 'B') => void;
  onSubmitDecision: () => void;
  isSubmitting?: boolean;
  hasSubmitted?: boolean;
  currentRound: number;
}

export const DecisionPanel: React.FC<DecisionPanelProps> = ({
  selectedCandidate,
  onSelectCandidate,
  onSubmitDecision,
  isSubmitting = false,
  hasSubmitted = false,
  currentRound
}) => {
  if (hasSubmitted) {
    return (
      <Card glow="purple" className="animate-fade-in">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1.25rem',
          padding: '1rem 0'
        }}>
          {/* Animated Waiting Pulse */}
          <div style={{
            position: 'relative',
            width: '76px',
            height: '76px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'rgba(139, 92, 246, 0.15)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              animation: 'decision-pulse 2.5s infinite ease-out'
            }} />
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--bg-surface-secondary)',
              border: '1px solid var(--accent-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-purple)',
              boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
              zIndex: 2
            }}>
              <Clock size={22} />
            </div>
          </div>

          <div>
            <Badge variant="success" pulse>
              <CheckCircle2 size={12} style={{ marginRight: '4px' }} />
              DECISION RECORDED
            </Badge>

            <h2 style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
              margin: '0.5rem 0 0.25rem 0'
            }}>
              DECISION SUBMITTED
            </h2>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
              You selected <strong className="text-cyan font-mono">CANDIDATE {selectedCandidate}</strong> for Round {currentRound}.
            </p>
          </div>

          <div style={{
            background: 'var(--bg-base)',
            padding: '0.9rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            maxWidth: '380px'
          }}>
            Waiting for the host to advance the simulation. Your screen will automatically load Round {currentRound + 1} when initiated.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={14} color="var(--color-success)" />
            <span>Response locked in. Prevents duplicate submissions.</span>
          </div>
        </div>

        <style>{`
          @keyframes decision-pulse {
            0% { transform: scale(0.85); opacity: 0.8; }
            100% { transform: scale(1.6); opacity: 0; }
          }
        `}</style>
      </Card>
    );
  }

  return (
    <Card glow="cyan" className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.15em',
            color: 'var(--accent-cyan)',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '0.25rem'
          }}>
            ACTION REQUIRED
          </span>

          <h2 style={{
            fontSize: '1.35rem',
            fontWeight: 900,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
            margin: 0
          }}>
            MAKE YOUR DECISION
          </h2>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            Select the candidate that best aligns with your algorithmic evaluation criteria.
          </p>
        </div>

        {/* Quick Selection Buttons Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem'
        }}>
          <button
            type="button"
            onClick={() => onSelectCandidate('A')}
            disabled={isSubmitting}
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: selectedCandidate === 'A' 
                ? '2px solid var(--accent-cyan)' 
                : '1px solid var(--border-subtle)',
              background: selectedCandidate === 'A' 
                ? 'rgba(0, 240, 255, 0.15)' 
                : 'var(--bg-base)',
              color: selectedCandidate === 'A' ? 'var(--accent-cyan)' : 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all var(--transition-fast)'
            }}
            aria-pressed={selectedCandidate === 'A'}
          >
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>OPTION 1</span>
            <span className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 900 }}>
              CANDIDATE A
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectCandidate('B')}
            disabled={isSubmitting}
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: selectedCandidate === 'B' 
                ? '2px solid var(--accent-purple)' 
                : '1px solid var(--border-subtle)',
              background: selectedCandidate === 'B' 
                ? 'rgba(139, 92, 246, 0.15)' 
                : 'var(--bg-base)',
              color: selectedCandidate === 'B' ? 'var(--accent-purple)' : 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all var(--transition-fast)'
            }}
            aria-pressed={selectedCandidate === 'B'}
          >
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>OPTION 2</span>
            <span className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 900 }}>
              CANDIDATE B
            </span>
          </button>
        </div>

        {/* Final Confirmation Button */}
        <Button
          variant="primary"
          size="large"
          block
          icon={<Send size={18} />}
          onClick={onSubmitDecision}
          disabled={!selectedCandidate || isSubmitting}
          id="btn-submit-decision"
          style={{
            padding: '1rem',
            fontSize: '1rem',
            fontWeight: 800,
            letterSpacing: '0.05em'
          }}
        >
          {isSubmitting 
            ? 'RECORDING DECISION...' 
            : selectedCandidate 
              ? `CONFIRM & SELECT CANDIDATE ${selectedCandidate}` 
              : 'SELECT A CANDIDATE ABOVE'}
        </Button>
      </div>
    </Card>
  );
};
