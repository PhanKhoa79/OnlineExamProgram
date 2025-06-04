"use client";

import React, { useState, useEffect } from "react";
import { School, Edit, Delete } from "@mui/icons-material";
import { CustomModal } from "@/components/ui/CustomModal";
import { getClassById, getAllClasses, deleteClassById } from "../../services/classServices";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store";
import { hasPermission } from "@/lib/permissions";
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { toast } from '@/components/hooks/use-toast';
import { useDispatch } from 'react-redux';
import { setClasses } from "@/store/classSlice";
import AuthInput from "@/components/ui/AuthInput";
import { ClassResponseDto } from "../../types/class.type";

type DetailClassModalProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  id: number;
};

export function DetailClassModal({ open, onOpenChange, id }: DetailClassModalProps) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [classData, setClassData] = useState<ClassResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const permissions = useAuthStore((state) => state.permissions);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        setIsLoading(true);
        const res = await getClassById(id);
        if (res) {
          setClassData(res);
        } else {
          toast({
            title: "Error",
            description: "Lỗi khi lấy thông tin lớp học",
            variant: "error",
          });
        }
      } catch (error) {
        console.error("Error fetching class data:", error);
        toast({
          title: "Error",
          description: "Lỗi khi lấy thông tin lớp học",
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id && open) {
      fetchClassData();
    }
  }, [id, open]);

  if (isLoading) {
    return (
      <CustomModal
        open={open}
        setOpen={onOpenChange}
        title="Chi tiết lớp học"
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
      title="Chi tiết lớp học"
      submitLabel=""
      isSubmit={false}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 dark:text-black">
          <AuthInput
            id="classCode"
            title="Mã lớp học"
            type="text"
            label="Class Code"
            value={classData?.code || ""}
            onChange={() => {}} // Read-only
            Icon={School}
            disabled
          />
        </div>

        <div className="flex flex-col gap-2 dark:text-black">
          <AuthInput
            id="className"
            title="Tên lớp học"
            type="text"
            label="Class Name"
            value={classData?.name || ""}
            onChange={() => {}} // Read-only
            Icon={School}
            disabled
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="block text-sm font-bold text-black-700 dark:text-white">
            Thông tin chi tiết
          </span>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">ID:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{classData?.id}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">Mã lớp:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{classData?.code}</span>
              </div>
              <div className="col-span-2">
                <span className="font-medium text-gray-600 dark:text-gray-400">Tên lớp học:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{classData?.name}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-4 mt-6">
          {hasPermission(permissions, "class:update") && (
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors duration-200"
              onClick={() => {
                onOpenChange(false);
                setTimeout(() => {
                  router.push(`/dashboard/class/edit/${id}`);
                }, 50);
              }}
            >
              <Edit fontSize="small" />
              Chỉnh sửa
            </button>
          )}

          {hasPermission(permissions, "class:delete") && (
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
          title="Bạn có chắc chắn muốn xóa lớp học này?"
          open={showConfirmDelete}
          onOpenChange={setShowConfirmDelete}
          onConfirm={async () => {
            try {
              await deleteClassById(id);
              const data = await getAllClasses();
              dispatch(setClasses(data));
              setShowConfirmDelete(false);
              onOpenChange(false);
              toast({ 
                title: 'Xóa lớp học thành công!'
              });
              router.refresh();
            } catch (err: unknown) {
              toast({
                title: 'Lỗi khi xóa lớp học',
                description: err instanceof Error 
                  ? err.message 
                  : (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không thể xóa lớp học',
                variant: 'error',
              });
            }
          }}
        />
      </div>
    </CustomModal>
  );
}
