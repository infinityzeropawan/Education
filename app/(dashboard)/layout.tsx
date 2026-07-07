
import { Inter } from 'next/font/google';
import { Sidebar, MobileSidebar } from '@/components/layout/Sidebar'; // Import Sidebar components

const inter = Inter({ subsets: ['latin'] });

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <Sidebar /> {/* Desktop Sidebar */}
          <div className="flex flex-col flex-1">
            <header className="flex items-center justify-between p-4 bg-white shadow-md md:hidden">
              <MobileSidebar /> {/* Mobile Sidebar Toggle */}
              <h1 className="text-xl font-semibold">Buildroonix!</h1>
            </header>
            {/* Main Content Area */}
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
