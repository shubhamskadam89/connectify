import React from 'react';
import { PageHeader } from '../../../shared/components/PageHeader';
import { EmptyState } from '../../../shared/components/EmptyState';
import { Rss } from 'lucide-react';

export const FeedPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Feed"
        description="Stay up to date with posts from your professional connections."
      />
      <EmptyState
        icon={<Rss className="h-10 w-10 text-brand-text-muted" />}
        title="Social Feed Coming Soon"
        description="We are building a rich feed space where you can share posts, comment, react, and bookmark updates from your follow circle."
      />
    </div>
  );
};
