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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error && 'response' in err && 
        typeof err.response === 'object' && err.response &&
        'data' in err.response && 
        typeof err.response.data === 'object' && err.response.data &&
        'message' in err.response.data
        ? (err.response.data as { message: string }).message
        : 'Không thể xóa tài khoản';
      
      toast({
        title: 'Lỗi khi xóa tài khoản',
        description: errorMessage,
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
