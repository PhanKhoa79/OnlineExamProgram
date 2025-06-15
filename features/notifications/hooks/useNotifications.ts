'use client';

import { useEffect, useCallback, useRef } from 'react';
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

export const useNotifications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuthStore();
  const callbacksSetRef = useRef(false);
  
  // Lấy state từ Redux
  const { notifications, unreadCount, isLoading, error } = useSelector(
    (state: RootState) => state.notification
  );

  // Fetch notifications
  const loadNotifications = useCallback(() => {
    if (user) {
      console.log('📥 Fetching notifications...');
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

  // Setup WebSocket callbacks - chỉ setup một lần
  const setupWebSocketCallbacks = useCallback(() => {
    if (callbacksSetRef.current || !user) return;

    console.log('🔧 Setting up WebSocket callbacks for user:', user.accountname);
    
    websocketService.setCallbacks({
      onNotification: (newNotification) => {
        console.log('📨 [Hook] Processing direct notification:', newNotification);
        dispatch(addNotification(newNotification));
        // Force update để đảm bảo re-render
        setTimeout(() => dispatch(forceUpdate()), 10);
      },
      onPermissionNotification: (data) => {
        console.log('📨 [Hook] Processing permission-based notification:', data);
        const userPermissions = user.permissions?.permissions || [];
        
        if (userPermissions.includes(data.permission)) {
          console.log('✅ [Hook] User has permission, adding notification');
          dispatch(addNotification(data.notification));
          // Force update để đảm bảo re-render
          setTimeout(() => dispatch(forceUpdate()), 10);
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
  }, [user, dispatch, loadNotifications]);

  // Effect để setup WebSocket khi user thay đổi
  useEffect(() => {
    if (user) {
      console.log('👤 [Hook] User changed, setting up WebSocket for:', user.accountname);
      
      // Setup callbacks trước
      setupWebSocketCallbacks();
      
      // Sau đó kết nối
      websocketService.connect(user);
      
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
  }, [user?.accountname]); // Chỉ depend vào user.accountname để tránh re-run không cần thiết

  // Effect riêng để setup callbacks khi dispatch thay đổi
  useEffect(() => {
    if (user && !callbacksSetRef.current) {
      setupWebSocketCallbacks();
    }
  }, [setupWebSocketCallbacks]);

  return {
    // State
    notifications,
    unreadCount,
    isLoading,
    error,
    
    // Actions
    loadNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotificationById,
    resetNotificationState
  };
}; 