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


export const exportExamWithQuestions = async (examId: number, format: 'excel' | 'csv' = 'excel') => {
  const response = await api.post(`/exam/${examId}/export?format=${format}`, {}, {
    responseType: 'blob',
    headers: {
      'Accept': format === 'excel' 
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'text/csv'
    }
  });

  // Extract filename from Content-Disposition header
  const contentDisposition = response.headers['content-disposition'] || '';
  const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
  const filename = filenameMatch ? filenameMatch[1] : `de_thi_${examId}.${format === 'excel' ? 'xlsx' : 'csv'}`;

  // Create download link
  const blob = new Blob([response.data], { 
    type: format === 'excel' 
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : 'text/csv; charset=utf-8'
  });
  
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);

  return { success: true, filename };
};