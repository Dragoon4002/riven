import type { AgentContext, AgentResult, Bounty } from '@riven/types'
import { BountyQueries } from '@riven/db'

export interface BountyMatcherInput {
  userId: string
  skills?: string[]
}

export interface ScoredBounty extends Bounty {
  matchScore: number
}

export async function bountyMatcher(
  input: BountyMatcherInput,
  _ctx: AgentContext,
): Promise<AgentResult<ScoredBounty[]>> {
  console.log('[agent:stub] BountyMatcherAgent', input.userId)
  const rows = await BountyQueries.list('active')
  const scored: ScoredBounty[] = rows.map(r => ({
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
    matchScore: 0.7,
  }))
  return { output: scored, payments: [] }
}
