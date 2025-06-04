"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import  { Edit, Delete, MoreHoriz, Visibility} from "@mui/icons-material";
import { ClassResponseDto } from "../types/class.type";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store"; 
import { hasPermission } from "@/lib/permissions"; 
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";


const ClassActionsCell = ({classes}: { classes: ClassResponseDto }) => {

  const router = useRouter();

  const permissions = useAuthStore((state) => state.permissions);

  const handleClassAction = (action: 'edit' | 'delete-class' | 'detail') => {
    try {
      router.push(`/dashboard/class/${action}/${classes.id}`);
    } catch (error) {
      console.error('Lỗi khi điều hướng:', error);
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
        <DropdownMenuLabel>Hành dộng</DropdownMenuLabel>
        {hasPermission(permissions, 'class:view') && (
          <DropdownMenuItem>
            <div 
            className="flex items-center justify-start py-1 gap-1 cursor-pointer"
            onClick={() => handleClassAction('detail')}
            >
              <Visibility sx={{ fontSize: 18}} className="cursor-pointer"/>
              Xem trước
            </div>
          </DropdownMenuItem>
        )}

        {hasPermission(permissions, 'class:update') && (
          <DropdownMenuItem>
              <>
                <div 
                  className="flex items-center justify-start py-1 gap-1 cursor-pointer"
                  onClick={() => handleClassAction('edit')}
                >
                  <Edit sx={{ fontSize: 18 }} />
                  Chỉnh sửa
                </div>
              </>
          </DropdownMenuItem>
        )}

        {hasPermission(permissions, 'class:delete') && (
          <DropdownMenuItem>
            <>
              <div className="flex items-center justify-start gap-1 cursor-pointer pb-1" onClick={() => handleClassAction('delete-class')}>
                <Delete sx={{ fontSize: 18 }} />
                Xóa
              </div>
            </>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const classColumns = (): ColumnDef<ClassResponseDto>[] => {

  return [
    {
      accessorKey: "code",
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Mã lớp học
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const u = row.original;
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <span>{u.code}</span>
          </div>
        );
      },
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
          <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Tên lớp học
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const u = row.original;
          return (
            <div className="relative flex items-center gap-2 ml-3">
              <span>{u.name}</span>
            </div>
          );
        },
      },
    {
      id: "actions",
      header: "Hành động",
      enableHiding: false,
      cell: ({ row }) => {
        const u = row.original;
        return <ClassActionsCell classes={u} />;
      },
    },
  ];
};
