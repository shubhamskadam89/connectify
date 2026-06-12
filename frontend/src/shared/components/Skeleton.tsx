import React from 'react';
import { cn } from '../utils/classNames';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> & {
  Circle: React.FC<SkeletonProps & { size?: 'sm' | 'md' | 'lg' }>;
  Line: React.FC<SkeletonProps & { width?: string; height?: string }>;
  List: React.FC<SkeletonProps & { count?: number }>;
  Profile: React.FC<SkeletonProps>;
} = ({ className = '' }) => {
  return (
    <div className={cn('animate-pulse rounded bg-brand-border-strong/50', className)} />
  );
};

Skeleton.Circle = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };
  return (
    <div
      className={cn(
        'animate-pulse rounded-full bg-brand-border-strong/50',
        sizeClasses[size],
        className
      )}
    />
  );
};

Skeleton.Line = ({ width = 'w-full', height = 'h-4', className = '' }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-[4px] bg-brand-border-strong/50',
        width,
        height,
        className
      )}
    />
  );
};

Skeleton.List = ({ count = 5, className = '' }) => {
  return (
    <div className={cn('space-y-4 w-full', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 py-3 border-b border-brand-border/60 last:border-0">
          <Skeleton.Circle size="md" />
          <div className="flex-1 space-y-2">
            <Skeleton.Line width="w-1/3" height="h-4" />
            <Skeleton.Line width="w-1/2" height="h-3" />
          </div>
        </div>
      ))}
    </div>
  );
};

Skeleton.Profile = ({ className = '' }) => {
  return (
    <div className={cn('rounded-[8px] border border-brand-border bg-brand-surface p-5 space-y-5 animate-pulse', className)}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-full bg-brand-border-strong/50" />
          <div className="space-y-2 flex-1 min-w-[200px]">
            <div className="h-6 w-36 rounded bg-brand-border-strong/50" />
            <div className="h-4 w-24 rounded bg-brand-border-strong/50" />
            <div className="h-4 w-64 rounded bg-brand-border-strong/50 mt-3" />
          </div>
        </div>
        <div className="h-10 w-24 rounded-[8px] bg-brand-border-strong/50" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-4 border-t border-brand-border">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="rounded-[8px] border border-brand-border p-3 space-y-2">
            <div className="h-7 w-12 rounded bg-brand-border-strong/50" />
            <div className="h-3.5 w-16 rounded bg-brand-border-strong/50" />
          </div>
        ))}
      </div>
    </div>
  );
};

Skeleton.displayName = 'Skeleton';
Skeleton.Circle.displayName = 'Skeleton.Circle';
Skeleton.Line.displayName = 'Skeleton.Line';
Skeleton.List.displayName = 'Skeleton.List';
Skeleton.Profile.displayName = 'Skeleton.Profile';
