import React from 'react';
import { cn } from '../utils/classNames';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  backLink?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  action,
  backLink,
  className = '',
}) => {
  return (
    <div className={cn('flex flex-col gap-2 pb-5 border-b border-brand-border md:flex-row md:items-center md:justify-between md:gap-4', className)}>
      <div className="flex flex-col gap-1">
        {backLink && <div className="mb-1">{backLink}</div>}
        <h1 className="text-2xl font-semibold leading-[32px] text-brand-text-primary tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm leading-[22px] text-brand-text-secondary font-normal">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex shrink-0 items-center gap-3">{action}</div>}
    </div>
  );
};
