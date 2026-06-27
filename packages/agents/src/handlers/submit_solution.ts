import type { AgentContext, TaskOutput } from '@riven/types'
import { githubVerifier } from '../bounty/verifier'

export default async function handler(
  params: Record<string, unknown>,
  ctx: AgentContext,
): Promise<TaskOutput> {
  if (!ctx.github) {
    return { text: 'This needs GitHub. Connect it in settings and come back.' }
  }
  const result = await githubVerifier({
    hunterGithub: ctx.github.username,
    creatorRepo: String(params['repoUrl'] ?? ''),
    bountyContext: String(params['bountyId'] ?? ''),
  }, ctx)

  if (result.output.matched) {
    return { text: `Submission verified. PR: ${result.output.prUrl}. Awaiting creator approval.` }
  }
  return { text: "Couldn't find a matching PR in the bounty's repo. Make sure your PR is open and references the issue." }
}
