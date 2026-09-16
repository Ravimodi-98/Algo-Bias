import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline-cyan' | 'purple' | 'danger' | 'ghost';
  size?: 'small' | 'normal' | 'large';
  block?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'normal',
  block = false,
  icon,
  className = '',
  style,
  ...props
}) => {
  const variantClass = variant === 'ghost' ? 'btn-ghost' : `btn-${variant}`;
  const sizeClass = size === 'large' ? 'btn-large' : size === 'small' ? 'btn-small' : '';
  const blockClass = block ? 'btn-block' : '';

  const extraStyles: React.CSSProperties = variant === 'ghost' ? {
    background: 'transparent',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-secondary)',
    ...style
  } : style || {};

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${blockClass} ${className}`}
      style={extraStyles}
      {...props}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
};
