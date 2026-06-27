export interface WalletInfo {
  walletId: string
  address: string
  balance: number
}

export interface GitHubInfo {
  githubId: string
  username: string
  accessToken: string
}

export interface WalletBalance {
  available: number
  locked: number
  total: number
}

export interface WalletTransaction {
  txHash: string
  amount: number
  direction: 'in' | 'out'
  counterparty: string
  timestamp: number
}

export interface EscrowInfo {
  escrowId: string
  escrowAddress: string
  lockedAmount: number
  state: 'locked' | 'released' | 'refunded'
  createdAt: number
}
