import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Alert } from '../../../shared/components/Alert';

export const ResetPasswordForm: React.FC = () => {
  const { resetToken, setResetToken } = useAuth();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetToken) {
      setStatus({ type: 'error', message: 'Reset token missing. Please restart forgot password process.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setIsLoading(true);
    setStatus(null);

    try {
      await authApi.resetPassword({
        resetToken,
        newPassword,
      });
      setStatus({ type: 'success', message: 'Password reset successful! Redirecting to login...' });
      setResetToken(null);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'Failed to reset password. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!resetToken) {
    return (
      <div className="flex flex-col gap-6 text-center">
        <h2 className="text-2xl font-semibold leading-[32px] text-brand-danger">
          Session Expired
        </h2>
        <p className="text-sm leading-[22px] text-brand-text-secondary font-normal">
          No reset token found. You must verify your email reset code first.
        </p>
        <Link to="/forgot-password" className="w-full">
          <Button variant="secondary" className="w-full">
            Go to forgot password
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold leading-[32px] text-brand-text-primary">
          Reset password
        </h2>
        <p className="mt-1.5 text-sm leading-[22px] text-brand-text-secondary">
          Please enter your new password below.
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
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          placeholder="••••••••"
        />
        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="••••••••"
        />
        <Button type="submit" isLoading={isLoading} className="mt-2">
          Reset Password
        </Button>
      </form>
    </div>
  );
};
