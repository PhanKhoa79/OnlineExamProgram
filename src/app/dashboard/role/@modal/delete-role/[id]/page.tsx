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
    } catch (err: any) {
      toast({
        title: 'Lỗi khi xóa quyền',
        description: err?.response?.data?.message || 'Không thể xóa quyền',
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
