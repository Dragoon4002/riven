import type { AgentContext, TaskOutput } from '@riven/types'
import researchHandler from './research_query'

export default async function handler(
  params: Record<string, unknown>,
  ctx: AgentContext,
): Promise<TaskOutput> {
  return researchHandler(params, ctx)
}
