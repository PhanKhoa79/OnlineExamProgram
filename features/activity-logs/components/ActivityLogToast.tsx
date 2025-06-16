'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/features/auth/store';
import { websocketService } from '@/features/notifications/services/websocketService';
import { ActivityLogDto } from '../types/activity-log.type';
import { toast } from '@/components/hooks/use-toast';

export const ActivityLogToast = () => {
  const { user } = useAuthStore();
  const toastCallbackSetRef = useRef(false);

  useEffect(() => {
    if (!user || user.role.name !== 'moderator' || toastCallbackSetRef.current) return;

    console.log('🔔 Setting up ActivityLog toast notifications for moderator:', user.accountname);
    
    const socket = websocketService.getSocket();
    if (socket) {
      const handleNewActivityToast = (data: { event: string; data: ActivityLogDto; timestamp: string }) => {
        if (data.event === 'new-activity' && data.data) {
          console.log('🔔 Showing toast for new activity:', data.data);
          
          const getActionIcon = (action: string) => {
            switch (action) {
              case 'CREATE': return '✅';
              case 'UPDATE': return '📝';
              case 'DELETE': return '🗑️';
              default: return '⚙️';
            }
          };

          toast({
            title: `${getActionIcon(data.data.action)} Hoạt động mới`,
            description: data.data.displayMessage,
            duration: 5000,
          });
        }
      };

      socket.on('activity-log-new', handleNewActivityToast);
      toastCallbackSetRef.current = true;

      return () => {
        socket.off('activity-log-new', handleNewActivityToast);
        toastCallbackSetRef.current = false;
      };
    }
  }, [user]);

  return null; // Component này chỉ để setup toast, không render gì
}; 