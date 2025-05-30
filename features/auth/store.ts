import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ResetPasswordState {
  email: string
  code: string
  setResetInfo: (email: string, code: string) => void
}

interface Role {
  id: number
  name: string
}

interface User {
  id: number
  accountname: string
  email: string
  role: Role
  permissions: {
    name: string
    permissions: string[]
  }
}

interface AuthState {
  user: User | null
  permissions: string[]
  setAuthInfo: (user: User) => void
  clearAuthInfo: () => void
}

// ✅ Persist hóa store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      permissions: [],
      setAuthInfo: (user) =>
        set({
          user,
          permissions: user.permissions?.permissions ?? []
        }),
      clearAuthInfo: () =>
        set({
          user: null,
          permissions: []
        }),  
    }),
    {
      name: 'auth-store', // Tên key trong localStorage
      partialize: (state) => ({
        user: state.user,
        permissions: state.permissions
      }),
    }
  )
)

export const useResetPasswordStore = create<ResetPasswordState>((set) => ({
  email: '',
  code: '',
  setResetInfo: (email, code) => set({ email, code }),
}))
