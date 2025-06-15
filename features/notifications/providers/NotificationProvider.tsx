'use client';

import { useNotifications } from '../hooks/useNotifications';

interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  useNotifications();
  return <>{children}</>;
} 