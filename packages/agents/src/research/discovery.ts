import type { AgentContext, AgentResult, Source } from '@riven/types'
import { SourceQueries } from '@riven/db'

export interface DiscoveryInput {
  query: string
}

function parseArxivEntries(xml: string): Source[] {
  const sources: Source[] = []
  let pos = 0
  while (true) {
    const start = xml.indexOf('<entry>', pos)
    if (start === -1) break
    const end = xml.indexOf('</entry>', start)
    const entry = xml.slice(start, end)
    pos = end + 8

    const idMatch = entry.match(/<id>([^<]+)<\/id>/)
    const titleMatch = entry.match(/<title>([^<]+)<\/title>/)
    const publishedMatch = entry.match(/<published>([^<]+)<\/published>/)

    if (!idMatch || !titleMatch) continue

    const url = idMatch[1]!.trim()
    const title = titleMatch[1]!.trim()
    const createdAt = publishedMatch ? new Date(publishedMatch[1]!).getTime() : Date.now()

    sources.push({
      id: url,
      url,
      title,
      authorId: 'external',
      price: 0.02,
      trustScore: 0.9,
      x402Endpoint: '',
      createdAt,
    })
  }
  return sources
}

async function fetchArxiv(query: string): Promise<Source[]> {
  try {
    const url = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&max_results=10&sortBy=relevance`
    const res = await fetch(url)
    if (!res.ok) return []
    const xml = await res.text()
    return parseArxivEntries(xml)
  } catch (e) {
    console.log('[discovery] arxiv fetch failed', e)
    return []
  }
}

async function fetchHN(query: string): Promise<Source[]> {
  try {
    const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=10`
    const res = await fetch(url)
    if (!res.ok) return []
    const json = await res.json() as { hits: Array<{ objectID: string; title: string; url?: string; created_at: string }> }
    return json.hits
      .filter(h => h.url != null)
      .map(h => ({
        id: h.objectID,
        url: h.url!,
        title: h.title,
        authorId: 'external',
        price: 0.02,
        trustScore: 0.7,
        x402Endpoint: '',
        createdAt: new Date(h.created_at).getTime(),
      }))
  } catch (e) {
    console.log('[discovery] hn fetch failed', e)
    return []
  }
}

export async function discovery(
  input: DiscoveryInput,
  _ctx: AgentContext,
): Promise<AgentResult<Source[]>> {
  const [arxiv, hn, rawDb] = await Promise.all([
    fetchArxiv(input.query),
    fetchHN(input.query),
    SourceQueries.list(),
  ])

  const dbSources: Source[] = rawDb.map(s => ({ ...s, createdAt: s.createdAt.getTime() }))

  const seen = new Set<string>()
  const combined: Source[] = []

  for (const s of [...dbSources, ...arxiv, ...hn]) {
    if (seen.has(s.url)) continue
    seen.add(s.url)
    combined.push(s)
    if (combined.length >= 20) break
  }

  return { output: combined, payments: [] }
}
