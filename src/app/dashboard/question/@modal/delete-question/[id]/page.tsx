'use client';

import { useParams, useRouter } from 'next/navigation';
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { deleteQuestion, getAllQuestions } from '@/features/question/services/questionService';
import { useDispatch } from 'react-redux';
import { toast } from "@/components/hooks/use-toast";
import { setQuestions } from '@/store/questionSlice';

export default function DeleteQuestionModalPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const dispatch = useDispatch();

  const handleConfirmDelete = async () => {
    try {
      await deleteQuestion(id);
      const data = await getAllQuestions();
      dispatch(setQuestions(data));
      toast({ title: 'Xóa câu hỏi thành công!' });
      router.replace('/dashboard/question');
    } catch (err: unknown) {
      toast({
        title: 'Lỗi khi xóa câu hỏi',
        description: err instanceof Error 
          ? err.message 
          : (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không thể xóa câu hỏi',
        variant: 'error',
      });
    }
  };

  return (
    <ConfirmDeleteModal
      title="Bạn có chắc chắn muốn xóa câu hỏi này?"
      open={true}
      onConfirm={handleConfirmDelete}
      onOpenChange={() => router.back()}
    />
  );
} 