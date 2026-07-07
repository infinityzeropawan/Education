
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import type { UserRole } from '@/lib/AuthContext'; // Import the type for UserRole

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login'); // Redirect to login if not authenticated
    } else if (allowedRoles && role && !allowedRoles.includes(role)) {
      // Redirect to a dashboard or access denied page if role is not allowed
      if (role === 'superadmin' || role === 'school_admin') {
        router.push('/admin/users'); // More specific redirect for admins
      } else if (role === 'teacher') {
        router.push('/teacher/attendance'); // More specific redirect for teachers
      } else if (role === 'student') {
        router.push('/student/assignments'); // More specific redirect for students
      } else {
        router.push('/'); // Default redirect for unexpected roles or general access denied
      }
    }
  }, [isAuthenticated, role, allowedRoles, router]);

  if (!isAuthenticated || (allowedRoles && role && !allowedRoles.includes(role))) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
};

export default ProtectedRoute;
