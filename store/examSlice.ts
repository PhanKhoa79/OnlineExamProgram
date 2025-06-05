import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ExamDto } from '@/features/exam/types/exam.type';

interface ExamState {
  exams: ExamDto[];
}

const initialState: ExamState = {
  exams: [],
}

const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    setExams: (state, action: PayloadAction<ExamDto[]>) => {
      state.exams = action.payload;
    },
    addExam: (state, action: PayloadAction<ExamDto>) => {
      state.exams.unshift(action.payload);
    },
    updateExam: (state, action: PayloadAction<ExamDto>) => {
      const index = state.exams.findIndex(e => e.id === action.payload.id);
      if (index !== -1) state.exams[index] = action.payload;
    },
    removeExam: (state, action: PayloadAction<number>) => {
      state.exams = state.exams.filter(e => e.id !== action.payload);
    },
  }
});

export const { setExams, addExam, updateExam, removeExam } = examSlice.actions;
export default examSlice.reducer; 