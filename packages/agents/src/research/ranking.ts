import type { AgentContext, AgentResult, Source, RankedSource } from '@riven/types'

export interface RankingInput {
  sources: Source[]
  query: string
}

const YEAR_MS = 365 * 24 * 3600 * 1000

function tokenize(text: string): Set<string> {
  return new Set(text.toLowerCase().split(/\W+/).filter(Boolean))
}

export async function ranking(
  input: RankingInput,
  _ctx: AgentContext,
): Promise<AgentResult<RankedSource[]>> {
  const queryTokens = tokenize(input.query)
  const now = Date.now()

  const ranked: RankedSource[] = input.sources.map(s => {
    const titleTokens = tokenize(s.title)
    let matches = 0
    for (const t of queryTokens) {
      if (titleTokens.has(t)) matches++
    }
    const relevanceScore = matches / Math.max(queryTokens.size, 1)

    const freshnessScore = s.createdAt === 0
      ? 0.5
      : Math.max(0, Math.min(1, 1 - (now - s.createdAt) / YEAR_MS))

    const costEfficiency =
      (s.trustScore * 0.5 + relevanceScore * 0.3 + freshnessScore * 0.2) /
      Math.max(s.price, 0.001)

    return { ...s, relevanceScore, costEfficiency, rankPosition: 0 }
  })

  ranked.sort((a, b) => b.costEfficiency - a.costEfficiency)
  ranked.forEach((s, i) => { s.rankPosition = i })

  return { output: ranked, payments: [] }
}
