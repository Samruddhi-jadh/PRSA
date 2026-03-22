"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {

  const [domain, setDomain] = useState("")
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState("")
  type RecentScan = {
  id: string
  domain: string
}

const [recent, setRecent] = useState<RecentScan[]>([])
  const router = useRouter()

  /* ✅ DOMAIN VALIDATION */
  const isValidDomain = (value: string) => {
    const regex = /^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/
    return regex.test(value)
  }

  /* ✅ FETCH RECENT SCANS */
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await fetch("/api/recent")
        const data = await res.json()
        setRecent(data || [])
      } catch {
        console.log("No recent scans")
      }
    }

    fetchRecent()
  }, [])

  /* ✅ HANDLE SUBMIT */
  const handleSubmit = async () => {

    if (!domain) return alert("Enter a domain")

    if (!isValidDomain(domain)) {
      return alert("Enter valid domain (example: python.org)")
    }

    setLoading(true)
    setStep("🌐 Initializing...")

    try {

      setStep("🕷 Crawling pages...")
      const websiteRes = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain })
      })

      const website = await websiteRes.json()

      setStep("📊 Analyzing SEO...")
      const crawlRes = await fetch("/api/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteId: website.id })
      })

      const crawl = await crawlRes.json()

      setStep("⚡ Computing scores...")

      setTimeout(() => {
        router.push(`/results/${crawl.crawlId}`)
      }, 800)

    } catch (error) {
      console.error(error)
      alert("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a, #020617)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "sans-serif",
      color: "white",
      padding: "20px"
    }}>

      {/* MAIN CARD */}
      <div style={{
        width: "100%",
        maxWidth: "600px",
        padding: "40px",
        borderRadius: "20px",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
        textAlign: "center"
      }}>

        {/* TITLE */}
        <h1 style={{
          fontSize: "36px",
          marginBottom: "10px",
          background: "linear-gradient(to right, #38bdf8, #22c55e)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          🚀 PSRA Analyzer
        </h1>

        <p style={{
          color: "#94a3b8",
          marginBottom: "30px",
          fontSize: "14px"
        }}>
          Analyze your website’s SEO readiness & scalability potential
        </p>

        {/* INPUT */}
        <input
          type="text"
          placeholder="Enter domain (e.g. python.org)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #334155",
            background: "#020617",
            color: "white",
            marginBottom: "20px",
            outline: "none",
            fontSize: "14px"
          }}
        />

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "none",
            background: loading
              ? "#475569"
              : "linear-gradient(to right, #38bdf8, #22c55e)",
            color: "white",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "0.3s",
            fontSize: "15px"
          }}
        >
          {loading ? "⏳ Processing..." : "Analyze Website"}
        </button>

        {/* 🔥 ANIMATED STEP TEXT */}
        {loading && (
          <p style={{
            marginTop: "15px",
            color: "#38bdf8",
            fontSize: "14px",
            animation: "pulse 1.5s infinite"
          }}>
            {step}
          </p>
        )}

        {/* FOOTER */}
        <p style={{
          marginTop: "20px",
          fontSize: "12px",
          color: "#64748b"
        }}>
          Powered by AI-driven SEO Intelligence ⚡
        </p>
      </div>

      {/* 🔥 RECENT SCANS */}
      {recent.length > 0 && (
        <div style={{
          marginTop: "40px",
          width: "100%",
          maxWidth: "600px"
        }}>
          <h3 style={{ marginBottom: "10px" }}>🕘 Recent Scans</h3>

          {recent.map((r, i) => (
            <div
              key={i}
              onClick={() => router.push(`/results/${r.id}`)}
              style={{
                padding: "12px",
                marginBottom: "10px",
                background: "#1e293b",
                borderRadius: "10px",
                cursor: "pointer"
              }}
            >
              🌐 {r.domain}
            </div>
          ))}
        </div>
      )}

      {/* ANIMATION STYLE */}
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
      `}</style>

    </div>
  )
}