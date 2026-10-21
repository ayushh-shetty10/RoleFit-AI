import React from 'react';

const variantStyles = {
  primary: 'bg-primary-soft text-primary border-primary/40',
  secondary: 'bg-secondary-soft text-secondary border-secondary/40',
  accent: 'bg-accent-soft text-accent border-accent/40',
  success: 'bg-success/20 text-success border-success/40',
  warning: 'bg-warning/20 text-warning border-warning/40',
  danger: 'bg-danger/20 text-danger border-danger/40',
  neutral: 'bg-surface text-muted border-border',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-[11px] font-medium tracking-wide',
  md: 'px-2.5 py-1 text-xs font-medium tracking-wide',
};

export const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  ...props
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-sm border ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${className}`}
      {...props}
    >
      {Icon && <Icon className="h-3 w-3 shrink-0" />}
      {children}
    </span>
  );
};

export default Badge;
