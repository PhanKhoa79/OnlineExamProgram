'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store';
import { useActivityLogs } from '@/features/activity-logs/hooks/useActivityLogs';
import { RelativeTime } from '@/components/ui/RelativeTime';
import { ArrowLeft, Clock, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function ActivityLogsPage() {
  usePageTitle('Nhật ký hoạt động');
  const router = useRouter();
  const { user } = useAuthStore();
  
  // Sử dụng hook cho activity logs với real-time updates (không có limit để lấy tất cả)
  const { activities, loading } = useActivityLogs();

  // Kiểm tra role moderator
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (user.role.name !== 'moderator') {
      router.push('/for-bidden');
      return;
    }
  }, [user, router]);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-500';
      case 'UPDATE':
        return 'bg-blue-500';
      case 'DELETE':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'class':
        return '🏫';
      case 'exam':
        return '📝';
      case 'student':
        return '👨‍🎓';
      case 'subject':
        return '📚';
      default:
        return '⚙️';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Nhật ký hoạt động
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Tất cả hoạt động trong hệ thống ({activities.length} hoạt động)
            </p>
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-xl">
        <div className="p-6">
          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="text-center py-12">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Chưa có hoạt động nào trong hệ thống
                </p>
              </div>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/40 dark:hover:bg-gray-800/40 transition-colors duration-200 border border-gray-100 dark:border-gray-700"
                >
                  {/* Icon and Action Type */}
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getActionColor(activity.action)}`}></div>
                    <div className="text-2xl">{getModuleIcon(activity.module)}</div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white font-medium leading-5">
                      {activity.displayMessage}
                    </p>
                    
                    {/* User and Time Info */}
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                        <User className="h-3 w-3" />
                        <span>{activity.account.accountname} ({activity.account.email})</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3" />
                        <RelativeTime 
                          date={activity.createdAt}
                          updateInterval={60000}
                        />
                      </div>
                    </div>

                    {/* Action Badge */}
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        activity.action === 'CREATE' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        activity.action === 'UPDATE' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        activity.action === 'DELETE' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}>
                        {activity.action} • {activity.module.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
