import { getAverageColour, scoreColour } from './deltaE'

// Takes the submissions object from the server:
// { playerName: { h, s, b }, playerName: { h, s, b }, ... }
// Returns scores for each player for this round
export function calculateRoundScores(submissions) {
  const names = Object.keys(submissions)
  const colours = names.map(name => submissions[name])

  const average = getAverageColour(colours)

  const scores = {}
  names.forEach(name => {
    scores[name] = scoreColour(submissions[name], average)
  })

  return { scores, average }
}