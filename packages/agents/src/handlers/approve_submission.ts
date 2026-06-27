import type { AgentContext, TaskOutput } from '@riven/types'
import { EscrowClient } from '@riven/arc-client'
import { BountyQueries, EscrowQueries, SubmissionQueries } from '@riven/db'

export default async function handler(
  params: Record<string, unknown>,
  _ctx: AgentContext,
): Promise<TaskOutput> {
  const bountyId = String(params['bountyId'] ?? '')
  const bounty = await BountyQueries.findById(bountyId)
  if (!bounty) return { text: `Bounty #${bountyId} not found.` }

  const [submission] = await SubmissionQueries.findByBounty(bountyId)
  if (!submission) return { text: 'No pending submission for this bounty.' }

  const release = await EscrowClient.release(bounty.escrowId, submission.hunterId)

  await Promise.all([
    EscrowQueries.updateStatus(bounty.escrowId, 'released', {
      releasedAt: new Date(),
      releasedTo: submission.hunterId,
    }),
    SubmissionQueries.updateStatus(submission.id, 'approved'),
    BountyQueries.updateStatus(bountyId, 'completed'),
  ])

  return { text: `Payment of $${release.amount} USDC sent to ${submission.hunterId}.`, totalSpent: release.amount }
}
