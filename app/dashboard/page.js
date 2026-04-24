'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Navbar from '../../components/Navbar'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [active, setActive] = useState(false)
  const [expiry, setExpiry] = useState(null)
  const [charity, setCharity] = useState('')
  const [leaderboard, setLeaderboard] = useState([])
  const [draw, setDraw] = useState(null)
  const [scores, setScores] = useState([])

  const charities = [
    "Education Fund",
    "Mental Health Support",
    "Climate Action"
  ]

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        window.location.href = '/login'
        return
      }

      const u = data.session.user
      setUser(u)

      // 🔥 USER META
      const { data: meta } = await supabase
        .from('users_meta')
        .select('*')
        .eq('user_id', u.id)
        .single()

      if (meta) {
        setActive(meta.subscription_active)
        setExpiry(meta.subscription_expiry)
        setCharity(meta.charity || '')
      }

      // 🔥 SCORES (reverse chronological)
      const { data: userScores } = await supabase
        .from('scores')
        .select('*')
        .eq('user_id', u.id)
        .order('date', { ascending: false })

      setScores(userScores || [])

      // 🔥 DRAW
      const { data: drawData } = await supabase
        .from('draws')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)

      if (drawData?.length > 0) setDraw(drawData[0])

      // 🔥 LEADERBOARD
      const { data: allScores } = await supabase
        .from('scores')
        .select('*')

      const map = {}
      allScores.forEach(s => {
        if (!map[s.user_id]) map[s.user_id] = []
        map[s.user_id].push(s.score)
      })

      const ranked = Object.keys(map).map(user_id => {
        const avg =
          map[user_id].reduce((a, b) => a + b, 0) /
          map[user_id].length

        return { user_id, avg }
      })

      ranked.sort((a, b) => b.avg - a.avg)
      setLeaderboard(ranked.slice(0, 5))
    }

    init()
  }, [])

  const saveCharity = async () => {
    await supabase.from('users_meta').upsert({
      user_id: user.id,
      charity
    })
    alert("Charity saved")
  }

  const handlePayment = async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        email: user.email,
      }),
    })

    const data = await res.json()
    window.location.href = data.url
  }

  const addScore = async () => {
    const score = parseInt(document.getElementById('score').value)
    const date = document.getElementById('date').value

    if (!score || score < 1 || score > 45) {
      alert("Score must be between 1–45")
      return
    }

    // ❌ duplicate date check
    const { data: existing } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', date)

    if (existing.length > 0) {
      alert("Score already exists for this date")
      return
    }

    // 📊 get current scores
    const { data: current } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    // 🧠 keep only 5
    if (current.length >= 5) {
      await supabase
        .from('scores')
        .delete()
        .eq('id', current[0].id)
    }

    await supabase.from('scores').insert({
      user_id: user.id,
      score,
      date
    })

    alert("Score added")
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] to-black text-white">

      <Navbar />

      <div className="max-w-5xl mx-auto p-8 space-y-8">

        <h1 className="text-4xl font-bold">Dashboard</h1>

        {/* SUBSCRIPTION */}
        {!active ? (
          <div className="bg-white/5 p-6 rounded-2xl">
            <p className="mb-4">Subscribe to enter the monthly draw</p>
            <button
              onClick={handlePayment}
              className="bg-green-500 px-6 py-3 rounded-xl"
            >
              Subscribe ₹500
            </button>
          </div>
        ) : (
          <div className="bg-green-500/10 p-6 rounded-2xl">
            <p className="text-green-400">
              Active till: {new Date(expiry).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* CHARITY */}
        <div className="bg-white/5 p-6 rounded-2xl">
          <h2 className="mb-2">Select Charity</h2>

          <select
            value={charity}
            onChange={e => setCharity(e.target.value)}
            className="text-black p-2 rounded"
          >
            <option value="">Select</option>
            {charities.map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <button
            onClick={saveCharity}
            className="ml-2 bg-blue-500 px-4 py-2 rounded"
          >
            Save
          </button>
        </div>

        {/* SCORE INPUT */}
        <div className="bg-white/5 p-6 rounded-2xl">
          <h2 className="mb-4">Enter Score</h2>

          <input
            id="score"
            type="number"
            placeholder="Score (1–45)"
            className="text-black p-2 mr-2"
          />

          <input
            id="date"
            type="date"
            className="text-black p-2 mr-2"
          />

          <button
            onClick={addScore}
            className="bg-blue-500 px-4 py-2 rounded"
          >
            Add
          </button>
        </div>

        {/* SCORE LIST */}
        <div className="bg-white/5 p-6 rounded-2xl">
          <h2 className="mb-4">Your Scores</h2>

          {scores.map(s => (
            <div key={s.id} className="flex justify-between py-2 border-b border-white/10">
              <span>{s.score}</span>
              <span>{s.date}</span>
            </div>
          ))}
        </div>

        {/* DRAW */}
        {draw && (
          <div className="bg-white/5 p-6 rounded-2xl">
            <h2 className="mb-2">Latest Draw</h2>
            <p>{draw.numbers.join(', ')}</p>

            <div className="mt-4 text-sm text-gray-300">
              <p>3 Matches: {draw.winners_3?.length || 0}</p>
              <p>4 Matches: {draw.winners_4?.length || 0}</p>
              <p>5 Matches: {draw.winners_5?.length || 0}</p>
            </div>
          </div>
        )}

        {/* LEADERBOARD */}
        <div className="bg-white/5 p-6 rounded-2xl">
          <h2 className="mb-4">Leaderboard</h2>

          {leaderboard.map((u, i) => (
            <div key={u.user_id} className="flex justify-between py-2 border-b border-white/10">
              <span>#{i + 1}</span>
              <span>{u.user_id.slice(0, 6)}...</span>
              <span>{u.avg.toFixed(1)}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}