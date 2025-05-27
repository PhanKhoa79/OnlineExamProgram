import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StudentDto } from '@/features/student/types/student';
interface StudentState {
  students: StudentDto[];
  selectedIds: number[];
}

const initialState: StudentState = {
  students: [],
  selectedIds: [],
}

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setStudents: (state, action: PayloadAction<StudentDto[]>) => {
      state.students = action.payload;
    },
    addStudent: (state, action: PayloadAction<StudentDto>) => {
      state.students.unshift(action.payload);
    },
    updateStudent: (state, action: PayloadAction<StudentDto>) => {
      const index = state.students.findIndex(a => a.id === action.payload.id);
      if (index !== -1) state.students[index] = action.payload;
    },
    deleteStudent: (state, action: PayloadAction<number>) => {
      state.students = state.students.filter(a => a.id !== action.payload);
    },
    deleteStudents: (state, action: PayloadAction<number[]>) => {
      const idsToDelete = action.payload;
      state.students = state.students.filter(a => !idsToDelete.includes(a.id));
      state.students = [];
    },
    setSelectedIds: (state, action: PayloadAction<number[]>) => {
      state.selectedIds = action.payload;
    },
    clearSelectedIds: (state) => {
      state.selectedIds = [];
    },
  }
});

export const { setStudents, addStudent, updateStudent, deleteStudent, deleteStudents, setSelectedIds, clearSelectedIds } = studentSlice.actions;
export default studentSlice.reducer;
