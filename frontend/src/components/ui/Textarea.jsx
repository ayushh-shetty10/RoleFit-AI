import React from 'react';

export const Textarea = ({
  label,
  error,
  helperText,
  disabled = false,
  required = false,
  rows = 4,
  className = '',
  id,
  ...props
}) => {
  const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-xs font-medium text-foreground flex items-center gap-1">
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        disabled={disabled}
        required={required}
        className={`
          w-full rounded-sm bg-surface border text-sm text-foreground placeholder:text-muted/60
          px-3 py-2 transition-colors duration-150 resize-y
          focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
          disabled:bg-app-bg disabled:text-muted disabled:cursor-not-allowed
          ${error ? 'border-danger focus:ring-danger/40 focus:border-danger' : 'border-border'}
          ${className}
        `}
        {...props}
      />
      {error ? (
        <p className="text-xs text-danger font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-muted">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Textarea;
