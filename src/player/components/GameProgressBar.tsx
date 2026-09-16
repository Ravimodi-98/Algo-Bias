import React from 'react';
import { Check } from 'lucide-react';

export interface GameProgressBarProps {
  currentRound: number;
  totalRounds?: number;
  gameCode?: string;
}

export const GameProgressBar: React.FC<GameProgressBarProps> = ({
  currentRound,
  totalRounds = 7,
  gameCode
}) => {
  const rounds = Array.from({ length: totalRounds }, (_, i) => i + 1);

  return (
    <div 
      className="animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        padding: '0.85rem 1.25rem',
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.05)'
      }}
      role="region"
      aria-label="Simulation Progress"
    >
      {/* Top Labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.15em',
            color: 'var(--accent-purple)',
            textTransform: 'uppercase'
          }}>
            THE DECISION
          </span>
          {gameCode && (
            <span className="font-mono text-cyan" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
              [{gameCode}]
            </span>
          )}
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'baseline',
          gap: '0.35rem',
          background: 'rgba(2, 132, 199, 0.08)',
          padding: '0.2rem 0.65rem',
          borderRadius: 'var(--radius-full)',
          border: '1px solid rgba(2, 132, 199, 0.2)'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>ROUND</span>
          <span className="font-mono text-cyan" style={{ fontSize: '0.95rem', fontWeight: 900 }}>
            {currentRound}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ {totalRounds}</span>
        </div>
      </div>

      {/* Visual Progress Nodes & Connecting Bar */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          padding: '0.25rem 0'
        }}
        role="progressbar"
        aria-valuenow={currentRound}
        aria-valuemin={1}
        aria-valuemax={totalRounds}
        aria-valuetext={`Round ${currentRound} of ${totalRounds}`}
      >
        {/* Connecting Track Line */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '12px',
          right: '12px',
          height: '3px',
          background: '#e2e8f0',
          transform: 'translateY(-50%)',
          zIndex: 1
        }}>
          {/* Active progress fill */}
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))',
            width: `${((currentRound - 1) / (totalRounds - 1)) * 100}%`,
            transition: 'width 0.4s ease'
          }} />
        </div>

        {/* Nodes */}
        {rounds.map((round) => {
          const isCompleted = round < currentRound;
          const isActive = round === currentRound;

          return (
            <div
              key={round}
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <div
                style={{
                  width: isActive ? '26px' : '22px',
                  height: isActive ? '26px' : '22px',
                  borderRadius: '50%',
                  background: isCompleted 
                    ? 'var(--accent-cyan)' 
                    : isActive 
                      ? '#ffffff' 
                      : 'var(--bg-surface-secondary)',
                  border: isActive 
                    ? '2px solid var(--accent-cyan)' 
                    : isCompleted 
                      ? '2px solid var(--accent-cyan)' 
                      : '1px solid #cbd5e1',
                  color: isCompleted ? '#ffffff' : isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  boxShadow: isActive ? '0 0 12px rgba(2, 132, 199, 0.4)' : '0 1px 2px rgba(15, 23, 42, 0.05)',
                  transition: 'all 0.3s ease'
                }}
                title={`Round ${round}`}
              >
                {isCompleted ? (
                  <Check size={13} strokeWidth={3} />
                ) : (
                  <span>{round}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
