import * as cheerio from "cheerio"

export function extractContent(html: string) {
  const $ = cheerio.load(html)

  const text = $("body").text()

  const words = text
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")

  const wordCount = words.length

  return {
    wordCount
  }
}