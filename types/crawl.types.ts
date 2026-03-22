export interface CrawlResult {
  url: string
  statusCode: number
  html?: string
  depth: number
  loadTimeMs: number
}

export interface QueueItem {
  url: string
  depth: number
}