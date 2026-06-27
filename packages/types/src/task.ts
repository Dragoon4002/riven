import type { PaymentOrder } from './payment'

export type TaskType =
  | 'RESEARCH_QUERY'
  | 'PUBLISH_CONTENT'
  | 'LIST_BOUNTIES'
  | 'CREATE_BOUNTY'
  | 'SOLVE_BOUNTY'
  | 'SUBMIT_SOLUTION'
  | 'APPROVE_SUBMISSION'
  | 'WALLET_QUERY'
  | 'GITHUB_REQUIRED'
  | 'UNKNOWN'

export type TaskStatus = 'pending' | 'running' | 'complete' | 'failed'

export type AgentType =
  | 'DISCOVERY'
  | 'RANKING'
  | 'BUDGET'
  | 'SYNTHESIS'
  | 'INGESTION'
  | 'AUTO_PRICING'
  | 'PUBLISHER'
  | 'BOUNTY_LISTER'
  | 'BOUNTY_GENERATOR'
  | 'BOUNTY_MATCHER'
  | 'GITHUB_VERIFIER'
  | 'WALLET_AGENT'
  | 'INTENT_ROUTER'

export interface TaskInput {
  message: string
  userId: string
  sessionId: string
  file?: Blob
}

export interface TaskOutput {
  text: string
  data?: unknown
  totalSpent?: number
}

export interface Task {
  taskId: string
  type: TaskType
  status: TaskStatus
  userId: string
  sessionId: string
  input: TaskInput
  output?: TaskOutput
  context: ConversationContext
  payments: PaymentOrder[]
  agentsUsed: AgentType[]
  createdAt: number
  completedAt?: number
  error?: string
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface ConversationContext {
  sessionId: string
  userId: string
  history: Message[]
  activeContext?: Record<string, unknown>
}
