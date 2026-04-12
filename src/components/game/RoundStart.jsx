import { useEffect, useState } from 'react'

export default function RoundStart({ state }) {
  const [visible, setVisible] = useState(false)

  // Fade the word in
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-8 text-center px-6">

      {/* Round indicator */}
      <p className="text-gray-600 text-sm uppercase tracking-widest font-mono">
        round {state.round} of {state.totalRounds}
      </p>

      {/* The word — fades in */}
      <div
        className="transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)' }}
      >
        <h2 className="text-6xl font-bold text-white tracking-tight">
          {state.currentWord}
        </h2>
      </div>

      {/* Instruction */}
      <p className="text-gray-500 text-lg font-light">
        what colour does this word make you feel?
      </p>

      {/* Get ready pulse */}
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-gray-600 animate-pulse" />
        <p className="text-gray-600 text-sm">colour wheel loading...</p>
      </div>

    </div>
  )
}