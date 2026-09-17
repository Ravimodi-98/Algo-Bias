import React from 'react';
import { Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import type { RoundAggregate } from '../../shared/types';
import type { RoundData } from '../../shared/data/rounds';

interface PlayerResultsCardProps {
  aggregate: RoundAggregate;
  roundData: RoundData;
  userSelection: 'A' | 'B' | null;
  currentRound: number;
}

export const PlayerResultsCard: React.FC<PlayerResultsCardProps> = ({
  aggregate,
  roundData,
  userSelection,
  currentRound
}) => {
  const { candidateA, candidateB, totalResponses } = aggregate;
  const isFinalRound = currentRound >= 7;

  return (
    <Card glow="purple" className="animate-fade-in" style={{ padding: '1.25rem 1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center' }}>
        
        {/* Header Badges */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
          <Badge variant="cyan" pulse>
            <Sparkles size={12} style={{ marginRight: '4px' }} />
            THE CLASS DECISION
          </Badge>

          <h2 style={{
            fontSize: '1.45rem',
            fontWeight: 900,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
            margin: '0.2rem 0 0 0'
          }}>
            Round {currentRound} Result
          </h2>

          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Target Role: <strong style={{ color: 'var(--text-primary)' }}>{roundData.role}</strong>
          </span>
        </div>

        {/* Candidate Percentages & Visual Bars */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          background: 'var(--bg-surface-secondary)',
          padding: '1.15rem 1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          {/* Candidate A Result Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span className="font-mono text-cyan" style={{ fontSize: '0.9rem', fontWeight: 800 }}>
                  Candidate A
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  ({roundData.candidateA.name})
                </span>
                {userSelection === 'A' && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                    &bull; Your pick
                  </span>
                )}
              </div>
              <span className="font-mono text-cyan" style={{ fontSize: '1.2rem', fontWeight: 900 }}>
                {candidateA.percentage}%
              </span>
            </div>

            {/* Visual Bar */}
            <div style={{
              height: '14px',
              width: '100%',
              background: '#e2e8f0',
              borderRadius: '7px',
              overflow: 'hidden'
            }}>
              <div
                style={{
                  height: '100%',
                  width: `${candidateA.percentage}%`,
                  background: 'linear-gradient(90deg, #0284c7, #38bdf8)',
                  borderRadius: '7px',
                  transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
            </div>
          </div>

          {/* Candidate B Result Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span className="font-mono text-purple" style={{ fontSize: '0.9rem', fontWeight: 800 }}>
                  Candidate B
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  ({roundData.candidateB.name})
                </span>
                {userSelection === 'B' && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-purple)', fontWeight: 700 }}>
                    &bull; Your pick
                  </span>
                )}
              </div>
              <span className="font-mono text-purple" style={{ fontSize: '1.2rem', fontWeight: 900 }}>
                {candidateB.percentage}%
              </span>
            </div>

            {/* Visual Bar */}
            <div style={{
              height: '14px',
              width: '100%',
              background: '#e2e8f0',
              borderRadius: '7px',
              overflow: 'hidden'
            }}>
              <div
                style={{
                  height: '100%',
                  width: `${candidateB.percentage}%`,
                  background: 'linear-gradient(90deg, #a855f7, #7c3aed)',
                  borderRadius: '7px',
                  transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
            </div>
          </div>

          <div style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            textAlign: 'center',
            marginTop: '0.2rem'
          }}>
            {totalResponses} collective classroom {totalResponses === 1 ? 'response' : 'responses'} recorded
          </div>
        </div>

        {/* Neutral Reflection Statement */}
        <div style={{
          background: '#ffffff',
          padding: '0.85rem 1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.86rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.45
        }}>
          <p style={{ margin: 0, fontStyle: 'italic' }}>
            &ldquo;Interesting... The classroom decision pattern has been recorded.&rdquo;
          </p>
        </div>

        {/* Waiting for Host Pulse */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          fontSize: '0.82rem',
          fontWeight: 700,
          color: 'var(--accent-purple)'
        }}>
          <Clock size={15} />
          <span>
            {isFinalRound
              ? 'All rounds completed. Standing by for presenter...'
              : `Standing by for host to begin Round ${currentRound + 1}...`}
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.35rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          <CheckCircle2 size={13} color="var(--color-success)" />
          <span>Anonymous aggregate &bull; Your decision remains private</span>
        </div>

      </div>
    </Card>
  );
};
