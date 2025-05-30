'use client';

import { useParams, useRouter } from 'next/navigation';
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { deleteAccount } from "@/features/account/services/accountService";
import { useDispatch } from "react-redux";
import { deleteAccount as deleteAccountAction } from "@/store/accountSlice";
import { toast } from "@/components/hooks/use-toast";

export default function DeleteAccountModalPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const dispatch = useDispatch();

  const handleConfirmDelete = async () => {
    try {
      await deleteAccount(id);
      dispatch(deleteAccountAction(id));
      toast({ title: 'Xóa tài khoản thành công!' });
      router.replace('/dashboard/account')
    } catch (err: any) {
      toast({
        title: 'Lỗi khi xóa tài khoản',
        description: err?.response?.data?.message || 'Không thể xóa tài khoản',
        variant: 'error',
      });
    }
  };

  return (
    <ConfirmDeleteModal
      title="Bạn có chắc chắn muốn xóa tài khoản này?"
      open={true}
      onConfirm={handleConfirmDelete}
      onOpenChange={() => router.back()}
    />
  );
}
