import React from 'react';

const variantBarStyles = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export const Progress = ({
  value = 0,
  max = 100,
  label,
  showPercentage = false,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const percentage = Math.min(Math.max(0, Math.round((value / max) * 100)), 100);

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`} {...props}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-medium text-foreground">
          {label && <span>{label}</span>}
          {showPercentage && <span className="text-muted font-normal">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-border/60 rounded-full overflow-hidden ${sizeStyles[size] || sizeStyles.md}`}>
        <div
          className={`h-full transition-all duration-300 ease-out rounded-full ${variantBarStyles[variant] || variantBarStyles.primary}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
