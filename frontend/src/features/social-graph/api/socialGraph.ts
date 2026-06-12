import { httpClient } from '../../../shared/api/httpClient';
import type { PersonSummary, FollowResponse, FollowStats, FollowStatus } from '../types';

export const socialGraphApi = {
  follow(followerId: number, followingId: number): Promise<FollowResponse> {
    return httpClient.post<FollowResponse>('/api/users/v1/follow', { followerId, followingId });
  },

  unfollow(followerId: number, followingId: number): Promise<FollowResponse> {
    return httpClient.delete<FollowResponse>('/api/users/v1/follow', { followerId, followingId });
  },

  getFollowers(userId: number): Promise<PersonSummary[]> {
    return httpClient.get<PersonSummary[]>(`/api/users/v1/${userId}/followers`);
  },

  getFollowing(userId: number): Promise<PersonSummary[]> {
    return httpClient.get<PersonSummary[]>(`/api/users/v1/${userId}/following`);
  },

  getStats(userId: number): Promise<FollowStats> {
    return httpClient.get<FollowStats>(`/api/users/v1/${userId}/followers/count`);
  },

  getStatus(followerId: number, followingId: number): Promise<FollowStatus> {
    return httpClient.get<FollowStatus>(
      `/api/users/v1/${followingId}/follow-status`,
      { followerId: String(followerId) }
    );
  },

  getMutualFollowers(userId: number, otherUserId: number): Promise<PersonSummary[]> {
    return httpClient.get<PersonSummary[]>(`/api/users/v1/${userId}/mutual-followers/${otherUserId}`);
  },
};
