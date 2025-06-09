import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ExamScheduleDto } from '@/features/schedule/types/schedule';

interface ScheduleState {
  schedules: ExamScheduleDto[];
}

const initialState: ScheduleState = {
  schedules: [],
}

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setSchedules: (state, action: PayloadAction<ExamScheduleDto[]>) => {
      state.schedules = action.payload;
    },
    addSchedule: (state, action: PayloadAction<ExamScheduleDto>) => {
      state.schedules.unshift(action.payload);
    },
    updateSchedule: (state, action: PayloadAction<ExamScheduleDto>) => {
      const index = state.schedules.findIndex(s => s.id === action.payload.id);
      if (index !== -1) state.schedules[index] = action.payload;
    },
    removeSchedule: (state, action: PayloadAction<number>) => {
      state.schedules = state.schedules.filter(s => s.id !== action.payload);
    },
  }
});

export const { setSchedules, addSchedule, updateSchedule, removeSchedule } = scheduleSlice.actions;
export default scheduleSlice.reducer; 