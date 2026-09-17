import React, { useState } from 'react';
import { Users, Sparkles, CheckCircle2, Eye, EyeOff, Lock, BarChart2 } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import type { RoundAggregate } from '../../shared/types';
import type { RoundData } from '../../shared/data/rounds';

interface AggregateResultsViewProps {
  aggregate: RoundAggregate;
  roundData: RoundData;
  resultsVisible: boolean;
  totalPlayers: number;
  onShowResults?: () => void;
  isActionInProgress?: boolean;
}

export const AggregateResultsView: React.FC<AggregateResultsViewProps> = ({
  aggregate,
  roundData,
  resultsVisible,
  totalPlayers,
  onShowResults,
  isActionInProgress = false
}) => {
  const [showPresenterPeek, setShowPresenterPeek] = useState<boolean>(false);
  const { candidateA, candidateB, totalResponses } = aggregate;
  const isDraw = candidateA.count === candidateB.count && totalResponses > 0;
  const leadingCandidate = candidateA.count > candidateB.count ? 'A' : candidateB.count > candidateA.count ? 'B' : null;

  // Decide whether results are actively shown (either officially revealed or private host peek)
  const isDisplayingResults = resultsVisible || showPresenterPeek;

  // State 1: Results are HIDDEN from classroom projector
  if (!isDisplayingResults) {
    return (
      <Card glow="purple" className="animate-fade-in" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Badge variant="purple">
                <Lock size={12} style={{ marginRight: '4px' }} />
                RESULTS CONCEALED ON PROJECTOR
              </Badge>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                ROUND {roundData.roundNumber} OF 7 &bull; {roundData.role}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Button
                variant="ghost"
                size="small"
                icon={<Eye size={14} />}
                onClick={() => setShowPresenterPeek(true)}
                title="Preview results privately without revealing to classroom"
              >
                Presenter Peek
              </Button>
            </div>
          </div>

          <div style={{
            background: 'var(--bg-surface-secondary)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem 1.5rem',
            border: '1px dashed var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'rgba(124, 58, 237, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-purple)'
            }}>
              <BarChart2 size={28} />
            </div>

            <div style={{ maxWidth: '520px' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                Classroom Collective Decision Hidden
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0.4rem 0 0 0', lineHeight: 1.5 }}>
                Participant choices are being aggregated anonymously in real time. Results remain concealed on this display to maintain experiment integrity until you choose to broadcast them.
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: '#ffffff',
              padding: '0.6rem 1.25rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.9rem',
              fontWeight: 800,
              color: 'var(--text-primary)'
            }}>
              <Users size={16} color="var(--accent-cyan)" />
              <span>
                <strong className="font-mono text-cyan">{totalResponses}</strong> of <span className="font-mono">{totalPlayers}</span> responses collected
              </span>
            </div>

            {onShowResults && (
              <div style={{ marginTop: '0.5rem' }}>
                <Button
                  variant="primary"
                  size="normal"
                  icon={<Eye size={16} />}
                  onClick={onShowResults}
                  disabled={isActionInProgress}
                >
                  {isActionInProgress ? 'BROADCASTING TO CLASSROOM...' : 'SHOW RESULTS TO CLASSROOM'}
                </Button>
              </div>
            )}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-muted)',
            fontSize: '0.8rem'
          }}>
            <Sparkles size={14} color="var(--accent-purple)" />
            <span>Clicking <strong>SHOW RESULTS</strong> will project the class distribution here and synchronize to all student phones.</span>
          </div>

        </div>
      </Card>
    );
  }

  // State 2: Results are REVEALED to classroom (or Host Peek active)
  return (
    <Card glow="cyan" className="animate-fade-in" style={{ padding: '1.75rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Header Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <Badge variant={resultsVisible ? 'success' : 'purple'} pulse={resultsVisible}>
                {resultsVisible ? (
                  <>
                    <Eye size={12} style={{ marginRight: '4px' }} />
                    PROJECTED TO CLASSROOM
                  </>
                ) : (
                  <>
                    <EyeOff size={12} style={{ marginRight: '4px' }} />
                    PRESENTER PEEK &bull; NOT YET BROADCAST
                  </>
                )}
              </Badge>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                ROUND {roundData.roundNumber} OF 7
              </span>
            </div>

            <h2 style={{
              fontSize: '2.2rem',
              fontWeight: 900,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              margin: 0,
              lineHeight: 1.2
            }}>
              Classroom Collective Decision
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: '0.3rem 0 0 0' }}>
              Target Role: <strong style={{ color: 'var(--text-primary)' }}>{roundData.role}</strong> &bull; {roundData.title}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {!resultsVisible && showPresenterPeek && (
              <Button
                variant="secondary"
                size="small"
                icon={<EyeOff size={14} />}
                onClick={() => setShowPresenterPeek(false)}
              >
                Hide Peek
              </Button>
            )}

            <div style={{
              background: 'var(--bg-surface-secondary)',
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <Users size={24} color="var(--accent-cyan)" />
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>
                  TOTAL RESPONSES
                </span>
                <span className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                  {totalResponses} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ {totalPlayers}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Big Numbers Comparison Grid (Projector-First Layout) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Candidate A Column */}
          <div style={{
            background: leadingCandidate === 'A' ? 'rgba(2, 132, 199, 0.05)' : '#ffffff',
            border: leadingCandidate === 'A' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            boxShadow: leadingCandidate === 'A' ? '0 4px 20px rgba(2, 132, 199, 0.1)' : '0 2px 8px rgba(15, 23, 42, 0.03)',
            transition: 'all var(--transition-normal)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-mono text-cyan" style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.04em' }}>
                OPTION 1 &bull; CANDIDATE A
              </span>
              {leadingCandidate === 'A' && (
                <Badge variant="cyan">
                  <CheckCircle2 size={12} style={{ marginRight: '4px' }} />
                  MAJORITY CHOICE
                </Badge>
              )}
            </div>

            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              {roundData.candidateA.name}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.85rem', marginTop: '0.5rem' }}>
              <span className="font-mono text-cyan" style={{ fontSize: '4.25rem', fontWeight: 900, lineHeight: 1 }}>
                {candidateA.percentage}%
              </span>
              <span style={{ fontSize: '1.35rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                {candidateA.count} {candidateA.count === 1 ? 'vote' : 'votes'}
              </span>
            </div>
          </div>

          {/* Candidate B Column */}
          <div style={{
            background: leadingCandidate === 'B' ? 'rgba(124, 58, 237, 0.05)' : '#ffffff',
            border: leadingCandidate === 'B' ? '2px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            boxShadow: leadingCandidate === 'B' ? '0 4px 20px rgba(124, 58, 237, 0.1)' : '0 2px 8px rgba(15, 23, 42, 0.03)',
            transition: 'all var(--transition-normal)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-mono text-purple" style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.04em' }}>
                OPTION 2 &bull; CANDIDATE B
              </span>
              {leadingCandidate === 'B' && (
                <Badge variant="purple">
                  <CheckCircle2 size={12} style={{ marginRight: '4px' }} />
                  MAJORITY CHOICE
                </Badge>
              )}
            </div>

            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              {roundData.candidateB.name}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.85rem', marginTop: '0.5rem' }}>
              <span className="font-mono text-purple" style={{ fontSize: '4.25rem', fontWeight: 900, lineHeight: 1 }}>
                {candidateB.percentage}%
              </span>
              <span style={{ fontSize: '1.35rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                {candidateB.count} {candidateB.count === 1 ? 'vote' : 'votes'}
              </span>
            </div>
          </div>
        </div>

        {/* High-Contrast Comparative Visualization Bar */}
        <div style={{
          background: 'var(--bg-surface-secondary)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 800 }}>
            <span style={{ color: 'var(--accent-cyan)' }}>
              Candidate A: {candidateA.percentage}% ({candidateA.count} {candidateA.count === 1 ? 'vote' : 'votes'})
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              {isDraw ? 'EXACT 50/50 SPLIT' : 'CLASSROOM DISTRIBUTION'}
            </span>
            <span style={{ color: 'var(--accent-purple)' }}>
              Candidate B: {candidateB.percentage}% ({candidateB.count} {candidateB.count === 1 ? 'vote' : 'votes'})
            </span>
          </div>

          {/* Split Stacked Bar with smooth CSS transition */}
          <div style={{
            height: '28px',
            width: '100%',
            background: '#e2e8f0',
            borderRadius: '14px',
            overflow: 'hidden',
            display: 'flex',
            boxShadow: 'inset 0 1px 3px rgba(15, 23, 42, 0.1)'
          }}>
            <div
              style={{
                width: `${totalResponses > 0 ? candidateA.percentage : 50}%`,
                background: 'linear-gradient(90deg, #0284c7, #38bdf8)',
                transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingLeft: '12px'
              }}
            />
            <div
              style={{
                width: `${totalResponses > 0 ? candidateB.percentage : 50}%`,
                background: 'linear-gradient(90deg, #a855f7, #7c3aed)',
                transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '12px'
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginTop: '0.2rem'
          }}>
            <span>&bull; {totalResponses} collective participant decisions recorded</span>
            <span>&bull; Anonymous classroom aggregate (zero individual player tracking)</span>
          </div>
        </div>

        {/* Presenter Context Footer Note */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          background: 'rgba(2, 132, 199, 0.05)',
          padding: '0.85rem 1.15rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(2, 132, 199, 0.15)',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem'
        }}>
          <Sparkles size={18} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
          <span>
            <strong style={{ color: 'var(--text-primary)' }}>Presenter Guide:</strong> Invite students to observe the classroom distribution before progressing to Round {Math.min(roundData.roundNumber + 1, 7)}.
          </span>
        </div>

      </div>
    </Card>
  );
};
