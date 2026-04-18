import { useEffect, useState } from 'react'

export default function RoundStart({ state }) {
  return (
    <div className="hue-card" style={{ minHeight: 360, justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '24px 28px' }}>
        <span style={{ color: '#4b5563', fontSize: 12, fontFamily: 'monospace' }}>{state.round} / {state.totalRounds}</span>
        <span style={{ color: '#374151', fontSize: 12 }}>hue</span>
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '0 28px', animation: 'fadeIn 0.3s ease forwards'
      }}>
        <h2 style={{ fontSize: 56, fontWeight: 700, color: 'white', textAlign: 'center', lineHeight: 1.1 }}>
          {state.currentWord}
        </h2>
        <p style={{ color: '#6b7280', fontSize: 14, marginTop: 16, fontWeight: 300 }}>
          what colour does this feel like?
        </p>
      </div>

      <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#374151', animation: 'pulse 2s infinite' }} />
        <span style={{ color: '#374151', fontSize: 12 }}>get ready</span>
      </div>
    </div>
  )
}