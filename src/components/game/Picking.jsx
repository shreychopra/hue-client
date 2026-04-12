import { useState, useEffect, useRef } from 'react'
import ColourWheel from '../ui/ColourWheel'
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

  // Keep a ref so auto-submit always reads the latest colour
  // (state closures in useEffect can go stale — ref never does)
  const hsbRef = useRef(hsb)
  const submittedRef = useRef(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  // When round changes, generate a fresh random colour and reset submission
  useEffect(() => {
    const next = randomHsb()
    setHsb(next)
    hsbRef.current = next
    setSubmitted(false)
    submittedRef.current = false
  }, [state.round])

  // Auto-submit when timer_done fires (timeLeft hits 0)
  useEffect(() => {
    if (state.timeLeft === 0 && !submittedRef.current) {
      actions.submitColour(hsbRef.current)
      setSubmitted(true)
      submittedRef.current = true
    }
  }, [state.timeLeft])

  // Safety net — if phase somehow changes to REVEAL without submission
  useEffect(() => {
    if (state.phase === 'REVEAL' && !submittedRef.current) {
      // Too late to submit but mark as submitted so we don't double-fire
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
  const textDark = hsb.b > 50

  const timerColour = state.timeLeft > 10
    ? 'text-white'
    : state.timeLeft > 5
      ? 'text-amber-400'
      : 'text-red-400'

  return (
    <div
      className="flex flex-col items-center gap-6 transition-all duration-500 px-6 py-8 min-h-screen justify-center overflow-y-auto"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div className="text-center">
        <p className="text-gray-600 text-xs uppercase tracking-widest font-mono mb-2">
          round {state.round} of {state.totalRounds}
        </p>
        <h2 className="text-4xl font-bold text-white">{state.currentWord}</h2>
      </div>

      {!submitted && (
        <p className={`text-3xl font-mono font-light transition-colors ${timerColour}`}>
          {state.timeLeft}
        </p>
      )}

      {!submitted ? (
        <>
          <ColourWheel hsb={hsb} onChange={handleColourChange} />
          <button
            onClick={handleSubmit}
            className="w-64 py-4 rounded-2xl font-semibold text-lg active:scale-95 transition-all"
            style={{
              backgroundColor: hex,
              color: textDark ? '#030712' : '#ffffff'
            }}
          >
            lock it in
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-24 h-24 rounded-3xl shadow-lg"
            style={{ backgroundColor: hex }}
          />
          <p className="text-gray-400">your colour is locked in</p>
          <p className="text-gray-600 text-sm">waiting for others...</p>
        </div>
      )}
    </div>
  )
}