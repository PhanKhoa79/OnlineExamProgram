'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/features/auth/store';
import { 
  Calendar,
  Clock,
  Trophy,
  TrendingUp,
  CheckCircle,
  Award,
  BookOpen,
  Star,
  PlayCircle,
  Brain,
  GraduationCap,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getStudentByEmail } from '@/features/student/services/studentService';
import { getClassById } from '@/features/classes/services/classServices';
import { getStudentPracticeProgress, getAllCompletedExams } from '@/features/exam/services/examServices';
import { StudentPracticeProgressResponseDto, AllCompletedExamsResponseDto } from '@/features/exam/types/exam.type';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { getScheduleByClassId } from '@/features/schedule/services/scheduleServices';
import { ExamScheduleDto } from '@/features/schedule/types/schedule';
import { StudentDto } from '@/features/student/types/student';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function StudentHomePage() {
  usePageTitle('Trang chủ');
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const user = useAuthStore((state) => state.user);
  const [classCode, setClassCode] = useState<string>('');
  const [student, setStudent] = useState<StudentDto | null>(null);
  const [practiceProgress, setPracticeProgress] = useState<StudentPracticeProgressResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedExams, setCompletedExams] = useState<AllCompletedExamsResponseDto | null>(null);
  const [resultsLoading, setResultsLoading] = useState(true);
  const [upcomingExams, setUpcomingExams] = useState<ExamScheduleDto[]>([]);
  const [schedulesLoading, setSchedulesLoading] = useState(true);
  const [averageScore, setAverageScore] = useState<number>(0);
  const email = user?.email;

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        setResultsLoading(true);
        setSchedulesLoading(true);
        if (!email) return;
        
        const res = await getStudentByEmail(email);
        setStudent(res);
        // Fetch class info sau khi có student data
        if (res.classId) {
          const classRes = await getClassById(res.classId);
          setClassCode(classRes.code);
          
          // Fetch upcoming exam schedules for the student's class
          try {
            const schedules = await getScheduleByClassId(res.classId);
            // Filter for active schedules and sort by start time
            const activeSchedules = Array.isArray(schedules) 
              ? schedules.filter(s => s.status === 'active')
              : [schedules].filter(s => s.status === 'active');
              
            activeSchedules.sort((a, b) => 
              new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
            );
            
            setUpcomingExams(activeSchedules);
          } catch (scheduleErr) {
            console.error('Error fetching class schedules:', scheduleErr);
          } finally {
            setSchedulesLoading(false);
          }
        }

        // Fetch practice progress
        if (res.id) {
          const progressRes = await getStudentPracticeProgress(res.id);
          setPracticeProgress(progressRes);
          
          // Fetch recent exam results
          try {
            const recentResultsData = await getAllCompletedExams(res.id);
            setCompletedExams(recentResultsData);
          } catch (resultErr) {
            console.error('Error fetching recent results:', resultErr);
          } finally {
            setResultsLoading(false);
          }
        }
        
        console.log('Student data:', res);
      } catch (err) {
        console.error('Error fetching student:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [email]);

  useEffect(() => {
    if (completedExams && completedExams.completedExams.length > 0) {
      const avgScore = completedExams.completedExams.reduce(
        (sum, exam) => sum + exam.result.scorePercentage, 
        0
      ) / completedExams.completedExams.length;
      setAverageScore(Number((avgScore / 10).toFixed(1))); 
    }
  }, [completedExams]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Hàm định dạng ngày tháng cho kết quả bài thi
  const formatExamDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch {
      return dateString;
    }
  };

  // Format time for schedule display
  const formatScheduleTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm', { locale: vi });
    } catch {
      return '';
    }
  };

  // Tính thời gian làm bài (phút)
  const calculateExamDuration = (startDate: string, endDate: string): number => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffMs = end.getTime() - start.getTime();
      return Math.round(diffMs / (1000 * 60)); // Chuyển đổi ms sang phút
    } catch {
      return 0;
    }
  };

  // Use real data from API or fallback to empty array
  const learningProgress = practiceProgress?.subjects.map(subject => ({
    subject: subject.subjectName,
    progress: subject.progressPercentage,
    totalLessons: subject.totalPracticeExams,
    completedLessons: subject.completedPracticeExams
  })) || [];

  const achievements = [
    { id: 1, title: 'Streak Master', description: '7 ngày học liên tiếp', icon: '🔥', earned: true },
    { id: 2, title: 'Perfect Score', description: 'Đạt điểm 10 trong bài thi', icon: '⭐', earned: true },
    { id: 3, title: 'Speed Demon', description: 'Hoàn thành bài thi nhanh nhất', icon: '⚡', earned: false },
    { id: 4, title: 'Top Performer', description: 'Top 3 trong lớp', icon: '🏆', earned: true }
  ];

  const stats = {
    totalExams: practiceProgress?.overallProgress.totalPracticeExams || 0,
    completedExams: practiceProgress?.overallProgress.totalCompletedExams || 0,
    averageScore: averageScore, // This would need a separate API call
    rank: 15, // This would need a separate API call
    totalStudents: 120, // This would need a separate API call
    studyStreak: 7, // This would need a separate API call
    totalStudyTime: 145, // hours - This would need a separate API call
    improvementRate: 12 // percentage - This would need a separate API call
  };

  // Function to render schedule status badge
  const getStatusBadge = (status: string, startTime: string, endTime: string) => {
    const now = new Date();
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (status === 'cancelled') {
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Đã hủy</Badge>;
    }
    
    if (status === 'completed') {
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Đã hoàn thành</Badge>;
    }
    
    // Kiểm tra thời gian hiện tại
    if (now < startDate) {
      // Chưa đến thời gian bắt đầu
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Sắp diễn ra</Badge>;
    } else if (now >= startDate && now <= endDate) {
      // Đang diễn ra
      return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">Đang diễn ra</Badge>;
    } else {
      // Đã kết thúc
      return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">Đã kết thúc</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Welcome Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl shadow-blue-500/25 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20"></div>
          <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white rounded-full"></div>
        </div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">
                  Chào mừng trở lại, {student?.fullName || 'Sinh viên'}! 👋
                </h1>
                <p className="text-blue-100 text-lg">
                  Hôm nay là {formatDate(currentTime)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
                <Clock className="w-5 h-5" />
                <span className="font-mono text-xl font-semibold">{formatTime(currentTime)}</span>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
                Lớp: {classCode}
              </Badge>
              <Badge variant="secondary" className="bg-green-400/20 text-green-100 border-green-300/30 px-4 py-2 text-sm">
                🔥 {stats.studyStreak} ngày streak
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm cursor-pointer" onClick={() => router.push('/exams/practice')}>
                <PlayCircle className="w-4 h-4 mr-2" />
                Bắt đầu luyện tập
              </Button>
              <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-200 cursor-pointer" onClick={() => router.push('/schedules')}>
                <Calendar className="w-4 h-4 mr-2" />
                Xem lịch thi
              </Button>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Trophy className="w-16 h-16 text-yellow-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Điểm trung bình</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300">{stats.averageScore}/10</p>
                <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">
                  +{stats.improvementRate}% so với tháng trước
                </p>
              </div>
              <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Bài thi hoàn thành</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.completedExams}/{stats.totalExams}</p>
                <div className="mt-2">
                  <Progress value={(stats.completedExams / stats.totalExams) * 100} className="h-2" />
                </div>
              </div>
              <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200/50 dark:border-purple-700/50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Xếp hạng lớp</p>
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">#{stats.rank}</p>
                <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">
                  Trong {stats.totalStudents} học sinh
                </p>
              </div>
              <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <Award className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Learning Progress */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600" />
              Tiến độ học tập
            </CardTitle>
            <CardDescription>
              Theo dõi tiến độ học tập của bạn theo từng môn học
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                        <div>
                          <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1"></div>
                        </div>
                      </div>
                      <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : learningProgress.length > 0 ? (
              <div className="space-y-6">
                {learningProgress.map((subject) => (
                <div key={subject.subject} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{subject.subject}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {subject.completedLessons}/{subject.totalLessons} đề đã làm
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        {subject.progress}%
                      </div>
                    </div>
                  </div>
                  <Progress value={subject.progress} className="h-2" />
                </div>
              ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400">
                  Chưa có dữ liệu tiến độ học tập
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-600" />
              Thành tích
            </CardTitle>
            <CardDescription>
              Các huy hiệu bạn đã đạt được
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                    achievement.earned 
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200/50 dark:border-yellow-700/50' 
                      : 'bg-gray-50 dark:bg-gray-800/50 opacity-60'
                  }`}
                >
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                      {achievement.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.earned && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Exams */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Lịch thi sắp tới
            </CardTitle>
            <CardDescription>
              Các bài thi và kiểm tra trong thời gian tới
            </CardDescription>
          </CardHeader>
          <CardContent>
            {schedulesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                      <div className="space-y-2 flex-1">
                        <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="w-2/4 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="w-3/4 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : upcomingExams.length > 0 ? (
            <div className="space-y-4">
                {upcomingExams.map((schedule) => (
                  <div key={schedule.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {schedule.subject?.name || 'Bài thi'} - {schedule.code}
                        </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Từ {formatExamDate(schedule.startTime)} đến {formatExamDate(schedule.endTime)}
                        </span>
                          {getStatusBadge(schedule.status, schedule.startTime, schedule.endTime)}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>⏱️ {formatScheduleTime(schedule.startTime)} - {formatScheduleTime(schedule.endTime)}</span>
                          <span>🏫 {schedule.classes?.map(c => c.name).join(', ')}</span>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400">
                  Không có lịch thi sắp tới
                </p>
              </div>
            )}
            <Button className="w-full mt-4 cursor-pointer" variant="outline" onClick={() => router.push('/schedules')}>
              Xem tất cả lịch thi
            </Button>
          </CardContent>
        </Card>

        {/* Recent Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-green-600" />
              Kết quả gần đây
            </CardTitle>
            <CardDescription>
              Điểm số các bài thi chính thức và luyện tập gần đây
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resultsLoading ? (
                // Loading skeleton
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-2 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2"></div>
                      </div>
                    </div>
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                ))
              ) : completedExams && completedExams.completedExams.length > 0 ? (
                // Actual data - Get the most recent 3 exams from all completed exams (both practice and official)
                completedExams.completedExams
                  .sort((a, b) => new Date(b.result.submittedAt).getTime() - new Date(a.result.submittedAt).getTime())
                  .slice(0, 3)
                  .map((result) => (
                    <div key={result.studentExamId} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/50 dark:border-green-700/50 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{result.exam.name}</h4>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <span>{formatExamDate(result.result.submittedAt)}</span>
                            <span>⏱️ {result.result.timeTaken || calculateExamDuration(result.result.startedAt, result.result.submittedAt)} phút</span>
                            <span>📚 {result.exam.subject.name}</span>
                            <Badge className={`${
                              result.exam.examType === 'official' 
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            }`}>
                              {result.exam.examType === 'official' ? 'Chính thức' : 'Luyện tập'}
                            </Badge>
                        </div>
                        <div className="mt-2">
                          <Progress 
                              value={result.result.scorePercentage} 
                            className="h-2" 
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Đạt {result.result.scorePercentage}%
                          </p>
                          </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {result.result.score}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                          /{result.exam.maxScore}
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                // No data
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Chưa có kết quả bài thi nào
                  </p>
                </div>
              )}
            </div>
            <Button className="w-full mt-4 cursor-pointer" variant="outline" onClick={() => router.push('/results/history')}>
              Xem tất cả kết quả
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}