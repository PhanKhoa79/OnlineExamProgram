'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/features/auth/store';
import { websocketService } from '@/features/notifications/services/websocketService';
import { ActivityLogDto } from '../types/activity-log.type';

interface ActivityLogBadgeProps {
  children: React.ReactNode;
  onNewActivity?: (count: number) => void;
}

export const ActivityLogBadge = ({ children, onNewActivity }: ActivityLogBadgeProps) => {
  const { user } = useAuthStore();
  const [newActivityCount, setNewActivityCount] = useState(0);
  const badgeCallbackSetRef = useRef(false);

  useEffect(() => {
    if (!user || user.role.name !== 'moderator' || badgeCallbackSetRef.current) return;

    console.log('🔢 Setting up ActivityLog badge counter for moderator:', user.accountname);
    
    const socket = websocketService.getSocket();
    if (socket) {
      const handleNewActivityCount = (data: { event: string; data: ActivityLogDto; timestamp: string }) => {
        if (data.event === 'new-activity' && data.data) {
          setNewActivityCount(prev => {
            const newCount = prev + 1;
            onNewActivity?.(newCount);
            return newCount;
          });
        }
      };

      socket.on('activity-log-new', handleNewActivityCount);
      badgeCallbackSetRef.current = true;

      return () => {
        socket.off('activity-log-new', handleNewActivityCount);
        badgeCallbackSetRef.current = false;
      };
    }
  }, [user, onNewActivity]);

  const resetBadge = () => {
    setNewActivityCount(0);
  };

  // Export reset function để có thể gọi từ bên ngoài
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).resetActivityBadge = resetBadge;
    }
  }, []);

  if (!user || user.role.name !== 'moderator') {
    return <>{children}</>;
  }

  return (
    <div className="relative inline-block">
      {children}
      {newActivityCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center animate-pulse">
          {newActivityCount > 99 ? '99+' : newActivityCount}
        </span>
      )}
    </div>
  );
}; 