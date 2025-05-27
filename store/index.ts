import { configureStore } from '@reduxjs/toolkit'
import accountReducer from './accountSlice'
import studentReducer from './studentSlice'

export const store = configureStore({
  reducer: {
    account: accountReducer,
    student: studentReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
