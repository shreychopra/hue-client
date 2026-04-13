import { useState, useEffect, useRef } from 'react'
import ColourWheel from '../ui/ColourWheel'
import ScrollingNumber from '../ui/ScrollingNumber'
import { hsbToHex } from '../../utils/colourConvert'

function randomHsb() {
  return {
    h: Math.random() * 360,
    s: 40 + Math.random() * 40,
    b: 60 + Math.random() * 30
  }
}

export default function Picking({ state, actions }) {
  const [hsb, setHsb] = useState(randomHsb)
  const [submitted, setSubmitted] = useState(false)
  const [visible, setVisible] = useState(false)
  const hsbRef = useRef(hsb)
  const submittedRef = useRef(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const next = randomHsb()
    setHsb(next)
    hsbRef.current = next
    setSubmitted(false)
    submittedRef.current = false
  }, [state.round])

  useEffect(() => {
    if (state.timeLeft === 0 && !submittedRef.current) {
      actions.submitColour(hsbRef.current)
      setSubmitted(true)
      submittedRef.current = true
    }
  }, [state.timeLeft])

  useEffect(() => {
    if (state.phase === 'REVEAL' && !submittedRef.current) {
      submittedRef.current = true
      setSubmitted(true)
    }
  }, [state.phase])

  const handleColourChange = (newHsb) => {
    setHsb(newHsb)
    hsbRef.current = newHsb
  }

  const handleSubmit = () => {
    if (submittedRef.current) return
    actions.submitColour(hsbRef.current)
    setSubmitted(true)
    submittedRef.current = true
  }

  const hex = hsbToHex(hsb.h, hsb.s, hsb.b)
  const textDark = hsb.b > 55
  const timerWarning = state.timeLeft <= 5
  const textColour = submitted ? '#6b7280' : textDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)'

  return (
    <div
      className="hue-card"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s ease, background-color 0.15s ease',
        backgroundColor: submitted ? '#0d0d0d' : hex,
        minHeight: 480
      }}
    >
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 28px' }}>
        <span style={{ color: textColour, fontSize: 12, fontFamily: 'monospace' }}>
          {state.round} / {state.totalRounds}
        </span>
        <span style={{ color: submitted ? '#6b7280' : textDark ? 'rgba(0,0,0,0.7)' : 'white', fontSize: 16, fontWeight: 600 }}>
          {state.currentWord}
        </span>
        {!submitted ? (
          <ScrollingNumber
            value={state.timeLeft}
            className="font-mono"
            style={{ color: timerWarning ? '#f87171' : textColour, fontSize: 12 }}
          />
        ) : (
          <span style={{ width: 24 }} />
        )}
      </div>

      {/* Content */}
      {!submitted ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '0 28px' }}>
          <ColourWheel hsb={hsb} onChange={handleColourChange} />
          <button
            onClick={handleSubmit}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 999,
              border: 'none',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              backgroundColor: textDark ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.18)',
              color: textDark ? 'rgba(0,0,0,0.8)' : 'white',
              backdropFilter: 'blur(8px)'
            }}
          >
            lock it in
          </button>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <div style={{ width: 80, height: 80, borderRadius: 20, backgroundColor: hex, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }} />
          <p style={{ color: '#9ca3af', fontSize: 14 }}>locked in</p>
          <p style={{ color: '#4b5563', fontSize: 13 }}>waiting for others...</p>
        </div>
      )}

      <div style={{ height: 24 }} className="safe-bottom" />
    </div>
  )
}