'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Activity, 
  Download, 
  RefreshCw, 
  TrendingUp, 
  BarChart3, 
  LineChart, 
  AreaChart,
  Filter,
  Users,
  BookOpen,
  GraduationCap,
  Target
} from 'lucide-react';
import { getExamVolume } from '@/features/exam/services/examServices';
import { getAllClasses } from '@/features/classes/services/classServices';
import { getAllSubjects } from '@/features/subject/services/subjectServices';
import { getAllStudents } from '@/features/student/services/studentService';
import { ExamVolumeResponse, ExamVolumeQuery } from '@/features/exam/types/report.type';
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
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ExamVolumeAnalyticsProps {
  className?: string;
}

type TimeRangeType = 'all' | 'specific' | 'range';
type ChartType = 'line' | 'bar' | 'area';
type ExamType = 'all' | 'practice' | 'official';
type GroupBy = 'daily' | 'weekly' | 'monthly';

export default function ExamVolumeAnalytics({ className }: ExamVolumeAnalyticsProps) {
  // State for data
  const [examVolumeData, setExamVolumeData] = useState<ExamVolumeResponse | null>(null);
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
  const [chartType, setChartType] = useState<ChartType>('bar');

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

  // Fetch exam volume data
  const fetchExamVolumeData = async () => {
    setIsLoading(true);
    try {
      let params: ExamVolumeQuery | undefined;

      // Always build params object for filters
      params = {
        groupBy: groupBy,
        examType: examType
      };

      // Handle time range
      if (timeRangeType === 'specific' && specificDate) {
        params.specificDate = specificDate;
      } else if (timeRangeType === 'range' && startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }
      // For 'all' timeRangeType, don't add any date parameters

      // Handle entity filters (apply for all time range types)
      if (selectedClassIds.length > 0) {
        params.classIds = selectedClassIds;
      }
      if (selectedSubjectIds.length > 0) {
        params.subjectIds = selectedSubjectIds;
      }
      if (selectedStudentIds.length > 0) {
        params.studentIds = selectedStudentIds;
      }

      // For "all time" with no additional filters, we can pass empty params to get all data
      if (timeRangeType === 'all' && 
          selectedClassIds.length === 0 && 
          selectedSubjectIds.length === 0 && 
          selectedStudentIds.length === 0 &&
          examType === 'all') {
        // Only send minimal params for true "all time, all filters"
        params = { groupBy: groupBy };
      }
      
      const response = await getExamVolume(params);
      setExamVolumeData(response);
    } catch {
      toast.error('Không thể tải dữ liệu thống kê');
      setExamVolumeData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchExamVolumeData();
    }, 500); // Debounce 500ms

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
    await fetchExamVolumeData();
    setIsRefreshing(false);
    toast.success('Dữ liệu đã được cập nhật');
  };

  // Prepare chart data
  const chartData = useMemo(() => {
    // If timeRangeType is 'all' and we have summary data, use it for chart
    if (timeRangeType === 'all' && examVolumeData?.summary) {
      const labels = ['Tổng quan'];
      let practiceExams = [examVolumeData.summary.totalPractice || 0];
      let officialExams = [examVolumeData.summary.totalOfficial || 0];

      // Apply exam type filter for "all time" view
      if (examType === 'practice') {
        officialExams = [0]; // Hide official exams
      } else if (examType === 'official') {
        practiceExams = [0]; // Hide practice exams
      }
      
      return {
        labels,
        datasets: [
          {
            label: 'Bài luyện tập',
            data: practiceExams,
            backgroundColor: chartType === 'area' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2,
            borderRadius: chartType === 'bar' ? 4 : 0,
            fill: chartType === 'area',
            tension: 0.4,
            pointBackgroundColor: 'rgba(59, 130, 246, 1)',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: chartType === 'line' || chartType === 'area' ? 4 : 0,
            pointHoverRadius: 6,
          },
          {
            label: 'Bài chính thức',
            data: officialExams,
            backgroundColor: chartType === 'area' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.8)',
            borderColor: 'rgba(239, 68, 68, 1)',
            borderWidth: 2,
            borderRadius: chartType === 'bar' ? 4 : 0,
            fill: chartType === 'area',
            tension: 0.4,
            pointBackgroundColor: 'rgba(239, 68, 68, 1)',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: chartType === 'line' || chartType === 'area' ? 4 : 0,
            pointHoverRadius: 6,
          }
        ]
      };
    }

    // For specific time ranges, use data array
    if (!examVolumeData?.data || !Array.isArray(examVolumeData.data) || examVolumeData.data.length === 0) {
      return null;
    }

    const labels = examVolumeData.data.map(item => item.date);
    const practiceExams = examVolumeData.data.map(item => item.practiceCount || 0);
    const officialExams = examVolumeData.data.map(item => item.officialCount || 0);

    // Filter data based on exam type - data is already filtered by backend
    let practiceData = practiceExams;
    let officialData = officialExams;

    // Only hide data visually if user wants to see specific type
    if (examType === 'practice') {
      officialData = new Array(labels.length).fill(0);
    } else if (examType === 'official') {
      practiceData = new Array(labels.length).fill(0);
    }

    return {
      labels,
      datasets: [
        {
          label: 'Bài luyện tập',
          data: practiceData,
          backgroundColor: chartType === 'area' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          borderRadius: chartType === 'bar' ? 4 : 0,
          fill: chartType === 'area',
          tension: 0.4,
          pointBackgroundColor: 'rgba(59, 130, 246, 1)',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: chartType === 'line' || chartType === 'area' ? 4 : 0,
          pointHoverRadius: 6,
        },
        {
          label: 'Bài chính thức',
          data: officialData,
          backgroundColor: chartType === 'area' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 2,
          borderRadius: chartType === 'bar' ? 4 : 0,
          fill: chartType === 'area',
          tension: 0.4,
          pointBackgroundColor: 'rgba(239, 68, 68, 1)',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: chartType === 'line' || chartType === 'area' ? 4 : 0,
          pointHoverRadius: 6,
        }
      ]
    };
  }, [examVolumeData, examType, chartType]);

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: 'Thống kê số lượng bài thi theo thời gian',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        color: '#374151',
        padding: {
          bottom: 20
        }
      },
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#111827',
        bodyColor: '#4B5563',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          title: (context: Array<{ label: string }>) => {
            return `${context[0].label}`;
          },
          label: (context: { dataset: { label?: string }, parsed: { y: number } }) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: ${value} bài thi`;
          },
          afterBody: (context: Array<{ parsed: { y: number } }>) => {
            const total = context.reduce((sum: number, item) => sum + (item.parsed.y || 0), 0);
            return total > 0 ? [`Tổng cộng: ${total} bài thi`] : [];
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Thời gian',
          font: {
            size: 12,
            weight: 'bold' as const,
          },
          color: '#6B7280'
        },
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          }
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Số lượng bài thi',
          font: {
            size: 12,
            weight: 'bold' as const,
          },
          color: '#6B7280'
        },
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          },
          stepSize: 1
        }
      },
    },
  };

  // Quick date range presets
  const handleQuickDateRange = (days: number) => {
    const today = new Date();
    const endDate = new Date(today); // Today
    
    let startDate: Date;
    let suggestedGroupBy: GroupBy;
    
    if (days === 7) {
      // 7 days - use daily grouping
      startDate = subDays(endDate, days - 1);
      suggestedGroupBy = 'daily';
    } else if (days === 30) {
      // 30 days - use daily grouping
      startDate = subDays(endDate, days - 1);
      suggestedGroupBy = 'daily';
    } else if (days === 90) {
      // 3 months - use weekly grouping
      startDate = subMonths(endDate, 3);
      suggestedGroupBy = 'weekly';
    } else {
      startDate = subDays(endDate, days - 1);
      suggestedGroupBy = 'daily';
    }
    
    setStartDate(format(startDate, 'yyyy-MM-dd'));
    setEndDate(format(endDate, 'yyyy-MM-dd'));
    setGroupBy(suggestedGroupBy);
    setTimeRangeType('range');
  };

  // Export functionality
  const handleExport = () => {
    if (!examVolumeData || !examVolumeData.data) {
      toast.error('Không có dữ liệu để xuất');
      return;
    }

    // Create CSV content
    const headers = ['Thời gian', 'Bài luyện tập', 'Bài chính thức', 'Tổng cộng'];
    const rows = examVolumeData.data.map(item => [
      item.date,
      item.practiceCount,
      item.officialCount,
      item.totalCount
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `exam-volume-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();

    toast.success('Đã xuất báo cáo thành công');
  };

  // Clear all filters
  const handleClearFilters = () => {
    // Reset time range to default (last month)
    setTimeRangeType('range');
    setStartDate(format(subMonths(new Date(), 1), 'yyyy-MM-dd'));
    setEndDate(format(new Date(), 'yyyy-MM-dd'));
    setSpecificDate('');
    
    // Reset exam type
    setExamType('all');
    
    // Reset entity filters
    setSelectedClassIds([]);
    setSelectedSubjectIds([]);
    setSelectedStudentIds([]);
    
    // Reset grouping and chart type
    setGroupBy('daily');
    setChartType('bar');
    
    toast.success('Đã xóa tất cả bộ lọc');
  };

  // Render chart component based on type
  const renderChart = () => {
    if (!chartData) return null;

    // For single data point views (all time or specific date), always use bar chart
    if (timeRangeType === 'all' || timeRangeType === 'specific') {
      return <Bar data={chartData} options={chartOptions} />;
    }

    // For time series data (date range), use the selected chart type
    const ChartComponent = chartType === 'line' || chartType === 'area' ? Line : Bar;
    return <ChartComponent data={chartData} options={chartOptions} />;
  };

  return (
    <div className={className}>
      {/* Filter Panel */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600" />
              <CardTitle>Bộ lọc tương tác</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
              >
                <Filter className="h-4 w-4 mr-2" />
                Xóa bộ lọc
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={!examVolumeData}
              >
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

            {/* Date inputs based on selection */}
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
                {/* Quick date range buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickDateRange(7)}
                  >
                    7 ngày qua
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickDateRange(30)}
                  >
                    30 ngày qua
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickDateRange(90)}
                  >
                    3 tháng qua
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Entity Filters */}
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
                disabled={timeRangeType === 'all' || timeRangeType === 'specific'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại biểu đồ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Biểu đồ cột
                    </div>
                  </SelectItem>
                  <SelectItem value="line">
                    <div className="flex items-center gap-2">
                      <LineChart className="h-4 w-4" />
                      Biểu đồ đường
                    </div>
                  </SelectItem>
                  <SelectItem value="area">
                    <div className="flex items-center gap-2">
                      <AreaChart className="h-4 w-4" />
                      Biểu đồ vùng
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {(timeRangeType === 'all' || timeRangeType === 'specific') && (
                <p className="text-xs text-muted-foreground">
                  {timeRangeType === 'all' 
                    ? 'Chỉ hỗ trợ biểu đồ cột cho tổng quan tất cả thời gian'
                    : 'Chỉ hỗ trợ biểu đồ cột cho ngày cụ thể'
                  }
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
      {examVolumeData?.summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tổng bài luyện tập</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {examVolumeData.summary.totalPractice?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Activity className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tổng bài chính thức</p>
                  <p className="text-2xl font-bold text-red-600">
                    {examVolumeData.summary.totalOfficial?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Target className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tổng cộng</p>
                  <p className="text-2xl font-bold text-green-600">
                    {examVolumeData.summary.totalExams?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trung bình/ngày</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {examVolumeData.summary.averagePerDay?.toFixed(1) || '0.0'}
                  </p>
                </div>
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <div>
                <CardTitle>Biểu đồ thống kê số lượng bài thi</CardTitle>
                <CardDescription>
                  Thống kê số lượng bài thi luyện tập và chính thức theo thời gian
                </CardDescription>
              </div>
            </div>
            {examVolumeData?.summary && (
              <div className="flex items-center gap-2">
                {(examType === 'all' || examType === 'practice') && (
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    Luyện tập: {examVolumeData.summary.totalPractice}
                  </Badge>
                )}
                {(examType === 'all' || examType === 'official') && (
                  <Badge variant="outline" className="text-red-600 border-red-200">
                    Chính thức: {examVolumeData.summary.totalOfficial}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 text-gray-300 animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
                </div>
              </div>
            ) : (timeRangeType === 'all' && examVolumeData?.summary) || 
                (examVolumeData?.data && Array.isArray(examVolumeData.data) && examVolumeData.data.length > 0) ? (
              renderChart()
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Không có dữ liệu</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {examVolumeData ? 
                      'Không có dữ liệu trong khoảng thời gian đã chọn' : 
                      'Thử thay đổi bộ lọc hoặc khoảng thời gian'
                    }
                  </p>
                  {process.env.NODE_ENV === 'development' && (
                    <p className="text-xs text-red-400 mt-2">
                      Debug: {JSON.stringify(examVolumeData)}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Insights */}
          {examVolumeData?.insights && (
            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Phân tích:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Sử dụng luyện tập</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {examVolumeData.insights.practiceUsage}
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-xs text-green-700 dark:text-green-300 font-medium">Thời gian cao điểm</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {examVolumeData.insights.peakTimes}
                  </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">Gợi ý</p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    {examVolumeData.insights.recommendations[0] || 'Không có gợi ý'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Table */}
      {((timeRangeType === 'all' && examVolumeData?.summary) || examVolumeData?.data) && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Bảng dữ liệu chi tiết</CardTitle>
            <CardDescription>
              {timeRangeType === 'all' 
                ? 'Tổng quan dữ liệu tất cả thời gian'
                : `Dữ liệu thống kê theo ${groupBy === 'daily' ? 'ngày' : groupBy === 'weekly' ? 'tuần' : 'tháng'}`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Thời gian</th>
                    <th className="text-right p-2">Bài luyện tập</th>
                    <th className="text-right p-2">Bài chính thức</th>
                    <th className="text-right p-2">Tổng cộng</th>
                    <th className="text-right p-2">% Luyện tập</th>
                  </tr>
                </thead>
                <tbody>
                  {timeRangeType === 'all' && examVolumeData?.summary ? (
                    <tr className="border-b">
                      <td className="p-2 font-medium">Tất cả thời gian</td>
                      <td className="p-2 text-right text-blue-600">
                        {examVolumeData.summary.totalPractice}
                      </td>
                      <td className="p-2 text-right text-red-600">
                        {examVolumeData.summary.totalOfficial}
                      </td>
                      <td className="p-2 text-right font-medium">
                        {examVolumeData.summary.totalExams}
                      </td>
                      <td className="p-2 text-right text-gray-600">
                        {examVolumeData.summary.totalExams > 0 
                          ? ((examVolumeData.summary.totalPractice / examVolumeData.summary.totalExams) * 100).toFixed(1)
                          : '0'
                        }%
                      </td>
                    </tr>
                  ) : (
                    examVolumeData?.data?.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{item.date}</td>
                        <td className="p-2 text-right text-blue-600">
                          {item.practiceCount}
                        </td>
                        <td className="p-2 text-right text-red-600">
                          {item.officialCount}
                        </td>
                        <td className="p-2 text-right font-medium">
                          {item.totalCount}
                        </td>
                        <td className="p-2 text-right text-gray-600">
                          {item.practicePercentage ? item.practicePercentage.toFixed(1) : 
                           item.totalCount > 0 ? ((item.practiceCount / item.totalCount) * 100).toFixed(1) : '0'}%
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
