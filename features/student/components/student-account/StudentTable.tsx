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

export function StudentTable() {
  const [isLoading, setIsLoading] = useState(true);

  // Track if data has been fetched to prevent duplicate calls
  const hasFetchedData = useRef(false);

  const students = useSelector((state: RootState) => state.student.students);
  const dispatch = useDispatch<AppDispatch>();

  // Fetch data only once on mount - no dependencies at all
  useEffect(() => {
    if (hasFetchedData.current) return;
    
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

    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Explicitly ignore dispatch dependency to prevent loops

  // Memoize students to prevent unnecessary re-calculations
  const memoizedStudents = useMemo(() => students || [], [students]);

  // Memoize search keys to prevent recreation  
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
      <SearchBar
        placeholder="Tìm kiếm sinh viên..."
        value={inputValue}
        onChange={handleSearchChange}
      />

      <DataTable<StudentDto, unknown>
        columns={studentColumns(dispatch)}
        data={filteredData}
        isLoading={isLoading}
      />
    </div>  
  );
}
