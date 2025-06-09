"use client";

import { useState, useEffect, useRef, useCallback, useMemo} from "react";
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store"; 
import { DataTable } from "../../../components/ui/data-table";
import { subjectColumns } from "@/features/subject/components/column";
import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";
import { getAllSubjects } from "@/features/subject/services/subjectServices";
import { useSearchFilter } from "@/hooks/useSearchFilter";
import { SubjectResponseDto } from "@/features/subject/types/subject";
import { setSubjects } from "@/store/subjectSlice";
import { useAuthStore } from "@/features/auth/store"; 
import { hasPermission } from "@/lib/permissions"; 
import SearchBar from "@/components/ui/SearchBar";
import { TabbedHelpModal } from "@/components/ui/TabbedHelpModal";
import { subjectInstructions, subjectPermissions } from "@/features/subject/data/subjectInstructions";

export function SubjectTable() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Track if data has been fetched to prevent duplicate calls
  const hasFetchedData = useRef(false);

  const subjects = useSelector((state: RootState) => state.subject.subjects);
  const permissions = useAuthStore((state) => state.permissions);
  const dispatch = useDispatch<AppDispatch>();

  // Fetch data only once on mount - no dependencies at all
  useEffect(() => {
    if (hasFetchedData.current) return;
    
    const fetchSubjects = async () => {
      try {
        setIsLoading(true);
        const data = await getAllSubjects();
        dispatch(setSubjects(data));
        hasFetchedData.current = true;
      } catch (error) {
        console.error("Failed to fetch subjects", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Explicitly ignore dispatch dependency to prevent loops

  // Memoize subjects to prevent unnecessary re-calculations
  const memoizedSubjects = useMemo(() => subjects || [], [subjects]);

  // Memoize search keys to prevent recreation
  const searchKeys = useMemo(() => ["name", "code", "description"] as (keyof SubjectResponseDto)[], []);

  const {
    inputValue,
    setInputValue,
    filteredData,
  } = useSearchFilter(memoizedSubjects, searchKeys);

  // Optimize search input handler to prevent unnecessary re-renders
  const handleSearchChange = useCallback((value: string) => {
    setInputValue(value);
  }, [setInputValue]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setInputValue("");
  }, [setInputValue]);

  // Check if any filters are active
  const hasActiveFilters = inputValue !== "";

  return (
    <div className="flex flex-col gap-4 container mx-auto py-6">
      <div className="flex flex-col gap-4 justify-between lg:flex-row">
        <SearchBar
          placeholder="Tìm kiếm môn học..."
          value={inputValue}
          onChange={handleSearchChange}
        />
        <div className="flex flex-wrap justify-center gap-4 lg:justify-end">
          {/* Help Button */}
          <TabbedHelpModal 
            featureName="Quản lý Môn học" 
            entityName="môn học"
            permissions={subjectPermissions}
            detailedInstructions={subjectInstructions}
          />
          
          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="flex items-center gap-2 cursor-pointer"
            >
              <FilterX className="h-4 w-4" />
              Xóa bộ lọc
            </Button>
          )}
          
          {hasPermission(permissions, 'subject:create') && (
            <Button className="bg-blue-500 text-white hover:bg-blue-800 cursor-pointer" onClick={() => router.push('/dashboard/subject/create')}>
              + Thêm môn học
            </Button> 
          )}
        </div>
      </div>

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Đang hiển thị {filteredData.length} trong tổng số {subjects.length} môn học</span>
          {inputValue && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
              Tìm kiếm: &quot;{inputValue}&quot;
            </span>
          )}
        </div>
      )}

      <DataTable<SubjectResponseDto, unknown>
        columns={subjectColumns()}
        data={filteredData}
        isLoading={isLoading}
      />
    </div>
  );
} 