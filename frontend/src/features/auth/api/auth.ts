import { httpClient } from '../../../shared/api/httpClient';
import type {
  RegisterPayload,
  VerifyEmailPayload,
  LoginPasswordPayload,
  VerifyLoginOtpPayload,
  ForgotPasswordPayload,
  VerifyResetOtpPayload,
  ResetPasswordPayload,
  LoginResponse,
  VerifyResetOtpResponse,
} from '../types';

export const authApi = {
  register(payload: RegisterPayload): Promise<any> {
    return httpClient.post('/api/auth/v1/register', payload);
  },

  verifyEmail(payload: VerifyEmailPayload): Promise<any> {
    return httpClient.post('/api/auth/v1/verify-email', payload);
  },

  loginWithPassword(payload: LoginPasswordPayload): Promise<LoginResponse> {
    return httpClient.post<LoginResponse>('/api/auth/v1/login', payload);
  },

  requestLoginOtp(payload: { identifier: string }): Promise<any> {
    return httpClient.post('/api/auth/v1/login', payload);
  },

  verifyLoginOtp(payload: VerifyLoginOtpPayload): Promise<LoginResponse> {
    return httpClient.post<LoginResponse>('/api/auth/v1/verify-login-otp', payload);
  },

  forgotPassword(payload: ForgotPasswordPayload): Promise<any> {
    return httpClient.post('/api/auth/v1/forgot-password', payload);
  },

  verifyResetOtp(payload: VerifyResetOtpPayload): Promise<VerifyResetOtpResponse> {
    return httpClient.post<VerifyResetOtpResponse>('/api/auth/v1/verify-reset-otp', payload);
  },

  resetPassword(payload: ResetPasswordPayload): Promise<any> {
    return httpClient.post('/api/auth/v1/reset-password', payload);
  },
};
