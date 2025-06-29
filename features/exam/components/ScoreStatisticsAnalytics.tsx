'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  TrendingUp, 
  Download, 
  RefreshCw, 
  BarChart3, 
  LineChart, 
  PieChart,
  Filter,
  BookOpen,
  GraduationCap,
  Target,
  Award,
  CheckCircle2
} from 'lucide-react';
import { getScoreStatistics } from '@/features/exam/services/examServices';
import { getAllClasses } from '@/features/classes/services/classServices';
import { getAllSubjects } from '@/features/subject/services/subjectServices';
import { getAllStudents } from '@/features/student/services/studentService';
import { ScoreStatisticsResponse, ScoreStatisticsQuery } from '@/features/exam/types/report.type';
import { ClassResponseDto } from '@/features/classes/types/class.type';
import { SubjectResponseDto } from '@/features/subject/types/subject';
import { StudentDto } from '@/features/student/types/student';
import { toast } from 'sonner';
import { format, subDays, subMonths } from 'date-fns';

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

interface ScoreStatisticsAnalyticsProps {
  className?: string;
}

type TimeRangeType = 'all' | 'specific' | 'range';
type ChartType = 'line' | 'bar' | 'pie';
type ExamType = 'all' | 'practice' | 'official';
type GroupBy = 'daily' | 'weekly' | 'monthly';

export default function ScoreStatisticsAnalytics({ className }: ScoreStatisticsAnalyticsProps) {
  // State for data
  const [scoreData, setScoreData] = useState<ScoreStatisticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // State for filter options
  const [classes, setClasses] = useState<ClassResponseDto[]>([]);
  const [subjects, setSubjects] = useState<SubjectResponseDto[]>([]);
  const [students, setStudents] = useState<StudentDto[]>([]);

  // State for filters
  const [timeRangeType, setTimeRangeType] = useState<TimeRangeType>('range');
  const [specificDate, setSpecificDate] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(format(subMonths(new Date(), 1), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [examType, setExamType] = useState<ExamType>('all');
  const [selectedClassIds, setSelectedClassIds] = useState<number[]>([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [groupBy, setGroupBy] = useState<GroupBy>('daily');
  const [chartType, setChartType] = useState<ChartType>('line');

  // Load filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [classesRes, subjectsRes, studentsRes] = await Promise.all([
          getAllClasses(),
          getAllSubjects(),
          getAllStudents()
        ]);
        setClasses(classesRes);
        setSubjects(subjectsRes);
        setStudents(studentsRes);
      } catch (error) {
        console.error('Error loading filter options:', error);
        toast.error('Không thể tải dữ liệu bộ lọc');
      }
    };

    loadFilterOptions();
  }, []);

  // Fetch score statistics data
  const fetchScoreData = async () => {
    setIsLoading(true);
    try {
      const params: ScoreStatisticsQuery = {
        examType: examType
      };

      // Handle time range
      if (timeRangeType === 'specific' && specificDate) {
        params.specificDate = specificDate;
      } else if (timeRangeType === 'range' && startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
        params.groupBy = groupBy;
      } else if (timeRangeType === 'all') {
        // For "all time", don't set date parameters but still include groupBy for potential aggregation
        params.groupBy = groupBy;
      }

      // Handle entity filters - always include these regardless of time range type
      if (selectedClassIds.length > 0) {
        params.classIds = selectedClassIds;
      }
      if (selectedSubjectIds.length > 0) {
        params.subjectIds = selectedSubjectIds;
      }
      if (selectedStudentIds.length > 0) {
        params.studentIds = selectedStudentIds;
      }

      console.log('Fetching score statistics with params:', params);

      const response = await getScoreStatistics(params);
      setScoreData(response);
      
      console.log('Score statistics response:', response);
    } catch (error) {
      console.error('Error fetching score statistics:', error);
      toast.error('Không thể tải dữ liệu thống kê điểm số');
      setScoreData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchScoreData();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    timeRangeType,
    specificDate,
    startDate,
    endDate,
    examType,
    selectedClassIds,
    selectedSubjectIds,
    selectedStudentIds,
    groupBy
  ]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchScoreData();
    setIsRefreshing(false);
    toast.success('Dữ liệu đã được cập nhật');
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setTimeRangeType('range');
    setStartDate(format(subMonths(new Date(), 1), 'yyyy-MM-dd'));
    setEndDate(format(new Date(), 'yyyy-MM-dd'));
    setSpecificDate('');
    setExamType('all');
    setSelectedClassIds([]);
    setSelectedSubjectIds([]);
    setSelectedStudentIds([]);
    setGroupBy('daily');
    setChartType('line');
    toast.success('Đã xóa tất cả bộ lọc');
  };

  // Quick date range presets
  const handleQuickDateRange = (days: number) => {
    const today = new Date();
    const end = new Date(today);
    
    let start: Date;
    let suggestedGroupBy: GroupBy;
    
    if (days === 7) {
      start = subDays(end, days - 1);
      suggestedGroupBy = 'daily';
    } else if (days === 30) {
      start = subDays(end, days - 1);
      suggestedGroupBy = 'daily';
    } else if (days === 90) {
      start = subMonths(end, 3);
      suggestedGroupBy = 'weekly';
    } else {
      start = subDays(end, days - 1);
      suggestedGroupBy = 'daily';
    }
    
    setStartDate(format(start, 'yyyy-MM-dd'));
    setEndDate(format(end, 'yyyy-MM-dd'));
    setGroupBy(suggestedGroupBy);
    setTimeRangeType('range');
  };

  // Export functionality
  const handleExport = () => {
    if (!scoreData || !scoreData.data) {
      toast.error('Không có dữ liệu để xuất');
      return;
    }

    const headers = ['Thời gian', 'Điểm TB Luyện tập', 'Điểm TB Chính thức', 'Điểm TB Tổng thể'];
    const rows = scoreData.data.map(item => [
      item.date,
      item.practiceStats.averageScore.toFixed(1),
      item.officialStats.averageScore.toFixed(1),
      item.overallStats.averageScore.toFixed(1)
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `score-statistics-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();

    toast.success('Đã xuất báo cáo thành công');
  };

  // Determine effective chart type (force bar chart for single data points)
  const effectiveChartType = useMemo(() => {
    if (timeRangeType === 'all' && (!scoreData?.data || scoreData.data.length <= 1)) {
      return chartType === 'pie' ? 'pie' : 'bar';
    }
    return chartType;
  }, [chartType, timeRangeType, scoreData]);

  // Chart data processing
  const chartData = useMemo(() => {
    if (!scoreData) {
      return null;
    }

    // If we have summary but no time series data, create chart from summary
    if (!scoreData.data || scoreData.data.length === 0) {
      if (!scoreData.summary) {
        return null;
      }

      // For "all time" view, create bar chart from summary data
      if (timeRangeType === 'all' || effectiveChartType === 'pie') {
        if (effectiveChartType === 'pie') {
          // For pie chart, show score distribution from summary
          return {
            labels: ['Xuất sắc (90-100)', 'Giỏi (80-89)', 'Khá (70-79)', 'Trung bình (60-69)', 'Yếu (<60)'],
            datasets: [{
              data: [
                scoreData.summary.practiceExams.scoreDistribution.excellent + scoreData.summary.officialExams.scoreDistribution.excellent,
                scoreData.summary.practiceExams.scoreDistribution.good + scoreData.summary.officialExams.scoreDistribution.good,
                scoreData.summary.practiceExams.scoreDistribution.average + scoreData.summary.officialExams.scoreDistribution.average,
                scoreData.summary.practiceExams.scoreDistribution.belowAverage + scoreData.summary.officialExams.scoreDistribution.belowAverage,
                scoreData.summary.practiceExams.scoreDistribution.poor + scoreData.summary.officialExams.scoreDistribution.poor,
              ],
              backgroundColor: [
                'rgba(34, 197, 94, 0.8)',   // Green for excellent
                'rgba(59, 130, 246, 0.8)',  // Blue for good
                'rgba(251, 191, 36, 0.8)',  // Yellow for average
                'rgba(249, 115, 22, 0.8)',  // Orange for below average
                'rgba(239, 68, 68, 0.8)',   // Red for poor
              ],
              borderWidth: 2,
              borderColor: '#ffffff',
            }]
          };
        } else {
          // For bar/line chart with no time series, show overall averages
          const datasets = [];
          const labels = ['Tổng quan'];

          if (examType === 'all' || examType === 'practice') {
            datasets.push({
              label: 'Điểm TB Luyện tập',
              data: [scoreData.summary.practiceExams.averageScore],
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              tension: 0.1,
              fill: effectiveChartType === 'line' ? false : true,
            });
          }

          if (examType === 'all' || examType === 'official') {
            datasets.push({
              label: 'Điểm TB Chính thức',
              data: [scoreData.summary.officialExams.averageScore],
              borderColor: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              tension: 0.1,
              fill: effectiveChartType === 'line' ? false : true,
            });
          }

          // Add min/max reference lines for summary data
          const minScore = Math.min(
            scoreData.summary.practiceExams.minScore,
            scoreData.summary.officialExams.minScore
          );
          const maxScore = Math.max(
            scoreData.summary.practiceExams.maxScore,
            scoreData.summary.officialExams.maxScore
          );

          datasets.push({
            label: `🟢 Điểm cao nhất (${maxScore})`,
            data: [maxScore],
            borderColor: 'rgba(34, 197, 94, 0.8)',
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            borderDash: [8, 4],
            borderWidth: 3,
            pointBackgroundColor: 'rgba(34, 197, 94, 1)',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6,
          });

          datasets.push({
            label: `🔴 Điểm thấp nhất (${minScore})`,
            data: [minScore],
            borderColor: 'rgba(239, 68, 68, 0.8)',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            borderDash: [8, 4],
            borderWidth: 3,
            pointBackgroundColor: 'rgba(239, 68, 68, 1)',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6,
          });

          return {
            labels,
            datasets
          };
        }
      }
    }

    // Regular time series data processing
    if (effectiveChartType === 'pie') {
      // For pie chart, show score distribution from summary
      return {
        labels: ['Xuất sắc (90-100)', 'Giỏi (80-89)', 'Khá (70-79)', 'Trung bình (60-69)', 'Yếu (<60)'],
        datasets: [{
          data: [
            scoreData.summary.practiceExams.scoreDistribution.excellent + scoreData.summary.officialExams.scoreDistribution.excellent,
            scoreData.summary.practiceExams.scoreDistribution.good + scoreData.summary.officialExams.scoreDistribution.good,
            scoreData.summary.practiceExams.scoreDistribution.average + scoreData.summary.officialExams.scoreDistribution.average,
            scoreData.summary.practiceExams.scoreDistribution.belowAverage + scoreData.summary.officialExams.scoreDistribution.belowAverage,
            scoreData.summary.practiceExams.scoreDistribution.poor + scoreData.summary.officialExams.scoreDistribution.poor,
          ],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',   // Green for excellent
            'rgba(59, 130, 246, 0.8)',  // Blue for good
            'rgba(251, 191, 36, 0.8)',  // Yellow for average
            'rgba(249, 115, 22, 0.8)',  // Orange for below average
            'rgba(239, 68, 68, 0.8)',   // Red for poor
          ],
          borderWidth: 2,
          borderColor: '#ffffff',
        }]
      };
    }

    // For line and bar charts, show score trends
    const filteredData = scoreData.data.filter(item => {
      if (examType === 'practice') return item.practiceStats.count > 0;
      if (examType === 'official') return item.officialStats.count > 0;
      return item.overallStats.count > 0;
    });

    const datasets = [];

    if (examType === 'all' || examType === 'practice') {
      datasets.push({
        label: 'Điểm TB Luyện tập',
        data: filteredData.map(item => item.practiceStats.averageScore),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.1,
        fill: effectiveChartType === 'line' ? false : true,
      });
    }

    if (examType === 'all' || examType === 'official') {
      datasets.push({
        label: 'Điểm TB Chính thức',
        data: filteredData.map(item => item.officialStats.averageScore),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        tension: 0.1,
        fill: effectiveChartType === 'line' ? false : true,
      });
    }

    if (examType === 'all') {
      datasets.push({
        label: 'Điểm TB Tổng thể',
        data: filteredData.map(item => item.overallStats.averageScore),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        tension: 0.1,
        fill: effectiveChartType === 'line' ? false : true,
      });
    }

    // Add reference lines for min/max scores if we have data
    if (filteredData.length > 1 && scoreData.summary) {
      const minScore = Math.min(
        scoreData.summary.practiceExams.minScore,
        scoreData.summary.officialExams.minScore
      );
      const maxScore = Math.max(
        scoreData.summary.practiceExams.maxScore,
        scoreData.summary.officialExams.maxScore
      );

      // Add max score reference line
      datasets.push({
        label: `🟢 Điểm cao nhất (${maxScore})`,
        data: filteredData.map(() => maxScore),
        borderColor: 'rgba(34, 197, 94, 0.6)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
        tension: 0,
      });

      // Add min score reference line
      datasets.push({
        label: `🔴 Điểm thấp nhất (${minScore})`,
        data: filteredData.map(() => minScore),
        borderColor: 'rgba(239, 68, 68, 0.6)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
        tension: 0,
      });
    }

    return {
      labels: filteredData.map(item => item.date),
      datasets
    };
  }, [scoreData, effectiveChartType, examType, timeRangeType]);

  // Chart options
  const chartOptions = useMemo(() => {
    if (effectiveChartType === 'pie') {
      return {
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
              label: (context: any) => {
                const label = context.label || '';
                const value = context.parsed || 0;
                return `${label}: ${value} học sinh`;
              }
            }
          },
        },
        cutout: effectiveChartType === 'pie' ? 0 : '60%',
      };
    }

    // Get min/max scores for reference lines
    const minScore = scoreData ? Math.min(
      scoreData.summary.practiceExams.minScore,
      scoreData.summary.officialExams.minScore
    ) : 0;
    
    const maxScore = scoreData ? Math.max(
      scoreData.summary.practiceExams.maxScore,
      scoreData.summary.officialExams.maxScore
    ) : 100;

    return {
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
          callbacks: {
            title: (context: any) => {
              return `${context[0].label}`;
            },
            label: (context: any) => {
              const label = context.dataset.label || '';
              const value = context.parsed.y || 0;
              return `${label}: ${value.toFixed(1)} điểm`;
            },
            afterBody: (context: any) => {
              if (scoreData?.summary) {
                return [
                  '',
                  `📊 Thống kê tổng quan:`,
                  `🔴 Điểm cao nhất: ${maxScore} điểm`,
                  `🔴 Điểm thấp nhất: ${minScore} điểm`,
                  `📈 Điểm TB Luyện tập: ${scoreData.summary.practiceExams.averageScore.toFixed(1)}`,
                  `📋 Điểm TB Chính thức: ${scoreData.summary.officialExams.averageScore.toFixed(1)}`
                ];
              }
              return [];
            }
          }
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
          ticks: {
            callback: function(value: unknown) {
              return `${value} điểm`;
            }
          }
        },
      },
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      // Add reference lines for min/max scores
      elements: {
        point: {
          backgroundColor: (context: any) => {
            const value = context.parsed?.y;
            if (value === maxScore) return 'rgba(34, 197, 94, 1)'; // Green for max
            if (value === minScore) return 'rgba(239, 68, 68, 1)';  // Red for min
            return context.dataset.borderColor;
          },
          borderColor: (context: any) => {
            const value = context.parsed?.y;
            if (value === maxScore) return 'rgba(34, 197, 94, 1)';
            if (value === minScore) return 'rgba(239, 68, 68, 1)';
            return context.dataset.borderColor;
          },
          radius: (context: any) => {
            const value = context.parsed?.y;
            if (value === maxScore || value === minScore) return 8;
            return 4;
          }
        }
      }
    };
  }, [effectiveChartType, scoreData]);

  return (
    <div className={className}>
      {/* Filter Panel */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              <CardTitle>Phân tích điểm số chi tiết</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Xóa bộ lọc
              </Button>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} disabled={!scoreData}>
                <Download className="h-4 w-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Time Range Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Lọc theo thời gian</Label>
            <RadioGroup
              value={timeRangeType}
              onValueChange={(value) => setTimeRangeType(value as TimeRangeType)}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all-time" />
                <Label htmlFor="all-time" className="text-sm">Tất cả thời gian</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="specific" id="specific-date" />
                <Label htmlFor="specific-date" className="text-sm">Ngày cụ thể</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="range" id="date-range" />
                <Label htmlFor="date-range" className="text-sm">Khoảng thời gian</Label>
              </div>
            </RadioGroup>

            {timeRangeType === 'specific' && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={specificDate}
                  onChange={(e) => setSpecificDate(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            )}

            {timeRangeType === 'range' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <span className="text-sm text-muted-foreground">đến</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleQuickDateRange(7)}>
                    7 ngày qua
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleQuickDateRange(30)}>
                    30 ngày qua
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleQuickDateRange(90)}>
                    3 tháng qua
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Exam Type Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Loại đề thi</Label>
              <Select value={examType} onValueChange={(value) => setExamType(value as ExamType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại đề thi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="practice">Đề luyện tập</SelectItem>
                  <SelectItem value="official">Đề chính thức</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Group By Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nhóm theo</Label>
              <Select value={groupBy} onValueChange={(value) => setGroupBy(value as GroupBy)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn cách nhóm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Theo ngày</SelectItem>
                  <SelectItem value="weekly">Theo tuần</SelectItem>
                  <SelectItem value="monthly">Theo tháng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Chart Type Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Loại biểu đồ</Label>
              <Select 
                value={chartType} 
                onValueChange={(value) => setChartType(value as ChartType)}
                disabled={timeRangeType === 'all' && (!scoreData?.data || scoreData.data.length <= 1) && chartType !== 'pie'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại biểu đồ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">
                    <div className="flex items-center gap-2">
                      <LineChart className="h-4 w-4" />
                      Biểu đồ đường
                    </div>
                  </SelectItem>
                  <SelectItem value="bar">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Biểu đồ cột
                    </div>
                  </SelectItem>
                  <SelectItem value="pie">
                    <div className="flex items-center gap-2">
                      <PieChart className="h-4 w-4" />
                      Biểu đồ tròn
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {timeRangeType === 'all' && (!scoreData?.data || scoreData.data.length <= 1) && chartType !== 'pie' && (
                <p className="text-xs text-muted-foreground">
                  Chỉ hỗ trợ biểu đồ cột cho dữ liệu tổng quan
                </p>
              )}
            </div>
          </div>

          {/* Multi-select filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Lớp học
              </Label>
              <Select 
                value={selectedClassIds.length === 1 ? selectedClassIds[0].toString() : "all"}
                onValueChange={(value) => {
                  if (value === "all") {
                    setSelectedClassIds([]);
                  } else {
                    setSelectedClassIds([parseInt(value)]);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn lớp học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả lớp học</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Môn học
              </Label>
              <Select 
                value={selectedSubjectIds.length === 1 ? selectedSubjectIds[0].toString() : "all"}
                onValueChange={(value) => {
                  if (value === "all") {
                    setSelectedSubjectIds([]);
                  } else {
                    setSelectedSubjectIds([parseInt(value)]);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn môn học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả môn học</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {scoreData?.summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Điểm TB Luyện tập</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {scoreData.summary.practiceExams.averageScore.toFixed(1)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {scoreData.summary.practiceExams.totalCount} bài thi
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Target className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Điểm TB Chính thức</p>
                    <p className="text-2xl font-bold text-red-600">
                      {scoreData.summary.officialExams.averageScore.toFixed(1)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {scoreData.summary.officialExams.totalCount} bài thi
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                    <Award className="h-4 w-4 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Chênh lệch điểm</p>
                    <p className={`text-2xl font-bold ${scoreData.summary.comparison.averageScoreDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {scoreData.summary.comparison.averageScoreDifference > 0 ? '+' : ''}{scoreData.summary.comparison.averageScoreDifference.toFixed(1)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Practice vs Official
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Xu hướng</p>
                    <p className="text-lg font-medium text-purple-600">
                      {scoreData.summary.comparison.performanceTrend === 'practice_better' ? 'LT tốt hơn' :
                       scoreData.summary.comparison.performanceTrend === 'official_better' ? 'CT tốt hơn' : 'Tương đương'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Performance trend
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
      )}

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Phân tích điểm số chi tiết</CardTitle>
          <CardDescription>
            {isLoading ? 'Đang tải dữ liệu...' : 
             chartType === 'pie' ? 'Phân phối điểm số theo mức độ' : 'Xu hướng điểm số theo thời gian'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">Đang tải dữ liệu...</span>
              </div>
            ) : !chartData ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Không có dữ liệu để hiển thị</p>
              </div>
            ) : (
              <>
                {effectiveChartType === 'line' && <Line data={chartData} options={chartOptions as any} />}
                {effectiveChartType === 'bar' && <Bar data={chartData} options={chartOptions as any} />}
                {effectiveChartType === 'pie' && <Pie data={chartData} options={chartOptions as any} />}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      {((timeRangeType === 'all' && scoreData?.summary) || scoreData?.data) && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Bảng dữ liệu chi tiết</CardTitle>
            <CardDescription>
              {timeRangeType === 'all' 
                ? 'Tổng quan dữ liệu điểm số tất cả thời gian'
                : `Dữ liệu điểm số theo ${groupBy === 'daily' ? 'ngày' : groupBy === 'weekly' ? 'tuần' : 'tháng'}`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Thời gian</th>
                    <th className="text-right p-2">Điểm TB Luyện tập</th>
                    <th className="text-right p-2">Điểm TB Chính thức</th>
                    <th className="text-right p-2">Điểm TB Tổng thể</th>
                    <th className="text-right p-2">Số bài LT</th>
                    <th className="text-right p-2">Số bài CT</th>
                    <th className="text-right p-2">Điểm cao nhất</th>
                    <th className="text-right p-2">Điểm thấp nhất</th>
                  </tr>
                </thead>
                <tbody>
                  {timeRangeType === 'all' && scoreData?.summary ? (
                    <tr className="border-b">
                      <td className="p-2 font-medium">Tất cả thời gian</td>
                      <td className="p-2 text-right text-blue-600 font-medium">
                        {scoreData.summary.practiceExams.averageScore.toFixed(1)}
                      </td>
                      <td className="p-2 text-right text-red-600 font-medium">
                        {scoreData.summary.officialExams.averageScore.toFixed(1)}
                      </td>
                      <td className="p-2 text-right text-green-600 font-medium">
                        {((scoreData.summary.practiceExams.averageScore + scoreData.summary.officialExams.averageScore) / 2).toFixed(1)}
                      </td>
                      <td className="p-2 text-right text-blue-500">
                        {scoreData.summary.practiceExams.totalCount}
                      </td>
                      <td className="p-2 text-right text-red-500">
                        {scoreData.summary.officialExams.totalCount}
                      </td>
                      <td className="p-2 text-right text-green-600 font-medium">
                        {Math.max(
                          scoreData.summary.practiceExams.maxScore,
                          scoreData.summary.officialExams.maxScore
                        )}
                      </td>
                      <td className="p-2 text-right text-red-600 font-medium">
                        {Math.min(
                          scoreData.summary.practiceExams.minScore,
                          scoreData.summary.officialExams.minScore
                        )}
                      </td>
                    </tr>
                  ) : (
                    scoreData?.data?.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="p-2 font-medium">{item.date}</td>
                        <td className="p-2 text-right text-blue-600">
                          {item.practiceStats.averageScore.toFixed(1)}
                          <span className="text-xs text-gray-500 ml-1">
                            (±{item.practiceStats.standardDeviation.toFixed(1)})
                          </span>
                        </td>
                        <td className="p-2 text-right text-red-600">
                          {item.officialStats.averageScore.toFixed(1)}
                          <span className="text-xs text-gray-500 ml-1">
                            (±{item.officialStats.standardDeviation.toFixed(1)})
                          </span>
                        </td>
                        <td className="p-2 text-right text-green-600">
                          {item.overallStats.averageScore.toFixed(1)}
                          <span className="text-xs text-gray-500 ml-1">
                            (±{item.overallStats.standardDeviation.toFixed(1)})
                          </span>
                        </td>
                        <td className="p-2 text-right text-blue-500">
                          {item.practiceStats.count}
                        </td>
                        <td className="p-2 text-right text-red-500">
                          {item.officialStats.count}
                        </td>
                        <td className="p-2 text-right text-green-600">
                          {Math.max(item.practiceStats.maxScore, item.officialStats.maxScore)}
                        </td>
                        <td className="p-2 text-right text-red-600">
                          {Math.min(item.practiceStats.minScore, item.officialStats.minScore)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Summary */}
            {scoreData?.data && scoreData.data.length > 1 && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-muted-foreground">Tổng số ngày</p>
                    <p className="font-medium">{scoreData.data.length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Tổng bài LT</p>
                    <p className="font-medium text-blue-600">
                      {scoreData.data.reduce((sum, item) => sum + item.practiceStats.count, 0)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Tổng bài CT</p>
                    <p className="font-medium text-red-600">
                      {scoreData.data.reduce((sum, item) => sum + item.officialStats.count, 0)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Điểm TB chung</p>
                    <p className="font-medium text-green-600">
                      {(scoreData.data.reduce((sum, item) => sum + item.overallStats.averageScore, 0) / scoreData.data.length).toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}