import React from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';
import { cn } from '../utils/classNames';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  message: string;
  type?: AlertType;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  message,
  type = 'error',
  onClose,
  className = '',
}) => {
  const styles = {
    info: 'bg-brand-surface-muted border-brand-border-strong text-brand-text-primary',
    success: 'bg-brand-success-soft border-[rgba(47,125,80,0.2)] text-brand-success',
    warning: 'bg-brand-warning-soft border-[rgba(155,106,36,0.2)] text-brand-warning',
    error: 'bg-brand-danger-soft border-[rgba(185,67,61,0.2)] text-brand-danger',
  };

  const icons = {
    info: <Info className="h-5 w-5 shrink-0" />,
    success: <CheckCircle className="h-5 w-5 shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 shrink-0" />,
  };

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-[8px] border p-3 text-sm leading-[20px] transition-all duration-150',
        styles[type],
        className
      )}
    >
      {icons[type]}
      <div className="flex-1 pr-1 font-normal">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="text-current opacity-70 hover:opacity-100 transition-opacity focus:outline-none"
          aria-label="Close alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
