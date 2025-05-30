"use client";

import { useState, useEffect} from "react";
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store"; 
import { DataTable } from "../../../components/ui/data-table";
import { roleColumns } from "@/features/role/components/column";
import { Button } from "@/components/ui/button";
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

  const roles = useSelector((state: RootState) => state.role.roles);

  const permissions = useAuthStore((state) => state.permissions);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const data = await getAllRolesWithPermissions();
        dispatch(setRoles(data));
      } catch (error) {
        console.error("Failed to fetch accounts", error);
      }  finally {
      setIsLoading(false);
      }
    };

    fetchRole();
  }, [dispatch]);

  const {
    inputValue,
    setInputValue,
    filteredData,
  } = useSearchFilter(roles, ["name"]);


  return (
    <div className="flex flex-col gap-4 container mx-auto py-6">
      <div className="flex flex-col gap-4 justify-between lg:flex-row">
        <SearchBar
          placeholder="Tìm kiếm quyền..."
          value={inputValue}
          onChange={setInputValue}
        />
        {hasPermission(permissions, 'role:create') && (
          <div className="flex flex-wrap justify-center gap-4 lg:justify-end">
            <Button className="grow bg-blue-500 text-white hover:bg-blue-800 cursor-pointer" onClick={() => router.push('/dashboard/role/add-role')}>
              + Thêm quyền
            </Button> 
        </div>
        )}
      </div>

      <DataTable<RoleWithPermissionsDto, any>
        columns={roleColumns(dispatch)}
        data={filteredData}
        isLoading={isLoading}
      />
    </div>
  );
}
