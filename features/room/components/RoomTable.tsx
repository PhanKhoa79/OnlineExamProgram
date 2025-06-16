"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store"; 
import { roomColumns } from "@/features/room/components/column";
import { Button } from "@/components/ui/button";
import { ChevronDown, Columns, ChevronLeft, ChevronRight, FilterX, Plus } from "lucide-react";
import { getAllRooms, getSystemStatus } from "@/features/room/services/roomServices";
import { getAllExams } from "@/features/exam/services/examServices";
import { getAllSchedules } from "@/features/schedule/services/scheduleServices";
import { getAllClasses } from "@/features/classes/services/classServices";
import { setRooms } from "@/store/roomSlice";
import { SystemStatusDto } from "../types/room";
import { ExamDto } from "@/features/exam/types/exam.type";
import { ExamScheduleDto } from "@/features/schedule/types/schedule";
import { ClassResponseDto } from "@/features/classes/types/class.type";
import { useAuthStore } from "@/features/auth/store"; 
import { hasPermission } from "@/lib/permissions"; 
import { useTableReload } from "@/hooks/useTableReload";
import { ReloadButton } from "@/components/ui/ReloadButton";
import { TabbedHelpModal } from "@/components/ui/TabbedHelpModal";
import { roomInstructions } from "@/features/room/data/roomInstructions";
import { toast } from "@/components/hooks/use-toast";
import SearchBar from "@/components/ui/SearchBar";
import { ROOM_STATUS_OPTIONS } from "../data/roomConstants";
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

function RoomTableComponent() {
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [exams, setExams] = useState<ExamDto[]>([]);
  const [schedules, setSchedules] = useState<ExamScheduleDto[]>([]);
  const [classes, setClasses] = useState<ClassResponseDto[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatusDto | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [examFilter, setExamFilter] = useState<string>("all");
  const [scheduleFilter, setScheduleFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");

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

  const rooms = useSelector((state: RootState) => {
    return state.room?.rooms || [];
  });
  const permissions = useAuthStore((state) => state.permissions);
  const dispatch = useDispatch<AppDispatch>();

  const fetchData = useCallback(async () => {
    try {
      const roomsData = await getAllRooms();
      const [examsData, schedulesData, classesData, statusData] = await Promise.all([
        getAllExams(),
        getAllSchedules(),
        getAllClasses(),
        getSystemStatus()
      ]);
      
      dispatch(setRooms(roomsData));
      
      setExams(examsData || []);
      setSchedules(schedulesData || []);
      setClasses(classesData || []);
      setSystemStatus(statusData);
          } catch (error: unknown) {
        console.error("❌ fetchData failed:", error);
        
        dispatch(setRooms([]));
        setExams([]);
        setSchedules([]);
        setClasses([]);
        setSystemStatus({
          totalRooms: 0,
          waitingRooms: 0,
          openRooms: 0,
          closedRooms: 0,
          lastSyncTime: new Date().toISOString()
        });
        
        // Show error toast
        toast({
          title: 'Lỗi khi tải dữ liệu',
          description: error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải dữ liệu',
          variant: 'error'
        });
      }
  }, [dispatch]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchData();
      } catch {
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []); // Empty dependency array - only run once on mount

  // Listen for room deletion events
  useEffect(() => {
    const handleRoomDeleted = () => {
      fetchData();
    };

    window.addEventListener('roomDeleted', handleRoomDeleted);
    
    return () => {
      window.removeEventListener('roomDeleted', handleRoomDeleted);
    };
  }, [fetchData]);

  const { isReloading, handleReload } = useTableReload({
    onReload: fetchData,
    onSuccess: () => {
      toast({ title: 'Dữ liệu đã được làm mới!' });
    },
    onError: (error) => {
      toast({ 
        title: 'Lỗi khi tải dữ liệu', 
        description: error.message,
        variant: 'error' 
      });
    }
  });

  const memoizedRooms = useMemo(() => {
    return rooms || [];
  }, [rooms]);

  // Custom search functionality
  const [inputValue, setInputValue] = useState("");
  const searchQuery = inputValue.toLowerCase().trim();

  const searchFilteredData = useMemo(() => {
    if (!searchQuery) return memoizedRooms;

    return memoizedRooms.filter(room => {
      // Search in room code
      if (room.code.toLowerCase().includes(searchQuery)) return true;
      
      // Search in exam name
      if (room.exam?.name.toLowerCase().includes(searchQuery)) return true;
      
      // Search in class name
      if (room.class?.name.toLowerCase().includes(searchQuery)) return true;
      
      // Search in schedule code (not name)
      if (room.examSchedule?.code.toLowerCase().includes(searchQuery)) return true;
      
      // Search in status
      const statusLabels = {
        'waiting': 'chờ mở',
        'open': 'đang mở',
        'closed': 'đã đóng'
      };
      if (statusLabels[room.status].includes(searchQuery)) return true;
      
      return false;
    });
  }, [memoizedRooms, searchQuery]);

  // Apply additional filters
  const filteredData = useMemo(() => {
    let data = searchFilteredData;

    // Filter by status
    if (statusFilter !== "all") {
      data = data.filter(room => room.status === statusFilter);
    }

    // Filter by exam
    if (examFilter !== "all") {
      const targetExamId = parseInt(examFilter);
      data = data.filter(room => room.exam?.id === targetExamId);
    }

    // Filter by schedule
    if (scheduleFilter !== "all") {
      const targetScheduleId = parseInt(scheduleFilter);
      data = data.filter(room => room.examSchedule?.id === targetScheduleId);
    }

    // Filter by class
    if (classFilter !== "all") {
      const targetClassId = parseInt(classFilter);
      data = data.filter(room => room.class?.id === targetClassId);
    }

    return data;
  }, [searchFilteredData, statusFilter, examFilter, scheduleFilter, classFilter]);

  const handleSearchChange = useCallback((value: string) => {
    setInputValue(value);
  }, [setInputValue]);

  const clearFilters = useCallback(() => {
    setStatusFilter("all");
    setExamFilter("all");
    setScheduleFilter("all");
    setClassFilter("all");
    setInputValue("");
  }, [setInputValue]);

  const hasActiveFilters = statusFilter !== "all" || examFilter !== "all" || 
                          scheduleFilter !== "all" || classFilter !== "all" || inputValue !== "";

  // Memoize columns with status change callback
  const columns = useMemo(() => roomColumns(searchQuery, fetchData), [searchQuery, fetchData]);

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
    manualPagination: false,
  });

  const handleCreateRoom = () => {
    router.push('/dashboard/room/create');
  };

  const handleBulkCreate = () => {
    router.push('/dashboard/room/bulk-create');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* System Status Cards */}
      {systemStatus && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-sm font-medium text-gray-500">Tổng phòng thi</div>
            <div className="text-2xl font-bold text-gray-900">{systemStatus.totalRooms}</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow border border-yellow-200">
            <div className="text-sm font-medium text-yellow-600">Chờ mở</div>
            <div className="text-2xl font-bold text-yellow-700">{systemStatus.waitingRooms}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
            <div className="text-sm font-medium text-green-600">Đang mở</div>
            <div className="text-2xl font-bold text-green-700">{systemStatus.openRooms}</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow border border-red-200">
            <div className="text-sm font-medium text-red-600">Đã đóng</div>
            <div className="text-2xl font-bold text-red-700">{systemStatus.closedRooms}</div>
          </div>
        </div>
      )}

      {/* Header with Search and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={inputValue}
            onChange={handleSearchChange}
            placeholder="Tìm kiếm phòng thi..."
          />
        </div>
        
        <div className="flex items-center gap-2">
          <ReloadButton 
            onReload={handleReload} 
            isLoading={isReloading}
            className="h-9"
          />
          
          <TabbedHelpModal 
            featureName="Quản lý Phòng thi" 
            entityName="phòng thi"
            permissions={{
              create: 'room:create',
              edit: 'room:update', 
              delete: 'room:delete'
            }}
            detailedInstructions={roomInstructions}
          />
          
          {hasPermission(permissions, 'room:create') && (
            <>
              <Button onClick={handleBulkCreate} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Tạo hàng loạt
              </Button>
              <Button onClick={handleCreateRoom} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Thêm phòng thi
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            {ROOM_STATUS_OPTIONS.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={examFilter} onValueChange={setExamFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Bài thi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả bài thi</SelectItem>
            {exams.map((exam) => (
              <SelectItem key={exam.id} value={exam.id.toString()}>
                {exam.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={scheduleFilter} onValueChange={setScheduleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lịch thi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả lịch thi</SelectItem>
            {schedules.map((schedule) => (
              <SelectItem key={schedule.id} value={schedule.id.toString()}>
                {schedule.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Lớp học" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả lớp</SelectItem>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id.toString()}>
                {cls.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters} size="sm">
            <FilterX className="h-4 w-4 mr-2" />
            Xóa bộ lọc
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Columns className="h-4 w-4 mr-2" />
              Cột hiển thị
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Chọn cột hiển thị</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                const meta = column.columnDef.meta as { displayName?: string } | undefined;
                const displayName = meta?.displayName || column.id;
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {displayName}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Không có dữ liệu phòng thi.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Hiển thị {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} đến{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          trong tổng số {table.getFilteredRowModel().rows.length} phòng thi
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Sau
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export const RoomTable = memo(RoomTableComponent); 