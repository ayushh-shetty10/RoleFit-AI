import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  startIcon: StartIcon,
  endIcon: EndIcon,
  disabled = false,
  required = false,
  className = '',
  id,
  type = 'text',
  ...props
}) => {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-foreground flex items-center gap-1">
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {StartIcon && (
          <div className="absolute left-3 text-muted pointer-events-none flex items-center justify-center">
            <StartIcon className="h-4 w-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          disabled={disabled}
          required={required}
          className={`
            w-full rounded-sm bg-surface border text-sm text-foreground placeholder:text-muted/60
            px-3 py-2 transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
            disabled:bg-app-bg disabled:text-muted disabled:cursor-not-allowed
            ${error ? 'border-danger focus:ring-danger/40 focus:border-danger' : 'border-border'}
            ${StartIcon ? 'pl-9' : ''}
            ${EndIcon ? 'pr-9' : ''}
            ${className}
          `}
          {...props}
        />
        {EndIcon && (
          <div className="absolute right-3 text-muted pointer-events-none flex items-center justify-center">
            <EndIcon className="h-4 w-4" />
          </div>
        )}
      </div>
      {error ? (
        <p className="text-xs text-danger font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-muted">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;
