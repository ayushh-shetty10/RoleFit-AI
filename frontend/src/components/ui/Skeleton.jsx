import React from 'react';

export const Skeleton = ({
  variant = 'text',
  width,
  height,
  className = '',
  ...props
}) => {
  const variantStyles = {
    text: 'h-4 w-full rounded-sm',
    circular: 'rounded-full',
    rectangular: 'rounded-sm',
  };

  const style = {
    width: width !== undefined ? width : undefined,
    height: height !== undefined ? height : undefined,
  };

  return (
    <div
      className={`animate-pulse bg-border/60 ${variantStyles[variant] || variantStyles.text} ${className}`}
      style={style}
      {...props}
    />
  );
};
