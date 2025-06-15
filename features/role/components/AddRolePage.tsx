"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "@/components/hooks/use-toast";
import { schema, getErrorMessage } from "@/lib/validationAuth";
import AuthInput from "@/components/ui/AuthInput";
import { Person, SaveOutlined } from "@mui/icons-material";
import PermissionTreeView from "@/components/ui/PermissionTreeView";
import { createRoleWithPermissions } from "../services/roleServices";
import { addRole } from "@/store/roleSlice";
import { NavigableBreadcrumb } from "@/components/ui/NavigableBreadcrumb";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Type for API error response
interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
}

export default function AddRolePage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [roleName, setRoleName] = useState<string>("");
  const [roleNameError, setRoleNameError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    const { roleNameError } = getErrorMessage(schema, { roleName });
    setRoleNameError(roleNameError);
  }, [roleName]);

  const handleSubmit = async (exitAfterSave = false) => {
    setLoading(true);

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
      setLoading(false);
      return;
    }

    try {
        const response = await createRoleWithPermissions({
          name: roleName.trim(),
          permissions: selectedPermissions,
        });

        dispatch(addRole(response.data));
        toast({ title: "Tạo quyền thành công" });
        if (exitAfterSave) {
            router.push("/dashboard/role");
        } else {
            router.push(`/dashboard/role/edit/${response.data.id}`);
        } 
        setRoleName("");
        setSelectedPermissions([]);
    } catch (error: unknown) {
        console.error("Error creating role:", error);
        
        let errorMessage = "Đã có lỗi xảy ra";
        
        const apiError = error as ApiError;
        
        if (apiError?.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        } else if (apiError?.response?.data?.error) {
          errorMessage = apiError.response.data.error;
        } else if (apiError?.message) {
          errorMessage = apiError.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
        
        toast({
          title: "Lỗi khi tạo quyền",
          description: errorMessage,
          variant: "error",
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 px-6 py-4">
      <NavigableBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard", isHome: true },
          { label: "Vai trò", href: "/dashboard/role" },
          { label: "Thêm vai trò", isActive: true },
        ]}
      />

      <div className="text-center space-y-3 py-6">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full shadow-lg">
          <Person className="h-6 w-6" />
          <h1 className="text-2xl font-bold tracking-tight">Thêm quyền mới</h1>
        </div>
        <p className="text-lg text-gray-600 font-medium">
          Tạo quyền mới với <span className="text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">các quyền cần thiết</span>
        </p>
      </div>
      
      {/* Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Tạo quyền</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
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

          <div className="flex flex-col gap-1">
            <span className="block text-sm font-bold text-black-700">
              Danh sách quyền
            </span>
            <PermissionTreeView
              onChangeSelectedKeys={setSelectedPermissions}
            />
          </div>
        </CardContent>
      </Card>

        <div className="flex items-center justify-end">
            <div className="flex items-center space-x-2">
                <Button onClick={() => handleSubmit(false)} disabled={loading} className="cursor-pointer bg-blue-600 hover:bg-blue-400">
                    <SaveOutlined />
                    Lưu
                </Button>
                <Button variant="secondary" onClick={() => handleSubmit(true)} disabled={loading} className="cursor-pointer">
                    Lưu & Thoát
                </Button>
            </div>
        </div>
    </div>
  );
}
