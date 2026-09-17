import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  ThumbsUp, 
  Check 
} from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { 
  FAIRNESS_STEPS_META, 
  CANDIDATE_FACTORS, 
  DEFAULT_PRIORITIES 
} from '../../shared/data/fairnessSteps';
import { gameService } from '../../services/game/gameService';
import type { 
  FairnessStepNumber, 
  PriorityLevel, 
  FairnessClassroomAggregates, 
  PlayerSession 
} from '../../shared/types';

interface PlayerFairnessViewProps {
  currentStep: FairnessStepNumber;
  session: PlayerSession;
  classroomAggregates?: FairnessClassroomAggregates;
}

export const PlayerFairnessView: React.FC<PlayerFairnessViewProps> = ({
  currentStep,
  session,
  classroomAggregates
}) => {
  // Local state for interactive choices
  const [isReady, setIsReady] = useState<boolean>(false);
  const [selectedFactors, setSelectedFactors] = useState<string[]>(['skills', 'experience', 'projects']);
  const [priorities, setPriorities] = useState<Record<string, PriorityLevel>>(DEFAULT_PRIORITIES);
  const [selectedCandidate, setSelectedCandidate] = useState<'A' | 'B' | null>(null);
  const [fairnessTestAnswer, setFairnessTestAnswer] = useState<'YES' | 'NO' | 'DEPENDS' | null>(null);
  const [consistencyTestAnswer, setConsistencyTestAnswer] = useState<'YES' | 'NO' | 'DEPENDS' | null>(null);
  const [transparencyTestAnswer, setTransparencyTestAnswer] = useState<'YES' | 'NO' | null>(null);
  const [oversightAnswer, setOversightAnswer] = useState<'YES' | 'NO' | null>(null);

  // Submitting / submitted feedback states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmittedCurrentStep, setHasSubmittedCurrentStep] = useState<boolean>(false);

  const stepMeta = FAIRNESS_STEPS_META.find((s) => s.stepNumber === currentStep) || FAIRNESS_STEPS_META[0];

  // Restore prior response on stage change or page reload
  useEffect(() => {
    let isMounted = true;
    setHasSubmittedCurrentStep(false);

    const loadPriorResponse = async () => {
      if (!session.sessionId || !session.playerId) return;

      const stageKey = stepMeta.stageKey;
      const prior = await gameService.getPlayerFairnessResponse(
        session.sessionId,
        session.playerId,
        stageKey
      );

      if (prior && prior.response && isMounted) {
        setHasSubmittedCurrentStep(true);
        const resp = prior.response;

        if (resp.ready !== undefined) setIsReady(resp.ready);
        if (resp.selectedFactors) setSelectedFactors(resp.selectedFactors);
        if (resp.priorities) setPriorities(resp.priorities);
        if (resp.selectedCandidate) setSelectedCandidate(resp.selectedCandidate);
        if (stageKey === 'fairness_test' && resp.testAnswer) setFairnessTestAnswer(resp.testAnswer);
        if (stageKey === 'consistency_test' && resp.testAnswer) setConsistencyTestAnswer(resp.testAnswer);
        if (stageKey === 'transparency_test' && resp.testAnswer) setTransparencyTestAnswer(resp.testAnswer as any);
        if (stageKey === 'human_oversight' && (resp.humanOversightAnswer || resp.testAnswer)) {
          setOversightAnswer(resp.humanOversightAnswer || (resp.testAnswer as any));
        }
      }
    };

    loadPriorResponse();
    return () => { isMounted = false; };
  }, [currentStep, session.sessionId, session.playerId, stepMeta.stageKey]);

  // Generic submission handler
  const handleGenericSubmit = async (stageKey: string, payload: any) => {
    if (isSubmitting || !session.sessionId || !session.playerId) return;
    setIsSubmitting(true);

    try {
      await gameService.submitFairnessResponse(
        session.sessionId,
        session.playerId,
        stageKey,
        payload
      );
      setHasSubmittedCurrentStep(true);
    } catch (err) {
      console.error('Error submitting fairness response:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle factor selection
  const toggleFactor = (id: string) => {
    if (hasSubmittedCurrentStep) return;
    setSelectedFactors((prev) => 
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // Update factor priority
  const setFactorPriority = (factorId: string, level: PriorityLevel) => {
    if (hasSubmittedCurrentStep) return;
    setPriorities((prev) => ({ ...prev, [factorId]: level }));
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Step Header Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Badge variant="cyan">
          <Scale size={12} style={{ marginRight: '4px' }} />
          MAKE IT FAIR &bull; STEP {currentStep} OF 9
        </Badge>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
          {stepMeta.badge}
        </span>
      </div>

      {/* ===================================================================== */}
      {/* STEP 0: Challenge Introduction & Readiness                            */}
      {/* ===================================================================== */}
      {currentStep === 0 && (
        <Card glow="cyan">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center', padding: '0.5rem 0' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(2, 132, 199, 0.1)',
              color: 'var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto'
            }}>
              <Scale size={28} />
            </div>

            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                MAKE IT FAIR
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: '0.5rem 0 0 0', lineHeight: 1.5 }}>
                Your goal: Design a decision process that focuses on information that actually matters.
              </p>
            </div>

            <div style={{
              background: 'var(--bg-surface-secondary)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5
            }}>
              <strong style={{ color: 'var(--text-primary)' }}>THERE ISN'T A MAGIC BUTTON FOR FAIRNESS.</strong>
              <br />
              Let's see what deliberate choices matter.
            </div>

            {hasSubmittedCurrentStep || isReady ? (
              <div style={{
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                color: 'var(--color-success)',
                fontWeight: 700,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <Check size={18} />
                <span>You are ready! Waiting for the host to begin...</span>
              </div>
            ) : (
              <Button
                variant="primary"
                size="large"
                icon={<ThumbsUp size={18} />}
                onClick={() => {
                  setIsReady(true);
                  handleGenericSubmit('ready', { ready: true });
                }}
                disabled={isSubmitting}
                id="btn-player-ready"
                style={{ width: '100%', minHeight: '48px', fontSize: '1.05rem', fontWeight: 800 }}
              >
                {isSubmitting ? 'SAVING...' : "I'M READY / START"}
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* ===================================================================== */}
      {/* STEP 1: Choose Relevant Information                                   */}
      {/* ===================================================================== */}
      {currentStep === 1 && (
        <Card glow="cyan">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                SCENARIO: JUNIOR SOFTWARE DEVELOPER
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.2rem 0 0 0' }}>
                Which information should the decision process focus on?
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                Tap the information cards you consider relevant for this role.
              </p>
            </div>

            {/* Factors Selection List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {CANDIDATE_FACTORS.map((f) => {
                const isSelected = selectedFactors.includes(f.id);

                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggleFactor(f.id)}
                    disabled={hasSubmittedCurrentStep}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.85rem 1rem',
                      background: isSelected ? 'rgba(2, 132, 199, 0.06)' : '#ffffff',
                      border: isSelected ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'left',
                      cursor: hasSubmittedCurrentStep ? 'default' : 'pointer',
                      transition: 'all 0.2s ease',
                      width: '100%'
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      border: isSelected ? '2px solid var(--accent-cyan)' : '2px solid var(--border-subtle)',
                      background: isSelected ? 'var(--accent-cyan)' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {f.label}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                          {f.sample}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0', lineHeight: 1.3 }}>
                        {f.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Principle Card */}
            <div style={{
              background: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)'
            }}>
              <strong style={{ color: 'var(--text-primary)' }}>RELEVANCE MATTERS:</strong> Information should have a clear connection to the decision. Relevance depends on the decision context.
            </div>

            {hasSubmittedCurrentStep ? (
              <div style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.1)',
                color: 'var(--color-success)',
                fontWeight: 700,
                fontSize: '0.9rem',
                textAlign: 'center'
              }}>
                ✓ Criteria selection saved! Waiting for host to advance...
              </div>
            ) : (
              <Button
                variant="primary"
                size="normal"
                onClick={() => handleGenericSubmit('factors', { selectedFactors })}
                disabled={isSubmitting || selectedFactors.length === 0}
                style={{ width: '100%', minHeight: '44px', fontWeight: 800 }}
              >
                {isSubmitting ? 'SAVING...' : 'CONFIRM RELEVANT INFORMATION'}
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* ===================================================================== */}
      {/* STEP 2: Build the Decision Rule                                       */}
      {/* ===================================================================== */}
      {currentStep === 2 && (
        <Card glow="purple">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-purple)', textTransform: 'uppercase' }}>
                CHALLENGE ROUND 2
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.2rem 0 0 0' }}>
                Build Your Decision Rule
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                Assign priorities to factors to define your explicit decision rule.
              </p>
            </div>

            {/* Priority Selectors */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {CANDIDATE_FACTORS.map((f) => {
                const currentPriority = priorities[f.id] || 'EXCLUDE';
                const tiers: PriorityLevel[] = ['HIGH', 'MEDIUM', 'LOW', 'EXCLUDE'];

                return (
                  <div
                    key={f.id}
                    style={{
                      background: '#ffffff',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {f.label}
                      </span>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        color: currentPriority === 'HIGH' ? 'var(--color-success)' : currentPriority === 'MEDIUM' ? 'var(--accent-cyan)' : currentPriority === 'LOW' ? 'var(--accent-purple)' : 'var(--text-muted)'
                      }}>
                        {currentPriority}
                      </span>
                    </div>

                    {/* Priority Tier Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.35rem' }}>
                      {tiers.map((tier) => {
                        const isTier = currentPriority === tier;
                        return (
                          <button
                            key={tier}
                            type="button"
                            onClick={() => setFactorPriority(f.id, tier)}
                            disabled={hasSubmittedCurrentStep}
                            style={{
                              padding: '0.35rem 0',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              borderRadius: '4px',
                              border: isTier ? '1px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
                              background: isTier ? 'rgba(124, 58, 237, 0.12)' : 'var(--bg-surface-secondary)',
                              color: isTier ? 'var(--accent-purple)' : 'var(--text-secondary)',
                              cursor: hasSubmittedCurrentStep ? 'default' : 'pointer'
                            }}
                          >
                            {tier}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Generated Readable Summary Card */}
            <div style={{
              background: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-purple)', textTransform: 'uppercase' }}>
                YOUR READABLE DECISION RULE:
              </span>
              <ul style={{ margin: '0.35rem 0 0 0', paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                <li><strong>High:</strong> {Object.keys(priorities).filter(k => priorities[k] === 'HIGH').join(', ') || 'None'}</li>
                <li><strong>Medium:</strong> {Object.keys(priorities).filter(k => priorities[k] === 'MEDIUM').join(', ') || 'None'}</li>
                <li><strong>Excluded:</strong> {Object.keys(priorities).filter(k => priorities[k] === 'EXCLUDE').join(', ') || 'None'}</li>
              </ul>
            </div>

            {hasSubmittedCurrentStep ? (
              <div style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.1)',
                color: 'var(--color-success)',
                fontWeight: 700,
                fontSize: '0.9rem',
                textAlign: 'center'
              }}>
                ✓ Decision rule locked in! Waiting for host...
              </div>
            ) : (
              <Button
                variant="primary"
                size="normal"
                onClick={() => handleGenericSubmit('rule', { priorities })}
                disabled={isSubmitting}
                style={{ width: '100%', minHeight: '44px', fontWeight: 800, background: 'linear-gradient(135deg, #7c3aed, #0284c7)' }}
              >
                {isSubmitting ? 'SAVING...' : 'SAVE DECISION RULE'}
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* ===================================================================== */}
      {/* STEP 3: Apply the Rule                                                */}
      {/* ===================================================================== */}
      {currentStep === 3 && (
        <Card glow="cyan">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                CHALLENGE ROUND 3
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.2rem 0 0 0' }}>
                Apply Your Rule: Who Should Advance?
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                Compare candidates based on the priority rules you created.
              </p>
            </div>

            {/* Candidate Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Candidate A */}
              <button
                type="button"
                onClick={() => !hasSubmittedCurrentStep && setSelectedCandidate('A')}
                disabled={hasSubmittedCurrentStep}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: selectedCandidate === 'A' ? 'rgba(2, 132, 199, 0.08)' : '#ffffff',
                  border: selectedCandidate === 'A' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  textAlign: 'left',
                  cursor: hasSubmittedCurrentStep ? 'default' : 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <Badge variant="cyan">CANDIDATE A</Badge>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>Stronger Skills</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  <div><strong>Skills:</strong> Strong (Python, SQL, React API)</div>
                  <div><strong>Experience:</strong> Medium (1 summer internship)</div>
                  <div><strong>Projects:</strong> Strong (Inventory App)</div>
                </div>
              </button>

              {/* Candidate B */}
              <button
                type="button"
                onClick={() => !hasSubmittedCurrentStep && setSelectedCandidate('B')}
                disabled={hasSubmittedCurrentStep}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: selectedCandidate === 'B' ? 'rgba(124, 58, 237, 0.08)' : '#ffffff',
                  border: selectedCandidate === 'B' ? '2px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
                  textAlign: 'left',
                  cursor: hasSubmittedCurrentStep ? 'default' : 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <Badge variant="purple">CANDIDATE B</Badge>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-purple)' }}>Stronger Experience</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  <div><strong>Skills:</strong> Medium (Python, Basic SQL)</div>
                  <div><strong>Experience:</strong> Strong (2 internships + team lead)</div>
                  <div><strong>Projects:</strong> Strong (Open source contributor)</div>
                </div>
              </button>
            </div>

            {hasSubmittedCurrentStep ? (
              <div style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.1)',
                color: 'var(--color-success)',
                fontWeight: 700,
                fontSize: '0.9rem',
                textAlign: 'center'
              }}>
                ✓ Decision submitted: Candidate {selectedCandidate}!
              </div>
            ) : (
              <Button
                variant="primary"
                size="normal"
                onClick={() => handleGenericSubmit('apply', { selectedCandidate })}
                disabled={isSubmitting || !selectedCandidate}
                style={{ width: '100%', minHeight: '44px', fontWeight: 800 }}
              >
                {isSubmitting ? 'SAVING...' : `ADVANCE CANDIDATE ${selectedCandidate || '...'}`}
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* ===================================================================== */}
      {/* STEP 4: Fairness Test (Unrelated Information)                         */}
      {/* ===================================================================== */}
      {currentStep === 4 && (
        <Card glow="cyan">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Badge variant="cyan">FAIRNESS TEST A</Badge>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Should unrelated information change the decision?
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              Two candidates have similar job-relevant qualifications. One profile contains additional unrelated information (e.g. personal leisure hobby).
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(['NO', 'DEPENDS', 'YES'] as const).map((opt) => {
                const isChosen = fairnessTestAnswer === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => !hasSubmittedCurrentStep && setFairnessTestAnswer(opt)}
                    disabled={hasSubmittedCurrentStep}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      background: isChosen ? 'rgba(2, 132, 199, 0.1)' : 'var(--bg-surface-secondary)',
                      border: isChosen ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      color: isChosen ? 'var(--accent-cyan)' : 'var(--text-primary)',
                      cursor: hasSubmittedCurrentStep ? 'default' : 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    {opt === 'DEPENDS' ? 'DEPENDS ON CONTEXT' : opt}
                  </button>
                );
              })}
            </div>

            {hasSubmittedCurrentStep ? (
              <div style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.1)',
                color: 'var(--color-success)',
                fontWeight: 700,
                fontSize: '0.9rem',
                textAlign: 'center'
              }}>
                ✓ Test answer recorded!
              </div>
            ) : (
              <Button
                variant="primary"
                size="normal"
                onClick={() => handleGenericSubmit('fairness_test', { testAnswer: fairnessTestAnswer })}
                disabled={isSubmitting || !fairnessTestAnswer}
                style={{ width: '100%', minHeight: '44px', fontWeight: 800 }}
              >
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT ANSWER'}
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* ===================================================================== */}
      {/* STEP 5: Consistency Test                                              */}
      {/* ===================================================================== */}
      {currentStep === 5 && (
        <Card glow="purple">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Badge variant="purple">FAIRNESS TEST B</Badge>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Consistency Test
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              The relevant qualifications are the same. Only unrelated information changes.
              <br />
              <strong>Should the outcome change?</strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(['NO', 'DEPENDS', 'YES'] as const).map((opt) => {
                const isChosen = consistencyTestAnswer === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => !hasSubmittedCurrentStep && setConsistencyTestAnswer(opt)}
                    disabled={hasSubmittedCurrentStep}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      background: isChosen ? 'rgba(124, 58, 237, 0.1)' : 'var(--bg-surface-secondary)',
                      border: isChosen ? '2px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      color: isChosen ? 'var(--accent-purple)' : 'var(--text-primary)',
                      cursor: hasSubmittedCurrentStep ? 'default' : 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    {opt === 'DEPENDS' ? 'DEPENDS ON CONTEXT' : opt}
                  </button>
                );
              })}
            </div>

            {hasSubmittedCurrentStep ? (
              <div style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.1)',
                color: 'var(--color-success)',
                fontWeight: 700,
                fontSize: '0.9rem',
                textAlign: 'center'
              }}>
                ✓ Consistency evaluation submitted!
              </div>
            ) : (
              <Button
                variant="purple"
                size="normal"
                onClick={() => handleGenericSubmit('consistency_test', { testAnswer: consistencyTestAnswer })}
                disabled={isSubmitting || !consistencyTestAnswer}
                style={{ width: '100%', minHeight: '44px', fontWeight: 800 }}
              >
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT ANSWER'}
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* ===================================================================== */}
      {/* STEP 6: Transparency Test                                             */}
      {/* ===================================================================== */}
      {currentStep === 6 && (
        <Card glow="cyan">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Badge variant="cyan">FAIRNESS TEST C</Badge>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Can you explain why the system made this decision?
            </h2>

            <div style={{
              background: 'var(--bg-surface-secondary)',
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)'
            }}>
              <div><strong style={{ color: 'var(--color-success)' }}>✓ Included:</strong> Relevant skills, experience, projects</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>✕ Excluded:</strong> Name, location, presentation style</div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {(['YES', 'NO'] as const).map((opt) => {
                const isChosen = transparencyTestAnswer === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => !hasSubmittedCurrentStep && setTransparencyTestAnswer(opt)}
                    disabled={hasSubmittedCurrentStep}
                    style={{
                      flex: 1,
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      background: isChosen ? 'rgba(2, 132, 199, 0.1)' : 'var(--bg-surface-secondary)',
                      border: isChosen ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                      fontWeight: 800,
                      fontSize: '1rem',
                      color: isChosen ? 'var(--accent-cyan)' : 'var(--text-primary)',
                      cursor: hasSubmittedCurrentStep ? 'default' : 'pointer'
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {hasSubmittedCurrentStep ? (
              <div style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.1)',
                color: 'var(--color-success)',
                fontWeight: 700,
                fontSize: '0.9rem',
                textAlign: 'center'
              }}>
                ✓ Answer saved!
              </div>
            ) : (
              <Button
                variant="primary"
                size="normal"
                onClick={() => handleGenericSubmit('transparency_test', { testAnswer: transparencyTestAnswer })}
                disabled={isSubmitting || !transparencyTestAnswer}
                style={{ width: '100%', minHeight: '44px', fontWeight: 800 }}
              >
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT ANSWER'}
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* ===================================================================== */}
      {/* STEP 7: Human Oversight                                               */}
      {/* ===================================================================== */}
      {currentStep === 7 && (
        <Card glow="purple">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Badge variant="purple">FAIRNESS TEST D</Badge>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Should an automated decision always be accepted without review?
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              Automated systems can support decisions, but human accountability still matters.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {(['NO', 'YES'] as const).map((opt) => {
                const isChosen = oversightAnswer === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => !hasSubmittedCurrentStep && setOversightAnswer(opt)}
                    disabled={hasSubmittedCurrentStep}
                    style={{
                      flex: 1,
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      background: isChosen ? 'rgba(124, 58, 237, 0.1)' : 'var(--bg-surface-secondary)',
                      border: isChosen ? '2px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
                      fontWeight: 800,
                      fontSize: '1rem',
                      color: isChosen ? 'var(--accent-purple)' : 'var(--text-primary)',
                      cursor: hasSubmittedCurrentStep ? 'default' : 'pointer'
                    }}
                  >
                    {opt === 'NO' ? 'NO (Need Review)' : 'YES (Accept)'}
                  </button>
                );
              })}
            </div>

            {hasSubmittedCurrentStep ? (
              <div style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.1)',
                color: 'var(--color-success)',
                fontWeight: 700,
                fontSize: '0.9rem',
                textAlign: 'center'
              }}>
                ✓ Oversight perspective recorded!
              </div>
            ) : (
              <Button
                variant="purple"
                size="normal"
                onClick={() => handleGenericSubmit('human_oversight', { humanOversightAnswer: oversightAnswer })}
                disabled={isSubmitting || !oversightAnswer}
                style={{ width: '100%', minHeight: '44px', fontWeight: 800 }}
              >
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT ANSWER'}
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* ===================================================================== */}
      {/* STEP 8: Classroom Aggregate Results & Comparison                      */}
      {/* ===================================================================== */}
      {currentStep === 8 && (
        <Card glow="cyan">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Badge variant="cyan">CLASSROOM AGGREGATE</Badge>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Classroom Design Choices
            </h2>

            {classroomAggregates && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {CANDIDATE_FACTORS.map((f) => {
                  const count = classroomAggregates.factorsCount[f.id] || 0;
                  const total = Math.max(1, classroomAggregates.totalParticipants || 1);
                  const pct = Math.round((count / total) * 100);

                  return (
                    <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.4rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{f.label}</span>
                      <span style={{ color: 'var(--accent-cyan)', fontWeight: 800 }}>{count} / {total} ({pct}%)</span>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{
              background: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.4
            }}>
              <strong>PROCESS COMPARISON:</strong> Unlike the original game where all information was available to sway choices, your designed process prioritizes relevance, making decisions explainable and auditable.
            </div>
          </div>
        </Card>
      )}

      {/* ===================================================================== */}
      {/* STEP 9: Reflection & Case 9 Message                                   */}
      {/* ===================================================================== */}
      {currentStep === 9 && (
        <Card glow="purple">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center', padding: '0.5rem 0' }}>
            <Badge variant="purple" style={{ margin: '0 auto' }}>CASE 9 COMPLETE</Badge>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              YOU JUST DESIGNED A DECISION PROCESS.
            </h2>

            <div style={{
              background: 'var(--bg-surface-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              textAlign: 'left'
            }}>
              <div>&bull; What did you choose to include?</div>
              <div>&bull; What did you choose to leave out?</div>
              <div>&bull; How would you test it?</div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08), rgba(124, 58, 237, 0.08))',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              border: '1px solid rgba(2, 132, 199, 0.2)'
            }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                FAIRNESS IS NOT A BUTTON.
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0 0' }}>
                It is an ongoing process of designing, testing, monitoring, and improving decisions.
              </p>
            </div>

            <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-cyan)', margin: 0 }}>
              Better decisions require more than better technology.<br />
              They require better questions.
            </p>

            <div style={{ marginTop: '0.5rem' }}>
              <Badge variant="cyan">NEXT: THE FINAL DECISION (CASE 10)</Badge>
            </div>
          </div>
        </Card>
      )}

    </div>
  );
};
