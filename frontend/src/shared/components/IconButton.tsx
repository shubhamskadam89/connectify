import React from 'react';
import { cn } from '../utils/classNames';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  ariaLabel: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  ariaLabel,
  className = '',
  ...props
}) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-[8px] text-brand-text-secondary transition-colors duration-150 hover:bg-brand-surface-muted hover:text-brand-text-primary active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-border-strong',
        className
      )}
      {...props}
    >
      <span className="flex h-5 w-5 items-center justify-center">
        {icon}
      </span>
    </button>
  );
};
