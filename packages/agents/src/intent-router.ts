import type { TaskType, ConversationContext } from '@riven/types'

export interface IntentResult {
  taskType: TaskType
  params: Record<string, unknown>
  confidence: number
}

const PATTERNS: Array<{ patterns: RegExp[]; taskType: TaskType }> = [
  { patterns: [/\bbalance\b/i, /\bwallet\b/i, /\bhow much\b/i, /\bearned\b/i, /\bspent\b/i, /\bdeposit\b/i], taskType: 'WALLET_QUERY' },
  { patterns: [/\bshow.*bounti/i, /\blist.*bounti/i, /\bopen bounti/i, /\bbrowse bounti/i], taskType: 'LIST_BOUNTIES' },
  { patterns: [/\bcreate.*bounty\b/i, /\blist.*bounty\b/i, /\bpost.*bounty\b/i, /\bnew bounty\b/i], taskType: 'CREATE_BOUNTY' },
  { patterns: [/\bsubmit\b.*\bsolution\b/i, /\bi solved\b/i, /\bmy pr\b/i, /\bi fixed\b/i], taskType: 'SUBMIT_SOLUTION' },
  { patterns: [/\bapprove\b.*\bbounty\b/i, /\brelease\b.*\bescrow\b/i, /\bpay.*hunter\b/i], taskType: 'APPROVE_SUBMISSION' },
  { patterns: [/\bpublish\b/i, /\bsell\b/i, /\bupload\b/i, /\bmonetize\b/i], taskType: 'PUBLISH_CONTENT' },
  { patterns: [/\bsolve\b.*\bbounty\b/i, /\bhow.*fix\b/i, /\bhelp.*solve\b/i], taskType: 'SOLVE_BOUNTY' },
  { patterns: [/\bresearch\b/i, /\bfind.*info\b/i, /\bsummarize\b/i, /\bexplain\b/i, /\bwhat is\b/i, /\btell me about\b/i], taskType: 'RESEARCH_QUERY' },
]

export function classifyIntent(message: string, _context: ConversationContext): IntentResult {
  for (const { patterns, taskType } of PATTERNS) {
    if (patterns.some(p => p.test(message))) {
      return { taskType, params: extractParams(message, taskType), confidence: 0.85 }
    }
  }
  return { taskType: 'UNKNOWN', params: {}, confidence: 0 }
}

function extractParams(message: string, taskType: TaskType): Record<string, unknown> {
  switch (taskType) {
    case 'RESEARCH_QUERY':
    case 'SOLVE_BOUNTY':
      return { query: message }
    case 'LIST_BOUNTIES': {
      const today = /\btoday\b/i.test(message)
      return { filter: { date: today ? 'today' : undefined } }
    }
    case 'PUBLISH_CONTENT':
      return { url: message.match(/https?:\/\/[^\s]+/)?.[0] }
    case 'CREATE_BOUNTY':
      return { issueUrl: message.match(/https?:\/\/github\.com\/[^\s]+\/issues\/\d+/)?.[0] }
    case 'SUBMIT_SOLUTION':
      return { prUrl: message.match(/https?:\/\/github\.com\/[^\s]+\/pull\/\d+/)?.[0] }
    case 'APPROVE_SUBMISSION': {
      const hash = message.match(/#(\d+)/)
      const plain = message.match(/\b(\d+)\b/)
      return { bountyId: hash?.[1] ?? plain?.[1] }
    }
    default:
      return {}
  }
}
