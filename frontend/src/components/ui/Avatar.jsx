import React, { useState } from 'react';

const sizeStyles = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-11 w-11 text-base',
};

const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const Avatar = ({
  src,
  name = '',
  size = 'md',
  shape = 'circle',
  className = '',
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(name);
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-sm';

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 bg-primary-soft text-primary font-medium border border-primary/20 overflow-hidden select-none ${shapeClass} ${sizeStyles[size] || sizeStyles.md} ${className}`}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};
