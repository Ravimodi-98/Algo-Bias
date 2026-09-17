import React from 'react';
import { CheckCircle2, Clock, Send, ShieldCheck, AlertTriangle, Sparkles } from 'lucide-react';
import { Button } from '../../shared/components/Button';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { TOTAL_ROUNDS } from '../../shared/data/rounds';

export interface DecisionPanelProps {
  selectedCandidate: 'A' | 'B' | null;
  onSelectCandidate: (id: 'A' | 'B') => void;
  onSubmitDecision: () => void;
  isSubmitting?: boolean;
  hasSubmitted?: boolean;
  isTimedOut?: boolean;
  currentRound: number;
}

export const DecisionPanel: React.FC<DecisionPanelProps> = ({
  selectedCandidate,
  onSelectCandidate,
  onSubmitDecision,
  isSubmitting = false,
  hasSubmitted = false,
  isTimedOut = false,
  currentRound
}) => {
  const isFinalRound = currentRound >= TOTAL_ROUNDS;

  // 1. Timeout State (No selection before timer expired)
  if (isTimedOut && !hasSubmitted) {
    return (
      <Card glow="purple" className="animate-fade-in">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1.1rem',
          padding: '1rem 0'
        }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: '#fffbeb',
            border: '2px solid var(--color-warning)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-warning)'
          }}>
            <AlertTriangle size={26} />
          </div>

          <div>
            <Badge variant="warning">
              WINDOW CLOSED
            </Badge>

            <h2 style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
              margin: '0.5rem 0 0.25rem 0'
            }}>
              TIME'S UP
            </h2>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
              Your decision window for Round {currentRound} has closed.
            </p>
          </div>

          <div style={{
            background: 'var(--bg-surface-secondary)',
            padding: '0.85rem 1.15rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            maxWidth: '380px'
          }}>
            {isFinalRound
              ? `All ${TOTAL_ROUNDS} rounds completed. Standing by for presenter to launch the final results and analysis.`
              : `Standing by for presenter progression. Your device will automatically load Round ${currentRound + 1} when initiated.`}
          </div>
        </div>
      </Card>
    );
  }

  // 2. Decision Submitted Waiting State
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
            width: '72px',
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'rgba(124, 58, 237, 0.12)',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              animation: 'decision-pulse 2.5s infinite ease-out'
            }} />
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '2px solid var(--accent-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-purple)',
              boxShadow: '0 4px 16px rgba(124, 58, 237, 0.25)',
              zIndex: 2
            }}>
              {isFinalRound ? <Sparkles size={22} /> : <Clock size={22} />}
            </div>
          </div>

          <div>
            <Badge variant="success" pulse>
              <CheckCircle2 size={12} style={{ marginRight: '4px' }} />
              DECISION RECORDED
            </Badge>

            <h2 style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
              margin: '0.5rem 0 0.2rem 0'
            }}>
              {isFinalRound ? 'All Rounds Completed' : 'Decision Submitted'}
            </h2>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, fontWeight: 500 }}>
              Your selection for <strong className="text-cyan font-mono">CANDIDATE {selectedCandidate}</strong> is saved for Round {currentRound}.
            </p>
          </div>

          <div style={{
            background: 'var(--bg-surface-secondary)',
            padding: '0.85rem 1.15rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            maxWidth: '380px'
          }}>
            {isFinalRound
              ? `All ${TOTAL_ROUNDS} rounds completed. Standing by for presenter to initiate the collective results and algorithmic analysis.`
              : `Standing by for presenter progression. Your device will automatically load Round ${currentRound + 1} when initiated.`}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={14} color="var(--color-success)" />
            <span>Response locked into database. Single response per participant.</span>
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

  // 3. Active Decision Selection & Submission
  return (
    <Card glow="cyan" className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.15em',
            color: 'var(--accent-cyan)',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '0.2rem'
          }}>
            YOUR SELECTION
          </span>

          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 900,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
            margin: 0
          }}>
            Choose Candidate
          </h2>
        </div>

        {/* Selection Buttons Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.65rem'
        }}>
          <button
            type="button"
            onClick={() => onSelectCandidate('A')}
            disabled={isSubmitting || isTimedOut}
            style={{
              padding: '0.9rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: selectedCandidate === 'A' 
                ? '2px solid var(--accent-cyan)' 
                : '1px solid #cbd5e1',
              background: selectedCandidate === 'A' 
                ? 'rgba(2, 132, 199, 0.08)' 
                : '#ffffff',
              color: selectedCandidate === 'A' ? 'var(--accent-cyan)' : 'var(--text-primary)',
              cursor: (isSubmitting || isTimedOut) ? 'not-allowed' : 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              transition: 'all var(--transition-fast)',
              boxShadow: selectedCandidate === 'A' ? '0 2px 8px rgba(2, 132, 199, 0.15)' : 'none',
              minHeight: '48px'
            }}
            aria-pressed={selectedCandidate === 'A'}
          >
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>OPTION 1</span>
            <span className="font-mono" style={{ fontSize: '1.05rem', fontWeight: 900 }}>
              CANDIDATE A
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectCandidate('B')}
            disabled={isSubmitting || isTimedOut}
            style={{
              padding: '0.9rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: selectedCandidate === 'B' 
                ? '2px solid var(--accent-purple)' 
                : '1px solid #cbd5e1',
              background: selectedCandidate === 'B' 
                ? 'rgba(124, 58, 237, 0.08)' 
                : '#ffffff',
              color: selectedCandidate === 'B' ? 'var(--accent-purple)' : 'var(--text-primary)',
              cursor: (isSubmitting || isTimedOut) ? 'not-allowed' : 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              transition: 'all var(--transition-fast)',
              boxShadow: selectedCandidate === 'B' ? '0 2px 8px rgba(124, 58, 237, 0.15)' : 'none',
              minHeight: '48px'
            }}
            aria-pressed={selectedCandidate === 'B'}
          >
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>OPTION 2</span>
            <span className="font-mono" style={{ fontSize: '1.05rem', fontWeight: 900 }}>
              CANDIDATE B
            </span>
          </button>
        </div>

        {/* Final Confirmation Button */}
        <Button
          variant="primary"
          size="large"
          block
          icon={<Send size={16} />}
          onClick={onSubmitDecision}
          disabled={!selectedCandidate || isSubmitting || isTimedOut}
          id="btn-submit-decision"
          style={{
            padding: '0.85rem',
            fontSize: '0.95rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            minHeight: '48px'
          }}
        >
          {isSubmitting 
            ? 'SAVING DECISION...' 
            : selectedCandidate 
              ? `CONFIRM & SELECT CANDIDATE ${selectedCandidate}` 
              : 'SELECT CANDIDATE A OR B'}
        </Button>
      </div>
    </Card>
  );
};
