import React from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Layers, 
  Cpu, 
  FileText, 
  ShieldCheck, 
  HelpCircle,
  Compass
} from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { REVEAL_STEPS, ROUND_COMPARISON_FACTS } from '../../shared/data/revealSteps';
import type { RoundAggregate } from '../../shared/types';

interface HostRevealViewProps {
  currentStep: number;
  onSetStep: (step: number) => void;
  onTransitionToFairness: () => void;
  allAggregates: Record<number, RoundAggregate>;
  totalPlayers?: number;
  isActionInProgress?: boolean;
}

export const HostRevealView: React.FC<HostRevealViewProps> = ({
  currentStep,
  onSetStep,
  onTransitionToFairness,
  allAggregates,
  totalPlayers = 0,
  isActionInProgress = false
}) => {
  const stepMeta = REVEAL_STEPS.find((s) => s.stepNumber === currentStep) || REVEAL_STEPS[0];
  const isFinalStep = currentStep === 9;

  const handleNext = () => {
    if (isActionInProgress) return;
    if (isFinalStep) {
      onTransitionToFairness();
    } else {
      onSetStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (isActionInProgress || currentStep <= 1) return;
    onSetStep(currentStep - 1);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Projector Progress Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1rem 1.5rem',
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Badge variant="purple" pulse>
            <Sparkles size={13} style={{ marginRight: '4px' }} />
            EDUCATIONAL BIAS REVEAL
          </Badge>
          <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            STEP {currentStep} OF 9 &bull; {stepMeta.title.toUpperCase()}
          </span>
        </div>

        {/* Step Indicator Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {REVEAL_STEPS.map((s) => (
            <button
              key={s.stepNumber}
              onClick={() => !isActionInProgress && onSetStep(s.stepNumber)}
              disabled={isActionInProgress}
              style={{
                width: currentStep === s.stepNumber ? '28px' : '10px',
                height: '10px',
                borderRadius: '5px',
                border: 'none',
                background: currentStep === s.stepNumber 
                  ? 'var(--accent-purple)' 
                  : s.stepNumber < currentStep 
                    ? 'var(--accent-cyan)' 
                    : 'var(--border-subtle)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                padding: 0
              }}
              title={`Step ${s.stepNumber}: ${s.title}`}
            />
          ))}
        </div>
      </div>

      {/* Main Presentation Stage */}
      <Card glow="purple" style={{ padding: '2.5rem 2rem', minHeight: '440px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        
        {/* ========================================================================= */}
        {/* STEP 1: The Pause                                                        */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="animate-fade-in" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{
              fontSize: '5.5rem',
              fontWeight: 900,
              color: 'var(--text-primary)',
              letterSpacing: '-0.04em',
              lineHeight: 1
            }}>
              WAIT.
            </div>

            <div style={{
              fontSize: '2.25rem',
              fontWeight: 800,
              color: 'var(--accent-purple)',
              letterSpacing: '-0.02em',
              maxWidth: '650px'
            }}>
              Something interesting happened.
            </div>

            <p style={{
              fontSize: '1.25rem',
              color: 'var(--text-secondary)',
              maxWidth: '540px',
              margin: 0,
              lineHeight: 1.5
            }}>
              Let&apos;s look back at the decisions made by the classroom during the simulation.
            </p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: Classroom Decisions Summary                                      */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                Classroom Decisions Across Rounds
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', margin: '0.4rem 0 0 0' }}>
                Actual anonymized results recorded in this session. Notice how choices shifted between candidates.
              </p>
            </div>

            {/* Grid of session round decisions */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginTop: '0.5rem'
            }}>
              {ROUND_COMPARISON_FACTS.map((fact) => {
                const agg = allAggregates[fact.roundNumber];
                const total = agg?.totalResponses || 0;
                const pctA = agg?.candidateA.percentage || 0;
                const pctB = agg?.candidateB.percentage || 0;

                return (
                  <div
                    key={fact.roundNumber}
                    style={{
                      background: 'var(--bg-surface-secondary)',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="font-mono text-purple" style={{ fontSize: '0.8rem', fontWeight: 800 }}>
                        ROUND {fact.roundNumber}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {total} {total === 1 ? 'vote' : 'votes'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {fact.title}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                      <span style={{ color: 'var(--accent-cyan)', fontWeight: 800 }}>A: {pctA}%</span>
                      <span style={{ color: 'var(--accent-purple)', fontWeight: 800 }}>B: {pctB}%</span>
                    </div>

                    {/* Mini bar */}
                    <div style={{ height: '8px', width: '100%', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                      <div style={{ width: `${pctA}%`, background: 'var(--accent-cyan)' }} />
                      <div style={{ width: `${pctB}%`, background: 'var(--accent-purple)' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Key Observation Quote */}
            <div style={{
              background: 'rgba(124, 58, 237, 0.05)',
              border: '1px solid rgba(124, 58, 237, 0.15)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.5rem',
              textAlign: 'center',
              fontSize: '1.15rem',
              fontWeight: 800,
              color: 'var(--accent-purple)'
            }}>
              &ldquo;The decisions changed when the information changed.&rdquo;
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: What Changed?                                                    */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                What Changed Between Candidates?
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', margin: '0.4rem 0 0 0' }}>
                In several scenarios, candidate core qualifications were virtually identical. What differed was the surrounding context.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.25rem'
            }}>
              {/* Similar Attributes Card */}
              <div style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={20} color="var(--color-success)" />
                  <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                    CORE QUALIFICATIONS (SIMILAR)
                  </span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                  <li><strong>Technical Skills:</strong> Both candidates met core job criteria.</li>
                  <li><strong>Years of Experience:</strong> Similar depth and tenure.</li>
                  <li><strong>Project Deliverables:</strong> Relevant portfolio contributions.</li>
                </ul>
              </div>

              {/* Differentiating Factors Card */}
              <div style={{
                background: '#ffffff',
                border: '1px solid var(--accent-purple)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                boxShadow: '0 4px 16px rgba(124, 58, 237, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <HelpCircle size={20} color="var(--accent-purple)" />
                  <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--accent-purple)' }}>
                    ADDITIONAL ATTRIBUTES (DIFFERENT)
                  </span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                  <li><strong>College Pedigree:</strong> University reputation vs State institution.</li>
                  <li><strong>Geographic Location:</strong> Home city for remote-friendly roles.</li>
                  <li><strong>Candidate Name / Identity:</strong> Perceived background cues.</li>
                  <li><strong>Resume Presentation:</strong> Structured bullets vs Narrative text.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: Relevant vs. Less-Relevant Information                           */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                Information Relevance
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', margin: '0.4rem 0 0 0' }}>
                Not all information presented to an evaluator holds equal predictive value for job performance.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem'
            }}>
              {/* Relevant Information */}
              <div style={{
                background: 'rgba(2, 132, 199, 0.04)',
                border: '2px solid var(--accent-cyan)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <Badge variant="cyan">PRIMARY SIGNALS</Badge>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--accent-cyan)', margin: 0 }}>
                  Relevant Information
                </h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Attributes directly predictive of role execution:
                </p>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.8 }}>
                  <li>Demonstrated Technical Competencies</li>
                  <li>Relevant Work Experience</li>
                  <li>Portfolio Deliverables & Projects</li>
                  <li>Problem-Solving Assessments</li>
                </ul>
              </div>

              {/* Less Relevant Information */}
              <div style={{
                background: 'rgba(124, 58, 237, 0.04)',
                border: '2px solid var(--accent-purple)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <Badge variant="purple">CONTEXTUAL / NOISE SIGNALS</Badge>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--accent-purple)', margin: 0 }}>
                  Less-Relevant Information
                </h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Attributes with low or non-existent correlation to capability:
                </p>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.8 }}>
                  <li>Applicant Name / Perceived Demographics</li>
                  <li>Geographic City of Origin</li>
                  <li>College Brand Preconceptions</li>
                  <li>Resume Formatting & Presentation Tone</li>
                </ul>
              </div>
            </div>

            <div style={{
              background: 'var(--bg-surface-secondary)',
              padding: '1rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.95rem',
              color: 'var(--text-secondary)',
              textAlign: 'center'
            }}>
              <strong style={{ color: 'var(--text-primary)' }}>Key Nuance:</strong> Some information may be relevant in one decision context and less relevant in another. Context and intentionality define responsible evaluation.
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: The Reflection Question                                          */}
        {/* ========================================================================= */}
        {currentStep === 5 && (
          <div className="animate-fade-in" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', padding: '1.5rem 0' }}>
            <Badge variant="purple" pulse>
              <HelpCircle size={14} style={{ marginRight: '4px' }} />
              CLASSROOM REFLECTION MOMENT
            </Badge>

            <div style={{
              fontSize: '3rem',
              fontWeight: 900,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              lineHeight: 1.25,
              maxWidth: '750px'
            }}>
              DID THE INFORMATION INFLUENCE THE DECISION?
            </div>

            <p style={{
              fontSize: '1.25rem',
              color: 'var(--text-secondary)',
              maxWidth: '620px',
              margin: 0,
              lineHeight: 1.6
            }}>
              Take a pause. Notice how presentation formatting, geographic assumptions, or name associations can subtly guide human evaluations — even when reviewers strive to remain objective.
            </p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 6: Human Decisions Become Data                                      */}
        {/* ========================================================================= */}
        {currentStep === 6 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', textAlign: 'center', alignItems: 'center' }}>
            <Badge variant="cyan">STAGE 1: DATA</Badge>

            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              Imagine These Decisions Were Collected as Data
            </h2>

            {/* Scale Comparison Graphic */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap',
              margin: '1rem 0'
            }}>
              <div style={{ background: 'var(--bg-surface-secondary)', padding: '1.25rem 2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                <span className="font-mono text-cyan" style={{ fontSize: '2.5rem', fontWeight: 900 }}>1</span>
                <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>DECISION</span>
              </div>

              <ArrowRight size={24} color="var(--text-muted)" />

              <div style={{ background: 'var(--bg-surface-secondary)', padding: '1.25rem 2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                <span className="font-mono text-cyan" style={{ fontSize: '2.5rem', fontWeight: 900 }}>100</span>
                <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>DECISIONS</span>
              </div>

              <ArrowRight size={24} color="var(--text-muted)" />

              <div style={{ background: 'rgba(2, 132, 199, 0.08)', padding: '1.25rem 2rem', borderRadius: 'var(--radius-lg)', border: '2px solid var(--accent-cyan)' }}>
                <span className="font-mono text-cyan" style={{ fontSize: '2.5rem', fontWeight: 900 }}>10,000</span>
                <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 800 }}>DECISIONS</span>
              </div>
            </div>

            <div style={{
              maxWidth: '680px',
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6
            }}>
              Algorithms learn from patterns in the data they receive. If historical decisions contain patterns or unfair assumptions, those patterns become part of the data.
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 7: The Algorithm                                                    */}
        {/* ========================================================================= */}
        {currentStep === 7 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', textAlign: 'center', alignItems: 'center' }}>
            <Badge variant="purple">STAGE 2 &bull; ALGORITHM & DECISION</Badge>

            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              How Algorithms Process Patterns
            </h2>

            {/* Sequence flow */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              margin: '0.5rem 0'
            }}>
              <div style={{ background: '#ffffff', border: '2px solid var(--accent-cyan)', padding: '1.25rem 2rem', borderRadius: 'var(--radius-md)' }}>
                <Layers size={24} color="var(--accent-cyan)" style={{ marginBottom: '4px' }} />
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>DATA</div>
              </div>

              <ArrowRight size={24} color="var(--accent-purple)" />

              <div style={{ background: 'rgba(124, 58, 237, 0.08)', border: '2px solid var(--accent-purple)', padding: '1.25rem 2rem', borderRadius: 'var(--radius-md)' }}>
                <Cpu size={24} color="var(--accent-purple)" style={{ marginBottom: '4px' }} />
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--accent-purple)' }}>ALGORITHM</div>
              </div>

              <ArrowRight size={24} color="var(--accent-purple)" />

              <div style={{ background: '#ffffff', border: '2px solid var(--accent-cyan)', padding: '1.25rem 2rem', borderRadius: 'var(--radius-md)' }}>
                <FileText size={24} color="var(--accent-cyan)" style={{ marginBottom: '4px' }} />
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>DECISION</div>
              </div>
            </div>

            <div style={{ maxWidth: '680px', fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              An algorithm uses rules or learned patterns to produce an output. If the data or design contains problematic patterns, the system can reproduce or amplify them at scale.
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 8: Impact & Automation ≠ Fairness                                   */}
        {/* ========================================================================= */}
        {currentStep === 8 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', textAlign: 'center', alignItems: 'center' }}>
            <Badge variant="warning">STAGE 4 &bull; IMPACT</Badge>

            {/* Complete pipeline diagram */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.85rem',
              flexWrap: 'wrap'
            }}>
              <span className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>DATA</span>
              <ArrowRight size={18} color="var(--text-muted)" />
              <span className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--accent-purple)' }}>ALGORITHM</span>
              <ArrowRight size={18} color="var(--text-muted)" />
              <span className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>DECISION</span>
              <ArrowRight size={18} color="var(--text-muted)" />
              <span className="font-mono text-cyan" style={{ fontSize: '1.35rem', fontWeight: 900, textDecoration: 'underline' }}>IMPACT</span>
            </div>

            <div style={{
              background: 'rgba(220, 38, 38, 0.05)',
              border: '2px solid var(--color-error)',
              padding: '1.25rem 2.5rem',
              borderRadius: 'var(--radius-lg)'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--color-error)', letterSpacing: '-0.02em' }}>
                AUTOMATION ≠ FAIRNESS
              </div>
              <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0.35rem 0 0 0' }}>
                Using an algorithm does not automatically make a decision fair.
              </p>
            </div>

            <div style={{
              background: '#ffffff',
              padding: '1.25rem 2rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              maxWidth: '700px',
              textAlign: 'left',
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7
            }}>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>The Full Chain:</div>
              <div>&bull; Human decisions create data.</div>
              <div>&bull; Data influences algorithms.</div>
              <div>&bull; Algorithms produce automated decisions.</div>
              <div>&bull; Those decisions have real-world impacts on real people.</div>
              <div style={{ marginTop: '0.4rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
                Therefore, fairness must be considered throughout the entire process.
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 9: The Way Forward (Toward Case 9)                                  */}
        {/* ========================================================================= */}
        {currentStep === 9 && (
          <div className="animate-fade-in" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.75rem' }}>
            <Badge variant="cyan" pulse>
              <Compass size={14} style={{ marginRight: '4px' }} />
              THE WAY FORWARD
            </Badge>

            <div style={{
              fontSize: '3rem',
              fontWeight: 900,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em'
            }}>
              SO WHAT CAN WE DO?
            </div>

            <div style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              color: 'var(--accent-cyan)',
              maxWidth: '640px'
            }}>
              Make the decision process more thoughtful.
            </div>

            <p style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              maxWidth: '560px',
              lineHeight: 1.6,
              margin: 0
            }}>
              Next, students will participate in the <strong>Fairness Challenge</strong>: deciding which attributes an algorithm should be allowed to evaluate to ensure fairness and transparency.
            </p>

            <div style={{ marginTop: '1rem' }}>
              <Button
                variant="primary"
                size="large"
                icon={<ArrowRight size={18} />}
                onClick={onTransitionToFairness}
                disabled={isActionInProgress}
                id="btn-host-transition-fairness"
              >
                {isActionInProgress ? 'TRANSITIONING...' : 'CONTINUE TO FAIRNESS CHALLENGE'}
              </Button>
            </div>
          </div>
        )}

      </Card>

      {/* Host Navigation Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1.25rem',
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)'
      }}>
        <Button
          variant="secondary"
          size="normal"
          icon={<ArrowLeft size={16} />}
          onClick={handlePrev}
          disabled={isActionInProgress || currentStep <= 1}
          id="btn-reveal-prev"
        >
          PREVIOUS STEP
        </Button>

        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>
          Controlling Projector &amp; {totalPlayers} Student Devices
        </div>

        <Button
          variant="primary"
          size="normal"
          icon={<ArrowRight size={16} />}
          onClick={handleNext}
          disabled={isActionInProgress}
          id="btn-reveal-next"
        >
          {isActionInProgress 
            ? 'SYNCHRONIZING...' 
            : isFinalStep 
              ? 'CONTINUE TO FAIRNESS' 
              : `NEXT STEP (${currentStep + 1} / 9)`}
        </Button>
      </div>

    </div>
  );
};
