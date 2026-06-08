const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function handleResponse<T>(response: Response): Promise<T> {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password?: string;
  firstName?: string | null;
  lastName?: string | null;
}

export interface VerifyEmailPayload {
  token: string;
}

export interface LoginPasswordPayload {
  identifier: string;
  password?: string;
}

export interface VerifyLoginOtpPayload {
  email: string;
  otp: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyResetOtpPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  resetToken: string;
  newPassword?: string;
}

export interface User {
  id?: string | number;
  email: string;
  username: string;
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;
  profileImageUrl?: string | null;
  location?: string | null;
  website?: string | null;
  [key: string]: any;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

export interface VerifyResetOtpResponse {
  resetToken: string;
}

export const authApi = {
  async register(payload: RegisterPayload): Promise<any> {
    const response = await fetch(`${BASE_URL}/api/auth/v1/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  async verifyEmail(payload: VerifyEmailPayload): Promise<any> {
    const response = await fetch(`${BASE_URL}/api/auth/v1/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  async loginWithPassword(payload: LoginPasswordPayload): Promise<LoginResponse> {
    const response = await fetch(`${BASE_URL}/api/auth/v1/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<LoginResponse>(response);
  },

  async requestLoginOtp(payload: { identifier: string }): Promise<any> {
    const response = await fetch(`${BASE_URL}/api/auth/v1/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  async verifyLoginOtp(payload: VerifyLoginOtpPayload): Promise<LoginResponse> {
    const response = await fetch(`${BASE_URL}/api/auth/v1/verify-login-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<LoginResponse>(response);
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<any> {
    const response = await fetch(`${BASE_URL}/api/auth/v1/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  async verifyResetOtp(payload: VerifyResetOtpPayload): Promise<VerifyResetOtpResponse> {
    const response = await fetch(`${BASE_URL}/api/auth/v1/verify-reset-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<VerifyResetOtpResponse>(response);
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<any> {
    const response = await fetch(`${BASE_URL}/api/auth/v1/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },
};
