export function isValidStatus(status: number) {
  return status === 200
}

export function scoreDepth(depth: number) {
  if (depth === 0) return 1
  if (depth <= 2) return 0.9
  if (depth <= 4) return 0.7
  return 0.5
}