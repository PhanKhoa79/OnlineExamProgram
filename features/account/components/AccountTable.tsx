"use client";

import { useState, useMemo, useEffect} from "react";
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store"; 
import { DataTable } from "../../../components/ui/data-table";
import { accountColumns } from "@/features/account/components/column";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ShowFilter } from "@/components/ui/ShowFilter";
import { useShowFilter } from "@/hooks/useShowFilter";
import { Output, Add, KeyboardArrowDown, FileUpload, Delete } from "@mui/icons-material";
import { getAllAccounts, exportAccounts, importAccountsFromFile } from "@/features/account/services/accountService";
import { setAccounts, addAccount as addAccountAction } from "@/store/accountSlice";
import { useSearchFilter } from "@/hooks/useSearchFilter";
import { toast } from "@/components/hooks/use-toast";
import { AccountResponse } from "@/features/account/types/account";
import  { ImportFileModal, FileType } from "@/features/account/components/modal/ImportFileModal";
import { RoleWithPermissionsDto } from "@/features/role/types/role";
import { getAllRolesWithPermissions } from "@/features/role/services/roleServices";
import { useAuthStore } from "@/features/auth/store"; 
import { hasPermission } from "@/lib/permissions"; 
import SearchBar from "@/components/ui/SearchBar";

export function AccountTable() {

  const router = useRouter();

  const selectedIds = useSelector((state: RootState) => state.account.selectedIds);
  
  const [isLoading, setIsLoading] = useState(true);

  const [roles, setRoles] = useState<RoleWithPermissionsDto[]>([]);

  const accounts = useSelector((state: RootState) => state.account.accounts);

  const permissions = useAuthStore((state) => state.permissions);

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
  
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getAllRolesWithPermissions();
        setRoles(data);
      } catch (error) {
        console.error('Failed to fetch roles:', error);
      }
    };

    fetchRoles();
  }, []);

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
      toast({ title: 'Exporting successfully !'});
    } catch (err) {
      toast({
        title: err.response?.data?.message || 'Error exporting accounts',
        variant: 'error',
      });
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
      console.log("Imported accounts:", successAccounts);
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

  const handleDeleteAllClick = () => {
    if (selectedIds.length === 0) {
      toast({
        title: 'Chưa chọn tài khoản nào',
        description: 'Vui lòng chọn ít nhất một tài khoản để xóa.',
        variant: 'warning',
      });
    } else {
      router.push('/dashboard/account/delete-all');
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
        <SearchBar
          placeholder="Tìm kiếm tài khoản..."
          value={inputValue}
          onChange={setInputValue}
        />
        <div className="flex flex-wrap justify-center gap-4 lg:justify-end">
          {hasPermission(permissions, 'account:create') && (
            <>
              <Button className="grow bg-blue-500 text-white hover:bg-blue-800 cursor-pointer" onClick={() => router.push('/dashboard/account/add-account')}>
                + Thêm tài khoản
              </Button>
              <Button className="grow bg-yellow-500 text-white hover:bg-yellow-800 cursor-pointer" onClick={() => router.push('/dashboard/account/upload-students')}>
                <FileUpload />
                Tải lên danh sách sinh viên
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex gap-1 grow bg-green-400 text-white hover:bg-green-500 cursor-pointer">
                    <Add />
                    Nhập file
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" asChild>
                  <div>
                    <DropdownMenuLabel>Định dạng</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => openModal('xlsx')}>Excel</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openModal('csv')}>CSV</DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
                <ImportFileModal open={open} setOpen={setOpen} fileType={fileType} handleImport={handleImport}/>
              </DropdownMenu>
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex gap-2 grow bg-red-500 text-white hover:bg-red-600 cursor-pointer">
                <Output />
                Xuất file
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Định dạng</DropdownMenuLabel>
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
              <option value="">-- Chọn quyền --</option>
              {roles.map((role) => (
                <option key={role.name} value={role.name}>
                  {role.name}
                </option>
              ))}
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
              <option value="">-- Chọn trạng thái --</option>
              <option value="Active">Đã kích hoạt</option>
              <option value="Inactive">Chưa kích hoạt</option>
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
              Hành động
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="ml-4">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            {hasPermission(permissions, 'account:delete') && (
              <DropdownMenuItem>
                  <div className="flex items-center justify-start text-sm gap-1 py-2 cursor-pointer" onClick={handleDeleteAllClick}>
                    <Delete sx={{ fontSize: 18 }} />
                    Xóa tất cả
                  </div>
              </DropdownMenuItem>
            )}
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
