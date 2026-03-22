// utils/domainUtils.ts

export function normalizeDomain(domain: string): string {

  if (!domain) {
    throw new Error("Domain is empty")
  }

  let cleaned = domain.trim()

  // remove trailing slash
  if (cleaned.endsWith("/")) {
    cleaned = cleaned.slice(0, -1)
  }

  // add protocol if missing
  if (!cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
    cleaned = "https://" + cleaned
  }

  return cleaned
}