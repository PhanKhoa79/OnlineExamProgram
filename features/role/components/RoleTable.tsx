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
import { RoleWithPermissionsDto } from '@/features/role/types/role'; 
import { setRoles } from "@/store/roleSlice";
import { useAuthStore } from "@/features/auth/store"; 
import { hasPermission } from "@/lib/permissions"; 
import SearchBar from "@/components/ui/SearchBar";

export function RoleTable() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Track if data has been fetched to prevent duplicate calls
  const hasFetchedData = useRef(false);

  const roles = useSelector((state: RootState) => state.role.roles);
  const permissions = useAuthStore((state) => state.permissions);
  const dispatch = useDispatch<AppDispatch>();

  // Fetch data only once on mount - no dependencies at all
  useEffect(() => {
    if (hasFetchedData.current) return;
    
    const fetchRole = async () => {
      try {
        setIsLoading(true);
        const data = await getAllRolesWithPermissions();
        dispatch(setRoles(data));
        hasFetchedData.current = true;
      } catch (error) {
        console.error("Failed to fetch roles", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Explicitly ignore dispatch dependency to prevent loops

  // Memoize roles to prevent unnecessary re-calculations
  const memoizedRoles = useMemo(() => roles || [], [roles]);

  // Memoize search keys to prevent recreation
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
          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <FilterX className="h-4 w-4" />
              Xóa bộ lọc
            </Button>
          )}
          
          {hasPermission(permissions, 'role:create') && (
            <Button className="bg-blue-500 text-white hover:bg-blue-800 cursor-pointer" onClick={() => router.push('/dashboard/role/create')}>
              + Thêm quyền
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
