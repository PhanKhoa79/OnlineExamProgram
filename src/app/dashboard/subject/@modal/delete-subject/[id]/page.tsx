'use client';

import { useParams, useRouter } from 'next/navigation';
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { deleteSubject, getAllSubjects } from '@/features/subject/services/subjectServices';
import { useDispatch } from 'react-redux';
import { toast } from "@/components/hooks/use-toast";
import { setSubjects } from '@/store/subjectSlice';

export default function DeleteSubjectModalPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const dispatch = useDispatch();

  const handleConfirmDelete = async () => {
    try {
      await deleteSubject(id);
      const data = await getAllSubjects();
      dispatch(setSubjects(data));
      toast({ title: 'Xóa môn học thành công!' });
      router.replace('/dashboard/subject');
    } catch (err: unknown) {
      toast({
        title: 'Lỗi khi xóa môn học',
        description: err instanceof Error 
          ? err.message 
          : (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không thể xóa môn học',
        variant: 'error',
      });
    }
  };

  return (
    <ConfirmDeleteModal
      title="Bạn có chắc chắn muốn xóa môn học này?"
      open={true}
      onConfirm={handleConfirmDelete}
      onOpenChange={() => router.back()}
    />
  );
} 