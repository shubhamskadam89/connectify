import React from 'react';
import { cn } from '../utils/classNames';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, type = 'text', ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5 w-full text-left">
        <label
          htmlFor={inputId}
          className="text-[13px] font-medium leading-[18px] text-brand-text-primary"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            'h-[42px] w-full rounded-[8px] border bg-brand-surface px-3 py-2 text-sm leading-[22px] text-brand-text-primary placeholder-brand-text-muted transition-colors focus:outline-none focus:ring-1 focus:ring-brand-text-primary focus:border-brand-text-primary disabled:cursor-not-allowed disabled:bg-brand-surface-muted disabled:text-brand-text-muted',
            error ? 'border-brand-danger focus:ring-brand-danger focus:border-brand-danger' : 'border-brand-border',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs leading-[16px] text-brand-danger">{error}</p>
        ) : helperText ? (
          <p className="text-xs leading-[16px] text-brand-text-secondary">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
