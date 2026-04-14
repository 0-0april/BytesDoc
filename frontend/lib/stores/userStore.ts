import { create } from 'zustand'
import { User } from '@/types'
import { mockUsers } from '@/lib/mockData'

interface UserState {
  users: User[]
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void
  updateUserRole: (id: string, role: User['role']) => void
}

export const useUserStore = create<UserState>((set) => ({
  users: mockUsers,
  addUser: (user) =>
    set((state) => ({
      users: [
        ...state.users,
        {
          ...user,
          id: `${Date.now()}`,
          createdAt: new Date().toISOString(),
        },
      ],
    })),
  updateUserRole: (id, role) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, role } : user
      ),
    })),
}))
