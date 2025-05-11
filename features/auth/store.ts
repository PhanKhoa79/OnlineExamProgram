import { create } from 'zustand'

interface ResetPasswordState {
  email: string
  code: string
  setResetInfo: (email: string, code: string) => void
}

export const useResetPasswordStore = create<ResetPasswordState>((set) => ({
  email: '',
  code: '',
  setResetInfo: (email, code) => set({ email, code }),
}))
