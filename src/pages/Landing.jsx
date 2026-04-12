import { useState } from 'react'

export default function Landing({ state, actions }) {
  const [mode, setMode] = useState(null)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')

  const handleCreate = () => {
    if (!name.trim()) return
    actions.createRoom(name.trim())
  }

  const handleJoin = () => {
    if (!name.trim() || !code.trim()) return
    actions.joinRoom(code.trim().toUpperCase(), name.trim())
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-10 p-6">

      {/* Hero */}
      <div className="text-center flex flex-col items-center gap-3">
        <h1 className="text-7xl font-bold text-white tracking-tight">hue</h1>
        <p className="text-gray-400 text-lg font-light">no right or wrong answers</p>
      </div>

      {/* Error */}
      {state.error && (
        <div className="bg-red-950 border border-red-800 text-red-300 text-sm px-4 py-3 rounded-xl">
          {state.error}
        </div>
      )}

      {/* Mode selection */}
      {!mode && (
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => setMode('create')}
            className="w-full py-4 rounded-2xl bg-white text-gray-950 font-semibold text-lg hover:bg-gray-100 active:scale-95 transition-all"
          >
            Create Room
          </button>
          <button
            onClick={() => setMode('join')}
            className="w-full py-4 rounded-2xl bg-gray-900 text-white font-semibold text-lg hover:bg-gray-800 active:scale-95 transition-all border border-gray-800"
          >
            Join Room
          </button>
        </div>
      )}

      {/* Create form */}
      {mode === 'create' && (
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <input
            type="text"
            placeholder="your name"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            maxLength={16}
            autoFocus
            className="w-full py-4 px-4 rounded-2xl bg-gray-900 text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-white border border-gray-800 transition"
          />
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="w-full py-4 rounded-2xl bg-white text-gray-950 font-semibold text-lg hover:bg-gray-100 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Create Room
          </button>
          <button
            onClick={() => setMode(null)}
            className="text-gray-600 text-sm hover:text-gray-400 transition text-center py-1"
          >
            ← back
          </button>
        </div>
      )}

      {/* Join form */}
      {mode === 'join' && (
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <input
            type="text"
            placeholder="your name"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={16}
            autoFocus
            className="w-full py-4 px-4 rounded-2xl bg-gray-900 text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-white border border-gray-800 transition"
          />
          <input
            type="text"
            placeholder="room code"
            value={code}
            onChange={e => {
              setCode(e.target.value.toUpperCase())
            }}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
            maxLength={6}
            className="w-full py-4 px-4 rounded-2xl bg-gray-900 text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-white border border-gray-800 tracking-widest font-mono text-center text-lg transition"
          />
          <button
            onClick={handleJoin}
            disabled={!name.trim() || code.length < 6}
            className="w-full py-4 rounded-2xl bg-white text-gray-950 font-semibold text-lg hover:bg-gray-100 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Join Room
          </button>
          <button
            onClick={() => setMode(null)}
            className="text-gray-600 text-sm hover:text-gray-400 transition text-center py-1"
          >
            ← back
          </button>
        </div>
      )}

      {/* How to play — brief */}
      {!mode && (
        <div className="text-center max-w-xs">
          <p className="text-gray-600 text-sm leading-relaxed">
            you're shown a word. pick the colour it makes you feel.
            the closer you are to your group's collective instinct, the higher you score.
          </p>
        </div>
      )}

    </div>
  )
}