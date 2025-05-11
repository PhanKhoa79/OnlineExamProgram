"use client";

import {useState, useMemo} from "react";
import { DataTable } from "./data-table";
import { Account, defaultData, accountColumns } from "./column";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu"; 
import { Button } from "@/components/ui/button";
import { ShowFilter } from "@/components/ui/ShowFilter";
import { useShowFilter } from "@/hooks/useShowFilter";
import { Output, Add, KeyboardArrowDown } from "@mui/icons-material";

export function AccountTable() {

   // original data
  const [data] = useState<Account[]>(defaultData);

  // column-show filter (All/Role/Email/Status)
  const { show, setShow } = useShowFilter();

  // row filters
  const [selectedRole, setSelectedRole] = useState<"" | Account["role"]>("");
  const [selectedStatus, setSelectedStatus] = useState<"" | Account["status"]>("");

  // 1. Compute visible columns (unchanged)
  const visibleColumns = useMemo(() => {
    return accountColumns.filter((col) => {
      if (col.id === "select" || col.id === "actions") return true;
      if (show === "all") return true;
      if (show === "role") return col.accessorKey === "name" || col.accessorKey === "role";
      if (show === "email") return col.accessorKey === "name" || col.accessorKey === "email";
      if (show === "status") return col.accessorKey === "name" || col.accessorKey === "status";
      return false;
    });
  }, [show]);

  // 2. Filter rows by role & status
  const filteredData = useMemo(() => {
    return data.filter((acc) => {
      const matchRole   = selectedRole   === "" || acc.role   === selectedRole;
      const matchStatus = selectedStatus === "" || acc.status === selectedStatus;
      return matchRole && matchStatus;
    });
  }, [data, selectedRole, selectedStatus]);

  return (
    <div className="flex flex-col gap-4 container mx-auto py-6">
      <div className="flex flex-col gap-4 justify-between lg:flex-row">
        <Input
          type="text"
          placeholder="Tìm kiếm tài khoản..."
          className="max-w-screen lg:max-w-sm"
        />
        <div className="flex justify-between gap-4 lg:justify-end">
          <Button className="grow bg-blue-500 text-white hover:bg-blue-800 cursor-pointer">+ Add product</Button> 

          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex gap-1 grow bg-green-400 text-white hover:bg-green-500 cursor-pointer">
                  <Add />
                  Imports
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Imports</DropdownMenuLabel>
                <DropdownMenuItem>Excel</DropdownMenuItem>
                <DropdownMenuItem>CSV</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>    

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex gap-2 grow bg-red-500 text-white hover:bg-red-600 cursor-pointer">
                  <Output />
                  Exports
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Exports</DropdownMenuLabel>
                <DropdownMenuItem>Excel</DropdownMenuItem>
                <DropdownMenuItem>CSV</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>  
          </div>
      </div>

      <div className="flex gap-4">
        {/* Row filter: User Role */}
        <div>
          <label htmlFor="roleFilter" className="sr-only">Filter by role</label>
          <div className="relative">
            <select
              id="roleFilter"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as Account["role"] | "")}
              className="appearance-none px-4 pr-24 py-1 border border-gray-300 rounded-md bg-white font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">Role</option>
              <option value="Administrator">Administrator</option>
              <option value="Moderator">Moderator</option>
              <option value="Viewer">Viewer</option>
            </select>

            <KeyboardArrowDown className="absolute right-1 top-1/6 text-gray-500" />
          </div>
        </div>

        {/* Row filter: Status */}
        <div>
          <label htmlFor="statusFilter" className="sr-only">Filter by status</label>
          <div className="relative">
            <select
              id="statusFilter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as Account["status"] | "")}
              className="appearance-none px-4 pr-36 py-1 border border-gray-300 rounded-md font-medium bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <KeyboardArrowDown className="absolute right-1 top-1/6 text-gray-500" />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start lg:flex-row lg:justify-between lg:items-center gap-4">
        <ShowFilter show={show} onChange={setShow} />
        
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex gap-1 bg-white dark:bg-slate-700 text-black border border-gray-300 hover:bg-gray-200 hover:text-blue-600 cursor-pointer">
                <KeyboardArrowDown />
                Actions
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="ml-4">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>Mass Edit</DropdownMenuItem>
              <DropdownMenuItem>Delete all</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>    
      </div>

      <DataTable<Account, any> columns={visibleColumns} data={filteredData} />
    </div>
  );
}