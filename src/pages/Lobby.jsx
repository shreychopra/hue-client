import RoomCode from '../components/ui/RoomCode'

export default function Lobby({ state, actions }) {
  const canStart = state.players.length >= 2 && state.isHost

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-8 p-6">

      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">hue</h1>
        <p className="text-gray-600 text-sm mt-1">waiting for players</p>
      </div>

      {/* Error message e.g. game ended early */}
      {state.error && (
        <div className="bg-red-950 border border-red-800 text-red-300 text-sm px-4 py-3 rounded-xl w-full max-w-xs text-center">
          {state.error}
        </div>
      )}

      <RoomCode code={state.roomCode} />

      {/* Player list */}
      <div className="w-full max-w-xs flex flex-col gap-2">
        <p className="text-gray-600 text-xs uppercase tracking-widest text-center mb-2">
          {state.players.length} / 8 players
        </p>
        {state.players.map((player, index) => (
          <div
            key={player.id}
            className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-2xl px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: playerColour(index) }}
              />
              <span className="text-white font-medium">{player.name}</span>
            </div>
            {player.id === state.hostId && (
              <span className="text-xs text-gray-600 font-mono">host</span>
            )}
          </div>
        ))}

        {state.players.length < 2 && (
          <div className="border border-dashed border-gray-800 rounded-2xl px-4 py-3 text-center">
            <p className="text-gray-700 text-sm">waiting for more players...</p>
          </div>
        )}
      </div>

      {/* Start / waiting + leave */}
      <div className="flex flex-col items-center gap-3 w-full max-w-xs">
        {state.isHost ? (
          <>
            <button
              onClick={actions.startGame}
              disabled={!canStart}
              className="w-full py-4 rounded-2xl bg-white text-gray-950 font-semibold text-lg hover:bg-gray-100 active:scale-95 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            >
              Start Game
            </button>
            {!canStart && (
              <p className="text-gray-600 text-sm">need at least 2 players to start</p>
            )}
          </>
        ) : (
          <p className="text-gray-500">waiting for the host to start...</p>
        )}

        {/* Leave room — visible to ALL players */}
        <button
          onClick={actions.leaveRoom}
          className="text-gray-600 text-sm hover:text-gray-400 transition mt-1"
        >
          ← leave room
        </button>
      </div>

    </div>
  )
}

function playerColour(index) {
  const colours = [
    '#60a5fa',
    '#f472b6',
    '#34d399',
    '#fbbf24',
    '#a78bfa',
    '#fb923c',
    '#22d3ee',
    '#f87171',
  ]
  return colours[index % colours.length]
}// refresh
