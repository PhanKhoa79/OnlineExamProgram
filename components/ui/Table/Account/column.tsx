"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import  { ContentCopy, Edit, Delete, MoreHoriz} from "@mui/icons-material";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export type Account = {
  id: string;
  name: string;
  avatar: string;
  role: "Administrator" | "Moderator" | "Viewer";
  email: string;
  status: "Active" | "Inactive";
};

export const defaultData: Account[] = [
  { id: "u1", name: "Jese Leos", avatar: "/avatar.png", role: "Administrator", email: "jese@example.com", status: "Active" },
  { id: "u2", name: "Bonnie Green", avatar: "/avatar.png", role: "Viewer", email: "bonnie@example.com", status: "Active" },
  { id: "u3", name: "Leslie Livingston", avatar: "/avatar.png", role: "Moderator", email: "leslie@example.com", status: "Inactive" },
  { id: "u4", name: "Micheal Gough", avatar: "/avatar.png", role: "Moderator", email: "micheal@example.com", status: "Active" },
  { id: "u5", name: "Joseph McFall", avatar: "/avatar.png", role: "Viewer", email: "joseph@example.com", status: "Active" },
  { id: "u6", name: "Robert Brown", avatar: "/avatar.png", role: "Viewer", email: "robert@example.com", status: "Inactive" },
  { id: "u7", name: "Karen Nelson", avatar: "/avatar.png", role: "Viewer", email: "karen@example.com", status: "Inactive" },
  { id: "u8", name: "Jese Leos", avatar: "/avatar.png", role: "Administrator", email: "jese@example.com", status: "Active" },
  { id: "u10", name: "Bonnie Green", avatar: "/avatar.png", role: "Viewer", email: "bonnie@example.com", status: "Active" },
  { id: "u11", name: "Leslie Livingston", avatar: "/avatar.png", role: "Moderator", email: "leslie@example.com", status: "Inactive" },
  { id: "u12", name: "Micheal Gough", avatar: "/avatar.png", role: "Moderator", email: "micheal@example.com", status: "Active" },
  { id: "u13", name: "Joseph McFall", avatar: "/avatar.png", role: "Viewer", email: "joseph@example.com", status: "Active" },
  { id: "u14", name: "Robert Brown", avatar: "/avatar.png", role: "Viewer", email: "robert@example.com", status: "Inactive" },
  { id: "u15", name: "Karen Nelson", avatar: "/avatar.png", role: "Viewer", email: "karen@example.com", status: "Inactive" },
  { id: "u1", name: "Jese Leos", avatar: "/avatar.png", role: "Administrator", email: "jese@example.com", status: "Active" },
  { id: "u2", name: "Bonnie Green", avatar: "/avatar.png", role: "Viewer", email: "bonnie@example.com", status: "Active" },
  { id: "u3", name: "Leslie Livingston", avatar: "/avatar.png", role: "Moderator", email: "leslie@example.com", status: "Inactive" },
  { id: "u4", name: "Micheal Gough", avatar: "/avatar.png", role: "Moderator", email: "micheal@example.com", status: "Active" },
  { id: "u5", name: "Joseph McFall", avatar: "/avatar.png", role: "Viewer", email: "joseph@example.com", status: "Active" },
  { id: "u6", name: "Robert Brown", avatar: "/avatar.png", role: "Viewer", email: "robert@example.com", status: "Inactive" },
  { id: "u7", name: "Karen Nelson", avatar: "/avatar.png", role: "Viewer", email: "karen@example.com", status: "Inactive" },
  { id: "u8", name: "Jese Leos", avatar: "/avatar.png", role: "Administrator", email: "jese@example.com", status: "Active" },
  { id: "u10", name: "Bonnie Green", avatar: "/avatar.png", role: "Viewer", email: "bonnie@example.com", status: "Active" },
  { id: "u11", name: "Leslie Livingston", avatar: "/avatar.png", role: "Moderator", email: "leslie@example.com", status: "Inactive" },
  { id: "u12", name: "Micheal Gough", avatar: "/avatar.png", role: "Moderator", email: "micheal@example.com", status: "Active" },
  { id: "u13", name: "Joseph McFall", avatar: "/avatar.png", role: "Viewer", email: "joseph@example.com", status: "Active" },
  { id: "u14", name: "Robert Brown", avatar: "/avatar.png", role: "Viewer", email: "robert@example.com", status: "Inactive" },
  { id: "u15", name: "Karen Nelson", avatar: "/avatar.png", role: "Viewer", email: "karen@example.com", status: "Inactive" },
  { id: "u1", name: "Jese Leos", avatar: "/avatar.png", role: "Administrator", email: "jese@example.com", status: "Active" },
  { id: "u2", name: "Bonnie Green", avatar: "/avatar.png", role: "Viewer", email: "bonnie@example.com", status: "Active" },
  { id: "u3", name: "Leslie Livingston", avatar: "/avatar.png", role: "Moderator", email: "leslie@example.com", status: "Inactive" },
  { id: "u4", name: "Micheal Gough", avatar: "/avatar.png", role: "Moderator", email: "micheal@example.com", status: "Active" },
  { id: "u5", name: "Joseph McFall", avatar: "/avatar.png", role: "Viewer", email: "joseph@example.com", status: "Active" },
  { id: "u6", name: "Robert Brown", avatar: "/avatar.png", role: "Viewer", email: "robert@example.com", status: "Inactive" },
  { id: "u7", name: "Karen Nelson", avatar: "/avatar.png", role: "Viewer", email: "karen@example.com", status: "Inactive" },
  { id: "u8", name: "Jese Leos", avatar: "/avatar.png", role: "Administrator", email: "jese@example.com", status: "Active" },
  { id: "u10", name: "Bonnie Green", avatar: "/avatar.png", role: "Viewer", email: "bonnie@example.com", status: "Active" },
  { id: "u11", name: "Leslie Livingston", avatar: "/avatar.png", role: "Moderator", email: "leslie@example.com", status: "Inactive" },
  { id: "u12", name: "Micheal Gough", avatar: "/avatar.png", role: "Moderator", email: "micheal@example.com", status: "Active" },
  { id: "u13", name: "Joseph McFall", avatar: "/avatar.png", role: "Viewer", email: "joseph@example.com", status: "Active" },
  { id: "u14", name: "Robert Brown", avatar: "/avatar.png", role: "Viewer", email: "robert@example.com", status: "Inactive" },
  { id: "u15", name: "Karen Nelson", avatar: "/avatar.png", role: "Viewer", email: "karen@example.com", status: "Inactive" },
  { id: "u1", name: "Jese Leos", avatar: "/avatar.png", role: "Administrator", email: "jese@example.com", status: "Active" },
  { id: "u2", name: "Bonnie Green", avatar: "/avatar.png", role: "Viewer", email: "bonnie@example.com", status: "Active" },
  { id: "u3", name: "Leslie Livingston", avatar: "/avatar.png", role: "Moderator", email: "leslie@example.com", status: "Inactive" },
  { id: "u4", name: "Micheal Gough", avatar: "/avatar.png", role: "Moderator", email: "micheal@example.com", status: "Active" },
  { id: "u5", name: "Joseph McFall", avatar: "/avatar.png", role: "Viewer", email: "joseph@example.com", status: "Active" },
  { id: "u6", name: "Robert Brown", avatar: "/avatar.png", role: "Viewer", email: "robert@example.com", status: "Inactive" },
  { id: "u7", name: "Karen Nelson", avatar: "/avatar.png", role: "Viewer", email: "karen@example.com", status: "Inactive" },
  { id: "u8", name: "Jese Leos", avatar: "/avatar.png", role: "Administrator", email: "jese@example.com", status: "Active" },
  { id: "u10", name: "Bonnie Green", avatar: "/avatar.png", role: "Viewer", email: "bonnie@example.com", status: "Active" },
  { id: "u11", name: "Leslie Livingston", avatar: "/avatar.png", role: "Moderator", email: "leslie@example.com", status: "Inactive" },
  { id: "u12", name: "Micheal Gough", avatar: "/avatar.png", role: "Moderator", email: "micheal@example.com", status: "Active" },
  { id: "u13", name: "Joseph McFall", avatar: "/avatar.png", role: "Viewer", email: "joseph@example.com", status: "Active" },
  { id: "u14", name: "Robert Brown", avatar: "/avatar.png", role: "Viewer", email: "robert@example.com", status: "Inactive" },
  { id: "u15", name: "Karen Nelson", avatar: "/avatar.png", role: "Viewer", email: "karen@example.com", status: "Inactive" },
];

export const accountColumns: ColumnDef<Account>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="Select all"
        className="ml-2"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        aria-label="Select row"
        className="ml-2"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
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
          <img src={u.avatar} className="h-14 w-18 rounded-full object-contain" />
          <span>{u.name}</span>
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
        role === "Administrator"
          ? "bg-blue-100 text-blue-800"
          : role === "Moderator"
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
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const s = row.getValue<string>("status");
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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(usr.id)}>
              <ContentCopy sx={{ fontSize: 18}}/>
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => console.log("Edit", usr)}>
              <Edit sx={{ fontSize: 18}}/>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Delete", usr)}>
              <Delete sx={{ fontSize: 18}}/>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
