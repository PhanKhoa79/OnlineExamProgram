import api from "@/lib/axios";
import { CreateSubjectDto, SubjectResponseDto, UpdateSubjectDto } from "../types/subject";

export const getAllSubjects = async (): Promise<SubjectResponseDto[]> => {
  const response = await api.get<SubjectResponseDto[]>("/subject");
  return response.data;
};

export const getSubjectByCode = async (code: string): Promise<SubjectResponseDto> => {
  const response = await api.get<SubjectResponseDto>(`/subject/${code}`);
  return response.data;
};

export const getSubjectById = async (id: number): Promise<SubjectResponseDto> => {
  const response = await api.get<SubjectResponseDto>(`/subject/id/${id}`);
  return response.data;
};

export const createSubject = async (data: CreateSubjectDto): Promise<SubjectResponseDto> => {
  const response = await api.post<SubjectResponseDto>("/subject", data);
  return response.data;
};

export const updateSubject = async (
  id: number,
  data: UpdateSubjectDto
): Promise<SubjectResponseDto> => {
  const response = await api.put<SubjectResponseDto>(`/subject/${id}`, data);
  return response.data;
};
export const deleteSubject = async (id: number): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/subject/${id}`);
  return response.data;
};
