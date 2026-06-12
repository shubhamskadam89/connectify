export interface PersonSummary {
  id: number;
  userName: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

export interface FollowResponse {
  followerId: number;
  followingId: number;
  msg: string;
}

export interface FollowStats {
  userId: number;
  followersCount: number;
  followingCount: number;
}

export interface FollowStatus {
  followerId: number;
  followingId: number;
  following: boolean;
}
