'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { useAuthStore } from '@/features/auth/store';
import { 
  fetchNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification,
  addNotification,
  resetNotifications,
  forceUpdate
} from '@/store/notificationSlice';
import { websocketService } from '../services/websocketService';
import type { Notification as AppNotification } from '../types/notification';

export const useNotifications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuthStore();
  const callbacksSetRef = useRef(false);
  const [lastEventTime, setLastEventTime] = useState<number>(0);
  
  // Lấy state từ Redux
  const { notifications, unreadCount, isLoading, error } = useSelector(
    (state: RootState) => state.notification
  );

  // Fetch notifications
  const loadNotifications = useCallback(() => {
    if (user) {
      dispatch(fetchNotifications());
    }
  }, [user, dispatch]);

  // Mark notification as read
  const markNotificationAsRead = useCallback((notificationId: number) => {
    dispatch(markAsRead(notificationId));
  }, [dispatch]);

  // Mark all notifications as read
  const markAllNotificationsAsRead = useCallback(() => {
    dispatch(markAllAsRead());
  }, [dispatch]);

  // Delete notification
  const deleteNotificationById = useCallback((notificationId: number) => {
    dispatch(deleteNotification(notificationId));
  }, [dispatch]);

  // Reset notifications (khi logout)
  const resetNotificationState = useCallback(() => {
    dispatch(resetNotifications());
    websocketService.disconnect();
    callbacksSetRef.current = false;
  }, [dispatch]);

  // Xử lý thông báo mới nhận được từ WebSocket
  const handleNewNotification = useCallback((newNotification: AppNotification) => {
    
    // Thêm thông báo mới vào Redux store
    dispatch(addNotification(newNotification));
    
    // Cập nhật thời gian nhận thông báo mới nhất
    setLastEventTime(Date.now());
    
    // Force update để đảm bảo re-render
    dispatch(forceUpdate());
    
    // Thông báo cho người dùng (có thể thêm toast notification ở đây)
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        // Sử dụng Web Notification API
        new window.Notification('Thông báo mới', {
          body: newNotification.message,
          icon: '/notification-icon.png'
        });
      } catch (error) {
        console.error('Error showing browser notification:', error);
      }
    }
  }, [dispatch]);

  // Setup WebSocket callbacks - chỉ setup một lần
  const setupWebSocketCallbacks = useCallback(() => {
    if (callbacksSetRef.current || !user) return;

    websocketService.setCallbacks({
      onNotification: handleNewNotification,
      onPermissionNotification: (data) => {
        console.log('📨 [Hook] Processing permission-based notification:', data);
        const userPermissions = user.permissions?.permissions || [];
        
        if (userPermissions.includes(data.permission)) {
          console.log('✅ [Hook] User has permission, adding notification');
          handleNewNotification(data.notification);
        } else {
          console.log(`❌ [Hook] User does not have permission ${data.permission}, ignoring notification`);
        }
      },
      onConnect: () => {
        console.log('🔗 [Hook] WebSocket connected, loading notifications...');
        loadNotifications();
      },
      onDisconnect: (reason) => {
        console.log('🔌 [Hook] WebSocket disconnected:', reason);
        callbacksSetRef.current = false;
      },
      onError: (error) => {
        console.error('❌ [Hook] WebSocket error:', error);
      }
    });

    callbacksSetRef.current = true;
  }, [user, dispatch, loadNotifications, handleNewNotification]);

  // Effect để setup WebSocket khi user thay đổi
  useEffect(() => {
    if (user) {
      console.log('👤 [Hook] User changed, setting up WebSocket for:', user.accountname);
      
      // Setup callbacks trước
      setupWebSocketCallbacks();
      
      // Sau đó kết nối với đầy đủ thông tin user bao gồm ID
      const userWithId = {
        ...user,
        id: user.id // Đảm bảo ID được truyền cho WebSocket service
      };
      
      websocketService.connect(userWithId);
      
      // Load notifications nếu đã connected
      if (websocketService.isConnected()) {
        loadNotifications();
      }
    } else {
      console.log('👤 [Hook] No user, resetting notification state');
      resetNotificationState();
    }

    // Cleanup khi component unmount
    return () => {
      if (!user) {
        console.log('🧹 [Hook] Cleaning up WebSocket connection');
        websocketService.disconnect();
        callbacksSetRef.current = false;
      }
    };
  }, [user?.accountname, user?.id]); // Thêm user.id vào dependencies

  // Effect riêng để setup callbacks khi dispatch thay đổi
  useEffect(() => {
    if (user && !callbacksSetRef.current) {
      setupWebSocketCallbacks();
    }
  }, [setupWebSocketCallbacks]);

  // Định kỳ kiểm tra kết nối WebSocket và làm mới nếu cần
  useEffect(() => {
    if (!user) return;

    // Kiểm tra kết nối mỗi 30 giây
    const checkInterval = setInterval(() => {
      if (!websocketService.isConnected()) {
        console.log('🔄 [Hook] WebSocket disconnected, reconnecting...');
        
        // Kết nối lại với đầy đủ thông tin user bao gồm ID
        const userWithId = {
          ...user,
          id: user.id
        };
        
        websocketService.connect(userWithId);
      }
    }, 30000);

    return () => clearInterval(checkInterval);
  }, [user]);

  // Định kỳ làm mới danh sách thông báo
  useEffect(() => {
    if (!user) return;

    // Làm mới danh sách thông báo mỗi 2 phút
    const refreshInterval = setInterval(() => {
      console.log('🔄 [Hook] Refreshing notifications...');
      loadNotifications();
    }, 120000);

    return () => clearInterval(refreshInterval);
  }, [user, loadNotifications]);

  return {
    // State
    notifications,
    unreadCount,
    isLoading,
    error,
    lastEventTime,
    
    // Actions
    loadNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotificationById,
    resetNotificationState
  };
}; 