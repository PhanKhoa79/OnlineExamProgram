import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QuestionDto } from "@/features/question/types/question.type";

interface QuestionState {
  questions: QuestionDto[];
}

const initialState: QuestionState = {
  questions: [],
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<QuestionDto[]>) => {
      state.questions = action.payload;
    },
    addQuestion: (state, action: PayloadAction<QuestionDto>) => {
      state.questions.push(action.payload);
    },
    updateQuestion: (state, action: PayloadAction<QuestionDto>) => {
      const index = state.questions.findIndex(question => question.id === action.payload.id);
      if (index !== -1) {
        state.questions[index] = action.payload;
      }
    },
    deleteQuestion: (state, action: PayloadAction<number>) => {
      state.questions = state.questions.filter(question => question.id !== action.payload);
    },
  },
});

export const { setQuestions, addQuestion, updateQuestion, deleteQuestion } = questionSlice.actions;
export default questionSlice.reducer; 