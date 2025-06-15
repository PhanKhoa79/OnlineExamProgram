"use client";

import { useState, useEffect, useRef, useCallback, useMemo} from "react";
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store"; 
import { DataTable } from "../../../components/ui/data-table";
import { classColumns } from "@/features/classes/components/column";
import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";
import { getAllClasses } from "@/features/classes/services/classServices";
import { useSearchFilter } from "@/hooks/useSearchFilter";
import { useTableReload } from "@/hooks/useTableReload";
import { ReloadButton } from "@/components/ui/ReloadButton";
import { ClassResponseDto } from "@/features/classes/types/class.type";
import { setClasses } from "@/store/classSlice";
import { useAuthStore } from "@/features/auth/store"; 
import { hasPermission } from "@/lib/permissions"; 
import { toast } from "@/components/hooks/use-toast";
import SearchBar from "@/components/ui/SearchBar";
import { TabbedHelpModal } from "@/components/ui/TabbedHelpModal";
import { classInstructions, classPermissions } from "@/features/classes/data/classInstructions";

export function ClassTable() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Track if data has been fetched to prevent duplicate calls
  const hasFetchedData = useRef(false);

  const classes = useSelector((state: RootState) => state.class.classes);
  const permissions = useAuthStore((state) => state.permissions);
  const dispatch = useDispatch<AppDispatch>();

  const fetchClasses = useCallback(async () => {
    try {
      const data = await getAllClasses();
      dispatch(setClasses(data));
      hasFetchedData.current = true;
    } catch (error) {
      console.error("Failed to fetch classes", error);
      throw error;
    }
  }, [dispatch]);

  // Fetch data only once on mount - no dependencies at all
  useEffect(() => {
    if (hasFetchedData.current) return;
    
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchClasses();
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchClasses]);

  const { isReloading, handleReload } = useTableReload({
    onReload: fetchClasses,
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

  const memoizedClasses = useMemo(() => classes || [], [classes]);

  // Memoize search keys to prevent recreation
  const searchKeys = useMemo(() => ["name", "code"] as (keyof ClassResponseDto)[], []);

  const {
    inputValue,
    setInputValue,
    filteredData,
  } = useSearchFilter(memoizedClasses, searchKeys);

  const handleSearchChange = useCallback((value: string) => {
    setInputValue(value);
  }, [setInputValue]);

  const clearFilters = useCallback(() => {
    setInputValue("");
  }, [setInputValue]);

  const hasActiveFilters = inputValue !== "";

  return (
    <div className="flex flex-col gap-4 container mx-auto py-6">
      <div className="flex flex-col gap-4 justify-between lg:flex-row">
        <SearchBar
          placeholder="Tìm kiếm lớp học..."
          value={inputValue}
          onChange={handleSearchChange}
        />
        <div className="flex flex-wrap justify-center gap-4 lg:justify-end">
          {/* Reload Button */}
          <ReloadButton 
            onReload={handleReload}
            isLoading={isReloading}
            disabled={isLoading}
          />
          
          {/* Help Button */}
          <TabbedHelpModal 
            featureName="Quản lý Lớp học" 
            entityName="lớp học"
            permissions={classPermissions}
            detailedInstructions={classInstructions}
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
          
          {hasPermission(permissions, 'class:create') && (
            <Button className="bg-blue-500 text-white hover:bg-blue-800 cursor-pointer" onClick={() => router.push('/dashboard/class/create')}>
              + Thêm lớp học
            </Button> 
          )}
        </div>
      </div>

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Đang hiển thị {filteredData.length} trong tổng số {classes.length} lớp học</span>
          {inputValue && (
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
              Tìm kiếm: &quot;{inputValue}&quot;
            </span>
          )}
        </div>
      )}

      <DataTable<ClassResponseDto, unknown>
        columns={classColumns()}
        data={filteredData}
        isLoading={isLoading}
      />
    </div>
  );
}
