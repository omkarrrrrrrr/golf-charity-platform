'use client'

import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import { supabase } from '../../lib/supabase'

export default function Admin() {

  const [stats, setStats] = useState({})

  useEffect(() => {
    const load = async () => {

      const { data: users } = await supabase.from('users_meta').select('*')
      const { data: payments } = await supabase.from('payments').select('*')
      const { data: draws } = await supabase.from('draws').select('*')

      const active = users.filter(u => u.subscription_active).length

      const revenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0)

      setStats({
        totalUsers: users.length,
        activeUsers: active,
        totalPayments: payments.length,
        revenue,
        totalDraws: draws.length
      })
    }

    load()
  }, [])

  const runDraw = async () => {

    const drawNumbers = Array.from({ length: 5 }, () =>
      Math.floor(Math.random() * 45) + 1
    )

    const { data: users } = await supabase
      .from('users_meta')
      .select('*')
      .eq('subscription_active', true)

    const winners_3 = []
    const winners_4 = []
    const winners_5 = []

    for (let u of users) {
      const { data: scores } = await supabase
        .from('scores')
        .select('score')
        .eq('user_id', u.user_id)

      const userNumbers = scores.map(s => s.score)

      const matches = userNumbers.filter(n => drawNumbers.includes(n)).length

      if (matches >= 3) winners_3.push(u.user_id)
      if (matches >= 4) winners_4.push(u.user_id)
      if (matches === 5) winners_5.push(u.user_id)
    }

    await supabase.from('draws').insert({
      numbers: drawNumbers,
      winners_3,
      winners_4,
      winners_5
    })

    alert("Draw completed")
  }

  return (
    <div className="min-h-screen bg-black text-white">

      <Navbar />

      <div className="p-8 max-w-5xl mx-auto">

        <h1 className="text-3xl mb-8">Admin Dashboard</h1>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">

          <div className="bg-white/10 p-4 rounded-xl">
            <p>Total Users</p>
            <h2 className="text-2xl">{stats.totalUsers}</h2>
          </div>

          <div className="bg-white/10 p-4 rounded-xl">
            <p>Active Users</p>
            <h2 className="text-2xl">{stats.activeUsers}</h2>
          </div>

          <div className="bg-white/10 p-4 rounded-xl">
            <p>Payments</p>
            <h2 className="text-2xl">{stats.totalPayments}</h2>
          </div>

          <div className="bg-white/10 p-4 rounded-xl">
            <p>Revenue</p>
            <h2 className="text-2xl">₹{stats.revenue}</h2>
          </div>

        </div>

        {/* DRAW BUTTON */}
        <button
          onClick={runDraw}
          className="bg-white text-black px-6 py-3 rounded-xl"
        >
          Run Draw
        </button>

      </div>
    </div>
  )
}