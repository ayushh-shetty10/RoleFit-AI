import React from 'react';

export const Card = ({ className = '', elevated = false, children, ...props }) => (
  <div
    className={`${elevated ? 'bg-surface-elevated' : 'bg-surface'} border border-border rounded-md shadow-sm overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ className = '', children, ...props }) => (
  <div
    className={`p-5 pb-3 flex flex-col gap-1 border-b border-border/50 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle = ({ className = '', children, ...props }) => (
  <h3
    className={`text-base font-semibold text-foreground tracking-tight ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription = ({ className = '', children, ...props }) => (
  <p
    className={`text-xs text-muted leading-relaxed ${className}`}
    {...props}
  >
    {children}
  </p>
);

export const CardContent = ({ className = '', children, ...props }) => (
  <div className={`p-5 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className = '', children, ...props }) => (
  <div
    className={`px-5 py-3 bg-app-bg/40 border-t border-border/50 flex items-center justify-between ${className}`}
    {...props}
  >
    {children}
  </div>
);
