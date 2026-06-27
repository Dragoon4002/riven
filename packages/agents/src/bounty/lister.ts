import type { AgentContext, AgentResult, Bounty } from '@riven/types'
import { BountyQueries } from '@riven/db'

export interface ListBountiesInput {
  filter?: { date?: string; status?: 'active' | 'completed' | 'cancelled' }
}

export async function bountyLister(
  input: ListBountiesInput,
  _ctx: AgentContext,
): Promise<AgentResult<Bounty[]>> {
  const rows = await BountyQueries.list(input.filter?.status ?? 'active')
  const bounties: Bounty[] = rows.map(r => ({
    id: r.id,
    creatorId: r.creatorId,
    githubIssueId: r.githubIssueId,
    repoUrl: r.repoUrl,
    title: r.title,
    description: r.description,
    reward: r.reward,
    status: r.status,
    escrowId: r.escrowId,
    createdAt: r.createdAt.getTime(),
  }))
  return { output: bounties, payments: [] }
}
