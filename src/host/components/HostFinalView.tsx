import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  AlertTriangle, 
  Maximize2, 
  Minimize2, 
  StopCircle
} from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { 
  FINAL_STEPS_META, 
  EDUCATIONAL_LESSONS, 
  REFLECTION_THEMES, 
  FINAL_DISCUSSION_PROMPT 
} from '../../shared/data/finalSteps';
import { CANDIDATE_FACTORS } from '../../shared/data/fairnessSteps';
import type { 
  FinalStepNumber, 
  SessionFinalSummary, 
  ReflectionAggregate 
} from '../../shared/types';

interface HostFinalViewProps {
  currentStep: FinalStepNumber;
  onSetStep: (step: FinalStepNumber) => void;
  onCompleteGame?: () => void;
  onCompleteSession?: () => void;
  summary?: SessionFinalSummary | null;
  sessionSummary?: SessionFinalSummary | null;
  reflectionsAggregate?: ReflectionAggregate | null;
  isCompleted?: boolean;
  isActionInProgress?: boolean;
}

export const HostFinalView: React.FC<HostFinalViewProps> = ({
  currentStep,
  onSetStep,
  onCompleteGame,
  onCompleteSession,
  summary: propSummary,
  sessionSummary: propSessionSummary,
  reflectionsAggregate: propReflectionsAggregate,
  isActionInProgress = false
}) => {
  const sessionSummary: SessionFinalSummary = propSummary || propSessionSummary || {
    totalPlayers: 0,
    completedPlayers: 0,
    totalDecisionRounds: 7,
    fairnessParticipants: 0,
    factorsCount: {},
    totalVotesLogged: 0
  };

  const reflectionsAggregate: ReflectionAggregate = propReflectionsAggregate || {
    totalReflections: 0,
    themeCounts: {},
    anonymousTakeaways: []
  };

  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [showEndModal, setShowEndModal] = useState<boolean>(false);
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);

  const stepMeta = FINAL_STEPS_META.find((s) => s.stepNumber === currentStep) || FINAL_STEPS_META[0];
  const isFinalStep = currentStep === 5;

  const handleNext = () => {
    if (isActionInProgress || currentStep >= 5) return;
    onSetStep((currentStep + 1) as FinalStepNumber);
  };

  const handlePrev = () => {
    if (isActionInProgress || currentStep <= 0) return;
    onSetStep((currentStep - 1) as FinalStepNumber);
  };

  return (
    <div 
      className="animate-fade-in" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: isPresentationMode ? '2rem' : '1.5rem',
        maxWidth: isPresentationMode ? '1200px' : '100%',
        margin: '0 auto',
        width: '100%'
      }}
    >
      
      {/* 1. Projector Navigation & Presentation Mode Bar */}
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
            CASE 10: FINAL RESULTS &amp; REFLECTION
          </Badge>
          <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            STEP {currentStep} OF 5 &bull; {stepMeta.title}
          </span>
        </div>

        {/* Step Indicator Pills (0 to 5) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {FINAL_STEPS_META.map((s) => (
              <button
                key={s.stepNumber}
                onClick={() => !isActionInProgress && onSetStep(s.stepNumber)}
                disabled={isActionInProgress}
                style={{
                  width: currentStep === s.stepNumber ? '26px' : '10px',
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

          {/* Presentation Mode Toggle */}
          <Button
            variant={isPresentationMode ? 'primary' : 'secondary'}
            size="small"
            icon={isPresentationMode ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            onClick={() => setIsPresentationMode(!isPresentationMode)}
            title="Toggle high-contrast projector presentation mode"
          >
            {isPresentationMode ? 'STANDARD VIEW' : 'PRESENTATION MODE'}
          </Button>
        </div>
      </div>

      {/* 2. Main Presentation Slides */}
      <div className="animate-fade-in" key={`host-final-step-${currentStep}`}>
        
        {/* =================================================================== */}
        {/* STEP 0: Final Classroom Results & Process Redesign                  */}
        {/* =================================================================== */}
        {currentStep === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card glow="cyan" style={{ padding: '2rem 2.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <Badge variant="cyan" style={{ marginBottom: '0.4rem' }}>CASE 10 &bull; CONCLUSION</Badge>
                  <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                    Final Classroom Results
                  </h1>
                  <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0 0' }}>
                    Descriptive metrics derived directly from actual student decisions across all 7 rounds and the Make It Fair challenge.
                  </p>
                </div>
              </div>

              {/* High-Level Classroom Metrics Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  background: 'var(--bg-surface-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    STUDENT PARTICIPANTS
                  </span>
                  <div className="font-mono text-cyan" style={{ fontSize: '2.75rem', fontWeight: 900, margin: '0.2rem 0' }}>
                    {sessionSummary.totalPlayers}
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {sessionSummary.completedPlayers} completed reflections
                  </span>
                </div>

                <div style={{
                  background: 'var(--bg-surface-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    DECISION ROUNDS
                  </span>
                  <div className="font-mono text-purple" style={{ fontSize: '2.75rem', fontWeight: 900, margin: '0.2rem 0' }}>
                    7
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {sessionSummary.totalVotesLogged} total votes logged
                  </span>
                </div>

                <div style={{
                  background: 'var(--bg-surface-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    MAKE IT FAIR CRITERIA
                  </span>
                  <div className="font-mono" style={{ fontSize: '2.75rem', fontWeight: 900, color: 'var(--color-success)', margin: '0.2rem 0' }}>
                    {sessionSummary.fairnessParticipants}
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    rules actively configured
                  </span>
                </div>
              </div>

              {/* Factors Selected Summary */}
              <div style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                marginBottom: '1.75rem',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    What the Classroom Prioritized in Case 9
                  </h3>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Descriptive Classroom Frequencies &bull; No individual ranking
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
                  {CANDIDATE_FACTORS.map((f) => {
                    const count = sessionSummary.factorsCount[f.id] || 0;
                    const denom = Math.max(1, sessionSummary.fairnessParticipants || sessionSummary.totalPlayers || 1);
                    const pct = Math.min(100, Math.round((count / denom) * 100));

                    return (
                      <div 
                        key={f.id}
                        style={{
                          background: 'var(--bg-surface-secondary)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          padding: '0.75rem 1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                          {f.label}
                        </span>
                        <div style={{ textAlign: 'right' }}>
                          <span className="font-mono text-cyan" style={{ fontWeight: 900, fontSize: '1.1rem' }}>
                            {count} / {denom}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                            ({pct}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Original Experience vs Redesigned Process */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem'
              }}>
                <div style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem'
                }}>
                  <div style={{ fontWeight: 900, color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '0.5rem' }}>
                    ORIGINAL EXPERIENCE
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '0.75rem' }}>
                    <span>Information</span>
                    <span>&rarr;</span>
                    <span>Decision</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    In Cases 1–7, all candidate details were presented without explicit relevance constraints. Unrelated information (such as formatting or location) subtly swayed collective votes.
                  </p>
                </div>

                <div style={{
                  background: '#ffffff',
                  border: '2px solid var(--accent-purple)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  boxShadow: '0 4px 14px rgba(124, 58, 237, 0.08)'
                }}>
                  <div style={{ fontWeight: 900, color: 'var(--accent-purple)', fontSize: '1.15rem', marginBottom: '0.5rem' }}>
                    REDESIGNED PROCESS
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: 'var(--accent-purple)', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <span>Relevant Info</span>
                    <span>&rarr;</span>
                    <span>Decision Rule</span>
                    <span>&rarr;</span>
                    <span>Testing</span>
                    <span>&rarr;</span>
                    <span>Review</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    The redesigned process makes the factors being considered explicit, transparent, and auditable. It gives humans systematic ways to test the process rather than assuming fairness.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 1: What Did We Learn? (5 Core Educational Lessons)             */}
        {/* =================================================================== */}
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card glow="purple" style={{ padding: '2rem 2.25rem' }}>
              <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2rem auto' }}>
                <Badge variant="purple" style={{ marginBottom: '0.5rem' }}>CORE PRINCIPLES</Badge>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                  What Did We Learn?
                </h1>
                <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', margin: '0.4rem 0 0 0' }}>
                  Five essential lessons for navigating an algorithmic world.
                </p>
              </div>

              {/* Lessons Interactive Deck / List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {EDUCATIONAL_LESSONS.map((lesson, idx) => {
                  const isActive = activeLessonIndex === idx;

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => setActiveLessonIndex(idx)}
                      style={{
                        background: isActive ? 'rgba(124, 58, 237, 0.05)' : '#ffffff',
                        border: isActive ? '2px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.25rem 1.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                        boxShadow: isActive ? '0 4px 14px rgba(124, 58, 237, 0.08)' : '0 1px 3px rgba(15, 23, 42, 0.04)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: isActive ? 'var(--accent-purple)' : 'var(--bg-surface-secondary)',
                            color: isActive ? '#ffffff' : 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 900,
                            fontSize: '0.95rem'
                          }}>
                            {lesson.id}
                          </span>
                          <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                            {lesson.title}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-purple)' }}>
                          {lesson.tagline}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', margin: '0.65rem 0 0 42px', lineHeight: 1.55 }}>
                        {lesson.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 2: Rebuild the Core Chain (DATA → ALGO → DECISION → IMPACT)    */}
        {/* =================================================================== */}
        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card glow="cyan" style={{ padding: '2.5rem 2.25rem', textAlign: 'center' }}>
              <Badge variant="cyan" style={{ marginBottom: '1rem' }}>SYSTEMIC PERSPECTIVE</Badge>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 1rem 0' }}>
                The Complete Chain
              </h1>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
                Every algorithmic decision is part of a larger human and societal loop.
              </p>

              {/* Visual Flowchart with Holistic Fairness Overlay */}
              <div style={{
                background: '#ffffff',
                border: '2px solid rgba(2, 132, 199, 0.2)',
                borderRadius: 'var(--radius-xl)',
                padding: '2.5rem 1.5rem',
                maxWidth: '960px',
                margin: '0 auto 2rem auto',
                boxShadow: '0 8px 30px rgba(15, 23, 42, 0.06)',
                position: 'relative'
              }}>
                {/* Encircling Fairness Banner */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1.25rem',
                  background: 'linear-gradient(135deg, #0284c7, #7c3aed)',
                  color: '#ffffff',
                  borderRadius: '9999px',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  letterSpacing: '0.08em',
                  marginBottom: '2rem',
                  boxShadow: '0 4px 14px rgba(124, 58, 237, 0.25)'
                }}>
                  <Sparkles size={16} />
                  <span>FAIRNESS MUST ENCIRCLE THE ENTIRE PROCESS</span>
                </div>

                {/* 4 Pipeline Nodes */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '1rem',
                  alignItems: 'center'
                }}>
                  <div style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>PHASE 1</span>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0.25rem 0' }}>DATA</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Human choices, historical records, contextual labels.</p>
                  </div>

                  <div style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-purple)', textTransform: 'uppercase' }}>PHASE 2</span>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0.25rem 0' }}>ALGORITHM</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Mathematical models, encoded priorities, optimization weights.</p>
                  </div>

                  <div style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-success)', textTransform: 'uppercase' }}>PHASE 3</span>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0.25rem 0' }}>DECISION</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Automated predictions, admissions, hiring screenings.</p>
                  </div>

                  <div style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-warning)', textTransform: 'uppercase' }}>PHASE 4</span>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0.25rem 0' }}>IMPACT</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Real-world opportunities, career paths, societal outcomes.</p>
                  </div>
                </div>

                <div style={{
                  marginTop: '2rem',
                  padding: '1rem',
                  background: 'rgba(2, 132, 199, 0.05)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)'
                }}>
                  Fairness cannot simply be added as a patch at the end. It requires deliberate choices at every step.
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 3: Automation ≠ Fairness & The Four Pillars                    */}
        {/* =================================================================== */}
        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card glow="purple" style={{ padding: '2.5rem 2.25rem', textAlign: 'center' }}>
              <Badge variant="purple" style={{ marginBottom: '1rem' }}>FINAL THESIS</Badge>
              <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 1rem 0', letterSpacing: '-0.03em' }}>
                AUTOMATION &ne; FAIRNESS
              </h1>

              <div style={{
                background: 'var(--bg-surface-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.75rem 2rem',
                maxWidth: '780px',
                margin: '0 auto 2.5rem auto'
              }}>
                <p style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
                  Technology can make decisions faster.
                  <br />
                  <span style={{ color: 'var(--accent-purple)' }}>That does not automatically make those decisions fair.</span>
                </p>
              </div>

              {/* The Four Pillars Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.25rem',
                maxWidth: '960px',
                margin: '0 auto'
              }}>
                <div style={{ background: '#ffffff', border: '2px solid rgba(2, 132, 199, 0.25)', borderRadius: 'var(--radius-lg)', padding: '1.5rem 1.25rem', textAlign: 'left' }}>
                  <div style={{ fontWeight: 900, fontSize: '1.15rem', color: 'var(--accent-cyan)', marginBottom: '0.4rem' }}>
                    1. RELEVANCE
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                    Information used by systems must have a demonstrable, verified connection to the outcome.
                  </p>
                </div>

                <div style={{ background: '#ffffff', border: '2px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-lg)', padding: '1.5rem 1.25rem', textAlign: 'left' }}>
                  <div style={{ fontWeight: 900, fontSize: '1.15rem', color: 'var(--color-success)', marginBottom: '0.4rem' }}>
                    2. TESTING
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                    Systems must be actively probed for consistency and bias across varied candidate populations.
                  </p>
                </div>

                <div style={{ background: '#ffffff', border: '2px solid rgba(124, 58, 237, 0.25)', borderRadius: 'var(--radius-lg)', padding: '1.5rem 1.25rem', textAlign: 'left' }}>
                  <div style={{ fontWeight: 900, fontSize: '1.15rem', color: 'var(--accent-purple)', marginBottom: '0.4rem' }}>
                    3. TRANSPARENCY
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                    Decisions must be understandable and auditable rather than opaque black-box assertions.
                  </p>
                </div>

                <div style={{ background: '#ffffff', border: '2px solid rgba(245, 158, 11, 0.25)', borderRadius: 'var(--radius-lg)', padding: '1.5rem 1.25rem', textAlign: 'left' }}>
                  <div style={{ fontWeight: 900, fontSize: '1.15rem', color: 'var(--color-warning)', marginBottom: '0.4rem' }}>
                    4. ACCOUNTABILITY
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                    Humans remain morally and institutionally responsible for the consequences of deployed AI.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 4: Classroom Reflection & Final Discussion Prompt              */}
        {/* =================================================================== */}
        {currentStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card glow="cyan" style={{ padding: '2rem 2.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <Badge variant="cyan" style={{ marginBottom: '0.4rem' }}>LIVE CLASSROOM REFLECTION</Badge>
                  <h1 style={{ fontSize: '2.35rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                    What Will Students Think About Differently?
                  </h1>
                  <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0 0' }}>
                    Real-time aggregated themes from student mobile reflection submissions.
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
                    REFLECTIONS SUBMITTED
                  </span>
                  <span className="font-mono text-cyan" style={{ fontSize: '1.6rem', fontWeight: 900 }}>
                    {reflectionsAggregate.totalReflections} / {sessionSummary.totalPlayers}
                  </span>
                </div>
              </div>

              {/* Reflection Themes Frequency Bars */}
              <div style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                marginBottom: '1.75rem',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
              }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-cyan)', textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>
                  TOP REFLECTION THEMES CHOSEN BY STUDENTS
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {REFLECTION_THEMES.map((theme) => {
                    const count = reflectionsAggregate.themeCounts[theme.id] || 0;
                    const denom = Math.max(1, reflectionsAggregate.totalReflections || sessionSummary.totalPlayers || 1);
                    const pct = Math.min(100, Math.round((count / denom) * 100));

                    return (
                      <div key={theme.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '240px', fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                          {theme.label}
                        </div>
                        <div style={{ flex: 1, height: '14px', background: 'var(--bg-surface-secondary)', borderRadius: '7px', overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${pct}%`,
                              background: 'linear-gradient(90deg, #0284c7, #7c3aed)',
                              borderRadius: '7px',
                              transition: 'width 0.4s ease'
                            }}
                          />
                        </div>
                        <div style={{ width: '85px', textAlign: 'right', fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                          {count} votes
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Final Classroom Discussion Prompt Card */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(2, 132, 199, 0.08))',
                border: '2px solid rgba(124, 58, 237, 0.25)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-purple)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  FINAL CLASSROOM DISCUSSION QUESTION
                </span>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0.65rem 0' }}>
                  {FINAL_DISCUSSION_PROMPT.question}
                </h2>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--accent-purple)', margin: '0 0 0.85rem 0' }}>
                  {FINAL_DISCUSSION_PROMPT.subtext}
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto', lineHeight: 1.5 }}>
                  {FINAL_DISCUSSION_PROMPT.guidance}
                </p>
              </div>

              {/* Anonymous Student Takeaways (if any) */}
              {reflectionsAggregate.anonymousTakeaways.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.65rem' }}>
                    ANONYMOUS STUDENT TAKEAWAYS
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                    {reflectionsAggregate.anonymousTakeaways.slice(0, 6).map((quote, qIdx) => (
                      <div 
                        key={qIdx}
                        style={{
                          background: '#ffffff',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          padding: '0.85rem 1rem',
                          fontSize: '0.88rem',
                          color: 'var(--text-secondary)',
                          fontStyle: 'italic',
                          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)'
                        }}
                      >
                        &ldquo;{quote}&rdquo;
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 5: Simulation Complete & Session Conclusion                    */}
        {/* =================================================================== */}
        {currentStep === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card glow="purple" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
              <Badge variant="purple" style={{ marginBottom: '1rem' }}>SESSION CONCLUDED</Badge>
              <h1 style={{ fontSize: '2.75rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 1rem 0' }}>
                THE DECISION SIMULATION COMPLETE
              </h1>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
                Thank you for facilitating this exploration of algorithmic bias, data influence, and responsible system design.
              </p>

              <div style={{
                background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08), rgba(124, 58, 237, 0.08))',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                maxWidth: '680px',
                margin: '0 auto 2.5rem auto',
                border: '1px solid rgba(2, 132, 199, 0.2)'
              }}>
                <span className="font-mono text-cyan" style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                  THINK BEFORE YOU AUTOMATE.
                </span>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>
                  Better decisions require more than better technology. They require better questions.
                </p>
              </div>

              {/* Conclude Session Action Button */}
              <div>
                <Button
                  variant="danger"
                  size="large"
                  icon={<StopCircle size={18} />}
                  onClick={() => setShowEndModal(true)}
                  disabled={isActionInProgress}
                  style={{ minWidth: '240px', fontSize: '1.05rem', fontWeight: 900 }}
                >
                  END THIS SESSION
                </Button>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Locks the session and transitions all student screens to finished state
                </div>
              </div>
            </Card>
          </div>
        )}

      </div>

      {/* 3. Host Navigation Footer Controller */}
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
          id="btn-final-prev"
        >
          PREVIOUS STEP
        </Button>

        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>
          Synchronizing projector &amp; {sessionSummary.totalPlayers} student devices
        </div>

        <Button
          variant="primary"
          size="normal"
          icon={<ArrowRight size={16} />}
          onClick={handleNext}
          disabled={isActionInProgress || isFinalStep}
          id="btn-final-next"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #0284c7)' }}
        >
          {isActionInProgress 
            ? 'SYNCHRONIZING...' 
            : isFinalStep 
              ? 'SIMULATION CONCLUDED' 
              : `NEXT STEP (${currentStep + 1} / 5)`}
        </Button>
      </div>

      {/* End Session Confirmation Modal */}
      {showEndModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            maxWidth: '460px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            textAlign: 'center'
          }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--color-danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto'
            }}>
              <AlertTriangle size={28} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                END THIS SESSION?
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: '0.5rem 0 0 0', lineHeight: 1.5 }}>
                Players will no longer be able to submit responses. The simulation will be formally closed.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <Button
                variant="secondary"
                size="normal"
                onClick={() => setShowEndModal(false)}
                disabled={isActionInProgress}
              >
                CANCEL
              </Button>
              <Button
                variant="danger"
                size="normal"
                icon={<StopCircle size={16} />}
                onClick={() => {
                  setShowEndModal(false);
                  if (onCompleteGame) onCompleteGame();
                  else if (onCompleteSession) onCompleteSession();
                }}
                disabled={isActionInProgress}
                id="btn-confirm-end-game"
              >
                {isActionInProgress ? 'ENDING...' : 'CONFIRM END GAME'}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
