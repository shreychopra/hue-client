import { useEffect, useState } from 'react'
import { hsbToHex } from '../../utils/colourConvert'

export default function Reveal({ state, actions }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const isLastRound = state.round >= state.totalRounds

  return (
    <div
      className="flex flex-col items-center gap-6 w-full max-w-md px-6 transition-all duration-500"
      style={{ opacity: visible ? 1 : 0 }}
    >

      {/* Header */}
      <div className="text-center">
        <p className="text-gray-600 text-xs uppercase tracking-widest font-mono mb-2">
          round {state.round} of {state.totalRounds}
        </p>
        <h2 className="text-4xl font-bold text-white">{state.currentWord}</h2>
      </div>

      {/* Group average */}
      {state.averageColour && (
        <div className="flex flex-col items-center gap-2 w-full">
          <p className="text-gray-600 text-xs uppercase tracking-widest">
            your group felt
          </p>
          <div
            className="w-full h-20 rounded-2xl shadow-lg transition-all duration-700"
            style={{
              backgroundColor: hsbToHex(
                state.averageColour.h,
                state.averageColour.s,
                state.averageColour.b
              )
            }}
          />
        </div>
      )}

      {/* Player colours grid */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {Object.entries(state.submissions).map(([name, colour]) => {
          const hex = hsbToHex(colour.h, colour.s, colour.b)
          const score = state.roundScores[name] ?? 0
          const isMe = name === state.myName

          return (
            <div
              key={name}
              className={`flex flex-col items-center gap-2 rounded-2xl p-4 border transition-all ${
                isMe
                  ? 'border-white bg-gray-900'
                  : 'border-gray-800 bg-gray-900'
              }`}
            >
              <div
                className="w-full h-14 rounded-xl shadow"
                style={{ backgroundColor: hex }}
              />
              <p className="text-white text-sm font-medium">
                {name} {isMe && <span className="text-gray-500">(you)</span>}
              </p>
              <p className="text-gray-400 text-sm font-mono">+{score} pts</p>
            </div>
          )
        })}
      </div>

      {/* Running scores */}
      <div className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <p className="text-gray-600 text-xs uppercase tracking-widest mb-3">scores</p>
        {Object.entries(state.totalScores)
          .sort((a, b) => b[1] - a[1])
          .map(([name, score], index) => (
            <div key={name} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-gray-600 text-sm font-mono w-4">{index + 1}</span>
                <span className={`font-medium ${name === state.myName ? 'text-white' : 'text-gray-300'}`}>
                  {name}
                </span>
              </div>
              <span className="text-white font-mono">{score}</span>
            </div>
          ))}
      </div>

      {/* Next round / results */}
      {state.isHost ? (
        <button
          onClick={actions.nextRound}
          className="w-full py-4 rounded-2xl bg-white text-gray-950 font-semibold text-lg hover:bg-gray-100 active:scale-95 transition-all"
        >
          {isLastRound ? 'see final results' : 'next round →'}
        </button>
      ) : (
        <p className="text-gray-500 text-sm">waiting for host to continue...</p>
      )}

    </div>
  )
}