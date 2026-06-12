import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';
import { AuthLayout } from '../shared/layout/AuthLayout';
import { AppLayout } from '../shared/layout/AppLayout';

// Pages
import { LoginPage } from '../features/auth/pages/LoginPage';
import { SignUpPage } from '../features/auth/pages/SignUpPage';
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../features/auth/pages/ResetPasswordPage';
import { VerifyEmailPage } from '../features/auth/pages/VerifyEmailPage';

import { MyProfilePage } from '../features/profile/pages/MyProfilePage';
import { EditProfilePage } from '../features/profile/pages/EditProfilePage';
import { PublicProfilePage } from '../features/profile/pages/PublicProfilePage';

import { FollowersPage } from '../features/social-graph/pages/FollowersPage';
import { FollowingPage } from '../features/social-graph/pages/FollowingPage';
import { MutualFollowersPage } from '../features/social-graph/pages/MutualFollowersPage';

import { SearchPage } from '../features/search/pages/SearchPage';

// Placeholders
import { FeedPage } from '../features/placeholders/pages/FeedPage';
import { MessagesPage } from '../features/placeholders/pages/MessagesPage';
import { NotificationsPage } from '../features/placeholders/pages/NotificationsPage';
import { SettingsPage } from '../features/placeholders/pages/SettingsPage';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Guard (prevents visiting login if logged in)
const PublicRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/me" replace /> : children;
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public/Auth Routes */}
      <Route
        element={
          <PublicRoute>
            <AuthLayout />
          </PublicRoute>
        }
      >
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Route>

      {/* Protected Main App Routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/me" replace />} />
        <Route path="/me" element={<MyProfilePage />} />
        <Route path="/me/edit" element={<EditProfilePage />} />
        <Route path="/me/followers" element={<FollowersPage />} />
        <Route path="/me/following" element={<FollowingPage />} />
        
        <Route path="/u/:username" element={<PublicProfilePage />} />
        <Route path="/u/:username/followers" element={<FollowersPage />} />
        <Route path="/u/:username/following" element={<FollowingPage />} />
        <Route path="/u/:username/mutual/:otherUsername" element={<MutualFollowersPage />} />
        
        <Route path="/search" element={<SearchPage />} />
        
        {/* Placeholder Routes */}
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
