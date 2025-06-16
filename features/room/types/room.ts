export interface CreateRoomDto {
  code: string;
  randomizeOrder?: boolean;
  status?: 'waiting' | 'open' | 'closed';
  description?: string;
  examId: number;
  examScheduleId: number;
  classId: number;
  maxParticipants?: number;
}

export interface UpdateRoomDto {
  code?: string;
  randomizeOrder?: boolean;
  status?: 'waiting' | 'open' | 'closed';
  description?: string;
  examId?: number;
  classId?: number;
  maxParticipants?: number;
}

export interface RoomDto {
  id: number;
  code: string;
  randomizeOrder: boolean;
  status: 'waiting' | 'open' | 'closed';
  description?: string;
  maxParticipants?: number;
  currentParticipants?: number;
  createdAt: string;
  updatedAt: string;
  // Relations - these are the actual objects returned by backend
  exam?: {
    id: number;
    name: string;
    duration: number;
    examType: 'practice' | 'official';
    totalQuestions: number;
    createdAt: string;
    updatedAt: string;
  };
  examSchedule?: {
    id: number;
    code: string;
    startTime: string;
    endTime: string;
    status: 'active' | 'completed' | 'cancelled';
    description?: string;
    createdAt: string;
    updatedAt: string;
  };
  class?: {
    id: number;
    name: string;
    code: string;
    createdAt: string;
    updatedAt: string;
  };
  // Computed properties for backward compatibility
  examId?: number;
  examScheduleId?: number;
  classId?: number;
}

export interface BulkCreateRoomDto {
  examScheduleId: number;
  examIds: number[];
  classIds: number[];
  randomizeOrder?: boolean;
  description?: string;
  maxParticipants?: number;
}

export interface SystemStatusDto {
  totalRooms: number;
  waitingRooms: number;
  openRooms: number;
  closedRooms: number;
  lastSyncTime: string;
}

export interface RoomStatusChangeDto {
  status: 'waiting' | 'open' | 'closed';
}
