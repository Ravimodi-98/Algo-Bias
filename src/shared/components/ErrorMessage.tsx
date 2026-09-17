import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'System Notice',
  message = 'Something went wrong. Please try again.',
  onRetry,
}) => {
  return (
    <div 
      role="alert"
      aria-live="assertive"
      style={{
        background: 'rgba(220, 38, 38, 0.06)',
        border: '1px solid rgba(220, 38, 38, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.65rem',
        textAlign: 'center',
        margin: '1rem 0'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        background: 'rgba(220, 38, 38, 0.12)',
        color: 'var(--color-danger)'
      }}>
        <AlertTriangle size={20} />
      </div>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#b91c1c' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '420px', lineHeight: 1.5 }}>
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" size="small" onClick={onRetry} style={{ marginTop: '0.35rem' }}>
          Try Again
        </Button>
      )}
    </div>
  );
};
