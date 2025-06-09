"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";
import { Edit, Delete, MoreHoriz, Visibility } from "@mui/icons-material";
import { QuestionDto } from "../types/question.type";
import { SubjectResponseDto } from "@/features/subject/types/subject";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store";
import { hasPermission } from "@/lib/permissions";
import { HighlightText } from "@/components/ui/HighlightText";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const QuestionActionsCell = ({ question }: { question: QuestionDto }) => {
  const router = useRouter();
  const permissions = useAuthStore((state) => state.permissions);

  const handleQuestionAction = (action: 'edit' | 'delete-question' | 'detail') => {
    try {
      router.push(`/dashboard/question/${action}/${question.id}`);
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
        {hasPermission(permissions, 'question:view') && (
          <DropdownMenuItem>
            <div 
              className="flex items-center justify-start py-1 gap-1 cursor-pointer"
              onClick={() => handleQuestionAction('detail')}
            >
              <Visibility sx={{ fontSize: 18}} className="cursor-pointer"/>
              Xem trước
            </div>
          </DropdownMenuItem>
        )}

        {hasPermission(permissions, 'question:update') && (
          <DropdownMenuItem>
            <div 
              className="flex items-center justify-start py-1 gap-1 cursor-pointer"
              onClick={() => handleQuestionAction('edit')}
            >
              <Edit sx={{ fontSize: 18 }} />
              Chỉnh sửa
            </div>
          </DropdownMenuItem>
        )}

        {hasPermission(permissions, 'question:delete') && (
          <DropdownMenuItem>
            <div 
              className="flex items-center justify-start gap-1 cursor-pointer pb-1" 
              onClick={() => handleQuestionAction('delete-question')}
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

export const questionColumns = (subjects: SubjectResponseDto[] = [], searchQuery: string = ""): ColumnDef<QuestionDto>[] => {
  // Tạo map để lookup subject name by ID
  const subjectMap = subjects.reduce((acc, subject) => {
    acc[subject.id] = subject;
    return acc;
  }, {} as Record<number, SubjectResponseDto>);

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Chọn tất cả"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Chọn hàng"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "questionText",
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Nội dung câu hỏi
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const question = row.original;
        const truncatedText = question.questionText.length > 50 
          ? `${question.questionText.substring(0, 50)}...` 
          : question.questionText;
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <HighlightText 
              text={truncatedText} 
              searchQuery={searchQuery}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "difficultyLevel",
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Độ khó
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const question = row.original;
        const difficultyColors = {
          'dễ': 'bg-green-100 text-green-800',
          'trung bình': 'bg-yellow-100 text-yellow-800',
          'khó': 'bg-red-100 text-red-800'
        };
        const colorClass = difficultyColors[question.difficultyLevel || 'trung bình'];
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
              <HighlightText 
                text={question.difficultyLevel || 'Chưa xác định'} 
                searchQuery={searchQuery}
              />
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "answers",
      header: "Số câu trả lời",
      cell: ({ row }) => {
        const question = row.original;
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <span>{question.answers?.length || 0}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "subjectId",
      header: "Môn học",
      cell: ({ row }) => {
        const question = row.original;
        if (!question.subjectId) {
          return (
            <div className="relative flex items-center gap-2 ml-3">
              <span className="text-gray-500">Chưa phân loại</span>
            </div>
          );
        }
        
        const subject = subjectMap[question.subjectId];
        return (
          <div className="relative flex items-center gap-2 ">
            <span>{subject ? `${subject.name}` : `ID: ${question.subjectId}`}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Hành động",
      enableHiding: false,
      cell: ({ row }) => {
        const question = row.original;
        return <QuestionActionsCell question={question} />;
      },
    },
  ];
}; 