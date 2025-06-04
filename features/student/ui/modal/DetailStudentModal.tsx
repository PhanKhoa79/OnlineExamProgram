"use client";

import React, { useState, useEffect } from "react";
import { Person, Edit, Delete, School } from "@mui/icons-material";
import { CustomModal } from "@/components/ui/CustomModal";
import { getStudentById, getAllStudents, deleteStudent } from "../../services/studentService";
import { getClassById } from "@/features/classes/services/classServices";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store";
import { hasPermission } from "@/lib/permissions";
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { toast } from '@/components/hooks/use-toast';
import AuthInput from "@/components/ui/AuthInput";
import { StudentDto } from "../../types/student";
import { useDispatch } from 'react-redux';
import { setStudents } from "@/store/studentSlice";
import { ClassResponseDto } from "@/features/classes/types/class.type";

type DetailStudentModalProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  id: number;
};

export function DetailStudentModal({ open, onOpenChange, id }: DetailStudentModalProps) {
  const router = useRouter();

  const [studentData, setStudentData] = useState<StudentDto | null>(null);
  const [classData, setClassData] = useState<ClassResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const permissions = useAuthStore((state) => state.permissions);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setIsLoading(true);
        const res = await getStudentById(id);
        if (res) {
          setStudentData(res);
          
          // Fetch class data if student has a classId
          if (res.classId) {
            try {
              const classRes = await getClassById(res.classId);
              setClassData(classRes);
            } catch (error) {
              console.error("Error fetching class data:", error);
              setClassData(null);
            }
          }
        } else {
          toast({
            title: "Error",
            description: "Lỗi khi lấy thông tin sinh viên",
            variant: "error",
          });
        }
      } catch (_error) {
        console.error("Error fetching student data:", _error);
        toast({
          title: "Error",
          description: "Lỗi khi lấy thông tin sinh viên",
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id && open) {
      fetchStudentData();
    }
  }, [id, open]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Chưa cập nhật";
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return "Không hợp lệ";
    }
  };

  const getClassDisplayName = () => {
    if (!studentData?.classId) return "Chưa phân lớp";
    if (!classData) return `Lớp ${studentData.classId}`;
    
    // Avoid duplicate display if code and name are the same
    if (classData.code === classData.name) {
      return classData.code;
    } else {
      return `${classData.code} - ${classData.name}`;
    }
  };

  if (isLoading) {
    return (
      <CustomModal
        open={open}
        setOpen={onOpenChange}
        title="Chi tiết sinh viên"
        submitLabel=""
        isSubmit={false}
      >
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </CustomModal>
    );
  }

  return (
    <CustomModal
      open={open}
      setOpen={onOpenChange}
      title="Chi tiết sinh viên"
      submitLabel=""
      isSubmit={false}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 dark:text-black">
          <AuthInput
            id="studentCode"
            title="Mã sinh viên"
            type="text"
            label="Student Code"
            value={studentData?.studentCode || ""}
            onChange={() => {}} // Read-only
            Icon={School}
            disabled
          />
        </div>

        <div className="flex flex-col gap-2 dark:text-black">
          <AuthInput
            id="fullName"
            title="Họ và tên"
            type="text"
            label="Full Name"
            value={studentData?.fullName || ""}
            onChange={() => {}} // Read-only
            Icon={Person}
            disabled
          />
        </div>

        <div className="flex flex-col gap-2 dark:text-black">
          <AuthInput
            id="email"
            title="Email"
            type="email"
            label="Email"
            value={studentData?.email || "Chưa có email"}
            onChange={() => {}} // Read-only
            Icon={Person}
            disabled
          />
        </div>

        <div className="flex flex-col gap-2 dark:text-black">
          <label className="block text-sm font-bold text-black-700 dark:text-white">
            Địa chỉ
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
            rows={3}
            value={studentData?.address || "Chưa cập nhật địa chỉ"}
            disabled
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="block text-sm font-bold text-black-700 dark:text-white">
            Thông tin chi tiết
          </span>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="break-words">
                <span className="font-medium text-gray-600 dark:text-gray-400">ID:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{studentData?.id}</span>
              </div>
              <div className="break-words">
                <span className="font-medium text-gray-600 dark:text-gray-400">Mã sinh viên:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{studentData?.studentCode}</span>
              </div>
              <div className="break-words">
                <span className="font-medium text-gray-600 dark:text-gray-400">Họ tên:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{studentData?.fullName}</span>
              </div>
              <div className="break-words">
                <span className="font-medium text-gray-600 dark:text-gray-400">Giới tính:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium
                  ${studentData?.gender === 'Nam' ? 'bg-blue-100 text-blue-800' : 
                    studentData?.gender === 'Nữ' ? 'bg-pink-100 text-pink-800' : 
                    'bg-gray-100 text-gray-800'}`}>
                  {studentData?.gender || "Chưa xác định"}
                </span>
              </div>
              <div className="break-words">
                <span className="font-medium text-gray-600 dark:text-gray-400">Ngày sinh:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{formatDate(studentData?.dateOfBirth)}</span>
              </div>
              <div className="break-words">
                <span className="font-medium text-gray-600 dark:text-gray-400">Số điện thoại:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{studentData?.phoneNumber || "Chưa có"}</span>
              </div>
              <div className="break-words overflow-hidden">
                <span className="font-medium text-gray-600 dark:text-gray-400">Email:</span>
                <span className="ml-2 text-blue-600 dark:text-blue-400 break-all">{studentData?.email || "Chưa có"}</span>
              </div>
              <div className="break-words">
                <span className="font-medium text-gray-600 dark:text-gray-400">Lớp học:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{getClassDisplayName()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-4 mt-6">
          {hasPermission(permissions, "student:update") && (
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors duration-200"
              onClick={() => {
                onOpenChange(false);
                setTimeout(() => {
                  router.push(`/dashboard/student/edit/${id}`);
                }, 50);
              }}
            >
              <Edit fontSize="small" />
              Chỉnh sửa
            </button>
          )}

          {hasPermission(permissions, "student:delete") && (
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded transition-colors duration-200"
              onClick={() => setShowConfirmDelete(true)}
            >
              <Delete fontSize="small" />
              Xóa
            </button>
          )}
        </div>

        <ConfirmDeleteModal
          title="Bạn có chắc chắn muốn xóa sinh viên này?"
          open={showConfirmDelete}
          onOpenChange={setShowConfirmDelete}
          onConfirm={async () => {
            try {
              await deleteStudent(id);
              const data = await getAllStudents();
              dispatch(setStudents(data));
              setShowConfirmDelete(false);
              onOpenChange(false);
              toast({ 
                title: 'Xóa sinh viên thành công!'
              });
              router.refresh();
            } catch (err: unknown) {
              toast({
                title: 'Lỗi khi xóa sinh viên',
                description: err instanceof Error 
                  ? err.message 
                  : (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không thể xóa sinh viên',
                variant: 'error',
              });
            }
          }}
        />
      </div>
    </CustomModal>
  );
} 