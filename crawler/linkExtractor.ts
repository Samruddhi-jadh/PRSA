import * as cheerio from "cheerio"

export function extractLinks(html: string): string[] {
  const $ = cheerio.load(html)

  const links: string[] = []

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href")

    if (href) {
      links.push(href)
    }
  })

  return links
}