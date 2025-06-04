"use client";

import { useParams, useRouter } from "next/navigation";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { deleteStudent } from "@/features/student/services/studentService";
import { toast } from "@/components/hooks/use-toast";
import { useDispatch } from "react-redux";
import { removeStudent } from "@/store/studentSlice";


export default function DeleteStudentPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useParams();
  const id = Number(params.id);

  const handleConfirm = async () => {
    try {
      await deleteStudent(id);
      dispatch(removeStudent(id));
      toast({
        title: "Thành công",
        description: "Xóa sinh viên thành công!",
      });
      router.replace("/dashboard/student");
    } catch (error: unknown) {
      toast({
        title: "Lỗi",
        description: error instanceof Error 
          ? error.message 
          : (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Có lỗi xảy ra khi xóa sinh viên",
        variant: "error",
      });
    }
  };

  return (
    <ConfirmDeleteModal
      title="Bạn có chắc chắn muốn xóa sinh viên này?"
      open={true}
      onOpenChange={() => router.back()}
      onConfirm={handleConfirm}
    />
  );
} 