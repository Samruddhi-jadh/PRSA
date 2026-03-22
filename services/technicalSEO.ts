export async function checkRobots(domain: string) {
  try {
    const res = await fetch(`${domain}/robots.txt`)
    if (!res.ok) return { exists: false, disallowed: [] }

    const text = await res.text()

    const disallowed = text
      .split("\n")
      .filter(line => line.toLowerCase().startsWith("disallow"))
      .map(line => line.split(":")[1]?.trim())

    return {
      exists: true,
      disallowed
    }

  } catch {
    return { exists: false, disallowed: [] }
  }
}
export async function fetchRobots(domain: string) {
  try {
    const res = await fetch(`${domain}/robots.txt`)
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  }
}

export async function fetchSitemap(domain: string) {
  try {
    const res = await fetch(`${domain}/sitemap.xml`)
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  }
}

export function checkRobotsPresence(robots: string | null) {
  return robots ? 1 : 0
}

export function checkSitemapPresence(sitemap: string | null) {
  return sitemap ? 1 : 0
}