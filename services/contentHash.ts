import crypto from "crypto"

export function generateContentHash(html: string): string {
  return crypto.createHash("md5").update(html).digest("hex")
}