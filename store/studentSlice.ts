import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StudentDto } from '@/features/student/types/student';

interface StudentState {
  students: StudentDto[];
  loading: boolean;
  error: string | null;
  selectedIds: number[];
}

const initialState: StudentState = {
  students: [],
  loading: false,
  error: null,
  selectedIds: [],
}

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setStudents: (state, action: PayloadAction<StudentDto[]>) => {
      state.students = action.payload;
      state.loading = false;
      state.error = null;
    },
    addStudent: (state, action: PayloadAction<StudentDto>) => {
      state.students.push(action.payload);
    },
    updateStudent: (state, action: PayloadAction<StudentDto>) => {
      const index = state.students.findIndex(student => student.id === action.payload.id);
      if (index !== -1) {
        state.students[index] = action.payload;
      }
    },
    removeStudent: (state, action: PayloadAction<number>) => {
      state.students = state.students.filter(student => student.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSelectedIds: (state, action: PayloadAction<number[]>) => {
      state.selectedIds = action.payload;
    },
    clearSelectedIds: (state) => {
      state.selectedIds = [];
    },
  }
});

export const {
  setStudents,
  addStudent,
  updateStudent,
  removeStudent,
  setLoading,
  setError,
  setSelectedIds,
  clearSelectedIds,
} = studentSlice.actions;

export default studentSlice.reducer;
