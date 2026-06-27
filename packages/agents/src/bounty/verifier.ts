import type { AgentContext, AgentResult } from '@riven/types'

export interface VerifierInput {
  hunterGithub: string
  creatorRepo: string
  bountyContext: string
}

export interface VerificationResult {
  matched: boolean
  prUrl?: string
  mergeStatus?: string
  confidence: number
}

const UNMATCHED: AgentResult<VerificationResult> = { output: { matched: false, confidence: 0 }, payments: [] }

export async function githubVerifier(
  input: VerifierInput,
  ctx: AgentContext,
): Promise<AgentResult<VerificationResult>> {
  if (!ctx.github) return UNMATCHED

  const repoMatch = input.creatorRepo.match(/github\.com\/([^/]+)\/([^/]+)/)
  if (!repoMatch) return UNMATCHED

  const [, owner, repo] = repoMatch

  let prs: Array<{ user: { login: string }; html_url: string; state: string; merged_at: string | null; title: string }> = []
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls?state=all&per_page=20`, {
      headers: { Authorization: `Bearer ${ctx.github.accessToken}`, 'User-Agent': 'riven-agent' },
    })
    if (!res.ok) return UNMATCHED
    prs = await res.json() as typeof prs
  } catch {
    return UNMATCHED
  }

  const hunterPrs = prs.filter(pr => pr.user.login === input.hunterGithub)
  if (hunterPrs.length === 0) return UNMATCHED

  const pr = hunterPrs[0]!
  const confidence = pr.merged_at ? 0.9 : 0.7

  return {
    output: {
      matched: true,
      prUrl: pr.html_url,
      mergeStatus: pr.merged_at ? 'merged' : pr.state,
      confidence,
    },
    payments: [],
  }
}
