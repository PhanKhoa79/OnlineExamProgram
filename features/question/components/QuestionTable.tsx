"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store"; 
import { questionColumns } from "@/features/question/components/column";
import { Button } from "@/components/ui/button";
import { ChevronDown, Columns, ChevronLeft, ChevronRight, FilterX, Trash2 } from "lucide-react";
import { Add, Output } from "@mui/icons-material";
import { getAllQuestions, exportQuestions, importQuestionsFromFile, batchDeleteQuestions } from "@/features/question/services/questionService";
import { getAllSubjects } from "@/features/subject/services/subjectServices";
import { useSearchFilter } from "@/hooks/useSearchFilter";
import { useTableReload } from "@/hooks/useTableReload";
import { ReloadButton } from "@/components/ui/ReloadButton";
import { QuestionDto } from "@/features/question/types/question.type";
import { SubjectResponseDto } from "@/features/subject/types/subject";
import { setQuestions } from "@/store/questionSlice";
import { useAuthStore } from "@/features/auth/store"; 
import { hasPermission } from "@/lib/permissions"; 
import SearchBar from "@/components/ui/SearchBar";
import { TabbedHelpModal } from "@/components/ui/TabbedHelpModal";
import { questionInstructions, questionPermissions } from "@/features/question/data/questionInstructions";
import { toast } from "@/components/hooks/use-toast";
import { QuestionImportFileModal, FileType } from "@/features/question/ui/modal/QuestionImportFileModal";
import { BulkDeleteConfirmModal } from "@/features/question/ui/modal/BulkDeleteConfirmModal";
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
  type RowSelectionState,
} from "@tanstack/react-table";

function QuestionTableComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [subjects, setSubjects] = useState<SubjectResponseDto[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Filter states
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

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

  const questions = useSelector((state: RootState) => state.question.questions);
  const permissions = useAuthStore((state) => state.permissions);
  const dispatch = useDispatch<AppDispatch>();

  const fetchData = useCallback(async () => {
    try {
      // Fetch both questions and subjects in parallel
      const [questionsData, subjectsData] = await Promise.all([
        getAllQuestions(),
        getAllSubjects()
      ]);
      
      dispatch(setQuestions(questionsData));
      setSubjects(subjectsData);
    } catch (error) {
      console.error("Failed to fetch data", error);
      throw error;
    }
  }, [dispatch]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchData();
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
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

  const memoizedQuestions = useMemo(() => questions || [], [questions]);

  const searchKeys = useMemo(() => ["questionText", "difficultyLevel"] as (keyof QuestionDto)[], []);

  const {
    inputValue,
    setInputValue,
    filteredData: searchFilteredData,
    searchQuery,
  } = useSearchFilter(memoizedQuestions, searchKeys);

  // Apply additional filters
  const filteredData = useMemo(() => {
    let data = searchFilteredData;

    // Filter by subject
    if (subjectFilter !== "all") {
      data = data.filter(question => question.subjectId === parseInt(subjectFilter));
    }

    // Filter by difficulty
    if (difficultyFilter !== "all") {
      data = data.filter(question => question.difficultyLevel === difficultyFilter);
    }

    return data;
  }, [searchFilteredData, subjectFilter, difficultyFilter]);

  const handleSearchChange = useCallback((value: string) => {
    setInputValue(value);
  }, [setInputValue]);

  const clearFilters = useCallback(() => {
    setSubjectFilter("all");
    setDifficultyFilter("all");
    setInputValue("");
  }, [setInputValue]);

  const hasActiveFilters = subjectFilter !== "all" || difficultyFilter !== "all" || inputValue !== "";

  const handleExport = async (format: 'excel' | 'csv') => {
    try {
      await exportQuestions(filteredData, format);
      toast({ title: 'Export thành công!' });
    } catch (error) {
      const errorMessage = error instanceof Error && error.message 
        ? error.message
        : 'Error exporting questions';
      toast({
        title: errorMessage,
        variant: 'error',
      });
    }
  };

  const handleImport = async (file: File, fileType: FileType) => {
    setIsLoading(true);
    try {
      const response = await importQuestionsFromFile(file, fileType);
      
      if (!response || !response.data) {
        toast({ 
          title: 'Có lỗi xảy ra khi xử lý dữ liệu import!', 
          variant: 'error' 
        });
        return;
      }
      
      const updatedQuestionsData = await getAllQuestions();
      if (Array.isArray(updatedQuestionsData)) {
        dispatch(setQuestions(updatedQuestionsData));
      }

      toast({ 
        title: `Import thành công!`
      });

    } catch (error) {
      const errorMessage = error instanceof Error && error.message 
        ? error.message
        : 'Error importing questions';
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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const openModal = (type: FileType) => {
    setFileType(type);
    setOpen(true);
  };

  // Memoize columns with subjects
  const columns = useMemo(() => questionColumns(subjects, searchQuery), [subjects, searchQuery]);

  // Handle bulk delete - opens confirmation modal
  const handleBulkDelete = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    
    if (selectedRows.length === 0) {
      toast({
        title: "Vui lòng chọn ít nhất một câu hỏi để xóa",
        variant: "error",
      });
      return;
    }

    setDeleteModalOpen(true);
  };

  // Confirm bulk delete - actual deletion logic
  const confirmBulkDelete = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedIds = selectedRows.map(row => row.original.id);

    try {
      await batchDeleteQuestions(selectedIds);
      
      // Refresh data
      const updatedQuestions = await getAllQuestions();
      dispatch(setQuestions(updatedQuestions));
      
      // Clear selection
      setRowSelection({});
      
      toast({
        title: `Đã xóa thành công ${selectedIds.length} câu hỏi`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error && error.message 
        ? error.message
        : 'Error deleting questions';
      toast({
        title: errorMessage,
        variant: 'error',
      });
      throw error; // Re-throw to let modal handle it
    }
  };

  // Create table instance
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      columnVisibility,
      sorting,
      pagination,
      rowSelection,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    initialState: { pagination },
  });

  const { pageIndex, pageSize: currentSize } = table.getState().pagination;
  const totalPages = table.getPageCount();
  const firstRow = pageIndex * currentSize + 1;
  const lastRow = Math.min((pageIndex + 1) * currentSize, filteredData.length);

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
    select: "Chọn",
    questionText: "Nội dung câu hỏi",
    subjectId: "Môn học", 
    difficultyLevel: "Độ khó",
    totalAnswers: "Số câu trả lời",
    actions: "Thao tác",
  };

  // Difficulty options
  const difficultyOptions = [
    { value: "dễ", label: "Dễ" },
    { value: "trung bình", label: "Trung bình" },
    { value: "khó", label: "Khó" },
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
              placeholder="Tìm kiếm câu hỏi..."
              value={inputValue}
              onChange={handleSearchChange}
            />
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Bulk Delete Button */}
            {hasPermission(permissions, 'question:delete') && Object.keys(rowSelection).length > 0 && (
              <Button 
                variant="destructive"
                className="flex items-center gap-2 cursor-pointer" 
                onClick={handleBulkDelete}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4" />
                Xóa ({Object.keys(rowSelection).length})
              </Button>
            )}
            
            {hasPermission(permissions, 'question:create') && (
              <Button 
                className="bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-2 cursor-pointer" 
                onClick={() => router.push('/dashboard/question/create')}
              >
                <span className="text-lg">+</span>
                Thêm câu hỏi
              </Button>
            )}
          </div>
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

            {/* Difficulty Filter */}
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Độ khó" />
              </SelectTrigger>
              <SelectContent className="cursor-pointer">
                <SelectItem value="all">Tất cả độ khó</SelectItem>
                {difficultyOptions.map((option) => (
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
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                <FilterX className="h-4 w-4" />
                Xóa bộ lọc
              </Button>
            )}
          </div>

          {/* Actions Group */}
          <div className="flex flex-wrap gap-2">
            {/* Reload Button */}
            <ReloadButton 
              onReload={handleReload}
              isLoading={isReloading}
              disabled={isLoading}
            />
            
            {/* Help Button */}
            <TabbedHelpModal 
              featureName="Quản lý Câu hỏi" 
              entityName="câu hỏi"
              permissions={questionPermissions}
              detailedInstructions={questionInstructions}
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
            {hasPermission(permissions, 'question:create') && (
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

      {/* Modals */}
      <QuestionImportFileModal open={open} setOpen={setOpen} fileType={fileType} handleImport={handleImport}/>
      
      <BulkDeleteConfirmModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        selectedCount={Object.keys(rowSelection).length}
        onConfirm={confirmBulkDelete}
        isLoading={isLoading}
      />

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <span className="font-medium">Kết quả lọc:</span>
          <span>{filteredData.length} / {questions.length} câu hỏi</span>
          {subjectFilter !== "all" && (
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
              Môn: {subjects.find(s => s.id.toString() === subjectFilter)?.name || subjectFilter}
            </span>
          )}
          {difficultyFilter !== "all" && (
            <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded text-xs">
              Độ khó: {difficultyFilter}
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
                    Không có dữ liệu câu hỏi.
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

export const QuestionTable = memo(QuestionTableComponent); 