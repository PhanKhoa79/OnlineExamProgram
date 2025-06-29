import api from "@/lib/axios";
import { CreateExamDto, UpdateExamDto, ExamDto, StudentPracticeProgressResponseDto, StartExamDto, StartExamResponseDto, SaveStudentAnswerDto, StudentAnswerResponseDto, InProgressExamDto, CompletedPracticeExamsResponseDto, ExamResultDto, AllCompletedExamsResponseDto, ExamResult, ExamResultFilters } from "../types/exam.type";
import { UniversalAnalyticsQuery, UniversalAnalyticsResponse, ExamVolumeQuery, ExamVolumeResponse, ScoreStatisticsQuery, ScoreStatisticsResponse, TopStudentsQuery, TopStudentsResponseDto, FailingStudentsQuery, FailingStudentsResponse } from "../types/report.type";
import { getRoomStatus } from "@/features/room/services/roomServices";

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

/**
 * Kiểm tra trạng thái của phòng thi
 * @param roomId ID của phòng thi
 * @returns Trạng thái của phòng thi ('waiting', 'open', hoặc 'closed') hoặc null nếu có lỗi
 */
export const checkRoomStatus = async (roomId: number): Promise<'waiting' | 'open' | 'closed' | null> => {
  try {
    const response = await getRoomStatus(roomId);
    return response.status;
  } catch (error) {
    console.error('Error checking room status:', error);
    return null;
  }
}

export const getStudentExamResults = async (
  filters?: ExamResultFilters,
  page: number = 1,
  limit: number = 10
): Promise<{
  results: ExamResult[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  statistics: {
    totalExams: number;
    averageScore: string;
    passedExams: number;
    passRate: string;
  };
}> => {
  try {
    // Prepare request body with all filter parameters including new date filters
    const requestBody: {
      classId?: number;
      subjectId?: number;
      examType?: string;
      specificDate?: string;
      startDate?: string;
      endDate?: string;
    } = {};

    if (filters?.classId) {
      requestBody.classId = filters.classId;
    }
    if (filters?.subjectId) {
      requestBody.subjectId = filters.subjectId;
    }
    if (filters?.examType) {
      requestBody.examType = filters.examType;
    }
    if (filters?.specificDate) {
      requestBody.specificDate = filters.specificDate;
    }
    if (filters?.startDate) {
      requestBody.startDate = filters.startDate;
    }
    if (filters?.endDate) {
      requestBody.endDate = filters.endDate;
    }

    // Call API với filters bao gồm cả date filters
    const response = await api.post('/exam/student-results', Object.keys(requestBody).length > 0 ? requestBody : {});
    const allResults: ExamResult[] = response.data;

    // Tính toán thống kê từ toàn bộ dữ liệu
    const totalExams = allResults.length;
    const averageScore = totalExams > 0 
      ? (allResults.reduce((sum, result) => sum + result.score, 0) / totalExams).toFixed(1)
      : '0';
    const passedExams = allResults.filter(result => result.score >= 50).length;
    const passRate = totalExams > 0 ? ((passedExams / totalExams) * 100).toFixed(1) : '0';

    const total = allResults.length;
    const totalPages = Math.ceil(total / limit);

    return {
      results: allResults,
      total,
      page,
      limit,
      totalPages,
      statistics: {
        totalExams,
        averageScore,
        passedExams,
        passRate
      }
    };
  } catch (error: unknown) {
    console.error('Error fetching student exam results:', error);
    throw error;
  }
};

export const getAnalyticsSummary = async () => {
  try {
    const response = await api.get('/analytics/summary');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getScoreTrends = async (params?: {
  period?: 'daily' | 'weekly' | 'monthly';
  range?: number;
  classIds?: number[];
  subjectIds?: number[];
  examType?: 'practice' | 'official' | 'all';
}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.period) {
      queryParams.append('period', params.period);
    }
    if (params?.range) {
      queryParams.append('range', params.range.toString());
    }
    if (params?.classIds && params.classIds.length > 0) {
      params.classIds.forEach(id => queryParams.append('classIds', id.toString()));
    }
    if (params?.subjectIds && params.subjectIds.length > 0) {
      params.subjectIds.forEach(id => queryParams.append('subjectIds', id.toString()));
    }
    if (params?.examType && params.examType !== 'all') {
      queryParams.append('examType', params.examType);
    }

    const response = await api.get(`/analytics/score-trends?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSubjectPerformance = async (params?: {
  classIds?: number[];
  subjectIds?: number[];
  examType?: 'practice' | 'official' | 'all';
  startDate?: string;
  endDate?: string;
  limit?: number;
}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.classIds && params.classIds.length > 0) {
      queryParams.append('classIds', params.classIds.join(','));
    }
    if (params?.subjectIds && params.subjectIds.length > 0) {
      queryParams.append('subjectIds', params.subjectIds.join(','));
    }
    if (params?.examType && params.examType !== 'all') {
      queryParams.append('examType', params.examType);
    }
    if (params?.startDate) {
      queryParams.append('startDate', params.startDate);
    }
    if (params?.endDate) {
      queryParams.append('endDate', params.endDate);
    }
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    const response = await api.get(`/analytics/subject-performance?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 🆕 Universal Analytics API
export const getUniversalAnalytics = async (params?: UniversalAnalyticsQuery): Promise<UniversalAnalyticsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.timePreset) {
      queryParams.append('timePreset', params.timePreset);
    }
    if (params?.startDate) {
      queryParams.append('startDate', params.startDate);
    }
    if (params?.endDate) {
      queryParams.append('endDate', params.endDate);
    }
    if (params?.classIds?.length) {
      params.classIds.forEach(id => queryParams.append('classIds', id.toString()));
    }
    if (params?.subjectIds?.length) {
      params.subjectIds.forEach(id => queryParams.append('subjectIds', id.toString()));
    }
    if (params?.studentIds?.length) {
      params.studentIds.forEach(id => queryParams.append('studentIds', id.toString()));
    }

    const response = await api.get(`/analytics/universal-analytics?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching universal analytics:', error);
    throw error;
  }
};

// 🆕 Exam Volume API
export const getExamVolume = async (params?: ExamVolumeQuery): Promise<ExamVolumeResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.specificDate) {
      queryParams.append('specificDate', params.specificDate);
    }
    if (params?.startDate) {
      queryParams.append('startDate', params.startDate);
    }
    if (params?.endDate) {
      queryParams.append('endDate', params.endDate);
    }
    if (params?.examType && params.examType !== 'all') {
      queryParams.append('examType', params.examType);
    }
    if (params?.classIds?.length) {
      params.classIds.forEach(id => queryParams.append('classIds', id.toString()));
    }
    if (params?.subjectIds?.length) {
      params.subjectIds.forEach(id => queryParams.append('subjectIds', id.toString()));
    }
    if (params?.studentIds?.length) {
      params.studentIds.forEach(id => queryParams.append('studentIds', id.toString()));
    }
    if (params?.groupBy) {
      queryParams.append('groupBy', params.groupBy);
    }

    // Build URL with or without query parameters
    const queryString = queryParams.toString();
    const url = queryString ? `/analytics/exam-volume?${queryString}` : '/analytics/exam-volume';
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching exam volume:', error);
    throw error;
  }
};

export const getScoreStatistics = async (params?: ScoreStatisticsQuery): Promise<ScoreStatisticsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.specificDate) {
      queryParams.append('specificDate', params.specificDate);
    }
    if (params?.startDate) {
      queryParams.append('startDate', params.startDate);
    }
    if (params?.endDate) {
      queryParams.append('endDate', params.endDate);
    }
    if (params?.examType && params.examType !== 'all') {
      queryParams.append('examType', params.examType);
    }
    if (params?.classIds?.length) {
      params.classIds.forEach(id => queryParams.append('classIds', id.toString()));
    }
    if (params?.subjectIds?.length) {
      params.subjectIds.forEach(id => queryParams.append('subjectIds', id.toString()));
    }
    if (params?.studentIds?.length) {
      params.studentIds.forEach(id => queryParams.append('studentIds', id.toString()));
    }
    if (params?.groupBy) {
      queryParams.append('groupBy', params.groupBy);
    }

    // Build URL with or without query parameters
    const queryString = queryParams.toString();
    const url = queryString ? `/analytics/score-statistics?${queryString}` : '/analytics/score-statistics';
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching score statistics:', error);
    throw error;
  }
};

export const getTopStudents = async (params: TopStudentsQuery): Promise<TopStudentsResponseDto> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.classIds && params.classIds.length > 0) {
      params.classIds.forEach(id => queryParams.append('classIds', id.toString()));
    }
    
    if (params.subjectIds && params.subjectIds.length > 0) {
      params.subjectIds.forEach(id => queryParams.append('subjectIds', id.toString()));
    }
    
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    
    if (params.startDate) {
      queryParams.append('startDate', params.startDate);
    }
    
    if (params.endDate) {
      queryParams.append('endDate', params.endDate);
    }

    const response = await api.get(`/analytics/top-students?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching top students:', error);
    throw error;
  }
};

// Get failing students
export const getFailingStudents = async (query: FailingStudentsQuery): Promise<FailingStudentsResponse> => {
  try {
    const params = new URLSearchParams();
    
    if (query.classIds && query.classIds.length > 0) {
      query.classIds.forEach(id => params.append('classIds', id.toString()));
    }
    
    if (query.subjectIds && query.subjectIds.length > 0) {
      query.subjectIds.forEach(id => params.append('subjectIds', id.toString()));
    }
    
    if (query.specificDate) {
      params.append('specificDate', query.specificDate);
    }
    
    if (query.startDate) {
      params.append('startDate', query.startDate);
    }
    
    if (query.endDate) {
      params.append('endDate', query.endDate);
    }
    
    if (query.failureLevel) {
      params.append('failureLevel', query.failureLevel);
    }
    
    if (query.limit) {
      params.append('limit', query.limit.toString());
    }
    
    if (query.page) {
      params.append('page', query.page.toString());
    }
    
    if (query.sortByScore) {
      params.append('sortByScore', query.sortByScore);
    }
    
    const queryString = params.toString();
    const url = queryString ? `/analytics/failing-students?${queryString}` : '/analytics/failing-students';
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching failing students:', error);
    throw error;
  }
};

