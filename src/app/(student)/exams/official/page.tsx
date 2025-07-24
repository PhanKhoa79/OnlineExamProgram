'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getOpenExamsByClassId, getAllCompletedExams } from '@/features/exam/services/examServices';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  FileText, 
  BookOpen, 
  Trophy, 
  GraduationCap,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Lock,
  ShieldCheck
} from 'lucide-react';


import { useAuthStore } from '@/features/auth/store';
import { getStudentByEmail } from '@/features/student/services/studentService';
import { AllCompletedExamsResponseDto } from '@/features/exam/types/exam.type';

// Định nghĩa kiểu dữ liệu cho phòng thi đang mở
interface OpenExam {
  id: number;
  code: string;
  subjectName: string;
  examName: string;
  duration: number;
  totalQuestions: number;
  maxScore: number;
  startTime: string;
  endTime: string;
  randomizeOrder: boolean;
  exam?: {
    id: number;
    name: string;
  };
  isCompleted?: boolean;
}

const OfficialExamsPage = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [openExams, setOpenExams] = useState<OpenExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classId, setClassId] = useState<number | null>(null);
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [, setCompletedExams] = useState<AllCompletedExamsResponseDto | null>(null);
  const email = user?.email;

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        if (!email) return;
        const res = await getStudentByEmail(email);
        // Fetch class info sau khi có student data
        if (res.classId) {
          setClassId(res.classId);
        }
        if (res.id) {
          setStudentId(res.id);
        }
      } catch (err) {
        console.error('Error fetching student:', err);
      }
    };

    fetchStudent();
  }, [email]);

  // Lấy danh sách các đề thi đã hoàn thành
  const fetchCompletedExams = useCallback(async () => {
    try {
      if (!studentId) return null;

      const completedData = await getAllCompletedExams(studentId);
      setCompletedExams(completedData);

      return completedData;
    } catch (err) {
      console.error('Error fetching completed exams:', err);
      return null;
    }
  }, [studentId]);

  // Lấy danh sách phòng thi đang mở
  const fetchOpenExams = useCallback(
    async (isAuto = false) => {
      try {
        if (!isAuto) {
          setLoading(true);
          setError(null);
        }

        if (!classId) {
          if (!isAuto) setLoading(false);
          return;
        }

        const openExamsData = await getOpenExamsByClassId(classId);
        const completedData = await fetchCompletedExams();

        const markedExams = openExamsData.map((exam: OpenExam) => {
          const isCompleted = completedData
            ? completedData.officialExams.some((item) => item.exam.id === exam.exam?.id)
            : false;

          return {
            ...exam,
            isCompleted,
          };
        });

        setOpenExams(markedExams);

        if (error) setError(null);
      } catch (err) {
        if (!isAuto) {
          setError('Không thể tải danh sách phòng thi đang mở. Vui lòng thử lại.');
        }
        console.error('Error fetching open exams:', err);
      } finally {
        if (!isAuto) {
          setLoading(false);
        }
      }
    },
    [classId, error, fetchCompletedExams],
  );

  const handleRefresh = () => {
    fetchOpenExams(false);
  };

  useEffect(() => {
    if (classId && studentId) {
      fetchOpenExams(false);
    }

    const intervalId = setInterval(() => {
      if (classId && studentId) {
        setIsAutoRefresh(true);
        fetchOpenExams(true).finally(() => {
          setIsAutoRefresh(false);
        });
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [classId, studentId, fetchOpenExams]);

  // Xử lý khi bắt đầu làm bài thi từ phòng thi
  const handleStartOpenExam = (roomId: number) => {
    router.push(`/exams/${roomId}/take`);
  };

  // Xử lý khi xem kết quả bài thi
  const handleViewExamResult = (roomId: number) => {
    router.push(`/exams/${roomId}/result`);
  };


  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Đang tải danh sách phòng thi đang mở...</span>
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
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Bài thi chính thức
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Các bài thi chính thức được tính điểm vào kết quả học tập
            </p>
          </div>
        </div>
        
        {/* Filter Section */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-600">Kỳ thi chính thức</span>
          </div>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm"
            disabled={isAutoRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isAutoRefresh ? 'animate-spin' : ''}`} />
            <span>{isAutoRefresh ? 'Đang cập nhật...' : 'Làm mới'}</span>
          </Button>
        </div>
      </div>

      {/* Important Notice */}
      <div className="mb-8 p-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
            <AlertTriangle className="w-6 h-6 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 text-lg mb-2">
              Lưu ý quan trọng về kỳ thi
            </h3>
            <div className="space-y-3 text-sm text-blue-700 dark:text-blue-300">
              <p>
                Đây là các bài thi chính thức. Kết quả sẽ được ghi nhận và không thể làm lại.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-1">
                <li>Đảm bảo bạn đã chuẩn bị kỹ lưỡng trước khi bắt đầu</li>
                <li>Không được rời khỏi trang trong quá trình làm bài</li>
                <li>Kiểm tra kết nối internet trước khi bắt đầu</li>
                <li>Nộp bài trước khi hết thời gian</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Phòng thi đang mở */}
      {openExams.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Phòng thi đang mở
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Các phòng thi đang mở và sẵn sàng cho bạn tham gia
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {openExams.map((openExam) => (
              <Card 
                key={openExam.id} 
                className={`group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 ${
                  openExam.isCompleted 
                    ? 'bg-gradient-to-br from-white to-blue-50/80 dark:from-gray-900 dark:to-blue-900/10' 
                    : 'bg-gradient-to-br from-white to-green-50/80 dark:from-gray-900 dark:to-green-900/10'
                } backdrop-blur-sm ring-1 ring-green-200/50 dark:ring-green-800/30`}
              >
                <div className={`absolute top-0 left-0 w-full h-1 ${
                  openExam.isCompleted 
                    ? 'bg-gradient-to-r from-blue-400 to-indigo-500' 
                    : 'bg-gradient-to-r from-green-400 to-emerald-500'
                }`} />
                
                <CardHeader className="pb-2 relative">
                  <div className="flex items-start justify-between mb-2">
                    <Badge 
                      variant="default"
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        openExam.isCompleted 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {openExam.isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        )}
                        {openExam.isCompleted ? 'Đã hoàn thành' : 'Đang mở'}
                      </div>
                    </Badge>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        Mã phòng
                      </div>
                      <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {openExam.code}
                      </div>
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {openExam.examName}
                  </CardTitle>
                  
                  <CardDescription className="flex items-center gap-2 mt-1 text-sm">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-600 dark:text-gray-300">{openExam.subjectName}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5 pt-2">
                  {/* Exam Stats */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Thời gian
                        </div>
                        <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {openExam.duration} phút
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Số câu hỏi
                        </div>
                        <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {openExam.totalQuestions} câu
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Điểm tối đa
                        </div>
                        <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {openExam.maxScore || 10} điểm
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Môn thi:
                        </div>
                        <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {openExam.subjectName}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 flex items-center justify-end">
                      <div className="flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Bảo mật</span>
                      </div>
                    </div>
                    
                    {/* Action Button - Hiển thị khác nhau tùy vào trạng thái */}
                    {openExam.isCompleted ? (
                      <Button 
                        onClick={() => handleViewExamResult(openExam.exam?.id || 0)}
                        className="w-full h-11 group/btn bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 cursor-pointer"
                      >
                        <span className="font-medium">Xem kết quả</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleStartOpenExam(openExam.exam?.id || 0)}
                        className="w-full h-11 group/btn bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/20 cursor-pointer"
                      >
                        <span className="font-medium">Vào thi ngay</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Hiển thị thông báo khi không có phòng thi nào đang mở */}
      {openExams.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 py-8">
          <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2">
            <Lock className="w-10 h-10 text-gray-400" />
          </div>
          <div className="text-center max-w-md">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Chưa có phòng thi nào đang mở
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Hiện tại chưa có phòng thi chính thức nào đang mở cho lớp của bạn. 
              Vui lòng kiểm tra lịch thi hoặc liên hệ với giáo viên để biết thêm thông tin.
            </p>
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Kiểm tra lại
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficialExamsPage;