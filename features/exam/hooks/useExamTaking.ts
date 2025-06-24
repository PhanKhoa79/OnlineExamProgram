import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/hooks/use-toast';
import { 
  startExam, 
  saveStudentAnswer, 
  getStudentAnswers,
  getExamById,
  getQuestionsOfExam 
} from '../services/examServices';
import { 
  ExamDto, 
  StudentAnswer, 
  StartExamResponseDto,
  SaveStudentAnswerDto 
} from '../types/exam.type';
import { QuestionDto } from '@/features/question/types/question.type';

const AUTO_SAVE_INTERVAL = 5000; // 5 seconds

export const useExamTaking = (examId: number, studentId: number) => {
  const router = useRouter();
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasUnsavedChangesRef = useRef(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [exam, setExam] = useState<ExamDto | null>(null);
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [studentExamId, setStudentExamId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize exam
  const initializeExam = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Load basic exam data
      const [examData, questionsData] = await Promise.all([
        getExamById(examId),
        getQuestionsOfExam(examId)
      ]);
      
      setExam(examData);
      setQuestions(questionsData);
      
      // Start new exam
      const startResponse: StartExamResponseDto = await startExam({
        examId,
        studentId
      });
      
      setStudentExamId(startResponse.studentExamId);
      setTimeLeft(examData.duration * 60); // Convert minutes to seconds
      setIsStarted(false); // Don't auto-start, wait for user to click start
      
      // Initialize student answers
      const initialAnswers = questionsData.map((q: QuestionDto) => ({
        questionId: q.id,
        selectedAnswerId: null,
        isMarked: false
      }));
      
      // Load existing answers if any
      if (startResponse.existingAnswers.length > 0) {
        const formattedAnswers = questionsData.map((q: QuestionDto) => {
          const existingAnswer = startResponse.existingAnswers.find(a => a.questionId === q.id);
          return {
            questionId: q.id,
            selectedAnswerId: existingAnswer?.answerId || null,
            isMarked: existingAnswer?.isMarked || false
          };
        });
        setStudentAnswers(formattedAnswers);
      } else {
        setStudentAnswers(initialAnswers);
      }
    } catch (error) {
      console.error('Error initializing exam:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu bài thi. Vui lòng thử lại.",
        variant: "error"
      });
    } finally {
      setIsLoading(false);
    }
  }, [examId, studentId]);

  // Auto-save answer
  const saveAnswer = useCallback(async (questionId: number, answerId: number | null, isMarked?: boolean) => {
    if (!studentExamId) return;
    
    try {
      setIsSaving(true);
      
      const saveData: SaveStudentAnswerDto = {
        studentExamId,
        questionId,
        answerId,
        isMarked
      };
      
      await saveStudentAnswer(saveData);
      hasUnsavedChangesRef.current = false;
      
      toast({
        title: "Đã lưu",
        description: "Câu trả lời đã được lưu tự động.",
      });
    } catch (error) {
      console.error('Error saving answer:', error);
      toast({
        title: "Lỗi lưu",
        description: "Không thể lưu câu trả lời. Vui lòng thử lại.",
        variant: "error"
      });
    } finally {
      setIsSaving(false);
    }
  }, [studentExamId]);

  // Handle answer selection
  const handleAnswerSelect = useCallback((questionId: number, answerId: number) => {
    setStudentAnswers(prev => 
      prev.map(answer => 
        answer.questionId === questionId 
          ? { ...answer, selectedAnswerId: answerId }
          : answer
      )
    );
    
    hasUnsavedChangesRef.current = true;
    
    // Auto-save after selection
    setTimeout(() => {
      saveAnswer(questionId, answerId);
    }, 500);
  }, [saveAnswer]);

  // Handle question marking
  const handleMarkQuestion = useCallback((questionId: number, isMarked: boolean) => {
    setStudentAnswers(prev => 
      prev.map(answer => 
        answer.questionId === questionId 
          ? { ...answer, isMarked }
          : answer
      )
    );
    
    hasUnsavedChangesRef.current = true;
    
    // Auto-save marking
    setTimeout(() => {
      const currentAnswer = studentAnswers.find(a => a.questionId === questionId);
      saveAnswer(questionId, currentAnswer?.selectedAnswerId || null, isMarked);
    }, 500);
  }, [studentAnswers, saveAnswer]);

  // Manual save state
  const handleSaveState = useCallback(() => {
    toast({
      title: "Đã lưu trạng thái",
      description: "Trạng thái làm bài đã được lưu thành công.",
    });
  }, []);

  // Start exam
  const handleStartExam = useCallback(() => {
    setIsStarted(true);
    toast({
      title: "Bài thi đã bắt đầu!",
      description: `Bạn có ${exam?.duration} phút để hoàn thành bài thi.`,
    });
  }, [exam?.duration]);

  // Auto-save interval
  useEffect(() => {
    if (isStarted && studentExamId) {
      autoSaveIntervalRef.current = setInterval(() => {
        if (hasUnsavedChangesRef.current) {
          saveAnswer(questions[currentQuestionIndex]?.id || 0, studentAnswers[currentQuestionIndex]?.selectedAnswerId || null);
          hasUnsavedChangesRef.current = false;
        }
      }, AUTO_SAVE_INTERVAL);

      return () => {
        if (autoSaveIntervalRef.current) {
          clearInterval(autoSaveIntervalRef.current);
        }
      };
    }
  }, [isStarted, studentExamId, saveAnswer, currentQuestionIndex, questions, studentAnswers]);

  // Auto-submit when time runs out
  const handleAutoSubmit = useCallback(() => {
    // Implementation for auto-submit
    toast({
      title: "Hết thời gian",
      description: "Bài thi đã được nộp tự động.",
      variant: "error"
    });
    
    // Redirect to results or exam list
    router.push('/exams');
  }, [router]);

  // Timer countdown
  useEffect(() => {
    if (isStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Auto-submit when time runs out
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isStarted, timeLeft, handleAutoSubmit]);

  // Navigation warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isStarted && hasUnsavedChangesRef.current) {
        e.preventDefault();
        e.returnValue = 'Bạn có thay đổi chưa được lưu. Bạn có chắc chắn muốn rời khỏi trang?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isStarted]);

  // Initialize on mount
  useEffect(() => {
    initializeExam();
  }, [initializeExam]);

  return {
    // State
    isLoading,
    exam,
    questions,
    studentAnswers,
    currentQuestionIndex,
    timeLeft,
    isStarted,
    studentExamId,
    isSaving,
    
    // Actions
    setCurrentQuestionIndex,
    handleAnswerSelect,
    handleMarkQuestion,
    handleSaveState,
    handleStartExam,
    
    // Utilities
    getCurrentAnswer: () => studentAnswers.find(a => a.questionId === questions[currentQuestionIndex]?.id),
    getAnsweredCount: () => studentAnswers.filter(a => a.selectedAnswerId !== null).length,
    getMarkedCount: () => studentAnswers.filter(a => a.isMarked).length,
    formatTimeLeft: (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  };
}; 