"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Edit, Delete, MoreHoriz, Visibility, Cancel } from "@mui/icons-material";
import { ExamScheduleDto } from "../types/schedule";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store";
import { hasPermission } from "@/lib/permissions";
import { HighlightText } from "@/components/ui/HighlightText";
import { NewDataBadge } from "@/components/ui/NewDataBadge";
import { cancelSchedule, getAllSchedules } from "../services/scheduleServices";
import { toast } from "@/components/hooks/use-toast";
import { useDispatch } from "react-redux";
import { setSchedules } from "@/store/scheduleSlice";
import { CancelScheduleModal } from "./modal/CancelScheduleModal";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const ScheduleActionsCell = ({ schedule }: { schedule: ExamScheduleDto }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const permissions = useAuthStore((state) => state.permissions);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleScheduleAction = (action: 'edit' | 'delete-schedule' | 'detail') => {
    try {
      router.push(`/dashboard/schedule/${action}/${schedule.id}`);
    } catch (error) {
      console.error('Lỗi khi điều hướng:', error);
    }
  };

  const handleCancelSchedule = async (reason: string) => {
    try {
      await cancelSchedule(schedule.id, reason);
      
      const updatedSchedules = await getAllSchedules();
      dispatch(setSchedules(updatedSchedules));
      
      toast({ 
        title: 'Hủy lịch thi thành công!',
        description: `Lịch thi "${schedule.code}" đã được hủy.`
      });
    } catch (error: unknown) {
      console.error('Lỗi khi hủy lịch thi:', error);
      
      let errorMessage = 'Không thể hủy lịch thi. Vui lòng thử lại.';
      
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
        title: 'Lỗi hủy lịch thi',
        description: errorMessage,
        variant: 'error'
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Hành động</span>
            <MoreHoriz />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
          {hasPermission(permissions, 'schedule:view') && (
            <DropdownMenuItem>
              <div 
                className="flex items-center justify-start py-1 gap-1 cursor-pointer"
                onClick={() => handleScheduleAction('detail')}
              >
                <Visibility sx={{ fontSize: 18}} className="cursor-pointer"/>
                Xem chi tiết
              </div>
            </DropdownMenuItem>
          )}

          {hasPermission(permissions, 'schedule:update') && schedule.status === 'active' && (
            <DropdownMenuItem>
              <div 
                className="flex items-center justify-start py-1 gap-1 cursor-pointer"
                onClick={() => handleScheduleAction('edit')}
              >
                <Edit sx={{ fontSize: 18 }} />
                Chỉnh sửa
              </div>
            </DropdownMenuItem>
          )}

          {hasPermission(permissions, 'schedule:update') && schedule.status === 'active' && (
            <DropdownMenuItem>
              <div 
                className="flex items-center justify-start py-1 gap-1 cursor-pointer"
                onClick={() => setShowCancelModal(true)}
              >
                <Cancel sx={{ fontSize: 18 }} />
                Hủy lịch thi
              </div>
            </DropdownMenuItem>
          )}

          {hasPermission(permissions, 'schedule:delete') && (
            <DropdownMenuItem>
              <div 
                className="flex items-center justify-start gap-1 cursor-pointer pb-1" 
                onClick={() => handleScheduleAction('delete-schedule')}
              >
                <Delete sx={{ fontSize: 18 }} />
                Xóa
              </div>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <CancelScheduleModal
        open={showCancelModal}
        onOpenChange={setShowCancelModal}
        schedule={schedule}
        onConfirm={handleCancelSchedule}
      />
    </>
  );
};

export const scheduleColumns = (searchQuery: string = ""): ColumnDef<ExamScheduleDto>[] => {
  return [
    {
      accessorKey: "code",
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Mã lịch thi
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const schedule = row.original;
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <HighlightText 
              text={schedule.code} 
              searchQuery={searchQuery}
            />
            <NewDataBadge createdAt={schedule.createdAt} />
          </div>
        );
      },
    },
    {
      accessorKey: "startTime",
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Thời gian bắt đầu
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const schedule = row.original;
        const startDate = new Date(schedule.startTime);
        const formattedDate = startDate.toLocaleString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <span>{formattedDate}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "endTime",
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Thời gian kết thúc
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const schedule = row.original;
        const endDate = new Date(schedule.endTime);
        const formattedDate = endDate.toLocaleString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <span>{formattedDate}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "subject",
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Môn học
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const schedule = row.original;
        const subjectName = schedule.subject?.name || 'Không xác định';
        
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <HighlightText 
              text={subjectName} 
              searchQuery={searchQuery}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Trạng thái
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const schedule = row.original;
        const statusColors = {
          'active': 'bg-green-100 text-green-800',
          'completed': 'bg-blue-100 text-blue-800',
          'cancelled': 'bg-red-100 text-red-800'
        };
        const statusLabels = {
          'active': 'Hoạt động',
          'completed': 'Hoàn thành',
          'cancelled': 'Đã hủy'
        };
        const colorClass = statusColors[schedule.status];
        const label = statusLabels[schedule.status];
        
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
              <HighlightText 
                text={label} 
                searchQuery={searchQuery}
              />
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Mô tả",
      cell: ({ row }) => {
        const schedule = row.original;
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <HighlightText 
              text={schedule.description || 'Không có mô tả'} 
              searchQuery={searchQuery}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Ngày tạo
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const schedule = row.original;
        const createdDate = new Date(schedule.createdAt);
        const formattedDate = createdDate.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <span>{formattedDate}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const schedule = row.original;
        return <ScheduleActionsCell schedule={schedule} />;
      },
    },
  ];
}; 