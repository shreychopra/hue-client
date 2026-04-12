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

  return (
    <div
      className="hue-card transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        backgroundColor: submitted ? '#0d0d0d' : hex,
        transition: 'background-color 0.15s ease, opacity 0.5s ease'
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between p-6"
        style={{ color: submitted ? '#4b5563' : textDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.6)' }}
      >
        <span className="text-xs font-mono">
          {state.round} / {state.totalRounds} — <span className="text-white">{state.currentWord}</span>
        </span>
        {!submitted && (
          <ScrollingNumber
            value={state.timeLeft}
            className={`text-sm font-mono ${timerWarning ? 'text-red-400' : ''}`}
          />
        )}
      </div>

      {/* Wheel area */}
      {!submitted ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 pb-6">
          <ColourWheel hsb={hsb} onChange={handleColourChange} />
          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-full text-sm font-medium transition-all active:scale-95"
            style={{
              backgroundColor: textDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)',
              color: textDark ? 'rgba(0,0,0,0.8)' : 'white',
              backdropFilter: 'blur(8px)'
            }}
          >
            lock it in
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 pb-6">
          <div className="w-20 h-20 rounded-2xl shadow-lg" style={{ backgroundColor: hex }} />
          <p className="text-gray-400 text-sm">locked in</p>
          <p className="text-gray-700 text-xs">waiting for others...</p>
        </div>
      )}
    </div>
  )
}