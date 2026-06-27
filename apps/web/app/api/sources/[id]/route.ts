import { NextRequest, NextResponse } from 'next/server'
import { Redis } from 'ioredis'

let redis: Redis | null = null
function getRedis(): Redis {
  if (!redis) redis = new Redis(process.env['REDIS_URL'] ?? 'redis://localhost:6379')
  return redis
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params
  const content = await getRedis().get(`content:${id}`)
  if (!content) {
    return NextResponse.json({ error: 'Content not found' }, { status: 404 })
  }
  return NextResponse.json({ content })
}
