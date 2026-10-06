import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Send, 
  HeartHandshake
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
import { gameService } from '../../services/game/gameService';
import type { 
  PlayerSession, 
  FinalStepNumber, 
  SessionFinalSummary
} from '../../shared/types';

interface PlayerFinalViewProps {
  currentStep: FinalStepNumber;
  session: PlayerSession;
  summary?: SessionFinalSummary | null;
  isCompleted?: boolean;
}

export const PlayerFinalView: React.FC<PlayerFinalViewProps> = ({
  currentStep,
  session,
  summary,
  isCompleted = false
}) => {
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [reflectionText, setReflectionText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  // Check if player has already submitted reflection
  useEffect(() => {
    let isMounted = true;
    const checkReflection = async () => {
      try {
        const ref = await gameService.getPlayerReflection(session.sessionId, session.playerId);
        if (isMounted && ref) {
          setSelectedThemes(ref.selected_themes || []);
          setReflectionText(ref.optional_response || '');
          setHasSubmitted(true);
        }
      } catch (err) {
        console.error('Error fetching player reflection:', err);
      }
    };
    checkReflection();
    return () => { isMounted = false; };
  }, [session.sessionId, session.playerId]);

  const toggleTheme = (themeId: string) => {
    if (hasSubmitted) return;
    if (selectedThemes.includes(themeId)) {
      setSelectedThemes(selectedThemes.filter((t) => t !== themeId));
    } else {
      setSelectedThemes([...selectedThemes, themeId]);
    }
  };

  const handleSubmitReflection = async () => {
    if (selectedThemes.length === 0 && !reflectionText.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await gameService.submitPlayerReflection(
        session.sessionId,
        session.playerId,
        selectedThemes,
        reflectionText.trim()
      );
      if (res.success) {
        setHasSubmitted(true);
      }
    } catch (err) {
      console.error('Failed to submit reflection:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepMeta = FINAL_STEPS_META.find((s) => s.stepNumber === currentStep) || FINAL_STEPS_META[0];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* 1. Header with Step Tracking */}
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1rem',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 1px 4px rgba(15, 23, 42, 0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={16} color="var(--accent-purple)" />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-purple)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            CASE 10 &bull; {isCompleted ? 'COMPLETE' : stepMeta.badge}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
          {FINAL_STEPS_META.map((meta) => {
            const isCurrent = meta.stepNumber === currentStep;
            const isPast = meta.stepNumber < currentStep || isCompleted;
            return (
              <div
                key={meta.stepNumber}
                title={meta.title}
                style={{
                  width: isCurrent ? '18px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: isCurrent 
                    ? 'var(--accent-cyan)' 
                    : isPast 
                      ? 'var(--color-success)' 
                      : '#cbd5e1',
                  transition: 'all 0.3s ease'
                }}
              />
            );
          })}
        </div>
      </div>

      {/* 2. Step Specific Content */}

      {/* STEP 0: Classroom Results Summary */}
      {currentStep === 0 && !isCompleted && (
        <Card glow="cyan">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Badge variant="cyan">CLASSROOM RESULTS</Badge>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              Classroom-Level Patterns
            </h3>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
              Here is how our entire room participated across the simulation. Notice how patterns emerged from individual choices.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem'
            }}>
              <div style={{
                background: 'var(--bg-surface-secondary)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>
                  CONNECTED PEERS
                </span>
                <span className="font-mono text-cyan" style={{ fontSize: '1.6rem', fontWeight: 900 }}>
                  {summary?.totalPlayers || 0}
                </span>
              </div>

              <div style={{
                background: 'var(--bg-surface-secondary)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>
                  DECISIONS LOGGED
                </span>
                <span className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--accent-purple)' }}>
                  {summary?.totalVotesLogged || 0}
                </span>
              </div>
            </div>

            {/* Top factors breakdown if present */}
            {summary && summary.factorsCount && Object.keys(summary.factorsCount).length > 0 && (
              <div style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  TOP FACTORS PRIORITIZED IN MAKE IT FAIR
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {CANDIDATE_FACTORS.map((f) => {
                    const count = summary.factorsCount[f.id] || 0;
                    const denom = Math.max(1, summary.fairnessParticipants || summary.totalPlayers || 1);
                    const pct = Math.min(100, Math.round((count / denom) * 100));
                    return (
                      <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.2rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{f.label}</span>
                        <span className="font-mono text-cyan" style={{ fontWeight: 800 }}>{count} ({pct}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{
              background: 'rgba(2, 132, 199, 0.05)',
              border: '1px solid rgba(2, 132, 199, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.45
            }}>
              <strong style={{ color: 'var(--text-primary)' }}>No Individual Shaming:</strong> There are no individual winners or losers. In AI systems, decisions reflect the training data and rules given to the system.
            </div>
          </div>
        </Card>
      )}

      {/* STEP 1: 5 Core Lessons */}
      {currentStep === 1 && !isCompleted && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            border: '1px solid var(--border-subtle)'
          }}>
            <Badge variant="purple">KEY LESSONS &bull; 5 CORE PRINCIPLES</Badge>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0.4rem 0 0.2rem 0' }}>
              What The Simulation Revealed
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
              Five foundational truths about automated decision systems:
            </p>
          </div>

          {EDUCATIONAL_LESSONS.map((lesson) => (
            <div
              key={lesson.id}
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-md)',
                padding: '0.9rem 1rem',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
                display: 'flex',
                gap: '0.75rem'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'rgba(124, 58, 237, 0.1)',
                color: 'var(--accent-purple)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontWeight: 900,
                fontSize: '0.85rem',
                flexShrink: 0
              }}>
                {lesson.id}
              </div>
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.2rem 0' }}>
                  {lesson.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  {lesson.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STEP 2: The Complete Pipeline */}
      {currentStep === 2 && !isCompleted && (
        <Card glow="purple">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Badge variant="purple">SYSTEM PIPELINE &bull; THE DECISION CHAIN</Badge>
            
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              Where Does Bias Live?
            </h3>

            {/* Mobile Stacked Pipeline */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              {[
                { label: 'DATA', desc: 'Who is represented? What is counted?' },
                { label: 'ALGORITHM', desc: 'What criteria are weighed?' },
                { label: 'DECISION', desc: 'Who gets selected or denied?' },
                { label: 'IMPACT', desc: 'Who is benefited or harmed?' }
              ].map((node, idx) => (
                <div key={node.label}>
                  <div style={{
                    background: 'var(--bg-surface-secondary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <span className="font-mono text-cyan" style={{ fontSize: '0.9rem', fontWeight: 900 }}>
                        {node.label}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>
                        {node.desc}
                      </span>
                    </div>
                  </div>
                  {idx < 3 && (
                    <div style={{ textAlign: 'center', color: 'var(--accent-purple)', fontSize: '0.9rem', margin: '0.15rem 0' }}>
                      &darr;
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pipeline Takeaway */}
            <div style={{
              background: 'rgba(2, 132, 199, 0.05)',
              border: '1px solid rgba(2, 132, 199, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.45
            }}>
              <strong style={{ color: 'var(--text-primary)' }}>Systemic Perspective:</strong> Every automated decision affects human outcomes and feeds back into future training data.
            </div>
          </div>
        </Card>
      )}

      {/* STEP 3: Automation ≠ Fairness */}
      {currentStep === 3 && !isCompleted && (
        <Card glow="purple">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Badge variant="purple">FINAL THESIS &bull; AUTOMATION &ne; FAIRNESS</Badge>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              The Four Pillars of Responsible Design
            </h3>

            {/* Core Golden Rule Box */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(2, 132, 199, 0.08))',
              border: '2px solid var(--accent-purple)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              textAlign: 'center'
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.2rem',
                fontWeight: 900,
                color: 'var(--accent-purple)',
                letterSpacing: '0.05em',
                display: 'block',
                marginBottom: '0.5rem'
              }}>
                AUTOMATION &ne; FAIRNESS
              </span>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                An algorithm does not make a decision fair. It merely executes human criteria at computational scale.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <div style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.75rem', textAlign: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--text-primary)', display: 'block' }}>RELEVANCE</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Validate criteria</span>
              </div>
              <div style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.75rem', textAlign: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--text-primary)', display: 'block' }}>AUDITING</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Test consistency</span>
              </div>
              <div style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.75rem', textAlign: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--text-primary)', display: 'block' }}>EXPLAINABILITY</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Document reasons</span>
              </div>
              <div style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.75rem', textAlign: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--text-primary)', display: 'block' }}>OVERSIGHT</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Human accountability</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* STEP 4: Personal Reflection */}
      {currentStep === 4 && !isCompleted && (
        <Card glow="cyan">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Badge variant="cyan">ETHICAL REFLECTION &bull; ONE LAST QUESTION</Badge>
              {hasSubmitted && (
                <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <CheckCircle2 size={14} /> SUBMITTED
                </span>
              )}
            </div>

            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                What is your biggest takeaway?
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                Select the themes that resonated most with you during the simulation:
              </p>
            </div>

            {/* Theme Tags */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {REFLECTION_THEMES.map((theme) => {
                const isSelected = selectedThemes.includes(theme.id);
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => toggleTheme(theme.id)}
                    disabled={hasSubmitted}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.7rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'rgba(2, 132, 199, 0.08)' : '#ffffff',
                      border: isSelected ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                      cursor: hasSubmitted ? 'default' : 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      border: isSelected ? '2px solid var(--accent-cyan)' : '1px solid #94a3b8',
                      background: isSelected ? 'var(--accent-cyan)' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {isSelected && <CheckCircle2 size={12} color="#ffffff" />}
                    </div>
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: isSelected ? 'var(--accent-cyan)' : 'var(--text-primary)', display: 'block' }}>
                        {theme.label}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {theme.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Optional 1-sentence thought */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                ONE SENTENCE IN YOUR OWN WORDS (OPTIONAL)
              </label>
              <input
                type="text"
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                disabled={hasSubmitted}
                maxLength={140}
                placeholder="What will you remember next time you hear about AI?"
                style={{
                  width: '100%',
                  padding: '0.75rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  background: hasSubmitted ? 'var(--bg-surface-secondary)' : '#ffffff',
                  fontSize: '0.85rem',
                  color: 'var(--text-primary)',
                  boxSizing: 'border-box'
                }}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textAlign: 'right', marginTop: '0.2rem' }}>
                {reflectionText.length} / 140
              </span>
            </div>

            {/* Submit Button */}
            {!hasSubmitted ? (
              <Button
                variant="primary"
                size="normal"
                icon={<Send size={15} />}
                onClick={handleSubmitReflection}
                disabled={isSubmitting || (selectedThemes.length === 0 && !reflectionText.trim())}
                id="btn-submit-reflection"
              >
                {isSubmitting ? 'SUBMITTING...' : 'SHARE MY REFLECTION'}
              </Button>
            ) : (
              <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(2, 132, 199, 0.08))',
                border: '1px solid var(--color-success)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  color: 'var(--color-success)',
                  display: 'block',
                  marginBottom: '0.25rem'
                }}>
                  REFLECTION RECORDED
                </span>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                  Your perspective is now included in the classroom's aggregate reflection view on the main screen.
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* STEP 5 or Completed: Final Conclusion & Discussion */}
      {(currentStep === 5 || isCompleted) && (
        <Card glow="purple">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center', padding: '1rem 0.5rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(2, 132, 199, 0.15))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              color: 'var(--accent-purple)'
            }}>
              <HeartHandshake size={32} />
            </div>

            <div>
              <Badge variant="purple">CASE 10 COMPLETE &bull; THE DECISION</Badge>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0.5rem 0 0.25rem 0' }}>
                You Didn't Just Make A Decision.
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
                You examined how decisions are made.
              </p>
            </div>

            {/* Closing Discussion Callout */}
            <div style={{
              background: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              textAlign: 'left'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-purple)', display: 'block', marginBottom: '0.35rem' }}>
                FINAL CLASSROOM QUESTION
              </span>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.92rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                lineHeight: 1.45,
                margin: 0
              }}>
                "{FINAL_DISCUSSION_PROMPT.question} {FINAL_DISCUSSION_PROMPT.subtext}"
              </p>
            </div>

            {/* Takeaway Mantra */}
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(2, 132, 199, 0.05)',
              border: '1px solid rgba(2, 132, 199, 0.2)',
              fontSize: '0.82rem',
              fontWeight: 800,
              color: 'var(--accent-cyan)',
              letterSpacing: '0.04em'
            }}>
              DATA &rarr; ALGORITHM &rarr; DECISION &rarr; IMPACT
              <br />
              <span style={{ color: 'var(--text-primary)', fontWeight: 900 }}>THINK BEFORE YOU AUTOMATE.</span>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Thank you for participating, <strong style={{ color: 'var(--text-primary)' }}>{session.anonymousName}</strong>.
            </div>
          </div>
        </Card>
      )}

    </div>
  );
};
