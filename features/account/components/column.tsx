"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import  { ContentCopy, Edit, Delete, MoreHoriz} from "@mui/icons-material";
import { AccountResponse } from "../types/account";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { toast } from "@/components/hooks/use-toast";
import { deleteAccount } from "../services/accountService";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { deleteAccount as deleteAccountAction } from "@/store/accountSlice";
import { setSelectedIds } from "@/store/accountSlice";
import { EditAccountModal } from "./modal/EditAccountModal";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const AccountActionsCell = ({ usr }: { usr: AccountResponse }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Actions</span>
          <MoreHoriz />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(usr.id))}>
          <ContentCopy sx={{ fontSize: 18}} className="cursor-pointer"/>
          Copy ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
            <>
              <div 
                className="flex items-center justify-start ml-2 py-1 gap-1 cursor-pointer"
                onClick={() => setOpen(true)}
              >
                <Edit sx={{ fontSize: 18 }} />
                Edit
              </div>
              <EditAccountModal open={open} setOpen={setOpen} id={usr.id} />
            </>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <ConfirmDeleteModal
            title="Are you sure you want to delete this account?"
            onConfirm={async () => {
              try {
                await deleteAccount(usr.id);
                dispatch(deleteAccountAction(usr.id));
                toast({ title: "Deleted successfully!" });
              } catch (err: any) {
                toast({
                  title: "Error deleting account",
                  description: err?.response?.data?.message || "Something went wrong",
                  variant: "error",
                });
              }
            }}
          >
            <div className="flex items-center justify-start ml-2 gap-1 cursor-pointer pb-1">
              <Delete sx={{ fontSize: 18 }} />
              Delete
            </div>
          </ConfirmDeleteModal>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export const accountColumns = (dispatch: ReturnType<typeof useDispatch>): ColumnDef<AccountResponse>[] => {

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
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          ACCOUNT 
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const u = row.original;
        return (
          <div className="relative flex items-center gap-2">
            <Image src={u.urlAvatar || "/avatar.png"} alt="avatar" width={72} height={72} className="rounded-full object-cover" />
            <span>{u.accountname}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "ACCOUNT ROLE",
      cell: ({ row }) => {
        const role = row.getValue<string>("role");
        const cls =
          role === "admin"
            ? "bg-blue-100 text-blue-800"
            : role === "teacher"
            ? "bg-purple-100 text-purple-800"
            : "bg-gray-100 text-gray-800";
        return <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{role}</span>;
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          EMAIL 
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "isActive",
      header: "STATUS",
      cell: ({ row }) => {
        const isActive = row.getValue<boolean>("isActive");
        const s = (isActive ? "Active" : "Inactive");
        const dot = s === "Active" ? "bg-green-500" : "bg-red-500";
        return (
          <span className="flex items-center gap-1">
            <span className={`h-2 w-2 rounded-full ${dot}`}></span>
            {s}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "ACTIONS",
      enableHiding: false,
      cell: ({ row }) => {
        const usr = row.original;
        return <AccountActionsCell usr={usr} />;
      },
    },
  ];
};
