import { useRef, useEffect, useState, useCallback } from 'react'
import { hsbToHex } from '../../utils/colourConvert'

const WHEEL_SIZE = 260
const RADIUS = WHEEL_SIZE / 2

export default function ColourWheel({ hsb, onChange }) {
  const canvasRef = useRef(null)
  const isDragging = useRef(false)

  // Draw wheel whenever brightness changes
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

  // Use ref-based touch listeners with passive: false to prevent scroll
  useEffect(() => {
    const canvas = canvasRef.current

    const onTouchStart = (e) => {
      e.preventDefault()
      isDragging.current = true
      handleInteraction(e.touches[0].clientX, e.touches[0].clientY)
    }

    const onTouchMove = (e) => {
      e.preventDefault()
      if (!isDragging.current) return
      handleInteraction(e.touches[0].clientX, e.touches[0].clientY)
    }

    const onTouchEnd = () => {
      isDragging.current = false
    }

    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd)

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
    }
  }, [handleInteraction])

  // Mouse events (desktop)
  const handleMouseDown = (e) => {
    isDragging.current = true
    handleInteraction(e.clientX, e.clientY)
  }

  const handleMouseMove = (e) => {
    if (!isDragging.current) return
    handleInteraction(e.clientX, e.clientY)
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

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
        />
        <div
          className="absolute w-5 h-5 rounded-full border-2 border-white shadow-md pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{ left: dotX, top: dotY, backgroundColor: currentHex }}
        />
      </div>

      <div className="w-full flex flex-col items-center gap-2">
        <label className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
          brightness
        </label>
        <div className="relative w-full max-w-[260px] h-5 flex items-center">
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