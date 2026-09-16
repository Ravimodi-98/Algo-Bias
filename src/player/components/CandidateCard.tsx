import React from 'react';
import { Briefcase, GraduationCap, Code2, FolderGit2, CheckCircle2 } from 'lucide-react';
import { Badge } from '../../shared/components/Badge';

export interface CandidateProfile {
  id: 'A' | 'B';
  name: string;
  role: string;
  experience: string;
  education: string;
  skills: string[];
  projects: string;
  highlightMetric?: string;
}

export interface CandidateCardProps {
  candidate: CandidateProfile;
  isSelected?: boolean;
  onSelect?: (id: 'A' | 'B') => void;
  disabled?: boolean;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  isSelected = false,
  onSelect,
  disabled = false
}) => {
  const isA = candidate.id === 'A';
  const accentColor = isA ? 'var(--accent-cyan)' : 'var(--accent-purple)';
  const borderHighlight = isSelected
    ? `2px solid ${accentColor}`
    : '1px solid var(--border-subtle)';

  const glowStyle = isSelected
    ? isA 
      ? '0 0 25px rgba(0, 240, 255, 0.25)' 
      : '0 0 25px rgba(139, 92, 246, 0.25)'
    : 'none';

  return (
    <div
      onClick={() => !disabled && onSelect && onSelect(candidate.id)}
      className="animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1.25rem',
        background: isSelected ? 'var(--bg-surface-secondary)' : 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: borderHighlight,
        boxShadow: glowStyle,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'all var(--transition-normal)',
        position: 'relative',
        outline: 'none'
      }}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={isSelected}
      aria-label={`Select ${candidate.name}`}
      onKeyDown={(e) => {
        if (!disabled && onSelect && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect(candidate.id);
        }
      }}
    >
      {/* Header: Candidate ID Badge & Name */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <Badge variant={isA ? 'cyan' : 'purple'}>
              CANDIDATE {candidate.id}
            </Badge>
            {candidate.highlightMetric && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                &bull; {candidate.highlightMetric}
              </span>
            )}
          </div>

          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
            margin: 0
          }}>
            {candidate.name}
          </h2>

          <p style={{
            fontSize: '0.85rem',
            color: accentColor,
            fontWeight: 600,
            margin: '0.2rem 0 0 0'
          }}>
            {candidate.role}
          </p>
        </div>

        {/* Selection Indicator Check */}
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: isSelected ? `2px solid ${accentColor}` : '1px solid var(--border-subtle)',
          background: isSelected ? accentColor : 'transparent',
          color: '#080A0F',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all var(--transition-fast)'
        }}>
          {isSelected && <CheckCircle2 size={18} strokeWidth={3} />}
        </div>
      </div>

      {/* Structured Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        
        {/* Experience */}
        <div style={{
          background: 'var(--bg-base)',
          padding: '0.75rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            marginBottom: '0.25rem',
            letterSpacing: '0.05em'
          }}>
            <Briefcase size={12} color={accentColor} />
            <span>PROFESSIONAL EXPERIENCE</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
            {candidate.experience}
          </p>
        </div>

        {/* Education */}
        <div style={{
          background: 'var(--bg-base)',
          padding: '0.75rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            marginBottom: '0.25rem',
            letterSpacing: '0.05em'
          }}>
            <GraduationCap size={12} color={accentColor} />
            <span>EDUCATION & CREDENTIALS</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
            {candidate.education}
          </p>
        </div>

        {/* Skills Chips */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            marginBottom: '0.4rem',
            letterSpacing: '0.05em'
          }}>
            <Code2 size={12} color={accentColor} />
            <span>CORE COMPETENCIES</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {candidate.skills.map((skill, idx) => (
              <span
                key={idx}
                className="font-mono"
                style={{
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.55rem',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)'
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Key Project Highlight */}
        <div style={{
          background: 'var(--bg-base)',
          padding: '0.75rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            marginBottom: '0.25rem',
            letterSpacing: '0.05em'
          }}>
            <FolderGit2 size={12} color={accentColor} />
            <span>PROJECT PORTFOLIO</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
            {candidate.projects}
          </p>
        </div>
      </div>
    </div>
  );
};
