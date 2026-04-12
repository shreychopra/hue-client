// HSB (Hue, Saturation, Brightness) → RGB
// H: 0-360, S: 0-100, B: 0-100
// Returns { r, g, b } each 0-255
export function hsbToRgb(h, s, b) {
  s /= 100
  b /= 100

  const k = (n) => (n + h / 60) % 6
  const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)))

  return {
    r: Math.round(f(5) * 255),
    g: Math.round(f(3) * 255),
    b: Math.round(f(1) * 255)
  }
}

// RGB → Hex string e.g. "#ff4e00"
export function rgbToHex({ r, g, b }) {
  return '#' + [r, g, b]
    .map(v => v.toString(16).padStart(2, '0'))
    .join('')
}

// HSB → Hex (convenience function combining the two above)
export function hsbToHex(h, s, b) {
  return rgbToHex(hsbToRgb(h, s, b))
}

// RGB → XYZ (needed for Delta-E calculation later)
// Uses sRGB colour space
export function rgbToXyz({ r, g, b }) {
  let rr = r / 255
  let gg = g / 255
  let bb = b / 255

  rr = rr > 0.04045 ? Math.pow((rr + 0.055) / 1.055, 2.4) : rr / 12.92
  gg = gg > 0.04045 ? Math.pow((gg + 0.055) / 1.055, 2.4) : gg / 12.92
  bb = bb > 0.04045 ? Math.pow((bb + 0.055) / 1.055, 2.4) : bb / 12.92

  rr *= 100
  gg *= 100
  bb *= 100

  return {
    x: rr * 0.4124 + gg * 0.3576 + bb * 0.1805,
    y: rr * 0.2126 + gg * 0.7152 + bb * 0.0722,
    z: rr * 0.0193 + gg * 0.1192 + bb * 0.9505
  }
}

// XYZ → Lab (perceptual colour space, also needed for Delta-E)
export function xyzToLab({ x, y, z }) {
  // D65 illuminant reference values
  x /= 95.047
  y /= 100.000
  z /= 108.883

  const f = (t) => t > 0.008856
    ? Math.pow(t, 1 / 3)
    : (7.787 * t) + (16 / 116)

  return {
    l: (116 * f(y)) - 16,
    a: 500 * (f(x) - f(y)),
    b: 200 * (f(y) - f(z))
  }
}

// Convenience: HSB → Lab directly
export function hsbToLab(h, s, b) {
  return xyzToLab(rgbToXyz(hsbToRgb(h, s, b)))
}