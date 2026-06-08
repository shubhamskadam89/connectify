import React, { useState } from 'react';
import { authApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';

export const LoginForm: React.FC = () => {
  const { login, setCurrentView } = useAuth();
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  
  // OTP flow state
  const [otpStep, setOtpStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) return;

    setIsLoading(true);
    setStatus(null);

    try {
      const response = await authApi.loginWithPassword({
        identifier: identifier.trim(),
        password,
      });
      setStatus({ type: 'success', message: 'Login successful! Redirecting...' });
      
      // Store token/user in context
      login(response.accessToken, response.refreshToken, response.user);
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'Login failed. Please check your credentials.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;

    setIsLoading(true);
    setStatus(null);

    try {
      await authApi.requestLoginOtp({ identifier: identifier.trim() });
      setStatus({ type: 'success', message: 'OTP sent to your email!' });
      setOtpStep(2);
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'Failed to request OTP. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;

    setIsLoading(true);
    setStatus(null);

    try {
      const response = await authApi.verifyLoginOtp({
        email: identifier.trim(), // We use identifier as the email
        otp: otp.trim(),
      });
      setStatus({ type: 'success', message: 'OTP verified successfully!' });
      
      // Store token/user in context
      login(response.accessToken, response.refreshToken, response.user);
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'OTP verification failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setLoginMode(loginMode === 'password' ? 'otp' : 'password');
    setOtpStep(1);
    setOtp('');
    setStatus(null);
  };

  return (
    <div className="max-w-md w-full p-6 bg-gray-950 border border-gray-800 rounded-lg shadow-xl text-white">
      <h2 className="text-2xl font-bold mb-2 text-center text-purple-400">Welcome Back</h2>
      <p className="text-sm text-gray-400 mb-6 text-center">
        {loginMode === 'password'
          ? 'Sign in with username/email and password'
          : otpStep === 1
          ? 'Sign in with a one-time passcode'
          : 'Enter the passcode sent to your email'}
      </p>

      {status && (
        <Alert
          type={status.type}
          message={status.message}
          onClose={() => setStatus(null)}
        />
      )}

      {loginMode === 'password' ? (
        <form onSubmit={handlePasswordSubmit}>
          <Input
            label="Email or Username"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            placeholder="user@example.com"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
          <div className="text-right mb-4">
            <button
              type="button"
              onClick={() => setCurrentView('forgotPassword')}
              className="text-xs text-purple-400 hover:text-purple-300 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <Button type="submit" isLoading={isLoading}>
            Login
          </Button>
        </form>
      ) : otpStep === 1 ? (
        <form onSubmit={handleRequestOtp}>
          <Input
            label="Email Address"
            type="email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            placeholder="user@example.com"
          />
          <Button type="submit" isLoading={isLoading}>
            Send OTP Code
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp}>
          <p className="text-xs text-gray-400 mb-2">Sending to: <span className="font-semibold text-gray-200">{identifier}</span></p>
          <Input
            label="One-Time Passcode (OTP)"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            placeholder="123456"
            maxLength={6}
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOtpStep(1)}
              className="w-1/3"
            >
              Back
            </Button>
            <Button type="submit" isLoading={isLoading} className="w-2/3">
              Verify & Login
            </Button>
          </div>
        </form>
      )}

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-800"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-950 px-2 text-gray-500">Or Continue With</span>
        </div>
      </div>

      <Button variant="secondary" onClick={toggleMode} className="mb-4">
        {loginMode === 'password' ? 'Login with OTP' : 'Login with Password'}
      </Button>

      <div className="mt-6 text-center text-sm text-gray-400 font-medium">
        Don't have an account?{' '}
        <button
          onClick={() => setCurrentView('register')}
          className="text-purple-400 hover:text-purple-300 underline"
        >
          Register
        </button>
        <span className="mx-2">|</span>
        <button
          onClick={() => setCurrentView('verifyEmail')}
          className="text-purple-400 hover:text-purple-300 underline"
        >
          Verify Email
        </button>
      </div>
    </div>
  );
};
