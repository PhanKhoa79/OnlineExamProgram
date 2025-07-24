'use client';

import { useRouter } from 'next/navigation';
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { deleteManyAccounts } from  "@/features/account/services/accountService";
import { useDispatch } from "react-redux";
import {  deleteAccounts } from "@/store/accountSlice";
import { toast } from "@/components/hooks/use-toast";
import { RootState, AppDispatch } from "@/store"; 
import { useSelector } from "react-redux";

export default function DeleteAllAccountsModalPage() {

  const selectedIds = useSelector((state: RootState) => state.account.selectedIds);

  const router = useRouter();

 const dispatch = useDispatch<AppDispatch>();

  const handleConfirmDelete = async () => {
    try {
      await deleteManyAccounts(selectedIds);
      dispatch(deleteAccounts(selectedIds));
      toast({ title: 'Đã xóa tất cả tài khoản thành công!' });
      router.replace('/dashboard/account');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error && 'response' in err && 
        typeof err.response === 'object' && err.response &&
        'data' in err.response && 
        typeof err.response.data === 'object' && err.response.data &&
        'message' in err.response.data
        ? (err.response.data as { message: string }).message
        : 'Không thể xóa các tài khoản';
      
      toast({
        title: 'Lỗi khi xóa tất cả tài khoản',
        description: errorMessage,
        variant: 'error',
      });
    }
  };

  return (
    <ConfirmDeleteModal
      title={`Bạn có muốn xóa ${selectedIds.length} tài khoản`}
      open={true}
      onConfirm={handleConfirmDelete}
      onOpenChange={() => router.back()}
    />
  );
}
