import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Alert } from '../../../shared/components/Alert';

export const VerifyEmailForm: React.FC = () => {
  const { tempEmail } = useAuth();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;

    setIsLoading(true);
    setStatus(null);

    try {
      await authApi.verifyEmail({ token: token.trim() });
      setStatus({
        type: 'success',
        message: 'Email verified successfully! Redirecting to login...',
      });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'Verification failed. Please check your token and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold leading-[32px] text-brand-text-primary">
          Verify email
        </h2>
        <p className="mt-1.5 text-sm leading-[22px] text-brand-text-secondary">
          {tempEmail
            ? `We sent a verification token to ${tempEmail}.`
            : 'Please enter the verification token sent to your email.'}
        </p>
      </div>

      {status && (
        <Alert
          type={status.type}
          message={status.message}
          onClose={() => setStatus(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Verification Token"
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          placeholder="Paste token here"
        />

        <Button type="submit" isLoading={isLoading} className="mt-2">
          Verify email
        </Button>
      </form>

      <div className="border-t border-brand-border pt-4 text-center text-sm text-brand-text-secondary leading-[22px]">
        Need to register again?{' '}
        <Link
          to="/signup"
          className="font-medium text-brand-text-primary hover:underline underline-offset-2"
        >
          Sign up
        </Link>
        <span className="mx-2 text-brand-border">|</span>
        <Link
          to="/login"
          className="font-medium text-brand-text-primary hover:underline underline-offset-2"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
};
