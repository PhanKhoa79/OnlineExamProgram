'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAllCompletedExams } from '@/features/exam/services/examServices';
import { getStudentByEmail } from '@/features/student/services/studentService';
import { useAuthStore } from '@/features/auth/store';
import { CompletedExamDto } from '@/features/exam/types/exam.type';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  PieChart, 
  LineChart, 
  RefreshCw, 
  AlertCircle, 
  BookOpen, 
  Target,
  GraduationCap,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { format, parseISO, subMonths } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { usePageTitle } from '@/hooks/usePageTitle';

const ExamStatisticsPage = () => {
  usePageTitle('Thống kê kết quả');
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const userEmail = user?.email;
  
  const [completedExams, setCompletedExams] = useState<CompletedExamDto[]>([]);
  const [studentId, setStudentId] = useState<number | null>(null);
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

  const fetchCompletedExams = useCallback(async () => {
    if (!studentId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const completedData = await getAllCompletedExams(studentId);
      setCompletedExams(completedData.completedExams);
    } catch (error) {
      console.error('Error fetching completed exams:', error);
      setError('Không thể tải dữ liệu bài thi. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    if (studentId) {
      fetchCompletedExams();
    }
  }, [studentId, fetchCompletedExams]);

  const handleRefresh = () => {
    fetchCompletedExams();
  };

  // Calculate statistics
  const calculateStatistics = () => {
    if (!completedExams.length) return null;

    // Average score
    const averageScore = completedExams.reduce((sum, exam) => sum + exam.result.scorePercentage, 0) / completedExams.length;
    
    // Best score
    const bestScore = Math.max(...completedExams.map(exam => exam.result.scorePercentage));
    
    // Worst score
    const worstScore = Math.min(...completedExams.map(exam => exam.result.scorePercentage));
    
    // Total exams by type
    const practiceExams = completedExams.filter(exam => exam.exam.examType === 'practice').length;
    const officialExams = completedExams.filter(exam => exam.exam.examType === 'official').length;
    
    // Exams by subject
    const examsBySubject = completedExams.reduce((acc, exam) => {
      const subjectId = exam.exam.subject.id;
      if (!acc[subjectId]) {
        acc[subjectId] = {
          name: exam.exam.subject.name,
          count: 0,
          totalScore: 0,
          scores: []
        };
      }
      acc[subjectId].count += 1;
      acc[subjectId].totalScore += exam.result.scorePercentage;
      acc[subjectId].scores.push(exam.result.scorePercentage);
      return acc;
    }, {} as Record<number, { name: string; count: number; totalScore: number; scores: number[] }>);
    
    // Recent trend (last 5 exams)
    const recentExams = [...completedExams]
      .sort((a, b) => new Date(b.result.submittedAt).getTime() - new Date(a.result.submittedAt).getTime())
      .slice(0, 5);
    
    // Score distribution
    const scoreDistribution = {
      excellent: completedExams.filter(exam => exam.result.scorePercentage >= 85).length,
      good: completedExams.filter(exam => exam.result.scorePercentage >= 70 && exam.result.scorePercentage < 85).length,
      average: completedExams.filter(exam => exam.result.scorePercentage >= 50 && exam.result.scorePercentage < 70).length,
      poor: completedExams.filter(exam => exam.result.scorePercentage < 50).length,
    };

    // Monthly progress (last 6 months)
    const now = new Date();
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const month = subMonths(now, i);
      const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      const monthExams = completedExams.filter(exam => {
        const examDate = new Date(exam.result.submittedAt);
        return examDate >= monthStart && examDate <= monthEnd;
      });
      
      const avgScore = monthExams.length > 0
        ? monthExams.reduce((sum, exam) => sum + exam.result.scorePercentage, 0) / monthExams.length
        : 0;
      
      return {
        month: format(month, 'MM/yyyy'),
        label: format(month, 'MMM', { locale: vi }),
        count: monthExams.length,
        averageScore: avgScore
      };
    }).reverse();

    return {
      averageScore,
      bestScore,
      worstScore,
      practiceExams,
      officialExams,
      examsBySubject,
      recentExams,
      scoreDistribution,
      monthlyData
    };
  };

  const stats = calculateStatistics();

  // Helper function to get trend indicator
  const getTrendIndicator = (currentScore: number, previousScore: number) => {
    if (currentScore > previousScore) {
      return (
        <div className="flex items-center text-green-500">
          <ArrowUpRight className="w-4 h-4 mr-1" />
          <span>+{(currentScore - previousScore).toFixed(1)}%</span>
        </div>
      );
    } else if (currentScore < previousScore) {
      return (
        <div className="flex items-center text-red-500">
          <ArrowDownRight className="w-4 h-4 mr-1" />
          <span>-{(previousScore - currentScore).toFixed(1)}%</span>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Đang tải dữ liệu thống kê...</span>
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

  if (!stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8">
          <div className="text-center">
            <BarChart className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p className="text-lg font-semibold">Chưa có dữ liệu thống kê</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Hoàn thành các bài thi để xem thống kê kết quả
            </p>
          </div>
          <Button onClick={() => router.push('/exams')} variant="outline">
            Đi đến danh sách bài thi
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
            <h1 className="text-2xl font-bold tracking-tight">Thống kê kết quả</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Phân tích chi tiết kết quả các bài thi đã hoàn thành
            </p>
          </div>
          
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới dữ liệu
          </Button>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Điểm trung bình
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore.toFixed(1)}%</div>
              <Progress 
                value={stats.averageScore} 
                className="h-1.5 mt-2" 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Điểm cao nhất
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-500">
                {stats.bestScore.toFixed(1)}%
              </div>
              <Progress 
                value={stats.bestScore} 
                className="h-1.5 mt-2 bg-green-100 dark:bg-green-900/20" 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Tổng số bài thi thử
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              <div className="text-2xl font-bold">{stats.practiceExams}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Tổng số bài thi chính thức
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-500" />
              <div className="text-2xl font-bold">{stats.officialExams}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">
              <PieChart className="w-4 h-4 mr-2" />
              Tổng quan
            </TabsTrigger>
            <TabsTrigger value="subjects">
              <BookOpen className="w-4 h-4 mr-2" />
              Theo môn học
            </TabsTrigger>
            <TabsTrigger value="progress">
              <LineChart className="w-4 h-4 mr-2" />
              Tiến độ
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Score Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Phân bố điểm số</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Xuất sắc (85-100%)</span>
                        <span className="text-sm font-medium">
                          {stats.scoreDistribution.excellent} bài thi
                        </span>
                      </div>
                      <Progress 
                        value={(stats.scoreDistribution.excellent / completedExams.length) * 100} 
                        className="h-2 bg-blue-100 dark:bg-blue-900/20" 
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Khá (70-84%)</span>
                        <span className="text-sm font-medium">
                          {stats.scoreDistribution.good} bài thi
                        </span>
                      </div>
                      <Progress 
                        value={(stats.scoreDistribution.good / completedExams.length) * 100} 
                        className="h-2 bg-green-100 dark:bg-green-900/20" 
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Trung bình (50-69%)</span>
                        <span className="text-sm font-medium">
                          {stats.scoreDistribution.average} bài thi
                        </span>
                      </div>
                      <Progress 
                        value={(stats.scoreDistribution.average / completedExams.length) * 100} 
                        className="h-2 bg-yellow-100 dark:bg-yellow-900/20" 
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Yếu (0-49%)</span>
                        <span className="text-sm font-medium">
                          {stats.scoreDistribution.poor} bài thi
                        </span>
                      </div>
                      <Progress 
                        value={(stats.scoreDistribution.poor / completedExams.length) * 100} 
                        className="h-2 bg-red-100 dark:bg-red-900/20" 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Exams */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Bài thi gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.recentExams.map((exam, index) => {
                      const previousExam = index < stats.recentExams.length - 1 
                        ? stats.recentExams[index + 1] 
                        : null;
                      
                      return (
                        <div 
                          key={exam.studentExamId} 
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center",
                              exam.exam.examType === 'practice' 
                                ? "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" 
                                : "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                            )}>
                              {exam.exam.examType === 'practice' 
                                ? <Target className="w-5 h-5" /> 
                                : <GraduationCap className="w-5 h-5" />
                              }
                            </div>
                            <div>
                              <div className="font-medium">{exam.exam.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {format(parseISO(exam.result.submittedAt), 'dd/MM/yyyy', { locale: vi })}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-bold">{exam.result.scorePercentage}%</div>
                            {previousExam && getTrendIndicator(
                              exam.result.scorePercentage, 
                              previousExam.result.scorePercentage
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Subjects Tab */}
          <TabsContent value="subjects" className="space-y-4">
            {Object.values(stats.examsBySubject).length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[200px] gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8">
                <div className="text-center">
                  <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-lg font-semibold">Chưa có dữ liệu theo môn học</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(stats.examsBySubject).map((subject) => (
                  <Card key={subject.name}>
                    <CardHeader>
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Số bài thi đã hoàn thành</span>
                          <span className="font-medium">{subject.count}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Điểm trung bình</span>
                          <span className="font-medium">
                            {(subject.totalScore / subject.count).toFixed(1)}%
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Điểm cao nhất</span>
                          <span className="font-medium text-green-600 dark:text-green-500">
                            {Math.max(...subject.scores).toFixed(1)}%
                          </span>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">Tiến độ</span>
                            <span className="text-sm font-medium">
                              {(subject.totalScore / subject.count).toFixed(1)}%
                            </span>
                          </div>
                          <Progress 
                            value={subject.totalScore / subject.count} 
                            className="h-2" 
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tiến độ theo tháng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-end justify-between gap-2">
                  {stats.monthlyData.map((month) => (
                    <div key={month.month} className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full flex flex-col items-center">
                        <div 
                          className="w-full bg-blue-500 rounded-t-sm" 
                          style={{ 
                            height: `${month.averageScore * 0.6}px`,
                            minHeight: month.averageScore > 0 ? '4px' : '0px'
                          }}
                        ></div>
                        <div className="text-xs font-medium mt-1">
                          {month.count > 0 ? `${month.averageScore.toFixed(0)}%` : '-'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {month.count} bài thi
                        </div>
                      </div>
                      <div className="text-xs font-medium mt-2">{month.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Phân tích tiến độ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Số bài thi trung bình/tháng</div>
                    <div className="text-2xl font-bold mt-1">
                      {(completedExams.length / Math.max(1, stats.monthlyData.filter(m => m.count > 0).length)).toFixed(1)}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Xu hướng điểm số</div>
                    <div className="text-2xl font-bold mt-1 flex items-center">
                      {stats.monthlyData[stats.monthlyData.length - 1].averageScore > 
                       stats.monthlyData[0].averageScore ? (
                        <div className="flex items-center text-green-600">
                          <ArrowUpRight className="w-5 h-5 mr-1" />
                          <span>Tăng</span>
                        </div>
                      ) : stats.monthlyData[stats.monthlyData.length - 1].averageScore < 
                          stats.monthlyData[0].averageScore ? (
                        <div className="flex items-center text-red-600">
                          <ArrowDownRight className="w-5 h-5 mr-1" />
                          <span>Giảm</span>
                        </div>
                      ) : (
                        <span>Ổn định</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Tháng tốt nhất</div>
                    <div className="text-2xl font-bold mt-1">
                      {stats.monthlyData
                        .filter(m => m.count > 0)
                        .sort((a, b) => b.averageScore - a.averageScore)[0]?.label || 'N/A'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ExamStatisticsPage;