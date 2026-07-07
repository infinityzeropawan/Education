
export type UserRole = 'superadmin' | 'school_admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export const MOCK_USERS: User[] = [
  { id: 'usr-001', name: 'Alice Smith', email: 'alice.s@example.com', role: 'superadmin' },
  { id: 'usr-003', name: 'Carol White', email: 'carol.w@example.com', role: 'teacher' },
  { id: 'usr-004', name: 'David Green', email: 'david.g@example.com', role: 'student' },
];

export const MOCK_NOTIFICATIONS = [
  { id: 'not-001', userId: 'usr-004', content: 'New assignment posted.', timestamp: new Date().toISOString(), read: false },
];
