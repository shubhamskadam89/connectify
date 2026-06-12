import React from 'react';
import { PageHeader } from '../../../shared/components/PageHeader';
import { EmptyState } from '../../../shared/components/EmptyState';
import { Bell } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Notifications"
        description="Receive instant alerts for connection activity and messages."
      />
      <EmptyState
        icon={<Bell className="h-10 w-10 text-brand-text-muted" />}
        title="Notifications Hub Coming Soon"
        description="Get real-time notification alerts when other members follow you back, view your profile, or send you text messages."
      />
    </div>
  );
};
