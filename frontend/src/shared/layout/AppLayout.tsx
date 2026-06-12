import React, { useMemo } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import { Avatar } from '../components/Avatar';
import { SearchBar } from '../components/SearchBar';
import { formatDisplayName } from '../utils/formatters';
import { LogOut, Home, Settings, Bell, MessageCircle } from 'lucide-react';
import { cn } from '../utils/classNames';

export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userDisplayName = useMemo(() => {
    if (!user) return 'User';
    return formatDisplayName(user);
  }, [user]);

  const handleSearchSubmit = (query: string) => {
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const navLinks = [
    { to: '/feed', label: 'Feed', icon: <Home className="h-5 w-5" /> },
    { to: '/messages', label: 'Messages', icon: <MessageCircle className="h-5 w-5" /> },
    { to: '/notifications', label: 'Notifications', icon: <Bell className="h-5 w-5" /> },
    { to: '/settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen w-full bg-brand-bg text-brand-text-primary flex flex-col">
      {/* Top Bar Header */}
      <header className="sticky top-0 z-40 h-14 md:h-16 w-full border-b border-brand-border bg-brand-surface shadow-[0_1px_2px_rgba(17,17,17,0.02)]">
        <div className="mx-auto flex h-full max-w-[1120px] items-center justify-between gap-4 px-4 md:px-6">
          
          {/* Left: Branding */}
          <Link to="/me" className="flex items-center shrink-0">
            <span className="font-serif text-2xl font-normal leading-none tracking-tight text-brand-text-primary">
              Connectify
            </span>
          </Link>

          {/* Center: Search Bar */}
          <div className="hidden sm:block w-full max-w-sm md:max-w-md">
            <SearchBar onSearch={handleSearchSubmit} placeholder="Search users by name or username" />
          </div>

          {/* Right: Navigation Actions */}
          <div className="flex items-center gap-1 md:gap-3">
            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 mr-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  title={link.label}
                  className={({ isActive }) =>
                    `flex h-9 w-9 items-center justify-center rounded-[8px] text-brand-text-secondary transition-colors hover:bg-brand-surface-muted hover:text-brand-text-primary ${
                      isActive ? 'bg-brand-surface-muted text-brand-text-primary font-medium' : ''
                    }`
                  }
                >
                  {link.icon}
                </NavLink>
              ))}
            </nav>

            {/* Profile Avatar Trigger Link */}
            {user && (
              <Link
                to="/me"
                className="flex items-center gap-2 rounded-[8px] p-1.5 hover:bg-brand-surface-muted transition-colors"
                title="View Profile"
              >
                <Avatar src={user.profileImageUrl} name={userDisplayName} size="sm" />
                <div className="hidden lg:block text-left min-w-0 max-w-[120px]">
                  <p className="truncate text-xs font-semibold text-brand-text-primary leading-tight">
                    {userDisplayName}
                  </p>
                  <p className="truncate text-[10px] text-brand-text-muted leading-tight">
                    @{user.username}
                  </p>
                </div>
              </Link>
            )}

            {/* Quick Logout */}
            <button
              onClick={logout}
              className="flex h-9 w-9 items-center justify-center rounded-[8px] text-brand-danger transition-colors hover:bg-brand-danger-soft active:scale-[0.98] focus:outline-none"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 w-full mx-auto max-w-[1120px] px-4 md:px-6 py-6 flex flex-col gap-6">
        {/* Mobile Search Bar Row */}
        <div className="block sm:hidden w-full mb-2">
          <SearchBar onSearch={handleSearchSubmit} placeholder="Search users..." />
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <nav className="md:hidden flex items-center justify-around border-b border-brand-border pb-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors text-brand-text-secondary ${
                  isActive ? 'text-brand-text-primary' : ''
                }`
              }
            >
              <span className={cn('p-1 rounded-[8px] hover:bg-brand-surface-muted', link.to === window.location.pathname && 'bg-brand-surface-muted text-brand-text-primary')}>
                {link.icon}
              </span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Dynamic Route Content */}
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
