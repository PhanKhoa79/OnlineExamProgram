"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Edit, Delete } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/hooks/use-toast";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { getScheduleById, deleteSchedule, getAllSchedules } from "@/features/schedule/services/scheduleServices";
import { getAllSubjects } from "@/features/subject/services/subjectServices";
import { setSchedules } from "@/store/scheduleSlice";
import { ExamScheduleDto } from "@/features/schedule/types/schedule";
import { SubjectResponseDto } from "@/features/subject/types/subject";
import { useAuthStore } from "@/features/auth/store";
import { hasPermission } from "@/lib/permissions";
import { Clock, BookOpen, Hash, Calendar, FileText, MapPin, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DetailScheduleModalProps {
  id: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DetailScheduleModal: React.FC<DetailScheduleModalProps> = ({
  id,
  open,
  onOpenChange,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [schedule, setSchedule] = useState<ExamScheduleDto | null>(null);
  const [subject, setSubject] = useState<SubjectResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const permissions = useAuthStore((state) => state.permissions);

  useEffect(() => {
    const fetchScheduleDetails = async () => {
      if (!id || !open) {
        return;
      }

      try {
        setIsLoading(true);
        const [scheduleData, subjectsData] = await Promise.all([
          getScheduleById(id),
          getAllSubjects(),
        ]);

        setSchedule(scheduleData);
      
        const subjectId = scheduleData.subject?.id || scheduleData.subjectId;
        const scheduleSubject = subjectsData.find(s => s.id === subjectId);
        setSubject(scheduleSubject || null);
      } catch (error) {
        console.error("Failed to fetch schedule details:", error);
        setSchedule(null);
        setSubject(null);
        toast({
          title: "Lỗi khi tải thông tin lịch thi",
          variant: "error",
        });
        
        // Auto close modal after 2 seconds if failed to load
        setTimeout(() => {
          handleClose();
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    if (open && id) {
      fetchScheduleDetails();
    } else {
      setSchedule(null);
      setSubject(null);
      setIsLoading(false);
    }
  }, [id, open]);

  const handleClose = () => {
    setSchedule(null);
    setSubject(null);
    setShowConfirmDelete(false);
    setIsLoading(false);

    onOpenChange(false);
  };


  const handleDelete = async () => {
    if (!schedule) return;

    try {
      await deleteSchedule(schedule.id);
      
      toast({
        title: "Xóa lịch thi thành công!",
        description: `Lịch thi "${schedule.code}" đã được xóa.`,
      });

      setShowConfirmDelete(false);
      handleClose();
      
      setTimeout(async () => {
        try {
          const updatedSchedules = await getAllSchedules();
          dispatch(setSchedules(updatedSchedules));
        } catch (refreshError) {
          console.error("Error refreshing schedules:", refreshError);
        }
      }, 100);
      
    } catch (error) {
      console.error("Error deleting schedule:", error);
      toast({
        title: "Lỗi khi xóa lịch thi",
        description: "Có lỗi xảy ra khi xóa lịch thi. Vui lòng thử lại.",
        variant: "error",
      });
      setShowConfirmDelete(false);
    }
  };

  if (!open || !id) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return "bg-green-100 text-green-800";
      case 'completed':
        return "bg-blue-100 text-blue-800";
      case 'cancelled':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return "Hoạt động";
      case 'completed':
        return "Hoàn thành";
      case 'cancelled':
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = () => {
    if (!schedule) return "Không xác định";
    
    const start = new Date(schedule.startTime);
    const end = new Date(schedule.endTime);
    const diffInMs = end.getTime() - start.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      return minutes > 0 ? `${hours} giờ ${minutes} phút` : `${hours} giờ`;
    }
  };

  return (
    <>
      <Dialog 
        open={open && !showConfirmDelete} 
        onOpenChange={(openState) => {
          if (!openState && !showConfirmDelete) {
            handleClose();
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Chi tiết lịch thi</DialogTitle>
            <DialogDescription>
              Xem thông tin chi tiết của lịch thi
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : schedule ? (
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {schedule.code}
                  </CardTitle>
                  <CardDescription>Thông tin cơ bản của lịch thi</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">ID lịch thi:</span>
                      <span className="text-sm text-muted-foreground">
                        #{schedule.id}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Trạng thái:</span>
                      <Badge className={getStatusColor(schedule.status)}>
                        {getStatusLabel(schedule.status)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Môn học:</span>
                      <span className="text-sm">{subject ? `${subject.name} (${subject.code})` : "Chưa xác định"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Thời lượng:</span>
                      <span className="text-sm">{calculateDuration()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Time Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Thông tin thời gian
                  </CardTitle>
                  <CardDescription>Chi tiết về thời gian diễn ra lịch thi</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Thời gian bắt đầu</p>
                      <p className="text-sm bg-green-50 text-green-800 px-3 py-2 rounded-md border border-green-200">
                        {formatDateTime(schedule.startTime)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Thời gian kết thúc</p>
                      <p className="text-sm bg-red-50 text-red-800 px-3 py-2 rounded-md border border-red-200">
                        {formatDateTime(schedule.endTime)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Classes Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Danh sách lớp học
                  </CardTitle>
                  <CardDescription>Các lớp học tham gia lịch thi</CardDescription>
                </CardHeader>
                <CardContent>
                  {schedule.classes && schedule.classes.length > 0 ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {schedule.classes.map((classItem) => (
                          <div 
                            key={classItem.id} 
                            className="flex items-center p-2 rounded-md border bg-gray-50"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium">{classItem.name}</p>
                              <p className="text-xs text-gray-500">Mã lớp: {classItem.code}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Tổng cộng: {schedule.classes.length} lớp học
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Không có lớp học nào được gán cho lịch thi này.</p>
                  )}
                </CardContent>
              </Card>

              {/* Description */}
              {schedule.description && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Mô tả
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {schedule.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5" />
                    Thông tin hệ thống
                  </CardTitle>
                  <CardDescription>Dữ liệu tạo và cập nhật</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Ngày tạo</p>
                      <p className="text-sm text-gray-900">{formatDateTime(schedule.createdAt)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-600">Cập nhật lần cuối</p>
                      <p className="text-sm text-gray-900">{formatDateTime(schedule.updatedAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                {hasPermission(permissions, 'schedule:update') && (
                  <Button
                  onClick={() => {
                    onOpenChange(false);
                    setTimeout(() => {
                      router.push(`/dashboard/schedule/edit/${id}`);
                    }, 50);
                  }}
                    className="flex items-center gap-2"
                  >
                    <Edit sx={{ fontSize: 16 }} />
                    Chỉnh sửa
                  </Button>
                )}
                
                {hasPermission(permissions, 'schedule:delete') && (
                  <Button
                    variant="destructive"
                    onClick={() => setShowConfirmDelete(true)}
                    className="flex items-center gap-2"
                  >
                    <Delete sx={{ fontSize: 16 }} />
                    Xóa
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Không tìm thấy thông tin lịch thi</p>
              <Button 
                onClick={handleClose}
                className="mt-4"
                variant="outline"
              >
                Đóng
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteModal
        open={showConfirmDelete}
        onOpenChange={setShowConfirmDelete}
        onConfirm={handleDelete}
        title="Xác nhận xóa lịch thi"
      />
    </>
  );
}; 