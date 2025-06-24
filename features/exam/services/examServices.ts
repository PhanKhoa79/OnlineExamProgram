import api from "@/lib/axios";
import { CreateExamDto, UpdateExamDto, ExamDto, StudentPracticeProgressResponseDto, StartExamDto, StartExamResponseDto, SaveStudentAnswerDto, StudentAnswerResponseDto, InProgressExamDto, CompletedPracticeExamsResponseDto, ExamResultDto, AllCompletedExamsResponseDto } from "../types/exam.type";

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

export const getExamsByType = async (examType: 'practice' | 'official'): Promise<ExamDto[]> => {
  const response = await api.get(`/exam/type/${examType}`);
  return response.data;
};

export const getStudentPracticeProgress = async (studentId: number): Promise<StudentPracticeProgressResponseDto> => {
  const response = await api.get(`/exam/practice-progress/${studentId}`);
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

// 🔥 API để bắt đầu làm bài thi
export const startExam = async (data: StartExamDto): Promise<StartExamResponseDto> => {
  const response = await api.post('/exam/start', data);
  return response.data;
};

// 🔥 API để lưu/cập nhật câu trả lời
export const saveStudentAnswer = async (data: SaveStudentAnswerDto): Promise<StudentAnswerResponseDto> => {
  const response = await api.post('/exam/answer', data);
  return response.data;
};

// 🔥 API để lấy tất cả câu trả lời của một bài thi
export const getStudentAnswers = async (studentExamId: number): Promise<StudentAnswerResponseDto[]> => {
  const response = await api.get(`/exam/student-exam/${studentExamId}/answers`);
  return response.data;
};

// 🔥 API để lấy các đề thi practice đang làm dở (đã bắt đầu nhưng chưa submit)
export const getInProgressPracticeExams = async (studentId: number): Promise<InProgressExamDto[]> => {
  const response = await api.get(`/exam/in-progress-practice/${studentId}`);
  return response.data;
};

// 🔥 API để nộp bài thi
export const submitStudentExam = async (studentExamId: number) => {
  const response = await api.post(`/exam/student-exam/${studentExamId}/submit`);
  return response.data;
};

// 🔥 API để lấy các đề thi practice đã hoàn thành
export const getCompletedPracticeExams = async (studentId: number): Promise<CompletedPracticeExamsResponseDto> => {
  const response = await api.get(`/exam/completed-practice/${studentId}`);
  return response.data;
};

// 🔥 API để lấy tất cả các đề thi đã hoàn thành (cả practice và official)
export const getAllCompletedExams = async (studentId: number): Promise<AllCompletedExamsResponseDto> => {
  const response = await api.get(`/exam/all-completed/${studentId}`);
  return response.data;
};

// 🔥 API để lấy kết quả chi tiết của một đề thi
export const getStudentExamResult = async (examId: number, studentId: number): Promise<ExamResultDto> => {
  const response = await api.get(`/exam/${examId}/student/${studentId}/result`);
  
  const apiData = response.data;
  
  // Chuyển đổi dữ liệu sang cấu trúc ExamResultDto
  const adaptedData: ExamResultDto = {
    studentExamId: apiData.studentExamInfo?.id || 0,
    exam: apiData.studentExamInfo?.exam || {},
    student: {
      id: apiData.studentExamInfo?.student?.id || 0,
      name: apiData.studentExamInfo?.student?.fullName || '',
      email: '', // Không có trong dữ liệu API
    },
    result: {
      score: apiData.studentExamInfo?.result?.score || 0,
      scorePercentage: apiData.studentExamInfo?.result?.scorePercentage || 0,
      totalQuestions: apiData.statistics?.totalQuestions || 0,
      correctAnswers: apiData.statistics?.correctAnswers || 0,
      incorrectAnswers: apiData.statistics?.incorrectAnswers || 0,
      unansweredQuestions: apiData.statistics?.unansweredQuestions || 0,
      startedAt: apiData.studentExamInfo?.result?.startedAt || '',
      submittedAt: apiData.studentExamInfo?.result?.submittedAt || '',
      timeTaken: apiData.studentExamInfo?.result?.timeTaken?.toString() || '',
    },
    answers: (apiData.questionResults || []).map((qr: any) => ({
      questionId: qr.questionId,
      question: {
        id: qr.questionId,
        questionText: qr.questionText,
        answers: (qr.answers || []).map((ans: any) => ({
          id: ans.id,
          answerText: ans.answerText,
          isCorrect: ans.isCorrect
        }))
      },
      selectedAnswer: qr.studentAnswer?.answerId ? {
        id: qr.studentAnswer.answerId,
        answerText: (qr.answers || []).find((a: any) => a.id === qr.studentAnswer.answerId)?.answerText || '',
        isCorrect: qr.studentAnswer.isCorrect
      } : null,
      correctAnswer: {
        id: (qr.answers || []).find((a: any) => a.isCorrect)?.id || 0,
        answerText: (qr.answers || []).find((a: any) => a.isCorrect)?.answerText || ''
      },
      isCorrect: qr.studentAnswer?.isCorrect || false,
      isMarked: qr.studentAnswer?.isMarked || false
    }))
  };
  
  return adaptedData;
};

/**
 * Lấy danh sách phòng thi đang mở của một lớp
 * @param classId ID của lớp
 * @returns Danh sách phòng thi đang mở
 */
export const getOpenExamsByClassId = async (classId: number) => {
  try {
    const response = await api.get(`/exam-schedule-assignments/class/${classId}/open-exams`);
    return response.data;
  } catch (error) {
    console.error('Error fetching open exams by class ID:', error);
    throw error;
  }
}

