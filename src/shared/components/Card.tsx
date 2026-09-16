import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: 'none' | 'cyan' | 'purple';
}

export const Card: React.FC<CardProps> = ({
  children,
  glow = 'none',
  className = '',
  style,
  ...props
}) => {
  const glowStyle: React.CSSProperties = {
    padding: '1.5rem',
    background: '#ffffff',
    boxShadow: 
      glow === 'cyan' 
        ? '0 4px 20px rgba(2, 132, 199, 0.12), 0 1px 3px rgba(15, 23, 42, 0.05)' 
        : glow === 'purple' 
        ? '0 4px 20px rgba(124, 58, 237, 0.12), 0 1px 3px rgba(15, 23, 42, 0.05)' 
        : '0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 16px rgba(15, 23, 42, 0.03)',
    borderColor:
      glow === 'cyan'
        ? 'var(--border-cyan)'
        : glow === 'purple'
        ? 'var(--border-purple)'
        : undefined,
    ...style,
  };

  return (
    <div className={`glass-panel ${className}`} style={glowStyle} {...props}>
      {children}
    </div>
  );
};
