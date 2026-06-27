import type { AgentContext, TaskOutput, UnlockedContent } from '@riven/types'
import { discovery } from '../research/discovery'
import { ranking } from '../research/ranking'
import { budget } from '../research/budget'
import { synthesis } from '../research/synthesis'
import { X402Client } from '@riven/x402'

async function fetchExternal(url: string): Promise<string> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    const html = await res.text()
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 3000)
  } catch {
    return ''
  }
}

export default async function handler(
  params: Record<string, unknown>,
  ctx: AgentContext,
): Promise<TaskOutput> {
  const query = String(params['query'] ?? '')

  const discoveryResult = await discovery({ query }, ctx)
  const rankingResult = await ranking({ sources: discoveryResult.output, query }, ctx)
  const budgetResult = await budget({ ranked: rankingResult.output, dailyCap: 5, perQueryCap: 1 }, ctx)

  const unlocked: UnlockedContent[] = []
  let totalSpent = 0

  for (const source of budgetResult.output.approved) {
    if (!source.x402Endpoint) {
      const content = await fetchExternal(source.url)
      if (content) unlocked.push({ sourceId: source.id, url: source.url, content, title: source.title })
    } else {
      const probe = await X402Client.probe(source.x402Endpoint)
      if (probe.gated) {
        ctx.engine.push({
          orderId: `ord_${source.id}_${Date.now()}`,
          direction: 'out',
          amount: probe.price,
          counterparty: probe.payTo,
          ref: source.id,
          x402RequestId: probe.requestId,
          queuedAt: Date.now(),
          expiresAt: Date.now() + 60_000,
          status: 'queued',
        })
        totalSpent += probe.price
        const token = await X402Client.getToken(probe.requestId, 'pending')
        const content = await X402Client.fetch(source.x402Endpoint, token.token)
        unlocked.push({ sourceId: source.id, url: source.url, content, title: source.title })
      }
    }
  }

  if (unlocked.length === 0) {
    return { text: 'No content found for your query. Try rephrasing.' }
  }

  const synthResult = await synthesis({ content: unlocked, query }, ctx)
  return {
    text: synthResult.output.content,
    data: { citations: synthResult.output.citations },
    totalSpent,
  }
}
