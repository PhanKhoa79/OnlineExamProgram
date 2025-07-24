'use client';

import { useParams, useRouter } from 'next/navigation';
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { deleteRoleById, getAllRolesWithPermissions } from '@/features/role/services/roleServices';
import { useDispatch } from 'react-redux';
import { toast } from "@/components/hooks/use-toast";
import { setRoles } from '@/store/roleSlice';

export default function DeleteRoleModalPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const dispatch = useDispatch();

  const handleConfirmDelete = async () => {
    try {
      await deleteRoleById(id);
      const data = await getAllRolesWithPermissions();
      dispatch(setRoles(data));
      toast({ title: 'Xóa quyền thành công!' });
      router.replace('/dashboard/role')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error && 'response' in err && 
        typeof err.response === 'object' && err.response &&
        'data' in err.response && 
        typeof err.response.data === 'object' && err.response.data &&
        'message' in err.response.data
        ? (err.response.data as { message: string }).message
        : 'Không thể xóa quyền';
      
      toast({
        title: 'Lỗi khi xóa quyền',
        description: errorMessage,
        variant: 'error',
      });
    }
  };

  return (
    <ConfirmDeleteModal
      title="Bạn có chắc chắn muốn xóa quyền này?"
      open={true}
      onConfirm={handleConfirmDelete}
      onOpenChange={() => router.back()}
    />
  );
}
