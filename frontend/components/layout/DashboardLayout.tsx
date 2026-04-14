'use client'

import { ReactNode, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/stores/authStore'
import { Menu, X, LogOut, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

interface Tab {
  name: string
  href: string
}

interface DashboardLayoutProps {
  children: ReactNode
  tabs: Tab[]
  activeTab: string
}

export default function DashboardLayout({ children, tabs, activeTab }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-primary dark:bg-gray-800 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden mr-4"
              >
                {sidebarOpen ? <X /> : <Menu />}
              </button>
              <h1 className="text-xl font-bold">BytesDoc</h1>
            </div>
            
            <div className="hidden md:flex space-x-4">
              {tabs.map((tab) => (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`px-3 py-2 rounded-md ${
                    activeTab === tab.name
                      ? 'bg-accent'
                      : 'hover:bg-accent/50'
                  }`}
                >
                  {tab.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 hover:bg-accent rounded-lg"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <span className="text-sm">{user?.fullName}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 hover:bg-accent px-3 py-2 rounded-lg"
              >
                <LogOut size={20} />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {sidebarOpen && (
        <div className="md:hidden bg-primary dark:bg-gray-800 text-white">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className={`block px-3 py-2 rounded-md ${
                  activeTab === tab.name
                    ? 'bg-accent'
                    : 'hover:bg-accent/50'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                {tab.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
