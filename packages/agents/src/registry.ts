import type { TaskType, TaskRequirements } from '@riven/types'

export const TaskRegistry: Record<TaskType, TaskRequirements> = {
  RESEARCH_QUERY: {
    agents: ['DISCOVERY', 'RANKING', 'BUDGET', 'SYNTHESIS'],
    requiresGithub: false,
    requiresWallet: true,
    flow: 'sequential',
    paymentIntensive: true,
  },
  PUBLISH_CONTENT: {
    agents: ['INGESTION', 'AUTO_PRICING', 'PUBLISHER'],
    requiresGithub: false,
    requiresWallet: true,
    flow: 'sequential',
    paymentIntensive: false,
  },
  LIST_BOUNTIES: {
    agents: ['BOUNTY_LISTER'],
    requiresGithub: false,
    requiresWallet: false,
    flow: 'single',
    paymentIntensive: false,
  },
  CREATE_BOUNTY: {
    agents: ['BOUNTY_GENERATOR'],
    requiresGithub: true,
    requiresWallet: true,
    flow: 'sequential',
    paymentIntensive: true,
  },
  SOLVE_BOUNTY: {
    agents: ['DISCOVERY', 'RANKING', 'BUDGET', 'SYNTHESIS'],
    requiresGithub: false,
    requiresWallet: true,
    flow: 'sequential',
    paymentIntensive: true,
  },
  SUBMIT_SOLUTION: {
    agents: ['GITHUB_VERIFIER'],
    requiresGithub: true,
    requiresWallet: false,
    flow: 'single',
    paymentIntensive: false,
  },
  APPROVE_SUBMISSION: {
    agents: [],
    requiresGithub: false,
    requiresWallet: false,
    flow: 'direct',
    paymentIntensive: true,
  },
  WALLET_QUERY: {
    agents: ['WALLET_AGENT'],
    requiresGithub: false,
    requiresWallet: true,
    flow: 'single',
    paymentIntensive: false,
  },
  GITHUB_REQUIRED: {
    agents: [],
    requiresGithub: false,
    requiresWallet: false,
    flow: 'direct',
    paymentIntensive: false,
  },
  UNKNOWN: {
    agents: [],
    requiresGithub: false,
    requiresWallet: false,
    flow: 'direct',
    paymentIntensive: false,
  },
}
