import { ReactNode } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Navbar } from '@/components/dashboard/Navbar';
import { ThemeProvider } from '../../../components/providers/ThemeProvider';
import type { Metadata } from 'next';
import '@/styles/globals.css'
import { checkUserRole } from '@/lib/checkRole';

export const metadata: Metadata = {
  title: 'Dashboard - MegaStart Online',
  description: 'Trang quản trị dành cho Admin và Giảng viên',
  icons: {
    icon: '/logo.png',
  },
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  
  await checkUserRole({ deny: ['student'] });

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 p-2 md:p-4">
        {/* Background Pattern */}
        <div 
          className="fixed inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        <div className="relative flex h-[calc(100vh-1rem)] md:h-[calc(100vh-2rem)] gap-4">
          {/* Desktop Sidebar Container - Hidden on mobile/tablet */}
          <div className="group relative flex-shrink-0 hidden md:block">
            {/* Sidebar Glass Background */}
            <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-2xl shadow-indigo-500/10 dark:shadow-purple-500/10"></div>
            
            {/* Sidebar Gradient Border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/20 p-[1px]">
              <div className="h-full w-full rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl"></div>
            </div>
            
            {/* Sidebar Content */}
            <div className="relative z-10 h-full overflow-hidden">
              <Sidebar />
            </div>
          </div>

          {/* Main Content Area - Full width on mobile/tablet */}
          <div className="flex flex-col flex-1 min-w-0 gap-4 overflow-hidden">
            {/* Navbar Container */}
            <div className="group relative flex-shrink-0">
              {/* Navbar Glass Background */}
              <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-xl shadow-indigo-500/5 dark:shadow-purple-500/5"></div>
              
              {/* Navbar Gradient Border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/10 to-pink-500/20 p-[1px]">
                <div className="h-full w-full rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl"></div>
              </div>
              
              {/* Navbar Content */}
              <div className="relative z-10">
                <Navbar />
              </div>
            </div>

            {/* Main Content Container */}
            <div className="flex-1 group relative min-h-0">
              {/* Main Content Glass Background */}
              <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-2xl shadow-indigo-500/10 dark:shadow-purple-500/10"></div>
              
              {/* Main Content Gradient Border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/20 p-[1px]">
                <div className="h-full w-full rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl"></div>
              </div>
              
              {/* Main Content */}
              <main className="relative z-10 h-full overflow-y-auto rounded-2xl scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                <div className="p-6 md:p-8 min-h-full">
                  {/* Content Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-indigo-50/30 to-purple-50/20 dark:from-transparent dark:via-indigo-950/20 dark:to-purple-950/10 rounded-2xl pointer-events-none"></div>
                  
                  {/* Actual Content */}
                  <div className="relative z-10">
                    {children}
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
        
        {/* Ambient Light Effects */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-radial from-indigo-400/20 via-purple-400/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-radial from-pink-400/20 via-rose-400/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </ThemeProvider>
  );
}
