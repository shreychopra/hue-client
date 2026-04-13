import { hsbToLab } from './colourConvert'

export function getAverageColour(colours) {
  // Average in Lab space for perceptual correctness
  const labColours = colours.map(c => hsbToLab(c.h, c.s, c.b))
  const avgLab = {
    l: labColours.reduce((sum, c) => sum + c.l, 0) / labColours.length,
    a: labColours.reduce((sum, c) => sum + c.a, 0) / labColours.length,
    b: labColours.reduce((sum, c) => sum + c.b, 0) / labColours.length
  }
  return avgLab // returns Lab, not HSB
}

export function scoreColour(playerColour, averageLab) {
  const playerLab = hsbToLab(playerColour.h, playerColour.s, playerColour.b)
  const distance = deltaE(playerLab, averageLab)
  return Math.round(Math.max(0, 100 - distance))
}

function deltaE(lab1, lab2) {
  return Math.sqrt(
    Math.pow(lab1.l - lab2.l, 2) +
    Math.pow(lab1.a - lab2.a, 2) +
    Math.pow(lab1.b - lab2.b, 2)
  )
}