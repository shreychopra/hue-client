import { useRef, useEffect, useCallback } from 'react'
import { hsbToHex } from '../../utils/colourConvert'

const SIZE = 240
const CENTER = SIZE / 2
const RING_OUTER = SIZE / 2
const RING_INNER = SIZE / 2 - 28

export default function ColourWheel({ hsb, onChange }) {
  const canvasRef = useRef(null)
  const isDragging = useRef(false)

  // Draw hue ring only — saturation and brightness handled by sliders
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, SIZE, SIZE)

    for (let angle = 0; angle < 360; angle += 0.5) {
      const rad = (angle - 90) * (Math.PI / 180)
      const x1 = CENTER + RING_INNER * Math.cos(rad)
      const y1 = CENTER + RING_INNER * Math.sin(rad)
      const x2 = CENTER + RING_OUTER * Math.cos(rad)
      const y2 = CENTER + RING_OUTER * Math.sin(rad)

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.strokeStyle = hsbToHex(angle, 100, 100)
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }, [])

  const angleToHue = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = clientX - rect.left - rect.width / 2
    const y = clientY - rect.top - rect.height / 2
    const angle = Math.atan2(y, x) * (180 / Math.PI) + 90
    return (angle + 360) % 360
  }, [])

  const isOnRing = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scale = SIZE / rect.width
    const x = (clientX - rect.left) * scale - CENTER
    const y = (clientY - rect.top) * scale - CENTER
    const dist = Math.sqrt(x * x + y * y)
    return dist >= RING_INNER - 8 && dist <= RING_OUTER + 8
  }, [])

  const handleHueInteraction = useCallback((clientX, clientY) => {
    if (!isOnRing(clientX, clientY)) return
    const h = angleToHue(clientX, clientY)
    onChange({ ...hsb, h })
  }, [hsb, onChange, angleToHue, isOnRing])

  // Mouse events
  const handleMouseDown = (e) => {
    if (!isOnRing(e.clientX, e.clientY)) return
    isDragging.current = true
    handleHueInteraction(e.clientX, e.clientY)
  }
  const handleMouseMove = (e) => {
    if (!isDragging.current) return
    handleHueInteraction(e.clientX, e.clientY)
  }
  const handleMouseUp = () => { isDragging.current = false }

  // Touch events
  useEffect(() => {
    const canvas = canvasRef.current
    const onTouchStart = (e) => {
      e.preventDefault()
      isDragging.current = true
      handleHueInteraction(e.touches[0].clientX, e.touches[0].clientY)
    }
    const onTouchMove = (e) => {
      e.preventDefault()
      if (!isDragging.current) return
      handleHueInteraction(e.touches[0].clientX, e.touches[0].clientY)
    }
    const onTouchEnd = () => { isDragging.current = false }

    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd)
    return () => {
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
    }
  }, [handleHueInteraction])

  // Selector dot position — sits on the outer edge of the ring
  const dotRad = (hsb.h - 90) * (Math.PI / 180)
  const dotRadius = (RING_INNER + RING_OUTER) / 2
  const dotX = CENTER + dotRadius * Math.cos(dotRad)
  const dotY = CENTER + dotRadius * Math.sin(dotRad)
  const dotPercX = (dotX / SIZE) * 100
  const dotPercY = (dotY / SIZE) * 100

  const currentHex = hsbToHex(hsb.h, hsb.s, hsb.b)
  const hueOnlyHex = hsbToHex(hsb.h, 100, 100)
  const satGradient = `linear-gradient(to right, ${hsbToHex(hsb.h, 0, hsb.b)}, ${hsbToHex(hsb.h, 100, hsb.b)})`
  const briGradient = `linear-gradient(to right, #000000, ${hsbToHex(hsb.h, hsb.s, 100)})`

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>

      {/* Colour preview */}
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        backgroundColor: currentHex,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.1)`
      }} />

      {/* Hue ring */}
      <div style={{ position: 'relative', width: '100%', maxWidth: SIZE, aspectRatio: '1 / 1' }}>
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          style={{ width: '100%', height: '100%', display: 'block', cursor: 'pointer', borderRadius: '50%' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        {/* Selector dot on ring */}
        <div style={{
          position: 'absolute',
          width: 20, height: 20,
          borderRadius: '50%',
          backgroundColor: hueOnlyHex,
          border: '3px solid white',
          boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
          pointerEvents: 'none',
          left: `${dotPercX}%`,
          top: `${dotPercY}%`,
          transform: 'translate(-50%, -50%)'
        }} />
        {/* Centre colour preview circle */}
        <div style={{
          position: 'absolute',
          width: `${(RING_INNER / SIZE) * 2 * 100 - 4}%`,
          aspectRatio: '1 / 1',
          borderRadius: '50%',
          backgroundColor: currentHex,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          transition: 'background-color 0.1s ease'
        }} />
      </div>

      {/* Saturation slider */}
      <div style={{ width: '100%', maxWidth: SIZE, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, fontFamily: 'monospace' }}>
            saturation
          </label>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, fontFamily: 'monospace' }}>
            {Math.round(hsb.s)}%
          </span>
        </div>
        <div style={{ position: 'relative', width: '100%', height: 28, display: 'flex', alignItems: 'center' }}>
          <div style={{
            position: 'absolute', width: '100%', height: 6,
            borderRadius: 3, background: satGradient
          }} />
          <input
            type="range" min="0" max="100" step="1"
            value={Math.round(hsb.s)}
            onChange={e => onChange({ ...hsb, s: Number(e.target.value) })}
            style={{ position: 'absolute', width: '100%', appearance: 'none', WebkitAppearance: 'none', background: 'transparent', cursor: 'pointer', margin: 0 }}
            className="brightness-slider"
          />
        </div>
      </div>

      {/* Brightness slider */}
      <div style={{ width: '100%', maxWidth: SIZE, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, fontFamily: 'monospace' }}>
            brightness
          </label>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, fontFamily: 'monospace' }}>
            {Math.round(hsb.b)}%
          </span>
        </div>
        <div style={{ position: 'relative', width: '100%', height: 28, display: 'flex', alignItems: 'center' }}>
          <div style={{
            position: 'absolute', width: '100%', height: 6,
            borderRadius: 3, background: briGradient
          }} />
          <input
            type="range" min="0" max="100" step="1"
            value={Math.round(hsb.b)}
            onChange={e => onChange({ ...hsb, b: Number(e.target.value) })}
            style={{ position: 'absolute', width: '100%', appearance: 'none', WebkitAppearance: 'none', background: 'transparent', cursor: 'pointer', margin: 0 }}
            className="brightness-slider"
          />
        </div>
      </div>

    </div>
  )
}