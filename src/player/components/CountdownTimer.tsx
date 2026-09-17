import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ROUND_TIME_LIMIT } from '../../shared/data/rounds';

export interface CountdownTimerProps {
  roundStartedAt?: string;
  isSubmitted?: boolean;
  onTimeout: () => void;
  timeLimit?: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  roundStartedAt,
  isSubmitted = false,
  onTimeout,
  timeLimit = ROUND_TIME_LIMIT
}) => {
  const calculateRemaining = (): number => {
    if (!roundStartedAt) return timeLimit;
    const startTime = new Date(roundStartedAt).getTime();
    const elapsedSeconds = (Date.now() - startTime) / 1000;
    const remaining = Math.max(0, Math.ceil(timeLimit - elapsedSeconds));
    return remaining;
  };

  const [remainingSeconds, setRemainingSeconds] = useState<number>(calculateRemaining);

  useEffect(() => {
    // If player already submitted, freeze countdown
    if (isSubmitted) return;

    const tick = () => {
      const remaining = calculateRemaining();
      setRemainingSeconds(remaining);

      if (remaining <= 0) {
        onTimeout();
      }
    };

    // Immediate initial sync
    tick();

    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [roundStartedAt, isSubmitted, timeLimit, onTimeout]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // 3-Tier Visual Feedback Hierarchy
  const isFinalSeconds = remainingSeconds <= 5 && remainingSeconds > 0 && !isSubmitted;
  const isGettingLow = remainingSeconds <= 15 && remainingSeconds > 5 && !isSubmitted;
  const isExpired = remainingSeconds <= 0 && !isSubmitted;

  const progressPercent = Math.max(0, Math.min(100, (remainingSeconds / timeLimit) * 100));

  const borderColor = isSubmitted
    ? 'var(--border-subtle)'
    : isExpired || isFinalSeconds
    ? 'rgba(220, 38, 38, 0.35)'
    : isGettingLow
    ? 'rgba(180, 83, 9, 0.3)'
    : 'var(--border-subtle)';

  const bgColor = isSubmitted
    ? '#ffffff'
    : isExpired
    ? '#fef2f2'
    : isFinalSeconds
    ? 'rgba(254, 242, 242, 0.75)'
    : isGettingLow
    ? 'rgba(255, 251, 235, 0.75)'
    : '#ffffff';

  const accentColor = isSubmitted
    ? 'var(--color-success)'
    : isExpired || isFinalSeconds
    ? 'var(--color-danger)'
    : isGettingLow
    ? 'var(--color-warning)'
    : 'var(--accent-cyan)';

  const labelText = isSubmitted
    ? 'DECISION LOCKED'
    : isExpired
    ? 'TIME EXPIRED'
    : isFinalSeconds
    ? 'FINAL SECONDS'
    : isGettingLow
    ? 'TIME GETTING LOW'
    : 'TIME REMAINING';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.65rem 1rem',
        background: bgColor,
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${borderColor}`,
        boxShadow: 'var(--shadow-xs)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background-color 0.3s ease, border-color 0.3s ease'
      }}
      role="timer"
      aria-label={`${labelText}: ${formattedTime}`}
      aria-live="polite"
    >
      {/* Progress background bar */}
      {!isSubmitted && !isExpired && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '3px',
            background: isFinalSeconds
              ? 'var(--color-danger)'
              : isGettingLow
              ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
              : 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))',
            width: `${progressPercent}%`,
            transition: 'width 1s linear'
          }}
        />
      )}

      {/* Left: Status & Label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {isSubmitted ? (
          <CheckCircle2 size={15} color="var(--color-success)" />
        ) : isExpired ? (
          <AlertTriangle size={15} color="var(--color-danger)" />
        ) : isFinalSeconds ? (
          <AlertTriangle size={15} color="var(--color-danger)" />
        ) : isGettingLow ? (
          <Clock size={15} color="var(--color-warning)" />
        ) : (
          <Clock size={15} color="var(--accent-cyan)" />
        )}

        <span style={{
          fontSize: '0.72rem',
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: accentColor
        }}>
          {labelText}
        </span>
      </div>

      {/* Right: Digits Countdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <span
          className="font-mono"
          style={{
            fontSize: '1.05rem',
            fontWeight: 900,
            color: accentColor,
            letterSpacing: '0.04em'
          }}
        >
          {isSubmitted ? 'SAVED' : formattedTime}
        </span>
      </div>
    </div>
  );
};
