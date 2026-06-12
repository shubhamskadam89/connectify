import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../utils/classNames';

export interface TabItem {
  to: string;
  label: string;
  end?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, className = '' }) => {
  return (
    <div
      className={cn(
        'flex w-full rounded-[8px] bg-brand-surface-muted p-1 text-brand-text-secondary border border-brand-border/40',
        className
      )}
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.label}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            cn(
              'flex-1 text-center py-1.5 text-[13px] font-medium leading-[18px] rounded-[6px] transition-all duration-150 select-none hover:text-brand-text-primary',
              isActive
                ? 'bg-brand-surface text-brand-text-primary shadow-sm font-semibold'
                : 'text-brand-text-secondary'
            )
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
};
