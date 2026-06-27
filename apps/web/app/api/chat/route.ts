import { NextRequest, NextResponse } from 'next/server'
import { runTask, appendMessage, checkRateLimit, sanitize } from '@riven/agents'
import { WalletQueries, UserQueries } from '@riven/db'
import { getEngine } from '../../../lib/engine'
import type { AgentContext, WalletInfo, GitHubInfo } from '@riven/types'

export async function POST(req: NextRequest) {
  const body = await req.json() as { message: string; sessionId: string; userId: string }
  const { message: rawMessage, sessionId, userId } = body

  if (!rawMessage || !sessionId || !userId) {
    return NextResponse.json({ error: 'message, sessionId, userId required' }, { status: 400 })
  }

  const message = sanitize(rawMessage, 2000)

  try {
    await checkRateLimit(userId)
  } catch {
    return NextResponse.json({ error: 'Too many requests. Try again in a minute.' }, { status: 429 })
  }

  const ctx = await appendMessage(sessionId, userId, {
    role: 'user',
    content: message,
    timestamp: Date.now(),
  })

  const [user, walletRow] = await Promise.all([
    UserQueries.findById(userId),
    WalletQueries.findByUser(userId),
  ])

  if (!user || !walletRow) {
    return NextResponse.json({ error: 'user not found' }, { status: 404 })
  }

  const wallet: WalletInfo = {
    walletId: walletRow.arcWalletId,
    address: walletRow.address,
    balance: walletRow.balance,
  }

  const github: GitHubInfo | undefined = user.githubId
    ? { githubId: user.githubId, username: user.githubId, accessToken: '' }
    : undefined

  const engine = getEngine()
  const agentCtx: AgentContext = {
    userId,
    sessionId,
    wallet,
    github,
    engine: {
      push: (order) => engine.push(order),
      onSettle: (cb) => engine.onSettle((receipt) => {
        cb(receipt.instructions.map(i => ({
          orderId: i.ref,
          direction: 'out' as const,
          amount: i.amount,
          counterparty: i.to,
          ref: i.ref,
          queuedAt: Date.now(),
          expiresAt: Date.now() + 60_000,
          status: 'settled' as const,
        })))
      }),
    },
    conversation: ctx,
  }

  const result = await runTask({ message, userId, sessionId }, agentCtx)

  await appendMessage(sessionId, userId, {
    role: 'assistant',
    content: result.output.text,
    timestamp: Date.now(),
  })

  return NextResponse.json({ text: result.output.text, data: result.output.data, totalSpent: result.output.totalSpent })
}
