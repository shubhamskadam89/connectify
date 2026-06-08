import { AuthProvider, useAuth } from './context/AuthContext';
import { RegisterForm } from './components/auth/RegisterForm';
import { VerifyEmailForm } from './components/auth/VerifyEmailForm';
import { LoginForm } from './components/auth/LoginForm';
import { ForgotPasswordForm } from './components/auth/ForgotPasswordForm';
import { ResetPasswordForm } from './components/auth/ResetPasswordForm';
import { Dashboard } from './components/dashboard/Dashboard';

function AppContent() {
  const { currentView } = useAuth();

  const renderView = () => {
    switch (currentView) {
      case 'register':
        return <RegisterForm />;
      case 'verifyEmail':
        return <VerifyEmailForm />;
      case 'forgotPassword':
        return <ForgotPasswordForm />;
      case 'resetPassword':
        return <ResetPasswordForm />;
      case 'dashboard':
        return <Dashboard />;
      case 'login':
      default:
        return <LoginForm />;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen w-full flex flex-col justify-center items-center p-4">
      {renderView()}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
