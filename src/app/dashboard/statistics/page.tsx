'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, TrendingUp, TrendingDown, Users, BookOpen, Target, CheckCircle } from 'lucide-react';
import { getAnalyticsSummary, getScoreTrends, getSubjectPerformance } from '@/features/exam/services/examServices';
import { toast } from 'sonner';
import { AnalyticsSummary, ScoreTrendsResponse, SubjectPerformanceResponse, ScoreTrendsQuery } from '@/features/exam/types/report.type';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePageTitle } from '@/hooks/usePageTitle';
import ExamVolumeAnalytics from '@/features/exam/components/ExamVolumeAnalytics';
import ScoreStatisticsAnalytics from '@/features/exam/components/ScoreStatisticsAnalytics';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Types for analytics summar

export default function StatisticsPage() {
  usePageTitle('Thống kê hệ thống');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsSummary | null>(null);
  const [scoreTrendsData, setScoreTrendsData] = useState<ScoreTrendsResponse | null>(null);
  const [subjectPerformanceData, setSubjectPerformanceData] = useState<SubjectPerformanceResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // Fetch analytics data
  const fetchAnalyticsData = async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      
      // Create query objects with proper typing
      const scoreTrendsQuery: ScoreTrendsQuery = { 
        period, 
        range: period === 'daily' ? 30 : period === 'weekly' ? 12 : 6 
      };

      // Fetch core analytics first (these are stable)
      const [analyticsResponse, scoreTrendsResponse, subjectPerformanceResponse] = await Promise.all([
        getAnalyticsSummary(),
        getScoreTrends(scoreTrendsQuery),
        getSubjectPerformance()
      ]);

      setAnalyticsData(analyticsResponse);
      setScoreTrendsData(scoreTrendsResponse);
      setSubjectPerformanceData(subjectPerformanceResponse);

    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error("Không thể tải dữ liệu thống kê cơ bản");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAnalyticsData(true);
  }, []);

  // Separate effect for period changes with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!isLoading) { // Only fetch if not in initial loading
        fetchAnalyticsData(false);
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(timeoutId);
  }, [period]);

  const handleDataRefresh = useCallback(() => {
    fetchAnalyticsData(false);
  }, []);

  // Format number for display
  const formatNumber = useCallback((num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  }, []);

  // Chart options for doughnut chart
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#111827',
        bodyColor: '#4B5563',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context: { label?: string; parsed?: number }) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${value}%`;
          }
        }
      },
    },
    cutout: '60%',
  };

  // Chart options for line chart
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 10,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#111827',
        bodyColor: '#4B5563',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  // Chart options for bar chart
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 10,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#111827',
        bodyColor: '#4B5563',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
    },
  };

  // Data for pass rate doughnut chart
  const passRateData = useMemo(() => {
    return analyticsData ? {
      labels: ['Đậu', 'Rớt'],
      datasets: [
        {
          data: [analyticsData.passRate, 100 - analyticsData.passRate],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(239, 68, 68, 0.8)',
          ],
          borderWidth: 2,
          borderColor: ['#22c55e', '#ef4444'],
        }
      ],
    } : null;
  }, [analyticsData]);

  // Data for completion rate doughnut chart
  const completionRateData = useMemo(() => {
    return analyticsData ? {
      labels: ['Hoàn thành', 'Chưa hoàn thành'],
      datasets: [
        {
          data: [analyticsData.completionRate, 100 - analyticsData.completionRate],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(156, 163, 175, 0.3)',
          ],
          borderWidth: 2,
          borderColor: ['#3b82f6', '#9ca3af'],
        }
      ],
    } : null;
  }, [analyticsData]);

  // Data for score trends line chart
  const scoreTrendsLineData = scoreTrendsData ? {
    labels: scoreTrendsData.labels,
    datasets: [
      {
        label: 'Điểm trung bình',
        data: scoreTrendsData.datasets.averageScores,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Điểm luyện tập',
        data: scoreTrendsData.datasets.practiceScores,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Điểm chính thức',
        data: scoreTrendsData.datasets.officialScores,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.3,
        fill: false,
      },
    ],
  } : null;

  // Data for subject performance bar chart
  const subjectPerformanceBarData = subjectPerformanceData ? {
    labels: subjectPerformanceData.subjects.map(subject => subject.name),
    datasets: [
      {
        label: 'Điểm trung bình',
        data: subjectPerformanceData.subjects.map(subject => subject.averageScore),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Tỷ lệ đậu (%)',
        data: subjectPerformanceData.subjects.map(subject => subject.passRate),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
        borderRadius: 4,
      }
    ],
  } : null;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-gray-500">
          Không thể tải dữ liệu thống kê
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Báo cáo & Thống kê</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Phân tích chi tiết về kết quả thi của học sinh
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {isRefreshing && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <RefreshCw size={14} className="animate-spin" />
              <span>Đang cập nhật...</span>
            </div>
          )}
          <Button 
            className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
            onClick={handleDataRefresh}
            disabled={isLoading || isRefreshing}
          >
            <RefreshCw size={16} className={isLoading || isRefreshing ? 'animate-spin' : ''} />
            <span>Làm mới dữ liệu</span>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Exams Card */}
        <Card className="group hover:scale-105 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng số bài thi</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  {formatNumber(analyticsData.totalExams)}
                </p>
                <div className="flex items-center mt-2">
                  {analyticsData.weeklyGrowth.exams >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${analyticsData.weeklyGrowth.exams >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {analyticsData.weeklyGrowth.exams > 0 ? '+' : ''}{analyticsData.weeklyGrowth.exams} tuần này
                  </span>
                </div>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg group-hover:scale-110 transition-transform">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Students Card */}
        <Card className="group hover:scale-105 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng số học sinh</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">
                  {formatNumber(analyticsData.totalStudents)}
                </p>
                <div className="flex items-center mt-2">
                  {analyticsData.weeklyGrowth.students >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${analyticsData.weeklyGrowth.students >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {analyticsData.weeklyGrowth.students > 0 ? '+' : ''}{analyticsData.weeklyGrowth.students} tuần này
                  </span>
                </div>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Score Card */}
        <Card className="group hover:scale-105 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Điểm trung bình</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-yellow-600 transition-colors">
                  {analyticsData.averageScore.toFixed(1)}
                </p>
                <div className="flex items-center mt-2">
                  {analyticsData.weeklyGrowth.score >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${analyticsData.weeklyGrowth.score >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {analyticsData.weeklyGrowth.score > 0 ? '+' : ''}{analyticsData.weeklyGrowth.score}% tuần này
                  </span>
                </div>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg group-hover:scale-110 transition-transform">
                <Target className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pass Rate Card */}
        <Card className="group hover:scale-105 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tỷ lệ đậu</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
                  {analyticsData.passRate.toFixed(1)}%
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-500">
                    Tỷ lệ hoàn thành: {analyticsData.completionRate.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg group-hover:scale-110 transition-transform">
                <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section - First Row: Doughnut Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pass Rate Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tỷ lệ đậu/rớt</CardTitle>
            <CardDescription>
              Phân bố tỷ lệ học sinh đạt và không đạt yêu cầu
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-80">
              {passRateData && (
                <Doughnut data={passRateData} options={doughnutOptions} />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Completion Rate Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tỷ lệ hoàn thành bài thi</CardTitle>
            <CardDescription>
              Phân bố tỷ lệ học sinh hoàn thành và chưa hoàn thành bài thi
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-80">
              {completionRateData && (
                <Doughnut data={completionRateData} options={doughnutOptions} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section - Second Row: Line and Bar Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Score Trends Chart */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Xu hướng điểm số</CardTitle>
                <CardDescription>
                  Biểu đồ thể hiện xu hướng điểm số theo thời gian
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={period} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setPeriod(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Hàng ngày</SelectItem>
                    <SelectItem value="weekly">Hàng tuần</SelectItem>
                    <SelectItem value="monthly">Hàng tháng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-80">
              {scoreTrendsLineData && (
                <Line data={scoreTrendsLineData} options={lineChartOptions} />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Subject Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Hiệu suất theo môn học</CardTitle>
            <CardDescription>
              So sánh điểm trung bình và tỷ lệ đậu giữa các môn học
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-80">
              {subjectPerformanceBarData && (
                <Bar data={subjectPerformanceBarData} options={barChartOptions} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section - Third Row: New Analytics Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Exam Volume Analytics */}
        <ExamVolumeAnalytics />
        
        {/* Score Statistics Analytics */}
        <ScoreStatisticsAnalytics />
      </div>
    </div>
  );
} 