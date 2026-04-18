import { useState } from 'react'

export default function Lobby({ state, actions }) {
  const [copied, setCopied] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  const handleShareLink = () => {
    const url = `${window.location.origin}/join/${state.roomCode}`
    if (navigator.share) {
      navigator.share({ title: 'join my hue game', url })
    } else {
      navigator.clipboard.writeText(url)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    }
  }
  const canStart = state.players.length >= 2 && state.isHost

  const handleCopy = () => {
    navigator.clipboard.writeText(state.roomCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="hue-card">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 28px 20px' }}>
        <span style={{ color: 'white', fontWeight: 700, fontSize: 22 }}>hue</span>
        <button onClick={actions.leaveRoom} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          leave ←
        </button>
      </div>

      {state.error && (
        <div style={{ margin: '0 28px 16px', padding: '12px 16px', background: '#1a0a0a', border: '1px solid #3b1515', borderRadius: 12, color: '#f87171', fontSize: 13 }}>
          {state.error}
        </div>
      )}

      {/* Room code */}
      <div style={{ margin: '0 28px 20px' }}>
        <div
          onClick={handleCopy}
          style={{ padding: '16px 20px', background: '#141414', borderRadius: 16, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}
        >
          <div>
            <p style={{ color: '#4b5563', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 4px' }}>room code</p>
            <p style={{ color: 'white', fontSize: 28, fontFamily: 'monospace', fontWeight: 700, letterSpacing: 4, margin: 0 }}>{state.roomCode}</p>
          </div>
          <span style={{ color: '#4b5563', fontSize: 12 }}>{copied ? '✓ copied' : 'tap to copy'}</span>
        </div>
        <button
          onClick={handleShareLink}
          style={{ width: '100%', padding: '11px', borderRadius: 999, border: '1px solid #1f1f1f', background: 'transparent', color: '#6b7280', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          {linkCopied ? '✓ link copied' : 'share invite link'}
        </button>
      </div>

      {/* Players */}
      <div style={{ padding: '0 28px', flex: 1 }}>
        <p style={{ color: '#4b5563', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
          {state.players.length} / 8 players
        </p>
        {state.players.map((player, index) => (
          <div key={player.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #141414' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: playerColour(index) }} />
              <span style={{ color: 'white', fontSize: 14, fontWeight: 500 }}>{player.name}</span>
            </div>
            {player.id === state.hostId && <span style={{ color: '#374151', fontSize: 11, fontFamily: 'monospace' }}>host</span>}
          </div>
        ))}
        {state.players.length < 2 && (
          <p style={{ color: '#374151', fontSize: 13, marginTop: 12 }}>waiting for more players...</p>
        )}
      </div>

      {/* Bottom */}
      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 10 }} className="safe-bottom">
        {state.isHost ? (
          <>
            <button
              onClick={actions.startGame}
              disabled={!canStart}
              style={{ width: '100%', padding: '14px', borderRadius: 999, background: 'white', color: 'black', fontSize: 14, fontWeight: 600, border: 'none', cursor: canStart ? 'pointer' : 'not-allowed', opacity: canStart ? 1 : 0.25, fontFamily: 'inherit' }}
            >
              start game
            </button>
            {!canStart && <p style={{ color: '#4b5563', fontSize: 12, textAlign: 'center' }}>need at least 2 players</p>}
          </>
        ) : (
          <p style={{ color: '#6b7280', fontSize: 13, textAlign: 'center' }}>waiting for host to start...</p>
        )}
        <div style={{ textAlign: 'center', marginTop: 4 }}>
          <p style={{ color: '#374151', fontSize: 12, fontStyle: 'italic' }}>no right or wrong answers</p>
        </div>
      </div>

    </div>
  )
}

function playerColour(index) {
  const colours = ['#60a5fa', '#f472b6', '#34d399', '#fbbf24', '#a78bfa', '#fb923c', '#22d3ee', '#f87171']
  return colours[index % colours.length]
}