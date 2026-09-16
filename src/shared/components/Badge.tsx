import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'purple' | 'success' | 'warning' | 'danger';
  pulse?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  pulse = false,
  style,
  className = ''
}) => {
  return (
    <span className={`badge badge-${variant} ${className}`} style={style}>
      {pulse && <span className="status-dot" />}
      {children}
    </span>
  );
};
