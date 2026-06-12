import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Alert } from '../../../shared/components/Alert';

export const ForgotPasswordForm: React.FC = () => {
  const { setResetToken } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setStatus(null);

    try {
      await authApi.forgotPassword({ email: email.trim() });
      setStatus({ type: 'success', message: 'Reset password OTP has been sent to your email.' });
      setStep(2);
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'Failed to send reset code. Please try again.',
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
      const response = await authApi.verifyResetOtp({
        email: email.trim(),
        otp: otp.trim(),
      });
      
      setStatus({ type: 'success', message: 'Code verified! Loading password reset form...' });
      setResetToken(response.resetToken);
      
      setTimeout(() => {
        navigate('/reset-password');
      }, 1500);
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'Verification failed. Please check your OTP and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold leading-[32px] text-brand-text-primary">
          Forgot password
        </h2>
        <p className="mt-1.5 text-sm leading-[22px] text-brand-text-secondary">
          {step === 1
            ? 'Enter your email address to receive a password reset code.'
            : 'Enter the passcode sent to your email.'}
        </p>
      </div>

      {status && (
        <Alert
          type={status.type}
          message={status.message}
          onClose={() => setStatus(null)}
        />
      )}

      {step === 1 ? (
        <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="user@example.com"
          />
          <Button type="submit" isLoading={isLoading} className="mt-2">
            Send Reset OTP
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
          <p className="text-xs text-brand-text-secondary leading-[16px]">
            Sending to: <span className="font-semibold text-brand-text-primary">{email}</span>
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
              onClick={() => setStep(1)}
              className="w-1/3"
            >
              Back
            </Button>
            <Button type="submit" isLoading={isLoading} className="w-2/3">
              Verify Code
            </Button>
          </div>
        </form>
      )}

      <div className="border-t border-brand-border pt-4 text-center text-sm text-brand-text-secondary leading-[22px]">
        Remembered your password?{' '}
        <Link
          to="/login"
          className="font-medium text-brand-text-primary hover:underline underline-offset-2"
        >
          Login
        </Link>
      </div>
    </div>
  );
};
