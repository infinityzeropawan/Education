import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/AuthContext';
import { ModuleProvider } from '@/lib/ModuleContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Buildroonix — Smart School ERP & LMS',
  description: 'A modern, role-based School ERP & LMS platform powered by Buildroonix',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <ModuleProvider>
            {children}
          </ModuleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
