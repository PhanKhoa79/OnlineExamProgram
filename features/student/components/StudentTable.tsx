"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store"; 
import { DataTable } from "@/components/ui/data-table";
import { studentColumns } from "./column";
import { Input } from "@/components/ui/input";
import { getListStudentWithoutAccount } from "@/features/student/services/studentService";
import { StudentDto } from "@/features/student/types/student";
import { setStudents } from "@/store/studentSlice";
import { useSearchFilter } from "@/hooks/useSearchFilter";


export function StudentTable() {

  const [isLoading, setIsLoading] = useState(true);

  const students = useSelector((state: RootState) => state.student.students);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getListStudentWithoutAccount();
        dispatch(setStudents(data));
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sinh viên", error);
      }  finally {
      setIsLoading(false);
      }
    };

    fetchStudents();
  }, [dispatch]);
  
  const {
      inputValue,
      setInputValue,
      filteredData,
  } = useSearchFilter(students, ["email", "studentCode", "fullName"]);

  return (
    <div className="flex flex-col gap-4 container mx-auto py-6">
        <Input
          type="text"
          placeholder="Tìm kiếm sinh viên..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="max-w-screen lg:max-w-sm"
        />

      <DataTable<StudentDto, any>
        columns={studentColumns(dispatch)}
        data={filteredData}
        isLoading={isLoading}
      />
    </div>  
  );
}
