import React, { useState } from 'react';
import { authApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';

export const ResetPasswordForm: React.FC = () => {
  const { setCurrentView, resetToken, setResetToken } = useAuth();
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
        setCurrentView('login');
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
      <div className="max-w-md w-full p-6 bg-gray-950 border border-gray-800 rounded-lg shadow-xl text-white text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-500">Session Expired</h2>
        <p className="text-sm text-gray-400 mb-6">
          No reset token found. You must verify your email reset code first.
        </p>
        <Button onClick={() => setCurrentView('forgotPassword')}>
          Go to Forgot Password
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full p-6 bg-gray-950 border border-gray-800 rounded-lg shadow-xl text-white">
      <h2 className="text-2xl font-bold mb-2 text-center text-purple-400">Reset Password</h2>
      <p className="text-sm text-gray-400 mb-6 text-center">
        Please enter your new password below.
      </p>

      {status && (
        <Alert
          type={status.type}
          message={status.message}
          onClose={() => setStatus(null)}
        />
      )}

      <form onSubmit={handleSubmit}>
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
        <Button type="submit" isLoading={isLoading} className="mt-4">
          Reset Password
        </Button>
      </form>
    </div>
  );
};
