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

  const isLowTime = remainingSeconds <= 10 && remainingSeconds > 0 && !isSubmitted;
  const isExpired = remainingSeconds <= 0 && !isSubmitted;

  const progressPercent = Math.max(0, Math.min(100, (remainingSeconds / timeLimit) * 100));

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.65rem 1rem',
        background: isExpired ? '#fef2f2' : '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: isExpired
          ? '1px solid #fecaca'
          : isLowTime
          ? '1px solid #fed7aa'
          : '1px solid var(--border-subtle)',
        boxShadow: '0 1px 4px rgba(15, 23, 42, 0.04)',
        position: 'relative',
        overflow: 'hidden'
      }}
      role="timer"
      aria-label={`Time remaining: ${formattedTime}`}
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
            background: isLowTime
              ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
              : 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))',
            width: `${progressPercent}%`,
            transition: 'width 1s linear'
          }}
        />
      )}

      {/* Left: Status & Label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
        {isSubmitted ? (
          <CheckCircle2 size={15} color="var(--color-success)" />
        ) : isExpired ? (
          <AlertTriangle size={15} color="var(--color-danger)" />
        ) : isLowTime ? (
          <Clock size={15} color="var(--color-warning)" style={{ animation: 'pulse 1s infinite' }} />
        ) : (
          <Clock size={15} color="var(--accent-cyan)" />
        )}

        <span style={{
          fontSize: '0.72rem',
          fontWeight: 800,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: isSubmitted
            ? 'var(--color-success)'
            : isExpired
            ? 'var(--color-danger)'
            : isLowTime
            ? 'var(--color-warning)'
            : 'var(--text-muted)'
        }}>
          {isSubmitted
            ? 'DECISION LOCKED'
            : isExpired
            ? 'TIME EXPIRED'
            : isLowTime
            ? 'FINAL SECONDS'
            : 'TIME REMAINING'}
        </span>
      </div>

      {/* Right: Digits Countdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <span
          className="font-mono"
          style={{
            fontSize: '1.05rem',
            fontWeight: 900,
            color: isSubmitted
              ? 'var(--color-success)'
              : isExpired
              ? 'var(--color-danger)'
              : isLowTime
              ? 'var(--color-warning)'
              : 'var(--accent-cyan)'
          }}
        >
          {isSubmitted ? 'SAVED' : formattedTime}
        </span>
      </div>
    </div>
  );
};
