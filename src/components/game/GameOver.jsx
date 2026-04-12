import { useEffect, useState } from 'react'
import { hsbToHex } from '../../utils/colourConvert'
import ScrollingNumber from '../ui/ScrollingNumber'

export default function GameOver({ state, actions }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const sorted = Object.entries(state.totalScores).sort((a, b) => b[1] - a[1])
  const winner = sorted[0]?.[0]
  const isWinner = winner === state.myName
  const medals = ['🥇', '🥈', '🥉']

  return (
    <div
      className="hue-card transition-all duration-500"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-6 pb-4">
        <span className="text-gray-600 text-xs">hue</span>
        <span className="text-gray-600 text-xs italic">no right or wrong answers</span>
      </div>

      {/* Winner message */}
      <div className="px-6 mb-4">
        <h2 className="text-4xl font-bold text-white">
          {isWinner ? 'you won 🎉' : 'game over'}
        </h2>
        <p className="text-gray-500 text-sm mt-1 font-light">
          {isWinner
            ? 'your instincts matched the group best'
            : `${winner} read the room best`}
        </p>
      </div>

      {/* Final scores */}
      <div className="px-6 flex-1">
        <p className="text-gray-700 text-xs uppercase tracking-widest mb-3">final scores</p>
        {sorted.map(([name, score], index) => (
          <div
            key={name}
            className="flex justify-between items-center py-3 border-b border-gray-900 last:border-0"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{medals[index] || `${index + 1}.`}</span>
              <span className={`text-sm font-medium ${name === state.myName ? 'text-white' : 'text-gray-400'}`}>
                {name}
                {name === state.myName && (
                  <span className="text-gray-600 font-normal ml-1">(you)</span>
                )}
              </span>
            </div>
            <ScrollingNumber value={score} className="text-white font-mono text-sm" />
          </div>
        ))}
        <p className="text-gray-700 text-xs font-mono mt-3">max {state.totalRounds * 100} pts</p>
      </div>

      {/* Actions */}
      <div className="p-6 pt-4 flex flex-col gap-3">
        {state.isHost ? (
          <>
            <button
              onClick={actions.playAgain}
              className="w-full py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-200 transition-all active:scale-95"
            >
              play again
            </button>
            <button
              onClick={actions.leaveRoom}
              className="w-full py-3 rounded-full border border-gray-800 text-gray-500 text-sm hover:border-gray-600 hover:text-gray-300 transition-all active:scale-95"
            >
              exit to home
            </button>
          </>
        ) : (
          <>
            <div className="w-full py-3 rounded-full border border-gray-800 text-gray-600 text-sm text-center">
              waiting for host...
            </div>
            <button
              onClick={actions.leaveRoom}
              className="w-full py-3 rounded-full border border-gray-800 text-gray-500 text-sm hover:border-gray-600 hover:text-gray-300 transition-all active:scale-95"
            >
              exit to home
            </button>
          </>
        )}
      </div>
    </div>
  )
}