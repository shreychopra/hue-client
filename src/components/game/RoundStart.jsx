import { useEffect, useState } from 'react'

export default function RoundStart({ state }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="hue-card p-8 flex flex-col">

      {/* Top bar */}
      <div className="flex items-center justify-between mb-auto">
        <span className="text-gray-600 text-xs font-mono">
          {state.round} / {state.totalRounds}
        </span>
        <span className="text-gray-600 text-xs">hue</span>
      </div>

      {/* Word — centred, fades in */}
      <div
        className="flex-1 flex flex-col items-center justify-center transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)'
        }}
      >
        <h2 className="text-6xl font-bold text-white tracking-tight text-center leading-tight">
          {state.currentWord}
        </h2>
        <p className="text-gray-600 text-sm mt-4 font-light">what colour does this feel like?</p>
      </div>

      {/* Bottom */}
      <div className="mt-auto pt-6 flex items-center justify-center gap-2">
        <div className="w-1 h-1 rounded-full bg-gray-700 animate-pulse" />
        <p className="text-gray-700 text-xs">get ready</p>
      </div>

    </div>
  )
}