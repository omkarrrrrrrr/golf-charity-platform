import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#0f172a] to-[#020617] text-white flex items-center justify-center px-6">

      <div className="text-center max-w-2xl">

        <h1 className="text-7xl font-extrabold mb-6 leading-tight">
          Play. <span className="text-blue-500">Give.</span> Win.
        </h1>

        <p className="text-gray-400 text-lg mb-8">
          A new way to turn your golf scores into impact and rewards.
        </p>

        <Link href="/login">
          <button className="bg-gradient-to-r from-blue-500 to-green-500 px-10 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:scale-105 transition">
            Get Started →
          </button>
        </Link>

      </div>

    </main>
  )
}