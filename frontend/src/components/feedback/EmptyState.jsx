import React from 'react';

export const EmptyState = ({
  icon: Icon,
  title = 'No data found',
  description = 'There are no items to display at this time.',
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-surface border border-border rounded-md shadow-sm ${className}`}>
      {Icon && (
        <div className="h-12 w-12 rounded-full bg-primary-soft text-primary flex items-center justify-center mb-4">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-muted max-w-sm mb-6 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
