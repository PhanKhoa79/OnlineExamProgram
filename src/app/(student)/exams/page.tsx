'use client';

import { useEffect, useState } from 'react';
import { getExamsByType } from '@/features/exam/services/examServices';
import { ExamDto } from '@/features/exam/types/exam.type';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  FileText, 
  BookOpen, 
  Target,
  GraduationCap,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { usePageTitle } from '@/hooks/usePageTitle';

const ExamsOverviewPage = () => {
  usePageTitle('Bài thi');
  const [practiceExams, setPracticeExams] = useState<ExamDto[]>([]);
  const [officialExams, setOfficialExams] = useState<ExamDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExams = async () => {
    try {
      setLoading(true);
      setError(null);
      const [practiceData, officialData] = await Promise.all([
        getExamsByType('practice'),
        getExamsByType('official')
      ]);
      setPracticeExams(practiceData);
      setOfficialExams(officialData);
    } catch (err) {
      setError('Không thể tải danh sách bài thi. Vui lòng thử lại.');
      console.error('Error fetching exams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Đang tải danh sách bài thi...</span>
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
          <Button onClick={fetchExams} variant="outline">
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
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Bài thi
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Danh sách tất cả các bài thi khả dụng
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              {practiceExams.length} bài thi thử
            </Badge>
            <Badge variant="default" className="text-sm">
              {officialExams.length} bài thi chính thức
            </Badge>
          </div>
          <Button onClick={fetchExams} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Bài thi thử
                </p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {practiceExams.length}
                </p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Bài thi chính thức
                </p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {officialExams.length}
                </p>
              </div>
              <GraduationCap className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  Tổng bài thi
                </p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {practiceExams.length + officialExams.length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Practice Exams Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Bài thi thử
            </h2>
            <Badge variant="secondary">
              {practiceExams.length}
            </Badge>
          </div>
          <Link href="/exams/practice">
            <Button variant="outline" size="sm">
              Xem tất cả
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {practiceExams.length === 0 ? (
          <Card className="p-8 text-center">
            <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">
              Chưa có bài thi thử nào được tạo
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {practiceExams.slice(0, 3).map((exam) => (
              <Card 
                key={exam.id} 
                className="group hover:shadow-lg transition-all duration-200 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      Bài thi thử
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-semibold line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {exam.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <BookOpen className="w-3 h-3" />
                    <span className="text-xs">{exam.subject.name}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-500" />
                      <span>{exam.duration}p</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3 text-green-500" />
                      <span>{exam.totalQuestions} câu</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Official Exams Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Bài thi chính thức
            </h2>
            <Badge variant="default">
              {officialExams.length}
            </Badge>
          </div>
          <Link href="/exams/official">
            <Button variant="outline" size="sm">
              Xem tất cả
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Important Notice */}
        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Bài thi chính thức sẽ được tính điểm và không thể làm lại
            </p>
          </div>
        </div>

        {officialExams.length === 0 ? (
          <Card className="p-8 text-center">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">
              Chưa có bài thi chính thức nào được tạo
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {officialExams.slice(0, 3).map((exam) => (
              <Card 
                key={exam.id} 
                className="group hover:shadow-lg transition-all duration-200 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm ring-1 ring-blue-200/50 dark:ring-blue-800/50"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="default" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Bài thi chính thức
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-semibold line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {exam.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <BookOpen className="w-3 h-3" />
                    <span className="text-xs">{exam.subject.name}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-500" />
                      <span>{exam.duration}p</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3 text-green-500" />
                      <span>{exam.totalQuestions} câu</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamsOverviewPage; 