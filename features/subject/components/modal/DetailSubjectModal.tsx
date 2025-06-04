"use client";

import React, { useState, useEffect } from "react";
import { School, Edit, Delete } from "@mui/icons-material";
import { CustomModal } from "@/components/ui/CustomModal";
import { getSubjectById, getAllSubjects, deleteSubject } from "../../services/subjectServices";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store";
import { hasPermission } from "@/lib/permissions";
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { toast } from '@/components/hooks/use-toast';
import { useDispatch } from 'react-redux';
import { setSubjects } from "@/store/subjectSlice";
import AuthInput from "@/components/ui/AuthInput";
import { SubjectResponseDto } from "../../types/subject";

type DetailSubjectModalProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  id: number;
};

export function DetailSubjectModal({ open, onOpenChange, id }: DetailSubjectModalProps) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [subjectData, setSubjectData] = useState<SubjectResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const permissions = useAuthStore((state) => state.permissions);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        setIsLoading(true);
        const res = await getSubjectById(id);
        if (res) {
          setSubjectData(res);
        } else {
          toast({
            title: "Error",
            description: "Lỗi khi lấy thông tin môn học",
            variant: "error",
          });
        }
      } catch (error) {
        console.error("Error fetching subject data:", error);
        toast({
          title: "Error",
          description: "Lỗi khi lấy thông tin môn học",
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id && open) {
      fetchSubjectData();
    }
  }, [id, open]);

  if (isLoading) {
    return (
      <CustomModal
        open={open}
        setOpen={onOpenChange}
        title="Chi tiết môn học"
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
      title="Chi tiết môn học"
      submitLabel=""
      isSubmit={false}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 dark:text-black">
          <AuthInput
            id="subjectCode"
            title="Mã môn học"
            type="text"
            label="Subject Code"
            value={subjectData?.code || ""}
            onChange={() => {}} // Read-only
            Icon={School}
            disabled
          />
        </div>

        <div className="flex flex-col gap-2 dark:text-black">
          <AuthInput
            id="subjectName"
            title="Tên môn học"
            type="text"
            label="Subject Name"
            value={subjectData?.name || ""}
            onChange={() => {}} // Read-only
            Icon={School}
            disabled
          />
        </div>

        <div className="flex flex-col gap-2 dark:text-black">
          <label className="block text-sm font-bold text-black-700 dark:text-white">
            Mô tả
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
            rows={4}
            value={subjectData?.description || "Không có mô tả"}
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
                <span className="ml-2 text-gray-900 dark:text-white">{subjectData?.id}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">Mã môn:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{subjectData?.code}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">Tên môn học:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{subjectData?.name}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-4 mt-6">
          {hasPermission(permissions, "subject:update") && (
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors duration-200"
              onClick={() => {
                onOpenChange(false);
                setTimeout(() => {
                  router.push(`/dashboard/subject/edit/${id}`);
                }, 50);
              }}
            >
              <Edit fontSize="small" />
              Chỉnh sửa
            </button>
          )}

          {hasPermission(permissions, "subject:delete") && (
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
          title="Bạn có chắc chắn muốn xóa môn học này?"
          open={showConfirmDelete}
          onOpenChange={setShowConfirmDelete}
          onConfirm={async () => {
            try {
              await deleteSubject(id);
              const data = await getAllSubjects();
              dispatch(setSubjects(data));
              setShowConfirmDelete(false);
              onOpenChange(false);
              toast({ 
                title: 'Xóa môn học thành công!'
              });
              router.refresh();
            } catch (err: unknown) {
              toast({
                title: 'Lỗi khi xóa môn học',
                description: err instanceof Error 
                  ? err.message 
                  : (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không thể xóa môn học',
                variant: 'error',
              });
            }
          }}
        />
      </div>
    </CustomModal>
  );
} 