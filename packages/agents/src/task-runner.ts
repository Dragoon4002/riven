import type { TaskType, TaskInput, TaskOutput, AgentContext } from '@riven/types'
import { TaskRegistry } from './registry'
import { classifyIntent } from './intent-router'
import * as research_query from './handlers/research_query'
import * as publish_content from './handlers/publish_content'
import * as list_bounties from './handlers/list_bounties'
import * as create_bounty from './handlers/create_bounty'
import * as solve_bounty from './handlers/solve_bounty'
import * as submit_solution from './handlers/submit_solution'
import * as approve_submission from './handlers/approve_submission'
import * as wallet_query from './handlers/wallet_query'
import * as unknown_handler from './handlers/unknown'
import * as github_required from './handlers/github_required'

type HandlerFn = (params: Record<string, unknown>, ctx: AgentContext) => Promise<TaskOutput>

const handlers: Record<string, HandlerFn> = {
  research_query: research_query.default,
  publish_content: publish_content.default,
  list_bounties: list_bounties.default,
  create_bounty: create_bounty.default,
  solve_bounty: solve_bounty.default,
  submit_solution: submit_solution.default,
  approve_submission: approve_submission.default,
  wallet_query: wallet_query.default,
  unknown: unknown_handler.default,
  github_required: github_required.default,
}

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
  const handler = handlers[taskType.toLowerCase()]
  if (!handler) throw new Error(`No handler for task type: ${taskType}`)
  const output = await handler(params, ctx)
  return { output }
}
