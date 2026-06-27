import type { AgentContext, TaskOutput } from '@riven/types'
import { BountyQueries, EscrowQueries } from '@riven/db'
import { EscrowClient } from '@riven/arc-client'
import { bountyGenerator } from '../bounty/generator'

export default async function handler(
  params: Record<string, unknown>,
  ctx: AgentContext,
): Promise<TaskOutput> {
  const issueUrl = typeof params['issueUrl'] === 'string' ? params['issueUrl'] : null
  if (!issueUrl) {
    return { text: 'Share the GitHub issue URL: https://github.com/owner/repo/issues/N' }
  }

  const match = issueUrl.match(/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/)
  if (!match) {
    return { text: 'Invalid GitHub issue URL. Expected: https://github.com/owner/repo/issues/N' }
  }

  const [, owner, repo, number] = match as [string, string, string, string]
  const repoUrl = `https://github.com/${owner}/${repo}`

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${number}`, {
      headers: {
        Authorization: `Bearer ${ctx.github!.accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!res.ok) {
      return { text: `Could not fetch GitHub issue (${res.status}). Check the URL and try again.` }
    }

    const issue = (await res.json()) as { number: number; title: string; body: string | null }

    const { output: bounty } = await bountyGenerator(
      {
        githubIssueId: String(issue.number),
        repoUrl,
        issueTitle: issue.title,
        issueBody: issue.body ?? '',
      },
      ctx,
    )

    const bountyId = crypto.randomUUID()
    const escrowLock = await EscrowClient.lock(ctx.wallet.address, bounty.suggestedReward, bountyId)

    await BountyQueries.create({
      id: bountyId,
      creatorId: ctx.userId,
      githubIssueId: String(issue.number),
      repoUrl,
      title: bounty.title,
      description: bounty.description,
      reward: bounty.suggestedReward,
      status: 'active',
      escrowId: escrowLock.escrowId,
    })

    await EscrowQueries.create({
      id: crypto.randomUUID(),
      bountyId,
      amount: escrowLock.lockedAmount,
      status: 'locked',
      arcEscrowId: escrowLock.escrowId,
    })

    return {
      text: `Bounty created: "${bounty.title}" · Reward: $${bounty.suggestedReward} USDC · Escrow locked. Hunters can now claim this bounty.`,
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return { text: `Failed to create bounty: ${msg}` }
  }
}
