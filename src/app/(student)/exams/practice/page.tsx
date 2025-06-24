'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getExamsByType, getExamsBySubject, getInProgressPracticeExams, getCompletedPracticeExams } from '@/features/exam/services/examServices';
import { getAllSubjects } from '@/features/subject/services/subjectServices';
import { getStudentByEmail } from '@/features/student/services/studentService';
import { useAuthStore } from '@/features/auth/store';
import { ExamDto, InProgressExamDto, CompletedPracticeExamsResponseDto } from '@/features/exam/types/exam.type';
import { SubjectResponseDto } from '@/features/subject/types/subject';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Clock, 
  FileText, 
  BookOpen, 
  Trophy, 
  Target,
  ArrowRight,
  RefreshCw,
  Filter,
  Play,
  RotateCcw,
  AlertCircle,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

// Component to highlight text matching the search term
interface HighlightTextProps {
  text: string;
  highlight: string;
}

const HighlightText = ({ text, highlight }: HighlightTextProps) => {
  if (!highlight.trim()) {
    return <>{text}</>;
  }

  const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <span key={i} className="bg-yellow-200 dark:bg-yellow-700/50 px-0.5 rounded">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

const PracticeExamsPage = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const userEmail = user?.email;
  
  const [exams, setExams] = useState<ExamDto[]>([]);
  const [subjects, setSubjects] = useState<SubjectResponseDto[]>([]);
  const [inProgressExams, setInProgressExams] = useState<InProgressExamDto[]>([]);
  const [completedExams, setCompletedExams] = useState<CompletedPracticeExamsResponseDto | null>(null);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [highlightedExams, setHighlightedExams] = useState<number[]>([]);
  const firstResultRef = useRef<HTMLDivElement>(null);

  // Get student ID from email
  useEffect(() => {
    const fetchStudentId = async () => {
      if (!userEmail) return;
      
      try {
        const studentData = await getStudentByEmail(userEmail);
        setStudentId(studentData.id);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentId();

    // Check for search parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [userEmail]);

  const fetchInProgressExams = async () => {
    if (!studentId) return;
    
    try {
      const inProgressData = await getInProgressPracticeExams(studentId);
      setInProgressExams(inProgressData);
    } catch (error) {
      console.error('Error fetching in-progress exams:', error);
      // Don't show error for this, it's optional
    }
  };

  const fetchCompletedExams = async () => {
    if (!studentId) return;
    
    try {
      const completedData = await getCompletedPracticeExams(studentId);
      setCompletedExams(completedData);
    } catch (error) {
      console.error('Error fetching completed exams:', error);
      // Don't show error for this, it's optional
    }
  };

  const fetchSubjects = async () => {
    try {
      const subjectData = await getAllSubjects();
      setSubjects(subjectData);
    } catch (err) {
      console.error('Error fetching subjects:', err);
    }
  };

  const fetchExams = async (subjectId?: number) => {
    try {
      setLoading(true);
      setError(null);
      
      let examData: ExamDto[];
      if (subjectId) {
        // Get exams by subject, then filter for practice exams
        const allSubjectExams = await getExamsBySubject(subjectId);
        examData = allSubjectExams.filter((exam: ExamDto) => exam.examType === 'practice');
      } else {
        // Get all practice exams
        examData = await getExamsByType('practice');
      }
      
      setExams(examData);
    } catch (err) {
      setError('Không thể tải danh sách bài thi thử. Vui lòng thử lại.');
      console.error('Error fetching practice exams:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter items based on search query
  const handleSubjectChange = (value: string) => {
    setSelectedSubjectId(value);
    if (value === 'all') {
      fetchExams();
    } else {
      fetchExams(parseInt(value));
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim() === '') {
      setHighlightedExams([]);
      return;
    }
    
    // Find exams that match the search term
    const matchingExams = exams
      .filter(exam => exam.name.toLowerCase().includes(value.toLowerCase()))
      .map(exam => exam.id);
    
    setHighlightedExams(matchingExams);
    
    // Scroll to first result after a short delay to allow rendering
    if (matchingExams.length > 0) {
      setTimeout(() => {
        if (firstResultRef.current) {
          firstResultRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);
    }
  };

  const handleRefresh = () => {
    if (selectedSubjectId === 'all') {
      fetchExams();
    } else {
      fetchExams(parseInt(selectedSubjectId));
    }
    // Also refresh in-progress and completed exams
    fetchInProgressExams();
    fetchCompletedExams();
  };

  useEffect(() => {
    // Fetch subjects and initial exams
    Promise.all([
      fetchSubjects(),
      fetchExams()
    ]);
  }, []);

  // Fetch in-progress and completed exams when studentId is available
  useEffect(() => {
    if (studentId) {
      fetchInProgressExams();
      fetchCompletedExams();
    }
  }, [studentId]);

  // Check for search parameter in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const searchParam = urlParams.get('search');
      if (searchParam) {
        setSearchTerm(searchParam);
        
        // Wait for exams to be loaded before highlighting
        if (exams.length > 0) {
          const matchingExams = exams
            .filter(exam => exam.name.toLowerCase().includes(searchParam.toLowerCase()))
            .map(exam => exam.id);
          
          setHighlightedExams(matchingExams);
          
          // Scroll to first result after a short delay
          if (matchingExams.length > 0) {
            setTimeout(() => {
              if (firstResultRef.current) {
                firstResultRef.current.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'center' 
                });
              }
            }, 500);
          }
        }
      }
    }
  }, [exams]);

  const isExamInProgress = (examId: number) => {
    return inProgressExams.some(item => item.exam.id === examId);
  };

  const getInProgressExamData = (examId: number) => {
    return inProgressExams.find(item => item.exam.id === examId);
  };

  const isExamCompleted = (examId: number) => {
    return completedExams?.completedExams.some(item => item.exam.id === examId) || false;
  };

  const getCompletedExamData = (examId: number) => {
    return completedExams?.completedExams.find(item => item.exam.id === examId);
  };

  // Filter in-progress exams based on selected subject
  const getFilteredInProgressCount = () => {
    if (selectedSubjectId === 'all') {
      return inProgressExams.length;
    }
    return inProgressExams.filter(item => 
      item.exam.subject?.id === parseInt(selectedSubjectId)
    ).length;
  };

  const handleStartExam = (examId: number) => {
    router.push(`/exams/${examId}/take`);
  };

  const handleViewResult = (examId: number) => {
    router.push(`/exams/${examId}/result`);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
  };

  const getExamTypeLabel = (type: string) => {
    return type === 'practice' ? 'Bài thi thử' : 'Bài thi chính thức';
  };

  const getExamTypeBadgeVariant = (type: string) => {
    return type === 'practice' ? 'secondary' : 'default';
  };

  const getSelectedSubjectName = () => {
    if (selectedSubjectId === 'all') return 'Tất cả môn học';
    const subject = subjects.find(s => s.id.toString() === selectedSubjectId);
    return subject ? subject.name : 'Tất cả môn học';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Đang tải danh sách bài thi thử...</span>
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
            <FileText className="w-12 h-12 mx-auto mb-2" />
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Bài thi thử
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Luyện tập với các đề thi thử để chuẩn bị cho kỳ thi chính thức
            </p>
          </div>
        </div>
        
        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Lọc theo môn học:
              </span>
            </div>
            <Select value={selectedSubjectId} onValueChange={handleSubjectChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Chọn môn học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Tất cả môn học</span>
                  </div>
                </SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id.toString()}>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{subject.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Search Box */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm đề thi..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-60"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Clear search</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Làm mới
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {exams.length} bài thi thử khả dụng
            </Badge>
            {getFilteredInProgressCount() > 0 && (
              <Badge variant="outline" className="text-sm bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
                <RotateCcw className="w-3 h-3 mr-1" />
                {getFilteredInProgressCount()} bài đang làm
              </Badge>
            )}
            {completedExams && completedExams.completedExams.length > 0 && (
              <Badge variant="outline" className="text-sm bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                <Trophy className="w-3 h-3 mr-1" />
                {completedExams.completedExams.length} bài đã hoàn thành
              </Badge>
            )}
            {searchTerm && highlightedExams.length > 0 && (
              <Badge variant="outline" className="text-sm bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800">
                <Search className="w-3 h-3 mr-1" />
                {highlightedExams.length} kết quả tìm kiếm
              </Badge>
            )}
            {selectedSubjectId !== 'all' && (
              <Badge variant="outline" className="text-sm">
                Môn: {getSelectedSubjectName()}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Exam Cards */}
      {exams.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="text-center">
            <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {selectedSubjectId === 'all' 
                ? 'Chưa có bài thi thử nào' 
                : `Chưa có bài thi thử nào cho môn ${getSelectedSubjectName()}`
              }
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedSubjectId === 'all' 
                ? 'Hiện tại chưa có bài thi thử nào được tạo. Vui lòng quay lại sau.'
                : 'Thử chọn môn học khác hoặc quay lại sau.'
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => {
            const inProgress = getInProgressExamData(exam.id);
            const isInProgress = isExamInProgress(exam.id);
            const completed = getCompletedExamData(exam.id);
            const isCompleted = isExamCompleted(exam.id);
            const isFirstResult = highlightedExams.length > 0 && highlightedExams[0] === exam.id;
            
            return (
              <Card 
                key={exam.id} 
                ref={isFirstResult ? firstResultRef : null}
                className={cn(
                  "group hover:shadow-lg transition-all duration-200 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm relative",
                  isInProgress && "ring-2 ring-orange-200 dark:ring-orange-800",
                  isCompleted && "ring-2 ring-green-200 dark:ring-green-800 bg-green-50/50 dark:bg-green-900/10",
                  highlightedExams.includes(exam.id) && searchTerm && "ring-2 ring-yellow-300 dark:ring-yellow-600 bg-yellow-50/50 dark:bg-yellow-900/10"
                )}
              >
                {/* Status indicators */}
                {isInProgress && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-orange-500 text-white rounded-full p-2 shadow-lg">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                  </div>
                )}
                {isCompleted && !isInProgress && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-green-500 text-white rounded-full p-2 shadow-lg">
                      <Trophy className="w-4 h-4" />
                    </div>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={getExamTypeBadgeVariant(exam.examType)}
                        className="text-xs"
                      >
                        {getExamTypeLabel(exam.examType)}
                      </Badge>
                      {isInProgress && (
                        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Đang làm bài
                        </Badge>
                      )}
                      {isCompleted && !isInProgress && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                          <Trophy className="w-3 h-3 mr-1" />
                          Đã hoàn thành
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Ngày tạo
                      </div>
                      <div className="text-xs font-medium">
                        {formatDate(exam.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  <CardTitle className={cn(
                    "text-lg font-semibold line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors",
                    isCompleted && !isInProgress && "text-green-700 dark:text-green-400"
                  )}>
                    {highlightedExams.includes(exam.id) && searchTerm ? (
                      <HighlightText text={exam.name} highlight={searchTerm} />
                    ) : (
                      exam.name
                    )}
                  </CardTitle>
                  
                  <CardDescription className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span className="font-medium">{exam.subject.name}</span>
                  </CardDescription>
                  
                  {/* Show info for in-progress exams */}
                  {isInProgress && inProgress && (
                    <div className="mt-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <div className="text-xs text-orange-700 dark:text-orange-400 space-y-2">
                        <div>
                          <span className="font-medium">Bắt đầu lúc:</span> {formatDateTime(inProgress.startedAt)}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Tiến độ:</span>
                            <span className="text-xs">{inProgress.progress.answeredQuestions}/{inProgress.progress.totalQuestions} câu</span>
                          </div>
                          <Progress 
                            value={inProgress.progress.progressPercentage} 
                            className="h-2 bg-orange-200 dark:bg-orange-800"
                          />
                          <div className="text-center">
                            <span className="text-xs font-medium">{inProgress.progress.progressPercentage}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Show info for completed exams */}
                  {isCompleted && !isInProgress && completed && (
                    <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="text-xs text-green-700 dark:text-green-400 space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Điểm số:</span>
                          <span className="font-bold">{completed.result.score}/{exam.maxScore} ({completed.result.scorePercentage}%)</span>
                        </div>
                        <div>
                          <span className="font-medium">Hoàn thành lúc:</span> {formatDateTime(completed.result.submittedAt)}
                        </div>
                        <div>
                          <span className="font-medium">Thời gian làm bài:</span> {completed.result.timeTaken} <span>phút</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Exam Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Thời gian
                        </div>
                        <div className="text-sm font-semibold">
                          {exam.duration} phút
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-green-500" />
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Số câu hỏi
                        </div>
                        <div className="text-sm font-semibold">
                          {exam.totalQuestions} câu
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Điểm tối đa
                        </div>
                        <div className="text-sm font-semibold">
                          {exam.maxScore} điểm
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-purple-500" />
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Loại đề
                        </div>
                        <div className="text-sm font-semibold">
                          {getExamTypeLabel(exam.examType)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    onClick={() => {
                      if (isCompleted && !isInProgress) {
                        handleViewResult(exam.id);
                      } else {
                        handleStartExam(exam.id);
                      }
                    }}
                    className={cn(
                      "w-full group/btn text-white shadow-lg cursor-pointer",
                      isInProgress 
                        ? "bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-orange-500/25"
                        : isCompleted
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-blue-500/25"
                        : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-green-500/25"
                    )}
                  >
                    {isInProgress ? (
                      <>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        <span>Tiếp tục làm bài</span>
                      </>
                    ) : isCompleted ? (
                      <>
                        <Trophy className="w-4 h-4 mr-2" />
                        <span>Xem kết quả</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        <span>Bắt đầu thi</span>
                      </>
                    )}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PracticeExamsPage; 