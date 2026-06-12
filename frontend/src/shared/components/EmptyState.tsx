import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-[8px] border border-dashed border-brand-border bg-brand-surface p-8 text-center sm:p-12">
      {icon && (
        <div className="mb-4 text-brand-text-muted">
          <span className="flex h-12 w-12 items-center justify-center [&_svg]:h-10 [&_svg]:w-10">
            {icon}
          </span>
        </div>
      )}
      <h3 className="text-base font-semibold leading-[24px] text-brand-text-primary">
        {title}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm leading-[22px] text-brand-text-secondary">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};
