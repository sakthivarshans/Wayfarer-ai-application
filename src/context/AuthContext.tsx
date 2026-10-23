import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAdmin: boolean;
  loginAsDemoUser: (asAdmin?: boolean) => void;
  logout: () => void;
  toggleAdminRole: () => void;
  updateTelegramStatus: (connected: boolean, botUsername?: string) => void;
}

const DEMO_USER: UserProfile = {
  uid: 'usr_sakthi_traveler',
  email: 'email2sakthi.s@gmail.com',
  displayName: 'Sakthi S.',
  photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
  role: 'admin', // default to admin for seamless evaluation of admin features
  createdAt: '2026-01-15T00:00:00Z',
  telegram: {
    connected: false,
    botUsername: undefined
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('wayfarer_user');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse stored user:', e);
    }
    return DEMO_USER;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('wayfarer_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('wayfarer_user');
    }
  }, [user]);

  const loginAsDemoUser = (asAdmin: boolean = false) => {
    setUser({
      ...DEMO_USER,
      role: asAdmin ? 'admin' : 'user'
    });
  };

  const logout = () => {
    setUser(null);
  };

  const toggleAdminRole = () => {
    if (!user) {
      setUser({ ...DEMO_USER, role: 'admin' });
      return;
    }
    const newRole: UserRole = user.role === 'admin' ? 'user' : 'admin';
    setUser({ ...user, role: newRole });
  };

  const updateTelegramStatus = (connected: boolean, botUsername?: string) => {
    if (!user) return;
    setUser({
      ...user,
      telegram: {
        ...user.telegram,
        connected,
        botUsername
      }
    });
  };

  const role = user?.role || 'user';
  const isAdmin = role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAdmin,
        loginAsDemoUser,
        logout,
        toggleAdminRole,
        updateTelegramStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
