'use client';

import React, { useState} from 'react';
import { CustomModal } from '@/components/ui/CustomModal';
import { StudentTable } from '@/features/student/components/StudentTable';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addAccountsForStudents } from '@/features/account/services/accountService';
import { toast } from '@/components/hooks/use-toast';
import { addAccount as addAccountAction } from '@/store/accountSlice';
import { useDispatch } from 'react-redux';

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
        console.log('Response from server:', response);
        const successAccounts = response.data.data.success;

        const newAccounts = successAccounts.map(account => ({
            id: account.id,
            accountname: account.accountname,
            email: account.email,
            role: account.role,
            isActive: account.isActive,
            urlAvatar: account.urlAvatar,
        }));
        newAccounts.forEach(account => {
            dispatch(addAccountAction(account));
        });
        toast({ title: 'Tạo danh sách tài khoản thành công!' })
        onOpenChange(false);
        } catch (err) {
            toast({
                title: err.response?.data?.message || 'Lỗi khi tạo danh sách tài khoản',
                variant: 'error',
              })
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
