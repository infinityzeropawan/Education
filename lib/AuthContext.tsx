
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type UserRole = 'superadmin' | 'school_admin' | 'teacher' | 'student' | null;

interface User {
  id: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User, redirectPath?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole>(null);
  const router = useRouter();

  useEffect(() => {
    // On mount, try to load user from localStorage or a cookie
    // For this example, we'll simulate a login or load a mock user
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      setRole(parsedUser.role);
    }
  }, []);

  const login = (userData: User, redirectPath = '/') => {
    setUser(userData);
    setIsAuthenticated(true);
    setRole(userData.role);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    router.push(redirectPath);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setRole(null);
    localStorage.removeItem('currentUser');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, role }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
