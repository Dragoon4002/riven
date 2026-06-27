import { z } from 'zod'
import type { AgentContext, AgentResult } from '@riven/types'
import { llmObject } from '../llm'

export interface BountyGeneratorInput {
  githubIssueId: string
  repoUrl: string
  issueTitle: string
  issueBody: string
}

export interface GeneratedBounty {
  title: string
  description: string
  acceptanceCriteria: string[]
  suggestedReward: number
  complexityScore: number
}

const schema = z.object({
  title: z.string(),
  description: z.string(),
  acceptanceCriteria: z.array(z.string()).min(1).max(5),
  suggestedReward: z.number().min(1).max(500),
  complexityScore: z.number().min(1).max(5),
})

export async function bountyGenerator(
  input: BountyGeneratorInput,
  _ctx: AgentContext,
): Promise<AgentResult<GeneratedBounty>> {
  const output = await llmObject({
    system:
      'You are a bounty spec generator. Given a GitHub issue, create a clear bounty specification with acceptance criteria and a fair USDC reward ($1–$500) based on complexity.',
    prompt: `Repo: ${input.repoUrl}\nIssue: ${input.issueTitle}\n\n${input.issueBody.slice(0, 1000)}`,
    schema,
  })

  return { output, payments: [] }
}
