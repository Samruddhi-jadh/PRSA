export function normalizeUrl(url: string, baseDomain: string): string | null {
  try {
    const parsed = new URL(url, baseDomain)

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null
    }

    parsed.hash = ""

    let normalized = parsed.toString()

    if (normalized.endsWith("/")) {
      normalized = normalized.slice(0, -1)
    }

    return normalized
  } catch {
    return null
  }
}