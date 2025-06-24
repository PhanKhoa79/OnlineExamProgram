"use client";

import React, { useState, useEffect } from "react";

import AuthInput from "@/components/ui/AuthInput";
import {Person, Edit, Delete} from "@mui/icons-material";
import { CustomModal } from "@/components/ui/CustomModal";
import { getPermissionsByRoleId, getAllRolesWithPermissions, deleteRoleById } from "../../services/roleServices";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store";
import { hasPermission } from "@/lib/permissions";
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { toast } from '@/components/hooks/use-toast';
import { useDispatch } from 'react-redux';
import { setRoles } from "@/store/roleSlice";
import { getPermissionClass, getPermissionIcon } from '@/utils/permissios.util'

type DetailRoleModalProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  id: number;
};

export function DetailRoleModal({ open, onOpenChange, id }: DetailRoleModalProps) {
    const dispatch = useDispatch();
    const router = useRouter();

    const [roleName, setRoleName] = useState<string>("");

    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

    const idAccountCur = useAuthStore.getState().user?.role.id;
    
    const [permissionsAccountCur, setPermissionsAccountCur] = useState<string[]>([]);

    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    // Check if role is moderator (case-insensitive)
    const isModerator = roleName.toLowerCase() === 'moderator';

    useEffect(() => {
        (async () => {
            const res = await getPermissionsByRoleId(id);
            if (res) {
                setRoleName(res.name);
                setSelectedPermissions(res.permissions);
            } else {
                toast({
                    title: "Error",
                    description: "Lỗi khi lấy thông tin quyền",
                    variant: "error",
                });
            }

            if (idAccountCur !== undefined) {
                const resPermissionsAccounCur = await getPermissionsByRoleId(idAccountCur);
                setPermissionsAccountCur(resPermissionsAccounCur.permissions);
            }
        })();
    }, [id]);

    return (
        <CustomModal
        open={open}
        setOpen={onOpenChange}
        title="Sửa quyền"
        submitLabel="Cập nhật"
        isSubmit={false}
        >

        <div className="flex flex-col gap-2 dark:text-black">
            <AuthInput
            id="role"
            title="Tên quyền"
            type="text"
            label="Role"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            Icon={Person}
            disabled
            />
        </div>

        <div className="flex flex-col gap-1">
            <span className="block text-sm font-bold text-black-700">Danh sách quyền</span>
            {selectedPermissions.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                {selectedPermissions.map((permission: string) => (
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
        </div>

        {/* Thông tin chi tiết */}
        <div className="flex flex-col gap-2 mt-4">
            <span className="block text-sm font-bold text-black-700 dark:text-white">
                Thông tin chi tiết
            </span>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">ID:</span>
                        <span className="ml-2 text-gray-900 dark:text-white">{id}</span>
                    </div>
                    <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">Tên quyền:</span>
                        <span className="ml-2 text-gray-900 dark:text-white">{roleName}</span>
                    </div>
                    <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">Số lượng quyền:</span>
                        <span className="ml-2 text-gray-900 dark:text-white">{selectedPermissions.length} quyền</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Warning message for moderator role */}
        {isModerator && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                        Quyền Moderator không thể bị xóa vì đây là quyền hệ thống quan trọng.
                    </span>
                </div>
            </div>
        )}

            <div className="flex justify-between gap-4 mt-6">
                {hasPermission(permissionsAccountCur, "role:update") && (
                    <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded"
                        onClick={() => {
                            onOpenChange(false); 
                            setTimeout(() => {
                            router.push(`/dashboard/role/edit/${id}`);
                            }, 50); 
                        }}
                    >
                        <Edit fontSize="small" />
                        Edit
                    </button>
                )}

                {hasPermission(permissionsAccountCur, "role:delete") && !isModerator && (
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
                title="Bạn có chắc chắn muốn xóa quyền này?"
                open={showConfirmDelete}
                onOpenChange={setShowConfirmDelete}
                onConfirm={async () => {
                        try {
                        await deleteRoleById(id);
                        const data = await getAllRolesWithPermissions();
                        dispatch(setRoles(data));
                        setShowConfirmDelete(false);
                        onOpenChange(false);
                        toast({ title: 'Xóa quyền thành công!' });
                        router.refresh();
                        } catch (err: unknown) {
                        toast({
                            title: 'Lỗi khi xóa quyền',
                            description: err instanceof Error 
                                ? err.message 
                                : (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không thể xóa quyền',
                            variant: 'error',
                        });
                    }
                }}
            />
        </CustomModal>
    );
}