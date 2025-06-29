import { SubjectResponseDto } from "@/features/subject/types/subject";
import { QuestionDto } from "@/features/question/types/question.type";

export interface StudentAnswer {
    questionId: number;
    selectedAnswerId: number | null;
    isMarked: boolean;
  }

export interface CreateExamDto {
    name: string;
    duration: number;
    examType: "practice" | "official";
    totalQuestions: number;
    maxScore: number;
    subjectId: number;
    questionIds?: number[];
}
  
export interface UpdateExamDto {
    name?: string;
    duration?: number;
    examType?: "practice" | "official";
    totalQuestions?: number;
    maxScore?: number;
    subjectId?: number;
    questionIds?: number[];
}

export interface ExamDto {
    id: number;
    name: string;
    duration: number;
    examType: "practice" | "official";
    totalQuestions: number;
    maxScore: number;
    subject: SubjectResponseDto;
    questionIds?: number[];
    createdAt: string;
    updatedAt: string;
}

export interface PracticeProgressDto {
    subjectName: string;
    totalPracticeExams: number;
    completedPracticeExams: number;
    progressPercentage: number;
}

export interface StudentPracticeProgressResponseDto {
    studentId: number;
    subjects: PracticeProgressDto[];
    overallProgress: {
        totalSubjects: number;
        totalPracticeExams: number;
        totalCompletedExams: number;
        overallPercentage: number;
    };
}

export interface StartExamDto {
  examId: number;
  studentId: number;
  assignmentId?: number;
}

export interface SaveStudentAnswerDto {
  studentExamId: number;
  questionId: number;
  answerId?: number | null;
  isMarked?: boolean;
}

export interface StudentAnswerResponseDto {
  studentExamId: number;
  questionId: number;
  answerId: number | null;
  answeredAt: Date | null;
  isMarked: boolean;
}

export interface StartExamResponseDto {
  studentExamId: number;
  examId: number;
  studentId: number;
  assignmentId: number;
  startedAt: Date | null;
  questions: QuestionDto[];
  existingAnswers: StudentAnswerResponseDto[];
}

export interface ExamState {
  studentExamId: number;
  examId: number;
  currentQuestionIndex: number;
  studentAnswers: StudentAnswer[];
  timeLeft: number;
  isStarted: boolean;
}

// 🔥 DTO cho bài thi đang làm dở
export interface InProgressExamDto {
  studentExamId: number;
  exam: ExamDto;
  startedAt: string;
  progress: {
    totalQuestions: number;
    answeredQuestions: number;
    progressPercentage: number;
  };
}

// 🔥 DTO cho bài thi chưa hoàn thành (legacy - có thể dùng cho các API khác)
export interface IncompleteExamResponseDto {
  examId: number;
  studentExamId: number;
  startedAt: string;
  exam?: ExamDto;
}

// 🔥 DTO cho bài thi đã hoàn thành
export interface CompletedExamDto {
  studentExamId: number;
  exam: ExamDto;
  result: {
    score: number;
    scorePercentage: number;
    startedAt: string;
    submittedAt: string;
    timeTaken: string;
  };
}

export interface CompletedPracticeExamsResponseDto {
  studentId: number;
  totalCompletedExams: number;
  completedExams: CompletedExamDto[];
}

export interface AllCompletedExamsResponseDto {
  studentId: number;
  totalCompletedExams: number;
  totalPracticeExams: number;
  totalOfficialExams: number;
  completedExams: CompletedExamDto[];
  practiceExams: CompletedExamDto[];
  officialExams: CompletedExamDto[];
}

// 🔥 DTO cho kết quả chi tiết bài thi
export interface ExamResultDto {
  studentExamId: number;
  exam: ExamDto;
  student: {
    id: number;
    name: string;
    email: string;
  };
  result: {
    score: number;
    scorePercentage: number;
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    unansweredQuestions: number;
    startedAt: string;
    submittedAt: string;
    timeTaken: string;
  };
  answers: {
    questionId: number;
    question: {
      id: number;
      questionText: string;
      answers: Array<{
        id: number;
        answerText: string;
        isCorrect: boolean;
      }>;
    };
    selectedAnswer: {
      id: number;
      answerText: string;
      isCorrect: boolean;
    } | null;
    correctAnswer: {
      id: number;
      answerText: string;
    };
    isCorrect: boolean;
    isMarked: boolean;
  }[];
}

export interface ExamResult {
  studentName: string;
  studentId: string;
  examName: string;
  score: number;
  maxScore: string;
  duration: string;
  actualDuration: string;
  startTime: string;
  submitTime: string;
  class: string;
  subject: string;
  type: 'practice' | 'official';
  studentExamId: number;
  examId: number;
  studentDbId: number;
  classId: number;
  subjectId: number;
}

export interface ExamResultFilters {
  classId?: number;
  subjectId?: number;
  examType?: 'practice' | 'official';
  specificDate?: string; // Format: YYYY-MM-DD
  startDate?: string; // Format: YYYY-MM-DD
  endDate?: string; // Format: YYYY-MM-DD
}

export interface ExamResultsResponse {
  results: ExamResult[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
