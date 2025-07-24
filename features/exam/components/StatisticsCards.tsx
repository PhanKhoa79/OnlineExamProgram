import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, TrendingUp, Users } from 'lucide-react';

interface StatisticsCardsProps {
  statistics: {
    totalExams: number;
    averageScore: string;
    passedExams: number;
    passRate: string;
  };
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ statistics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="group relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white cursor-pointer transform hover:scale-105 hover:-translate-y-2">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 transition-all duration-500 group-hover:w-32 group-hover:h-32 group-hover:-mr-16 group-hover:-mt-16"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 via-blue-400/0 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2 z-10">
          <CardTitle className="text-sm font-medium text-blue-100 group-hover:text-white transition-colors duration-300">Tổng số bài thi</CardTitle>
          <BookOpen className="h-5 w-5 text-blue-200 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold group-hover:scale-110 transition-transform duration-300">{statistics.totalExams}</div>
          <p className="text-xs text-blue-200 mt-1 group-hover:text-blue-100 transition-colors duration-300">Bài thi đã hoàn thành</p>
        </CardContent>
      </Card>

      <Card className="group relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-green-500 to-green-600 text-white cursor-pointer transform hover:scale-105 hover:-translate-y-2">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 transition-all duration-500 group-hover:w-32 group-hover:h-32 group-hover:-mr-16 group-hover:-mt-16"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/0 via-green-400/0 to-green-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2 z-10">
          <CardTitle className="text-sm font-medium text-green-100 group-hover:text-white transition-colors duration-300">Điểm trung bình</CardTitle>
          <TrendingUp className="h-5 w-5 text-green-200 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold group-hover:scale-110 transition-transform duration-300">{statistics.averageScore}</div>
          <p className="text-xs text-green-200 mt-1 group-hover:text-green-100 transition-colors duration-300">Trên thang điểm 100</p>
        </CardContent>
      </Card>

      <Card className="group relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white cursor-pointer transform hover:scale-105 hover:-translate-y-2">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 transition-all duration-500 group-hover:w-32 group-hover:h-32 group-hover:-mr-16 group-hover:-mt-16"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 via-purple-400/0 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2 z-10">
          <CardTitle className="text-sm font-medium text-purple-100 group-hover:text-white transition-colors duration-300">Số bài đạt</CardTitle>
          <Users className="h-5 w-5 text-purple-200 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold group-hover:scale-110 transition-transform duration-300">{statistics.passedExams}</div>
          <p className="text-xs text-purple-200 mt-1 group-hover:text-purple-100 transition-colors duration-300">Điểm ≥ 50</p>
        </CardContent>
      </Card>

      <Card className="group relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white cursor-pointer transform hover:scale-105 hover:-translate-y-2">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 transition-all duration-500 group-hover:w-32 group-hover:h-32 group-hover:-mr-16 group-hover:-mt-16"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/0 via-orange-400/0 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2 z-10">
          <CardTitle className="text-sm font-medium text-orange-100 group-hover:text-white transition-colors duration-300">Tỷ lệ đạt</CardTitle>
          <TrendingUp className="h-5 w-5 text-orange-200 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold group-hover:scale-110 transition-transform duration-300">{statistics.passRate}%</div>
          <p className="text-xs text-orange-200 mt-1 group-hover:text-orange-100 transition-colors duration-300">Tỷ lệ thành công</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsCards; 