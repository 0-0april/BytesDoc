'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/authStore'
import { useActivityStore } from '@/lib/stores/activityStore'
import Button from '@/components/ui/Button'
import { ChevronDown, FileLock2 } from 'lucide-react'

const DEMO_ACCOUNTS = [
  { role: 'Chief Minister', email: 'admin@bytes.com', password: 'admin123' },
  { role: 'Secretary', email: 'secretary@bytes.com', password: 'secretary123' },
  { role: 'Finance', email: 'finance@bytes.com', password: 'finance12' },
  { role: 'Member', email: 'member@bytes.com', password: 'member123' },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDemo, setShowDemo] = useState(false)
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const addLog = useActivityStore((state) => state.addLog)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const success = await login(email, password)
      if (success) {
        const user = useAuthStore.getState().user
        if (user) {
          addLog({ userId: user.id, action: 'login' })
          const roleRoutes = {
            chief_minister: '/dashboard/admin',
            secretary: '/dashboard/secretary',
            finance_minister: '/dashboard/finance',
            member: '/dashboard/member',
          }
          router.push(roleRoutes[user.role])
        }
      } else {
        setError('Invalid credentials')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const fillDemo = (acc: typeof DEMO_ACCOUNTS[number]) => {
    setEmail(acc.email)
    setPassword(acc.password)
    setError('')
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary via-accent to-primary dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="pointer-events-none absolute -top-40 -left-20 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="block text-center text-sm text-white/70 hover:text-white transition mb-4"
        >
          &larr; Back to home
        </Link>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-elevated">
          <div className="flex flex-col items-center mb-6">
            <div className="rounded-2xl bg-primary/10 dark:bg-white/10 p-3 mb-3">
              <FileLock2 className="w-7 h-7 text-primary dark:text-white" />
            </div>
            <h1 className="text-2xl font-bold text-primary dark:text-white">
              BytesDoc Login
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Sign in with your council account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none dark:bg-gray-700 dark:text-white"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none dark:bg-gray-700 dark:text-white"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <Button type="submit" isLoading={isSubmitting} className="w-full">
              {isSubmitting ? 'Signing in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-6 border-t dark:border-gray-700 pt-4">
            <button
              type="button"
              onClick={() => setShowDemo(s => !s)}
              className="w-full flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition"
            >
              <span>Demo credentials</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${showDemo ? 'rotate-180' : ''}`}
              />
            </button>
            {showDemo && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map(acc => (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => fillDemo(acc)}
                    className="text-left text-xs p-2 rounded-md border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    <div className="font-semibold text-gray-900 dark:text-white">{acc.role}</div>
                    <div className="text-gray-500 dark:text-gray-400 truncate">{acc.email}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
