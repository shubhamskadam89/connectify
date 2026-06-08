import React from 'react';

interface AlertProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ message, type = 'error', onClose }) => {
  const styles = {
    error: 'bg-red-950/50 border-red-500/50 text-red-200',
    success: 'bg-green-950/50 border-green-500/50 text-green-200',
    info: 'bg-blue-950/50 border-blue-500/50 text-blue-200',
  };

  return (
    <div
      className={`flex items-start justify-between p-3 border rounded-md mb-4 text-sm ${styles[type]} transition-all duration-150`}
      role="alert"
    >
      <div className="flex-1 pr-2">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-current opacity-70 hover:opacity-100 focus:outline-none ml-2"
          aria-label="Close"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
