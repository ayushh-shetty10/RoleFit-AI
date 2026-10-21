import React from 'react';

export const Select = ({
  label,
  error,
  helperText,
  options = [],
  disabled = false,
  required = false,
  className = '',
  id,
  children,
  ...props
}) => {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-xs font-medium text-foreground flex items-center gap-1">
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}
      <select
        id={selectId}
        disabled={disabled}
        required={required}
        className={`
          w-full rounded-sm bg-surface border text-sm text-foreground
          px-3 py-2 transition-colors duration-150 cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
          disabled:bg-app-bg disabled:text-muted disabled:cursor-not-allowed
          ${error ? 'border-danger focus:ring-danger/40 focus:border-danger' : 'border-border'}
          ${className}
        `}
        {...props}
      >
        {children || options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="text-xs text-danger font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-muted">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Select;
