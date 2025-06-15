"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "@/components/hooks/use-toast";
import AuthInput from "@/components/ui/AuthInput";
import { Person, SaveOutlined, Security, CheckCircle, Info, Group } from "@mui/icons-material";
import PermissionTreeView from "@/components/ui/PermissionTreeView";
import {
  getPermissionsByRoleId,
  updateRolePermissions,
} from "@/features/role/services/roleServices";
import { updateRole } from "@/store/roleSlice";
import { NavigableBreadcrumb } from "@/components/ui/NavigableBreadcrumb";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { RoleWithPermissionsDto } from "@/features/role/types/role";
import { formatDateTime } from "@/lib/dateUtils";

export default function EditRolePage({ id }: { id: number }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [roleData, setRoleData] = useState<RoleWithPermissionsDto | null>(null);
  const [roleName, setRoleName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [defaultSelectedPermissions, setDefaultSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        setIsLoading(true);
        const res = await getPermissionsByRoleId(id);
        if (res) {
          setRoleData(res);
          setRoleName(res.name);
          setSelectedPermissions(res.permissions);
          setDefaultSelectedPermissions(res.permissions);
        } else {
          toast({
            title: "Lỗi khi lấy thông tin quyền",
            variant: "error",
          });
        }
      } catch (error) {
        console.error("Error fetching role data:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin quyền",
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchRoleData();
    }
  }, [id]);

  const handleSubmit = async (exitAfterSave = false) => {
    if (selectedPermissions.length === 0) {
      toast({
        title: "Vui lòng chọn ít nhất một quyền",
        variant: "warning",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await updateRolePermissions(id, selectedPermissions);
      dispatch(updateRole(response));
      
      const updatedRoleData = await getPermissionsByRoleId(id);
      setRoleData(updatedRoleData);
      
      toast({ 
        title: "Thành công",
        description: "Cập nhật quyền thành công!"
      });
      
      if (exitAfterSave) {
        router.push("/dashboard/role");
      }
    } catch (error: unknown) {
      console.error("Error updating role:", error);
      
      let errorMessage = "Có lỗi xảy ra khi cập nhật quyền";
      
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as { message: string }).message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "Lỗi khi cập nhật quyền",
        description: errorMessage,
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 px-6 py-4">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-6 py-4">
      <NavigableBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard", isHome: true },
          { label: "Vai trò", href: "/dashboard/role" },
          { label: "Sửa vai trò", isActive: true },
        ]}
      />

      <div className="text-center space-y-3 py-6">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg">
          <Security className="h-6 w-6" />
          <h1 className="text-2xl font-bold tracking-tight">Chỉnh sửa quyền</h1>
        </div>
        <p className="text-lg text-gray-600 font-medium">
          Chỉnh sửa quyền: <span className="text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">&quot;{roleName}&quot;</span>
        </p>
      </div>

      {/* Role Info Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Security className="w-6 h-6 text-blue-600" />
            Thông tin quyền
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Role Name */}
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

          {/* Permissions Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Security className="w-5 h-5 text-blue-600" />
              <span className="block text-sm font-bold text-gray-900 dark:text-white">
                Danh sách quyền <span className="text-red-500">*</span>
              </span>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Chọn các quyền mà role này được phép thực hiện
                </span>
              </div>
              <PermissionTreeView
                defaultSelectedKeys={defaultSelectedPermissions}
                onChangeSelectedKeys={setSelectedPermissions}
              />
            </div>
          </div>

          {/* Current Role Information */}
          {roleData && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Group className="w-5 h-5 text-blue-600" />
                Thông tin quyền hiện tại
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <span className="font-medium text-gray-600 dark:text-gray-400">ID:</span>
                    <span className="text-gray-900 dark:text-white font-mono">{roleData.id}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Tên quyền:</span>
                    <span className="text-gray-900 dark:text-white font-semibold">{roleData.name}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Số quyền:</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {roleData.permissions.length} quyền
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <span className="font-medium text-gray-600 dark:text-gray-400 block mb-2">Quyền được cấp:</span>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {roleData.permissions.length > 0 ? (
                        roleData.permissions.map((permission, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span className="text-gray-700 dark:text-gray-300">{permission}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 text-xs">Chưa có quyền nào</span>
                      )}
                    </div>
                  </div>
                  
                  {roleData.createdAt && (
                    <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Ngày tạo:</span>
                      <span className="text-gray-900 dark:text-white text-xs">
                        {formatDateTime(roleData.createdAt)}
                      </span>
                    </div>
                  )}
                  
                  {roleData.updatedAt && (
                    <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Cập nhật lần cuối:</span>
                      <span className="text-gray-900 dark:text-white text-xs">
                        {formatDateTime(roleData.updatedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Summary Badge */}
              <div className="mt-4 pt-3 border-t border-blue-200 dark:border-blue-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Trạng thái: {roleData.permissions.length > 0 ? 'Đã cấu hình quyền' : 'Chưa có quyền'}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    roleData.permissions.length > 0 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                      : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                  }`}>
                    {roleData.permissions.length > 0 ? '✓ Hoạt động' : '⚠ Cần cấu hình'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-end">
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => handleSubmit(false)} 
            disabled={isSubmitting} 
            className="cursor-pointer bg-blue-600 hover:bg-blue-400"
          >
            <SaveOutlined />
            Lưu
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => handleSubmit(true)} 
            disabled={isSubmitting} 
            className="cursor-pointer"
          >
            Lưu & Thoát
          </Button>
        </div>
      </div>
    </div>
  );
}
