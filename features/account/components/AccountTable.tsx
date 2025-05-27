"use client";

import { useState, useMemo, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store"; 
import { DataTable } from "../../../components/ui/data-table";
import { accountColumns } from "./column";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ShowFilter } from "@/components/ui/ShowFilter";
import { useShowFilter } from "@/hooks/useShowFilter";
import { Output, Add, KeyboardArrowDown } from "@mui/icons-material";
import { AddAccountModal } from "./modal/AddAccountModal";
import { getAllAccounts, deleteManyAccounts, exportAccounts, importAccountsFromFile } from "../services/accountService";
import { setAccounts, deleteAccounts, addAccount as addAccountAction } from "@/store/accountSlice";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { useSearchFilter } from "@/hooks/useSearchFilter";
import { toast } from "@/components/hooks/use-toast";
import ListStudentModal from "./modal/ListStudentModal";
import { AccountResponse } from "../types/account";
import  { ImportFileModal } from "./modal/ImportFileModal";
import { FileType } from "./modal/ImportFileModal";

export function AccountTable() {

  const [isLoading, setIsLoading] = useState(true);

  const selectedIds = useSelector((state: RootState) => state.account.selectedIds);

  const accounts = useSelector((state: RootState) => state.account.accounts);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await getAllAccounts();
        dispatch(setAccounts(data));
      } catch (error) {
        console.error("Failed to fetch accounts", error);
      }  finally {
      setIsLoading(false);
      }
    };

    fetchAccounts();
  }, [dispatch]);
  
  // column-show filter
  const { show, setShow } = useShowFilter();

  // row filters
  const [selectedRole, setSelectedRole] = useState<"" | AccountResponse["role"]>("");
  const [selectedStatus, setSelectedStatus] = useState<AccountResponse["isActive"]>();

  // Tính toán các cột hiển thị
  const visibleColumns = useMemo(() => {
    return accountColumns(dispatch).filter((col) => {
      if (col.id === "select" || col.id === "actions") return true;
      if (show === "all") return true;
      if (show === "role") return col.accessorKey === "accountname" || col.accessorKey === "role";
      if (show === "email") return col.accessorKey === "accountname" || col.accessorKey === "email";
      if (show === "status") return col.accessorKey === "accountname" || col.accessorKey === "isActive";
      return false;
    });
  }, [show]);

  const {
    inputValue,
    setInputValue,
    filteredData,
  } = useSearchFilter(accounts, ["email"]);
  // Lọc theo role & status
  const finalFilteredData = useMemo(() => {
  return filteredData.filter((acc) => {
    const matchRole = selectedRole === "" || acc.role === selectedRole;
    const matchStatus =
      selectedStatus === undefined || acc.isActive === selectedStatus;
    return matchRole && matchStatus;
  });
}, [filteredData, selectedRole, selectedStatus]);

  const handleExport = async (format: 'excel' | 'csv') => {
    try {
      await exportAccounts(finalFilteredData, format);
    } catch (error) {
      console.error("Export failed: ", error);
    }
  };

  const handleImport = async (file: File, fileType: FileType) => {
    setIsLoading(true);
    try {
      let response;

      if (fileType === 'xlsx') {
        response = await importAccountsFromFile(file ,fileType);
      } else if (fileType === 'csv') {
        response = await importAccountsFromFile(file, fileType);
      } else {
        throw new Error('Unsupported file type');
      }

      const successAccounts = response.data.success;

      if (successAccounts.length === 0) {
        toast({ title: 'Không có tài khoản nào được thêm!', variant: 'error' });
        return;
      }

      successAccounts.forEach((account: any) => {
        dispatch(addAccountAction(account));
      });

      toast({ title: 'Accounts created successfully!' });

    } catch (err: any) {
      toast({
        title: err.response?.data?.message || 'Error creating accounts',
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [open, setOpen] = useState(false);
  const [fileType, setFileType] = useState<FileType | null>(null);

  const openModal = (type: FileType) => {
    setFileType(type);
    setOpen(true);
  };

  return (
    <div className="flex flex-col gap-4 container mx-auto py-6">
      <div className="flex flex-col gap-4 justify-between lg:flex-row">
        <Input
          type="text"
          placeholder="Tìm kiếm tài khoản..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="max-w-screen lg:max-w-sm"
        />
        <div className="flex flex-wrap justify-center gap-4 lg:justify-end">
          <AddAccountModal />
          <ListStudentModal />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex gap-1 grow bg-green-400 text-white hover:bg-green-500 cursor-pointer">
                <Add />
                Imports
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" asChild>
              <div>
                <DropdownMenuLabel>Imports</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => openModal('xlsx')}>Excel</DropdownMenuItem>
                <DropdownMenuItem onClick={() => openModal('csv')}>CSV</DropdownMenuItem>
              </div>
            </DropdownMenuContent>
            <ImportFileModal open={open} setOpen={setOpen} fileType={fileType} handleImport={handleImport}/>
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
              <DropdownMenuItem onClick={() => handleExport('excel')}>Excel</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')}>CSV</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Row filter: User Role */}
        <div>
          <label htmlFor="roleFilter" className="sr-only">Filter by role</label>
          <div className="relative">
            <select
              id="roleFilter"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as AccountResponse["role"] | "")}
              className="w-full appearance-none px-4 pr-24 py-1 border border-gray-300 rounded-md bg-white font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">Role</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
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
              value={
                selectedStatus === undefined
                  ? ""
                  : selectedStatus
                  ? "Active"
                  : "Inactive"
              }
              onChange={(e) => setSelectedStatus(e.target.value === "" ? undefined : e.target.value === "Active")}
              className="w-full appearance-none px-4 pr-36 py-1 border border-gray-300 rounded-md font-medium bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
            <Button className="flex gap-1 bg-white text-black border border-gray-300 hover:bg-gray-200 hover:text-blue-600 cursor-pointer">
              <KeyboardArrowDown />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="ml-4">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <ConfirmDeleteModal
                title={`Are you sure you want to delete ${selectedIds.length} account`}
                onConfirm={async () => {
                  try {
                    await deleteManyAccounts(selectedIds);
                    dispatch(deleteAccounts(selectedIds));
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
                <div className="flex items-center justify-start text-sm ml-2 gap-1 py-2 cursor-pointer">
                  Delete All
                </div>
              </ConfirmDeleteModal>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DataTable<AccountResponse, any>
        columns={visibleColumns}
        data={finalFilteredData}
        isLoading={isLoading}
      />
    </div>
  );
}
