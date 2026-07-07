
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/AuthContext'; // Import AuthProvider

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Buildroonix LMS',
  description: 'A modern, role-based School ERP & LMS platform',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>)
 {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider> {/* Wrap your application with AuthProvider */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
