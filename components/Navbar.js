'use client'
import Link from 'next/link'

export default function Navbar() {
  return (
    <div className="flex justify-between items-center px-10 py-5 border-b border-white/10 backdrop-blur-xl bg-black/30 sticky top-0 z-50">

      <h1 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-blue-400 to-green-400 text-transparent bg-clip-text">
        PlayGiveWin
      </h1>

      <div className="flex gap-8 text-sm text-gray-300">
        <Link href="/" className="hover:text-white transition">Home</Link>
        <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
        <Link href="/admin" className="hover:text-white transition">Admin</Link>
      </div>

    </div>
  )
}