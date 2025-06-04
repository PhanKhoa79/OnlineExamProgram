import api from "@/lib/axios";
import { ClassResponseDto, CreateClassDto, UpdateClassDto } from "../types/class.type";


export const getAllClasses = async (): Promise<ClassResponseDto[]> => {
  const response = await api.get<ClassResponseDto[]>("/classes");
  return response.data;
};

export const getClassById = async (id: number): Promise<ClassResponseDto> => {
  const response = await api.get<ClassResponseDto>(`/classes/${id}`);
  return response.data;
};

export const createClass = async (
  data: CreateClassDto
): Promise<ClassResponseDto> => {
  const response = await api.post<ClassResponseDto>("/classes", data);
  return response.data;
};

export const updateClass = async (
  id: number,
  data: UpdateClassDto
): Promise<ClassResponseDto> => {
  const response = await api.put<ClassResponseDto>(`/classes/${id}`, data);
  return response.data;
};

export const deleteClassById = async (
  id: number
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/classes/${id}`);
  return response.data;
};
