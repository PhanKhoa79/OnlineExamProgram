"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store"; 
import { examColumns } from "@/features/exam/components/column";
import { Button } from "@/components/ui/button";
import { ChevronDown, Columns, ChevronLeft, ChevronRight, FilterX } from "lucide-react";
import { Output } from "@mui/icons-material";
import { getAllExams, exportExams } from "@/features/exam/services/examServices";
import { getAllSubjects } from "@/features/subject/services/subjectServices";
import { SubjectResponseDto } from "@/features/subject/types/subject";
import { setExams } from "@/store/examSlice";
import { useAuthStore } from "@/features/auth/store"; 
import { hasPermission } from "@/lib/permissions"; 
import SearchBar from "@/components/ui/SearchBar";
import { toast } from "@/components/hooks/use-toast";
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

function ExamTableComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [subjects, setSubjects] = useState<SubjectResponseDto[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  // Filter states
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [examTypeFilter, setExamTypeFilter] = useState<string>("all");

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

  const exams = useSelector((state: RootState) => state.exam?.exams || []);
  const permissions = useAuthStore((state) => state.permissions);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [examsData, subjectsData] = await Promise.all([
          getAllExams(),
          getAllSubjects()
        ]);
        
        dispatch(setExams(examsData));
        setSubjects(subjectsData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const memoizedExams = useMemo(() => exams || [], [exams]);

  // Custom search functionality to support nested subject names
  const [inputValue, setInputValue] = useState("");
  const searchQuery = inputValue.toLowerCase().trim();

  const searchFilteredData = useMemo(() => {
    if (!searchQuery) return memoizedExams;

    return memoizedExams.filter(exam => {
      // Search in exam name
      if (exam.name.toLowerCase().includes(searchQuery)) return true;
      
      const examTypeLabel = exam.examType === 'practice' ? 'luyện tập' : 'chính thức';
      if (examTypeLabel.includes(searchQuery)) return true;
      
      if (exam.subject?.name.toLowerCase().includes(searchQuery)) return true;
      
      if (exam.subject?.code.toLowerCase().includes(searchQuery)) return true;
      
      return false;
    });
  }, [memoizedExams, searchQuery]);

  // Apply additional filters
  const filteredData = useMemo(() => {
    let data = searchFilteredData;

    // Filter by subject
    if (subjectFilter !== "all") {
      const targetSubjectId = parseInt(subjectFilter);
      data = data.filter(exam => exam.subject.id === targetSubjectId);
    }

    // Filter by exam type
    if (examTypeFilter !== "all") {
      data = data.filter(exam => exam.examType === examTypeFilter);
    }

    return data;
  }, [searchFilteredData, subjectFilter, examTypeFilter]);

  const handleSearchChange = useCallback((value: string) => {
    setInputValue(value);
  }, [setInputValue]);

  const clearFilters = useCallback(() => {
    setSubjectFilter("all");
    setExamTypeFilter("all");
    setInputValue("");
  }, [setInputValue]);

  const hasActiveFilters = subjectFilter !== "all" || examTypeFilter !== "all" || inputValue !== "";

  const handleExport = async (format: 'excel' | 'csv') => {
    try {
      await exportExams(filteredData, format);
      toast({ title: 'Export thành công!' });
    } catch (error) {
      const errorMessage = error instanceof Error && error.message 
        ? error.message
        : 'Error exporting exams';
      toast({
        title: errorMessage,
        variant: 'error',
      });
    }
  };

  // Memoize columns
  const columns = useMemo(() => examColumns(searchQuery), [searchQuery]);

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
    name: "Tên đề thi",
    examType: "Loại đề thi", 
    duration: "Thời gian",
    totalQuestions: "Số câu hỏi",
    subject: "Môn học",
    actions: "Thao tác",
  };

  // Exam type options
  const examTypeOptions = [
    { value: "practice", label: "Luyện tập" },
    { value: "official", label: "Chính thức" },
  ];

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
      {/* Header Section */}
      <div className="space-y-4">
        {/* Top Row: Search and Primary Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <SearchBar
              placeholder="Tìm kiếm đề thi..."
              value={inputValue}
              onChange={handleSearchChange}
            />
          </div>

          {/* Primary Action Button */}
          {hasPermission(permissions, 'exam:create') && (
            <Button 
              className="bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-2" 
              onClick={() => router.push('/dashboard/exam/create')}
            >
              <span className="text-lg">+</span>
              Thêm đề thi
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
              <SelectContent>
                <SelectItem value="all">Tất cả môn học</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id.toString()}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Exam Type Filter */}
            <Select value={examTypeFilter} onValueChange={setExamTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Loại đề thi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                {examTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
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
          </div>
        </div>
      </div>

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <span className="font-medium">Kết quả lọc:</span>
          <span>{filteredData.length} / {exams.length} đề thi</span>
          {subjectFilter !== "all" && (
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
              Môn: {subjects.find(s => s.id.toString() === subjectFilter)?.name || subjectFilter}
            </span>
          )}
          {examTypeFilter !== "all" && (
            <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded text-xs">
              Loại: {examTypeOptions.find(t => t.value === examTypeFilter)?.label || examTypeFilter}
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
                    Không có dữ liệu đề thi.
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

export const ExamTable = memo(ExamTableComponent); 