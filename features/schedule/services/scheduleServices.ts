import api from "@/lib/axios";
import { CreateExamScheduleDto, UpdateExamScheduleDto, ExamScheduleDto, ScheduleStatus } from "../types/schedule";

export const getAllSchedules = async (): Promise<ExamScheduleDto[]> => {
  const response = await api.get("/exam-schedules");
  return response.data;
};

export const getScheduleById = async (id: number): Promise<ExamScheduleDto> => {
  const response = await api.get(`/exam-schedules/${id}`);
  return response.data;
};

export const createSchedule = async (
  data: CreateExamScheduleDto
): Promise<ExamScheduleDto> => {
  const response = await api.post("/exam-schedules", data);
  return response.data;
};

export const updateSchedule = async (
  id: number,
  data: UpdateExamScheduleDto
): Promise<ExamScheduleDto> => {
  const response = await api.patch(`/exam-schedules/${id}`, data);
  return response.data;
};

export const deleteSchedule = async (id: number): Promise<{ message: string }> => {
  const response = await api.delete(`/exam-schedules/${id}`);
  return response.data;
};

export const getSchedulesByStatus = async (
  status: ScheduleStatus
): Promise<ExamScheduleDto[]> => {
  const response = await api.get(`/exam-schedules`, {
    params: { status },
  });
  return response.data;
};

export const getSchedulesByDateRange = async (
  startDate: string,
  endDate: string
): Promise<ExamScheduleDto[]> => {
  const response = await api.get(`/exam-schedules`, {
    params: { startDate, endDate },
  });
  return response.data;
};

export const updateScheduleStatus = async (): Promise<{ message: string }> => {
  const response = await api.post(`/exam-schedules/update-status`);
  return response.data;
};

export const cancelSchedule = async (
  id: number,
  reason?: string
): Promise<ExamScheduleDto> => {
  const response = await api.post(`/exam-schedules/${id}/cancel`, {
    reason,
  });
  return response.data;
};
