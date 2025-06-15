"use client";

import { useState, useEffect, useRef, useCallback, useMemo} from "react";
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store"; 
import { DataTable } from "../../../components/ui/data-table";
import { roleColumns } from "@/features/role/components/column";
import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";
import { getAllRolesWithPermissions } from "@/features/role/services/roleServices";
import { useSearchFilter } from "@/hooks/useSearchFilter";
import { useTableReload } from "@/hooks/useTableReload";
import { ReloadButton } from "@/components/ui/ReloadButton";
import { RoleWithPermissionsDto } from '@/features/role/types/role'; 
import { setRoles } from "@/store/roleSlice";
import { useAuthStore } from "@/features/auth/store"; 
import { hasPermission } from "@/lib/permissions"; 
import { toast } from "@/components/hooks/use-toast";
import SearchBar from "@/components/ui/SearchBar";
import { TabbedHelpModal } from "@/components/ui/TabbedHelpModal";
import { roleInstructions, rolePermissions } from "@/features/role/data/roleInstructions";

export function RoleTable() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const hasFetchedData = useRef(false);

  const roles = useSelector((state: RootState) => state.role.roles);
  const permissions = useAuthStore((state) => state.permissions);
  const dispatch = useDispatch<AppDispatch>();

  const fetchRole = useCallback(async () => {
    try {
      const data = await getAllRolesWithPermissions();
      dispatch(setRoles(data));
      hasFetchedData.current = true;
    } catch (error) {
      console.error("Failed to fetch roles", error);
      throw error;
    }
  }, [dispatch]);

  useEffect(() => {
    if (hasFetchedData.current) return;
    
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchRole();
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchRole]);

  const { isReloading, handleReload } = useTableReload({
    onReload: fetchRole,
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

  const memoizedRoles = useMemo(() => roles || [], [roles]);

  const searchKeys = useMemo(() => ["name"] as (keyof RoleWithPermissionsDto)[], []);

  const {
    inputValue,
    setInputValue,
    filteredData,
  } = useSearchFilter(memoizedRoles, searchKeys);

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
          placeholder="Tìm kiếm quyền..."
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
            featureName="Quản lý Vai trò" 
            entityName="vai trò"
            permissions={rolePermissions}
            detailedInstructions={roleInstructions}
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
          
          {hasPermission(permissions, 'role:create') && (
            <Button className="bg-blue-500 text-white hover:bg-blue-800 cursor-pointer" onClick={() => router.push('/dashboard/role/create')}>
              + Thêm vai trò
            </Button> 
          )}
        </div>
      </div>

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Đang hiển thị {filteredData.length} trong tổng số {roles.length} quyền</span>
          {inputValue && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
              Tìm kiếm: &quot;{inputValue}&quot;
            </span>
          )}
        </div>
      )}

      <DataTable<RoleWithPermissionsDto, unknown>
        columns={roleColumns()}
        data={filteredData}
        isLoading={isLoading}
      />
    </div>
  );
}
