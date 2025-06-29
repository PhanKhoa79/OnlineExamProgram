'use client';

import { useState, useEffect } from 'react';
import { 
  DocumentPlusIcon, 
  UserPlusIcon, 
  AcademicCapIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { hasPermission } from '@/lib/permissions';
import { useAuthStore } from '@/features/auth/store';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  color: string;
  description: string;
  badge?: string;
}

export const QuickActionsSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const permissions = useAuthStore((state) => state.permissions);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const quickActions: QuickAction[] = [
    ...(hasPermission(permissions, 'exam:create') ? [{
      id: 'new-exam',
      label: 'Tạo đề thi',
      icon: DocumentPlusIcon,
      href: '/dashboard/exam/create',
      color: 'from-blue-500 to-cyan-500',
      description: 'Tạo đề thi mới',
      badge: 'Hot'
    }] : []),
    ...(hasPermission(permissions, 'student:create') ? [{
      id: 'add-student',
      label: 'Thêm học sinh',
      icon: UserPlusIcon,
      href: '/dashboard/student/create',
      color: 'from-green-500 to-emerald-500',
      description: 'Thêm học sinh mới'
    }] : []),
    ...(hasPermission(permissions, 'room:create') ? [{
      id: 'create-course',
      label: 'Tạo phòng thi',
      icon: AcademicCapIcon,
      href: '/dashboard/room/create',
      color: 'from-purple-500 to-violet-500',
      description: 'Tạo phòng thi mới'
    }] : []),
    {
      id: 'view-stats',
      label: 'Thống kê',
      icon: ChartBarIcon,
      href: '/dashboard/statistics',
      color: 'from-orange-500 to-red-500',
      description: 'Xem báo cáo thống kê'
    },
    {
      id: 'exam-results',
      label: 'Kết quả thi',
      icon: ClipboardDocumentCheckIcon,
      href: '/dashboard/exam-results',
      color: 'from-indigo-500 to-blue-500',
      description: 'Xem kết quả thi sinh viên'
    },
    {
      id: 'settings',
      label: 'Cài đặt',
      icon: Cog6ToothIcon,
      href: '/dashboard/settings',
      color: 'from-gray-500 to-slate-500',
      description: 'Cài đặt hệ thống'
    }
  ];

  const handleActionClick = (action: QuickAction) => {
    if (action.href) {
      router.push(action.href);
    } else if (action.onClick) {
      action.onClick();
    }
  };

  if (!isClient) {
    return (
      <div className={`${isCollapsed ? 'w-16' : 'w-64'} flex-shrink-0 transition-all duration-300`}>
        <div className="h-full bg-white/50 dark:bg-gray-900/50 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} flex-shrink-0 transition-all duration-300 ease-in-out`}>
      <div className="h-full relative group">
        {/* Background */}
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-gray-700/30 shadow-xl shadow-indigo-500/10 dark:shadow-purple-500/10"></div>
        
        {/* Gradient Border */}
        <div className="absolute inset-0 rounded-2xl p-[1px]" style={{ background: `linear-gradient(to bottom, var(--color-primary, #4f46e5), var(--color-secondary, #9333ea), var(--color-accent, #ec4899))`, opacity: 0.2 }}>
          <div className="h-full w-full rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            {!isCollapsed && (
              <div>
                <h3 className="text-lg font-semibold bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, var(--color-primary, #4f46e5), var(--color-secondary, #9333ea))` }}>
                  Thao tác nhanh
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Các tác vụ thường dùng
                </p>
              </div>
            )}
            
            {/* Toggle Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 text-gray-600 hover:text-white dark:text-gray-300 dark:hover:text-white bg-gray-100/50 dark:bg-gray-800/50 rounded-lg transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-105 cursor-pointer"
              style={{ 
                '--hover-bg': `linear-gradient(135deg, var(--color-primary, #4f46e5), var(--color-secondary, #9333ea))` 
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `linear-gradient(135deg, var(--color-primary, #4f46e5), var(--color-secondary, #9333ea))`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '';
              }}
            >
              {isCollapsed ? (
                <ChevronRightIcon className="w-4 h-4" />
              ) : (
                <ChevronLeftIcon className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex-1 space-y-3">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleActionClick(action)}
                className={`w-full group/action relative overflow-hidden cursor-pointer rounded-xl transition-all duration-300 hover:scale-105 ${
                  isCollapsed ? 'p-3' : 'p-4'
                }`}
              >
                {/* Action Background */}
                <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-10 group-hover/action:opacity-20 transition-opacity duration-300`}></div>
                <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 group-hover/action:bg-white/70 dark:group-hover/action:bg-gray-700/70 transition-colors duration-300"></div>
                
                {/* Action Content */}
                <div className={`relative z-10 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} text-white shadow-lg group-hover/action:scale-110 transition-transform duration-300`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  
                  {!isCollapsed && (
                    <div className="flex-1 text-left">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 dark:text-white group-hover/action:text-gray-700 dark:group-hover/action:text-gray-200">
                          {action.label}
                        </span>
                        {action.badge && (
                          <span className="px-2 py-1 text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-red-500 rounded-full">
                            {action.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {action.description}
                      </p>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 