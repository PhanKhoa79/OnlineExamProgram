"use client";

import React, { useState, useEffect } from "react";

import { toast } from "@/components/hooks/use-toast";
import AuthInput from "@/components/ui/AuthInput";
import {Person} from "@mui/icons-material";
import { useDispatch } from 'react-redux';
import { CustomModal } from "@/components/ui/CustomModal";import PermissionTreeView from '../../../../components/ui/PermissionTreeView';
import { getPermissionsByRoleId, updateRolePermissions } from "../../services/roleServices";
import { updateRole } from "@/store/roleSlice";

type EditRoleModalProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  id: number;
};

export function EditRoleModal({ open, onOpenChange, id }: EditRoleModalProps) {
  const dispatch = useDispatch();

  const [roleName, setRoleName] = useState<string>("");

  const [loading, setLoading] = useState(false);

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [defaultSelectedPermissions, setDefaultSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
      (async () => {
          const res = await getPermissionsByRoleId(id);
          if (res) {
              setRoleName(res.name);
              setSelectedPermissions(res.permissions);
              setDefaultSelectedPermissions(res.permissions); 
          } else {
              toast({
                  title: "Error",
                  description: "Lỗi khi lấy thông tin quyền",
                  variant: "error",
              });
          }
      })();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

     if (selectedPermissions.length === 0) {
        toast({
          title: "Vui lòng chọn ít nhất một quyền",
          variant: "warning",
        });
        return;
      }

       try {
        const respone = await updateRolePermissions(id, selectedPermissions);
        console.log(respone);
        dispatch(updateRole(respone));
        toast({title: "Cập nhật quyền thành công"});
        setRoleName("");
        setSelectedPermissions([]);
        onOpenChange(false);
      } catch (error: any) {
        toast({
          title: "Lỗi khi cập nhật quyền",
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
      title="Sửa quyền"
      onSubmit={handleSubmit}
      loading={loading}
      submitLabel="Cập nhật"
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
        <PermissionTreeView defaultSelectedKeys={defaultSelectedPermissions} onChangeSelectedKeys={setSelectedPermissions}/>
      </div>

    </CustomModal>
  );
}