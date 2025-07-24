'use client';

import React, { useState} from 'react';
import { CustomModal } from '@/components/ui/CustomModal';
import { StudentTable } from '@/features/student/components/student-account/StudentTable';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addAccountsForStudents } from '@/features/account/services/accountService';
import { toast } from '@/components/hooks/use-toast';
import { addAccount as addAccountAction } from '@/store/accountSlice';
import { useDispatch } from 'react-redux';
import { AccountResponse } from '@/features/account/types/account';

type ListStudentModalProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
};


export const ListStudentModal = ({ open, onOpenChange }: ListStudentModalProps) => {
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const selectedIds = useSelector((state: RootState) => state.student.selectedIds);
    const students = useSelector((state: RootState) => state.student.students);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
        const selectedStudents = students.filter((student) =>
             selectedIds.map(Number).includes(student.id)
        );

        const accountData = selectedStudents.map((student) => ({
            accountname: student.fullName,
            email: student.email,
        }));

        const response = await addAccountsForStudents(accountData);
        const successAccounts = response.data.data.success;

        const newAccounts = successAccounts.map((account: AccountResponse) => ({
            id: account.id,
            accountname: account.accountname,
            email: account.email,
            role: account.role,
            isActive: account.isActive,
            urlAvatar: account.urlAvatar,
        }));
        newAccounts.forEach((account: AccountResponse) => {
            dispatch(addAccountAction(account));
        });
        toast({ title: 'Tạo danh sách tài khoản thành công!' })
        onOpenChange(false);
        } catch (err) {
            let errorMessage = 'Lỗi khi tạo danh sách tài khoản';
            if (err && typeof err === 'object' && 'response' in err && err.response && err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message;
            }
            toast({
                title: errorMessage,
                variant: 'error',
            });
        } finally {
        setLoading(false);
        }
    };

    return (
        <CustomModal
        open={open}
        setOpen={onOpenChange}
        title="Danh sách sinh viên"
        onSubmit={handleSubmit}
        submitLabel="Tạo tài khoản cho sinh viên"
        loading={loading}
        contentClassName='lg:min-w-[900px] h-[600px] w-[600px]'
        >

        <StudentTable />
        
        </CustomModal>
    );
};
export default ListStudentModal;
