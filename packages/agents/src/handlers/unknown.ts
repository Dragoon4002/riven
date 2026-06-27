import type { AgentContext, TaskOutput } from '@riven/types'

export default async function handler(
  _params: Record<string, unknown>,
  _ctx: AgentContext,
): Promise<TaskOutput> {
  return {
    text: "I didn't quite understand that. You can ask me to:\n- Research a topic\n- Browse or create bounties\n- Publish content\n- Check your wallet balance",
  }
}
