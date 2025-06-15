'use client';

import React, { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Notification } from '../types/notification';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { X, Check, Bell, MoreHorizontal, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';


interface NotificationPanelProps {
  onClose: () => void;
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
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
    event.stopPropagation(); // Prevent triggering the notification click
    setOpenDropdownId(openDropdownId === notificationId ? null : notificationId);
  };

  const renderNotificationItem = (notification: Notification, index: number) => {
    return (
      <div 
        key={notification.id}
        className={`relative p-4 border-b border-gray-200/50 dark:border-gray-700/50 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-200 cursor-pointer group ${!notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}
        onClick={() => handleMarkAsRead(notification)}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            {!notification.isRead ? (
              <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
            ) : (
              <div className="w-2 h-2 mt-2 bg-transparent"></div>
            )}
          </div>
          <div className="flex-grow">
            <p className="text-sm text-gray-800 dark:text-gray-200">{notification.message}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatTime(notification.createdAt)}</p>
          </div>
          
          {/* More Options Button - Only visible on hover */}
          <div className="flex-shrink-0 ml-2 relative">
            <button
              onClick={(e) => toggleDropdown(notification.id, e)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <MoreHorizontal className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
            
            {/* Dropdown Menu */}
            {openDropdownId === notification.id && (
              <div className={`absolute right-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-[60]
              `}>
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
    <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/50 dark:to-purple-950/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 mr-3">
              <Bell className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">Thông báo</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              onClick={handleMarkAllAsRead}
            >
              <span className="flex items-center">
                <Check className="h-3 w-3 mr-1" />
                Đánh dấu đã đọc tất cả
              </span>
            </button>
            <button 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto overflow-x-visible">
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600"></div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Đang tải thông báo...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="inline-block p-3 rounded-full bg-gray-100 dark:bg-gray-700">
              <Bell className="h-6 w-6 text-gray-400" />
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Bạn chưa có thông báo nào</p>
          </div>
        ) : (
          <div className="relative">
            <div className="border-b border-gray-200/50 dark:border-gray-700/50 py-2 px-4 bg-gray-50/50 dark:bg-gray-800/50">
              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Mới</h4>
            </div>
            <div className="relative overflow-visible">
              {notifications.map((notification, index) => renderNotificationItem(notification, index))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200/50 dark:border-gray-700/50 text-center bg-gray-50/30 dark:bg-gray-800/30">
        <button 
          className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 font-medium"
          onClick={() => {
            router.push('/dashboard/notifications');
            onClose();
          }}
        >
          Xem tất cả thông báo
        </button>
      </div>
    </div>
  );
} 