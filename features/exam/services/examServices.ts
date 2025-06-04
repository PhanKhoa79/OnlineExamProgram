import api from "@/lib/axios";
import { CreateExamDto, UpdateExamDto } from "../types/exam.type";

export const getAllExams = async () => {
  const response = await api.get("/exam");
  return response.data;
};

export const getExamById = async (id: number) => {
  const response = await api.get(`/exam/${id}`);
  return response.data;
};

export const createExam = async (data: CreateExamDto) => {
  const response = await api.post("/exam", data);
  return response.data;
};

export const updateExam = async (id: number, data: UpdateExamDto) => {
  const response = await api.put(`/exam/${id}`, data);
  return response.data;
};

export const deleteExam = async (id: number) => {
  const response = await api.delete(`/exam/${id}`);
  return response.data;
};

export const getQuestionsOfExam = async (id: number) => {
  const response = await api.get(`/exam/${id}/questions`);
  return response.data;
};

export const getExamsBySubject = async (subjectId: number) => {
  const response = await api.get(`/exam/subject/${subjectId}`);
  return response.data;
};
