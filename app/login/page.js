'use client'
import { supabase } from '../../lib/supabase'
import { useState, useEffect } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')

  useEffect(() => {
    // 🔥 LISTEN FOR LOGIN
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        window.location.href = '/dashboard'
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const login = async () => {
    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'http://localhost:3000/dashboard',
      },
    })
    alert("Check your email")
  }

  return (
    <div className="flex items-center justify-center min-h-screen">

      <div className="bg-white/5 p-10 rounded-2xl">

        <h1 className="text-2xl mb-6">Login</h1>

        <input
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter email"
          className="text-black p-2 mr-2"
        />

        <button
          onClick={login}
          className="bg-white text-black px-4 py-2"
        >
          Login
        </button>

      </div>

    </div>
  )
}