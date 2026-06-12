import React from 'react';
import { cn } from '../utils/classNames';

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={cn('flex items-center justify-between gap-4 py-2', className)}>
      <div className="flex flex-col gap-0.5">
        <h2 className="text-[18px] font-semibold leading-[28px] text-brand-text-primary">
          {title}
        </h2>
        {description && (
          <p className="text-xs leading-[16px] text-brand-text-secondary">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 text-sm">{action}</div>}
    </div>
  );
};
