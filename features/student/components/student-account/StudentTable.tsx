"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store"; 
import { DataTable } from "@/components/ui/data-table";
import { studentColumns } from "./column";
import SearchBar from "@/components/ui/SearchBar";
import { getListStudentWithoutAccount } from "@/features/student/services/studentService";
import { StudentDto } from "@/features/student/types/student";
import { setStudents } from "@/store/studentSlice";
import { useSearchFilter } from "@/hooks/useSearchFilter";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function StudentTable() {
  const [isLoading, setIsLoading] = useState(true);

  // Track if data has been fetched to prevent duplicate calls
  const hasFetchedData = useRef(false);

  const students = useSelector((state: RootState) => state.student.students);
  const dispatch = useDispatch<AppDispatch>();

  // Function to fetch students data
  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const data = await getListStudentWithoutAccount();
      dispatch(setStudents(data));
      hasFetchedData.current = true;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sinh viên", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetchedData.current) return;
    fetchStudents();
  }, []); 

  // Handle refresh button click
  const handleRefresh = () => {
    hasFetchedData.current = false; 
    fetchStudents();
  };

  const memoizedStudents = useMemo(() => students || [], [students]);

  const searchKeys = useMemo(() => ["email", "studentCode", "fullName"] as (keyof StudentDto)[], []);
  
  const {
    inputValue,
    setInputValue,
    filteredData,
  } = useSearchFilter(memoizedStudents, searchKeys);

  // Optimize search input handler to prevent unnecessary re-renders
  const handleSearchChange = useCallback((value: string) => {
    setInputValue(value);
  }, [setInputValue]);

  return (
    <div className="flex flex-col gap-4 container mx-auto py-6">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <SearchBar
            placeholder="Tìm kiếm sinh viên..."
            value={inputValue}
            onChange={handleSearchChange}
          />
        </div>
        <Button 
          onClick={handleRefresh}
          variant="outline"
          size="icon"
          className="h-10 w-10"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <DataTable<StudentDto, unknown>
        columns={studentColumns(dispatch)}
        data={filteredData}
        isLoading={isLoading}
      />
    </div>  
  );
}
