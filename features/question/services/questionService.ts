import api from "@/lib/axios";
import { CreateQuestionDto, DifficultyLevel, QuestionDto, UpdateQuestionDto } from "../types/question.type";


export const getAllQuestions = async (): Promise<QuestionDto[]> => {
  const response = await api.get("/questions");
  return response.data;
};

export const getQuestionById = async (id: number): Promise<QuestionDto> => {
  const response = await api.get(`/questions/${id}`);
  return response.data;
};

export const createQuestion = async (
  data: CreateQuestionDto
): Promise<QuestionDto> => {
  const response = await api.post("/questions", data);
  return response.data;
};

export const createManyQuestions = async (
  data: CreateQuestionDto[]
): Promise<QuestionDto[]> => {
  const response = await api.post("/questions/bulk", { questions: data });
  return response.data;
};

export const updateQuestion = async (
  id: number,
  data: UpdateQuestionDto
): Promise<QuestionDto> => {
  const response = await api.put(`/questions/${id}`, data);
  return response.data;
};

export const deleteQuestion = async (id: number): Promise<{ message: string }> => {
  const response = await api.delete(`/questions/${id}`);
  return response.data;
};

export const getQuestionsByDifficulty = async (
  level: DifficultyLevel
): Promise<QuestionDto[]> => {
  const response = await api.get(`/questions/by-difficulty`, {
    params: { level },
  });
  return response.data;
};

export const getQuestionsBySubject = async (
  subjectId: number
): Promise<QuestionDto[]> => {
  const response = await api.get(`/questions/by-subject/${subjectId}`);
  return response.data;
};

export const batchUpdateQuestions = async (
  updates: { id: number; data: UpdateQuestionDto }[]
): Promise<QuestionDto[]> => {
  const response = await api.patch(`/questions/batch-update`, updates);
  return response.data;
};

export const batchDeleteQuestions = async (
  ids: number[]
): Promise<{ message: string }> => {
  const response = await api.post(`/questions/batch-delete`, { ids });
  return response.data;
};

export const exportQuestions = async (questions: QuestionDto[], format: 'excel' | 'csv') => {
  const response = await api.post(
    `/questions/export?format=${format}`,
    { questions },
    {
      responseType: "blob",
    }
  );

  const blob = new Blob([response.data], {
    type:
      format === "excel"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "text/csv",
  });

  const options = {
    suggestedName: `questions.${format === 'excel' ? 'xlsx' : 'csv'}`,
    types: [
      {
        description: format === 'excel' ? 'Excel Files' : 'CSV Files',
        accept: {
          [format === 'excel'
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : 'text/csv']: [format === 'excel' ? '.xlsx' : '.csv'],
        },
      },
    ],
  };

  if ('showSaveFilePicker' in window) {
    const handle = await (window as unknown as { 
      showSaveFilePicker: (options: {
        suggestedName: string;
        types: Array<{
          description: string;
          accept: Record<string, string[]>;
        }>;
      }) => Promise<{
        createWritable: () => Promise<{
          write: (data: Blob) => Promise<void>;
          close: () => Promise<void>;
        }>;
      }>;
    }).showSaveFilePicker(options);
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
  }
};

export const importQuestionsFromFile = async (file: File, type: 'xlsx' | 'csv') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const response = await api.post(`/questions/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export const downloadQuestionTemplateFile = async (type: 'xlsx' | 'csv') => {
  try {  
    const response = await api.get(`/questions/download-template?type=${type}`, {
      responseType: 'blob', 
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement('a');
    link.href = url;

    const fileName = `question_template.${type}`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Chi tiết lỗi khi tải file mẫu:', error);
    throw error;
  }
};
