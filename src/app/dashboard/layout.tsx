import { ReactNode, Suspense } from 'react';
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import '@/styles/globals.css'
import { checkUserRole } from '@/lib/checkRole';
import { PageLoader } from '@/components/ui/PageLoader';

// Dynamic imports for heavy components (without ssr: false for Server Components)
const Sidebar = dynamic(() => import('@/components/dashboard/Sidebar').then(mod => ({ default: mod.Sidebar })), {
  loading: () => <div className="w-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl" />
});

const Navbar = dynamic(() => import('@/components/dashboard/Navbar').then(mod => ({ default: mod.Navbar })), {
  loading: () => <div className="h-16 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl" />
});

const PreloadPages = dynamic(() => import('@/components/dashboard/PreloadPages').then(mod => ({ default: mod.PreloadPages })));

const NavigationLoader = dynamic(() => import('@/components/dashboard/NavigationLoader').then(mod => ({ default: mod.NavigationLoader })));

const ThemeProvider = dynamic(() => import('../../../components/providers/ThemeProvider').then(mod => ({ default: mod.ThemeProvider })));

const ActivityLogToast = dynamic(() => import('@/features/activity-logs/components/ActivityLogToast').then(mod => ({ default: mod.ActivityLogToast })));

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
    <Suspense fallback={<PageLoader isLoading={true} loadingText="Đang tải dashboard..." />}>
      <ThemeProvider>
        <PreloadPages />
        <NavigationLoader />
        <ActivityLogToast />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 p-2 md:p-4">
          {/* Background Pattern */}
          <div 
            className="fixed inset-0 opacity-40"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          ></div>
          
          <div className="relative z-10 flex gap-4 h-screen">
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
                <Suspense fallback={<div className="w-64 h-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl" />}>
                  <Sidebar />
                </Suspense>
              </div>
            </div>

            {/* Main Content Area - Full width on mobile/tablet */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">
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
                  <Suspense fallback={<div className="h-16 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl" />}>
                    <Navbar />
                  </Suspense>
                </div>
              </div>

              {/* Main Content Container */}
              <div className="group relative flex-1 min-h-0">
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
                      <Suspense fallback={<PageLoader isLoading={true} loadingText="Đang tải nội dung..." />}>
                        {children}
                      </Suspense>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </Suspense>
  );
}
