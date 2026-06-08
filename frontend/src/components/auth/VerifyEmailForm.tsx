import React, { useState } from 'react';
import { authApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';

export const VerifyEmailForm: React.FC = () => {
  const { setCurrentView, tempEmail } = useAuth();
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
        setCurrentView('login');
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
    <div className="max-w-md w-full p-6 bg-gray-950 border border-gray-800 rounded-lg shadow-xl text-white">
      <h2 className="text-2xl font-bold mb-2 text-center text-purple-400">Verify Email</h2>
      <p className="text-sm text-gray-400 mb-6 text-center">
        {tempEmail
          ? `We sent a verification token to ${tempEmail}.`
          : 'Please enter the verification token sent to your email.'}
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
          label="Verification Token"
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          placeholder="Paste token here"
        />

        <Button type="submit" isLoading={isLoading} className="mt-4">
          Verify Email
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-400">
        Need to register again?{' '}
        <button
          onClick={() => setCurrentView('register')}
          className="text-purple-400 hover:text-purple-300 font-medium underline"
        >
          Register
        </button>
        <span className="mx-2">|</span>
        <button
          onClick={() => setCurrentView('login')}
          className="text-purple-400 hover:text-purple-300 font-medium underline"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};
