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
    } catch (err: any) {
      toast({
        title: 'Lỗi khi xóa tất cả tài khoản',
        description: err?.response?.data?.message || 'Không thể xóa các tài khoản',
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
