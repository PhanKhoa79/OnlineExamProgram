"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import  { Edit, Delete, MoreHoriz, Visibility} from "@mui/icons-material";
import { RoleWithPermissionsDto } from '@/features/role/types/role'; 
import { useRouter } from "next/navigation";
import { getRoleByName } from "../services/roleServices";
import { useAuthStore } from "@/features/auth/store"; 
import { hasPermission } from "@/lib/permissions"; 
import { getPermissionClass, getPermissionIcon } from '@/utils/permissios.util'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";


const RoleActionsCell = ({ role }: { role: RoleWithPermissionsDto }) => {

  const router = useRouter();

  const permissions = useAuthStore((state) => state.permissions);

  const handleRoleAction = async (action: 'edit' | 'delete-role' | 'detail') => {
  try {
    const roleData = await getRoleByName(role.name);
    router.push(`/dashboard/role/${action}/${roleData.id}`);
  } catch (error) {
    console.error('Lỗi lấy role:', error);
  }
};

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Hành động</span>
          <MoreHoriz />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Hành dộng</DropdownMenuLabel>
        {hasPermission(permissions, 'role:view') && (
          <DropdownMenuItem>
            <div 
            className="flex items-center justify-start py-1 gap-1 cursor-pointer"
            onClick={() => handleRoleAction('detail')}
            >
              <Visibility sx={{ fontSize: 18}} className="cursor-pointer"/>
              Xem trước
            </div>
          </DropdownMenuItem>
        )}

        {hasPermission(permissions, 'role:update') && (
          <DropdownMenuItem>
              <>
                <div 
                  className="flex items-center justify-start py-1 gap-1 cursor-pointer"
                  onClick={() => handleRoleAction('edit')}
                >
                  <Edit sx={{ fontSize: 18 }} />
                  Chỉnh sửa
                </div>
              </>
          </DropdownMenuItem>
        )}

        {hasPermission(permissions, 'role:delete') && role.name !== 'moderator' && (
          <DropdownMenuItem>
            <>
              <div className="flex items-center justify-start gap-1 cursor-pointer pb-1" onClick={() => handleRoleAction('delete-role')}>
                <Delete sx={{ fontSize: 18 }} />
                Xóa
              </div>
            </>
          </DropdownMenuItem>
        )}
        

      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const roleColumns = (): ColumnDef<RoleWithPermissionsDto>[] => {

  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Tên quyền 
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const u = row.original;
        return (
          <div className="relative flex flex-col gap-1 ml-3">
            <span>{u.name}</span>
            {u.name === 'moderator' && (
              <div className="text-xs text-red-600 font-medium">
                Lưu ý*: Đây là quyền cao nhất <br /> trong hệ thống không được phép xóa
              </div>
            )}
          </div>
        );
      },
    },
    {
        header: ({ column }) => (
          <Button
            type="button"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Quyền
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        ),
        accessorKey: "permissions",
        cell: ({ row }) => {
          const permissions: string[] = row.original.permissions;
          return (
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
          );
        }
      },
    {
      id: "actions",
      header: "Hành động",
      enableHiding: false,
      cell: ({ row }) => {
        const u = row.original;
        return <RoleActionsCell role={u} />;
      },
    },
  ];
};
