import * as cheerio from "cheerio"

export function extractMetadata(html: string) {

  const $ = cheerio.load(html)

  const title = $("title").text() || null

  const metaDescription =
    $('meta[name="description"]').attr("content") || null

  const text = $("body").text()

  const wordCount = text
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .length

  return {
    title,
    metaDescription,
    wordCount
  }
}