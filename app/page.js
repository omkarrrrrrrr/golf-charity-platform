import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="relative overflow-hidden">

        {/* gradient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">

          <h1 className="text-6xl font-bold tracking-tight leading-tight">
            Golf. Impact. Rewards.
          </h1>

          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
            Track your performance, enter monthly draws, win rewards — 
            while supporting causes that matter.
          </p>

          <div className="mt-8 flex justify-center gap-4">

            <Link href="/dashboard">
              <button className="bg-gradient-to-r from-green-400 to-green-600 px-8 py-4 rounded-xl font-semibold hover:scale-105 transition">
                Join Monthly Draw
              </button>
            </Link>

            <Link href="/login">
              <button className="border border-white/20 px-8 py-4 rounded-xl hover:bg-white/10 transition">
                Login
              </button>
            </Link>

          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-6 py-20">

        <h2 className="text-3xl font-semibold text-center mb-12">
          How it Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-semibold mb-2">1. Submit Scores</h3>
            <p className="text-gray-400 text-sm">
              Enter your last 5 golf scores (Stableford format).
            </p>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-semibold mb-2">2. Enter Draw</h3>
            <p className="text-gray-400 text-sm">
              Your scores become your numbers in the monthly draw.
            </p>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-semibold mb-2">3. Win & Give Back</h3>
            <p className="text-gray-400 text-sm">
              Win prizes and contribute to your selected charity.
            </p>
          </div>

        </div>
      </section>

      {/* CHARITY */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">

        <h2 className="text-3xl font-semibold mb-6">
          Play with Purpose
        </h2>

        <p className="text-gray-400 max-w-2xl mx-auto">
          A portion of every subscription goes to impactful causes —
          from mental health to climate action.
        </p>

      </section>

      {/* CTA */}
      <section className="text-center py-20">

        <h2 className="text-3xl font-semibold mb-6">
          Ready to Play?
        </h2>

        <Link href="/dashboard">
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-10 py-4 rounded-xl font-semibold hover:scale-105 transition">
            Get Started
          </button>
        </Link>

      </section>

    </div>
  )
}