'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    // 🔐 SIMPLE ADMIN CREDENTIALS (you can change this)
    const ADMIN_USER = "admin"
    const ADMIN_PASS = "dharte@2026"

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem("adminAuth", "true")
      router.push('/admin')
    } else {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-lg">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Admin Access
        </h1>

        <input
          className="w-full p-3 mb-3 rounded bg-black border border-white/20"
          placeholder="Username"
          onChange={e => setUsername(e.target.value)}
        />

        <input
          className="w-full p-3 mb-3 rounded bg-black border border-white/20"
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-400 text-sm mb-3">{error}</p>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 rounded-xl font-semibold"
        >
          Login
        </button>

      </div>
    </div>
  )
}