import { useEffect, useState } from 'react'
import { hsbToHex } from '../../utils/colourConvert'
import ScrollingNumber from '../ui/ScrollingNumber'

export default function Reveal({ state, actions }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const isLastRound = state.round >= state.totalRounds
  const avgHex = state.averageColour
    ? hsbToHex(state.averageColour.h, state.averageColour.s, state.averageColour.b)
    : '#888'

  return (
    <div
      className="hue-card transition-all duration-500"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <span className="text-gray-600 text-xs font-mono">
          {state.round} / {state.totalRounds}
        </span>
        <span className="text-gray-400 text-sm font-medium">{state.currentWord}</span>
        <span className="text-gray-600 text-xs">hue</span>
      </div>

      {/* Player strips */}
      <div className="flex gap-1.5 px-6">
        {Object.entries(state.submissions)
          .sort((a, b) => (state.roundScores[b[0]] ?? 0) - (state.roundScores[a[0]] ?? 0))
          .map(([name, colour]) => {
            const playerHex = hsbToHex(colour.h, colour.s, colour.b)
            const score = state.roundScores[name] ?? 0
            const isMe = name === state.myName

            return (
              <div
                key={name}
                className="flex-1 rounded-2xl overflow-hidden"
                style={{ minHeight: 160 }}
              >
                {/* Top half — player colour */}
                <div
                  className="relative flex items-start justify-between p-3"
                  style={{ backgroundColor: playerHex, height: 100 }}
                >
                  <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    {score}
                  </span>
                  {/* Diagonal clip — SVG overlay */}
                  <svg
                    className="absolute bottom-0 left-0 w-full"
                    viewBox="0 0 100 20"
                    preserveAspectRatio="none"
                    style={{ height: 24 }}
                  >
                    <polygon points="0,20 100,0 100,20" fill={avgHex} />
                  </svg>
                </div>
                {/* Bottom half — group average */}
                <div
                  className="flex items-end p-3"
                  style={{ backgroundColor: avgHex, height: 80 }}
                >
                  <span
                    className="text-xs font-medium truncate"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    {name}
                  </span>
                </div>
              </div>
            )
          })}
      </div>

      {/* Running scores */}
      <div className="flex-1 px-6 pt-5">
        <p className="text-gray-700 text-xs uppercase tracking-widest mb-3">scores</p>
        {Object.entries(state.totalScores)
          .sort((a, b) => b[1] - a[1])
          .map(([name, score], index) => (
            <div
              key={name}
              className="flex justify-between items-center py-2 border-b border-gray-900 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-700 text-xs font-mono w-4">{index + 1}</span>
                <div className="flex flex-col">
                  <span className={`text-sm ${name === state.myName ? 'text-white font-medium' : 'text-gray-400'}`}>
                    {name}
                  </span>
                  {name === state.myName && (
                    <span className="text-gray-600 text-xs">you</span>
                  )}
                </div>
              </div>
              <ScrollingNumber value={score} className="text-white text-sm font-mono" />
            </div>
          ))}
      </div>

      {/* Next button */}
      <div className="p-6 pt-4">
        {state.isHost ? (
          <button
            onClick={actions.nextRound}
            className="w-full py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-200 transition-all active:scale-95"
          >
            {isLastRound ? 'see final results' : 'next round →'}
          </button>
        ) : (
          <p className="text-gray-600 text-xs text-center">waiting for host...</p>
        )}
      </div>
    </div>
  )
}