import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Alert } from '../../../shared/components/Alert';

export const RegisterForm: React.FC = () => {
  const { setTempEmail } = useAuth();
  const navigate = useNavigate();
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
        navigate('/verify-email');
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
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold leading-[32px] text-brand-text-primary">
          Create your account
        </h2>
        <p className="mt-1.5 text-sm leading-[22px] text-brand-text-secondary">
          Start building your network on Connectify.
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

        <Button type="submit" isLoading={isLoading} className="mt-2">
          Create account
        </Button>
      </form>

      <div className="border-t border-brand-border pt-4 text-center text-sm text-brand-text-secondary leading-[22px]">
        Already have an account?{' '}
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
