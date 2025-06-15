import { configureStore } from '@reduxjs/toolkit'
import accountReducer from './accountSlice'
import studentReducer from './studentSlice'
import roleReducer from './roleSlice'
import classReducer from './classSlice'
import subjectReducer from './subjectSlice'
import questionReducer from './questionSlice'
import examReducer from './examSlice'
import scheduleReducer from './scheduleSlice'
import notificationReducer from './notificationSlice'

export const store = configureStore({
  reducer: {
    account: accountReducer,
    student: studentReducer,
    role: roleReducer,
    class: classReducer,
    subject: subjectReducer,
    question: questionReducer,
    exam: examReducer,
    schedule: scheduleReducer,
    notification: notificationReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
