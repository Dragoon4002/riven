import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateText, generateObject } from 'ai'
import { Redis } from 'ioredis'
import type { ZodSchema } from 'zod'

const RATE_LIMIT = 20
const WINDOW_SECONDS = 60
const MAX_INPUT_LENGTH = 8000

let redis: Redis | null = null
function getRedis(): Redis {
  if (!redis) redis = new Redis(process.env['REDIS_URL'] ?? 'redis://localhost:6379')
  return redis
}

function getKeys(): string[] {
  const keys: string[] = []
  for (let i = 1; i <= 4; i++) {
    const k = process.env[`GOOGLE_AI_KEY_${i}`]
    if (k) keys.push(k)
  }
  if (!keys.length) throw new Error('No GOOGLE_AI_KEY_* env vars set')
  return keys
}

function isQuotaError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err)
  return msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')
}

export function sanitize(text: string, maxLength = MAX_INPUT_LENGTH): string {
  return text.slice(0, maxLength).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
}

export async function checkRateLimit(userId: string): Promise<void> {
  const r = getRedis()
  const key = `llm:rl:${userId}`
  const pipeline = r.pipeline()
  pipeline.incr(key)
  pipeline.expire(key, WINDOW_SECONDS)
  const results = await pipeline.exec()
  const count = results?.[0]?.[1] as number
  if (count > RATE_LIMIT) {
    throw new Error(`Rate limit: ${RATE_LIMIT} LLM calls per minute`)
  }
}

export async function llmText(opts: {
  model?: string
  system?: string
  prompt: string
}): Promise<string> {
  const keys = getKeys()
  const prompt = sanitize(opts.prompt)
  let lastError: Error = new Error('No keys available')

  for (const key of keys) {
    try {
      const google = createGoogleGenerativeAI({ apiKey: key })
      const { text } = await generateText({
        model: google(opts.model ?? 'gemini-2.0-flash-exp'),
        ...(opts.system !== undefined ? { system: opts.system } : {}),
        prompt,
      })
      return text
    } catch (err) {
      if (isQuotaError(err)) {
        lastError = err instanceof Error ? err : new Error(String(err))
        continue
      }
      throw err
    }
  }

  throw lastError
}

export async function llmObject<T>(opts: {
  model?: string
  system?: string
  prompt: string
  schema: ZodSchema<T>
}): Promise<T> {
  const keys = getKeys()
  const prompt = sanitize(opts.prompt)
  let lastError: Error = new Error('No keys available')

  for (const key of keys) {
    try {
      const google = createGoogleGenerativeAI({ apiKey: key })
      const { object } = await generateObject({
        model: google(opts.model ?? 'gemini-2.0-flash-exp'),
        ...(opts.system !== undefined ? { system: opts.system } : {}),
        prompt,
        schema: opts.schema,
      })
      return object as T
    } catch (err) {
      if (isQuotaError(err)) {
        lastError = err instanceof Error ? err : new Error(String(err))
        continue
      }
      throw err
    }
  }

  throw lastError
}
