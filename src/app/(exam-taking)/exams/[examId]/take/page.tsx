'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  getExamById, 
  getQuestionsOfExam,
  startExam,
  saveStudentAnswer,
  submitStudentExam,
  checkRoomStatus
} from '@/features/exam/services/examServices';
import { 
  ExamDto,
  StartExamDto,
  SaveStudentAnswerDto
} from '@/features/exam/types/exam.type';
import { QuestionDto } from '@/features/question/types/question.type';
import { getStudentByEmail } from '@/features/student/services/studentService';
import { useAuthStore } from '@/features/auth/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  BookOpen, 
  ChevronLeft,
  ChevronRight,
  Flag,
  AlertTriangle,
  CheckCircle,
  Send,
  Play,
  Save
} from 'lucide-react';
import { toast } from '@/components/hooks/use-toast';
import { usePageTitle } from '@/hooks/usePageTitle';

interface StudentAnswer {
  questionId: number;
  selectedAnswerId: number | null;
  isMarked: boolean;
}

const AUTO_SAVE_INTERVAL = 10000;
const ROOM_STATUS_CHECK_INTERVAL = 10000;

const ExamTakingPage = () => {
  usePageTitle('Làm bài thi');
  const params = useParams();
  const router = useRouter();
  const examId = parseInt(params?.examId as string);
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasUnsavedChangesRef = useRef(false);

  // Get user from auth store
  const user = useAuthStore((state) => state.user);
  const userEmail = user?.email;

  const [exam, setExam] = useState<ExamDto | null>(null);
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [lastSaved, setLastSaved] = useState<number>(Date.now());
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [studentExamId, setStudentExamId] = useState<number | null>(null);
  const [isSavingAnswer, setIsSavingAnswer] = useState(false);
  const [realStudentId, setRealStudentId] = useState<number | null>(null);
  const [roomClosed, setRoomClosed] = useState(false);
  const roomStatusIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [assignmentId, setAssignmentId] = useState<number | null>(null);

  // Get real student ID from email
  useEffect(() => {
    const fetchStudentId = async () => {
      if (!userEmail) {
        console.error('❌ No user email found in auth store');
        toast({
          title: 'Lỗi xác thực',
          description: 'Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.',
          variant: 'error'
        });
        router.push('/login');
        return;
      }

      try {
        const studentData = await getStudentByEmail(userEmail);
        setRealStudentId(studentData.id);
      } catch (error) {
        console.error('❌ Error fetching student data:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể lấy thông tin sinh viên. Vui lòng thử lại.',
          variant: 'error'
        });
      }
    };

    fetchStudentId();
  }, []);

  // Save answer to database
  const saveAnswerToDatabase = useCallback(async (questionId: number, answerId: number | null, isMarked: boolean = false) => {
    if (!studentExamId) {
      console.warn('No studentExamId available for saving answer');
      return;
    }

    try {
      setIsSavingAnswer(true);
      
      const saveData: SaveStudentAnswerDto = {
        studentExamId,
        questionId,
        answerId: answerId,
        isMarked: isMarked
      };

      await saveStudentAnswer(saveData);
      
      // Update last saved time
      setLastSaved(Date.now());
      
    } catch (error) {
      console.error('❌ Error saving answer to database:', error);
      
      // Log more details about the error
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      
      toast({
        title: 'Lỗi lưu câu trả lời',
        description: 'Không thể lưu câu trả lời vào database.',
        variant: 'error'
      });
    } finally {
      setIsSavingAnswer(false);
    }
  }, [studentExamId]);

  // Auto-save answers to database in background
  const autoSaveAnswers = useCallback(() => {
    if (!studentExamId || !hasUnsavedChangesRef.current) return;

    const answersToSave = studentAnswers.filter(answer => 
      answer.selectedAnswerId !== null || answer.isMarked
    );
    
    if (answersToSave.length > 0) {
      // Save in background without blocking UI
      Promise.all(
        answersToSave.map(answer => 
          saveStudentAnswer({
            studentExamId,
            questionId: answer.questionId,
            answerId: answer.selectedAnswerId,
            isMarked: answer.isMarked
          }).catch(error => {
            console.warn('Background save failed for question', answer.questionId, error);
          })
        )
      ).then(() => {
        console.log('✅ Background save completed');
        setLastSaved(Date.now());
        hasUnsavedChangesRef.current = false;
        
        // Show brief save indicator
        setIsAutoSaving(true);
        setTimeout(() => setIsAutoSaving(false), 1000);
      }).catch(error => {
        console.warn('⚠️ Some background saves failed:', error);
      });
    }
  }, [studentExamId, studentAnswers]);

  // Start exam and get studentExamId
  const startExamSession = useCallback(async () => {
    try {
      if (!realStudentId) {
        throw new Error('Student ID not available. Please wait for authentication.');
      }
      
      const startData: StartExamDto = {
        examId,
        studentId: realStudentId
      };

      const response = await startExam(startData);
      setAssignmentId(response.assignmentId);
      
      if (!response) {
        throw new Error('No response from startExam API');
      }

      // Get studentExamId from response
      const studentExamIdFromResponse = response.studentExamId;
      
      if (!studentExamIdFromResponse) {
        throw new Error('studentExamId not found in API response');
      }
      
      setStudentExamId(studentExamIdFromResponse);

      // Calculate remaining time based on startedAt
      if (response.startedAt && exam) {
        const startedAtDate = new Date(response.startedAt);
        const currentTime = new Date();
        const elapsedTimeInSeconds = Math.floor((currentTime.getTime() - startedAtDate.getTime()) / 1000);
        const totalTimeInSeconds = exam.duration * 60;
        const remainingTime = Math.max(0, totalTimeInSeconds - elapsedTimeInSeconds);
        
        setTimeLeft(remainingTime);
        
        // Show resume message if this is a resumed exam
        if (elapsedTimeInSeconds > 60) { // If more than 1 minute has passed
          const elapsedMinutes = Math.floor(elapsedTimeInSeconds / 60);
          const remainingMinutes = Math.floor(remainingTime / 60);
          
          toast({
            title: '🔄 Tiếp tục bài thi',
            description: `Đã làm bài ${elapsedMinutes} phút. Còn lại ${remainingMinutes} phút.`,
          });
        }
        
        // Auto-submit if time has run out
        if (remainingTime <= 0) {
          toast({
            title: '⏰ Hết thời gian!',
            description: 'Bài thi đã hết thời gian và sẽ được nộp tự động.',
            variant: 'error'
          });
          
          // Set a flag to auto-submit after component is ready
          setTimeout(async () => {
            try {
              await submitStudentExam(studentExamIdFromResponse);
              toast({
                title: 'Nộp bài thành công!',
                description: 'Bài thi đã được nộp tự động do hết thời gian.',
              });
              router.push('/exams');
            } catch (error) {
              console.error('❌ Auto-submit failed:', error);
              toast({
                title: 'Lỗi nộp bài tự động',
                description: 'Vui lòng nộp bài thủ công.',
                variant: 'error'
              });
            }
          }, 2000);
          
          return studentExamIdFromResponse;
        }
      } else {
        setTimeLeft(exam?.duration ? exam.duration * 60 : 0);
      }

      // Load existing answers if any
      const existingAnswers = response.existingAnswers || [];
      
      if (existingAnswers && existingAnswers.length > 0) {
        const formattedAnswers = questions.map((q: QuestionDto) => {
          const existingAnswer = existingAnswers.find((a: { questionId: number; answerId: number | null; isMarked: boolean }) => a.questionId === q.id);
          return {
            questionId: q.id,
            selectedAnswerId: existingAnswer?.answerId || null,
            isMarked: existingAnswer?.isMarked || false
          };
        });
        setStudentAnswers(formattedAnswers);
        
      } else {
        console.log('📝 No existing answers found, using initial empty answers');
      }

      return studentExamIdFromResponse;
    } catch (error) {
      toast({
        title: 'Lỗi bắt đầu bài thi',
        description: `Không thể bắt đầu bài thi. Chi tiết: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'error'
      });
      throw error;
    }
  }, [examId, questions, realStudentId]);

  // Fetch exam and questions data
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setIsLoading(true);
        const [examData, questionsData] = await Promise.all([
          getExamById(examId),
          getQuestionsOfExam(examId)
        ]);

        setExam(examData);
        setQuestions(questionsData);

        // Initialize fresh exam (time will be calculated in startExamSession)
        setTimeLeft(examData.duration * 60);
        const initialAnswers: StudentAnswer[] = questionsData.map((question: QuestionDto) => ({
          questionId: question.id,
          selectedAnswerId: null,
          isMarked: false
        }));
        setStudentAnswers(initialAnswers);

      } catch (error) {
        console.error('Error fetching exam data:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải dữ liệu bài thi. Vui lòng thử lại.',
          variant: 'error'
        });
        router.push('/exams');
      } finally {
        setIsLoading(false);
      }
    };

    if (examId) {
      fetchExamData();
    }
  }, [examId, router]);

  // Auto-save interval - only when exam is started
  useEffect(() => {
    if (examStarted) {
      autoSaveIntervalRef.current = setInterval(() => {
        autoSaveAnswers();
      }, AUTO_SAVE_INTERVAL);

      return () => {
        if (autoSaveIntervalRef.current) {
          clearInterval(autoSaveIntervalRef.current);
        }
      };
    }
  }, [examStarted, autoSaveAnswers]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (examStarted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          
          // Only mark as unsaved every 30 seconds for timer updates
          if (newTime % 30 === 0) {
            hasUnsavedChangesRef.current = true;
          }
          
          // Warning at 10 minutes (600 seconds)
          if (newTime === 600) {
            toast({
              title: '⚠️ Cảnh báo thời gian!',
              description: 'Chỉ còn 10 phút để hoàn thành bài thi. Hãy kiểm tra lại các câu trả lời.',
              variant: 'error'
            });
          }
          
          // Warning at 5 minutes (300 seconds)
          if (newTime === 300) {
            toast({
              title: '🚨 Cảnh báo nghiêm trọng!',
              description: 'Chỉ còn 5 phút! Hãy nhanh chóng hoàn thành bài thi.',
              variant: 'error'
            });
          }
          
          // Warning at 1 minute (60 seconds)
          if (newTime === 60) {
            toast({
              title: '🔥 1 phút cuối cùng!',
              description: 'Bài thi sẽ tự động nộp khi hết thời gian.',
              variant: 'error'
            });
          }
          
          if (newTime <= 0) {
            // Auto submit when time runs out
            setTimeout(() => {
              toast({
                title: 'Hết thời gian!',
                description: 'Bài thi sẽ được nộp tự động.',
                variant: 'error'
              });
               handleSubmitExam();
            }, 100);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [examStarted, timeLeft]);

  // Enhanced timer display with 10-minute warning
  const getTimerStyle = () => {
    if (timeLeft < 300) { // Under 5 minutes - critical (red with pulse)
      return {
        container: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
        icon: 'bg-red-100 dark:bg-red-800/30 text-red-600 dark:text-red-400',
        text: 'text-red-600 dark:text-red-400',
        progress: 'bg-red-200 dark:bg-red-800',
        progressBar: 'bg-red-500 dark:bg-red-400',
        showPulse: true
      };
    } else if (timeLeft < 600) { // Under 10 minutes - warning (red)
      return {
        container: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
        icon: 'bg-red-100 dark:bg-red-800/30 text-red-600 dark:text-red-400',
        text: 'text-red-600 dark:text-red-400',
        progress: 'bg-red-200 dark:bg-red-800',
        progressBar: 'bg-red-500 dark:bg-red-400',
        showPulse: false
      };
    } else if (timeLeft < 900) { // Under 15 minutes - caution (yellow)
      return {
        container: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
        icon: 'bg-yellow-100 dark:bg-yellow-800/30 text-yellow-600 dark:text-yellow-400',
        text: 'text-yellow-600 dark:text-yellow-400',
        progress: 'bg-yellow-200 dark:bg-yellow-800',
        progressBar: 'bg-yellow-500 dark:bg-yellow-400',
        showPulse: false
      };
    } else { // Normal time (blue)
      return {
        container: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
        icon: 'bg-blue-100 dark:bg-blue-800/30 text-blue-600 dark:text-blue-400',
        text: 'text-blue-600 dark:text-blue-400',
        progress: 'bg-blue-200 dark:bg-blue-800',
        progressBar: 'bg-blue-500 dark:bg-blue-400',
        showPulse: false
      };
    }
  };

  // Prevent page unload without warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (examStarted) {
        e.preventDefault();
        e.returnValue = 'Bạn đang trong quá trình làm bài thi. Nếu rời khỏi trang, bạn có thể mất dữ liệu chưa lưu.';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [examStarted]);

  const handleStartExam = async () => {
    if (!realStudentId) {
      toast({
        title: 'Đang tải thông tin',
        description: 'Vui lòng chờ hệ thống tải thông tin sinh viên...',
        variant: 'error'
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Start exam session and get studentExamId
      const newStudentExamId = await startExamSession();
      
      if (!newStudentExamId) {
        throw new Error('Failed to get studentExamId from API');
      }
      
      setExamStarted(true);
      hasUnsavedChangesRef.current = true;
      
      // Don't show start message if this is a resumed exam (time calculation handles this)
      const isResumedExam = timeLeft < (exam?.duration || 0) * 60;
      if (!isResumedExam) {
        toast({
          title: 'Bài thi đã bắt đầu!',
          description: `Bạn có ${exam?.duration} phút để hoàn thành bài thi.`,
        });
      }
      
    } catch (error) {
      console.error('❌ Error in handleStartExam:', error);
      toast({
        title: 'Lỗi bắt đầu bài thi',
        description: 'Không thể bắt đầu bài thi. Vui lòng thử lại.',
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = async (answerId: number) => {
    try {
      const questionId = questions[currentQuestionIndex].id;
      
      // Update local state immediately for better UX
      setStudentAnswers(prev => {
        const updated = prev.map(answer => 
          answer.questionId === questionId
            ? { ...answer, selectedAnswerId: answerId }
            : answer
        );
        return updated;
      });
      
      hasUnsavedChangesRef.current = true;
      
      // Save to database
      const currentAnswer = studentAnswers.find(a => a.questionId === questionId);
      
      await saveAnswerToDatabase(questionId, answerId, currentAnswer?.isMarked || false);
    } catch (error) {
      console.error('❌ Error in handleAnswerSelect:', error);
      toast({
        title: 'Lỗi lưu câu trả lời',
        description: 'Đã xảy ra lỗi khi lưu câu trả lời. Vui lòng thử lại hoặc nhấn nút "Lưu" để lưu thủ công.',
        variant: 'error'
      });
    }
  };

  const handleMarkQuestion = async () => {
    try {
      const questionId = questions[currentQuestionIndex].id;
      const currentAnswer = studentAnswers.find(a => a.questionId === questionId);
      const newMarkedState = !currentAnswer?.isMarked;
      
      
      // Update local state immediately
      setStudentAnswers(prev => 
        prev.map(answer => 
          answer.questionId === questionId
            ? { ...answer, isMarked: newMarkedState }
            : answer
        )
      );
      
      hasUnsavedChangesRef.current = true;
      
      // Save to database
      await saveAnswerToDatabase(questionId, currentAnswer?.selectedAnswerId || null, newMarkedState);
    } catch (error) {
      console.error('❌ Error in handleMarkQuestion:', error);
      toast({
        title: 'Lỗi đánh dấu câu hỏi',
        description: 'Đã xảy ra lỗi khi đánh dấu câu hỏi. Vui lòng thử lại.',
        variant: 'error'
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      hasUnsavedChangesRef.current = true;
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      hasUnsavedChangesRef.current = true;
    }
  };

  const handleManualSave = async () => {
    if (!studentExamId) {
      toast({
        title: 'Lỗi',
        description: 'Chưa có thông tin bài thi để lưu.',
        variant: 'error'
      });
      return;
    }

    try {
      setIsAutoSaving(true);
      
      // Save all current answers to database
      const savePromises = studentAnswers.map(async (answer) => {
        if (answer.selectedAnswerId !== null || answer.isMarked) {
          return saveStudentAnswer({
            studentExamId,
            questionId: answer.questionId,
            answerId: answer.selectedAnswerId,
            isMarked: answer.isMarked
          });
        }
        return Promise.resolve();
      });

      await Promise.all(savePromises);
      
      toast({
        title: "✅ Đã lưu thành công",
        description: `Đã lưu ${studentAnswers.filter(a => a.selectedAnswerId !== null).length} câu trả lời vào hệ thống.`,
      });
      
    } catch (error) {
      console.error('❌ Error in manual save:', error);
      
      toast({
        title: "❌ Lỗi lưu dữ liệu",
        description: "Không thể lưu vào hệ thống. Vui lòng thử lại.",
        variant: "error"
      });
    } finally {
      setIsAutoSaving(false);
    }
  };

  // Check if room is still open
  const checkIfRoomIsOpen = useCallback(async () => {
    try {
      if (!assignmentId) return;
      
      const status = await checkRoomStatus(assignmentId);
      
      // Chỉ xử lý khi status có giá trị và là 'closed'
      if (status === 'closed') {
        setRoomClosed(true);
        
        // Ngừng đếm ngược thời gian bằng cách đặt timeLeft = 0
        setTimeLeft(0);
        
        toast({
          title: '⚠️ Phòng thi đã đóng!',
          description: 'Phòng thi đã được đóng, bài thi sẽ được nộp ngay lập tức.',
          variant: 'error'
        });
        
        // Auto submit when room is closed
        if (studentExamId) {
          try {
            await submitStudentExam(studentExamId);
            toast({
              title: 'Nộp bài thành công!',
              description: 'Bài thi đã được nộp tự động do phòng thi đã đóng.',
            });
            router.push('/exams');
          } catch (error) {
            console.error('❌ Auto-submit failed:', error);
            toast({
              title: 'Lỗi nộp bài tự động',
              description: 'Vui lòng nộp bài thủ công.',
              variant: 'error'
            });
          }
        }
      }
    } catch (error) {
      console.error('❌ Error checking room status:', error);
    }
  }, [examId, studentExamId, router]);

  // Set up periodic room status check
  useEffect(() => {
    if (examStarted && studentExamId) {
      // Check immediately on start
      checkIfRoomIsOpen();
      
      // Set up interval for periodic checks
      roomStatusIntervalRef.current = setInterval(() => {
        checkIfRoomIsOpen();
      }, ROOM_STATUS_CHECK_INTERVAL);
      
      return () => {
        if (roomStatusIntervalRef.current) {
          clearInterval(roomStatusIntervalRef.current);
        }
      };
    }
  }, [examStarted, studentExamId, checkIfRoomIsOpen]);

  // Thêm kiểm tra trạng thái phòng khi có thay đổi examId
  useEffect(() => {
    if (examId && examStarted && studentExamId) {
      checkIfRoomIsOpen();
    }
  }, [examId, examStarted, studentExamId, checkIfRoomIsOpen]);

  const handleSubmitExam = async () => {
    if (!studentExamId) return;
    
    setIsSubmitting(true);
    
    try {
      await submitStudentExam(studentExamId);
      toast({
        title: 'Nộp bài thành công!',
        description: roomClosed 
          ? 'Bài thi đã được nộp do phòng thi đã đóng.'
          : 'Bài thi của bạn đã được nộp thành công.',
      });
      router.push('/results/history');
    } catch (error) {
      console.error('❌ Error submitting exam:', error);
      toast({
        title: 'Lỗi nộp bài',
        description: 'Không thể nộp bài thi. Vui lòng thử lại.',
        variant: 'error'
      });
      setIsSubmitting(false);
    }
  };

  const formatTimeLeft = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnsweredCount = () => {
    return studentAnswers.filter(answer => answer.selectedAnswerId !== null).length;
  };

  const getMarkedCount = () => {
    return studentAnswers.filter(answer => answer.isMarked).length;
  };

  const getCurrentAnswer = () => {
    return studentAnswers.find(answer => answer.questionId === questions[currentQuestionIndex]?.id);
  };

  const formatLastSaved = () => {
    const now = Date.now();
    const diff = Math.floor((now - lastSaved) / 1000);
    
    if (diff < 60) return `${diff} giây trước`;
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    return `${Math.floor(diff / 3600)} giờ trước`;
  };

  const handleShowSubmitModal = () => {
    setShowConfirmSubmit(true);
  };

  const handleCancelSubmit = () => {
    setShowConfirmSubmit(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Đang tải dữ liệu bài thi...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!exam || !questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Không tìm thấy bài thi</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Bài thi không tồn tại hoặc đã bị xóa.
            </p>
            <Button onClick={() => router.push('/exams')}>
              Quay lại danh sách bài thi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = getCurrentAnswer();

  // Pre-exam screen
  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl mx-auto border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          <CardHeader className="text-center border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <BookOpen className="w-6 h-6" />
              {exam.name}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Exam Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Thời gian làm bài</p>
                      <p className="font-semibold">{exam.duration} phút</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Số câu hỏi</p>
                      <p className="font-semibold">{questions.length} câu</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Môn học</p>
                      <p className="font-semibold">{exam.subject.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <Flag className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Điểm tối đa</p>
                      <p className="font-semibold">{exam.maxScore} điểm</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Lưu ý quan trọng
                </h3>
                <ul className="space-y-2 text-sm text-amber-700 dark:text-amber-300">
                  <li>• Đọc kỹ câu hỏi trước khi chọn đáp án</li>
                  <li>• Có thể đánh dấu câu hỏi để xem lại sau</li>
                  <li>• Bài thi sẽ tự động nộp khi hết thời gian</li>
                  <li>• Câu trả lời sẽ được lưu tự động vào hệ thống</li>
                  <li>• Nếu đã bắt đầu làm bài trước đó, thời gian sẽ được tính tiếp tục</li>
                </ul>
              </div>

              {/* Start Button */}
              <div className="text-center pt-4">
                <Button 
                  onClick={() => {
                    handleStartExam();
                  }}
                  size="lg"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  disabled={isLoading || !realStudentId}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Đang khởi tạo...
                    </>
                  ) : !realStudentId ? (
                    <>
                      <div className="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Đang tải thông tin...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Bắt đầu làm bài
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main exam interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {exam.name}
              </h1>
              
              {/* Enhanced Timer */}
              <div className={`
                flex items-center gap-3 px-4 py-2 rounded-xl border-2 transition-all duration-300
                ${getTimerStyle().container}
              `}>
                <div className={`
                  relative flex items-center justify-center w-8 h-8 rounded-full
                  ${getTimerStyle().icon}
                `}>
                  <Clock className={`
                    w-4 h-4 
                    ${getTimerStyle().text}
                  `} />
                  
                  {/* Pulse animation for critical time */}
                  {getTimerStyle().showPulse && (
                    <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-20"></div>
                  )}
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Thời gian còn lại
                  </span>
                  <span className={`
                    text-lg font-bold font-mono tracking-wider
                    ${getTimerStyle().text}
                  `}>
                    {formatTimeLeft(timeLeft)}
                  </span>
                </div>
                
                {/* Progress indicator */}
                <div className="flex flex-col items-center gap-1">
                  <div className={`
                    w-2 h-12 rounded-full overflow-hidden
                    ${getTimerStyle().progress}
                  `}>
                    <div 
                      className={`
                        w-full transition-all duration-1000 ease-linear
                        ${getTimerStyle().progressBar}
                      `}
                      style={{ 
                        height: `${Math.max(0, (timeLeft / (exam.duration * 60)) * 100)}%`,
                        transformOrigin: 'bottom'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 justify-end">
                <Button
                onClick={handleShowSubmitModal}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 gap-2 cursor-pointer"
                >
                <Send className="w-4 h-4" />
                Nộp bài
                </Button>
                
                {/* Manual Save Button */}
                <Button
                  onClick={handleManualSave}
                  variant="outline"
                  className="gap-2 cursor-pointer"
                  disabled={isAutoSaving || !studentExamId}
                >
                  {isAutoSaving ? (
                    <>
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Lưu vào hệ thống
                    </>
                  )}
                </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 h-[calc(100%-88px)]">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
          {/* Left Panel - Exam Info & Instructions */}
          <div className="lg:col-span-1">
            <div className="space-y-4 h-full">
              {/* Exam Information */}
              <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                <CardHeader className="border-b">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Thông tin đề thi
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Môn học:</span>
                      <span className="text-sm font-medium">{exam.subject.name}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Thời gian:</span>
                      <span className="text-sm font-medium">{exam.duration} phút</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Số câu hỏi:</span>
                      <span className="text-sm font-medium">{exam.totalQuestions} câu</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Điểm tối đa:</span>
                      <span className="text-sm font-medium">{exam.maxScore} điểm</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{getAnsweredCount()}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Đã trả lời</div>
                      </div>
                      <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div className="text-lg font-bold text-yellow-600">{getMarkedCount()}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Đánh dấu</div>
                      </div>
                    </div>
                    
                    {/* Last Saved Info */}
                    {examStarted && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>Lưu lần cuối:</span>
                          <span className="font-medium">{formatLastSaved()}</span>
                        </div>
                        {isAutoSaving && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-blue-600 dark:text-blue-400">
                            <div className="w-3 h-3 animate-spin rounded-full border border-blue-600 border-t-transparent"></div>
                            <span>Đang lưu tự động...</span>
                          </div>
                        )}
                        
                        {/* Data Persistence Info */}
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-xs text-blue-700 dark:text-blue-300">
                            <div className="font-medium mb-1">💾 Dữ liệu được lưu:</div>
                            <ul className="space-y-1 text-xs">
                              <li>• <strong>Hệ thống:</strong> Vĩnh viễn</li>
                              <li>• <strong>Tự động:</strong> Mỗi 10 giây</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex-1">
                <CardHeader className="border-b">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Lưu ý làm bài
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-4">
                  <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Đọc kỹ câu hỏi trước khi chọn đáp án</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Có thể đánh dấu câu hỏi để xem lại sau</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Bài thi sẽ tự động nộp khi hết thời gian</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Câu trả lời được lưu tự động vào hệ thống</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Center Panel - Question Content */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm h-full">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Câu {currentQuestionIndex + 1}/{questions.length}
                  </CardTitle>
                  
                  {/* Mark Question Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkQuestion}
                    className={`gap-2 ${
                      currentAnswer?.isMarked
                        ? 'bg-yellow-100 border-yellow-300 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-600 dark:text-yellow-400'
                        : 'hover:bg-yellow-50 hover:border-yellow-300 dark:hover:bg-yellow-900/20'
                    }`}
                  >
                    <Flag className="w-4 h-4" />
                    {currentAnswer?.isMarked ? 'Bỏ đánh dấu' : 'Đánh dấu'}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 flex-1 flex flex-col">
                {/* Question Text */}
                <div className="mb-6">
                  <p className="text-lg leading-relaxed text-gray-900 dark:text-white">
                    {currentQuestion.questionText}
                  </p>
                </div>

                {/* Answer Options */}
                <div className="space-y-3 flex-1">
                  {currentQuestion.answers.map((answer, index) => (
                    <div
                      key={answer.id}
                      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        currentAnswer?.selectedAnswerId === answer.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      } ${isSavingAnswer ? 'opacity-50 pointer-events-none' : ''}`}
                      onClick={() => handleAnswerSelect(answer.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                          currentAnswer?.selectedAnswerId === answer.id
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="flex-1 text-gray-900 dark:text-white leading-relaxed">
                          {answer.answerText}
                        </span>
                        
                        {/* Saving indicator */}
                        {isSavingAnswer && currentAnswer?.selectedAnswerId === answer.id && (
                          <div className="absolute right-2 top-2">
                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className='cursor-pointer'
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Câu trước
                  </Button>
                  
                  <Button
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className='cursor-pointer'
                  >
                    Câu tiếp
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Question Navigation */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm h-full">
              <CardHeader className="border-b">
                <CardTitle className="text-base">Điều hướng câu hỏi</CardTitle>
              </CardHeader>
              
              <CardContent className="p-4">
                {/* Question Grid */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {questions.map((_, index) => {
                    const answer = studentAnswers[index];
                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentQuestionIndex(index)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentQuestionIndex === index
                            ? 'bg-blue-600 text-white shadow-lg'
                            : answer?.selectedAnswerId
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : answer?.isMarked
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <span>Câu hiện tại</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 border border-green-300 rounded"></div>
                    <span>Đã trả lời</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 rounded"></div>
                    <span>Đánh dấu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded"></div>
                    <span>Chưa làm</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Enhanced Confirm Submit Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-lg mx-4">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2 text-xl cursor-pointer">
                <Send className="w-6 h-6 text-green-600" />
                <span>Xác nhận nộp bài thi</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Warning Message */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                        Lưu ý quan trọng
                      </h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        Sau khi nộp bài, bạn không thể thay đổi câu trả lời. Hãy kiểm tra kỹ trước khi xác nhận.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Exam Summary */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Tóm tắt bài thi
                  </h4>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Tên bài thi:</span>
                          <span className="font-medium text-right">{exam.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Môn học:</span>
                          <span className="font-medium">{exam.subject.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Tổng số câu:</span>
                          <span className="font-medium">{questions.length} câu</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Đã trả lời:</span>
                          <span className={`font-medium ${getAnsweredCount() === questions.length ? 'text-green-600' : 'text-orange-600'}`}>
                            {getAnsweredCount()}/{questions.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Đã đánh dấu:</span>
                          <span className="font-medium text-yellow-600">{getMarkedCount()} câu</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Thời gian còn lại:</span>
                          <span className={`font-medium ${timeLeft < 300 ? 'text-red-600' : timeLeft < 600 ? 'text-orange-600' : 'text-green-600'}`}>
                            {formatTimeLeft(timeLeft)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tiến độ hoàn thành</span>
                    <span className="font-medium">
                      {Math.round((getAnsweredCount() / questions.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        getAnsweredCount() === questions.length 
                          ? 'bg-green-500' 
                          : 'bg-orange-500'
                      }`}
                      style={{ width: `${(getAnsweredCount() / questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Unanswered Questions Warning */}
                {getAnsweredCount() < questions.length && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-red-800 dark:text-red-200 mb-1">
                          Còn {questions.length - getAnsweredCount()} câu chưa trả lời
                        </h4>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          Các câu chưa trả lời sẽ không được tính điểm. Bạn có muốn xem lại không?
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={handleCancelSubmit}
                    className="flex-1 cursor-pointer"
                    disabled={isSubmitting}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Quay lại làm bài
                  </Button>
                  <Button
                    onClick={handleSubmitExam}
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Đang nộp bài...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Xác nhận nộp bài
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ExamTakingPage;