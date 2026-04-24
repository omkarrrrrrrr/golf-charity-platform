'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminPage() {
  const [allowed, setAllowed] = useState(false)
  const [draws, setDraws] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth")

    if (auth !== "true") {
      window.location.href = "/admin/login"
    } else {
      setAllowed(true)
      fetchData()
    }
  }, [])

  const fetchData = async () => {
    const { data: d } = await supabase
      .from('draws')
      .select('*')
      .order('created_at', { ascending: false })

    const { data: u } = await supabase
      .from('users_meta')
      .select('*')

    setDraws(d || [])
    setUsers(u || [])
  }

  const runDraw = async () => {
    const numbers = Array.from({ length: 5 }, () =>
      Math.floor(Math.random() * 45) + 1
    )

    await supabase.from('draws').insert({
      numbers,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      winners: []
    })

    fetchData()
  }

  if (!allowed) return null

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <h1 className="text-4xl font-bold mb-6">
        Admin Dashboard
      </h1>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">

        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
          <p className="text-gray-400">Total Users</p>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
          <p className="text-gray-400">Total Draws</p>
          <p className="text-2xl font-bold">{draws.length}</p>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
          <p className="text-gray-400">Active System</p>
          <p className="text-green-400 font-bold">LIVE</p>
        </div>

      </div>

      {/* ACTIONS */}
      <div className="flex gap-4 mb-8">

        <button
          onClick={runDraw}
          className="bg-gradient-to-r from-green-400 to-green-600 px-6 py-3 rounded-xl font-semibold"
        >
          Run Monthly Draw
        </button>

      </div>

      {/* DRAW LIST */}
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">

        <h2 className="text-xl font-semibold mb-4">Recent Draws</h2>

        {draws.map((d, i) => (
          <div key={i} className="flex justify-between border-b border-white/10 py-2">
            <span>{d.numbers?.join(', ')}</span>
            <span className="text-gray-400">
              {d.month}/{d.year}
            </span>
          </div>
        ))}

      </div>

    </div>
  )
}