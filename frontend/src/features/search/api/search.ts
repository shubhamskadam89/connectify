import { profileApi } from '../../profile/api/profile';
import type { PersonSummary } from '../../social-graph/types';

export const searchApi = {
  async searchUsers(username: string): Promise<PersonSummary[]> {
    if (!username) return [];
    try {
      const cleanUsername = username.trim().replace(/^@/, '');
      const profile = await profileApi.getPublicProfile(cleanUsername);
      return [
        {
          id: profile.id,
          userName: profile.username,
          firstName: profile.firstName,
          lastName: profile.lastName,
          profileImageUrl: profile.profileImageUrl,
        },
      ];
    } catch {
      // Return empty array if not found to handle gracefully in empty states
      return [];
    }
  },
};
