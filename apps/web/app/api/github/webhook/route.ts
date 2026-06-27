import { NextRequest, NextResponse } from 'next/server'
import { BountyQueries, SubmissionQueries, EscrowQueries } from '@riven/db'
import { EscrowClient } from '@riven/arc-client'

async function handlePRMerged(event: {
  repo: { url: string; fullName: string }
  pr: { url: string; number: number; mergedAt: string }
  mergedBy: string
}) {
  const bounties = await BountyQueries.findByGithubRepo(event.repo.url)
  for (const bounty of bounties) {
    const submissions = await SubmissionQueries.findByBounty(bounty.id)
    const matched = submissions.find(s => s.prUrl === event.pr.url && s.status === 'pending')
    if (!matched) continue
    const release = await EscrowClient.release(bounty.escrowId, matched.hunterId)
    await Promise.all([
      EscrowQueries.updateStatus(bounty.escrowId, 'released', { releasedAt: new Date(), releasedTo: matched.hunterId }),
      SubmissionQueries.updateStatus(matched.id, 'approved'),
      BountyQueries.updateStatus(bounty.id, 'completed'),
    ])
    console.log('[webhook] escrow released', release.amount, 'to', matched.hunterId)
  }
}

export async function POST(req: NextRequest) {
  const event = req.headers.get('x-github-event')
  if (event !== 'pull_request') {
    return NextResponse.json({ ok: true })
  }

  const payload = await req.json() as {
    action: string
    pull_request: { url: string; number: number; merged: boolean; merged_at: string }
    repository: { html_url: string; full_name: string }
    sender: { login: string }
  }

  if (payload.action !== 'closed' || !payload.pull_request.merged) {
    return NextResponse.json({ ok: true })
  }

  await handlePRMerged({
    repo: { url: payload.repository.html_url, fullName: payload.repository.full_name },
    pr: {
      url: payload.pull_request.url,
      number: payload.pull_request.number,
      mergedAt: payload.pull_request.merged_at,
    },
    mergedBy: payload.sender.login,
  })

  return NextResponse.json({ ok: true })
}
