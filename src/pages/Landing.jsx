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
    <div className="hue-card">
      <div style={{ flex: 1, padding: '48px 36px 24px' }}>

        <h1 style={{ fontSize: 64, fontWeight: 700, color: 'white', lineHeight: 1, marginBottom: 24 }}>
          hue
        </h1>

        <p style={{ color: '#6b7280', fontSize: 15, lineHeight: 1.6, marginBottom: 8 }}>
          you're shown a word. pick the colour it makes you feel.
          the closer you are to your group's instinct, the higher you score.
        </p>
        <p style={{ color: '#4b5563', fontSize: 14, fontStyle: 'italic', marginBottom: 32 }}>
          no right or wrong answers.
        </p>

        {state.error && (
          <p style={{ color: '#f87171', fontSize: 13, marginBottom: 16 }}>{state.error}</p>
        )}

        {!mode && (
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setMode('create')} style={pillBtn('outline')}>
              create room
            </button>
            <button onClick={() => setMode('join')} style={pillBtn('outline-dim')}>
              join room
            </button>
          </div>
        )}

        {mode === 'create' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="text"
              placeholder="your name"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              maxLength={16}
              autoFocus
              style={inputStyle}
            />
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setMode(null)} style={{ ...pillBtn('ghost'), width: 48 }}>←</button>
              <button
                onClick={handleCreate}
                disabled={!name.trim()}
                style={{ ...pillBtn('filled'), flex: 1, opacity: name.trim() ? 1 : 0.3 }}
              >
                create room
              </button>
            </div>
          </div>
        )}

        {mode === 'join' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="text"
              placeholder="your name"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={16}
              autoFocus
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="room code"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
              maxLength={6}
              style={{ ...inputStyle, textAlign: 'center', letterSpacing: 6, fontFamily: 'monospace' }}
            />
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setMode(null)} style={{ ...pillBtn('ghost'), width: 48 }}>←</button>
              <button
                onClick={handleJoin}
                disabled={!name.trim() || code.length < 6}
                style={{ ...pillBtn('filled'), flex: 1, opacity: (name.trim() && code.length === 6) ? 1 : 0.3 }}
              >
                join room
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{
        padding: '16px 36px',
        borderTop: '1px solid #1a1a1a',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }} className="safe-bottom">
        <span style={{ color: '#374151', fontSize: 12 }}>hue · v1.0</span>
        <a href="/privacy" style={{ color: '#374151', fontSize: 12, textDecoration: 'none' }}>privacy</a>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: 999,
  border: '1px solid #2a2a2a',
  background: 'transparent',
  color: 'white',
  fontSize: 14,
  outline: 'none',
}

function pillBtn(variant) {
  const base = {
    padding: '12px 20px',
    borderRadius: 999,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    border: 'none',
    transition: 'opacity 0.15s',
    fontFamily: 'inherit',
  }
  if (variant === 'filled') return { ...base, background: 'white', color: 'black' }
  if (variant === 'outline') return { ...base, background: 'transparent', border: '1px solid white', color: 'white' }
  if (variant === 'outline-dim') return { ...base, background: 'transparent', border: '1px solid #374151', color: '#9ca3af' }
  if (variant === 'ghost') return { ...base, background: 'transparent', border: '1px solid #2a2a2a', color: '#6b7280' }
  return base
}