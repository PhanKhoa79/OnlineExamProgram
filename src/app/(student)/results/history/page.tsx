'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllCompletedExams } from '@/features/exam/services/examServices';
import { getStudentByEmail } from '@/features/student/services/studentService';
import { useAuthStore } from '@/features/auth/store';
import { CompletedExamDto } from '@/features/exam/types/exam.type';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { 
  Clock, 
  FileText, 
  BookOpen, 
  Trophy, 
  RefreshCw,
  Filter,
  Calendar,
  Eye,
  AlertCircle,
  GraduationCap,
  Target
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { usePageTitle } from '@/hooks/usePageTitle';

const ExamHistoryPage = () => {
  usePageTitle('Lịch sử thi');
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const userEmail = user?.email;
  
  const [completedExams, setCompletedExams] = useState<CompletedExamDto[]>([]);
  const [totalPracticeExams, setTotalPracticeExams] = useState<number>(0);
  const [totalOfficialExams, setTotalOfficialExams] = useState<number>(0);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [selectedExamType, setSelectedExamType] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get student ID from email
  useEffect(() => {
    const fetchStudentId = async () => {
      if (!userEmail) return;
      
      try {
        const studentData = await getStudentByEmail(userEmail);
        setStudentId(studentData.id);
      } catch (error) {
        console.error('Error fetching student data:', error);
        setError('Không thể tải thông tin sinh viên. Vui lòng thử lại sau.');
      }
    };

    fetchStudentId();
  }, [userEmail]);

  const fetchCompletedExams = async () => {
    if (!studentId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const completedData = await getAllCompletedExams(studentId);
      setCompletedExams(completedData.completedExams);
      setTotalPracticeExams(completedData.totalPracticeExams);
      setTotalOfficialExams(completedData.totalOfficialExams);
    } catch (error) {
      console.error('Error fetching completed exams:', error);
      setError('Không thể tải lịch sử bài thi. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchCompletedExams();
    }
  }, [studentId]);

  const handleRefresh = () => {
    fetchCompletedExams();
  };

  const handleViewResult = (examId: number) => {
    router.push(`/exams/${examId}/result`);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      // Sử dụng UTC để tránh vấn đề timezone
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      
      return `${day}/${month}/${year}`;
    } catch {
      return 'Ngày không hợp lệ';
    }
  };



  const getExamTypeLabel = (type: string) => {
    return type === 'practice' ? 'Bài thi thử' : 'Bài thi chính thức';
  };

  const getExamTypeBadgeVariant = (type: string) => {
    return type === 'practice' ? 'secondary' : 'default';
  };

  const getExamTypeIcon = (type: string) => {
    return type === 'practice' ? <Target className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />;
  };

  // Filter exams based on selected type
  const filteredExams = selectedExamType === 'all' 
    ? completedExams 
    : completedExams.filter(exam => exam.exam.examType === selectedExamType);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Đang tải lịch sử bài thi...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="text-red-500 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-2" />
            <p className="text-lg font-semibold">Có lỗi xảy ra</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
          </div>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Lịch sử bài thi</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Xem lại kết quả các bài thi đã hoàn thành
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Select
              value={selectedExamType}
              onValueChange={setSelectedExamType}
            >
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span>
                    {selectedExamType === 'all' 
                      ? 'Tất cả loại đề' 
                      : selectedExamType === 'practice' 
                        ? 'Bài thi thử' 
                        : 'Bài thi chính thức'
                    }
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại đề</SelectItem>
                <SelectItem value="practice">Bài thi thử</SelectItem>
                <SelectItem value="official">Bài thi chính thức</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" onClick={handleRefresh} title="Làm mới">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Tổng số bài thi đã hoàn thành
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedExams.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Bài thi thử đã hoàn thành
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalPracticeExams}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Bài thi chính thức đã hoàn thành
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalOfficialExams}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Điểm trung bình
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {completedExams.length > 0 
                  ? (completedExams.reduce((sum, exam) => sum + exam.result.scorePercentage, 0) / completedExams.length).toFixed(1)
                  : 0
                }%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exam History List */}
        {filteredExams.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[200px] gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-lg font-semibold">Chưa có bài thi nào được hoàn thành</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Các bài thi sau khi hoàn thành sẽ hiển thị ở đây
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredExams.map((exam) => (
              <Card 
                key={exam.studentExamId} 
                className="hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4 p-4">
                  {/* Left side - Exam info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center",
                      exam.exam.examType === 'practice' 
                        ? "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" 
                        : "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    )}>
                      {exam.exam.examType === 'practice' ? <Target className="w-6 h-6" /> : <GraduationCap className="w-6 h-6" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{exam.exam.name}</h3>
                        <Badge variant={getExamTypeBadgeVariant(exam.exam.examType)} className="ml-2">
                          <div className="flex items-center gap-1">
                            {getExamTypeIcon(exam.exam.examType)}
                            <span>{getExamTypeLabel(exam.exam.examType)}</span>
                          </div>
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{exam.exam.subject.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Ngày thi: {formatDate(exam.result.submittedAt)}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Thời gian làm bài: {exam.result.timeTaken || '---'} phút</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right side - Score and actions */}
                  <div className="flex flex-col md:items-end gap-3 mt-4 md:mt-0">
                    <div className="flex items-center gap-2">
                      <Trophy className={cn(
                        "w-5 h-5",
                        exam.result.scorePercentage >= 80 ? "text-yellow-500" :
                        exam.result.scorePercentage >= 60 ? "text-green-500" :
                        "text-gray-400"
                      )} />
                      <span className="text-xl font-bold">
                        {exam.result.score}/{exam.exam.maxScore} ({exam.result.scorePercentage}%)
                      </span>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewResult(exam.exam.id)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="h-2">
                  <Progress 
                    value={exam.result.scorePercentage} 
                    className={cn(
                      "h-full rounded-none",
                      exam.result.scorePercentage >= 80 ? "bg-green-100 dark:bg-green-900/20" :
                      exam.result.scorePercentage >= 60 ? "bg-yellow-100 dark:bg-yellow-900/20" :
                      "bg-red-100 dark:bg-red-900/20"
                    )}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamHistoryPage;