'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getRoomById } from '@/features/room/services/roomServices';
import { RoomDto } from '@/features/room/types/room';
import { ROOM_STATUS_COLORS } from '@/features/room/data/roomConstants';
import { toast } from "@/components/hooks/use-toast";
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { 
  MeetingRoom, 
  Quiz, 
  Schedule, 
  Group, 
  Settings, 
  AccessTime,
  People,
  Shuffle,
  Description
} from "@mui/icons-material";

export default function DetailRoomModalPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  
  const [room, setRoom] = useState<RoomDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const roomData = await getRoomById(id);
        setRoom(roomData);
      } catch (error) {
        console.error("Error fetching room:", error);
        toast({
          title: 'Lỗi khi tải thông tin phòng thi',
          description: 'Không thể tải thông tin phòng thi.',
          variant: 'error',
        });
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchRoom();
    }
  }, [id, router]);

  const handleClose = () => {
    router.back();
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch {
      return 'N/A';
    }
  };

  if (isLoading) {
    return (
      <Dialog open={true} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!room) {
    return null;
  }

  const statusLabels = {
    'waiting': 'Chờ mở',
    'open': 'Đang mở',
    'closed': 'Đã đóng'
  };

  const examTypeLabels = {
    'practice': 'Luyện tập',
    'official': 'Chính thức'
  };

  const scheduleStatusLabels = {
    'active': 'Đang hoạt động',
    'completed': 'Đã hoàn thành',
    'cancelled': 'Đã hủy'
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MeetingRoom className="h-5 w-5" />
            Chi tiết phòng thi
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về phòng thi &quot;{room.code}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Thông tin cơ bản */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MeetingRoom className="h-5 w-5" />
                Thông tin cơ bản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Mã phòng thi</label>
                  <p className="text-lg font-semibold">{room.code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                  <div className="mt-1">
                    <Badge className={`${ROOM_STATUS_COLORS[room.status]} border`}>
                      {statusLabels[room.status]}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">ID phòng thi</label>
                  <p className="text-lg font-semibold">#{room.id}</p>
                </div>
              </div>
              
              {room.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Description className="h-4 w-4" />
                    Mô tả
                  </label>
                  <p className="mt-1 text-gray-700 bg-gray-50 p-3 rounded-md">{room.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Thông tin bài thi */}
          {room.exam && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Quiz className="h-5 w-5" />
                  Thông tin bài thi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tên bài thi</label>
                    <p className="text-lg font-semibold">{room.exam.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Loại bài thi</label>
                    <div className="mt-1">
                      <Badge variant={room.exam.examType === 'official' ? 'default' : 'secondary'}>
                        {examTypeLabels[room.exam.examType]}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Thời gian làm bài</label>
                    <p className="text-lg font-semibold flex items-center gap-1">
                      <AccessTime className="h-4 w-4" />
                      {room.exam.duration} phút
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tổng số câu hỏi</label>
                    <p className="text-lg font-semibold">{room.exam.totalQuestions} câu</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Thông tin lịch thi */}
          {room.examSchedule && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Schedule className="h-5 w-5" />
                  Thông tin lịch thi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mã lịch thi</label>
                    <p className="text-lg font-semibold">{room.examSchedule.code}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Trạng thái lịch thi</label>
                    <div className="mt-1">
                      <Badge variant={room.examSchedule.status === 'active' ? 'default' : 'secondary'}>
                        {scheduleStatusLabels[room.examSchedule.status]}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Thời gian bắt đầu</label>
                    <p className="text-lg font-semibold text-green-600">
                      {formatDateTime(room.examSchedule.startTime)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Thời gian kết thúc</label>
                    <p className="text-lg font-semibold text-red-600">
                      {formatDateTime(room.examSchedule.endTime)}
                    </p>
                  </div>
                </div>
                
                {room.examSchedule.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mô tả lịch thi</label>
                    <p className="mt-1 text-gray-700 bg-gray-50 p-3 rounded-md">{room.examSchedule.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Thông tin lớp học */}
          {room.class && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Group className="h-5 w-5" />
                  Thông tin lớp học
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tên lớp học</label>
                    <p className="text-lg font-semibold">{room.class.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mã lớp học</label>
                    <p className="text-lg font-semibold">{room.class.code}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cài đặt phòng thi */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Cài đặt phòng thi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <People className="h-4 w-4" />
                    Số người tối đa
                  </label>
                  <p className="text-lg font-semibold">
                    {room.maxParticipants ? `${room.maxParticipants} người` : 'Không giới hạn'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Số người hiện tại</label>
                  <p className="text-lg font-semibold text-blue-600">
                    {room.currentParticipants || 0} người
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Shuffle className="h-4 w-4" />
                    Trộn câu hỏi
                  </label>
                  <div className="mt-1">
                    <Badge variant={room.randomizeOrder ? 'default' : 'secondary'}>
                      {room.randomizeOrder ? 'Có' : 'Không'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thông tin thời gian */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AccessTime className="h-5 w-5" />
                Thông tin thời gian
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Ngày tạo</label>
                  <p className="text-lg font-semibold">{formatDateTime(room.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Cập nhật lần cuối</label>
                  <p className="text-lg font-semibold">{formatDateTime(room.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
} 