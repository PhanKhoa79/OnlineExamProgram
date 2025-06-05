"use client";

import { useState, useMemo, useEffect, useCallback, memo } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store"; 
import { accountColumns } from "@/features/account/components/column";
import { Button } from "@/components/ui/button";
import { Output, Add, FileUpload, Delete } from "@mui/icons-material";
import { FilterX, Columns, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { getAllAccounts, exportAccounts, importAccountsFromFile } from "@/features/account/services/accountService";
import { setAccounts, addAccount as addAccountAction } from "@/store/accountSlice";
import { useSearchFilter } from "@/hooks/useSearchFilter";
import { toast } from "@/components/hooks/use-toast";
import  { ImportFileModal, FileType } from "@/features/account/components/modal/ImportFileModal";
import { RoleWithPermissionsDto } from "@/features/role/types/role";
import { getAllRolesWithPermissions } from "@/features/role/services/roleServices";
import { useAuthStore } from "@/features/auth/store"; 
import { hasPermission } from "@/lib/permissions"; 
import SearchBar from "@/components/ui/SearchBar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { AccountResponse } from "@/features/account/types/account";

function AccountTableComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedIds = useSelector((state: RootState) => state.account.selectedIds);
  
  const [isLoading, setIsLoading] = useState(true);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  // Filter states
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roles, setRoles] = useState<RoleWithPermissionsDto[]>([]);

  // URL-based pagination - but don't auto-sync to prevent loops
  const initialPage = Math.max(0, (Number(searchParams.get('page')) || 1) - 1);
  const pageSize = 7;
  const [pagination, setPagination] = useState({ pageIndex: initialPage, pageSize });

  // Sync pagination with URL
  useEffect(() => {
    const currentPage = pagination.pageIndex + 1;
    const urlPage = Number(searchParams.get('page')) || 1;
    
    if (currentPage !== urlPage) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      if (currentPage === 1) {
        newSearchParams.delete('page');
      } else {
        newSearchParams.set('page', currentPage.toString());
      }
      
      const newUrl = `${window.location.pathname}${newSearchParams.toString() ? '?' + newSearchParams.toString() : ''}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [pagination.pageIndex, searchParams]);

  const accounts = useSelector((state: RootState) => state.account.accounts);
  const permissions = useAuthStore((state) => state.permissions);
  const dispatch = useDispatch<AppDispatch>();

  // Fetch data only once on mount - no dependencies at all
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [accountsData, rolesData] = await Promise.all([
          getAllAccounts(),
          getAllRolesWithPermissions()
        ]);
        
        dispatch(setAccounts(accountsData));
        setRoles(rolesData);
      } catch (error) {
        console.error("Failed to fetch data", error);
        dispatch(setAccounts([]));
        setRoles([]);
      } finally {
      setIsLoading(false);
      }
    };

    fetchData();
  }, []); 

  // Memoize accounts to prevent unnecessary re-calculations
  const memoizedAccounts = useMemo(() => accounts || [], [accounts]);

  // Memoize search keys to prevent recreation
  const searchKeys = useMemo(() => ["email", "accountname"] as (keyof AccountResponse)[], []);

  const {
    inputValue,
    setInputValue,
    filteredData: searchFilteredData,
    searchQuery,
  } = useSearchFilter(memoizedAccounts, searchKeys);

  // Optimize search input handler to prevent unnecessary re-renders
  const handleSearchChange = useCallback((value: string) => {
    setInputValue(value);
  }, [setInputValue]);

  // Debounced filter handlers to prevent excessive filtering
  const handleRoleFilterChange = useCallback((value: string) => {
    setRoleFilter(value);
  }, []);

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
  }, []);

  const filteredData = useMemo(() => {
    if (!searchFilteredData) return [];
    
    let data = [...searchFilteredData]; 

    // Filter by role
    if (roleFilter !== "all") {
      data = data.filter(account => account.role === roleFilter);
    }

    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      data = data.filter(account => account.isActive === isActive);
    }

    return data;
  }, [searchFilteredData, roleFilter, statusFilter]);

  const clearFilters = useCallback(() => {
    setRoleFilter("all");
    setStatusFilter("all");
    setInputValue("");
  }, [setInputValue]);

  const hasActiveFilters = roleFilter !== "all" || statusFilter !== "all" || inputValue !== "";

  const table = useReactTable({
    data: filteredData,
    columns: accountColumns(dispatch, searchQuery),
    state: {
      columnVisibility,
      sorting,
      pagination,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onPaginationChange: setPagination, 
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination },
  });

  // Pagination calculations
  const { pageIndex, pageSize: currentSize } = table.getState().pagination;
  const totalPages = table.getPageCount();
  const firstRow = pageIndex * currentSize + 1;
  const lastRow = Math.min((pageIndex + 1) * currentSize, filteredData.length);

  // Pagination range with ellipsis
  const paginationRange = useMemo<(number | string)[]>(() => {
    const maxButtons = 5;
    if (totalPages <= maxButtons) return Array.from({ length: totalPages }, (_, i) => i);
    const siblings = 1;
    const left = Math.max(pageIndex - siblings, 1);
    const right = Math.min(pageIndex + siblings, totalPages - 2);
    const showLeftDots = left > 2;
    const showRightDots = right < totalPages - 3;
    const pages: (number | string)[] = [];
    pages.push(0);
    if (showLeftDots) pages.push('...');
    else Array.from({ length: left - 1 }, (_, i) => pages.push(i + 1));
    for (let i = left; i <= right; i++) pages.push(i);
    if (showRightDots) pages.push('...');
    else Array.from({ length: totalPages - 2 - right }, (_, i) => pages.push(right + 1 + i));
    pages.push(totalPages - 1);
    return pages;
  }, [pageIndex, totalPages]);

  // Column mapping for Vietnamese names
  const columnNames: Record<string, string> = {
    accountname: "Tên tài khoản",
    email: "Email",
    role: "Quyền",
    isActive: "Trạng thái",
    urlAvatar: "Avatar",
  };

  const handleExport = async (format: 'excel' | 'csv') => {
    try {
      await exportAccounts(filteredData, format);
      toast({ title: 'Exporting successfully !'});
    } catch (error) {
      const errorMessage = error instanceof Error && error.message 
        ? error.message
        : 'Error exporting accounts';
      toast({
        title: errorMessage,
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
      
      successAccounts.forEach((account: AccountResponse) => {
        dispatch(addAccountAction(account));
      });

      toast({ title: 'Accounts created successfully!' });

    } catch (error) {
      const errorMessage = error instanceof Error && error.message 
        ? error.message
        : 'Error creating accounts';
      toast({
        title: errorMessage,
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

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 container mx-auto py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 container mx-auto py-6">
      {/* Header Section with better organization */}
      <div className="space-y-4">
        {/* Top Row: Search and Primary Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Bar - Reduced width */}
          <div className="flex-1 max-w-md">
        <SearchBar
          placeholder="Tìm kiếm tài khoản..."
          value={inputValue}
              onChange={handleSearchChange}
        />
          </div>

          {/* Primary Action Buttons */}
          {hasPermission(permissions, 'account:create') && (
            <div className="flex gap-2">
              <Button 
                className="bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-2" 
                onClick={() => router.push('/dashboard/account/create')}
              >
                <Add sx={{ fontSize: 18 }} />
                Thêm tài khoản
              </Button>
              <Button 
                className="bg-yellow-500 text-white hover:bg-yellow-600 transition-colors flex items-center gap-2" 
                onClick={() => router.push('/dashboard/account/upload-students')}
              >
                <FileUpload sx={{ fontSize: 18 }} />
                <span className="hidden sm:inline">Tải lên SV</span>
              </Button>
            </div>
          )}
        </div>

        {/* Bottom Row: Filters and Secondary Actions */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Filters Group */}
          <div className="flex flex-wrap gap-3">
            {/* Role Filter */}
            <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tất cả quyền" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả quyền</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.name} value={role.name}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đã kích hoạt</SelectItem>
                <SelectItem value="inactive">Chưa kích hoạt</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <FilterX className="h-4 w-4" />
                Xóa bộ lọc
              </Button>
            )}
          </div>

          {/* Actions Group */}
          <div className="flex flex-wrap gap-2">
            {/* Column Visibility */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Columns className="h-4 w-4" />
                  Cột
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Hiển thị cột</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {columnNames[column.id] || column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Import Actions */}
            {hasPermission(permissions, 'account:create') && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="bg-green-500 text-white hover:bg-green-600 flex items-center gap-2">
                    <Add sx={{ fontSize: 16 }} />
                    Nhập
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Định dạng file</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => openModal('xlsx')}>
                    📊 Excel (.xlsx)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openModal('csv')}>
                    📄 CSV (.csv)
                  </DropdownMenuItem>
                </DropdownMenuContent>
                <ImportFileModal open={open} setOpen={setOpen} fileType={fileType} handleImport={handleImport}/>
              </DropdownMenu>
            )}

            {/* Export Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="bg-indigo-500 text-white hover:bg-indigo-600 flex items-center gap-2">
                  <Output sx={{ fontSize: 16 }} />
                  Xuất
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Định dạng file</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleExport('excel')}>
                  📊 Excel (.xlsx)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  📄 CSV (.csv)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Bulk Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  Thao tác
                  <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Hành động hàng loạt</DropdownMenuLabel>
                {hasPermission(permissions, 'account:delete') && (
                  <DropdownMenuItem onClick={handleDeleteAllClick}>
                    <div className="flex items-center gap-2 text-red-600">
                      <Delete sx={{ fontSize: 16 }} />
                      Xóa đã chọn
                    </div>
                  </DropdownMenuItem>
                )}
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <span className="font-medium">Kết quả lọc:</span>
          <span>{filteredData.length} / {accounts.length} tài khoản</span>
          {roleFilter !== "all" && (
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
              Quyền: {roleFilter}
            </span>
          )}
          {statusFilter !== "all" && (
            <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">
              {statusFilter === "active" ? "Đã kích hoạt" : "Chưa kích hoạt"}
            </span>
          )}
          {inputValue && (
            <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-xs">
              &quot;{inputValue}&quot;
            </span>
          )}
        </div>
      )}

      {/* Custom Table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full min-w-[800px] text-sm">
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="font-semibold text-gray-900 dark:text-gray-100">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow 
                    key={row.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center text-gray-500 dark:text-gray-400"
                  >
                    Không có dữ liệu tài khoản.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center gap-4 lg:items-center lg:justify-between lg:flex-row py-4 text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          Hiển thị {firstRow}-{lastRow} trên {filteredData.length} kết quả
        </span>
        <div className="flex items-center space-x-1">
          <Button
            size="sm"
            type="button"
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Trước
          </Button>
          {paginationRange.map((item, idx) =>
            typeof item === 'string' ? (
              <span key={idx} className="px-2 select-none text-gray-400">
                …
              </span>
            ) : (
              <Button
                key={item}
                type="button"
                size="sm"
                variant={item === pageIndex ? 'default' : 'outline'}
                onClick={() => table.setPageIndex(item as number)}
                className="min-w-[40px]"
              >
                {item + 1}
              </Button>
            )
          )}
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="flex items-center gap-1"
          >
            Tiếp
            <ChevronRight className="h-4 w-4" />
            </Button>
                  </div>
      </div>
    </div>
  );
}

export const AccountTable = memo(AccountTableComponent);
