export enum NotificationType {
  EXAM_CREATED = 'EXAM_CREATED',
  SCHEDULE_CREATED = 'SCHEDULE_CREATED',
  EXAM_RESULT = 'EXAM_RESULT',
  SYSTEM = 'SYSTEM'
}

export interface Notification {
  id: number;
  message: string;
  read: boolean;
  createdAt: string;
  type: NotificationType;
  data?: {
    examId?: number;
    examType?: 'official' | 'practice';
    scheduleId?: number;
    resultId?: number;
    [key: string]: unknown;
  };
}