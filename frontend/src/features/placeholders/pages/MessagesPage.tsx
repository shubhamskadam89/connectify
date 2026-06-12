import React from 'react';
import { PageHeader } from '../../../shared/components/PageHeader';
import { EmptyState } from '../../../shared/components/EmptyState';
import { MessageSquare } from 'lucide-react';

export const MessagesPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Messages"
        description="Direct messages will appear here once messaging is enabled."
      />
      <EmptyState
        icon={<MessageSquare className="h-10 w-10 text-brand-text-muted" />}
        title="Direct Messaging Coming Soon"
        description="Private text messages, file attachments and network group chats are under development and will be enabled soon."
      />
    </div>
  );
};
