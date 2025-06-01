import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Navbar } from '@/components/student/Navbar';
import { Sidebar } from '@/features/student/components/Sidebar';
import { checkUserRole } from '@/lib/checkRole';

export const metadata: Metadata = {
  title: 'Student Area - MegaStart Online',
  description: 'Trang dành cho sinh viên',
};

export default async function StudentLayout({ children }: { children: ReactNode }) {
  const role = await checkUserRole({ allow: ['student'] });

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#FAFAFC]">
        <Navbar />

        <div className="flex">
          <Sidebar className="hidden md:block" />

          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
