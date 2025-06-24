'use client';

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Radar } from 'react-chartjs-2';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { format, subMonths } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Download, Filter, RefreshCw } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Fake data generators
const generateMonthlyData = (months = 6) => {
  const labels = [];
  const examSubmissions = [];
  const examCompletions = [];
  const passRates = [];
  const avgScores = [];

  const currentDate = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const date = subMonths(currentDate, i);
    const monthName = format(date, 'MMM', { locale: vi });
    labels.push(monthName);
    
    // Generate fake data
    examSubmissions.push(Math.floor(Math.random() * 200) + 100);
    examCompletions.push(Math.floor(Math.random() * 150) + 80);
    passRates.push(Math.floor(Math.random() * 30) + 65); // 65-95%
    avgScores.push((Math.random() * 3) + 6); // 6-9 điểm
  }

  return { labels, examSubmissions, examCompletions, passRates, avgScores };
};

const generateSubjectData = () => {
  const subjects = ['Toán', 'Lý', 'Hóa', 'Sinh', 'Văn', 'Anh', 'Sử', 'Địa'];
  const avgScores = subjects.map(() => (Math.random() * 3) + 6); // 6-9 điểm
  const passRates = subjects.map(() => Math.floor(Math.random() * 30) + 65); // 65-95%
  const examCounts = subjects.map(() => Math.floor(Math.random() * 50) + 10); // 10-60 bài thi
  
  return { subjects, avgScores, passRates, examCounts };
};

const generateScoreDistribution = () => {
  // Score ranges
  const ranges = ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10'];
  
  // Generate distribution with bell curve tendency (more in middle ranges)
  const distribution = [
    Math.floor(Math.random() * 10),       // 0-1
    Math.floor(Math.random() * 15),       // 1-2
    Math.floor(Math.random() * 25),       // 2-3
    Math.floor(Math.random() * 40) + 20,  // 3-4
    Math.floor(Math.random() * 60) + 40,  // 4-5
    Math.floor(Math.random() * 80) + 60,  // 5-6
    Math.floor(Math.random() * 100) + 80, // 6-7
    Math.floor(Math.random() * 80) + 60,  // 7-8
    Math.floor(Math.random() * 40) + 20,  // 8-9
    Math.floor(Math.random() * 15)        // 9-10
  ];
  
  return { ranges, distribution };
};

const generateStudentPerformance = () => {
  // Categories for radar chart
  const categories = ['Toán', 'Lý', 'Hóa', 'Sinh', 'Văn', 'Anh'];
  
  // Generate 3 student datasets for comparison
  const student1 = categories.map(() => (Math.random() * 3) + 6); // 6-9 điểm
  const student2 = categories.map(() => (Math.random() * 3) + 6); // 6-9 điểm
  const student3 = categories.map(() => (Math.random() * 3) + 6); // 6-9 điểm
  const classAvg = categories.map(() => (Math.random() * 2) + 6.5); // 6.5-8.5 điểm
  
  return { categories, student1, student2, student3, classAvg };
};

export default function StatisticsPage() {
  const [timeRange, setTimeRange] = useState('6');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  
  // Generate data
  const monthlyData = generateMonthlyData(parseInt(timeRange));
  const subjectData = generateSubjectData();
  const scoreDistribution = generateScoreDistribution();
  const studentPerformance = generateStudentPerformance();

  // Simulate data reload
  const handleDataRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  // Chart configurations
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
        boxPadding: 5,
        usePointStyle: true,
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

  const barChartOptions = {
    ...lineChartOptions,
    barPercentage: 0.6,
    categoryPercentage: 0.7,
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 12,
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
  };

  const radarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: false,
        min: 5,
        max: 10,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
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
  };

  // Chart data
  const monthlySubmissionsData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: 'Bài thi đã nộp',
        data: monthlyData.examSubmissions,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: 'rgb(99, 102, 241)',
      },
      {
        label: 'Bài thi hoàn thành',
        data: monthlyData.examCompletions,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: 'rgb(16, 185, 129)',
      }
    ],
  };

  const monthlyScoresData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: 'Điểm trung bình',
        data: monthlyData.avgScores,
        backgroundColor: 'rgba(168, 85, 247, 0.8)',
        borderRadius: 6,
      }
    ],
  };

  const monthlyPassRatesData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: 'Tỷ lệ đậu (%)',
        data: monthlyData.passRates,
        backgroundColor: 'rgba(236, 72, 153, 0.8)',
        borderRadius: 6,
      }
    ],
  };

  const subjectScoresData = {
    labels: subjectData.subjects,
    datasets: [
      {
        label: 'Điểm trung bình',
        data: subjectData.avgScores,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 6,
      }
    ],
  };

  const subjectPassRatesData = {
    labels: subjectData.subjects,
    datasets: [
      {
        label: 'Tỷ lệ đậu (%)',
        data: subjectData.passRates,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 6,
      }
    ],
  };

  const scoreDistributionData = {
    labels: scoreDistribution.ranges,
    datasets: [
      {
        label: 'Số lượng bài thi',
        data: scoreDistribution.distribution,
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(234, 88, 12, 0.8)',
          'rgba(217, 119, 6, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(5, 150, 105, 0.8)',
          'rgba(4, 120, 87, 0.8)',
          'rgba(6, 95, 70, 0.8)',
        ],
        borderWidth: 1,
      }
    ],
  };

  const studentPerformanceData = {
    labels: studentPerformance.categories,
    datasets: [
      {
        label: 'Học sinh A',
        data: studentPerformance.student1,
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(99, 102, 241, 1)',
      },
      {
        label: 'Học sinh B',
        data: studentPerformance.student2,
        backgroundColor: 'rgba(236, 72, 153, 0.2)',
        borderColor: 'rgba(236, 72, 153, 1)',
        pointBackgroundColor: 'rgba(236, 72, 153, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(236, 72, 153, 1)',
      },
      {
        label: 'Học sinh C',
        data: studentPerformance.student3,
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgba(16, 185, 129, 1)',
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(16, 185, 129, 1)',
      },
      {
        label: 'Trung bình lớp',
        data: studentPerformance.classAvg,
        backgroundColor: 'rgba(107, 114, 128, 0.2)',
        borderColor: 'rgba(107, 114, 128, 1)',
        pointBackgroundColor: 'rgba(107, 114, 128, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(107, 114, 128, 1)',
        borderDash: [5, 5],
      },
    ],
  };

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
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => {
              alert('Tính năng xuất báo cáo sẽ được triển khai sau');
            }}
          >
            <Download size={16} />
            <span>Xuất báo cáo</span>
          </Button>
          <Button 
            className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
            onClick={handleDataRefresh}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            <span>Làm mới dữ liệu</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Khoảng thời gian
              </label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khoảng thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 tháng gần nhất</SelectItem>
                  <SelectItem value="6">6 tháng gần nhất</SelectItem>
                  <SelectItem value="12">12 tháng gần nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Lớp học
              </label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn lớp học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả các lớp</SelectItem>
                  <SelectItem value="10A1">10A1</SelectItem>
                  <SelectItem value="10A2">10A2</SelectItem>
                  <SelectItem value="11A1">11A1</SelectItem>
                  <SelectItem value="11A2">11A2</SelectItem>
                  <SelectItem value="12A1">12A1</SelectItem>
                  <SelectItem value="12A2">12A2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Môn học
              </label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn môn học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả các môn</SelectItem>
                  <SelectItem value="math">Toán</SelectItem>
                  <SelectItem value="physics">Vật lý</SelectItem>
                  <SelectItem value="chemistry">Hóa học</SelectItem>
                  <SelectItem value="biology">Sinh học</SelectItem>
                  <SelectItem value="literature">Văn học</SelectItem>
                  <SelectItem value="english">Tiếng Anh</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} />
              <span>Áp dụng bộ lọc</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different report views */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-8">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="subjects">Theo môn học</TabsTrigger>
          <TabsTrigger value="students">Theo học sinh</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Monthly Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Số lượng bài thi theo tháng</CardTitle>
                <CardDescription>
                  Thống kê số lượng bài thi đã nộp và hoàn thành theo tháng
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <Line data={monthlySubmissionsData} options={lineChartOptions} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Điểm trung bình theo tháng</CardTitle>
                <CardDescription>
                  Thống kê điểm trung bình của học sinh theo tháng
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <Bar data={monthlyScoresData} options={barChartOptions} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Pass Rates and Score Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tỷ lệ đậu theo tháng</CardTitle>
                <CardDescription>
                  Phần trăm học sinh đạt điểm đậu (≥5.0) theo tháng
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <Bar data={monthlyPassRatesData} options={barChartOptions} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Phân bố điểm số</CardTitle>
                <CardDescription>
                  Phân bố điểm số của học sinh trong kỳ thi
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <Pie data={scoreDistributionData} options={pieChartOptions} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Điểm trung bình theo môn học</CardTitle>
                <CardDescription>
                  So sánh điểm trung bình giữa các môn học
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <Bar data={subjectScoresData} options={barChartOptions} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tỷ lệ đậu theo môn học</CardTitle>
                <CardDescription>
                  Phần trăm học sinh đạt điểm đậu (≥5.0) theo môn học
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <Bar data={subjectPassRatesData} options={barChartOptions} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Students Tab */}
        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>So sánh kết quả học sinh</CardTitle>
              <CardDescription>
                So sánh điểm số của học sinh theo các môn học
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-96">
                <Radar data={studentPerformanceData} options={radarChartOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 