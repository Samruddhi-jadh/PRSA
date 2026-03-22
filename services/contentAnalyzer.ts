type PageLite = {
  title: string | null
}

export function detectDuplicateTitles(pages: PageLite[]): number {

  const map: Record<string, number> = {}

  for (const p of pages) {
    if (!p.title) continue

    map[p.title] = (map[p.title] || 0) + 1
  }

  return Object.values(map).filter(count => count > 1).length
}
type PageFull = {
  title: string | null
  wordCount: number
}

export function detectThinContent(pages: PageFull[]) {
  return pages.filter(p => p.wordCount < 300).length
}