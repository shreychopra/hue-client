import { useEffect, useState } from 'react'
import { hsbToHex } from '../../utils/colourConvert'

export default function Reveal({ state, actions }) {
  const isLastRound = state.round >= state.totalRounds
  const avgHex = state.averageColour
    ? hsbToHex(state.averageColour.h, state.averageColour.s, state.averageColour.b)
    : '#555'

  const sortedSubmissions = Object.entries(state.submissions)
    .sort((a, b) => {
      const diff = (state.roundScores[b[0]] ?? 0) - (state.roundScores[a[0]] ?? 0)
      return diff !== 0 ? diff : a[0].localeCompare(b[0])
    })

  const sortedScores = Object.entries(state.totalScores)
    .sort((a, b) => b[1] - a[1])

  return (
    <div
      className="hue-card"
      style={{
        animation: 'fadeIn 0.3s ease forwards'
      }}
    >

      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px 16px' }}>
        <span style={{ color: '#4b5563', fontSize: 12, fontFamily: 'monospace' }}>{state.round} / {state.totalRounds}</span>
        <span style={{ color: '#e5e7eb', fontSize: 15, fontWeight: 600 }}>{state.currentWord}</span>
        <span style={{ color: '#374151', fontSize: 12 }}>hue</span>
      </div>

      {/* Colour strips */}
      <div style={{ display: 'flex', gap: 8, padding: '0 24px' }}>
        {sortedSubmissions.map(([name, colour]) => {
          const playerHex = hsbToHex(colour.h, colour.s, colour.b)
          const score = state.roundScores[name] ?? 0
          const isMe = name === state.myName
          return (
            <div key={name} style={{ flex: 1, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ backgroundColor: playerHex, height: 90, position: 'relative', padding: '10px 10px 0' }}>
                <span style={{ color: 'rgba(255,255,255,0.95)', fontSize: 13, fontFamily: 'monospace', fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
                  {score}
                </span>
                <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 22 }} viewBox="0 0 100 20" preserveAspectRatio="none">
                  <polygon points="0,20 100,0 100,20" fill={avgHex} />
                </svg>
              </div>
              <div style={{ backgroundColor: avgHex, height: 44, display: 'flex', alignItems: 'flex-end', padding: '0 10px 8px' }}>
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: isMe ? 700 : 400, textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                  {name}{isMe ? ' ·' : ''}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Scores */}
      <div style={{ padding: '20px 24px 8px' }}>
        <p style={{ color: '#374151', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>scores</p>
        {sortedScores.map(([name, score], index) => (
          <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #161616' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: '#374151', fontSize: 11, fontFamily: 'monospace', width: 14 }}>{index + 1}</span>
              <div>
                <p style={{ color: name === state.myName ? 'white' : '#9ca3af', fontSize: 14, fontWeight: name === state.myName ? 600 : 400, margin: 0 }}>
                  {name}
                </p>
                {name === state.myName && <p style={{ color: '#4b5563', fontSize: 11, margin: 0 }}>you</p>}
              </div>
            </div>
            <span style={{ color: 'white', fontSize: 14, fontFamily: 'monospace', fontWeight: 600 }}>{score}</span>
          </div>
        ))}
      </div>

      {/* Button */}
      <div style={{ padding: '16px 24px' }} className="safe-bottom">
        {state.isHost ? (
          <button
            onClick={actions.nextRound}
            style={{ width: '100%', padding: '14px', borderRadius: 999, background: 'white', color: 'black', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {isLastRound ? 'see final results' : 'next round →'}
          </button>
        ) : (
          <p style={{ color: '#6b7280', fontSize: 13, textAlign: 'center' }}>waiting for host...</p>
        )}
      </div>
    </div>
  )
}