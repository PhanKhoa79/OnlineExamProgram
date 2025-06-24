import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { StudentNavbar } from '@/components/student/StudentNavbar';
import { StudentSidebar } from '@/components/student/StudentSidebar';
import { checkUserRole } from '@/lib/checkRole';

export const metadata: Metadata = {
  title: 'Student Portal - MegaStar Online Exam',
  description: 'Hệ thống thi trắc nghiệm trực tuyến dành cho sinh viên',
};

export default async function StudentLayout({ children }: { children: ReactNode }) {
  await checkUserRole({ allow: ['student'] });

  return (
    <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
          {/* Header */}
          <StudentNavbar />

          <div className="flex h-[calc(100vh-80px)]">
            {/* Sidebar */}
            <StudentSidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
              <div className="p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                  {children}
                </div>
              </div>
            </main>
          </div>
        </div>
    </ThemeProvider>
  );
}
