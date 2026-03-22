export function computeInternalLinkDensity(totalLinks: number, totalPages: number) {
  if (totalPages === 0) return 0
  return totalLinks / totalPages > 5 ? 1 : 0.5
}