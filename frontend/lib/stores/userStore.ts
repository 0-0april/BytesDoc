'use client'
import { create } from 'zustand'
import { User } from '@/types'
import { mockUsers } from '@/lib/mockData'
import { apiGetUsers, apiUpdateUserRole } from '@/lib/api'
import { useAuthStore } from './authStore'

interface UserState {
  users: User[]
  loading: boolean
  fetchUsers: () => Promise<void>
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void          // mock-only (invite flow needs Supabase auth)
  updateUserRole: (id: string, role: User['role']) => Promise<void>
}

export const useUserStore = create<UserState>((set, get) => ({
  users: mockUsers,
  loading: false,

  fetchUsers: async () => {
    const { usingMock } = useAuthStore.getState()
    if (usingMock) {
      set({ users: mockUsers })
      return
    }

    set({ loading: true })
    try {
      const users = await apiGetUsers()
      set({ users, loading: false })
    } catch {
      set({ users: [], loading: false })
    }
  },

  addUser: (user) =>
    set(state => ({
      users: [
        ...state.users,
        { ...user, id: `${Date.now()}`, createdAt: new Date().toISOString() },
      ],
    })),

  updateUserRole: async (id, role) => {
    const { usingMock } = useAuthStore.getState()
    // Optimistic
    set(state => ({
      users: state.users.map(u => u.id === id ? { ...u, role } : u),
    }))
    if (usingMock) return

    try {
      const updated = await apiUpdateUserRole(id, role)
      set(state => ({
        users: state.users.map(u => u.id === id ? updated : u),
      }))
    } catch {
      await get().fetchUsers()
    }
  },
}))