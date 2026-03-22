export async function fetchPage(url: string, retries = 2) {

  const start = Date.now()

  try {

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 20000)

    const res = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    })

    clearTimeout(timeout)

    const html = await res.text()

    return {
      statusCode: res.status,
      html,
      loadTimeMs: Date.now() - start
    }

  } catch (error) {

    console.log(`⚠️ Fetch failed for ${url}`)

    if (retries > 0) {
      console.log(`🔁 Retrying... (${retries})`)
      return fetchPage(url, retries - 1)
    }

    return {
      statusCode: 500,
      html: "",
      loadTimeMs: Date.now() - start
    }
  }
}