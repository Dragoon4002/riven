import type { AgentContext, AgentResult } from '@riven/types'
import { X402Server } from '@riven/x402'
import { SourceQueries } from '@riven/db'
import { Redis } from 'ioredis'

let redis: Redis | null = null
function getRedis(): Redis {
  if (!redis) redis = new Redis(process.env['REDIS_URL'] ?? 'redis://localhost:6379')
  return redis
}

export interface PublisherInput {
  contentId: string
  title: string
  text: string
  price: number
  authorWallet: string
  authorId: string
}

export interface PublisherOutput {
  x402Endpoint: string
  sourceId: string
  liveAt: number
}

export async function publisher(
  input: PublisherInput,
  _ctx: AgentContext,
): Promise<AgentResult<PublisherOutput>> {
  const gate = await X402Server.gate({
    price: input.price,
    currency: 'USDC',
    payTo: input.authorWallet,
    contentId: input.contentId,
    expiresIn: 3600,
  })

  const [source] = await SourceQueries.create({
    id: input.contentId,
    url: gate.endpoint,
    title: input.title,
    authorId: input.authorId,
    price: input.price,
    trustScore: 0.5,
    x402Endpoint: gate.endpoint,
  })

  await getRedis().set(`content:${input.contentId}`, input.text, 'EX', 30 * 24 * 3600)

  return {
    output: {
      x402Endpoint: gate.endpoint,
      sourceId: source!.id,
      liveAt: Date.now(),
    },
    payments: [],
  }
}
