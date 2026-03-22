# 🚀 PSRA — Programmatic SEO Readiness Analyzer

> First Programmatic SEO Readiness Intelligence Platform.

---

## 📌 Overview

**PSRA (Programmatic SEO Readiness Analyzer)** is an AI-powered platform that evaluates a website’s SEO health and its readiness to scale using programmatic SEO strategies.

Unlike traditional SEO audit tools, PSRA focuses on:

> **Can this website scale to hundreds or thousands of pages without breaking SEO performance?**

---

## 🎯 Product Vision

Build a scalable SEO intelligence system that:

- Crawls websites
- Evaluates critical SEO parameters
- Performs site-level analysis (not just page-level)
- Computes SEO readiness score
- Identifies scalability risks
- Enables programmatic SEO decision-making

---

## 🚨 Problem Statement

Most websites fail to scale organic traffic due to:

- Poor crawlability & indexability
- Weak internal linking architecture
- Thin or duplicate content
- Crawl inefficiencies
- Lack of structured SEO systems

Existing tools audit SEO — but do not evaluate **scalability readiness**.

PSRA solves this gap.

---

## 🏗 System Architecture

PSRA is built on a 5-layer SEO intelligence model:

### Layer 1 — Crawlability
- Status code validation
- Crawl depth analysis
- Robots.txt blocking detection
- Broken link detection

### Layer 2 — Indexability
- Canonical detection & validation
- Noindex detection
- HTTPS validation

### Layer 3 — On-Page SEO
- Title tag presence
- Meta description presence

### Layer 4 — Content Quality
- Word count scoring
- Page speed scoring
- Thin content detection

### Layer 5 — Programmatic SEO Signals
- URL structure analysis
- URL pattern consistency

---

## 🧠 Site-Level Intelligence (Key Feature)

Unlike basic tools, PSRA performs cross-page analysis:

- Duplicate title detection
- Thin content ratio
- Duplicate content detection (hash-based)
- Orphan page detection (internal link graph)
- URL pattern consistency scoring

---

## ⚙️ Scoring Engine

- Category-wise scoring:
  - Crawlability
  - Indexability
  - On-Page
  - Content
  - Programmatic

- Weighted scoring model:
  - Crawlability → 30%
  - Indexability → 25%
  - On-Page → 20%
  - Content → 15%
  - Programmatic → 10%

- Intelligent adjustments:
  - Thin content penalty
  - Duplicate content penalty
  - Duplicate title penalty
  - Orphan page penalty
  - URL pattern boost

---

## 📊 Dashboard Features

- SEO score cards
- Issue detection (High / Medium / Low)
- Page-level data table
- Visual analytics:
  - Score distribution
  - Issue severity
  - Crawl depth

---

## 🗄 Database Design

Stores:

- Crawl sessions
- Pages and metadata
- SEO parameter results
- Internal link graph
- Category scores
- Final SEO readiness score

---

## ✅ Current Progress (MVP)

### ✔ Completed

- Website crawler (BFS-based)
- Metadata extraction
- Internal link graph
- SEO parameter engine (multi-layer)
- Site-level intelligence
- Scoring engine with weighted model
- Issue detection engine
- Dashboard UI with charts

---

## 🚧 Remaining (Next Phases)

### Crawlability
- Sitemap parsing
- Crawl budget efficiency

### Indexability
- Redirect chain detection
- HTTP/HTTPS duplication

### On-Page
- Header hierarchy (H1–H6)
- Keyword optimization

### Content
- Semantic coverage (NLP)
- Entity detection

### Programmatic SEO
- Template consistency detection
- Metadata automation readiness
- Internal linking automation score

---

## 🧱 Tech Stack

### Backend
- Next.js (API routes)
- Prisma ORM
- PostgreSQL

### Frontend
- Next.js (React)
- Recharts (visualization)
- Tailwind CSS (planned)

---

## 🚀 Local Setup

```bash
git clone https://github.com/your-username/psra.git
cd psra
npm install
npx prisma generate
npm run dev

Create a `.env` file:

```
DATABASE_URL=your_database_url
```

---

## 📌 Product Positioning

> PSRA is not just an SEO audit tool.
> It is a **Programmatic SEO Readiness Intelligence Platform**.

---

## 📎 Documentation

Detailed documentation available in `/docs`:

* Product Requirements Document (PRD)
* System Architecture
* Database Design
* Processing Lifecycle

---

## 👩‍💻 Author

Developed with a long-term vision to build a scalable AI-powered SEO intelligence platform.

---

