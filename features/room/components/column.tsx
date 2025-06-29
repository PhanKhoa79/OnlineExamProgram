"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Edit, Delete, MoreHoriz, Visibility, Stop } from "@mui/icons-material";
import { RoomDto } from "../types/room";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store";
import { hasPermission } from "@/lib/permissions";
import { HighlightText } from "@/components/ui/HighlightText";
import { NewDataBadge } from "@/components/ui/NewDataBadge";
import { changeRoomStatus } from "../services/roomServices";
import { toast } from "@/components/hooks/use-toast";
import { ROOM_STATUS_COLORS } from "../data/roomConstants";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const RoomActionsCell = ({ room, onStatusChange }: { 
  room: RoomDto; 
  onStatusChange?: () => void;
}) => {
  const router = useRouter();
  const permissions = useAuthStore((state) => state.permissions);

  const handleRoomAction = (action: 'edit' | 'delete-room' | 'detail') => {
    try {
      router.push(`/dashboard/room/${action}/${room.id}`);
    } catch (error) {
      console.error('Lỗi khi điều hướng:', error);
    }
  };

  const handleStatusChange = async (status: 'waiting' | 'open' | 'closed') => {
    try {
      await changeRoomStatus(room.id, status);
      toast({ 
        title: 'Cập nhật trạng thái thành công!',
        description: `Phòng thi "${room.code}" đã được cập nhật trạng thái.`
      });
      onStatusChange?.();
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      toast({
        title: 'Lỗi cập nhật trạng thái',
        description: 'Không thể cập nhật trạng thái phòng thi. Vui lòng thử lại.',
        variant: 'error'
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Hành động</span>
          <MoreHoriz />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
        
        {hasPermission(permissions, 'room:view') && (
          <DropdownMenuItem>
            <div 
              className="flex items-center justify-start py-1 gap-1 cursor-pointer"
              onClick={() => handleRoomAction('detail')}
            >
              <Visibility sx={{ fontSize: 18}} className="cursor-pointer"/>
              Xem chi tiết
            </div>
          </DropdownMenuItem>
        )}

        {hasPermission(permissions, 'room:update') && room.status !== 'closed' && (
          <DropdownMenuItem>
            <div 
              className="flex items-center justify-start py-1 gap-1 cursor-pointer"
              onClick={() => handleStatusChange('closed')}
            >
              <Stop sx={{ fontSize: 18}} className="cursor-pointer text-red-600"/>
              Đóng phòng thi
            </div>
          </DropdownMenuItem>
        )}

        {hasPermission(permissions, 'room:update') && room.status === 'waiting' && (
          <DropdownMenuItem>
            <div 
              className="flex items-center justify-start py-1 gap-1 cursor-pointer"
              onClick={() => handleRoomAction('edit')}
            >
              <Edit sx={{ fontSize: 18 }} />
              Chỉnh sửa
            </div>
          </DropdownMenuItem>
        )}

        {hasPermission(permissions, 'room:delete') && (
          <DropdownMenuItem>
            <div 
              className="flex items-center justify-start gap-1 cursor-pointer pb-1" 
              onClick={() => handleRoomAction('delete-room')}
            >
              <Delete sx={{ fontSize: 18 }} />
              Xóa
            </div>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const roomColumns = (
  searchQuery: string = "",
  onStatusChange?: () => void
): ColumnDef<RoomDto>[] => {
  return [
    {
      accessorKey: "code",
      meta: {
        displayName: "Mã phòng thi"
      },
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Mã phòng thi
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const room = row.original;
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <HighlightText 
              text={room.code} 
              searchQuery={searchQuery}
            />
            <NewDataBadge createdAt={room.createdAt} />
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      meta: {
        displayName: "Trạng thái"
      },
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Trạng thái
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const room = row.original;
        const statusLabels = {
          'waiting': 'Chờ mở',
          'open': 'Đang mở',
          'closed': 'Đã đóng'
        };
        const colorClass = ROOM_STATUS_COLORS[room.status];
        const label = statusLabels[room.status];
        
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
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
      accessorKey: "exam.name",
      meta: {
        displayName: "Bài thi"
      },
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Bài thi
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const room = row.original;
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <HighlightText 
              text={room.exam?.name || 'N/A'} 
              searchQuery={searchQuery}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "class.name",
      meta: {
        displayName: "Lớp học"
      },
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Lớp học
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const room = row.original;
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <HighlightText 
              text={room.class?.name || 'N/A'} 
              searchQuery={searchQuery}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "examSchedule.code",
      meta: {
        displayName: "Lịch thi"
      },
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Lịch thi
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const room = row.original;
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <HighlightText 
              text={room.examSchedule?.code || 'N/A'} 
              searchQuery={searchQuery}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "maxParticipants",
      meta: {
        displayName: "Số người tối đa"
      },
      header: "Số người tối đa",
      cell: ({ row }) => {
        const room = row.original;
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <span>{room.maxParticipants || 'Không giới hạn'}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "randomizeOrder",
      meta: {
        displayName: "Trộn câu hỏi"
      },
      header: "Trộn câu hỏi",
      cell: ({ row }) => {
        const room = row.original;
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              room.randomizeOrder 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {room.randomizeOrder ? 'Có' : 'Không'}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      meta: {
        displayName: "Hành động"
      },
      header: "Hành động",
      cell: ({ row }) => {
        const room = row.original;
        return <RoomActionsCell room={room} onStatusChange={onStatusChange} />;
      },
    },
  ];
}; 