const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export class ApiClientError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const validationMessage = data?.validationErrors
      ?.map((error: { field: string; message: string }) => `${error.field}: ${error.message}`)
      .join(', ');
    const errorMessage =
      validationMessage || data?.message || data?.error || `Request failed with status ${response.status}`;
    throw new ApiClientError(errorMessage, response.status);
  }

  return data as T;
}

function authHeaders(accessToken: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
}

export interface CurrentUserProfile {
  id: number;
  email: string;
  username: string;
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;
  profileImageUrl?: string | null;
  location?: string | null;
  website?: string | null;
  role: string;
  emailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PublicUserProfile {
  id: number;
  username: string;
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;
  profileImageUrl?: string | null;
  location?: string | null;
  website?: string | null;
  createdAt?: string;
}

export interface UpdateUserProfilePayload {
  firstName?: string;
  lastName?: string;
  bio?: string;
  profileImageUrl?: string;
  location?: string;
  website?: string;
}

export const userApi = {
  async getCurrentUser(accessToken: string): Promise<CurrentUserProfile> {
    const response = await fetch(`${BASE_URL}/api/users/v1/me`, {
      method: 'GET',
      headers: authHeaders(accessToken),
    });
    return handleResponse<CurrentUserProfile>(response);
  },

  async updateCurrentUser(
    accessToken: string,
    payload: UpdateUserProfilePayload
  ): Promise<CurrentUserProfile> {
    const response = await fetch(`${BASE_URL}/api/users/v1/me`, {
      method: 'PATCH',
      headers: authHeaders(accessToken),
      body: JSON.stringify(payload),
    });
    return handleResponse<CurrentUserProfile>(response);
  },

  async getPublicProfile(username: string): Promise<PublicUserProfile> {
    const response = await fetch(`${BASE_URL}/api/users/v1/profiles/${encodeURIComponent(username)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse<PublicUserProfile>(response);
  },
};
