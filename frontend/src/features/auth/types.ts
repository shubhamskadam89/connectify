export interface User {
  id?: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  emailVerified?: boolean;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password?: string;
  firstName?: string;
  lastName?: string;
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

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

export interface VerifyResetOtpResponse {
  resetToken: string;
}
