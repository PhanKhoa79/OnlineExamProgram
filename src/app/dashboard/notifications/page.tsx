'use client';

import React, { useState } from 'react';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { Notification } from '@/features/notifications/types/notification';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Check, Bell, MoreHorizontal, Trash2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
  const { notifications, isLoading, error, markNotificationAsRead, markAllNotificationsAsRead, deleteNotificationById } = useNotifications();
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const router = useRouter();

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: vi });
    } catch {
      return 'Không xác định';
    }
  };

  const handleMarkAsRead = async (notification: Notification) => {
    if (!notification.isRead) {
      await markNotificationAsRead(notification.id);
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead();
  };

  const handleDeleteNotification = async (notificationId: number) => {
    await deleteNotificationById(notificationId);
    setOpenDropdownId(null);
  };

  const toggleDropdown = (notificationId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenDropdownId(openDropdownId === notificationId ? null : notificationId);
  };

  const renderNotificationItem = (notification: Notification, index: number) => {
    // Kiểm tra xem có phải là 2 item cuối không để điều chỉnh vị trí dropdown
    const isLastItems = index >= notifications.length - 2;
    
    return (
      <div 
        key={notification.id}
        className={`relative p-6 border-b border-gray-200/50 dark:border-gray-700/50 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-200 cursor-pointer group ${!notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}
        onClick={() => handleMarkAsRead(notification)}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-4">
            {!notification.isRead ? (
              <div className="w-3 h-3 mt-2 bg-blue-500 rounded-full"></div>
            ) : (
              <div className="w-3 h-3 mt-2 bg-transparent"></div>
            )}
          </div>
          <div className="flex-grow">
            <p className="text-base text-gray-800 dark:text-gray-200 leading-relaxed">{notification.message}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{formatTime(notification.createdAt)}</p>
          </div>
          
          {/* More Options Button */}
          <div className="flex-shrink-0 ml-4 relative">
            <button
              onClick={(e) => toggleDropdown(notification.id, e)}
              className="opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <MoreHorizontal className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
            
            {/* Dropdown Menu */}
            {openDropdownId === notification.id && (
              <div className={`absolute right-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-[60] ${
                isLastItems ? 'bottom-12' : 'top-12'
              }`}>
                <div className="py-1">
                  {!notification.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification);
                        setOpenDropdownId(null);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Check className="h-4 w-4 mr-3 text-green-500" />
                      Đánh dấu là đã đọc
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notification.id);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-3" />
                    Xóa thông báo này
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdownId(null);
    };

    if (openDropdownId) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openDropdownId]);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-xl mb-6">
          <div className="px-6 py-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => router.back()}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors mr-4"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 mr-4">
                  <Bell className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tất cả thông báo</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Quản lý và theo dõi các thông báo của bạn
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  onClick={handleMarkAllAsRead}
                >
                  <span className="flex items-center">
                    <Check className="h-4 w-4 mr-2" />
                    Đánh dấu đã đọc tất cả
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Tổng cộng: <span className="font-semibold text-gray-900 dark:text-white">{notifications.length}</span> thông báo
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                Chưa đọc: <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {notifications.filter(n => !n.isRead).length}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-xl overflow-visible">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Đang tải thông báo...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <div className="inline-block p-4 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                <Bell className="h-8 w-8 text-red-500" />
              </div>
              <p className="text-red-500 text-lg font-medium mb-2">Có lỗi xảy ra</p>
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-block p-4 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <Bell className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-xl font-medium text-gray-900 dark:text-white mb-2">Chưa có thông báo nào</p>
              <p className="text-gray-600 dark:text-gray-400">Các thông báo mới sẽ xuất hiện tại đây</p>
            </div>
          ) : (
            <div className="relative overflow-visible">
              {notifications.map((notification, index) => renderNotificationItem(notification, index))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 