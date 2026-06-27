import type { AgentContext, AgentResult } from '@riven/types'
import { WalletClient } from '@riven/arc-client'

export interface WalletQueryInput {
  query: string
  userId: string
}

export interface WalletQueryOutput {
  text: string
  balance?: number
}

export async function walletAgent(
  input: WalletQueryInput,
  ctx: AgentContext,
): Promise<AgentResult<WalletQueryOutput>> {
  const balance = await WalletClient.balance(ctx.wallet.walletId)
  const history = await WalletClient.history(ctx.wallet.walletId)

  const earnedToday = history
    .filter(t => t.direction === 'in' && t.timestamp > Date.now() - 86_400_000)
    .reduce((s, t) => s + t.amount, 0)

  const spentToday = history
    .filter(t => t.direction === 'out' && t.timestamp > Date.now() - 86_400_000)
    .reduce((s, t) => s + t.amount, 0)

  const text = [
    `You have $${balance.available.toFixed(2)} USDC`,
    `Earned today: $${earnedToday.toFixed(2)}`,
    `Spent today: $${spentToday.toFixed(2)}`,
  ].join('\n')

  return { output: { text, balance: balance.available }, payments: [] }
}
