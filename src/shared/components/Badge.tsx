import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'purple' | 'success' | 'warning' | 'danger';
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  pulse = false,
}) => {
  return (
    <span className={`badge badge-${variant}`}>
      {pulse && <span className="status-dot" />}
      {children}
    </span>
  );
};
