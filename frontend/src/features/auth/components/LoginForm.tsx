import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Alert } from '../../../shared/components/Alert';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  
  // OTP flow state
  const [otpStep, setOtpStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

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
      
      // Navigate to own profile
      setTimeout(() => {
        navigate('/me');
      }, 500);
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
        email: identifier.trim(),
        otp: otp.trim(),
      });
      setStatus({ type: 'success', message: 'OTP verified successfully!' });
      
      // Store token/user in context
      login(response.accessToken, response.refreshToken, response.user);
      
      setTimeout(() => {
        navigate('/me');
      }, 500);
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
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold leading-[32px] text-brand-text-primary">
          Welcome back
        </h2>
        <p className="mt-1.5 text-sm leading-[22px] text-brand-text-secondary">
          {loginMode === 'password'
            ? 'Sign in to continue to Connectify.'
            : otpStep === 1
            ? 'Sign in with a one-time passcode.'
            : 'Enter the passcode sent to your email.'}
        </p>
      </div>

      {status && (
        <Alert
          type={status.type === 'info' ? 'info' : status.type}
          message={status.message}
          onClose={() => setStatus(null)}
        />
      )}

      {loginMode === 'password' ? (
        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
          <Input
            label="Email or Username"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            placeholder="user@example.com"
          />
          <div className="flex flex-col gap-1.5">
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-brand-text-secondary hover:text-brand-text-primary hover:underline underline-offset-2"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          <Button type="submit" isLoading={isLoading} className="mt-2">
            Login
          </Button>
        </form>
      ) : otpStep === 1 ? (
        <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
          <Input
            label="Email Address"
            type="email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            placeholder="user@example.com"
          />
          <Button type="submit" isLoading={isLoading} className="mt-2">
            Send OTP Code
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
          <p className="text-xs text-brand-text-secondary leading-[16px]">
            Sending to: <span className="font-semibold text-brand-text-primary">{identifier}</span>
          </p>
          <Input
            label="One-Time Passcode (OTP)"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            placeholder="123456"
            maxLength={6}
          />
          <div className="flex gap-3 mt-2">
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

      <div className="relative my-2 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-brand-border"></div>
        </div>
        <div className="relative bg-brand-surface px-3 text-xs uppercase tracking-wider text-brand-text-muted select-none">
          Or Continue With
        </div>
      </div>

      <Button variant="secondary" onClick={toggleMode}>
        {loginMode === 'password' ? 'Login with OTP' : 'Login with Password'}
      </Button>

      <div className="border-t border-brand-border pt-4 text-center text-sm text-brand-text-secondary leading-[22px]">
        Don't have an account?{' '}
        <Link
          to="/signup"
          className="font-medium text-brand-text-primary hover:underline underline-offset-2"
        >
          Sign up
        </Link>
        <span className="mx-2 text-brand-border">|</span>
        <Link
          to="/verify-email"
          className="font-medium text-brand-text-primary hover:underline underline-offset-2"
        >
          Verify email
        </Link>
      </div>
    </div>
  );
};
