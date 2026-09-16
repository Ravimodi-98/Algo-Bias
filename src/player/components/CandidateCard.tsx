import React from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  Sparkles, 
  GraduationCap, 
  Briefcase, 
  Code2, 
  FolderGit2 
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
      ? '0 4px 16px rgba(2, 132, 199, 0.16)' 
      : '0 4px 16px rgba(124, 58, 237, 0.16)'
    : '0 1px 4px rgba(15, 23, 42, 0.04)';

  return (
    <div
      onClick={() => !disabled && onSelect && onSelect(candidate.id)}
      className="animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        padding: '0.9rem 1rem',
        background: isSelected ? 'var(--bg-surface-secondary)' : '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: borderStyle,
        boxShadow: shadowStyle,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'all var(--transition-fast)',
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
      {/* Header: Candidate ID Badge, Name, Role, and Selection Radio */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Badge variant={isA ? 'cyan' : 'purple'}>
            CANDIDATE {candidate.id}
          </Badge>
          <span style={{
            fontSize: '1.05rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em'
          }}>
            {candidate.name}
          </span>
          <span style={{
            fontSize: '0.8rem',
            color: accentColor,
            fontWeight: 700
          }}>
            &bull; {candidate.role}
          </span>
        </div>

        {/* Selection Check Circle */}
        <div style={{
          width: '26px',
          height: '26px',
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
          {isSelected && <CheckCircle2 size={16} strokeWidth={3} />}
        </div>
      </div>

      {/* Compact Information Rows (Max 2-4 Groups) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        
        {/* 1. Skills (Compact Inline presentation) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          fontSize: '0.82rem',
          color: 'var(--text-primary)'
        }}>
          <Code2 size={13} color={accentColor} style={{ flexShrink: 0 }} />
          <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
            Skills:
          </span>
          <span className="font-mono" style={{ fontWeight: 600, fontSize: '0.8rem' }}>
            {candidate.skills.join(' · ')}
          </span>
        </div>

        {/* 2. Experience (1 short sentence) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)'
        }}>
          <Briefcase size={13} color={accentColor} style={{ flexShrink: 0 }} />
          <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
            Exp:
          </span>
          <span>{candidate.experience}</span>
        </div>

        {/* 3. Projects (Only when relevant) */}
        {candidate.projects && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)'
          }}>
            <FolderGit2 size={13} color={accentColor} style={{ flexShrink: 0 }} />
            <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              Projects:
            </span>
            <span style={{ fontStyle: candidate.presentationStyle === 'narrative' ? 'italic' : 'normal' }}>
              {candidate.projects}
            </span>
          </div>
        )}

        {/* 4. Education (Only when relevant, e.g. Round 2) */}
        {candidate.education && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)'
          }}>
            <GraduationCap size={13} color={accentColor} style={{ flexShrink: 0 }} />
            <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              College:
            </span>
            <span>{candidate.education}</span>
          </div>
        )}

        {/* 5. Location (Only when relevant, e.g. Round 3) */}
        {candidate.location && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)'
          }}>
            <MapPin size={13} color={accentColor} style={{ flexShrink: 0 }} />
            <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              Location:
            </span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{candidate.location}</span>
          </div>
        )}

        {/* 6. Highlight Metric or Extraneous/Presentation Details */}
        {(candidate.highlightMetric || candidate.details) && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            background: 'var(--bg-surface-secondary)',
            padding: '0.35rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)'
          }}>
            <Sparkles size={12} color={accentColor} style={{ flexShrink: 0 }} />
            <span>{candidate.highlightMetric || candidate.details}</span>
          </div>
        )}
      </div>
    </div>
  );
};
