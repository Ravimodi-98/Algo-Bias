import React from 'react';

export interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Connecting to system...',
}) => {
  return (
    <div 
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        gap: '1rem',
        textAlign: 'center'
      }}
    >
      <div 
        style={{
          width: '36px',
          height: '36px',
          border: '3px solid rgba(2, 132, 199, 0.15)',
          borderTopColor: 'var(--accent-cyan)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} 
        aria-hidden="true"
      />
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', fontWeight: 600 }}>
        {message}
      </p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
