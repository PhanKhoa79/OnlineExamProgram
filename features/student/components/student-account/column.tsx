"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { StudentDto } from "../../types/student";
import { setSelectedIds } from "@/store/studentSlice";
import { AppDispatch } from "@/store";


export const studentColumns = (dispatch: AppDispatch): ColumnDef<StudentDto>[] => {

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
      accessorKey: "student_code",
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="cursor-pointer">
          Mã sinh viên 
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const u = row.original;
        return (
          <div className="relative flex items-center gap-2">
            <span>{u.studentCode}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "fullName",
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="cursor-pointer">
          Họ và tên
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="cursor-pointer">
          Email 
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
    },
  ];
};
