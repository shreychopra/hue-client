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
    if (!name.trim() || code.length < 6) return
    actions.joinRoom(code.trim().toUpperCase(), name.trim())
  }

  return (
    <div className="hue-card p-8 gap-0">

      {/* Top section */}
      <div className="flex-1 flex flex-col justify-center gap-6 py-8">
        <div>
          <h1 className="text-7xl font-bold text-white tracking-tight leading-none">hue</h1>
          <p className="text-gray-500 mt-3 text-base font-light leading-relaxed">
            you're shown a word. pick the colour it makes you feel.
            the closer you are to your group's instinct, the higher you score.
          </p>
          <p className="text-gray-600 mt-2 text-sm italic">no right or wrong answers.</p>
        </div>

        {/* Error */}
        {state.error && (
          <p className="text-red-400 text-sm">{state.error}</p>
        )}

        {/* Mode: default */}
        {!mode && (
          <div className="flex gap-3">
            <button
              onClick={() => setMode('create')}
              className="flex-1 py-3 rounded-full border border-white text-white text-sm font-medium hover:bg-white hover:text-black transition-all active:scale-95"
            >
              create room
            </button>
            <button
              onClick={() => setMode('join')}
              className="flex-1 py-3 rounded-full border border-gray-600 text-gray-400 text-sm font-medium hover:border-white hover:text-white transition-all active:scale-95"
            >
              join room
            </button>
          </div>
        )}

        {/* Create form */}
        {mode === 'create' && (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="your name"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              maxLength={16}
              autoFocus
              className="w-full py-3 px-4 rounded-full bg-transparent border border-gray-700 text-white placeholder-gray-600 outline-none focus:border-white transition text-sm"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setMode(null)}
                className="py-3 px-5 rounded-full border border-gray-700 text-gray-500 text-sm hover:border-gray-500 transition-all active:scale-95"
              >
                ←
              </button>
              <button
                onClick={handleCreate}
                disabled={!name.trim()}
                className="flex-1 py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-30"
              >
                create room
              </button>
            </div>
          </div>
        )}

        {/* Join form */}
        {mode === 'join' && (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="your name"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={16}
              autoFocus
              className="w-full py-3 px-4 rounded-full bg-transparent border border-gray-700 text-white placeholder-gray-600 outline-none focus:border-white transition text-sm"
            />
            <input
              type="text"
              placeholder="room code"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
              maxLength={6}
              className="w-full py-3 px-4 rounded-full bg-transparent border border-gray-700 text-white placeholder-gray-600 outline-none focus:border-white transition text-sm tracking-widest font-mono text-center"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setMode(null)}
                className="py-3 px-5 rounded-full border border-gray-700 text-gray-500 text-sm hover:border-gray-500 transition-all active:scale-95"
              >
                ←
              </button>
              <button
                onClick={handleJoin}
                disabled={!name.trim() || code.length < 6}
                className="flex-1 py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-30"
              >
                join room
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center py-4 border-t border-gray-900 safe-bottom">
        <span className="text-gray-700 text-xs">hue · v1.0</span>
        <a href="/privacy" className="text-gray-700 text-xs hover:text-gray-500 transition">privacy</a>
      </div>

    </div>
  )
}