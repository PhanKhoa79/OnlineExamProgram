'use client';

import { useParams, useRouter } from 'next/navigation';
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { deleteClassById, getAllClasses } from '@/features/classes/services/classServices';
import { useDispatch } from 'react-redux';
import { toast } from "@/components/hooks/use-toast";
import { setClasses } from '@/store/classSlice';

export default function DeleteClassModalPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const dispatch = useDispatch();

  const handleConfirmDelete = async () => {
    try {
      await deleteClassById(id);
      const data = await getAllClasses();
      dispatch(setClasses(data));
      toast({ title: 'Xóa lớp học thành công!' });
      router.replace('/dashboard/class');
    } catch (err: unknown) {
      toast({
        title: 'Lỗi khi xóa lớp học',
        description: err instanceof Error 
          ? err.message 
          : (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không thể xóa lớp học',
        variant: 'error',
      });
    }
  };

  return (
    <ConfirmDeleteModal
      title="Bạn có chắc chắn muốn xóa lớp học này?"
      open={true}
      onConfirm={handleConfirmDelete}
      onOpenChange={() => router.back()}
    />
  );
} 