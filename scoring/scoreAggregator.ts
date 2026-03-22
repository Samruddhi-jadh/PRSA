export function aggregateScores(scores: number[]) {

  if (scores.length === 0) return 0

  const total = scores.reduce((sum, s) => sum + s, 0)

  return total / scores.length
}