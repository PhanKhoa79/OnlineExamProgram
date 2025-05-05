import { ReactNode } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Navbar } from '@/components/dashboard/Navbar';
import { ThemeProvider } from '../../../components/providers/ThemeProvider';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation'; 
import { decode } from 'jsonwebtoken';
import type { Metadata } from 'next';
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Dashboard - MegaStart Online',
  description: 'Trang quản trị dành cho Admin và Giảng viên',
  icons: {
    icon: '/logo.png',
  },
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {

  const cookieStore = await cookies();

  const token = cookieStore.get('accessToken')?.value;

  const decoded = decode(token)
  if (
    !decoded ||
    typeof decoded !== 'object' ||
    !('role' in decoded)
  ) {
    redirect('/login')
  }

  const role = (decoded as { role?: string }).role
  if (role !== 'admin' && role !== 'teacher') {
    redirect('/for-bidden')
  }

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-800 md:gap-4">
        <div className="rounded-xl shadow-xl bg-[var(--sidebar-bg)] dark:bg-[#1f1f2e]">
          <Sidebar />
        </div>

        <div className="flex flex-col flex-1">
          <div className="rounded-xl shadow-xl bg-[var(--navbar-bg)] dark:bg-[#2a2a3f]">
            <Navbar />
          </div>

          <main className="flex-1 mt-2 lg:mt-4 rounded-xl shadow-xl bg-white dark:bg-[#1f1f2e] px-4 pt-4 pb-0 md:px-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
