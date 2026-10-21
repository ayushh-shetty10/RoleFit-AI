import React from 'react';

export const PageHeader = ({
  title,
  subtitle,
  actions,
  backAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-b border-border/60 mb-6 ${className}`}>
      <div className="flex items-start gap-3">
        {backAction && (
          <div className="pt-0.5">
            {backAction}
          </div>
        )}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-muted mt-1 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2 sm:self-center shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};
