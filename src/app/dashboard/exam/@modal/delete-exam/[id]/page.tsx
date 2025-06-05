'use client';

import { useParams, useRouter } from 'next/navigation';
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { deleteExam, getAllExams } from '@/features/exam/services/examServices';
import { useDispatch } from 'react-redux';
import { toast } from "@/components/hooks/use-toast";
import { setExams } from '@/store/examSlice';

export default function DeleteExamModalPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const dispatch = useDispatch();

  const handleConfirmDelete = async () => {
    try {
      await deleteExam(id);
      const data = await getAllExams();
      dispatch(setExams(data));
      toast({ title: 'Xóa đề thi thành công!' });
      router.replace('/dashboard/exam');
    } catch (err: unknown) {
      toast({
        title: 'Lỗi khi xóa đề thi',
        description: err instanceof Error 
          ? err.message 
          : (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không thể xóa đề thi',
        variant: 'error',
      });
    }
  };

  return (
    <ConfirmDeleteModal
      title="Bạn có chắc chắn muốn xóa đề thi này?"
      open={true}
      onConfirm={handleConfirmDelete}
      onOpenChange={() => router.back()}
    />
  );
} 