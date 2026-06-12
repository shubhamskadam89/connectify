import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { profileApi } from '../api/profile';
import type { CurrentProfile } from '../types';
import { ProfileHeader } from '../components/ProfileHeader';
import { socialGraphApi } from '../../social-graph/api/socialGraph';
import type { PersonSummary } from '../../social-graph/types';
import { PeopleList } from '../../social-graph/components/PeopleList';
import { Tabs } from '../../../shared/components/Tabs';
import { Alert } from '../../../shared/components/Alert';
import { Skeleton } from '../../../shared/components/Skeleton';
import { useAuth } from '../../auth/context/AuthContext';
import { PageHeader } from '../../../shared/components/PageHeader';

export const MyProfilePage: React.FC = () => {
  const { updateCurrentUser } = useAuth();
  const [profile, setProfile] = useState<CurrentProfile | null>(null);
  const [followers, setFollowers] = useState<PersonSummary[]>([]);
  const [following, setFollowing] = useState<PersonSummary[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadProfileData() {
      setLoading(true);
      setError('');

      try {
        const nextProfile = await profileApi.getCurrentProfile();
        
        // Sync with AuthContext user details
        updateCurrentUser({
          id: String(nextProfile.id),
          email: nextProfile.email,
          username: nextProfile.username,
          firstName: nextProfile.firstName,
          lastName: nextProfile.lastName,
          profileImageUrl: nextProfile.profileImageUrl,
          bio: nextProfile.bio,
          location: nextProfile.location,
          website: nextProfile.website,
        });

        const [nextFollowers, nextFollowing] = await Promise.all([
          socialGraphApi.getFollowers(nextProfile.id),
          socialGraphApi.getFollowing(nextProfile.id),
        ]);

        if (!ignore) {
          setProfile(nextProfile);
          setFollowers(nextFollowers);
          setFollowing(nextFollowing);
        }
      } catch (err: any) {
        if (!ignore) {
          setError(err.message || 'Failed to load profile data.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProfileData();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Profile" description="Loading your profile detail..." />
        <Skeleton.Profile />
      </div>
    );
  }

  if (error) {
    return <Alert message={error} type="error" onClose={() => setError('')} />;
  }

  if (!profile) {
    return null;
  }

  const tabItems = [
    { to: '/me', label: 'Overview', end: true },
    { to: '/me/followers', label: 'Followers' },
    { to: '/me/following', label: 'Following' },
  ];

  const totalConnections = followers.length + following.length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My Profile"
        description="Manage your profile information and view your social graph network."
      />

      <ProfileHeader
        profile={profile}
        stats={{
          followersCount: followers.length,
          followingCount: following.length,
        }}
        isOwnProfile
      />

      <div className="flex items-center justify-between border-b border-brand-border/60 pb-2">
        <h3 className="text-[13px] font-semibold uppercase tracking-wider text-brand-text-secondary leading-[18px]">
          Your Network Graph
        </h3>
        <span className="text-xs text-brand-text-muted">
          {totalConnections} total connections shown
        </span>
      </div>

      <Tabs tabs={tabItems} />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Followers Preview Column */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-brand-text-primary leading-[20px]">
              Followers
            </h4>
            <Link
              to="/me/followers"
              className="text-xs text-brand-text-secondary hover:text-brand-text-primary hover:underline underline-offset-4 font-medium"
            >
              View all page
            </Link>
          </div>
          <PeopleList
            people={followers.slice(0, 6)}
            emptyLabel="No followers yet. Share your profile link to get connections."
          />
        </section>

        {/* Following Preview Column */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-brand-text-primary leading-[20px]">
              Following
            </h4>
            <Link
              to="/me/following"
              className="text-xs text-brand-text-secondary hover:text-brand-text-primary hover:underline underline-offset-4 font-medium"
            >
              View all page
            </Link>
          </div>
          <PeopleList
            people={following.slice(0, 6)}
            emptyLabel="You are not following anyone yet. Search users to build your network."
          />
        </section>
      </div>
    </div>
  );
};
