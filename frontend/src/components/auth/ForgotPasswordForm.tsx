import React, { useState } from 'react';
import { authApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';

export const ForgotPasswordForm: React.FC = () => {
  const { setCurrentView, setResetToken } = useAuth();
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
        setCurrentView('resetPassword');
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
    <div className="max-w-md w-full p-6 bg-gray-950 border border-gray-800 rounded-lg shadow-xl text-white">
      <h2 className="text-2xl font-bold mb-2 text-center text-purple-400">Forgot Password</h2>
      <p className="text-sm text-gray-400 mb-6 text-center">
        {step === 1
          ? 'Enter your email address to receive a password reset code.'
          : 'Enter the passcode sent to your email.'}
      </p>

      {status && (
        <Alert
          type={status.type}
          message={status.message}
          onClose={() => setStatus(null)}
        />
      )}

      {step === 1 ? (
        <form onSubmit={handleRequestOtp}>
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="user@example.com"
          />
          <Button type="submit" isLoading={isLoading}>
            Send Reset OTP
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp}>
          <p className="text-xs text-gray-400 mb-2">Sending to: <span className="font-semibold text-gray-200">{email}</span></p>
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

      <div className="mt-6 text-center text-sm text-gray-400">
        Remembered your password?{' '}
        <button
          onClick={() => setCurrentView('login')}
          className="text-purple-400 hover:text-purple-300 font-medium underline"
        >
          Login
        </button>
      </div>
    </div>
  );
};
