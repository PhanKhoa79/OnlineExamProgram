import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SubjectResponseDto } from '@/features/subject/types/subject';

interface SubjectState {
  subjects: SubjectResponseDto[];
}

const initialState: SubjectState = {
  subjects: [],
}

const subjectSlice = createSlice({
  name: 'subject',
  initialState,
  reducers: {
    setSubjects: (state, action: PayloadAction<SubjectResponseDto[]>) => {
      state.subjects = action.payload;
    },
    addSubject: (state, action: PayloadAction<SubjectResponseDto>) => {
      state.subjects.unshift(action.payload);
    },
    updateSubject: (state, action: PayloadAction<SubjectResponseDto>) => {
      const index = state.subjects.findIndex(s => s.id === action.payload.id);
      if (index !== -1) state.subjects[index] = action.payload;
    },
    removeSubject: (state, action: PayloadAction<number>) => {
      state.subjects = state.subjects.filter(s => s.id !== action.payload);
    },
  }
});

export const { setSubjects, addSubject, updateSubject, removeSubject } = subjectSlice.actions;
export default subjectSlice.reducer; 