import { ParameterResult } from "../types/parameter.types"

export function calculateScore(results: ParameterResult[]) {

  if (results.length === 0) return 0

  const total = results.reduce((sum, r) => sum + r.score, 0)

  return total / results.length
}