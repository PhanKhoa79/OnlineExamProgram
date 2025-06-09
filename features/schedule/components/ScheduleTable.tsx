"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store"; 
import { scheduleColumns } from "@/features/schedule/components/column";
import { Button } from "@/components/ui/button";
import { ChevronDown, Columns, ChevronLeft, ChevronRight, FilterX } from "lucide-react";
import { getAllSchedules } from "@/features/schedule/services/scheduleServices";
import { getAllSubjects } from "@/features/subject/services/subjectServices";
import { SubjectResponseDto } from "@/features/subject/types/subject";
import { setSchedules } from "@/store/scheduleSlice";
import { useAuthStore } from "@/features/auth/store"; 
import { hasPermission } from "@/lib/permissions"; 
import SearchBar from "@/components/ui/SearchBar";
import { TabbedHelpModal } from "@/components/ui/TabbedHelpModal";
import { scheduleInstructions } from "@/features/schedule/data/scheduleInstructions";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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

function ScheduleTableComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [subjects, setSubjects] = useState<SubjectResponseDto[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  // Filter states
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // URL-based pagination
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

  const schedules = useSelector((state: RootState) => state.schedule?.schedules || []);
  const permissions = useAuthStore((state) => state.permissions);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [schedulesData, subjectsData] = await Promise.all([
          getAllSchedules(),
          getAllSubjects()
        ]);
        
        dispatch(setSchedules(schedulesData));
        setSubjects(subjectsData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const memoizedSchedules = useMemo(() => schedules || [], [schedules]);

  // Custom search functionality
  const [inputValue, setInputValue] = useState("");
  const searchQuery = inputValue.toLowerCase().trim();

  const searchFilteredData = useMemo(() => {
    if (!searchQuery) return memoizedSchedules;

    return memoizedSchedules.filter(schedule => {
      if (schedule.code.toLowerCase().includes(searchQuery)) return true;
      
      // Search in subject name
      const subjectName = schedule.subject?.name?.toLowerCase() || '';
      if (subjectName.includes(searchQuery)) return true;
      
      // Search in status labels
      const statusLabels = {
        'active': 'hoạt động',
        'completed': 'hoàn thành',
        'cancelled': 'đã hủy'
      };
      if (statusLabels[schedule.status].includes(searchQuery)) return true;
      
      if (schedule.description?.toLowerCase().includes(searchQuery)) return true;
      
      return false;
    });
  }, [memoizedSchedules, searchQuery]);

  const filteredData = useMemo(() => {
    let data = searchFilteredData;

    // Filter by subject
    if (subjectFilter !== "all") {
      const targetSubjectName = subjects.find(s => s.id.toString() === subjectFilter)?.name;
      data = data.filter(schedule => schedule.subject?.name === targetSubjectName);
    }

    // Filter by status
    if (statusFilter !== "all") {
      data = data.filter(schedule => schedule.status === statusFilter);
    }

    return data;
  }, [searchFilteredData, subjectFilter, statusFilter, subjects]);

  const handleSearchChange = useCallback((value: string) => {
    setInputValue(value);
  }, [setInputValue]);

  const clearFilters = useCallback(() => {
    setSubjectFilter("all");
    setStatusFilter("all");
    setInputValue("");
  }, [setInputValue]);

  const hasActiveFilters = subjectFilter !== "all" || statusFilter !== "all" || inputValue !== "";

  // Memoize columns
  const columns = useMemo(() => scheduleColumns(searchQuery), [searchQuery]);

  // Create table instance
  const table = useReactTable({
    data: filteredData,
    columns,
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
    if (showLeftDots) pages.push("...");
    for (let i = left; i <= right; i++) pages.push(i);
    if (showRightDots) pages.push("...");
    if (totalPages > 1) pages.push(totalPages - 1);

    return Array.from(new Set(pages));
  }, [pageIndex, totalPages]);

  const handleAddSchedule = () => {
    router.push('/dashboard/schedule/create');
  };

  const columnNames: Record<string, string> = {
    code: "Mã lịch thi",
    startTime: "Thời gian bắt đầu",
    endTime: "Thời gian kết thúc",
    subject: "Môn học",
    status: "Trạng thái",
    description: "Mô tả",
    createdAt: "Ngày tạo"
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
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Quản lý lịch thi</h2>
          <p className="text-muted-foreground">
            Quản lý và theo dõi lịch thi trong hệ thống
          </p>
        </div>
      </div>

      {/* Header Section */}
      <div className="space-y-4">
        {/* Top Row: Search and Primary Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <SearchBar
              placeholder="Tìm kiếm lịch thi..."
              value={inputValue}
              onChange={handleSearchChange}
            />
          </div>

          {/* Primary Action Button */}
          {hasPermission(permissions, 'schedule:create') && (
            <Button 
              className="bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-2 cursor-pointer" 
              onClick={handleAddSchedule}
            >
              <span className="text-lg">+</span>
              Thêm lịch thi
            </Button>
          )}
        </div>

        {/* Bottom Row: Filters and Secondary Actions */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Filters Group */}
          <div className="flex flex-wrap gap-3">
            {/* Subject Filter */}
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tất cả môn học" />
              </SelectTrigger>
              <SelectContent className="cursor-pointer">
                <SelectItem value="all">Tất cả môn học</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id.toString()}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent className="cursor-pointer">
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                <FilterX className="h-4 w-4" />
                Xóa bộ lọc
              </Button>
            )}
          </div>

          {/* Actions Group */}
          <div className="flex flex-wrap gap-2">
            {/* Help Button */}
            <TabbedHelpModal 
              featureName="Quản lý Lịch thi" 
              entityName="lịch thi"
              permissions={{
                create: 'schedule:create',
                edit: 'schedule:update', 
                delete: 'schedule:delete',
                export: 'schedule:export',
                import: 'schedule:import'
              }}
              detailedInstructions={scheduleInstructions}
            />
            
            {/* Column Visibility */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2 cursor-pointer">
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
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {columnNames[column.id] || column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <span className="font-medium">Kết quả lọc:</span>
          <span>{filteredData.length} / {memoizedSchedules.length} lịch thi</span>
          {subjectFilter !== "all" && (
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
              Môn: {subjects.find(s => s.id.toString() === subjectFilter)?.name || subjectFilter}
            </span>
          )}
          {statusFilter !== "all" && (
            <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded text-xs">
              Trạng thái: {statusFilter === 'active' ? 'Hoạt động' : statusFilter === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
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
                    colSpan={columns.length}
                    className="h-24 text-center text-gray-500 dark:text-gray-400"
                  >
                    Không có dữ liệu lịch thi.
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
            className="flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            Trước
          </Button>
          
          <div className="flex space-x-1">
            {paginationRange.map((page, index) => (
              <Button
                key={index}
                variant={page === pageIndex ? "default" : "outline"}
                size="sm"
                onClick={() => typeof page === 'number' && table.setPageIndex(page)}
                disabled={typeof page === 'string'}
                className="min-w-[32px] cursor-pointer"
              >
                {typeof page === 'string' ? page : page + 1}
              </Button>
            ))}
          </div>

          <Button
            size="sm"
            type="button"
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="flex items-center gap-1 cursor-pointer"
          >
            Tiếp
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export const ScheduleTable = memo(ScheduleTableComponent); 