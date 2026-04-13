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
  const isDark = hsb.b < 45
  const textOnColour = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.55)'
  const timerWarning = state.timeLeft <= 5

  return (
    <div
      className="hue-card"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease, background-color 0.15s ease',
        backgroundColor: submitted ? '#0d0d0d' : hex,
      }}
    >
      {/* Top bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 24px'
      }}>
        <span style={{ color: submitted ? '#4b5563' : textOnColour, fontSize: 12, fontFamily: 'monospace' }}>
          {state.round} / {state.totalRounds}
        </span>
        <span style={{ color: submitted ? '#9ca3af' : isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.75)', fontSize: 15, fontWeight: 600 }}>
          {state.currentWord}
        </span>
        {!submitted
          ? <span style={{ color: timerWarning ? '#f87171' : submitted ? '#4b5563' : textOnColour, fontSize: 12, fontFamily: 'monospace' }}>
              {state.timeLeft}
            </span>
          : <span style={{ width: 24 }} />
        }
      </div>

      {/* Wheel or submitted state */}
      {!submitted ? (
        <div style={{ padding: '8px 24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <ColourWheel hsb={hsb} onChange={handleColourChange} />
          <button
            onClick={handleSubmit}
            style={{
              width: '100%', padding: '14px', borderRadius: 999, border: 'none',
              fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
              color: isDark ? 'white' : 'rgba(0,0,0,0.75)',
            }}
          >
            lock it in
          </button>
          <div style={{ height: 8 }} />
        </div>
      ) : (
        <div style={{ padding: '48px 24px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 80, height: 80, borderRadius: 20, backgroundColor: hex, boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }} />
          <p style={{ color: '#9ca3af', fontSize: 14 }}>locked in</p>
          <p style={{ color: '#4b5563', fontSize: 13 }}>waiting for others...</p>
        </div>
      )}
    </div>
  )
}