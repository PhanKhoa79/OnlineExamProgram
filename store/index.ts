import { configureStore } from '@reduxjs/toolkit'
import accountReducer from './accountSlice'
import studentReducer from './studentSlice'
import roleReducer from './roleSlice'

export const store = configureStore({
  reducer: {
    account: accountReducer,
    student: studentReducer,
    role: roleReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
