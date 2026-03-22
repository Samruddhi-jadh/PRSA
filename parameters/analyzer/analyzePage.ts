import { extractMetadata } from "../../extractor/metadataExtractor"
import { checkTitle } from "../titleCheck"
import { checkMetaDescription } from "../metaDescriptionCheck"
import { checkWordCount } from "../wordCountCheck"

export function analyzePage(html: string) {

  const metadata = extractMetadata(html)

  const results = []

  results.push(checkTitle(metadata.title))
  results.push(checkMetaDescription(metadata.metaDescription))
  results.push(checkWordCount(metadata.wordCount))

  return {
    metadata,
    results
  }
}