import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="mb-4 text-left">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full px-3 py-2 bg-gray-900 border ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-purple-500'
        } rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-150 ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};
