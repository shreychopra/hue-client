import { useEffect, useState } from 'react'
import { hsbToHex } from '../../utils/colourConvert'

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
      className="flex flex-col items-center gap-8 w-full max-w-md px-6 py-10 transition-all duration-500"
      style={{ opacity: visible ? 1 : 0 }}
    >

      {/* Result header */}
      <div className="text-center flex flex-col gap-2">
        <h2 className="text-5xl font-bold text-white">
          {isWinner ? 'you won 🎉' : 'game over'}
        </h2>
        <p className="text-gray-500 font-light">
          {isWinner
            ? 'your instincts matched the group best'
            : `${winner} read the room best`}
        </p>
      </div>

      {/* Final leaderboard */}
      <div className="w-full bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {sorted.map(([name, score], index) => (
          <div
            key={name}
            className={`flex justify-between items-center px-5 py-4 border-b border-gray-800 last:border-0 ${name === state.myName ? 'bg-gray-800' : ''
              }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-xl">{medals[index] || `${index + 1}.`}</span>
              <span className={`font-medium text-lg ${name === state.myName ? 'text-white' : 'text-gray-300'}`}>
                {name}
                {name === state.myName && (
                  <span className="text-gray-500 text-sm font-normal ml-2">(you)</span>
                )}
              </span>
            </div>
            <span className="text-white font-mono text-lg">{score}</span>
          </div>
        ))}
      </div>

      {/* Max possible score note */}
      <p className="text-gray-700 text-xs font-mono">
        max score: {state.totalRounds * 100} pts
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full">
        {state.isHost ? (
          <>
            <button
              onClick={actions.playAgain}
              className="w-full py-4 rounded-2xl bg-white text-gray-950 font-semibold text-lg hover:bg-gray-100 active:scale-95 transition-all"
            >
              play again
            </button>
            <button
              onClick={actions.leaveRoom}
              className="w-full py-4 rounded-2xl bg-gray-900 border border-gray-800 text-gray-400 font-semibold text-lg hover:bg-gray-800 active:scale-95 transition-all"
            >
              exit to home
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="w-full py-4 rounded-2xl bg-gray-900 border border-gray-800 text-gray-500 text-center font-semibold text-lg">
              waiting for host to restart...
            </div>
            <button
              onClick={actions.leaveRoom}
              className="w-full py-4 rounded-2xl bg-gray-900 border border-gray-800 text-gray-400 font-semibold text-lg hover:bg-gray-800 active:scale-95 transition-all"
            >
              exit to home
            </button>
          </div>
        )}
      </div>

      {/* Tagline footer */}
      <p className="text-gray-700 text-sm font-light italic">no right or wrong answers</p>

    </div>
  )
}