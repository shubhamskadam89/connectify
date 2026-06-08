import React, { useEffect, useMemo, useState } from 'react';
import { ApiClientError, type CurrentUserProfile, type PublicUserProfile, userApi } from '../../api/users';
import { useAuth } from '../../context/AuthContext';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

type DashboardTab = 'profile' | 'public';

interface ProfileFormState {
  firstName: string;
  lastName: string;
  bio: string;
  profileImageUrl: string;
  location: string;
  website: string;
}

const emptyForm: ProfileFormState = {
  firstName: '',
  lastName: '',
  bio: '',
  profileImageUrl: '',
  location: '',
  website: '',
};

export const Dashboard: React.FC = () => {
  const { accessToken, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('profile');
  const [profile, setProfile] = useState<CurrentUserProfile | null>(null);
  const [form, setForm] = useState<ProfileFormState>(emptyForm);
  const [publicUsername, setPublicUsername] = useState('');
  const [publicProfile, setPublicProfile] = useState<PublicUserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const displayName = useMemo(() => formatName(profile), [profile]);

  useEffect(() => {
    if (!accessToken) {
      logout();
      return;
    }

    let isMounted = true;
    setIsLoadingProfile(true);
    setError(null);

    userApi
      .getCurrentUser(accessToken)
      .then((currentProfile) => {
        if (!isMounted) return;
        setProfile(currentProfile);
        setForm(toFormState(currentProfile));
        updateUser(currentProfile);
      })
      .catch((apiError) => {
        if (!isMounted) return;
        handleApiError(apiError);
      })
      .finally(() => {
        if (isMounted) setIsLoadingProfile(false);
      });

    return () => {
      isMounted = false;
    };
  }, [accessToken, logout, updateUser]);

  const handleApiError = (apiError: unknown) => {
    if (apiError instanceof ApiClientError && apiError.status === 401) {
      logout();
      return;
    }

    setError(apiError instanceof Error ? apiError.message : 'Something went wrong');
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleProfileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accessToken) {
      logout();
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedProfile = await userApi.updateCurrentUser(accessToken, form);
      setProfile(updatedProfile);
      setForm(toFormState(updatedProfile));
      updateUser(updatedProfile);
      setSuccess('Profile updated successfully.');
    } catch (apiError) {
      handleApiError(apiError);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublicSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = publicUsername.trim();
    if (!username) {
      setError('Enter a username to view a public profile.');
      return;
    }

    setIsSearching(true);
    setError(null);
    setSuccess(null);
    setPublicProfile(null);

    try {
      const foundProfile = await userApi.getPublicProfile(username);
      setPublicProfile(foundProfile);
    } catch (apiError) {
      handleApiError(apiError);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <main className="w-full max-w-4xl text-white">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-purple-300">{displayName || 'Profile'}</h1>
          <p className="text-sm text-gray-400">@{profile?.username || 'loading'}</p>
        </div>
        <Button onClick={logout} variant="secondary" className="w-full sm:w-auto">
          Logout
        </Button>
      </div>

      <div className="mb-5 grid grid-cols-2 rounded-md border border-gray-800 bg-gray-950 p-1">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`rounded px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'profile' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-900'
          }`}
        >
          My profile
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('public')}
          className={`rounded px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'public' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-900'
          }`}
        >
          Public lookup
        </button>
      </div>

      {error && <Alert message={error} type="error" onClose={() => setError(null)} />}
      {success && <Alert message={success} type="success" onClose={() => setSuccess(null)} />}

      {activeTab === 'profile' ? (
        <section className="rounded-lg border border-gray-800 bg-gray-950 p-5 shadow-xl">
          {isLoadingProfile ? (
            <div className="py-10 text-center text-sm text-gray-400">Loading profile...</div>
          ) : (
            <form onSubmit={handleProfileSubmit}>
              <div className="grid gap-x-4 sm:grid-cols-2">
                <Input
                  label="First name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleInputChange}
                  maxLength={255}
                />
                <Input
                  label="Last name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleInputChange}
                  maxLength={255}
                />
                <Input
                  label="Location"
                  name="location"
                  value={form.location}
                  onChange={handleInputChange}
                  maxLength={255}
                />
                <Input
                  label="Website"
                  name="website"
                  value={form.website}
                  onChange={handleInputChange}
                  maxLength={255}
                />
              </div>

              <Input
                label="Profile image URL"
                name="profileImageUrl"
                value={form.profileImageUrl}
                onChange={handleInputChange}
                maxLength={255}
              />

              <div className="mb-4 text-left">
                <label htmlFor="bio" className="mb-1 block text-sm font-medium text-gray-300">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={form.bio}
                  onChange={handleInputChange}
                  rows={4}
                  maxLength={500}
                  className="w-full resize-none rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white placeholder-gray-500 transition-colors duration-150 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="mb-5 grid gap-3 border-t border-gray-800 pt-4 text-sm sm:grid-cols-3">
                <ProfileFact label="Email" value={profile?.email} />
                <ProfileFact label="Role" value={profile?.role} />
                <ProfileFact label="Email verified" value={profile?.emailVerified ? 'Yes' : 'No'} />
              </div>

              <Button type="submit" isLoading={isSaving}>
                Save profile
              </Button>
            </form>
          )}
        </section>
      ) : (
        <section className="rounded-lg border border-gray-800 bg-gray-950 p-5 shadow-xl">
          <form onSubmit={handlePublicSearch} className="mb-5 flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <Input
                label="Username"
                value={publicUsername}
                onChange={(event) => setPublicUsername(event.target.value)}
                placeholder="testuser"
                className="mb-0"
              />
            </div>
            <Button type="submit" isLoading={isSearching} className="mt-0 sm:mt-6 sm:w-auto">
              View profile
            </Button>
          </form>

          {publicProfile ? (
            <PublicProfileCard profile={publicProfile} />
          ) : (
            <div className="rounded-md border border-gray-800 bg-gray-900/60 p-6 text-center text-sm text-gray-400">
              Search by username to display a public profile.
            </div>
          )}
        </section>
      )}
    </main>
  );
};

const ProfileFact: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
  <div>
    <p className="text-xs font-medium text-gray-500">{label}</p>
    <p className="break-words text-sm font-semibold text-gray-200">{value || 'N/A'}</p>
  </div>
);

const PublicProfileCard: React.FC<{ profile: PublicUserProfile }> = ({ profile }) => (
  <div className="rounded-md border border-gray-800 bg-gray-900/60 p-5">
    <div className="mb-4 flex flex-col gap-1">
      <h2 className="text-xl font-bold text-purple-300">{formatName(profile) || profile.username}</h2>
      <p className="text-sm text-gray-400">@{profile.username}</p>
    </div>
    <div className="grid gap-3 text-sm sm:grid-cols-2">
      <ProfileFact label="Bio" value={profile.bio} />
      <ProfileFact label="Location" value={profile.location} />
      <ProfileFact label="Website" value={profile.website} />
      <ProfileFact label="Joined" value={formatDate(profile.createdAt)} />
    </div>
  </div>
);

function toFormState(profile: CurrentUserProfile): ProfileFormState {
  return {
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    bio: profile.bio || '',
    profileImageUrl: profile.profileImageUrl || '',
    location: profile.location || '',
    website: profile.website || '',
  };
}

function formatName(profile?: Pick<CurrentUserProfile, 'firstName' | 'lastName'> | null) {
  if (!profile) return '';
  return [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim();
}

function formatDate(value?: string) {
  if (!value) return 'N/A';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value));
}
