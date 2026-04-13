import { useEffect, useState } from 'react'
import { hsbToHex } from '../../utils/colourConvert'
import ScrollingNumber from '../ui/ScrollingNumber'

export default function PlayAgainOffer({ state, actions }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const sorted = Object.entries(state.totalScores).sort((a, b) => b[1] - a[1])
  const winner = sorted[0]?.[0]
  const medals = ['🥇', '🥈', '🥉']

  return (
    <div
      className="hue-card transition-all duration-500"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {/* Fixed top */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2 shrink-0">
        <span className="text-gray-600 text-xs">hue</span>
        <span className="text-gray-600 text-xs italic">no right or wrong answers</span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">

        <div className="mb-6 pt-2">
          <h2 className="text-4xl font-bold text-white">game over</h2>
          <p className="text-gray-500 text-sm mt-1 font-light">
            {winner} read the room best
          </p>
        </div>

        {/* Round history */}
        {state.roundHistory.length > 0 && (
          <div className="mb-6">
            <p className="text-gray-700 text-xs uppercase tracking-widest mb-3">all rounds</p>
            <div className="flex flex-col gap-5">
              {state.roundHistory.map((round, i) => {
                const avgHex = hsbToHex(round.average.h, round.average.s, round.average.b)
                const sortedSubmissions = Object.entries(round.submissions)
                  .sort((a, b) => (round.scores[b[0]] ?? 0) - (round.scores[a[0]] ?? 0))

                return (
                  <div key={i}>
                    <p className="text-gray-500 text-xs mb-2 font-mono">{i + 1}. {round.word}</p>
                    <div className="flex gap-1.5">
                      {sortedSubmissions.map(([name, colour]) => {
                        const playerHex = hsbToHex(colour.h, colour.s, colour.b)
                        const score = round.scores[name] ?? 0
                        const isMe = name === state.myName
                        return (
                          <div key={name} className="flex-1 rounded-xl overflow-hidden">
                            <div
                              className="relative flex items-start p-2"
                              style={{ backgroundColor: playerHex, height: 56 }}
                            >
                              <span className="text-xs font-mono font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>
                                {score}
                              </span>
                              <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 100 20" preserveAspectRatio="none" style={{ height: 16 }}>
                                <polygon points="0,20 100,0 100,20" fill={avgHex} />
                              </svg>
                            </div>
                            <div className="flex items-end p-2" style={{ backgroundColor: avgHex, height: 36 }}>
                              <span className="text-xs truncate font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                                {name}{isMe ? ' ·' : ''}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Scores */}
        <div className="mb-4">
          <p className="text-gray-700 text-xs uppercase tracking-widest mb-3">final scores</p>
          {sorted.map(([name, score], index) => (
            <div key={name} className="flex justify-between items-center py-3 border-b border-gray-900 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-base">{medals[index] || `${index + 1}.`}</span>
                <div className="flex flex-col">
                  <span className={`text-sm font-medium ${name === state.myName ? 'text-white' : 'text-gray-400'}`}>
                    {name}
                  </span>
                  {name === state.myName && <span className="text-gray-600 text-xs">you</span>}
                </div>
              </div>
              <ScrollingNumber value={score} className="text-white font-mono text-sm" />
            </div>
          ))}
        </div>

      </div>

      {/* Fixed bottom */}
      <div
        className="px-6 pt-5 shrink-0 border-t border-gray-900 flex flex-col gap-3"
        style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
      >
        <p className="text-gray-600 text-xs text-center">the host wants to play again</p>
        <button
          onClick={actions.joinNextGame}
          className="w-full py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-200 transition-all active:scale-95"
        >
          join next game
        </button>
        <button
          onClick={actions.leaveRoom}
          className="w-full py-3 rounded-full border border-gray-800 text-gray-500 text-sm hover:border-gray-600 hover:text-gray-300 transition-all active:scale-95"
        >
          exit to home
        </button>
      </div>
    </div>
  )
}