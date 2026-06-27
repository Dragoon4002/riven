import type { TaskType, TaskInput, TaskOutput, AgentContext } from '@riven/types'
import { TaskRegistry } from './registry'
import { classifyIntent } from './intent-router'

export interface RunResult {
  output: TaskOutput
  blocked?: 'GITHUB' | 'WALLET'
}

export async function runTask(input: TaskInput, ctx: AgentContext): Promise<RunResult> {
  const intent = classifyIntent(input.message, ctx.conversation)
  const taskType: TaskType = intent.taskType

  if (taskType === 'UNKNOWN') {
    return { output: { text: "I didn't quite understand that. Could you rephrase? You can ask me to research something, browse bounties, check your wallet, or publish content." } }
  }

  if (taskType === 'GITHUB_REQUIRED') {
    return { output: { text: 'This needs GitHub. Connect it in settings and come back.' }, blocked: 'GITHUB' }
  }

  const requirements = TaskRegistry[taskType]

  if (requirements.requiresGithub && !ctx.github) {
    return {
      output: { text: 'This needs GitHub. Connect it in settings and come back.' },
      blocked: 'GITHUB',
    }
  }

  if (requirements.requiresWallet && !ctx.wallet) {
    return {
      output: { text: 'You need a wallet to do that. Create one to get started.' },
      blocked: 'WALLET',
    }
  }

  return dispatchTask(taskType, intent.params, ctx)
}

async function dispatchTask(
  taskType: TaskType,
  params: Record<string, unknown>,
  ctx: AgentContext,
): Promise<RunResult> {
  const { default: handler } = await import(`./handlers/${taskType.toLowerCase()}.js`) as {
    default: (params: Record<string, unknown>, ctx: AgentContext) => Promise<TaskOutput>
  }
  const output = await handler(params, ctx)
  return { output }
}
