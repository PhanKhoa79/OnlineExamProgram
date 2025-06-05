import api from "@/lib/axios";
import { CreateExamDto, UpdateExamDto, ExamDto } from "../types/exam.type";

export const getAllExams = async () : Promise<ExamDto[]>  => {
  const response = await api.get("/exam");
  return response.data;
};

export const getExamById = async (id: number) : Promise<ExamDto> => {
  const response = await api.get(`/exam/${id}`);
  return response.data;
};

export const createExam = async (data: CreateExamDto) : Promise<ExamDto> => {
  const response = await api.post("/exam", data);
  return response.data;
};

export const updateExam = async (id: number, data: UpdateExamDto) : Promise<ExamDto> => {
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

export const exportExams = async (data: ExamDto[], format: 'excel' | 'csv') => {

  console.log(`Exporting ${data.length} exams in ${format} format`);
  
  // Simulate export process
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Exported ${data.length} exams successfully`);
    }, 1000);
  });
};
