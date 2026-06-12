import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { socialGraphApi } from '../api/socialGraph';
import type { PersonSummary } from '../types';
import { PeopleList } from '../components/PeopleList';
import { profileApi } from '../../profile/api/profile';
import { PageHeader } from '../../../shared/components/PageHeader';
import { Skeleton } from '../../../shared/components/Skeleton';
import { Alert } from '../../../shared/components/Alert';
import { ArrowLeft, Users } from 'lucide-react';

export const MutualFollowersPage: React.FC = () => {
  const { username, otherUsername } = useParams<{ username: string; otherUsername: string }>();
  
  const [firstProfile, setFirstProfile] = useState<{ id: number; username: string } | null>(null);
  const [secondProfile, setSecondProfile] = useState<{ id: number; username: string } | null>(null);
  const [people, setPeople] = useState<PersonSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadMutual() {
      if (!username || !otherUsername) return;
      setLoading(true);
      setError('');

      try {
        const [first, second] = await Promise.all([
          profileApi.getPublicProfile(username),
          profileApi.getPublicProfile(otherUsername),
        ]);
        const mutualFollowers = await socialGraphApi.getMutualFollowers(first.id, second.id);

        if (!ignore) {
          setFirstProfile(first);
          setSecondProfile(second);
          setPeople(mutualFollowers);
        }
      } catch (err: any) {
        if (!ignore) {
          setError(err.message || 'Failed to fetch mutual followers.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadMutual();

    return () => {
      ignore = true;
    };
  }, [username, otherUsername]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Mutual Connections" description="Finding mutual followers in common..." />
        <Skeleton.List count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <Alert message={error} type="error" onClose={() => setError('')} />
        <div className="flex gap-4">
          {username && (
            <Link to={`/u/${username}`} className="flex items-center gap-1.5 text-sm font-semibold text-brand-text-secondary">
              <ArrowLeft className="h-4 w-4" />
              Back to @{username}
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (!firstProfile || !secondProfile) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Mutual Followers"
        description={`Displaying mutual connections shared by @${firstProfile.username} and @${secondProfile.username}.`}
        backLink={
          <Link
            to={`/u/${firstProfile.username}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-text-secondary hover:text-brand-text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to @{firstProfile.username}
          </Link>
        }
      />

      <div className="rounded-[8px] border border-brand-border bg-brand-surface p-5 shadow-sm">
        <div className="flex items-center gap-3 text-brand-text-primary">
          <Users className="h-5 w-5 text-brand-text-secondary" />
          <span className="text-sm font-medium">
            Social intersection between @{firstProfile.username} and @{secondProfile.username}
          </span>
        </div>
      </div>

      <PeopleList
        people={people}
        emptyLabel="No mutual followers found between these two profiles."
      />

      <div className="flex justify-between items-center text-sm border-t border-brand-border/60 pt-4 mt-2">
        <Link
          to={`/u/${firstProfile.username}`}
          className="font-medium text-brand-text-secondary hover:text-brand-text-primary hover:underline underline-offset-2"
        >
          View @{firstProfile.username}'s profile
        </Link>
        <Link
          to={`/u/${secondProfile.username}`}
          className="font-medium text-brand-text-secondary hover:text-brand-text-primary hover:underline underline-offset-2"
        >
          View @{secondProfile.username}'s profile
        </Link>
      </div>
    </div>
  );
};
