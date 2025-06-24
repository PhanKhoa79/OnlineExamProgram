import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { StudentNavbar } from '@/components/student/StudentNavbar';
import { checkUserRole } from '@/lib/checkRole';

export const metadata: Metadata = {
  title: 'Làm bài thi - MegaStar Online Exam',
  description: 'Giao diện làm bài thi trực tuyến',
};

export default async function ExamTakingLayout({ children }: { children: ReactNode }) {
  await checkUserRole({ allow: ['student'] });

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
        {/* Header - Only show navbar without sidebar */}
        <StudentNavbar />

        {/* Main Content - Full width without sidebar */}
        <main className="h-[calc(100vh-80px)]">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
} 