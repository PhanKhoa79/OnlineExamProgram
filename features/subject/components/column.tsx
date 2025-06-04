"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import  { Edit, Delete, MoreHoriz, Visibility} from "@mui/icons-material";
import { SubjectResponseDto } from "../types/subject";
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

const SubjectActionsCell = ({subject}: { subject: SubjectResponseDto }) => {

  const router = useRouter();

  const permissions = useAuthStore((state) => state.permissions);

  const handleSubjectAction = (action: 'edit' | 'delete-subject' | 'detail') => {
    try {
      router.push(`/dashboard/subject/${action}/${subject.id}`);
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
        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
        {hasPermission(permissions, 'subject:view') && (
          <DropdownMenuItem>
            <div 
            className="flex items-center justify-start py-1 gap-1 cursor-pointer"
            onClick={() => handleSubjectAction('detail')}
            >
              <Visibility sx={{ fontSize: 18}} className="cursor-pointer"/>
              Xem trước
            </div>
          </DropdownMenuItem>
        )}

        {hasPermission(permissions, 'subject:update') && (
          <DropdownMenuItem>
            <div 
              className="flex items-center justify-start py-1 gap-1 cursor-pointer"
              onClick={() => handleSubjectAction('edit')}
            >
              <Edit sx={{ fontSize: 18 }} />
              Chỉnh sửa
            </div>
          </DropdownMenuItem>
        )}

        {hasPermission(permissions, 'subject:delete') && (
          <DropdownMenuItem>
            <div className="flex items-center justify-start gap-1 cursor-pointer pb-1" onClick={() => handleSubjectAction('delete-subject')}>
              <Delete sx={{ fontSize: 18 }} />
              Xóa
            </div>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const subjectColumns = (): ColumnDef<SubjectResponseDto>[] => {

  return [
    {
      accessorKey: "code",
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Mã môn học
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const s = row.original;
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <span>{s.code}</span>
          </div>
        );
      },
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
          <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Tên môn học
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const s = row.original;
          return (
            <div className="relative flex items-center gap-2 ml-3">
              <span>{s.name}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Mô tả
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const s = row.original;
          return (
            <div className="relative flex items-center gap-2 ml-3">
              <span className="truncate max-w-[200px]" title={s.description}>
                {s.description || "Không có mô tả"}
              </span>
            </div>
          );
        },
      },
    {
      id: "actions",
      header: "Hành động",
      enableHiding: false,
      cell: ({ row }) => {
        const s = row.original;
        return <SubjectActionsCell subject={s} />;
      },
    },
  ];
}; 