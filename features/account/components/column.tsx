"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import  { Edit, Delete, MoreHoriz, Visibility, MailOutline } from "@mui/icons-material";
import { AccountResponse } from "../types/account";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { setSelectedIds } from "@/store/accountSlice";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store"; 
import { hasPermission } from "@/lib/permissions"; 
import { HighlightText } from "@/components/ui/HighlightText";
import { toast } from "@/components/hooks/use-toast";
import { useState } from "react";
import { resendActivationLink } from "@/features/auth/services/authService";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const AccountActionsCell = ({ usr }: { usr: AccountResponse }) => {
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const permissions = useAuthStore((state) => state.permissions);

  const handleResendActivation = async (email: string) => {
    try {
      setIsResending(true);
      await resendActivationLink(email);
      toast({
        title: "Thành công",
        description: "Email kích hoạt đã được gửi lại.",
        variant: "success",
      });
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast({
        title: "Lỗi",
        description: apiError?.response?.data?.message || apiError.message || "Không thể gửi email kích hoạt.",
        variant: "error",
      });
    } finally {
      setIsResending(false);
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
        {hasPermission(permissions, 'account:view') && (
          <DropdownMenuItem>
            <div 
            className="flex items-center justify-start py-1 gap-1 cursor-pointer"
            onClick={() => router.push(`/dashboard/account/detail/${usr.id}`)}
            >
              <Visibility sx={{ fontSize: 18}} className="cursor-pointer"/>
              Xem trước
            </div>
          </DropdownMenuItem>
        )}

        {hasPermission(permissions, 'account:update') && (
          <DropdownMenuItem>
                <div 
                  className="flex items-center justify-start py-1 gap-1 cursor-pointer" onClick={() => router.push(`/dashboard/account/edit/${usr.id}`)}
                >
                  <Edit sx={{ fontSize: 18 }} />
                  Chỉnh sửa
                </div>
          </DropdownMenuItem>
        )}

        {hasPermission(permissions, 'account:delete') && (
          <DropdownMenuItem>
              <div className="flex items-center justify-start gap-1 cursor-pointer pb-1" onClick={() => router.push(`/dashboard/account/delete-account/${usr.id}`)}>
                <Delete sx={{ fontSize: 18 }} />
                Xóa
              </div>
          </DropdownMenuItem>
        )}
        
        {hasPermission(permissions, 'account:create') && !usr.isActive && (
          <DropdownMenuItem>
            <div 
              className="flex items-center justify-start py-1 gap-1 cursor-pointer"
              onClick={() => handleResendActivation(usr.email)}
              disabled={isResending}
            >
              <MailOutline sx={{ fontSize: 18 }} />
              {isResending ? "Đang gửi..." : "Gửi lại email kích hoạt"}
            </div>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export const accountColumns = (dispatch: ReturnType<typeof useDispatch>, searchQuery: string = ""): ColumnDef<AccountResponse>[] => {

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(v) => {
              table.toggleAllPageRowsSelected(!!v);
              setTimeout(() => {
                const selected = table.getSelectedRowModel().rows.map((r) => r.original);
                dispatch(setSelectedIds(selected.map((u) => u.id)));
              }, 0);
            }}
          aria-label="Select all"
          className="ml-2"
        />
      ),
      cell: ({ row, table }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => {
            row.toggleSelected(!!v);
            setTimeout(() => {
            const selected = table.getSelectedRowModel().rows.map((r) => r.original);
            dispatch(setSelectedIds(selected.map((u) => u.id)));
          }, 0);
          }}
          aria-label="Select row"
          className="ml-2"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "accountname",
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Tài khoản 
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const u = row.original;
        return (
          <div className="relative flex items-center gap-2">
            <Image src={u.urlAvatar || "/avatar.png"} alt="avatar" width={72} height={72} className="rounded-full object-cover" />
            <HighlightText 
              text={u.accountname} 
              searchQuery={searchQuery}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Quyền",
      cell: ({ row }) => {
        const role = row.getValue<string>("role");
        return <span className={`px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800`}>{role}</span>;
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Email 
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const u = row.original;
        return (
          <HighlightText 
            text={u.email} 
            searchQuery={searchQuery}
          />
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Trạng thái",
      cell: ({ row }) => {
        const isActive = row.getValue<boolean>("isActive");
        const s = (isActive ? "Active" : "Inactive");
        const dot = s === "Active" ? "bg-green-500" : "bg-red-500";
        return (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className={`h-2 w-2 rounded-full ${dot}`}></span>
              {s}
            </span>
            
            {!isActive && (
              <ResendActivationButton email={row.original.email} />
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Hành động",
      enableHiding: false,
      cell: ({ row }) => {
        const usr = row.original;
        return <AccountActionsCell usr={usr} />;
      },
    },
  ];
};

// Component để gửi lại email kích hoạt
const ResendActivationButton = ({ email }: { email: string }) => {
  const [isResending, setIsResending] = useState(false);
  const permissions = useAuthStore((state) => state.permissions);
  
  if (!hasPermission(permissions, 'account:create')) {
    return null;
  }

  const handleResendActivation = async () => {
    try {
      setIsResending(true);
      await resendActivationLink(email);
      toast({
        title: "Thành công",
        description: "Email kích hoạt đã được gửi lại.",
        variant: "success",
      });
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast({
        title: "Lỗi",
        description: apiError?.response?.data?.message || apiError.message || "Không thể gửi email kích hoạt.",
        variant: "error",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="ml-2 text-xs py-0 h-6 bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
      onClick={handleResendActivation}
      disabled={isResending}
    >
      {isResending ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang gửi
        </span>
      ) : (
        <span className="flex items-center">
          <MailOutline sx={{ fontSize: 14 }} className="mr-1" />
          Kích hoạt
        </span>
      )}
    </Button>
  );
};
