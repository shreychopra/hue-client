import { useRef, useEffect, useCallback } from 'react'
import { hsbToHex } from '../../utils/colourConvert'

const WHEEL_SIZE = 240

export default function ColourWheel({ hsb, onChange }) {
  const canvasRef = useRef(null)
  const isDragging = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const R = WHEEL_SIZE / 2

    for (let x = 0; x < WHEEL_SIZE; x++) {
      for (let y = 0; y < WHEEL_SIZE; y++) {
        const dx = x - R
        const dy = y - R
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist <= R) {
          const angle = Math.atan2(dy, dx) * (180 / Math.PI)
          ctx.fillStyle = hsbToHex((angle + 360) % 360, (dist / R) * 100, hsb.b)
          ctx.fillRect(x, y, 1, 1)
        }
      }
    }
  }, [hsb.b])

  const positionToHsb = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = WHEEL_SIZE / rect.width
    const scaleY = WHEEL_SIZE / rect.height
    const x = (clientX - rect.left) * scaleX
    const y = (clientY - rect.top) * scaleY
    const R = WHEEL_SIZE / 2
    const dx = x - R
    const dy = y - R
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist > R) return null
    return {
      h: (Math.atan2(dy, dx) * (180 / Math.PI) + 360) % 360,
      s: (dist / R) * 100,
      b: hsb.b
    }
  }, [hsb.b])

  const handleInteraction = useCallback((clientX, clientY) => {
    const newHsb = positionToHsb(clientX, clientY)
    if (newHsb) onChange(newHsb)
  }, [positionToHsb, onChange])

  const handleMouseDown = (e) => { isDragging.current = true; handleInteraction(e.clientX, e.clientY) }
  const handleMouseMove = (e) => { if (isDragging.current) handleInteraction(e.clientX, e.clientY) }
  const handleMouseUp = () => { isDragging.current = false }

  useEffect(() => {
    const canvas = canvasRef.current
    const onTouchStart = (e) => { e.preventDefault(); isDragging.current = true; handleInteraction(e.touches[0].clientX, e.touches[0].clientY) }
    const onTouchMove = (e) => { e.preventDefault(); if (isDragging.current) handleInteraction(e.touches[0].clientX, e.touches[0].clientY) }
    const onTouchEnd = () => { isDragging.current = false }
    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd)
    return () => {
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
    }
  }, [handleInteraction])

  const currentHex = hsbToHex(hsb.h, hsb.s, hsb.b)
  const R = WHEEL_SIZE / 2
  const dotAngle = hsb.h * (Math.PI / 180)
  const dotDist = (hsb.s / 100) * R
  const dotX = (R + dotDist * Math.cos(dotAngle)) / WHEEL_SIZE * 100
  const dotY = (R + dotDist * Math.sin(dotAngle)) / WHEEL_SIZE * 100

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>

      {/* Wheel */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 240, aspectRatio: '1 / 1' }}>
        <canvas
          ref={canvasRef}
          width={WHEEL_SIZE}
          height={WHEEL_SIZE}
          style={{ width: '100%', height: '100%', borderRadius: '50%', cursor: 'crosshair', display: 'block' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        <div style={{
          position: 'absolute',
          width: 18, height: 18,
          borderRadius: '50%',
          border: '2px solid white',
          backgroundColor: currentHex,
          boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
          pointerEvents: 'none',
          left: `${dotX}%`,
          top: `${dotY}%`,
          transform: 'translate(-50%, -50%)'
        }} />
      </div>

      {/* Brightness slider — fully contained */}
      <div style={{ width: '100%', maxWidth: 240, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center' }}>
          brightness
        </label>
        <div style={{ position: 'relative', width: '100%', height: 28, display: 'flex', alignItems: 'center' }}>
          <div style={{
            position: 'absolute', width: '100%', height: 6, borderRadius: 3,
            background: `linear-gradient(to right, #000, ${hsbToHex(hsb.h, hsb.s, 100)})`
          }} />
          <input
            type="range"
            min="0"
            max="100"
            value={hsb.b}
            onChange={e => onChange({ ...hsb, b: Number(e.target.value) })}
            style={{ position: 'absolute', width: '100%', appearance: 'none', WebkitAppearance: 'none', background: 'transparent', cursor: 'pointer', margin: 0 }}
            className="brightness-slider"
          />
        </div>
      </div>

    </div>
  )
}