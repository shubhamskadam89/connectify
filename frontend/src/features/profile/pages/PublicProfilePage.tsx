import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { profileApi } from '../api/profile';
import type { PublicProfile } from '../types';
import { ProfileHeader } from '../components/ProfileHeader';
import { socialGraphApi } from '../../social-graph/api/socialGraph';
import type { PersonSummary, FollowStats } from '../../social-graph/types';
import { PeopleList } from '../../social-graph/components/PeopleList';
import { Tabs } from '../../../shared/components/Tabs';
import { Alert } from '../../../shared/components/Alert';
import { Skeleton } from '../../../shared/components/Skeleton';
import { useAuth } from '../../auth/context/AuthContext';
import { PageHeader } from '../../../shared/components/PageHeader';
import { Button } from '../../../shared/components/Button';
import { ArrowLeft } from 'lucide-react';

export const PublicProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [stats, setStats] = useState<FollowStats | null>(null);
  const [followers, setFollowers] = useState<PersonSummary[]>([]);
  const [following, setFollowing] = useState<PersonSummary[]>([]);
  
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [followLoading, setFollowLoading] = useState(false);
  const [compareUsername, setCompareUsername] = useState('');

  const isOwnProfile = useMemo(() => {
    return user?.username?.toLowerCase() === username?.toLowerCase();
  }, [user?.username, username]);

  useEffect(() => {
    let ignore = false;

    async function loadPublicData() {
      if (!username) return;
      setLoading(true);
      setError('');

      try {
        const nextProfile = await profileApi.getPublicProfile(username);
        const [nextStats, nextFollowers, nextFollowing] = await Promise.all([
          socialGraphApi.getStats(nextProfile.id),
          socialGraphApi.getFollowers(nextProfile.id),
          socialGraphApi.getFollowing(nextProfile.id),
        ]);

        let initialFollowState = false;
        if (user?.id && !isOwnProfile) {
          const status = await socialGraphApi.getStatus(Number(user.id), nextProfile.id);
          initialFollowState = status.following;
        }

        if (!ignore) {
          setProfile(nextProfile);
          setStats(nextStats);
          setFollowers(nextFollowers);
          setFollowing(nextFollowing);
          setIsFollowing(initialFollowState);
        }
      } catch (err: any) {
        if (!ignore) {
          setError(err.message || 'Failed to load public profile.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadPublicData();

    return () => {
      ignore = true;
    };
  }, [username, user?.id, isOwnProfile]);

  const handleFollowToggle = async () => {
    if (!profile || !user?.id || isOwnProfile) return;
    setFollowLoading(true);
    setError('');

    try {
      if (isFollowing) {
        await socialGraphApi.unfollow(Number(user.id), profile.id);
        setIsFollowing(false);
      } else {
        await socialGraphApi.follow(Number(user.id), profile.id);
        setIsFollowing(true);
      }

      // Re-fetch stats count to display correctly
      const nextStats = await socialGraphApi.getStats(profile.id);
      setStats(nextStats);
      
      // Re-fetch list to show up in preview lists
      const nextFollowers = await socialGraphApi.getFollowers(profile.id);
      setFollowers(nextFollowers);
    } catch (err: any) {
      setError(err.message || 'Failed to toggle follow status.');
    } finally {
      setFollowLoading(false);
    }
  };

  const handleCompareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const compareTo = compareUsername.trim().replace(/^@/, '');
    if (!compareTo || !profile) return;
    navigate(`/u/${profile.username}/mutual/${encodeURIComponent(compareTo)}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Profile" description="Loading member profile details..." />
        <Skeleton.Profile />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <Alert message={error} type="error" onClose={() => setError('')} />
        <Link to="/me" className="flex items-center gap-1.5 text-sm font-semibold text-brand-text-secondary">
          <ArrowLeft className="h-4 w-4" />
          Back to your profile
        </Link>
      </div>
    );
  }

  if (!profile || !stats) {
    return null;
  }

  const basePath = isOwnProfile ? '/me' : `/u/${profile.username}`;

  const tabItems = [
    { to: basePath, label: 'Overview', end: true },
    { to: `${basePath}/followers`, label: 'Followers' },
    { to: `${basePath}/following`, label: 'Following' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={profile.firstName || profile.username}
        description={`Viewing @${profile.username}'s public profile space.`}
        backLink={
          <Link
            to="/me"
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-text-secondary hover:text-brand-text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to your profile
          </Link>
        }
      />

      <ProfileHeader
        profile={profile}
        stats={stats}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        onToggleFollow={handleFollowToggle}
        isFollowLoading={followLoading}
      />

      <Tabs tabs={tabItems} />

      {/* Mutual Followers Compare Section */}
      {!isOwnProfile && user && (
        <section className="rounded-[8px] border border-brand-border bg-brand-surface p-5 shadow-sm">
          <form onSubmit={handleCompareSubmit} className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-6">
            <div className="flex flex-col gap-0.5">
              <h4 className="text-sm font-semibold text-brand-text-primary leading-[20px]">
                Compare Mutual Connections
              </h4>
              <p className="text-xs text-brand-text-secondary">
                See people who follow both you and @{profile.username}.
              </p>
            </div>
            <div className="flex flex-1 max-w-md items-center gap-3 w-full">
              <input
                aria-label="Compare username"
                type="text"
                placeholder="Enter username (e.g. @janedoe)"
                value={compareUsername}
                onChange={(e) => setCompareUsername(e.target.value)}
                className="h-[38px] flex-1 rounded-[8px] border border-brand-border bg-brand-bg px-3 text-xs leading-[20px] text-brand-text-primary placeholder-brand-text-muted focus:border-brand-text-primary focus:outline-none"
              />
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                disabled={!compareUsername.trim()}
                className="h-[38px] shrink-0"
              >
                Compare
              </Button>
            </div>
          </form>
        </section>
      )}

      {/* Network Grids */}
      <div className="grid gap-6 md:grid-cols-2">
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-brand-text-primary leading-[20px]">
              Followers
            </h4>
            <Link
              to={`${basePath}/followers`}
              className="text-xs text-brand-text-secondary hover:text-brand-text-primary hover:underline underline-offset-4 font-medium"
            >
              View all page
            </Link>
          </div>
          <PeopleList
            people={followers.slice(0, 6)}
            emptyLabel={`@${profile.username} has no followers yet.`}
          />
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-brand-text-primary leading-[20px]">
              Following
            </h4>
            <Link
              to={`${basePath}/following`}
              className="text-xs text-brand-text-secondary hover:text-brand-text-primary hover:underline underline-offset-4 font-medium"
            >
              View all page
            </Link>
          </div>
          <PeopleList
            people={following.slice(0, 6)}
            emptyLabel={`@${profile.username} is not following anyone yet.`}
          />
        </section>
      </div>
    </div>
  );
};
