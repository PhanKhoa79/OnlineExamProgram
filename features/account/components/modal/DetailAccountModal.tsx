'use client';

import React, { useState, useEffect } from 'react';
import { CustomModal } from '@/components/ui/CustomModal';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import AuthInput from '@/components/ui/AuthInput';
import { Email, Person, Edit, Delete } from '@mui/icons-material';
import * as Tabs from '@radix-ui/react-tabs';
import { getAccountById, deleteAccount } from '@/features/account/services/accountService';
import { getPermissionsByRoleId } from '@/features/role/services/roleServices';
import { getLoginHistoryByAccountId } from '@/features/auth/services/authService';
import { useRouter } from "next/navigation";
import { hasPermission } from '@/lib/permissions';
import { useAuthStore } from '@/features/auth/store';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { toast } from '@/components/hooks/use-toast';
import { useDispatch } from 'react-redux';
import { deleteAccount as deleteAccountAction } from '@/store/accountSlice';
import { getPermissionClass, getPermissionIcon } from '@/utils/permissios.util'

interface DetailAccountModalProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  id: number;
}
export const DetailAccountModal = ({ open, onOpenChange, id }: DetailAccountModalProps) => {
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [permissions, setPermissions] = useState<string[]>([]);
    const [isActive, setIsActive] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [loginHistory, setLoginHistory] = useState<Array<{loginTime: string; ipAddress: string; userAgent: string}>>([]);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const router = useRouter();

    const idAccountCur = useAuthStore.getState().user?.role.id;

    const [permissionsAccountCur, setPermissionsAccountCur] = useState<string[]>([]);

    useEffect(() => {
        const fetchAccountAndPermissions = async () => {
            try {
                const res = await getAccountById(id);
                const data = res.data;

                setName(data.accountname);
                setEmail(data.email);
                setIsActive(data.isActive);
                setAvatarUrl(data.urlAvatar || '');
                setRole(data.role.name);
                setPermissions(data.role.permissions?.permissions || []);

                const roleId = data.role.id;

                const resPermissions = await getPermissionsByRoleId(roleId);
                if (resPermissions) {
                    setPermissions(resPermissions.permissions);
                } 

                if (idAccountCur !== undefined) {
                  const resPermissionsAccounCur = await getPermissionsByRoleId(idAccountCur);
                  setPermissionsAccountCur(resPermissionsAccounCur.permissions);
                }
            } catch (error) {
                console.error('Failed to fetch account or permissions:', error);
            }
        };
            if (open) fetchAccountAndPermissions();
    }, [id, open]);

    useEffect(() => {
        const fetchAccountAndPermissions = async () => {
            try {
                const res = await getLoginHistoryByAccountId(id);
                setLoginHistory(res.data);
            } catch (error) {
                console.error('Failed to fetch login history:', error);
            }
        };
        if (open) fetchAccountAndPermissions();
    }, [id]);

  return (
    <CustomModal open={open} setOpen={onOpenChange} title="Chi tiết tài khoản" isSubmit={false}>
      <Tabs.Root defaultValue="info" className="w-full">
        <Tabs.List className="flex space-x-4 border-b pb-2 mb-4 text-sm font-medium">
          <Tabs.Trigger value="info" className="px-4 py-1 border-b-2 data-[state=active]:border-blue-500">
            Thông tin
          </Tabs.Trigger>
          <Tabs.Trigger value="permissions" className="px-4 py-1 border-b-2 data-[state=active]:border-blue-500">
            Quyền
          </Tabs.Trigger>
          <Tabs.Trigger value="history" className="px-4 py-1 border-b-2 data-[state=active]:border-blue-500">
            Lịch sử đăng nhập
          </Tabs.Trigger>
        </Tabs.List>

        {/* Tab 1: Thông tin */}
        <Tabs.Content value="info" className="space-y-4 text-sm text-gray-800 dark:text-black">
          <AuthInput id="email" title="Email" type="email" label="Email" value={email} Icon={Email} disabled />
          <AuthInput id="name" title="Tên tài khoản" type="text" label="Tên tài khoản" value={name} Icon={Person} disabled />
          <div>
            <Label>Quyền</Label>
            <div className="inline-block mt-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md font-medium text-sm">{role}</div>
          </div>
          <div>
            <Label>Trạng thái</Label>
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 mt-2 text-sm font-medium w-fit
              ${isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              <span className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
              {isActive ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
            </span>
          </div>
          <div className="flex flex-col gap-2 items-center mt-4">
            <Label>Ảnh đại diện</Label>
            <Image
              src={avatarUrl || '/avatar.png'}
              alt="avatar"
              width={96}
              height={96}
              className="rounded-full object-cover border border-gray-300 shadow-sm"
            />
          </div>

          {/* Thông tin chi tiết */}
          <div className="flex flex-col gap-2 mt-6">
            <span className="block text-sm font-bold text-black-700 dark:text-white">
              Thông tin chi tiết
            </span>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="break-words">
                  <span className="font-medium text-gray-600 dark:text-gray-400">ID:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{id}</span>
                </div>
                <div className="break-words overflow-hidden">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Email:</span>
                  <span className="ml-2 text-gray-900 dark:text-white break-all">{email}</span>
                </div>
                <div className="break-words">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Tên tài khoản:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{name}</span>
                </div>
                <div className="break-words">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Quyền:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{role}</span>
                </div>
                <div className="break-words">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Trạng thái:</span>
                  <span className={`ml-2 font-medium ${isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {isActive ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
                  </span>
                </div>
                <div className="break-words">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Số quyền:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{permissions.length} quyền</span>
                </div>
                <div className="col-span-1 md:col-span-2 break-words">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Lịch sử đăng nhập:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {loginHistory.length > 0 ? `${loginHistory.length} lần đăng nhập` : 'Chưa đăng nhập'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Tabs.Content>

        {/* Tab 2: Danh sách quyền */}
        <Tabs.Content value="permissions" className="space-y-2 text-sm text-gray-700">
          <Label className="block mb-2 text-gray-600">Danh sách quyền:</Label>
          {permissions.length > 0 ? (
             <div className="flex flex-wrap gap-1">
              {permissions.map((permission: string) => (
                <span
                  key={permission}
                  className={`${getPermissionClass(permission)} flex items-center gap-1 text-xs font-medium mr-1 px-2.5 py-0.5 rounded`}
                >
                  {getPermissionIcon(permission)}
                  {permission}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 italic">Không có quyền nào được gán.</div>
          )}
        </Tabs.Content>

        {/* Tab 3: Lịch sử đăng nhập */}
        <Tabs.Content value="history" className="space-y-2 text-sm text-gray-700">
          <Label className="block mb-2 text-gray-600">Lịch sử đăng nhập:</Label>
          {loginHistory.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {loginHistory.map((entry, idx) => (
                <li key={idx} className="py-1">
                  <div className="text-sm text-gray-800">
                    🕒 <strong>{entry.loginTime}</strong> – {entry.ipAddress} <span className="text-gray-500">({entry.userAgent})</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500 italic">Chưa có lịch sử đăng nhập.</div>
          )}
        </Tabs.Content>
      </Tabs.Root>

      <div className="flex justify-between gap-4 mt-6">
        {hasPermission(permissionsAccountCur, "account:update") && (
          <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded"
               onClick={() => {
                onOpenChange(false); 
                setTimeout(() => {
                  router.push(`/dashboard/account/edit/${id}`);
                }, 50); 
              }}
          >
              <Edit fontSize="small" />
              Edit
          </button>
        )}
        
        {hasPermission(permissionsAccountCur, "account:delete") && (
          <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded"
              onClick={() => setShowConfirmDelete(true)}
              >
              <Delete fontSize="small" />
              Delete
          </button>
          )}
      </div>
      <ConfirmDeleteModal
        title="Bạn có chắc chắn muốn xóa tài khoản này?"
        open={showConfirmDelete}
        onOpenChange={setShowConfirmDelete}
        onConfirm={async () => {
              try {
                await deleteAccount(id);
                dispatch(deleteAccountAction(id));
                setShowConfirmDelete(false);
                onOpenChange(false);
                toast({ title: 'Xóa tài khoản thành công!' });
                router.refresh();
              } catch (err: unknown) {
                toast({
                  title: 'Lỗi khi xóa tài khoản',
                  description: err instanceof Error 
                    ? err.message 
                    : (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không thể xóa tài khoản',
                  variant: 'error',
                });
              }
        }}
        />
    </CustomModal>
  );
};

export default DetailAccountModal;
