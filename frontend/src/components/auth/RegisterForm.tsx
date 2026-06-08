import React, { useState } from 'react';
import { authApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';

export const RegisterForm: React.FC = () => {
  const { setCurrentView, setTempEmail } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      await authApi.register(formData);
      setStatus({
        type: 'success',
        message: 'Registration successful! Redirecting to email verification...',
      });
      setTempEmail(formData.email);
      setTimeout(() => {
        setCurrentView('verifyEmail');
      }, 1500);
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'Registration failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full p-6 bg-gray-950 border border-gray-800 rounded-lg shadow-xl text-white">
      <h2 className="text-2xl font-bold mb-2 text-center text-purple-400">Create Account</h2>
      <p className="text-sm text-gray-400 mb-6 text-center">Get started with Connectify</p>

      {status && (
        <Alert
          type={status.type}
          message={status.message}
          onClose={() => setStatus(null)}
        />
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="John"
          />
          <Input
            label="Last Name"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
          />
        </div>

        <Input
          label="Username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          required
          placeholder="johndoe123"
        />

        <Input
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="john@example.com"
        />

        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="••••••••"
        />

        <Button type="submit" isLoading={isLoading} className="mt-4">
          Register
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-400">
        Already have an account?{' '}
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
