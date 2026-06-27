import type { AgentContext, TaskOutput } from '@riven/types'
import { bountyLister } from '../bounty/lister'

export default async function handler(
  params: Record<string, unknown>,
  ctx: AgentContext,
): Promise<TaskOutput> {
  const filter = params['filter'] as { date?: string; status?: 'active' } | undefined
  const result = await bountyLister({ filter: filter ?? {} }, ctx)
  const bounties = result.output
  if (bounties.length === 0) {
    return { text: 'No open bounties right now.' }
  }
  const lines = bounties.map(b => `**${b.title}** — $${b.reward} USDC\n${b.repoUrl}`)
  return { text: lines.join('\n\n'), data: bounties }
}
