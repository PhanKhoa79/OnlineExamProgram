import api from "@/lib/axios";
import { 
  CreateRoomDto, 
  UpdateRoomDto, 
  RoomDto, 
  BulkCreateRoomDto, 
  SystemStatusDto,
  RoomStatusDto
} from "../types/room";

export const getAllRooms = async (params?: {
  status?: 'waiting' | 'open' | 'closed';
  scheduleId?: number;
  classId?: number;
}): Promise<RoomDto[]> => {
  try {
    
    // Build query parameters properly
    const queryParams: Record<string, string> = {};
    
    if (params?.status) {
      queryParams.status = params.status;
    }
    if (params?.scheduleId) {
      queryParams.scheduleId = params.scheduleId.toString();
    }
    if (params?.classId) {
      queryParams.classId = params.classId.toString();
    }
    
    const response = await api.get('/exam-schedule-assignments', {
      params: queryParams
    });
    
    return response.data || [];
  } catch  {
    return [];
  }
};

export const getRoomById = async (id: number): Promise<RoomDto> => {
  const response = await api.get(`/exam-schedule-assignments/${id}`);
  return response.data;
};

export const createRoom = async (data: CreateRoomDto): Promise<RoomDto> => {
  const response = await api.post("/exam-schedule-assignments", data);
  return response.data;
};

export const updateRoom = async (id: number, data: UpdateRoomDto): Promise<RoomDto> => {
  const response = await api.patch(`/exam-schedule-assignments/${id}`, data);
  return response.data;
};

export const deleteRoom = async (id: number): Promise<{ message: string }> => {
  const response = await api.delete(`/exam-schedule-assignments/${id}`);
  return response.data;
};

// ===== SPECIALIZED OPERATIONS =====

export const changeRoomStatus = async (
  id: number, 
  status: 'waiting' | 'open' | 'closed'
): Promise<RoomDto> => {
  const response = await api.patch(`/exam-schedule-assignments/${id}/status`, { status });
  return response.data;
};

/**
 * Get room status by ID
 * @param id Room ID
 * @returns Room status object
 */
export const getRoomStatus = async (id: number): Promise<RoomStatusDto> => {
  const response = await api.get(`/exam-schedule-assignments/${id}/status`);
  return response.data;
};

export const bulkCreateRooms = async (data: BulkCreateRoomDto): Promise<RoomDto[]> => {
  const response = await api.post("/exam-schedule-assignments/bulk-create", {
    examScheduleId: data.examScheduleId,
    examIds: data.examIds,
    classIds: data.classIds,
    randomizeOrder: data.randomizeOrder,
    description: data.description,
    maxParticipants: data.maxParticipants,
  });
  return response.data;
};

// ===== FILTERING HELPERS =====

export const getRoomsByStatus = async (status: 'waiting' | 'open' | 'closed'): Promise<RoomDto[]> => {
  return getAllRooms({ status });
};

export const getRoomsBySchedule = async (scheduleId: number): Promise<RoomDto[]> => {
  return getAllRooms({ scheduleId });
};

export const getRoomsByClass = async (classId: number): Promise<RoomDto[]> => {
  return getAllRooms({ classId });
};

// ===== SYSTEM STATUS =====

export const getSystemStatus = async (): Promise<SystemStatusDto> => {
  try {
    console.log("🔥 getSystemStatus called");
    const response = await api.get("/exam-schedule-assignments/system-status");
    console.log("🔥 getSystemStatus response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ getSystemStatus error:", error);
    // Return default status to prevent UI crash
    return {
      totalRooms: 0,
      waitingRooms: 0,
      openRooms: 0,
      closedRooms: 0,
      lastSyncTime: new Date().toISOString()
    };
  }
};

export const manualSync = async (): Promise<{
  message: string;
  timestamp: string;
  systemStatus: SystemStatusDto;
}> => {
  const response = await api.post("/exam-schedule-assignments/manual-sync");
  return response.data;
};

// ===== DEMO & TESTING =====

export const demonstrateRandomization = async (
  assignmentId: number,
  studentIds: number[]
): Promise<unknown> => {
  const response = await api.post(`/exam-schedule-assignments/${assignmentId}/demo-randomization`, {
    studentIds
  });
  return response.data;
};
