'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuthStore } from '@/lib/stores/authStore'
import { useActivityStore } from '@/lib/stores/activityStore'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const addLog = useActivityStore((state) => state.addLog)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const success = login(email, password)
    
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
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 overflow-hidden bg-[#e5e5e5]">
      
      <div className="absolute inset-0 z-0">
        <Image 
          src="/graybg1.jpg" 
          alt="Background" 
          fill 
          className="object-cover opacity-60" 
          priority
        />
      </div>

      <div className="relative z-10 bg-[#1e1e1ec2] backdrop-blur-xl p-10 rounded-2xl shadow-2xl max-w-md w-full border border-white/10">
        
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4">
            <Image 
              src="/byteslogo1.png" 
              alt="BYTES Logo" 
              width={100} 
              height={100} 
              className="rounded-full shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight uppercase">
            BYTESDOC LOGIN
          </h1>
          <p className="text-gray-400 text-sm mt-1">Access your council dashboard</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest mb-2 ml-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-b border-white-600 bg-transparent text-white focus:outline-none focus:border-white transition-all placeholder:text-white-600"
              placeholder="name@bytes.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest mb-2 ml-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-b border-white-600 bg-transparent text-white focus:outline-none focus:border-white transition-all placeholder:text-white-600"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg text-center">
                <p className="text-red-400 text-xs font-semibold">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-white text-black py-4 rounded-xl hover:bg-gray-200 transition-all font-bold uppercase tracking-widest text-sm shadow-xl active:scale-95"
          >
            Login
          </button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-white-500 text-xs uppercase tracking-tighter">
                &copy; 2025-2026 BYTES Student Council
            </p>
        </div>
      </div>
    </div>
  )
}