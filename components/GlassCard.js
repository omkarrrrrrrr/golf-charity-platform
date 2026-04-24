export default function GlassCard({ children }) {
  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">
      {children}
    </div>
  )
}