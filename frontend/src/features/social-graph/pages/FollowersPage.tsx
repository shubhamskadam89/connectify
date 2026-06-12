import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { socialGraphApi } from '../api/socialGraph';
import type { PersonSummary } from '../types';
import { PeopleList } from '../components/PeopleList';
import { profileApi } from '../../profile/api/profile';
import { useAuth } from '../../auth/context/AuthContext';
import { PageHeader } from '../../../shared/components/PageHeader';
import { Skeleton } from '../../../shared/components/Skeleton';
import { Alert } from '../../../shared/components/Alert';
import { Tabs } from '../../../shared/components/Tabs';
import { ArrowLeft } from 'lucide-react';

export const FollowersPage: React.FC = () => {
  const { username } = useParams<{ username?: string }>();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<{ id: number; username: string; firstName?: string; lastName?: string } | null>(null);
  const [people, setPeople] = useState<PersonSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isOwnProfile = !username || user?.username?.toLowerCase() === username?.toLowerCase();
  const currentUsername = username || user?.username || '';
  const basePath = isOwnProfile ? '/me' : `/u/${currentUsername}`;

  useEffect(() => {
    let ignore = false;

    async function loadFollowers() {
      setLoading(true);
      setError('');

      try {
        let profileId = 0;
        let activeProfile = null;

        if (isOwnProfile) {
          const ownProfile = await profileApi.getCurrentProfile();
          profileId = ownProfile.id;
          activeProfile = ownProfile;
        } else {
          const publicProfile = await profileApi.getPublicProfile(currentUsername);
          profileId = publicProfile.id;
          activeProfile = publicProfile;
        }

        const followers = await socialGraphApi.getFollowers(profileId);

        if (!ignore) {
          setProfile(activeProfile);
          setPeople(followers);
        }
      } catch (err: any) {
        if (!ignore) {
          setError(err.message || 'Failed to fetch followers list.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadFollowers();

    return () => {
      ignore = true;
    };
  }, [username, isOwnProfile, currentUsername]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Followers" description="Loading connections list..." />
        <Skeleton.List count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <Alert message={error} type="error" onClose={() => setError('')} />
        <Link to={basePath} className="flex items-center gap-1.5 text-sm font-semibold text-brand-text-secondary">
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Link>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const profileName = profile.firstName || profile.username;
  const tabItems = [
    { to: basePath, label: 'Overview', end: true },
    { to: `${basePath}/followers`, label: 'Followers' },
    { to: `${basePath}/following`, label: 'Following' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`${profileName}'s Followers`}
        description={isOwnProfile ? 'Manage the people following your profile.' : `Viewing users who follow @${profile.username}.`}
        backLink={
          <Link
            to={basePath}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-text-secondary hover:text-brand-text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to profile
          </Link>
        }
      />

      <Tabs tabs={tabItems} />

      <PeopleList
        people={people}
        emptyLabel={isOwnProfile ? 'No followers yet. Share your updates to get noticed!' : `@${profile.username} has no followers yet.`}
      />
    </div>
  );
};
