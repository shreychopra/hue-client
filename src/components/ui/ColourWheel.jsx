import { useRef, useEffect, useState, useCallback } from 'react'
import { hsbToHex } from '../../utils/colourConvert'

const WHEEL_SIZE = 260
const RADIUS = WHEEL_SIZE / 2

export default function ColourWheel({ hsb, onChange }) {
  const canvasRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  // Draw the wheel whenever brightness changes
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    for (let x = 0; x < WHEEL_SIZE; x++) {
      for (let y = 0; y < WHEEL_SIZE; y++) {
        const dx = x - RADIUS
        const dy = y - RADIUS
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance <= RADIUS) {
          const angle = Math.atan2(dy, dx) * (180 / Math.PI)
          const hue = (angle + 360) % 360
          const saturation = (distance / RADIUS) * 100
          ctx.fillStyle = hsbToHex(hue, saturation, hsb.b)
          ctx.fillRect(x, y, 1, 1)
        }
      }
    }
  }, [hsb.b])

  const positionToHsb = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    const dx = x - RADIUS
    const dy = y - RADIUS
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance > RADIUS) return null
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)
    return {
      h: (angle + 360) % 360,
      s: (distance / RADIUS) * 100,
      b: hsb.b
    }
  }, [hsb.b])

  const handleInteraction = useCallback((clientX, clientY) => {
    const newHsb = positionToHsb(clientX, clientY)
    if (!newHsb) return
    onChange(newHsb)
  }, [positionToHsb, onChange])

  const handleMouseDown = (e) => { setIsDragging(true); handleInteraction(e.clientX, e.clientY) }
  const handleMouseMove = (e) => { if (!isDragging) return; handleInteraction(e.clientX, e.clientY) }
  const handleMouseUp = () => setIsDragging(false)
  const handleTouchStart = (e) => { setIsDragging(true); handleInteraction(e.touches[0].clientX, e.touches[0].clientY) }
  const handleTouchMove = (e) => { if (!isDragging) return; handleInteraction(e.touches[0].clientX, e.touches[0].clientY) }
  const handleTouchEnd = () => setIsDragging(false)

  const handleBrightness = (e) => {
    onChange({ ...hsb, b: Number(e.target.value) })
  }

  const currentHex = hsbToHex(hsb.h, hsb.s, hsb.b)
  const dotAngle = hsb.h * (Math.PI / 180)
  const dotDistance = (hsb.s / 100) * RADIUS
  const dotX = RADIUS + dotDistance * Math.cos(dotAngle)
  const dotY = RADIUS + dotDistance * Math.sin(dotAngle)

  return (
    <div className="flex flex-col items-center gap-4 w-full">


      <div className="relative w-full max-w-[260px] aspect-square mx-auto">
        <canvas
          ref={canvasRef}
          width={WHEEL_SIZE}
          height={WHEEL_SIZE}
          className="rounded-full cursor-crosshair w-full h-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
        <div
          className="absolute w-5 h-5 rounded-full border-2 border-white shadow-md pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{ left: dotX, top: dotY, backgroundColor: currentHex }}
        />
      </div>

      <div className="w-full flex flex-col items-center gap-2">
        <label className="text-xs text-gray-600 uppercase tracking-widest">Brightness</label>
        <div className="relative w-64 h-5 flex items-center">
          <div
            className="absolute w-full h-2 rounded-full"
            style={{
              background: `linear-gradient(to right, #000000, ${hsbToHex(hsb.h, hsb.s, 100)})`
            }}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={hsb.b}
            onChange={handleBrightness}
            className="absolute w-full appearance-none bg-transparent cursor-pointer brightness-slider"
          />
        </div>
      </div>

    </div>
  )
}