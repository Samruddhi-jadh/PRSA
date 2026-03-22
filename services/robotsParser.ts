export function isBlockedByRobots(robotsTxt: string, url: string): boolean {

  if (!robotsTxt) return false

  const disallowRules = robotsTxt
    .split("\n")
    .filter(line => line.toLowerCase().startsWith("disallow"))

  for (const rule of disallowRules) {
    const path = rule.split(":")[1]?.trim()
    if (path && url.includes(path)) {
      return true
    }
  }

  return false
}