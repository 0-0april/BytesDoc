import { create } from 'zustand'
import { ActivityLog } from '@/types'
import { mockActivityLogs } from '@/lib/mockData'

interface ActivityState {
  logs: ActivityLog[]
  addLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void
}

export const useActivityStore = create<ActivityState>((set) => ({
  logs: mockActivityLogs,
  addLog: (log) =>
    set((state) => ({
      logs: [
        ...state.logs,
        {
          ...log,
          id: `${Date.now()}`,
          timestamp: new Date().toISOString(),
        },
      ],
    })),
}))
