import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../services/authentication/hooks/useAuth';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

export const AppShell = ({ children }) => {
  const { user, handleLogout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-app-bg text-foreground font-sans antialiased">
        {children}
      </div>
    );
  }

  const navItems = [
    {
      label: 'Analyze Opportunity',
      path: '/',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  const onLogout = async () => {
    setMobileDrawerOpen(false);
    await handleLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-app-bg text-foreground font-sans antialiased flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-border shrink-0 min-h-screen">
        {/* Brand */}
        <div className="p-5 border-b border-border/60 flex items-center gap-2">
          <span className="w-7 h-7 rounded-sm bg-primary text-white font-bold flex items-center justify-center text-sm">
            R
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">
            RoleFit<span className="text-primary">.AI</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          <p className="px-3 py-1.5 text-[11px] font-semibold text-muted uppercase tracking-wider">
            Platform Navigation
          </p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-sm text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-soft text-primary font-semibold'
                    : 'text-foreground hover:bg-app-bg hover:text-primary'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        {user && (
          <div className="p-4 border-t border-border/60 bg-app-bg/40 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <Avatar name={user.username || user.email} size="sm" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-foreground truncate">
                  {user.username || 'User'}
                </span>
                <span className="text-[11px] text-muted truncate">
                  {user.email}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout} title="Log Out">
              <svg className="h-4 w-4 text-muted hover:text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </Button>
          </div>
        )}
      </aside>

      {/* Mobile Header Bar */}
      <header className="md:hidden bg-surface border-b border-border p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-sm bg-primary text-white font-bold flex items-center justify-center text-sm">
            R
          </span>
          <span className="text-base font-bold tracking-tight text-foreground">
            RoleFit<span className="text-primary">.AI</span>
          </span>
        </div>

        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="p-2 text-foreground hover:bg-app-bg rounded-sm transition-colors"
          aria-label="Open navigation drawer"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Mobile Right-Side Navigation Drawer */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-foreground/30 transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div className="relative ml-auto w-72 max-w-[85vw] bg-surface h-full shadow-xl border-l border-border flex flex-col justify-between z-50 p-5">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-sm bg-primary text-white font-bold flex items-center justify-center text-xs">
                    R
                  </span>
                  <span className="text-sm font-bold tracking-tight text-foreground">
                    RoleFit<span className="text-primary">.AI</span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 text-muted hover:text-foreground rounded-sm"
                  aria-label="Close navigation drawer"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-1">
                <p className="px-2 py-1 text-[11px] font-semibold text-muted uppercase tracking-wider">
                  Menu
                </p>
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-soft text-primary font-semibold'
                          : 'text-foreground hover:bg-app-bg'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Drawer User Footer */}
            {user && (
              <div className="pt-4 border-t border-border flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <Avatar name={user.username || user.email} size="sm" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-foreground truncate">
                      {user.username || 'User'}
                    </span>
                    <span className="text-[11px] text-muted truncate">
                      {user.email}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" fullWidth onClick={onLogout}>
                  Log Out
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
};

export default AppShell;
