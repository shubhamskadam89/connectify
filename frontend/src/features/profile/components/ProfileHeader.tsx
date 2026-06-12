import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '../../../shared/components/Avatar';
import { Button } from '../../../shared/components/Button';
import { formatDisplayName, formatWebsiteUrl } from '../../../shared/utils/formatters';
import { MapPin, Link as LinkIcon, Edit3, UserPlus, UserCheck } from 'lucide-react';

interface ProfileHeaderProps {
  profile: {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    profileImageUrl?: string;
    location?: string;
    website?: string;
  };
  stats?: {
    followersCount: number;
    followingCount: number;
  };
  isOwnProfile: boolean;
  isFollowing?: boolean;
  onToggleFollow?: () => void;
  isFollowLoading?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  stats,
  isOwnProfile,
  isFollowing = false,
  onToggleFollow,
  isFollowLoading = false,
}) => {
  const displayName = formatDisplayName(profile);
  const websiteFormatted = formatWebsiteUrl(profile.website);

  return (
    <section className="rounded-[8px] border border-brand-border bg-brand-surface p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between md:gap-6">
        
        {/* Profile Info Grid */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <Avatar
            src={profile.profileImageUrl}
            name={displayName}
            size="xl"
            className="self-start sm:self-auto"
          />

          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-semibold leading-[32px] text-brand-text-primary tracking-tight truncate">
              {displayName}
            </h2>
            <p className="text-sm leading-[22px] text-brand-text-secondary">
              @{profile.username}
            </p>

            {profile.bio && (
              <p className="mt-3 max-w-2xl text-sm leading-[22px] text-brand-text-primary font-normal">
                {profile.bio}
              </p>
            )}

            {/* Metadata Rows */}
            <div className="mt-3.5 flex flex-wrap gap-x-4 gap-y-2 text-xs leading-[16px] text-brand-text-secondary">
              {profile.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.website && (
                <div className="flex items-center gap-1">
                  <LinkIcon className="h-3.5 w-3.5" />
                  <a
                    href={websiteFormatted}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-brand-text-primary hover:underline underline-offset-2"
                  >
                    {profile.website.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0">
          {isOwnProfile ? (
            <Link to="/me/edit" className="inline-block w-full sm:w-auto">
              <Button variant="secondary" className="w-full gap-2 sm:w-auto">
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </Button>
            </Link>
          ) : (
            <Button
              onClick={onToggleFollow}
              isLoading={isFollowLoading}
              variant={isFollowing ? 'secondary' : 'primary'}
              className="w-full sm:w-auto gap-2"
            >
              {isFollowing ? (
                <>
                  <UserCheck className="h-4 w-4" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Follow
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Profile Metrics Grid */}
      {stats && (
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-brand-border/60 pt-5 sm:grid-cols-4">
          <div className="rounded-[8px] border border-brand-border/60 bg-brand-bg/50 p-3 text-center sm:text-left">
            <p className="text-xl font-semibold leading-[28px] text-brand-text-primary">
              {stats.followersCount}
            </p>
            <p className="text-xs text-brand-text-secondary mt-0.5">Followers</p>
          </div>
          <div className="rounded-[8px] border border-brand-border/60 bg-brand-bg/50 p-3 text-center sm:text-left">
            <p className="text-xl font-semibold leading-[28px] text-brand-text-primary">
              {stats.followingCount}
            </p>
            <p className="text-xs text-brand-text-secondary mt-0.5">Following</p>
          </div>
          <div className="rounded-[8px] border border-brand-border/60 bg-brand-bg/50 p-3 text-center sm:text-left">
            <p className="text-xl font-semibold leading-[28px] text-brand-text-primary">
              #{profile.id}
            </p>
            <p className="text-xs text-brand-text-secondary mt-0.5">Profile ID</p>
          </div>
          <div className="rounded-[8px] border border-brand-border/60 bg-brand-bg/50 p-3 text-center sm:text-left">
            <p className="text-xl font-semibold leading-[28px] text-brand-text-primary truncate">
              {isOwnProfile ? 'Creator' : 'Member'}
            </p>
            <p className="text-xs text-brand-text-secondary mt-0.5">Status</p>
          </div>
        </div>
      )}
    </section>
  );
};
