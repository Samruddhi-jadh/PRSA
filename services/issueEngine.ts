type Param = {
  parameterName: string
  category: string
  score: number
  passed: boolean
}

type Issue = {
  type: string
  severity: "low" | "medium" | "high"
  message: string
}

export function generateIssues(params: Param[]): Issue[] {

  const issues: Issue[] = []

  const grouped: Record<string, Param[]> = {}

  for (const p of params) {
    if (!grouped[p.parameterName]) grouped[p.parameterName] = []
    grouped[p.parameterName].push(p)
  }

  if (grouped["title_tag"]) {
    const failed = grouped["title_tag"].filter(p => !p.passed)
    if (failed.length > 0) {
      issues.push({
        type: "missing_title",
        severity: "high",
        message: `${failed.length} pages missing title tags`
      })
    }
  }

  if (grouped["meta_description"]) {
    const failed = grouped["meta_description"].filter(p => !p.passed)
    if (failed.length > 0) {
      issues.push({
        type: "missing_meta",
        severity: "medium",
        message: `${failed.length} pages missing meta descriptions`
      })
    }
  }

  if (grouped["word_count"]) {
    const thin = grouped["word_count"].filter(p => p.score < 0.5)
    if (thin.length > 0) {
      issues.push({
        type: "thin_content",
        severity: "high",
        message: `${thin.length} pages have thin content`
      })
    }
  }
    if (grouped["duplicate_title"]) {
    issues.push({
        type: "duplicate_titles",
        severity: "high",
        message: "Duplicate titles detected"
    })
    }
    // ❌ Noindex pages
if (grouped["noindex"]) {
  const noindexPages = grouped["noindex"].filter(p => !p.passed)

  if (noindexPages.length > 0) {
    issues.push({
      type: "noindex_pages",
      severity: "high",
      message: `${noindexPages.length} pages are marked noindex`
    })
  }
}

// ❌ Canonical issues
if (grouped["canonical_valid"]) {
  const badCanonicals = grouped["canonical_valid"].filter(p => p.score < 1)

  if (badCanonicals.length > 0) {
    issues.push({
      type: "canonical_issues",
      severity: "medium",
      message: `${badCanonicals.length} pages have canonical issues`
    })
  }
}
// ❌ Duplicate content
if (grouped["duplicate_content"]) {
  const dup = grouped["duplicate_content"].filter(p => !p.passed)
  if (dup.length > 0) {
    issues.push({
      type: "duplicate_content",
      severity: "high",
      message: `${dup.length} pages have duplicate content`
    })
  }
}

// ❌ Orphan pages
if (grouped["orphan_page"]) {
  const orphan = grouped["orphan_page"].filter(p => !p.passed)
  if (orphan.length > 0) {
    issues.push({
      type: "orphan_pages",
      severity: "medium",
      message: `${orphan.length} orphan pages detected`
    })
  }
}

  return issues
}