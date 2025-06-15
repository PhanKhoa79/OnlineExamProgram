export interface Notification {
    id: number;
    message: string;
    isRead: boolean;
    createdAt: string;
    metadata?: Record<string, unknown>;
  }