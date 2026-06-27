import { Redis } from 'ioredis'
import type { ConversationContext, Message } from '@riven/types'

let client: Redis | null = null

function getRedis(): Redis {
  if (!client) {
    client = new Redis(process.env['REDIS_URL'] ?? 'redis://localhost:6379')
  }
  return client
}

const TTL_SECONDS = 3600

export async function loadContext(sessionId: string, userId: string): Promise<ConversationContext> {
  const redis = getRedis()
  const raw = await redis.get(`session:${sessionId}`)
  if (raw) {
    return JSON.parse(raw) as ConversationContext
  }
  return { sessionId, userId, history: [], activeContext: {} }
}

export async function saveContext(ctx: ConversationContext): Promise<void> {
  const redis = getRedis()
  await redis.set(`session:${ctx.sessionId}`, JSON.stringify(ctx), 'EX', TTL_SECONDS)
}

export async function appendMessage(sessionId: string, userId: string, msg: Message): Promise<ConversationContext> {
  const ctx = await loadContext(sessionId, userId)
  ctx.history = [...ctx.history.slice(-49), msg]
  await saveContext(ctx)
  return ctx
}
