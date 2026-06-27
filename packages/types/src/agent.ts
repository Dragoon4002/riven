import type { AgentType, ConversationContext } from './task'
import type { PaymentOrder } from './payment'
import type { WalletInfo, GitHubInfo } from './wallet'

export interface PaymentEngineHandle {
  push(order: PaymentOrder): void
  onSettle(callback: (orders: PaymentOrder[]) => void): void
}

export interface AgentContext {
  userId: string
  sessionId: string
  wallet: WalletInfo
  github?: GitHubInfo
  engine: PaymentEngineHandle
  conversation: ConversationContext
}

export interface AgentResult<T> {
  output: T
  payments: PaymentOrder[]
  agentsSpawned?: AgentType[]
  error?: string
}

export interface Agent<TInput, TOutput> {
  type: AgentType
  run(input: TInput, context: AgentContext): Promise<AgentResult<TOutput>>
}

export interface TaskRequirements {
  agents: AgentType[]
  requiresGithub: boolean
  requiresWallet: boolean
  flow: 'sequential' | 'single' | 'direct'
  paymentIntensive: boolean
}
