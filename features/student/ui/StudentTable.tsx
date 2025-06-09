"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store"; 
import { studentColumns } from "@/features/student/ui/column";
import { Button } from "@/components/ui/button";
import { getAllStudents, exportStudents, importStudentsFromFile } from "@/features/student/services/studentService";
import { getAllClasses } from "@/features/classes/services/classServices";
import { useSearchFilter } from "@/hooks/useSearchFilter";
import { setStudents } from "@/store/studentSlice";
import { useAuthStore } from "@/features/auth/store"; 
import { hasPermission } from "@/lib/permissions"; 
import SearchBar from "@/components/ui/SearchBar";
import { ChevronDown, Columns, ChevronLeft, ChevronRight, FilterX } from "lucide-react";
import { Add, Output } from "@mui/icons-material";
import { toast } from "@/components/hooks/use-toast";
import { StudentImportFileModal, FileType } from "@/features/student/ui/modal/StudentImportFileModal";
import { TabbedHelpModal } from "@/components/ui/TabbedHelpModal";
import { studentInstructions, studentPermissions } from "@/features/student/data/studentInstructions";
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
import { ClassResponseDto } from "@/features/classes/types/class.type";
import { StudentDto } from "@/features/student/types/student";

function StudentTableComponent() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  // Filter states
  const [classFilter, setClassFilter] = useState<string>("all");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [classes, setClasses] = useState<ClassResponseDto[]>([]);

  // URL-based pagination like DataTable
  const initialPage = Math.max(0, (Number(searchParams.get('page')) || 1) - 1);
  const pageSize = 7; // Same as DataTable default
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

  const students = useSelector((state: RootState) => state.student.students);

  const permissions = useAuthStore((state) => state.permissions);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [studentsData, classesData] = await Promise.all([
          getAllStudents(),
          getAllClasses()
        ]);
        
        if (Array.isArray(studentsData)) {
          dispatch(setStudents(studentsData));
        } else {
          console.error("Invalid students data format:", studentsData);
          dispatch(setStudents([]));
        }

        if (Array.isArray(classesData)) {
          setClasses(classesData);
        } else {
          console.error("Invalid classes data format:", classesData);
          setClasses([]);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        dispatch(setStudents([]));
        setClasses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); 

  const memoizedStudents = useMemo(() => students || [], [students]);

  const searchKeys = useMemo(() => ["fullName", "studentCode", "email", "address"] as (keyof StudentDto)[], []);

  const {
    inputValue,
    setInputValue,
    filteredData: searchFilteredData,
    searchQuery,
  } = useSearchFilter(memoizedStudents, searchKeys);

  const filteredData = useMemo(() => {
    let data = memoizedStudents; 

    if (inputValue.trim() !== '') {
      const lowerSearchQuery = inputValue.toLowerCase().trim();
      const isGenderSearch = ['nam', 'nữ', 'nu', 'khác', 'khac'].includes(lowerSearchQuery);
      
      if (isGenderSearch) {
        data = data.filter((student) => {
          const gender = student.gender;
          if (!gender) return false;
          const normalizedGender = gender.toLowerCase();
          return normalizedGender === lowerSearchQuery || 
                 (lowerSearchQuery === 'nu' && normalizedGender === 'nữ') ||
                 (lowerSearchQuery === 'khac' && normalizedGender === 'khác');
        });
      } else {
        data = searchFilteredData;
      }
    } else {
      data = memoizedStudents;
    }

    if (classFilter !== "all") {
      data = data.filter(student => {
        if (classFilter === "unassigned") {
          return !student.classId;
        }
        return student.classId === parseInt(classFilter);
      });
    }

    // Filter by gender dropdown
    if (genderFilter !== "all") {
      data = data.filter(student => student.gender === genderFilter);
    }

    return data;
  }, [memoizedStudents, inputValue, searchFilteredData, classFilter, genderFilter]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setClassFilter("all");
    setGenderFilter("all");
    setInputValue("");
  }, [setInputValue]);

  const handleSearchChange = useCallback((value: string) => {
    setInputValue(value);
  }, [setInputValue]);

  const hasActiveFilters = classFilter !== "all" || genderFilter !== "all" || inputValue !== "";

  const handleExport = async (format: 'excel' | 'csv') => {
    try {
      await exportStudents(filteredData, format);
      toast({ title: 'Export thành công!' });
    } catch (error) {
      const errorMessage = error instanceof Error && error.message 
        ? error.message
        : 'Error exporting students';
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
        response = await importStudentsFromFile(file, fileType);
      } else if (fileType === 'csv') {
        response = await importStudentsFromFile(file, fileType);
      } else {
        throw new Error('Unsupported file type');
      }

      const successStudents = response.data.createdStudents;
      
      if (!successStudents || !Array.isArray(successStudents)) {
        toast({ 
          title: 'Có lỗi xảy ra khi xử lý dữ liệu import!', 
          variant: 'error' 
        });
        return;
      }
      
      if (successStudents.length === 0) {
        toast({ title: 'Không có sinh viên nào được thêm!', variant: 'error' });
        return;
      }
      
      const updatedStudentsData = await getAllStudents();
      if (Array.isArray(updatedStudentsData)) {
        dispatch(setStudents(updatedStudentsData));
      }

      toast({ 
        title: `Import thành công ${successStudents.length} sinh viên!`
      });

    } catch (error) {
      const errorMessage = error instanceof Error && error.message 
        ? error.message
        : 'Error importing students';
      toast({
        title: errorMessage,
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

  // Create table instance with column visibility and DataTable-like pagination
  const columns = studentColumns(searchQuery);
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

  // DataTable pagination calculations
  const { pageIndex, pageSize: currentSize } = table.getState().pagination;
  const totalPages = table.getPageCount();
  const firstRow = pageIndex * currentSize + 1;
  const lastRow = Math.min((pageIndex + 1) * currentSize, filteredData.length);

  // DataTable pagination range with ellipsis
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
    studentCode: "Mã sinh viên",
    fullName: "Họ và tên", 
    dateOfBirth: "Ngày sinh",
    gender: "Giới tính",
    email: "Email",
    phoneNumber: "Số điện thoại",
    address: "Địa chỉ",
    classId: "Lớp học",
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
              placeholder="Tìm kiếm sinh viên..."
              value={inputValue}
              onChange={handleSearchChange}
            />
          </div>

          {/* Actions Group */}
          <div className="flex items-center gap-2">
            {/* Help Button */}
            <TabbedHelpModal 
              featureName="Quản lý Sinh viên" 
              entityName="sinh viên"
              permissions={studentPermissions}
              detailedInstructions={studentInstructions}
            />
            
            {/* Primary Action Button */}
            {hasPermission(permissions, 'student:create') && (
              <Button 
                className="bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-2 cursor-pointer" 
                onClick={() => router.push('/dashboard/student/create')}
              >
                <span className="text-lg">+</span>
                Thêm sinh viên
              </Button>
            )}
          </div>
        </div>

        {/* Bottom Row: Filters and Secondary Actions */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Filters Group */}
          <div className="flex flex-wrap gap-3">
            {/* Class Filter */}
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Tất cả lớp" />
              </SelectTrigger>
              <SelectContent className="cursor-pointer">
                <SelectItem value="all">Tất cả lớp</SelectItem>
                <SelectItem value="unassigned">Chưa phân lớp</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id.toString()}>
                    {cls.code} - {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Gender Filter */}
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Giới tính" />
              </SelectTrigger>
              <SelectContent className="cursor-pointer">
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Nam">Nam</SelectItem>
                <SelectItem value="Nữ">Nữ</SelectItem>
                <SelectItem value="Khác">Khác</SelectItem>
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
            {hasPermission(permissions, 'student:create') && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="bg-green-500 text-white hover:bg-green-600 flex items-center gap-2 cursor-pointer">
                    <Add sx={{ fontSize: 16 }} />
                    Nhập
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Định dạng file</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => openModal('xlsx')} className="cursor-pointer">
                    📊 Excel (.xlsx)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openModal('csv')} className="cursor-pointer">
                    📄 CSV (.csv)
                  </DropdownMenuItem>
                </DropdownMenuContent>
                <StudentImportFileModal open={open} setOpen={setOpen} fileType={fileType} handleImport={handleImport}/>
              </DropdownMenu>
            )}

            {/* Export Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="bg-indigo-500 text-white hover:bg-indigo-600 flex items-center gap-2 cursor-pointer">
                  <Output sx={{ fontSize: 16 }} />
                  Xuất
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Định dạng file</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleExport('excel')} className="cursor-pointer">
                  📊 Excel (.xlsx)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')} className="cursor-pointer">
                  📄 CSV (.csv)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <span className="font-medium">Kết quả lọc:</span>
          <span>{filteredData.length} / {students.length} sinh viên</span>
          {classFilter !== "all" && (
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
              Lớp: {classFilter === "unassigned" ? "Chưa phân lớp" : classes.find(c => c.id.toString() === classFilter)?.code || classFilter}
            </span>
          )}
          {genderFilter !== "all" && (
            <span className="bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 px-2 py-1 rounded text-xs">
              {genderFilter}
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
                    Không có dữ liệu sinh viên.
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
                className="min-w-[40px] cursor-pointer"
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

export const StudentTable = memo(StudentTableComponent); 
