'use client';

import React, { useState} from 'react';
import { CustomModal } from '@/components/ui/CustomModal';
import { StudentTable } from '@/features/student/components/StudentTable';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addAccountsForStudents } from '@/features/account/services/accountService';
import { toast } from '@/components/hooks/use-toast';
import { addAccount as addAccountAction } from '@/store/accountSlice';
import { useDispatch } from 'react-redux';

export const ListStudentModal = () => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState<boolean>(false);
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
        toast({ title: 'Accounts created successfully!' })
        setOpen(false);
        } catch (err) {
            toast({
                title: err.response?.data?.message || 'Error creating accounts',
                variant: 'error',
              })
        } finally {
        setLoading(false);
        }
    };

    return (
        <CustomModal
        open={open}
        setOpen={setOpen}
        title="List Students"
        trigger={
            <Button className="grow bg-yellow-500 text-white hover:bg-yellow-800 cursor-pointer">
                <FileUpload />
                Upload Students
            </Button>
        }
        onSubmit={handleSubmit}
        submitLabel="Create Accounts"
        loading={loading}
        contentClassName='lg:min-w-[900px] h-[600px] w-[600px]'
        >

        <StudentTable />
        
        </CustomModal>
    );
};
export default ListStudentModal;
