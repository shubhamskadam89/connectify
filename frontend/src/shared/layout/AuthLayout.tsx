import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-brand-bg px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-normal leading-none text-brand-text-primary tracking-tight select-none">
          Connectify
        </h1>
        <p className="mt-2 text-sm text-brand-text-secondary select-none">
          Professional Network Space
        </p>
      </div>

      <div className="w-full max-w-[420px] rounded-[8px] border border-brand-border bg-brand-surface p-6 shadow-sm sm:p-8">
        <Outlet />
      </div>
    </div>
  );
};
