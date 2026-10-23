import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ToucanLogo } from './ToucanLogo';
import { useAuth } from '../../context/AuthContext';
import { Shield, Sparkles, Send, MapPin, Calendar } from 'lucide-react';

export function Header() {
  const { user, isAdmin, toggleAdminRole, loginAsDemoUser, logout } = useAuth();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navLinks = [
    { label: 'Explore', path: '/' },
    { label: 'Near Me', path: '/nearme' },
    { label: 'Plan Trip', path: '/plan' },
    { label: 'My Trips', path: '/trips' },
    { label: 'Telegram Bot', path: '/telegram' },
    ...(isAdmin ? [{ label: 'Admin', path: '/admin' }] : [])
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EDE9FE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark */}
        <Link to="/" className="shrink-0 flex items-center group">
          <ToucanLogo size="md" />
        </Link>

        {/* Zone 2: 4–5 Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-colors whitespace-nowrap shrink-0 ${
                isActive(link.path)
                  ? 'text-[#6D28D9] font-semibold border-b-2 border-[#6D28D9] pb-1'
                  : 'text-[#6B6385] hover:text-[#1F1637]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Zone 3: 1 Primary Action & Profile / Admin Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Admin Role Toggle Pill for ease of review */}
          <button
            onClick={toggleAdminRole}
            title="Toggle Admin role to test admin management"
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
              isAdmin
                ? 'bg-[#6D28D9] text-white shadow-sm'
                : 'bg-[#F5F3FF] text-[#6D28D9] border border-[#EDE9FE] hover:bg-[#EDE9FE]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{isAdmin ? 'Admin Mode' : 'User Mode'}</span>
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-full border border-[#EDE9FE] hover:border-[#6D28D9] transition-colors"
                aria-label="User profile menu"
              >
                <img
                  src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                  alt={user.displayName}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </button>

              {showUserMenu && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-wayfarer-lg border border-[#EDE9FE] py-2 z-50 text-xs"
                  onClick={() => setShowUserMenu(false)}
                >
                  <div className="px-4 py-2 border-b border-[#EDE9FE]">
                    <p className="font-semibold text-[#1F1637]">{user.displayName}</p>
                    <p className="text-[#6B6385] truncate">{user.email}</p>
                    <span className="inline-block mt-1 font-mono text-[10px] uppercase text-[#6D28D9]">
                      Role: {user.role}
                    </span>
                  </div>

                  <Link
                    to="/plan"
                    className="flex items-center gap-2 px-4 py-2 text-[#1F1637] hover:bg-[#F5F3FF]"
                  >
                    <Calendar className="w-4 h-4 text-[#6D28D9]" />
                    <span>Plan a Trip</span>
                  </Link>

                  <Link
                    to="/trips"
                    className="flex items-center gap-2 px-4 py-2 text-[#1F1637] hover:bg-[#F5F3FF]"
                  >
                    <MapPin className="w-4 h-4 text-[#6D28D9]" />
                    <span>My Trips</span>
                  </Link>

                  <Link
                    to="/telegram"
                    className="flex items-center gap-2 px-4 py-2 text-[#1F1637] hover:bg-[#F5F3FF]"
                  >
                    <Send className="w-4 h-4 text-[#6D28D9]" />
                    <span>Telegram Trip Guide</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-2 text-[#6D28D9] font-medium hover:bg-[#F5F3FF]"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <div className="border-t border-[#EDE9FE] mt-1 pt-1">
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-[#DC2626] hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => loginAsDemoUser(false)}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#6D28D9] hover:bg-[#5B21B6] rounded-xl transition-colors whitespace-nowrap shadow-sm"
            >
              Sign In
            </button>
          )}

          {/* Primary CTA button */}
          <Link
            to="/plan"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#6D28D9] hover:bg-[#5B21B6] rounded-xl transition-all shadow-sm hover:shadow-wayfarer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Plan with AI</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
