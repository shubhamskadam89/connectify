import React from 'react';
import { PageHeader } from '../../../shared/components/PageHeader';
import { EmptyState } from '../../../shared/components/EmptyState';
import { Settings } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Configure your account preferences, password changes, security status, and moderation filters."
      />
      <EmptyState
        icon={<Settings className="h-10 w-10 text-brand-text-muted" />}
        title="Account Settings Coming Soon"
        description="This control panel will enable password modifications, account deletion, dark mode options, and notification permissions."
      />
    </div>
  );
};
