'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { studentsList } from '@/lib/mock-data';

export type UserRole = 'superadmin' | 'school_admin' | 'teacher' | 'student' | 'parent';

export interface User {
  id: string; name: string; email: string; role: UserRole;
  phone?: string; joiningDate?: string; qualification?: string;
  bloodGroup?: string; gender?: string; emergencyPhone?: string;
  rollNo?: string; class?: string; section?: string;
  fatherName?: string; motherName?: string; dob?: string;
  address?: string; busNumber?: string; busRoute?: string;
  admissionDate?: string; profileColor?: string;
  institutionSlug?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('buildroonix_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('buildroonix_user', JSON.stringify(userData));
    if (userData.role === 'superadmin') router.push('/superadmin');
    else if (userData.role === 'school_admin') router.push('/admin');
    else if (userData.role === 'teacher') router.push('/teacher');
    else if (userData.role === 'parent') router.push('/parent');
    else router.push('/student');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('buildroonix_user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// Helper: login as student by id
export function buildStudentUser(studentId: string): User | null {
  const s = studentsList.find(s => s.id === studentId);
  if (!s) return null;
  return {
    id: s.id, name: s.name, email: s.email, role: 'student',
    phone: s.phone, rollNo: s.rollNo, class: s.class, section: s.section,
    fatherName: s.fatherName, motherName: s.motherName, dob: s.dob,
    gender: s.gender, address: s.address, bloodGroup: s.bloodGroup,
    busNumber: s.busNumber, busRoute: s.busRoute, admissionDate: s.admissionDate,
    profileColor: s.profileColor, joiningDate: s.admissionDate,
  };
}
