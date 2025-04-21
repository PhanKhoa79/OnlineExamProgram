'use client';

import { ReactNode } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Navbar } from '@/components/ui/Navbar';
import { ThemeProvider } from '../../../components/providers/ThemeProvider';
import '@/styles/globals.css'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-800 md:gap-4">
        <div className="rounded-xl shadow-xl bg-[var(--sidebar-bg)] dark:bg-[#1f1f2e]">
          <Sidebar />
        </div>

        <div className="flex flex-col flex-1">
          <div className="rounded-xl shadow-xl bg-[var(--navbar-bg)] dark:bg-[#2a2a3f]">
            <Navbar variant='dashboard'/>
          </div>

          <main className="flex-1 mt-2 lg:mt-4 rounded-xl shadow-xl bg-white dark:bg-[#1f1f2e] px-4 pt-4 pb-0 md:px-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
