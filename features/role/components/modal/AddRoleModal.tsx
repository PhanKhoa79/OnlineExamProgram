"use client";

import React, { useState, useEffect } from "react";

import { toast } from "@/components/hooks/use-toast";
import { schema, getErrorMessage } from "@/lib/validationAuth";
import AuthInput from "@/components/ui/AuthInput";
import {Person} from "@mui/icons-material";
import { useDispatch } from 'react-redux';
import { CustomModal } from "@/components/ui/CustomModal";import PermissionTreeView from '../../../../components/ui/PermissionTreeView';
import { createRoleWithPermissions } from "../../services/roleServices";
import { addRole } from "@/store/roleSlice";

type AddRoleModalProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
};

export function AddRoleModal({ open, onOpenChange }: AddRoleModalProps) {
  const dispatch = useDispatch();

  const [roleName, setRoleName] = useState<string>("");
  const [roleNameError, setRoleNameError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    const { roleNameError } = getErrorMessage(schema, { roleName });
    setRoleNameError(roleNameError);
  }, [roleName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { roleNameError } = getErrorMessage(schema, { roleName });
    setRoleNameError(roleNameError);
    if (roleNameError) {
      setLoading(false);
      return;
    }

     if (selectedPermissions.length === 0) {
        toast({
          title: "Vui lòng chọn ít nhất một quyền",
          variant: "warning",
        });
        return;
      }

       try {
        const respone = await createRoleWithPermissions({
          name: roleName.trim(),
          permissions: selectedPermissions,
        });
        dispatch(addRole(respone.data));
        toast({title: "Tạo quyền thành công"});
        setRoleName("");
        setSelectedPermissions([]);
        onOpenChange(false);
      } catch (error: any) {
        toast({
          title: "Lỗi khi tạo quyền",
          description: error.message || "Đã có lỗi xảy ra",
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    }

  useEffect(() => {
    if (!open) {
      setRoleName("");
    }
  }, [open]);

  return (
    <CustomModal
      open={open}
      setOpen={onOpenChange}
      title="Thêm quyền"
      onSubmit={handleSubmit}
      loading={loading}
      submitLabel="+ Thêm quyền"
    >

      <div className="flex flex-col gap-2 dark:text-black">
        <AuthInput
          id="role"
          title="Tên quyền"
          type="text"
          label="Role"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          error={roleNameError}
          Icon={Person}
        />
      </div>

      <div className="flex flex-col gap-1">
        <span className="block text-sm font-bold text-black-700">Danh sách quyền</span>
        <PermissionTreeView onChangeSelectedKeys={setSelectedPermissions}/>
      </div>

    </CustomModal>
  );
}