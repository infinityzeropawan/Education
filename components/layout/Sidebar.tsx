
'use client';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';

export const Sidebar = () => {
  const { role, logout } = useAuth();
  return (
    <aside className="w-64 bg-slate-900 text-white p-4 hidden md:block">
      <h2 className="text-xl font-bold mb-6">Buildroonix</h2>
      <nav className="space-y-2">
        <Link href="/" className="block p-2 hover:bg-slate-800 rounded">Dashboard</Link>
        {role === 'superadmin' && <Link href="/admin/users" className="block p-2 hover:bg-slate-800 rounded">Users</Link>}
      </nav>
      <Button onClick={logout} className="mt-8 w-full">Logout</Button>
    </aside>
  );
};

export const MobileSidebar = () => <div className="md:hidden">Menu</div>;
