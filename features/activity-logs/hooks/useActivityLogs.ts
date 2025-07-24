'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuthStore } from '@/features/auth/store';
import { getRecentActivities, getAllActivities } from '../services/activityLogService';
import { ActivityLogDto } from '../types/activity-log.type';
import { websocketService } from '@/features/notifications/services/websocketService';

export const useActivityLogs = (limit?: number) => {
  const { user } = useAuthStore();
  const [activities, setActivities] = useState<ActivityLogDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const callbacksSetRef = useRef(false);

  // Fetch recent activities
  const fetchRecentActivities = useCallback(async () => {
    if (!user || user.role.name !== 'moderator') return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await getRecentActivities(limit || 10);
      setActivities(response.data);
    } catch (err) {
      console.error('Error fetching recent activities:', err);
      setError('Không thể tải danh sách hoạt động');
    } finally {
      setLoading(false);
    }
  }, [user, limit]);

  // Fetch all activities
  const fetchAllActivities = useCallback(async () => {
    if (!user || user.role.name !== 'moderator') return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await getAllActivities();
      setActivities(response.data);
    } catch (err) {
      console.error('Error fetching all activities:', err);
      setError('Không thể tải danh sách hoạt động');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Handle new activity from WebSocket
  const handleNewActivity = useCallback((data: { event: string; data: ActivityLogDto; timestamp: string }) => {
    if (data.event === 'new-activity' && data.data) {
      setActivities(prevActivities => {
        // Kiểm tra xem activity đã tồn tại chưa
        const existingActivity = prevActivities.find(activity => activity.id === data.data.id);
        if (existingActivity) {
          console.log('📨 [ActivityLogs] Activity already exists, skipping...');          
          return prevActivities;
        }

        // Thêm activity mới vào đầu danh sách
        const newActivities = [data.data, ...prevActivities];
        
        // Nếu có limit, chỉ giữ số lượng activity theo limit
        if (limit && newActivities.length > limit) {
          return newActivities.slice(0, limit);
        }
        
        return newActivities;
      });
    }
  }, [limit]);

  // Setup WebSocket callbacks for activity logs
  const setupActivityLogCallbacks = useCallback(() => {
    if (callbacksSetRef.current || !user || user.role.name !== 'moderator') return;

    console.log('🔧 Setting up ActivityLog WebSocket callbacks for user:', user.accountname);
    
    // Lắng nghe event activity-log-new
    const socket = websocketService.getSocket();
    if (socket) {
      socket.on('activity-log-new', handleNewActivity);
      callbacksSetRef.current = true;
    }
  }, [user, handleNewActivity]);

  // Cleanup WebSocket callbacks
  const cleanupActivityLogCallbacks = useCallback(() => {
    console.log('🧹 Cleaning up ActivityLog WebSocket callbacks');
    const socket = websocketService.getSocket();
    if (socket) {
      socket.off('activity-log-new', handleNewActivity);
    }
    callbacksSetRef.current = false;
  }, [handleNewActivity]);

  // Setup WebSocket when user changes
  useEffect(() => {
    if (user && user.role.name === 'moderator') {
      
      // Đảm bảo WebSocket đã kết nối
      if (!websocketService.isConnected()) {
        websocketService.connect(user);
      }
      
      // Setup callbacks
      setupActivityLogCallbacks();
      
      // Fetch initial data
      if (limit) {
        fetchRecentActivities();
      } else {
        fetchAllActivities();
      }
    } else {
      cleanupActivityLogCallbacks();
      setActivities([]);
    }

    return () => {
      cleanupActivityLogCallbacks();
    };
  }, [user.accountname, limit, fetchRecentActivities, fetchAllActivities, setupActivityLogCallbacks, cleanupActivityLogCallbacks, user]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupActivityLogCallbacks();
    };
  }, [cleanupActivityLogCallbacks]);

  return {
    activities,
    loading,
    error,
    fetchRecentActivities,
    fetchAllActivities,
    refetch: limit ? fetchRecentActivities : fetchAllActivities
  };
};
