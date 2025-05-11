import { ReactNode } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Navbar } from '@/components/dashboard/Navbar';
import { ThemeProvider } from '../../../components/providers/ThemeProvider';
import type { Metadata } from 'next';
import '@/styles/globals.css'
import { checkUserRole } from '@/libs/checkRole';
import { AccountTable } from '@/components/ui/Table/Account/AccountTable';

export const metadata: Metadata = {
  title: 'Dashboard - MegaStart Online',
  description: 'Trang quản trị dành cho Admin và Giảng viên',
  icons: {
    icon: '/logo.png',
  },
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  
  const role = await checkUserRole(['admin', 'teacher']);

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-800 md:gap-4 overflow-hidden">
        <div className="rounded-xl shadow-xl bg-[var(--sidebar-bg)] dark:bg-[#1f1f2e]">
          <Sidebar role={role}/>
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="rounded-xl shadow-xl bg-[var(--navbar-bg)] dark:bg-[#2a2a3f]">
            <Navbar />
          </div>

          <main className="flex-1 mt-2 lg:mt-4 rounded-xl shadow-xl bg-white dark:bg-[#1f1f2e] px-4 pt-4 pb-0 md:px-6 overflow-auto">
            <AccountTable />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
