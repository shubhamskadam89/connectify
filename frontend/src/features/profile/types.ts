export interface CurrentProfile {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  profileImageUrl?: string;
  location?: string;
  website?: string;
  role: string;
  emailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PublicProfile {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  profileImageUrl?: string;
  location?: string;
  website?: string;
  createdAt?: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  bio?: string;
  profileImageUrl?: string;
  location?: string;
  website?: string;
}
