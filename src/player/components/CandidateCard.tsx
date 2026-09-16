import React from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Code2, 
  FolderGit2, 
  CheckCircle2, 
  MapPin, 
  Info
} from 'lucide-react';
import { Badge } from '../../shared/components/Badge';
import type { Candidate } from '../../shared/data/rounds';

export interface CandidateCardProps {
  candidate: Candidate;
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
  
  const borderStyle = isSelected
    ? `2px solid ${accentColor}`
    : '1px solid var(--border-subtle)';

  const shadowStyle = isSelected
    ? isA 
      ? '0 6px 24px rgba(2, 132, 199, 0.18)' 
      : '0 6px 24px rgba(124, 58, 237, 0.18)'
    : '0 2px 8px rgba(15, 23, 42, 0.04)';

  return (
    <div
      onClick={() => !disabled && onSelect && onSelect(candidate.id)}
      className="animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1.25rem',
        background: isSelected ? 'var(--bg-surface-secondary)' : '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: borderStyle,
        boxShadow: shadowStyle,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'all var(--transition-normal)',
        position: 'relative',
        outline: 'none'
      }}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={isSelected}
      aria-label={`Select Candidate ${candidate.id}: ${candidate.name}`}
      onKeyDown={(e) => {
        if (!disabled && onSelect && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect(candidate.id);
        }
      }}
    >
      {/* Header: Candidate ID Badge, Highlight, and Name */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <Badge variant={isA ? 'cyan' : 'purple'}>
              CANDIDATE {candidate.id}
            </Badge>
            {candidate.location && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text-muted)'
              }}>
                <MapPin size={12} color={accentColor} />
                {candidate.location}
              </span>
            )}
            {candidate.highlightMetric && !candidate.location && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
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
            fontWeight: 700,
            margin: '0.2rem 0 0 0'
          }}>
            {candidate.role}
          </p>
        </div>

        {/* Selection Indicator Checkbox / Radio Circle */}
        <div style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          border: isSelected ? `2px solid ${accentColor}` : '2px solid #cbd5e1',
          background: isSelected ? accentColor : '#ffffff',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all var(--transition-fast)',
          flexShrink: 0
        }}>
          {isSelected && <CheckCircle2 size={18} strokeWidth={3} />}
        </div>
      </div>

      {/* Structured Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        
        {/* Core Competencies / Skills Chips */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.72rem',
            fontWeight: 800,
            color: 'var(--text-muted)',
            marginBottom: '0.4rem',
            letterSpacing: '0.05em'
          }}>
            <Code2 size={13} color={accentColor} />
            <span>CORE COMPETENCIES</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {candidate.skills.map((skill, idx) => (
              <span
                key={idx}
                className="font-mono"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.25rem 0.6rem',
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)'
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Professional Experience */}
        <div style={{
          background: 'var(--bg-surface-secondary)',
          padding: '0.75rem 0.85rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.72rem',
            fontWeight: 800,
            color: 'var(--text-muted)',
            marginBottom: '0.25rem',
            letterSpacing: '0.05em'
          }}>
            <Briefcase size={12} color={accentColor} />
            <span>PROFESSIONAL EXPERIENCE</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
            {candidate.experience}
          </p>
        </div>

        {/* Project Portfolio */}
        <div style={{
          background: 'var(--bg-surface-secondary)',
          padding: '0.75rem 0.85rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.72rem',
            fontWeight: 800,
            color: 'var(--text-muted)',
            marginBottom: '0.25rem',
            letterSpacing: '0.05em'
          }}>
            <FolderGit2 size={12} color={accentColor} />
            <span>PROJECT PORTFOLIO</span>
          </div>
          <p style={{ 
            fontSize: '0.85rem', 
            color: 'var(--text-secondary)', 
            margin: 0, 
            lineHeight: 1.45,
            fontStyle: candidate.presentationStyle === 'narrative' ? 'italic' : 'normal'
          }}>
            {candidate.projects}
          </p>
        </div>

        {/* Education & Credentials */}
        <div style={{
          background: 'var(--bg-surface-secondary)',
          padding: '0.75rem 0.85rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.72rem',
            fontWeight: 800,
            color: 'var(--text-muted)',
            marginBottom: '0.25rem',
            letterSpacing: '0.05em'
          }}>
            <GraduationCap size={12} color={accentColor} />
            <span>EDUCATION & CREDENTIALS</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
            {candidate.education}
          </p>
        </div>

        {/* Additional / Contextual Details (When present) */}
        {candidate.details && (
          <div style={{
            background: 'var(--bg-surface-secondary)',
            padding: '0.75rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.72rem',
              fontWeight: 800,
              color: 'var(--text-muted)',
              marginBottom: '0.25rem',
              letterSpacing: '0.05em'
            }}>
              <Info size={12} color={accentColor} />
              <span>PROFILE DETAILS</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
              {candidate.details}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
