import React from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck, 
  Compass, 
  Clock 
} from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { ROUND_COMPARISON_FACTS } from '../../shared/data/revealSteps';
import type { RoundAggregate } from '../../shared/types';

interface PlayerRevealViewProps {
  currentStep: number;
  allAggregates: Record<number, RoundAggregate>;
}

export const PlayerRevealView: React.FC<PlayerRevealViewProps> = ({
  currentStep,
  allAggregates
}) => {

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Top Mobile Step Tracker */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.6rem 0.9rem',
        background: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)'
      }}>
        <Badge variant="purple" pulse>
          <Sparkles size={11} style={{ marginRight: '4px' }} />
          BIAS REVEAL
        </Badge>
        <span className="font-mono text-purple" style={{ fontSize: '0.8rem', fontWeight: 800 }}>
          STEP {currentStep} OF 9
        </span>
      </div>

      {/* Main Step Card */}
      <Card glow="purple" style={{ padding: '1.5rem 1.25rem' }}>

        {/* STEP 1: The Transition */}
        {currentStep === 1 && (
          <div className="animate-fade-in" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', padding: '1rem 0' }}>
            <span style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1 }}>
              WAIT.
            </span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-purple)', lineHeight: 1.3 }}>
              Something interesting happened.
            </span>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Let&apos;s look back at the candidate decisions made by the classroom.
            </p>
          </div>
        )}

        {/* STEP 2: Classroom Decisions */}
        {currentStep === 2 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <Badge variant="purple">CLASSROOM DECISIONS</Badge>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0.4rem 0 0 0' }}>
                How the Group Decided
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {ROUND_COMPARISON_FACTS.slice(0, 5).map((fact) => {
                const agg = allAggregates[fact.roundNumber];
                const hasVotes = (agg?.totalResponses ?? 0) > 0;
                const pctA = hasVotes ? agg.candidateA.percentage : 0;
                const pctB = hasVotes ? agg.candidateB.percentage : 0;

                return (
                  <div
                    key={fact.roundNumber}
                    style={{
                      background: 'var(--bg-surface-secondary)',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.3rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span className="font-mono text-purple" style={{ fontWeight: 800 }}>R{fact.roundNumber}: {fact.title}</span>
                      <span style={{ fontWeight: 700 }}>
                        {hasVotes ? `A: ${pctA}% • B: ${pctB}%` : 'No votes recorded'}
                      </span>
                    </div>

                    <div style={{ height: '6px', width: '100%', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', display: 'flex' }}>
                      <div style={{ width: `${pctA}%`, background: 'var(--accent-cyan)' }} />
                      <div style={{ width: `${pctB}%`, background: 'var(--accent-purple)' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{
              background: 'rgba(124, 58, 237, 0.06)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'center',
              fontSize: '0.85rem',
              fontWeight: 800,
              color: 'var(--accent-purple)'
            }}>
              &ldquo;The decisions changed when the information changed.&rdquo;
            </div>
          </div>
        )}

        {/* STEP 3: What Changed? */}
        {currentStep === 3 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <Badge variant="cyan">WHAT CHANGED?</Badge>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0.4rem 0 0 0' }}>
                Comparing Candidate Profiles
              </h3>
            </div>

            <div style={{
              background: 'var(--bg-surface-secondary)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={16} color="var(--color-success)" />
                <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>CORE SKILLS: SIMILAR</strong>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                Technical competencies, years of experience, and project portfolios were comparable.
              </p>

              <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0.2rem 0' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <HelpCircle size={16} color="var(--accent-purple)" />
                <strong style={{ fontSize: '0.88rem', color: 'var(--accent-purple)' }}>SURROUNDING CONTEXT: DIFFERENT</strong>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                College name, location, applicant name, and resume formatting differed across scenarios.
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: Relevant vs Less Relevant Information */}
        {currentStep === 4 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <Badge variant="purple">CRITERIA RELEVANCE</Badge>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0.4rem 0 0 0' }}>
                Relevant vs. Less-Relevant
              </h3>
            </div>

            <div style={{
              background: 'rgba(2, 132, 199, 0.05)',
              border: '1px solid var(--accent-cyan)',
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)'
            }}>
              <strong style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>RELEVANT INFORMATION:</strong>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', marginTop: '0.2rem', fontWeight: 700 }}>
                Skills &bull; Direct Experience &bull; Projects &bull; Code Quality
              </div>
            </div>

            <div style={{
              background: 'rgba(124, 58, 237, 0.05)',
              border: '1px solid var(--accent-purple)',
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)'
            }}>
              <strong style={{ fontSize: '0.85rem', color: 'var(--accent-purple)' }}>LESS-RELEVANT INFORMATION:</strong>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', marginTop: '0.2rem', fontWeight: 700 }}>
                College Name &bull; Geographic City &bull; Candidate Name &bull; Resume Style
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', margin: 0, fontStyle: 'italic' }}>
              &ldquo;Some information may be relevant in one decision context and less relevant in another.&rdquo;
            </p>
          </div>
        )}

        {/* STEP 5: The Reflection Question */}
        {currentStep === 5 && (
          <div className="animate-fade-in" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', padding: '1rem 0' }}>
            <Badge variant="purple" pulse>REFLECT</Badge>
            <div style={{
              fontSize: '1.75rem',
              fontWeight: 900,
              color: 'var(--text-primary)',
              lineHeight: 1.25,
              letterSpacing: '-0.02em'
            }}>
              DID THE INFORMATION INFLUENCE THE DECISION?
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Notice how surrounding factors can subtly shift evaluations even when we intend to be purely objective.
            </p>
          </div>
        )}

        {/* STEP 6: Decisions Become Data */}
        {currentStep === 6 && (
          <div className="animate-fade-in" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Badge variant="cyan">STAGE 1 &bull; DATA</Badge>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              Decisions Become Data
            </h3>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              margin: '0.5rem 0'
            }}>
              <div style={{ background: 'var(--bg-surface-secondary)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                <span className="font-mono text-cyan" style={{ fontSize: '1.4rem', fontWeight: 900 }}>1</span>
              </div>
              <ArrowRight size={16} color="var(--text-muted)" />
              <div style={{ background: 'var(--bg-surface-secondary)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                <span className="font-mono text-cyan" style={{ fontSize: '1.4rem', fontWeight: 900 }}>100</span>
              </div>
              <ArrowRight size={16} color="var(--text-muted)" />
              <div style={{ background: 'rgba(2, 132, 199, 0.1)', border: '1px solid var(--accent-cyan)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                <span className="font-mono text-cyan" style={{ fontSize: '1.4rem', fontWeight: 900 }}>10,000</span>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Algorithms learn from patterns in the data they receive. If historical decisions contain patterns or assumptions, those patterns become part of the data.
            </p>
          </div>
        )}

        {/* STEP 7: The Algorithm */}
        {currentStep === 7 && (
          <div className="animate-fade-in" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Badge variant="purple">STAGE 2 &bull; ALGORITHM</Badge>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              The Algorithm
            </h3>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              margin: '0.5rem 0'
            }}>
              <div style={{ background: '#ffffff', border: '1px solid var(--accent-cyan)', padding: '0.5rem 0.8rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 800 }}>
                DATA
              </div>
              <ArrowRight size={14} color="var(--accent-purple)" />
              <div style={{ background: 'rgba(124, 58, 237, 0.08)', border: '1px solid var(--accent-purple)', padding: '0.5rem 0.8rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
                ALGORITHM
              </div>
              <ArrowRight size={14} color="var(--accent-purple)" />
              <div style={{ background: '#ffffff', border: '1px solid var(--accent-cyan)', padding: '0.5rem 0.8rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 800 }}>
                DECISION
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              An algorithm uses rules or learned patterns to produce outputs. If training data contains patterns, the system can reproduce or amplify them at scale.
            </p>
          </div>
        )}

        {/* STEP 8: Impact & Automation != Fairness */}
        {currentStep === 8 && (
          <div className="animate-fade-in" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Badge variant="warning">STAGE 4 &bull; IMPACT</Badge>

            <div style={{
              background: 'rgba(220, 38, 38, 0.06)',
              border: '2px solid var(--color-error)',
              padding: '0.9rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              width: '100%'
            }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--color-error)', letterSpacing: '-0.02em' }}>
                AUTOMATION ≠ FAIRNESS
              </div>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0.25rem 0 0 0' }}>
                Using an algorithm does not automatically make a decision fair.
              </p>
            </div>

            <div style={{
              background: '#ffffff',
              padding: '0.85rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              textAlign: 'left',
              width: '100%'
            }}>
              <div>&bull; Human decisions create data.</div>
              <div>&bull; Data influences algorithms.</div>
              <div>&bull; Algorithms produce automated decisions.</div>
              <div>&bull; Decisions affect real people.</div>
              <div style={{ marginTop: '0.3rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
                Fairness requires intentional human design and evaluation.
              </div>
            </div>
          </div>
        )}

        {/* STEP 9: The Way Forward */}
        {currentStep === 9 && (
          <div className="animate-fade-in" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', padding: '0.5rem 0' }}>
            <Badge variant="cyan" pulse>
              <Compass size={12} style={{ marginRight: '4px' }} />
              THE NEXT STEP
            </Badge>

            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              SO WHAT CAN WE DO?
            </h3>

            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
              Make the decision process more thoughtful.
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Standing by for the presenter to begin the <strong>Fairness Challenge</strong>...
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--accent-purple)',
              fontSize: '0.82rem',
              fontWeight: 700
            }}>
              <Clock size={14} />
              <span>Presenter is controlling the presentation</span>
            </div>
          </div>
        )}

      </Card>
    </div>
  );
};
