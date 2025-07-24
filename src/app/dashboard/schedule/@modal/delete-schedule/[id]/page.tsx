"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { getScheduleById, deleteSchedule, getAllSchedules } from "@/features/schedule/services/scheduleServices";
import { setSchedules } from "@/store/scheduleSlice";
import { ExamScheduleDto } from "@/features/schedule/types/schedule";
import { toast } from "@/components/hooks/use-toast";
import type { AppDispatch } from "@/store";

export default function DeleteScheduleModalPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const scheduleId = params?.id ? parseInt(params.id as string) : null;
  
  const [schedule, setSchedule] = useState<ExamScheduleDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!scheduleId) return;
      
      try {
        const scheduleData = await getScheduleById(scheduleId);
        setSchedule(scheduleData);
      } catch (error) {
        console.error("Failed to fetch schedule:", error);
        toast({
          title: "Lỗi khi tải thông tin lịch thi",
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [scheduleId]);

  const handleClose = () => {
    if (!isDeleting) {
      setIsOpen(false);
      setTimeout(() => router.back(), 150);
    }
  };

  const handleConfirmDelete = async () => {
    if (!scheduleId || !schedule || isDeleting) return;

    try {
      setIsDeleting(true);
      await deleteSchedule(scheduleId);
      
      // Refresh schedules list
      const updatedSchedules = await getAllSchedules();
      dispatch(setSchedules(updatedSchedules));
      
      toast({
        title: "Xóa lịch thi thành công!",
        description: `Lịch thi "${schedule.code}" đã được xóa.`,
      });

      // Close modal and go back
      setIsOpen(false);
      setTimeout(() => router.back(), 150);
    } catch (error: unknown) {
      console.error("Error deleting schedule:", error);
      
      let errorMessage = "Có lỗi xảy ra khi xóa lịch thi. Vui lòng thử lại.";
      
      if (error && typeof error === 'object') {
        const errorObj = error as {
          response?: {
            data?: {
              message?: string;
              error?: string;
            };
          };
          message?: string;
        };
        if (errorObj?.response?.data?.message) {
          errorMessage = errorObj.response.data.message;
        } else if (errorObj?.response?.data?.error) {
          errorMessage = errorObj.response.data.error;
        } else if (errorObj?.message) {
          errorMessage = errorObj.message;
        }
      }
      
      toast({
        title: "Lỗi khi xóa lịch thi",
        description: errorMessage,
        variant: "error",
      });
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <ConfirmDeleteModal
      title={schedule ? `Bạn có chắc chắn muốn xóa lịch thi "${schedule.code}"?` : "Xác nhận xóa lịch thi"}
      open={isOpen}
      onOpenChange={handleClose}
      onConfirm={handleConfirmDelete}
      isLoading={isDeleting}
    />
  );
} 