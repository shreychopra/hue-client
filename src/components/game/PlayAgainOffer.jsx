import { useEffect, useState } from 'react'
import { hsbToHex } from '../../utils/colourConvert'

export default function PlayAgainOffer({ state, actions }) {
  const sorted = Object.entries(state.totalScores).sort((a, b) => {
    const diff = b[1] - a[1]
    if (diff !== 0) return diff
    const best = (n) => Math.max(0, ...state.roundHistory.map(r => r.scores[n] ?? 0))
    return best(b[0]) - best(a[0])
  })

  const topScore = sorted[0]?.[1]
  const tiedPlayers = sorted.filter(([, score]) => score === topScore)
  const isTie = tiedPlayers.length > 1
  const tiedNames = tiedPlayers.map(([name]) => name).join(' & ')
  const medals = ['🥇', '🥈', '🥉']

  return (
    <div
      className="hue-card"
      style={{
        animation: 'fadeIn 0.3s ease forwards'
      }}
    >

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 24px 16px', flexShrink: 0 }}>
        <span style={{ color: '#374151', fontSize: 12 }}>hue</span>
        <span style={{ color: '#374151', fontSize: 12, fontStyle: 'italic' }}>no right or wrong answers</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }}>

        <div style={{ marginBottom: 24 }}>
          <h2 style={{ color: 'white', fontSize: 40, fontWeight: 700, margin: 0 }}>game over</h2>
          <p style={{ color: '#6b7280', fontSize: 14, marginTop: 6, fontWeight: 300 }}>
            {isTie ? `${tiedNames} all read the room equally well` : `${tiedNames} read the room best`}
          </p>
        </div>

        {state.roundHistory.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ color: '#374151', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>all rounds</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {state.roundHistory.map((round, i) => {
                const avgHex = hsbToHex(round.average.h, round.average.s, round.average.b)
                const sortedSubs = Object.entries(round.submissions)
                  .sort((a, b) => (round.scores[b[0]] ?? 0) - (round.scores[a[0]] ?? 0))
                return (
                  <div key={i}>
                    <p style={{ color: '#6b7280', fontSize: 12, marginBottom: 8, fontFamily: 'monospace' }}>{i + 1}. {round.word}</p>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {sortedSubs.map(([name, colour]) => {
                        const playerHex = hsbToHex(colour.h, colour.s, colour.b)
                        const score = round.scores[name] ?? 0
                        const isMe = name === state.myName
                        return (
                          <div key={name} style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}>
                            <div style={{ backgroundColor: playerHex, height: 60, position: 'relative', padding: '8px 8px 0' }}>
                              <span style={{ color: 'rgba(255,255,255,0.95)', fontSize: 11, fontFamily: 'monospace', fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>{score}</span>
                              <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 18 }} viewBox="0 0 100 20" preserveAspectRatio="none">
                                <polygon points="0,20 100,0 100,20" fill={avgHex} />
                              </svg>
                            </div>
                            <div style={{ backgroundColor: avgHex, height: 34, display: 'flex', alignItems: 'flex-end', padding: '0 8px 6px' }}>
                              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: isMe ? 700 : 400, textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
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

        <div style={{ marginBottom: 8 }}>
          <p style={{ color: '#374151', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>final scores</p>
          {sorted.map(([name, score], index) => (
            <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #161616' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 16 }}>{medals[index] || `${index + 1}.`}</span>
                <div>
                  <p style={{ color: name === state.myName ? 'white' : '#9ca3af', fontSize: 14, fontWeight: name === state.myName ? 600 : 400, margin: 0 }}>{name}</p>
                  {name === state.myName && <p style={{ color: '#4b5563', fontSize: 11, margin: 0 }}>you</p>}
                </div>
              </div>
              <span style={{ color: 'white', fontSize: 14, fontFamily: 'monospace', fontWeight: 600 }}>{score}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 24px', borderTop: '1px solid #161616', display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }} className="safe-bottom">
        <p style={{ color: '#4b5563', fontSize: 12, textAlign: 'center' }}>the host wants to play again</p>
        <button onClick={actions.joinNextGame} style={{ width: '100%', padding: '13px', borderRadius: 999, background: 'white', color: 'black', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>join next game</button>
        <button onClick={actions.leaveRoom} style={{ width: '100%', padding: '13px', borderRadius: 999, background: 'transparent', border: '1px solid #222', color: '#6b7280', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>exit to home</button>
      </div>
    </div>
  )
}