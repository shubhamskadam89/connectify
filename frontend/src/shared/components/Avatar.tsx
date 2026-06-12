import React from 'react';
import { cn } from '../utils/classNames';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: AvatarSize;
  className?: string;
  hasRing?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = '?',
  size = 'md',
  className = '',
  hasRing = false,
}) => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || '?';

  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-16 w-16 text-2xl',
    xl: 'h-24 w-24 text-3xl font-semibold',
  };

  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center rounded-full select-none overflow-hidden',
        sizeClasses[size],
        hasRing && 'ring-2 ring-brand-accent ring-offset-2',
        !src && 'bg-brand-text-primary text-white font-medium',
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          onError={(e) => {
            // If image fails, remove image src to render initials
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};
