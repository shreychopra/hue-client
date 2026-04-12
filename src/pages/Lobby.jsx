import { useState } from 'react'

export default function Lobby({ state, actions }) {
  const canStart = state.players.length >= 2 && state.isHost

  return (
    <div className="hue-card p-8 gap-0">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">hue</h1>
        <button
          onClick={actions.leaveRoom}
          className="text-gray-600 text-sm hover:text-gray-400 transition"
        >
          leave ←
        </button>
      </div>

      {/* Error */}
      {state.error && (
        <div className="bg-red-950 border border-red-900 text-red-400 text-sm px-4 py-3 rounded-2xl mb-4">
          {state.error}
        </div>
      )}

      {/* Room code */}
      <RoomCodeDisplay code={state.roomCode} />

      {/* Player list */}
      <div className="flex-1 flex flex-col gap-2 mt-6">
        <p className="text-gray-700 text-xs uppercase tracking-widest mb-1">
          {state.players.length} / 8 players
        </p>
        {state.players.map((player, index) => (
          <div
            key={player.id}
            className="flex items-center justify-between py-3 border-b border-gray-900"
          >
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: playerColour(index) }} />
              <span className="text-white text-sm font-medium">{player.name}</span>
            </div>
            {player.id === state.hostId && (
              <span className="text-gray-700 text-xs font-mono">host</span>
            )}
          </div>
        ))}
        {state.players.length < 2 && (
          <p className="text-gray-700 text-xs mt-2">waiting for more players...</p>
        )}
      </div>

      {/* Bottom actions */}
      <div className="flex flex-col gap-3 pt-6">
        {state.isHost ? (
          <>
            <button
              onClick={actions.startGame}
              disabled={!canStart}
              className="w-full py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-20"
            >
              start game
            </button>
            {!canStart && (
              <p className="text-gray-700 text-xs text-center">need at least 2 players</p>
            )}
          </>
        ) : (
          <p className="text-gray-600 text-sm text-center">waiting for host to start...</p>
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-900 mt-4">
        <p className="text-gray-700 text-xs text-center italic">no right or wrong answers</p>
      </div>

    </div>
  )
}

function RoomCodeDisplay({ code }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      onClick={handleCopy}
      className="flex items-center justify-between bg-gray-900 rounded-2xl px-5 py-4 cursor-pointer hover:bg-gray-800 transition"
    >
      <div>
        <p className="text-gray-600 text-xs uppercase tracking-widest mb-1">room code</p>
        <p className="text-white text-2xl font-mono font-bold tracking-widest">{code}</p>
      </div>
      <span className="text-gray-600 text-xs">{copied ? '✓ copied' : 'tap to copy'}</span>
    </div>
  )
}

function playerColour(index) {
  const colours = ['#60a5fa', '#f472b6', '#34d399', '#fbbf24', '#a78bfa', '#fb923c', '#22d3ee', '#f87171']
  return colours[index % colours.length]
}