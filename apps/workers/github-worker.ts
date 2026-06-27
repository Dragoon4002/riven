import { BountyQueries, SubmissionQueries, EscrowQueries } from '@riven/db'
import { EscrowClient } from '@riven/arc-client'

export interface PullRequestMergedEvent {
  repo: { url: string; fullName: string }
  pr: { url: string; number: number; mergedAt: string }
  mergedBy: string
}

export async function handlePRMerged(event: PullRequestMergedEvent): Promise<void> {
  console.log('[github-worker] PR merged', event.pr.url)

  const bounties = await BountyQueries.findByGithubRepo(event.repo.url)
  if (bounties.length === 0) {
    console.log('[github-worker] no active bounty for repo', event.repo.url)
    return
  }

  for (const bounty of bounties) {
    const submissions = await SubmissionQueries.findByBounty(bounty.id)
    const matched = submissions.find(s => s.prUrl === event.pr.url && s.status === 'pending')

    if (!matched) {
      console.log('[github-worker] no matching pending submission for bounty', bounty.id)
      continue
    }

    const release = await EscrowClient.release(bounty.escrowId, matched.hunterId)
    console.log('[github-worker] escrow released', { escrowId: bounty.escrowId, to: matched.hunterId, amount: release.amount })

    await Promise.all([
      EscrowQueries.updateStatus(bounty.escrowId, 'released', {
        releasedAt: new Date(),
        releasedTo: matched.hunterId,
      }),
      SubmissionQueries.updateStatus(matched.id, 'approved'),
      BountyQueries.updateStatus(bounty.id, 'completed'),
    ])

    console.log('[github-worker] bounty completed', bounty.id)
  }
}
