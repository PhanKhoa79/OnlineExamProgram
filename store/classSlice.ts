import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ClassResponseDto } from '@/features/classes/types/class.type';
interface ClassState {
  classes: ClassResponseDto[];

}

const initialState: ClassState = {
  classes: [],
}

const classSlice = createSlice({
  name: 'class',
  initialState,
  reducers: {
    setClasses: (state, action: PayloadAction<ClassResponseDto[]>) => {
      state.classes = action.payload;
    },
    addClass: (state, action: PayloadAction<ClassResponseDto>) => {
      state.classes.unshift(action.payload);
    },
    updateClass: (state, action: PayloadAction<ClassResponseDto>) => {
      const index = state.classes.findIndex(a => a.name === action.payload.name);
      if (index !== -1) state.classes[index] = action.payload;
    },
  }
});

export const { setClasses, addClass, updateClass } = classSlice.actions;
export default classSlice.reducer;
