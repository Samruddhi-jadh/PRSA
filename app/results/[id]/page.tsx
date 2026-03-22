import { prisma } from "@/lib/prisma"
import { generateIssues } from "@/services/issueEngine"

export const revalidate = 2

export default async function Results({
  params,
}: {
  params: Promise<{ id: string }>   // ✅ FIXED
}) {

  // ✅ MUST await params in Next.js 16
  const { id } = await params

  // 🛑 Safety check (prevents Prisma crash)
  if (!id) {
    return <div style={{ padding: 40 }}>❌ Invalid crawl ID</div>
  }

  const crawl = await prisma.crawlSession.findUnique({
    where: { id },
    include: {
      website: true,
      pages: {
        include: {
          parameters: true
        }
      }
    }
  })

  if (!crawl) {
    return <div style={{ padding: 40 }}>❌ Crawl not found</div>
  }

  const allParams = crawl.pages.flatMap(p => p.parameters)
  const issues = generateIssues(allParams)

  const scoreCards = [
    ["Crawlability", crawl.crawlabilityScore],
    ["Indexability", crawl.indexabilityScore],
    ["On-Page", crawl.onPageScore],
    ["Content", crawl.contentScore],
    ["Programmatic", crawl.programmaticScore],
    ["Overall", crawl.overallScore],
  ]

  return (
    <div style={{
      padding: "40px",
      fontFamily: "sans-serif",
      background: "#0f172a",
      minHeight: "100vh",
      color: "white"
    }}>

      {/* HEADER */}
      <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
        🚀 SEO Analysis Dashboard
      </h1>

      <h2 style={{ color: "#38bdf8" }}>
        🌐 {crawl.website.domain}
      </h2>

      {crawl.status === "completed" && (
        <p style={{ color: "#22c55e" }}>
          ✅ Analysis Completed
        </p>
      )}

      {/* SCORE CARDS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "20px",
        marginTop: "30px"
      }}>
        {scoreCards.map(([label, value]) => (
          <div key={label} style={{
            padding: "20px",
            borderRadius: "16px",
            background: "#1e293b",
            boxShadow: "0 0 15px rgba(0,0,0,0.3)",
            textAlign: "center"
          }}>
            <h4 style={{ color: "#94a3b8" }}>{label}</h4>
            <p style={{
              fontSize: "26px",
              fontWeight: "bold",
              color: "#38bdf8"
            }}>
              {value !== null ? Number(value).toFixed(2) : "N/A"}
            </p>
          </div>
        ))}
      </div>

      {/* ISSUES */}
      <h2 style={{ marginTop: "50px" }}>🚨 Issues</h2>

      {issues.length === 0 ? (
        <p style={{ color: "#22c55e" }}>
          ✅ No major issues detected
        </p>
      ) : (
        <div style={{ marginTop: "15px" }}>
          {issues.map((issue, i) => (
            <div key={i} style={{
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "8px",
              background:
                issue.severity === "high"
                  ? "#7f1d1d"
                  : issue.severity === "medium"
                  ? "#78350f"
                  : "#1e3a8a"
            }}>
              <strong>{issue.severity.toUpperCase()}</strong>: {issue.message}
            </div>
          ))}
        </div>
      )}

      {/* TABLE */}
      <h3 style={{ marginTop: "50px" }}>📄 Pages</h3>

      <div style={{
        overflowX: "auto",
        marginTop: "20px"
      }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse"
        }}>
          <thead>
            <tr style={{ background: "#1e293b" }}>
              <th style={thStyle}>URL</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Words</th>
              <th style={thStyle}>Depth</th>
            </tr>
          </thead>

          <tbody>
            {crawl.pages.slice(0, 15).map((p) => (
              <tr key={p.id} style={{
                borderBottom: "1px solid #334155"
              }}>
                <td style={tdStyle}>{p.url}</td>
                <td style={tdStyle}>{p.statusCode}</td>
                <td style={tdStyle}>{p.wordCount}</td>
                <td style={tdStyle}>{p.crawlDepth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

/* STYLES */
const thStyle = {
  padding: "12px",
  textAlign: "left" as const,
  color: "#94a3b8"
}

const tdStyle = {
  padding: "10px",
  fontSize: "14px"
}