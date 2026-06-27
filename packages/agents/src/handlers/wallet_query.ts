import type { AgentContext, TaskOutput } from '@riven/types'
import { walletAgent } from '../wallet/wallet-agent'

export default async function handler(
  params: Record<string, unknown>,
  ctx: AgentContext,
): Promise<TaskOutput> {
  const result = await walletAgent({ query: String(params['query'] ?? ''), userId: ctx.userId }, ctx)
  return { text: result.output.text, data: result.output }
}
