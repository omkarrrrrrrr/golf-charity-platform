'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Navbar from '../../components/Navbar'
import GlassCard from '../../components/GlassCard'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [active, setActive] = useState(false)
  const [expiry, setExpiry] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [draw, setDraw] = useState(null)
  const [scores, setScores] = useState([])

  const fetchDraw = async () => {
    const { data } = await supabase
      .from('draws')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)

    if (data?.length > 0) setDraw(data[0])
  }

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        window.location.href = '/login'
        return
      }

      const u = data.session.user
      setUser(u)

      const { data: meta } = await supabase
        .from('users_meta')
        .select('*')
        .eq('user_id', u.id)
        .single()

      if (meta) {
        setActive(meta.subscription_active)
        setExpiry(meta.subscription_expiry)
      }

      const { data: userScores } = await supabase
        .from('scores')
        .select('*')
        .eq('user_id', u.id)
        .order('date', { ascending: false })

      setScores(userScores || [])

      await fetchDraw()

      const { data: allScores } = await supabase.from('scores').select('*')

      const map = {}
      allScores?.forEach(s => {
        if (!map[s.user_id]) map[s.user_id] = []
        map[s.user_id].push(s.score)
      })

      const ranked = Object.keys(map).map(user_id => ({
        user_id,
        avg:
          map[user_id].reduce((a, b) => a + b, 0) /
          map[user_id].length
      }))

      ranked.sort((a, b) => b.avg - a.avg)
      setLeaderboard(ranked.slice(0, 5))
    }

    init()
    const interval = setInterval(fetchDraw, 5000)
    return () => clearInterval(interval)
  }, [])

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
    if (data?.url) window.location.href = data.url
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl md:text-5xl font-bold">
            Dashboard
          </h1>
          <p className="text-gray-400 text-sm md:text-base mt-2">
            Track performance. Win rewards. Make impact.
          </p>
        </div>

        {/* SUBSCRIPTION */}
        <GlassCard>
          {!active ? (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>
                <p className="font-semibold text-lg">
                  Join Monthly Draw
                </p>
                <p className="text-gray-400 text-sm">
                  ₹500/month • Win rewards
                </p>
              </div>

              <button
                onClick={handlePayment}
                className="w-full md:w-auto bg-gradient-to-r from-green-400 to-green-600 px-6 py-3 rounded-xl font-semibold"
              >
                Subscribe
              </button>

            </div>
          ) : (
            <p className="text-green-400">
              Active till {new Date(expiry).toLocaleDateString()}
            </p>
          )}
        </GlassCard>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* SCORES */}
          <GlassCard>
            <h2 className="font-semibold mb-3">Your Scores</h2>

            {scores.length === 0 && <p>No scores</p>}

            {scores.map(s => (
              <div key={s.id} className="flex justify-between py-2 border-b border-white/10 text-sm md:text-base">
                <span>{s.score}</span>
                <span className="text-gray-400">{s.date}</span>
              </div>
            ))}
          </GlassCard>

          {/* DRAW */}
          <GlassCard>
            <h2 className="font-semibold mb-3">Latest Draw</h2>

            {draw ? (
              <>
                <div className="flex flex-wrap gap-2 mb-4">
                  {draw.numbers?.map((n, i) => (
                    <div key={i} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-sm md:text-lg font-bold">
                      {n}
                    </div>
                  ))}
                </div>

                <div className="text-xs md:text-sm text-gray-400">
                  <p>3 Matches: {draw.winners_3?.length || 0}</p>
                  <p>4 Matches: {draw.winners_4?.length || 0}</p>
                  <p>5 Matches: {draw.winners_5?.length || 0}</p>
                </div>
              </>
            ) : (
              <p>No draw yet</p>
            )}
          </GlassCard>

        </div>

        {/* LEADERBOARD */}
        <GlassCard>
          <h2 className="font-semibold mb-3">Leaderboard</h2>

          {leaderboard.map((u, i) => (
            <div key={u.user_id} className="flex justify-between py-2 border-b border-white/10 text-sm md:text-base">
              <span>#{i + 1}</span>
              <span>{u.user_id.slice(0, 6)}...</span>
              <span className="text-green-400">{u.avg.toFixed(1)}</span>
            </div>
          ))}
        </GlassCard>

      </div>
    </div>
  )
}