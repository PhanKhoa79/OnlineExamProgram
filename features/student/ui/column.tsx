"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Edit, Delete, MoreHoriz, Visibility } from "@mui/icons-material";
import { StudentDto } from "@/features/student/types/student";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store";
import { hasPermission } from "@/lib/permissions";
import { HighlightText } from "@/components/ui/HighlightText";
import { NewDataBadge } from "@/components/ui/NewDataBadge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { getClassById } from "@/features/classes/services/classServices";

const ClassNameCell = ({ classId }: { classId?: number }) => {
  const [className, setClassName] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClassName = async () => {
      if (!classId) {
        setClassName("Chưa phân lớp");
        return;
      }

      try {
        setLoading(true);
        const classData = await getClassById(classId);
        
        // Avoid duplicate display if code and name are the same
        if (classData.code === classData.name) {
          setClassName(classData.code);
        } else {
          setClassName(`${classData.code} - ${classData.name}`);
        }
      } catch (error) {
        console.error("Error fetching class:", error);
        setClassName(`Lớp ${classId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchClassName();
  }, [classId]);

  if (loading) {
    return (
      <div className="relative flex items-center gap-2 ml-3">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-400">
          Đang tải...
        </span>
      </div>
    );
  }

  return (
    <div className="relative flex items-center gap-2 ml-3">
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
        ${classId ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
        {className}
      </span>
    </div>
  );
};

const StudentActionsCell = ({ student }: { student: StudentDto }) => {
  const router = useRouter();
  const permissions = useAuthStore((state) => state.permissions);

  const handleStudentAction = (action: 'edit' | 'delete-student' | 'detail') => {
    try {
      router.push(`/dashboard/student/${action}/${student.id}`);
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
        {hasPermission(permissions, 'student:view') && (
          <DropdownMenuItem>
            <div 
              className="flex items-center justify-start py-1 gap-1 cursor-pointer"
              onClick={() => handleStudentAction('detail')}
            >
              <Visibility sx={{ fontSize: 18}} className="cursor-pointer"/>
              Xem trước
            </div>
          </DropdownMenuItem>
        )}

        {hasPermission(permissions, 'student:update') && (
          <DropdownMenuItem>
            <div 
              className="flex items-center justify-start py-1 gap-1 cursor-pointer"
              onClick={() => handleStudentAction('edit')}
            >
              <Edit sx={{ fontSize: 18 }} />
              Chỉnh sửa
            </div>
          </DropdownMenuItem>
        )}

        {hasPermission(permissions, 'student:delete') && (
          <DropdownMenuItem>
            <div className="flex items-center justify-start gap-1 cursor-pointer pb-1" onClick={() => handleStudentAction('delete-student')}>
              <Delete sx={{ fontSize: 18 }} />
              Xóa
            </div>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const studentColumns = (searchQuery: string = ""): ColumnDef<StudentDto>[] => {
  return [
    {
      accessorKey: "studentCode",
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Mã sinh viên
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const s = row.original;
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <HighlightText 
              text={s.studentCode} 
              searchQuery={searchQuery}
              className="font-medium"
            />
            <NewDataBadge createdAt={s.createdAt} />
          </div>
        );
      },
    },
    {
      accessorKey: "fullName",
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Họ và tên
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const s = row.original;
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <HighlightText 
              text={s.fullName} 
              searchQuery={searchQuery}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "dateOfBirth",
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Ngày sinh
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const s = row.original;
        const formatDate = (dateString?: string) => {
          if (!dateString) return "Chưa cập nhật";
          try {
            return new Date(dateString).toLocaleDateString('vi-VN');
          } catch {
            return "Không hợp lệ";
          }
        };
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <span>{formatDate(s.dateOfBirth)}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "gender",
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Giới tính
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const s = row.original;
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
              ${s.gender === 'Nam' ? 'bg-blue-100 text-blue-800' : 
                s.gender === 'Nữ' ? 'bg-pink-100 text-pink-800' : 
                'bg-gray-100 text-gray-800'}`}>
              {s.gender || "Chưa xác định"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Email
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const s = row.original;
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <HighlightText 
              text={s.email || "Chưa có email"} 
              searchQuery={searchQuery}
              className="text-blue-600"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "phoneNumber",
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Số điện thoại
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const s = row.original;
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <HighlightText 
              text={s.phoneNumber || "Chưa có SĐT"} 
              searchQuery={searchQuery}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Địa chỉ
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const s = row.original;
        return (
          <div className="relative flex items-center gap-2 ml-3">
            <HighlightText 
              text={s.address || "Chưa cập nhật"} 
              searchQuery={searchQuery}
              className="max-w-xs truncate"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "classId",
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Lớp học
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const s = row.original;
        return <ClassNameCell classId={s.classId} />;
      },
    },
    {
      id: "actions",
      header: "Hành động",
      enableHiding: false,
      cell: ({ row }) => {
        const s = row.original;
        return <StudentActionsCell student={s} />;
      },
    },
  ];
}; 