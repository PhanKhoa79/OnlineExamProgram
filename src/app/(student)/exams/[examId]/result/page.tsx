'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getStudentExamResult } from '@/features/exam/services/examServices';
import { getStudentByEmail } from '@/features/student/services/studentService';
import { useAuthStore } from '@/features/auth/store';
import { ExamResultDto } from '@/features/exam/types/exam.type';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft,
  BookOpen, 
  Trophy, 
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  Flag,
  Calendar,
  Timer
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const ExamResultPage = () => {
  const params = useParams();
  const router = useRouter();
  const examId = parseInt(params?.examId as string);
  
  // Get user from auth store
  const user = useAuthStore((state) => state.user);
  const userEmail = user?.email;
  
  const [result, setResult] = useState<ExamResultDto | null>(null);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get student ID from email
  useEffect(() => {
    const fetchStudentId = async () => {
      if (!userEmail) {
        setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
        return;
      }
      
      try {
        const studentData = await getStudentByEmail(userEmail);
        setStudentId(studentData.id);
      } catch (error) {
        setError('Không thể lấy thông tin sinh viên. Vui lòng thử lại.');
      }
    };

    fetchStudentId();
  }, [userEmail]);

  // Fetch exam result
  useEffect(() => {
    const fetchResult = async () => {
      if (!studentId || !examId) {
        console.log('Missing required data:', { studentId, examId });
        return;
      }
      
      try {
        console.log('Fetching exam result for:', { examId, studentId });
        setLoading(true);
        setError(null);
        
        const resultData = await getStudentExamResult(examId, studentId);
        setResult(resultData);
      } catch (err: unknown) {
        
        // Check if it's a 404 or specific error about exam not completed
        const error = err as { response?: { status?: number }; message?: string };
        if (error?.response?.status === 404) {
          setError('Không tìm thấy kết quả bài thi. Có thể bạn chưa hoàn thành bài thi này hoặc bài thi chưa được nộp.');
        } else if (error?.response?.status === 400) {
          setError('Bài thi chưa được hoàn thành hoặc chưa được nộp. Vui lòng hoàn thành bài thi trước khi xem kết quả.');
        } else {
          setError(`Không thể tải kết quả bài thi. Lỗi: ${error?.message || 'Không xác định'}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [examId, studentId]);

  const formatDateTime = (dateString: string) => {
    try {
      if (!dateString) return 'Không xác định';
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Không xác định';
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    if (percentage >= 60) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  };

  const getAnswerIcon = (isCorrect: boolean) => {
    if (isCorrect) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getAnswerBg = (isCorrect: boolean, isSelected: boolean, isCorrectAnswer: boolean) => {
    if (isSelected && isCorrect) {
      return 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-900 dark:text-green-100';
    } else if (isSelected && !isCorrect) {
      return 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-900 dark:text-red-100';
    } else if (isCorrectAnswer) {
      return 'bg-green-50 dark:bg-green-900/20 border-green-300 text-green-800 dark:text-green-200';
    }
    return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Đang tải kết quả bài thi...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Không thể tải kết quả</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error || 'Đã xảy ra lỗi khi tải kết quả bài thi.'}
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => window.location.reload()}>
                Thử lại
              </Button>
              <Button onClick={() => router.push('/exams/practice')}>
                Quay lại danh sách bài thi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Add additional validation for the result structure
  if (!result.exam || !result.result) {
    console.log('Data validation failed:');
    console.log('result.exam:', result.exam);
    console.log('result.result:', result.result);
    console.log('Full result object:', result);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Dữ liệu không hợp lệ</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Dữ liệu kết quả bài thi không đầy đủ. Vui lòng thử lại sau.
            </p>
            <div className="text-xs text-gray-500 mb-4">
              <p>Debug info:</p>
              <p>Exam: {result.exam ? 'Có' : 'Không có'}</p>
              <p>Result: {result.result ? 'Có' : 'Không có'}</p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => window.location.reload()}>
                Thử lại
              </Button>
              <Button onClick={() => router.push('/exams/practice')}>
                Quay lại danh sách bài thi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/exams/practice')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
            
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Kết quả bài thi: {result.exam?.name || 'Không xác định'}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Môn: {result.exam?.subject?.name || 'Không xác định'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Score Card */}
          <Card className={cn("border-2", getScoreBgColor(result.result?.scorePercentage || 0))}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Điểm số
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className={cn("text-3xl font-bold", getScoreColor(result.result?.scorePercentage || 0))}>
                  {result.result?.score || 0}/{result.exam?.maxScore || 0}
                </div>
                <div className={cn("text-lg font-semibold", getScoreColor(result.result?.scorePercentage || 0))}>
                  {result.result?.scorePercentage || 0}%
                </div>
                <Progress 
                  value={result.result?.scorePercentage || 0} 
                  className="mt-2 h-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Statistics Card */}
          <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5" />
                Thống kê
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Đúng:</span>
                <span className="font-semibold text-green-600">{result.result?.correctAnswers || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Sai:</span>
                <span className="font-semibold text-red-600">{result.result?.incorrectAnswers || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Bỏ trống:</span>
                <span className="font-semibold text-gray-600">{result.result?.unansweredQuestions || 0}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t">
                <span>Tổng cộng:</span>
                <span className="font-semibold">{result.result?.totalQuestions || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Time Card */}
          <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Timer className="w-5 h-5" />
                Thời gian
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Thời gian làm bài:</span>
                <span className="font-semibold">{result.result?.timeTaken || 'Không xác định'} phút</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tổng thời gian:</span>
                <span className="font-semibold">{result.exam?.duration || 0} phút</span>
              </div>
            </CardContent>
          </Card>

          {/* Exam Info Card */}
          <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Thông tin
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">Bắt đầu:</span>
                <div className="font-semibold">{formatDateTime(result.result?.startedAt || '')}</div>
              </div>
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">Hoàn thành:</span>
                <div className="font-semibold">{formatDateTime(result.result?.submittedAt || '')}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Answers */}
        <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Chi tiết câu trả lời
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {result.answers && result.answers.length > 0 ? (
                result.answers.map((answerData, index) => (
                <div key={answerData.questionId} className="border rounded-lg p-4">
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">Câu {index + 1}</span>
                        {getAnswerIcon(answerData.isCorrect)}
                      </div>
                      {answerData.isMarked && (
                        <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                          <Flag className="w-3 h-3 mr-1" />
                          Đã đánh dấu
                        </Badge>
                      )}
                    </div>
                    <Badge 
                      variant={answerData.isCorrect ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {answerData.isCorrect ? 'Đúng' : answerData.selectedAnswer ? 'Sai' : 'Bỏ trống'}
                    </Badge>
                  </div>

                  {/* Question Text */}
                  <div className="mb-4">
                    <p className="text-gray-900 dark:text-white leading-relaxed">
                      {answerData.question?.questionText || 'Không có nội dung câu hỏi'}
                    </p>
                  </div>

                  {/* Answer Options */}
                  <div className="space-y-2">
                    {answerData.question?.answers?.map((option, optionIndex) => {
                      const isSelected = answerData.selectedAnswer?.id === option?.id;
                      const isCorrectAnswer = option?.isCorrect;
                      
                        return (
                        <div
                          key={option?.id || optionIndex}
                          className={cn(
                            "p-3 rounded-lg border-2 transition-all",
                            getAnswerBg(isCorrectAnswer, isSelected, isCorrectAnswer)
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium flex-shrink-0",
                              isSelected && isCorrectAnswer
                                ? "border-green-500 bg-green-500 text-white"
                                : isSelected && !isCorrectAnswer
                                ? "border-red-500 bg-red-500 text-white"
                                : isCorrectAnswer
                                ? "border-green-500 bg-green-100 text-green-700"
                                : "border-gray-300 bg-gray-100 text-gray-600"
                            )}>
                              {String.fromCharCode(65 + optionIndex)}
                            </div>
                            
                            <div className="flex-1">
                              <span className="leading-relaxed">
                                {option?.answerText || 'Không có nội dung đáp án'}
                              </span>
                              
                              {/* Answer indicators */}
                              <div className="flex items-center gap-2 mt-1">
                                {isSelected && (
                                  <Badge variant="outline" className="text-xs">
                                    Bạn đã chọn
                                  </Badge>
                                )}
                                {isCorrectAnswer && (
                                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                    Đáp án đúng
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Không có dữ liệu câu trả lời để hiển thị
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExamResultPage; 