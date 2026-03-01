"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const [domain, setDomain] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!domain) return alert("Enter a domain")

    setLoading(true)

    try {
      const websiteRes = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain })
      })

      const website = await websiteRes.json()

      const crawlRes = await fetch("/api/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteId: website.id })
      })

      const crawl = await crawlRes.json()

      router.push(`/results/${crawl.id}`)

    } catch (error) {
      console.error(error)
      alert("Something went wrong")
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>SEO Analyzer</h1>

      <input
        type="text"
        placeholder="Enter domain"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        style={{ padding: 8, marginRight: 10 }}
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>
    </div>
  )
}