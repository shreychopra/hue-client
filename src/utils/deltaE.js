import { hsbToLab } from './colourConvert'

// CIE76 Delta-E formula
// Measures perceptual difference between two Lab colours
// 0 = identical, 100+ = maximally different
function deltaE(lab1, lab2) {
  return Math.sqrt(
    Math.pow(lab1.l - lab2.l, 2) +
    Math.pow(lab1.a - lab2.a, 2) +
    Math.pow(lab1.b - lab2.b, 2)
  )
}

// Takes an array of HSB colour objects: [{ h, s, b }, { h, s, b }, ...]
// Returns the group average HSB colour
export function getAverageColour(colours) {
  const avg = colours.reduce(
    (acc, c) => ({ h: acc.h + c.h, s: acc.s + c.s, b: acc.b + c.b }),
    { h: 0, s: 0, b: 0 }
  )
  return {
    h: avg.h / colours.length,
    s: avg.s / colours.length,
    b: avg.b / colours.length
  }
}

// Takes a single player's HSB colour and the group average HSB colour
// Returns a score from 0 to 100
export function scoreColour(playerColour, averageColour) {
  const playerLab = hsbToLab(playerColour.h, playerColour.s, playerColour.b)
  const averageLab = hsbToLab(averageColour.h, averageColour.s, averageColour.b)

  const distance = deltaE(playerLab, averageLab)

  // Delta-E of 100 is about as different as colours get perceptually
  // We clamp it at 100 and invert so closer = higher score
  const score = Math.max(0, 100 - distance)
  return Math.round(score)
}