import type { AgentContext, TaskOutput } from '@riven/types'

export default async function handler(
  _params: Record<string, unknown>,
  _ctx: AgentContext,
): Promise<TaskOutput> {
  return { text: 'This needs GitHub. Connect it in settings and come back.' }
}
