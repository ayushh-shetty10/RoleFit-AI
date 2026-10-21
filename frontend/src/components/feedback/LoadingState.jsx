import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export const LoadingState = ({
  message = 'Loading...',
  variant = 'spinner', // 'spinner' | 'skeleton'
  fullPage = false,
  className = '',
}) => {
  const content = variant === 'spinner' ? (
    <div className="flex flex-col items-center justify-center text-center gap-3 p-8 min-h-[220px] w-full">
      <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      {message && <p className="text-xs font-medium text-muted max-w-sm">{message}</p>}
    </div>
  ) : (
    <div className="w-full flex flex-col gap-4 p-6 bg-surface border border-border rounded-md">
      <Skeleton variant="text" width="60%" height="24px" />
      <Skeleton variant="text" width="90%" height="16px" />
      <Skeleton variant="text" width="80%" height="16px" />
      <div className="pt-4 flex gap-3">
        <Skeleton variant="rectangular" width="100px" height="36px" />
        <Skeleton variant="rectangular" width="100px" height="36px" />
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <div className={`min-h-screen bg-app-bg flex items-center justify-center p-4 text-center ${className}`}>
        {content}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center w-full min-h-[50vh] ${className}`}>
      {content}
    </div>
  );
};

export default LoadingState;
