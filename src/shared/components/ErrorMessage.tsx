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
    <div style={{
      background: 'rgba(239, 68, 68, 0.08)',
      border: '1px solid rgba(239, 68, 68, 0.25)',
      borderRadius: 'var(--radius-md)',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.75rem',
      textAlign: 'center',
      margin: '1rem 0'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'rgba(239, 68, 68, 0.15)',
        color: 'var(--color-danger)'
      }}>
        <AlertTriangle size={20} />
      </div>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fca5a5' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '400px' }}>
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" size="normal" onClick={onRetry} style={{ marginTop: '0.5rem' }}>
          Try Again
        </Button>
      )}
    </div>
  );
};
