'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/store';
import { getStudentByEmail } from '@/features/student/services/studentService';
import { getScheduleByClassId } from '@/features/schedule/services/scheduleServices';
import { ExamScheduleDto } from '@/features/schedule/types/schedule';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  BookOpen,
  RefreshCw,
  AlertTriangle,
  CalendarDays,
  CalendarCheck,
  CalendarX,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getClassById } from '@/features/classes/services/classServices';
import { usePageTitle } from '@/hooks/usePageTitle';

const SchedulesPage = () => {
  usePageTitle('Lịch thi');
  const [schedules, setSchedules] = useState<ExamScheduleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classCode, setClassCode] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const user = useAuthStore((state) => state.user);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.email) {
        setError('Vui lòng đăng nhập để xem lịch thi');
        setLoading(false);
        return;
      }

      // Get student info to find their class
      const student = await getStudentByEmail(user.email);
      
      if (!student?.classId) {
        setError('Không tìm thấy thông tin lớp học của bạn');
        setLoading(false);
        return;
      }

      // Get class info
      const classInfo = await getClassById(student.classId);
      setClassCode(classInfo.code);

      // Get schedules for the student's class
      const schedulesData = await getScheduleByClassId(student.classId);
      
      // Handle both array and single object responses
      const schedulesArray = Array.isArray(schedulesData) ? schedulesData : [schedulesData];
      
      // Sort schedules by start time (most recent first)
      schedulesArray.sort((a, b) => 
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
      
      setSchedules(schedulesArray);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError('Không thể tải lịch thi. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [user?.email]);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch {
      return dateString;
    }
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm', { locale: vi });
    } catch {
      return '';
    }
  };

  // Format day of week
  const formatDayOfWeek = (dateString: string) => {
    try {
      return format(new Date(dateString), 'EEEE', { locale: vi });
    } catch {
      return '';
    }
  };

  // Filter schedules based on status and search term
  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = 
      searchTerm === '' || 
      schedule.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.subject?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.subject?.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      activeFilter === 'all' || 
      schedule.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Get status badge
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

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Calendar className="w-5 h-5 text-green-500" />;
      case 'completed':
        return <CalendarCheck className="w-5 h-5 text-blue-500" />;
      case 'cancelled':
        return <CalendarX className="w-5 h-5 text-red-500" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Đang tải lịch thi...</span>
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
            <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
            <p className="text-lg font-semibold">Có lỗi xảy ra</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
          </div>
          <Button onClick={fetchSchedules} variant="outline">
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
            <CalendarDays className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Lịch thi
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Danh sách lịch thi của lớp {classCode}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              {schedules.filter(s => s.status === 'active').length} lịch sắp tới
            </Badge>
            <Badge variant="default" className="text-sm">
              {schedules.filter(s => s.status === 'completed').length} đã hoàn thành
            </Badge>
            {schedules.filter(s => s.status === 'cancelled').length > 0 && (
              <Badge variant="destructive" className="text-sm">
                {schedules.filter(s => s.status === 'cancelled').length} đã hủy
              </Badge>
            )}
          </div>
          <Button onClick={fetchSchedules} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input 
            placeholder="Tìm kiếm lịch thi..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={(value) => setActiveFilter(value as any)}>
          <TabsList className="grid grid-cols-4 w-full md:w-[400px]">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="active">Sắp tới</TabsTrigger>
            <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
            <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Schedules List */}
      {filteredSchedules.length === 0 ? (
        <Card className="p-8 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">
            Không tìm thấy lịch thi nào
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSchedules.map((schedule) => (
            <Card 
              key={schedule.id} 
              className="overflow-hidden hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col md:flex-row">
                {/* Left side - Date display */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 flex flex-col items-center justify-center md:w-48">
                  <div className="text-sm text-blue-600 dark:text-blue-400 capitalize">
                    {formatDayOfWeek(schedule.startTime)}
                  </div>
                  <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                    {format(new Date(schedule.startTime), 'dd', { locale: vi })}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    {format(new Date(schedule.startTime), 'MM/yyyy', { locale: vi })}
                  </div>
                </div>
                
                {/* Right side - Schedule details */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(schedule.status)}
                        <h3 className="text-lg font-semibold">
                          {schedule.subject?.name || 'Bài thi'} - {schedule.code}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(schedule.status, schedule.startTime, schedule.endTime)}
                        {schedule.subject && (
                          <Badge variant="outline" className="text-xs">
                            {schedule.subject.code}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Thời gian:
                      </p>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <p className="text-sm font-medium">
                          Từ {formatDate(schedule.startTime)} {formatTime(schedule.startTime)} đến {formatDate(schedule.endTime)} {formatTime(schedule.endTime)}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Lớp:
                      </p>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-gray-500" />
                        <p className="text-sm font-medium">
                          {schedule.classes?.map(c => c.name).join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {schedule.description && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Mô tả:
                      </p>
                      <p className="text-sm">
                        {schedule.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchedulesPage; 