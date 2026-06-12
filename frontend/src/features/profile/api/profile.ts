import { httpClient } from '../../../shared/api/httpClient';
import type { CurrentProfile, PublicProfile, UpdateProfilePayload } from '../types';

export const profileApi = {
  getCurrentProfile(): Promise<CurrentProfile> {
    return httpClient.get<CurrentProfile>('/api/users/v1/me');
  },

  getPublicProfile(username: string): Promise<PublicProfile> {
    return httpClient.get<PublicProfile>(`/api/users/v1/profiles/${encodeURIComponent(username)}`);
  },

  updateProfile(payload: UpdateProfilePayload): Promise<CurrentProfile> {
    return httpClient.patch<CurrentProfile>('/api/users/v1/me', payload);
  },
};
