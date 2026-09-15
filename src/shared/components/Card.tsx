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
    boxShadow: 
      glow === 'cyan' 
        ? '0 0 25px rgba(0, 240, 255, 0.12)' 
        : glow === 'purple' 
        ? '0 0 25px rgba(139, 92, 246, 0.12)' 
        : 'none',
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
