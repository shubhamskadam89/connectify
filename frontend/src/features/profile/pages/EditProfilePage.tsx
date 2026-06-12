import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { profileApi } from '../api/profile';
import { useAuth } from '../../auth/context/AuthContext';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Alert } from '../../../shared/components/Alert';
import { PageHeader } from '../../../shared/components/PageHeader';
import { Skeleton } from '../../../shared/components/Skeleton';
import { ArrowLeft } from 'lucide-react';

export const EditProfilePage: React.FC = () => {
  const { updateCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    profileImageUrl: '',
    location: '',
    website: '',
  });

  useEffect(() => {
    let ignore = false;

    async function loadCurrentProfile() {
      try {
        const profile = await profileApi.getCurrentProfile();
        if (!ignore) {
          setFormData({
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            bio: profile.bio || '',
            profileImageUrl: profile.profileImageUrl || '',
            location: profile.location || '',
            website: profile.website || '',
          });
        }
      } catch (err: any) {
        if (!ignore) {
          setError(err.message || 'Failed to fetch your profile information.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadCurrentProfile();

    return () => {
      ignore = true;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updatedProfile = await profileApi.updateProfile({
        firstName: formData.firstName.trim() || undefined,
        lastName: formData.lastName.trim() || undefined,
        bio: formData.bio.trim() || undefined,
        profileImageUrl: formData.profileImageUrl.trim() || undefined,
        location: formData.location.trim() || undefined,
        website: formData.website.trim() || undefined,
      });

      // Update local auth context
      updateCurrentUser({
        id: String(updatedProfile.id),
        email: updatedProfile.email,
        username: updatedProfile.username,
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        profileImageUrl: updatedProfile.profileImageUrl,
        bio: updatedProfile.bio,
        location: updatedProfile.location,
        website: updatedProfile.website,
      });

      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        navigate('/me');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile details.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Edit Profile" description="Loading profile settings form..." />
        <div className="rounded-[8px] border border-brand-border bg-brand-surface p-5 space-y-4">
          <Skeleton.Line width="w-1/4" height="h-4" />
          <Skeleton.Line width="w-full" height="h-10" />
          <Skeleton.Line width="w-1/4" height="h-4" />
          <Skeleton.Line width="w-full" height="h-10" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Edit Profile"
        description="Update your personal details, location coordinates, website link and bio."
        backLink={
          <Link
            to="/me"
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-text-secondary hover:text-brand-text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to profile
          </Link>
        }
      />

      {error && <Alert message={error} type="error" onClose={() => setError('')} />}
      {success && <Alert message={success} type="success" onClose={() => setSuccess('')} />}

      <form
        onSubmit={handleSubmit}
        className="rounded-[8px] border border-brand-border bg-brand-surface p-5 sm:p-6 shadow-sm flex flex-col gap-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="John"
          />
          <Input
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
          />
        </div>

        <Input
          label="Profile Image URL"
          name="profileImageUrl"
          value={formData.profileImageUrl}
          onChange={handleChange}
          placeholder="https://example.com/avatar.jpg"
          helperText="Provide a link to your hosted profile picture."
        />

        <div className="flex flex-col gap-1.5 text-left">
          <label
            htmlFor="bio"
            className="text-[13px] font-medium leading-[18px] text-brand-text-primary"
          >
            Biography
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Write a brief professional intro..."
            rows={4}
            className="w-full rounded-[8px] border border-brand-border bg-brand-surface px-3 py-2 text-sm leading-[22px] text-brand-text-primary placeholder-brand-text-muted transition-colors focus:border-brand-text-primary focus:outline-none focus:ring-1 focus:ring-brand-text-primary"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="San Francisco, CA"
          />
          <Input
            label="Website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-brand-border/60">
          <Link to="/me" className="w-full sm:w-auto">
            <Button type="button" variant="ghost" className="w-full sm:w-auto">
              Cancel
            </Button>
          </Link>
          <Button type="submit" isLoading={saving} className="w-full sm:w-auto">
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
};
