import React from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Scale, 
  CheckCircle2, 
  Play, 
  Users 
} from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { 
  FAIRNESS_STEPS_META, 
  CANDIDATE_FACTORS, 
  CANDIDATE_APPLICATION_DATA 
} from '../../shared/data/fairnessSteps';
import type { FairnessStepNumber, FairnessClassroomAggregates } from '../../shared/types';

interface HostFairnessViewProps {
  currentStep: FairnessStepNumber;
  onSetStep: (step: FairnessStepNumber) => void;
  classroomAggregates: FairnessClassroomAggregates;
  totalPlayers: number;
  readyPlayersCount: number;
  stageResponseCount: number;
  isActionInProgress?: boolean;
  onTransitionToFinal?: () => void;
}

export const HostFairnessView: React.FC<HostFairnessViewProps> = ({
  currentStep,
  onSetStep,
  classroomAggregates,
  totalPlayers,
  readyPlayersCount,
  stageResponseCount,
  isActionInProgress = false,
  onTransitionToFinal
}) => {
  const stepMeta = FAIRNESS_STEPS_META.find((s) => s.stepNumber === currentStep) || FAIRNESS_STEPS_META[0];
  const isFinalStep = currentStep === 9;

  const handleNext = () => {
    if (isActionInProgress || currentStep >= 9) return;
    onSetStep((currentStep + 1) as FairnessStepNumber);
  };

  const handlePrev = () => {
    if (isActionInProgress || currentStep <= 0) return;
    onSetStep((currentStep - 1) as FairnessStepNumber);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* 1. Projector Navigation & Progress Bar */}
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
          <Badge variant="cyan" pulse>
            <Scale size={13} style={{ marginRight: '4px' }} />
            CASE 9: MAKE IT FAIR
          </Badge>
          <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            STEP {currentStep} OF 9 &bull; {stepMeta.title}
          </span>
        </div>

        {/* Step Indicator Pills (0 to 9) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          {FAIRNESS_STEPS_META.map((s) => (
            <button
              key={s.stepNumber}
              onClick={() => !isActionInProgress && onSetStep(s.stepNumber)}
              disabled={isActionInProgress}
              style={{
                width: currentStep === s.stepNumber ? '26px' : '9px',
                height: '9px',
                borderRadius: '5px',
                border: 'none',
                background: currentStep === s.stepNumber 
                  ? 'var(--accent-cyan)' 
                  : s.stepNumber < currentStep 
                    ? 'var(--accent-purple)' 
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

      {/* 2. Main Step Presentation Screen */}
      <div className="animate-fade-in" key={`host-fairness-step-${currentStep}`}>
        
        {/* =================================================================== */}
        {/* STEP 0: Challenge Introduction & Readiness Room                    */}
        {/* =================================================================== */}
        {currentStep === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card glow="cyan" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
              <Badge variant="cyan" style={{ marginBottom: '1rem' }}>
                STAGE 2 &bull; RESPONSIBLE AI DESIGN
              </Badge>
              <h1 style={{ fontSize: '2.75rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 1rem 0', letterSpacing: '-0.02em' }}>
                MAKE IT FAIR
              </h1>
              <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 1.5rem auto', lineHeight: 1.6 }}>
                You saw how information can influence decisions.
                <br />
                Now you get to <strong>design the decision process</strong>.
              </p>

              <div style={{
                background: 'rgba(2, 132, 199, 0.05)',
                border: '1px solid rgba(2, 132, 199, 0.2)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem 1.75rem',
                maxWidth: '620px',
                margin: '0 auto 2rem auto'
              }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-cyan)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                  CORE PRINCIPLE
                </span>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  THERE ISN'T A MAGIC BUTTON FOR FAIRNESS.
                </p>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0 0' }}>
                  Let's see what deliberate choices and trade-offs actually matter.
                </p>
              </div>

              {/* Ready Counter & Host Start Trigger */}
              <div style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                background: '#ffffff',
                padding: '1.5rem 2.5rem',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Users size={22} color="var(--accent-cyan)" />
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Players Ready:{' '}
                    <strong className="font-mono text-cyan" style={{ fontSize: '1.4rem' }}>
                      {readyPlayersCount}
                    </strong>{' '}
                    / {totalPlayers}
                  </span>
                </div>

                <Button
                  variant="primary"
                  size="large"
                  icon={<Play size={18} />}
                  onClick={() => onSetStep(1)}
                  disabled={isActionInProgress}
                  id="btn-host-start-challenge"
                  style={{
                    minWidth: '240px',
                    fontSize: '1.05rem',
                    fontWeight: 900,
                    letterSpacing: '0.04em',
                    background: 'linear-gradient(135deg, #0284c7, #7c3aed)'
                  }}
                >
                  {isActionInProgress ? 'STARTING...' : 'START CHALLENGE'}
                </Button>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Only the Host can begin the challenge for the room
                </span>
              </div>
            </Card>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 1: Choose Relevant Information (Round 1)                      */}
        {/* =================================================================== */}
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card glow="cyan" style={{ padding: '1.75rem 2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <Badge variant="cyan" style={{ marginBottom: '0.5rem' }}>CHALLENGE ROUND 1</Badge>
                  <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                    Which information should the decision process focus on?
                  </h2>
                  <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                    Scenario Role: <strong style={{ color: 'var(--text-primary)' }}>Junior Software Developer</strong> &bull; Students are selecting criteria on their phones.
                  </p>
                </div>
                <div style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(2, 132, 199, 0.08)',
                  border: '1px solid rgba(2, 132, 199, 0.2)',
                  textAlign: 'right'
                }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block' }}>
                    STUDENT SUBMISSIONS
                  </span>
                  <span className="font-mono text-cyan" style={{ fontSize: '1.5rem', fontWeight: 900 }}>
                    {stageResponseCount} / {totalPlayers}
                  </span>
                </div>
              </div>

              {/* Factors Grid Display */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem',
                margin: '1.5rem 0'
              }}>
                {CANDIDATE_FACTORS.map((factor) => (
                  <div
                    key={factor.id}
                    style={{
                      background: '#ffffff',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.1rem',
                      boxShadow: '0 1px 4px rgba(15, 23, 42, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {factor.label}
                      </span>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        background: factor.category === 'qualification' 
                          ? 'rgba(16, 185, 129, 0.1)' 
                          : factor.category === 'contextual' 
                            ? 'rgba(245, 158, 11, 0.1)' 
                            : 'rgba(239, 68, 68, 0.1)',
                        color: factor.category === 'qualification' 
                          ? 'var(--color-success)' 
                          : factor.category === 'contextual' 
                            ? 'var(--color-warning)' 
                            : 'var(--color-danger)'
                      }}>
                        {factor.category.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                      Example: {factor.sample}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                      {factor.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Educational Principle Callout */}
              <div style={{
                background: 'var(--bg-surface-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem'
              }}>
                <CheckCircle2 size={24} color="var(--color-success)" style={{ flexShrink: 0 }} />
                <div>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                    PRINCIPLE: RELEVANCE MATTERS
                  </strong>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                    Information should have a clear, demonstrable connection to the decision being made. Relevance is contextual — location or education may matter in specific operational setups, but should never be assumed relevant by default.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 2: Build the Decision Rule (Round 2)                           */}
        {/* =================================================================== */}
        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card glow="purple" style={{ padding: '1.75rem 2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <Badge variant="purple" style={{ marginBottom: '0.5rem' }}>CHALLENGE ROUND 2</Badge>
                  <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                    Build Your Decision Rule: What should matter most?
                  </h2>
                  <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                    Students are setting explicit priority tiers: <strong>HIGH, MEDIUM, LOW, or EXCLUDE</strong>.
                  </p>
                </div>
                <div style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(124, 58, 237, 0.08)',
                  border: '1px solid rgba(124, 58, 237, 0.2)',
                  textAlign: 'right'
                }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block' }}>
                    RULES CONFIGURED
                  </span>
                  <span className="font-mono text-purple" style={{ fontSize: '1.5rem', fontWeight: 900 }}>
                    {stageResponseCount} / {totalPlayers}
                  </span>
                </div>
              </div>

              {/* Sample Understandable Rule Layout */}
              <div style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                margin: '1.5rem 0',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
              }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.5rem' }}>
                  STRUCTURE OF AN UNDERSTANDABLE DECISION PROCESS
                </span>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem'
                }}>
                  <div style={{ borderLeft: '4px solid var(--color-success)', paddingLeft: '0.85rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>1. HIGH PRIORITY</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Relevant Technical Skills &bull; Relevant Experience</div>
                  </div>
                  <div style={{ borderLeft: '4px solid var(--accent-cyan)', paddingLeft: '0.85rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>2. MEDIUM PRIORITY</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Relevant Projects &bull; Contextual Education</div>
                  </div>
                  <div style={{ borderLeft: '4px solid var(--border-subtle)', paddingLeft: '0.85rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-muted)' }}>3. EXCLUDED FACTORS</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Location, Name, Surface Presentation Style</div>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(124, 58, 237, 0.05)',
                border: '1px solid rgba(124, 58, 237, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem'
              }}>
                <strong style={{ color: 'var(--accent-purple)', fontSize: '0.95rem' }}>
                  PRESENTER FOCUS:
                </strong>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                  Explain that an algorithm is merely an encoded set of priorities. When criteria are explicit and transparent, humans can evaluate whether the system reflects intentional values.
                </span>
              </div>
            </Card>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 3: Apply the Rule (Round 3)                                    */}
        {/* =================================================================== */}
        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card glow="cyan" style={{ padding: '1.75rem 2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <Badge variant="cyan" style={{ marginBottom: '0.5rem' }}>CHALLENGE ROUND 3</Badge>
                  <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                    Apply Your Decision Process
                  </h2>
                  <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                    Students are deciding between Candidate A and Candidate B using their designed rule.
                  </p>
                </div>
                <div style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(2, 132, 199, 0.08)',
                  border: '1px solid rgba(2, 132, 199, 0.2)',
                  textAlign: 'right'
                }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block' }}>
                    DECISIONS RECORDED
                  </span>
                  <span className="font-mono text-cyan" style={{ fontSize: '1.5rem', fontWeight: 900 }}>
                    {stageResponseCount} / {totalPlayers}
                  </span>
                </div>
              </div>

              {/* Side-by-side Candidate Comparison */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.25rem',
                margin: '1.5rem 0'
              }}>
                <div style={{
                  background: '#ffffff',
                  border: '2px solid rgba(2, 132, 199, 0.3)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <Badge variant="cyan">CANDIDATE A</Badge>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      Skills Emphasis
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {CANDIDATE_APPLICATION_DATA.candidateA.attributes.map((attr) => (
                      <div key={attr.key} style={{ fontSize: '0.88rem' }}>
                        <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{attr.key}: </span>
                        <span style={{ color: 'var(--text-secondary)' }}>{attr.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{
                  background: '#ffffff',
                  border: '2px solid rgba(124, 58, 237, 0.3)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <Badge variant="purple">CANDIDATE B</Badge>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-purple)' }}>
                      Experience Emphasis
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {CANDIDATE_APPLICATION_DATA.candidateB.attributes.map((attr) => (
                      <div key={attr.key} style={{ fontSize: '0.88rem' }}>
                        <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{attr.key}: </span>
                        <span style={{ color: 'var(--text-secondary)' }}>{attr.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{
                background: 'var(--bg-surface-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)'
              }}>
                <strong style={{ color: 'var(--text-primary)' }}>LESSON:</strong> Students who prioritized technical skills will favor Candidate A, while those prioritizing team experience will select Candidate B. Neither is "biased" — the decision transparently traces back to an intentional priority.
              </div>
            </Card>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 4: Fairness Test (Test A — Unrelated Information)              */}
        {/* =================================================================== */}
        {currentStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card glow="cyan" style={{ padding: '1.75rem 2rem' }}>
              <Badge variant="cyan" style={{ marginBottom: '0.5rem' }}>FAIRNESS TEST A</Badge>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
                A decision process should be tested, not simply assumed to be fair.
              </h2>
              
              <div style={{
                background: 'var(--bg-surface-secondary)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                margin: '1.25rem 0'
              }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                  CONTROLLED TEST SCENARIO
                </span>
                <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0.5rem 0' }}>
                  Two candidates have similar job-relevant qualifications. One profile contains additional unrelated information.
                </p>
                <div style={{
                  padding: '1rem',
                  background: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  marginTop: '0.75rem'
                }}>
                  <strong style={{ fontSize: '1.15rem', color: 'var(--accent-cyan)' }}>
                    Question: Should the unrelated information change the decision?
                  </strong>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{ padding: '0.35rem 0.85rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', borderRadius: '6px', fontWeight: 700 }}>YES</span>
                    <span style={{ padding: '0.35rem 0.85rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', borderRadius: '6px', fontWeight: 700 }}>NO</span>
                    <span style={{ padding: '0.35rem 0.85rem', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)', borderRadius: '6px', fontWeight: 700 }}>DEPENDS ON CONTEXT</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Responses received: <strong className="font-mono text-cyan">{stageResponseCount}</strong> of {totalPlayers}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Encourage discussion: Why might context matter in borderline circumstances?
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 5: Consistency Test                                           */}
        {/* =================================================================== */}
        {currentStep === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card glow="purple" style={{ padding: '1.75rem 2rem' }}>
              <Badge variant="purple" style={{ marginBottom: '0.5rem' }}>FAIRNESS TEST B</Badge>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
                Consistency Test: Testing Robustness
              </h2>

              <div style={{
                background: 'var(--bg-surface-secondary)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                margin: '1.25rem 0'
              }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
                  "The relevant qualifications are the same.
                  <br />
                  Only unrelated information changes.
                  <br />
                  <span style={{ color: 'var(--accent-purple)' }}>Should the outcome change?"</span>
                </p>
              </div>

              <div style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5
              }}>
                <strong style={{ color: 'var(--text-primary)' }}>EDUCATIONAL PRINCIPLE:</strong> Testing whether irrelevant information changes outcomes teaches algorithmic consistency. When automated systems output different predictions solely due to variations in names, zip codes, or phrasing, it reveals hidden bias in training data or model weights.
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Student submissions: <strong className="font-mono text-purple">{stageResponseCount}</strong> of {totalPlayers}
                </span>
              </div>
            </Card>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 6: Transparency Test                                          */}
        {/* =================================================================== */}
        {currentStep === 6 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card glow="cyan" style={{ padding: '1.75rem 2rem' }}>
              <Badge variant="cyan" style={{ marginBottom: '0.5rem' }}>FAIRNESS TEST C</Badge>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
                Transparency Test: Can you explain the decision?
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.25rem',
                margin: '1.25rem 0'
              }}>
                <div style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)'
                }}>
                  <div style={{ fontWeight: 800, color: 'var(--color-success)', marginBottom: '0.75rem' }}>
                    DECISION AUDIT RECORD
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem' }}>
                    <div><span style={{ color: 'var(--color-success)', fontWeight: 800 }}>✓</span> Relevant skills verified</div>
                    <div><span style={{ color: 'var(--color-success)', fontWeight: 800 }}>✓</span> Relevant experience verified</div>
                    <div><span style={{ color: 'var(--color-success)', fontWeight: 800 }}>✓</span> Relevant projects verified</div>
                    <div style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                      <strong>Excluded from model:</strong> Name, Gender indicators, Location, Resume format
                    </div>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(2, 132, 199, 0.05)',
                  border: '1px solid rgba(2, 132, 199, 0.2)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Can you explain why the system made this decision?
                  </span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>
                    When criteria are documented and legible, decisions can be audited, validated, and held accountable.
                  </p>
                </div>
              </div>

              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Responses: <strong className="font-mono text-cyan">{stageResponseCount}</strong> / {totalPlayers}
              </div>
            </Card>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 7: Human Oversight                                             */}
        {/* =================================================================== */}
        {currentStep === 7 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card glow="purple" style={{ padding: '1.75rem 2rem' }}>
              <Badge variant="purple" style={{ marginBottom: '0.5rem' }}>FAIRNESS TEST D</Badge>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
                Human Oversight: Automated Systems &amp; Accountability
              </h2>

              <div style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                margin: '1.5rem 0',
                textAlign: 'center',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)'
              }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Should an automated decision always be accepted without review?
                </h3>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.25rem' }}>
                  <div style={{ padding: '0.75rem 2rem', background: 'rgba(239, 68, 68, 0.08)', color: 'var(--color-danger)', borderRadius: '8px', fontWeight: 800, fontSize: '1.1rem' }}>
                    NO (Oversight Needed)
                  </div>
                  <div style={{ padding: '0.75rem 2rem', background: 'rgba(2, 132, 199, 0.08)', color: 'var(--accent-cyan)', borderRadius: '8px', fontWeight: 800, fontSize: '1.1rem' }}>
                    YES (Full Trust)
                  </div>
                </div>
              </div>

              <div style={{
                background: 'var(--bg-surface-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                fontSize: '0.92rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5
              }}>
                <strong style={{ color: 'var(--text-primary)' }}>KEY TAKEAWAY:</strong> Automated systems can support decisions, but humans remain responsible for the impact. Oversight does not mean humans are inherently fairer; it means institutional accountability cannot be delegated to an algorithm.
              </div>

              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
                Responses: <strong className="font-mono text-purple">{stageResponseCount}</strong> / {totalPlayers}
              </div>
            </Card>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 8: Classroom Aggregate Results & Process Comparison            */}
        {/* =================================================================== */}
        {currentStep === 8 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card glow="cyan" style={{ padding: '1.75rem 2rem' }}>
              <Badge variant="cyan" style={{ marginBottom: '0.5rem' }}>CLASSROOM AGGREGATE RESULTS</Badge>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                Classroom Design Choices &amp; Comparison
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: '0.25rem 0 1.25rem 0' }}>
                Descriptive statistics based on actual session inputs across our classroom.
              </p>

              {/* Factors Aggregate Table */}
              <div style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                marginBottom: '1.5rem'
              }}>
                <div style={{ padding: '0.85rem 1.25rem', background: 'var(--bg-surface-secondary)', borderBottom: '1px solid var(--border-subtle)', fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  FACTORS SELECTED BY CLASSROOM (Total Participants: {classroomAggregates.totalParticipants || totalPlayers})
                </div>

                <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {CANDIDATE_FACTORS.map((f) => {
                    const count = classroomAggregates.factorsCount[f.id] || 0;
                    const denom = Math.max(1, classroomAggregates.totalParticipants || totalPlayers);
                    const pct = Math.min(100, Math.round((count / denom) * 100));

                    return (
                      <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '160px', fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                          {f.label}
                        </div>
                        <div style={{ flex: 1, height: '14px', background: 'var(--bg-surface-secondary)', borderRadius: '7px', overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${pct}%`,
                              background: f.category === 'qualification' ? 'var(--color-success)' : f.category === 'contextual' ? 'var(--accent-cyan)' : 'var(--accent-purple)',
                              borderRadius: '7px',
                              transition: 'width 0.4s ease'
                            }}
                          />
                        </div>
                        <div style={{ width: '80px', textAlign: 'right', fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                          {count} / {denom} ({pct}%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Side-by-side Process Comparison */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.25rem'
              }}>
                <div style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem'
                }}>
                  <div style={{ fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                    ORIGINAL APPROACH
                  </div>
                  <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <li>More information available without relevance checks</li>
                    <li>More opportunities for unrelated information to influence outcomes</li>
                    <li>Difficult to test which attributes drove decisions</li>
                  </ul>
                </div>

                <div style={{
                  background: '#ffffff',
                  border: '2px solid var(--accent-cyan)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.08)'
                }}>
                  <div style={{ fontWeight: 900, color: 'var(--accent-cyan)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                    DESIGNED APPROACH
                  </div>
                  <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <li>Relevant information deliberately prioritized</li>
                    <li>Irrelevant information excluded from algorithmic inputs</li>
                    <li>Decision process becomes easier to explain, audit, and test</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 9: The Key Reflection & Case 9 Message                         */}
        {/* =================================================================== */}
        {currentStep === 9 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card glow="purple" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
              <Badge variant="purple" style={{ marginBottom: '1rem' }}>
                SYNTHESIS &bull; CASE 9 COMPLETE
              </Badge>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 1rem 0' }}>
                YOU JUST DESIGNED A DECISION PROCESS.
              </h1>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                maxWidth: '800px',
                margin: '1.5rem auto'
              }}>
                <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--accent-cyan)' }}>1. What to include?</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0 0' }}>
                    Information with proven connection to the decision.
                  </p>
                </div>
                <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--accent-purple)' }}>2. What to leave out?</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0 0' }}>
                    Irrelevant factors that introduce accidental bias.
                  </p>
                </div>
                <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-success)' }}>3. How to test it?</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0 0' }}>
                    Consistency checks, transparency audits, and human oversight.
                  </p>
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08), rgba(124, 58, 237, 0.08))',
                borderRadius: 'var(--radius-xl)',
                padding: '1.75rem',
                maxWidth: '680px',
                margin: '1.5rem auto',
                border: '1px solid rgba(2, 132, 199, 0.2)'
              }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                  FAIRNESS IS NOT A BUTTON.
                </h3>
                <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', margin: '0.5rem 0 0 0', lineHeight: 1.6 }}>
                  It is an ongoing process of designing, testing, monitoring, and improving decisions.
                </p>
                <div style={{
                  marginTop: '1.25rem',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid rgba(2, 132, 199, 0.15)',
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: 'var(--accent-cyan)'
                }}>
                  Better decisions require more than better technology.<br />
                  They require better questions.
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <Badge variant="cyan">NEXT: CASE 10 &bull; THE FINAL DECISION</Badge>
                {onTransitionToFinal && (
                  <Button
                    variant="primary"
                    size="normal"
                    icon={<ArrowRight size={16} />}
                    onClick={onTransitionToFinal}
                    disabled={isActionInProgress}
                    id="btn-fairness-to-final-card"
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #0284c7)',
                      boxShadow: '0 4px 14px rgba(124, 58, 237, 0.25)'
                    }}
                  >
                    PROCEED TO FINAL RESULTS &bull; CASE 10
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}

      </div>

      {/* 3. Host Step Navigation Controller Footer */}
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
        <Button
          variant="secondary"
          size="normal"
          icon={<ArrowLeft size={16} />}
          onClick={handlePrev}
          disabled={isActionInProgress || currentStep <= 0}
          id="btn-fairness-prev"
        >
          PREVIOUS STEP
        </Button>

        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>
          Synchronizing with {totalPlayers} connected student devices
        </div>

        {isFinalStep && onTransitionToFinal ? (
          <Button
            variant="primary"
            size="normal"
            icon={<ArrowRight size={16} />}
            onClick={onTransitionToFinal}
            disabled={isActionInProgress}
            id="btn-fairness-next"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #0284c7)',
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.25)'
            }}
          >
            {isActionInProgress ? 'TRANSITIONING...' : 'PROCEED TO FINAL RESULTS'}
          </Button>
        ) : (
          <Button
            variant="primary"
            size="normal"
            icon={<ArrowRight size={16} />}
            onClick={handleNext}
            disabled={isActionInProgress || isFinalStep}
            id="btn-fairness-next"
          >
            {isActionInProgress 
              ? 'SYNCHRONIZING...' 
              : isFinalStep 
                ? 'CASE 9 COMPLETE' 
                : `NEXT STEP (${currentStep + 1} / 9)`}
          </Button>
        )}
      </div>

    </div>
  );
};
