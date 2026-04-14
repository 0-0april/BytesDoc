import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'
import { mockUsers } from '@/lib/mockData'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email: string, password: string) => {
        const user = mockUsers.find((u) => u.email === email)
        if (user) {
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
)
