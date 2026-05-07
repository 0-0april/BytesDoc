'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'
import { mockUsers } from '@/lib/mockData'
import { apiLogin, apiLogout, apiHealthCheck } from '@/lib/api'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  usingMock: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      usingMock: false,

      login: async (email: string, password: string) => {
        const backendUp = await apiHealthCheck()

        if (backendUp) {
          try {
            const { user, token } = await apiLogin(email, password)
            set({ user, token, isAuthenticated: true, usingMock: false })
            return true
          } catch {
            // Backend up but login failed (Supabase not configured yet)
            // Fall through to mock fallback
          }
        }

        // Mock fallback
        const mockUser = mockUsers.find((u) => u.email === email)
        if (mockUser) {
          set({ user: mockUser, token: null, isAuthenticated: true, usingMock: true })
          return true
        }
        return false
      },

      logout: async () => {
        if (!get().usingMock && get().token) {
          try { await apiLogout() } catch {}
        }
        set({ user: null, token: null, isAuthenticated: false, usingMock: false })
      },

      setUser: (user: User) => set({ user }),
    }),
    { name: 'auth-storage' }
  )
)