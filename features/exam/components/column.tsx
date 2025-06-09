"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Edit, Delete, MoreHoriz, Visibility, FileDownload } from "@mui/icons-material";
import { ExamDto } from "../types/exam.type";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store";
import { hasPermission } from "@/lib/permissions";
import { HighlightText } from "@/components/ui/HighlightText";
import { exportExamWithQuestions } from "../services/examServices";
import { toast } from "@/components/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const ExamActionsCell = ({ exam }: { exam: ExamDto }) => {
  const router = useRouter();
  const permissions = useAuthStore((state) => state.permissions);

  const handleExamAction = (action: 'edit' | 'delete-exam' | 'detail') => {
    try {
      router.push(`/dashboard/exam/${action}/${exam.id}`);
    } catch (error) {
      console.error('Lỗi khi điều hướng:', error);
    }
  };

  const handleExportExam = async (format: 'excel' | 'csv') => {
    try {
      await exportExamWithQuestions(exam.id, format);
      toast({ 
        title: `Xuất file ${format.toUpperCase()} thành công!`,
        description: `Đề thi "${exam.name}" đã được xuất thành công.`
      });
    } catch (error) {
      console.error('Lỗi khi xuất đề thi:', error);
      toast({
        title: 'Lỗi xuất file',
        description: 'Không thể xuất đề thi. Vui lòng thử lại.',
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
        {hasPermission(permissions, 'exam:view') && (
          <DropdownMenuItem>
            <div 
              className="flex items-center justify-start py-1 gap-1 cursor-pointer"
              onClick={() => handleExamAction('detail')}
            >
              <Visibility sx={{ fontSize: 18}} className="cursor-pointer"/>
              Xem chi tiết
            </div>
          </DropdownMenuItem>
        )}

        {hasPermission(permissions, 'exam:view') && (
          <>
            <DropdownMenuItem>
              <div 
                className="flex items-center justify-start py-1 gap-1 cursor-pointer"
                onClick={() => handleExportExam('excel')}
              >
                <FileDownload sx={{ fontSize: 18}} className="cursor-pointer"/>
                Xuất Excel
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div 
                className="flex items-center justify-start py-1 gap-1 cursor-pointer"
                onClick={() => handleExportExam('csv')}
              >
                <FileDownload sx={{ fontSize: 18}} className="cursor-pointer"/>
                Xuất CSV
              </div>
            </DropdownMenuItem>
          </>
        )}

        {hasPermission(permissions, 'exam:update') && (
          <DropdownMenuItem>
            <div 
              className="flex items-center justify-start py-1 gap-1 cursor-pointer"
              onClick={() => handleExamAction('edit')}
            >
              <Edit sx={{ fontSize: 18 }} />
              Chỉnh sửa
            </div>
          </DropdownMenuItem>
        )}

        {hasPermission(permissions, 'exam:delete') && (
          <DropdownMenuItem>
            <div 
              className="flex items-center justify-start gap-1 cursor-pointer pb-1" 
              onClick={() => handleExamAction('delete-exam')}
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

export const examColumns = (searchQuery: string = ""): ColumnDef<ExamDto>[] => {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Tên đề thi
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const exam = row.original;
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <HighlightText 
              text={exam.name} 
              searchQuery={searchQuery}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "examType",
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Loại đề thi
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const exam = row.original;
        const typeColors = {
          'practice': 'bg-blue-100 text-blue-800',
          'official': 'bg-green-100 text-green-800'
        };
        const typeLabels = {
          'practice': 'Luyện tập',
          'official': 'Chính thức'
        };
        const colorClass = typeColors[exam.examType];
        const label = typeLabels[exam.examType];
        
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
      accessorKey: "duration",
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Thời gian (phút)
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const exam = row.original;
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <span>{exam.duration} phút</span>
          </div>
        );
      },
    },
    {
      accessorKey: "totalQuestions",
      header: "Số câu hỏi",
      cell: ({ row }) => {
        const exam = row.original;
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <span>{exam.totalQuestions}</span>
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
        const exam = row.original;
        
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <div className="flex flex-col">
              <HighlightText 
                text={exam.subject.name} 
                searchQuery={searchQuery}
                className="font-medium"
              />
              <span className="text-xs text-gray-500">
                {exam.subject.code}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Hành động",
      enableHiding: false,
      cell: ({ row }) => {
        const exam = row.original;
        return <ExamActionsCell exam={exam} />;
      },
    },
  ];
}; 