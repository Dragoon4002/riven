export interface Source {
  id: string
  url: string
  title: string
  authorId: string
  price: number
  trustScore: number
  x402Endpoint: string
  createdAt: number
}

export interface RankedSource extends Source {
  relevanceScore: number
  costEfficiency: number
  rankPosition: number
}

export interface Citation {
  id: string
  reportId: string
  sourceId: string
  amount: number
  txHash: string
}

export interface Report {
  id: string
  userId: string
  query: string
  content: string
  citations: Citation[]
  totalSpent: number
  createdAt: number
}

export interface Bounty {
  id: string
  creatorId: string
  githubIssueId: string
  repoUrl: string
  title: string
  description: string
  reward: number
  status: 'active' | 'completed' | 'cancelled'
  escrowId: string
  createdAt: number
}

export interface Submission {
  id: string
  bountyId: string
  hunterId: string
  prUrl: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: number
}

export interface Escrow {
  id: string
  bountyId: string
  amount: number
  status: 'locked' | 'released' | 'refunded'
  arcEscrowId: string
  lockedAt: number
  releasedAt?: number
  releasedTo?: string
}

export interface UnlockedContent {
  sourceId: string
  url: string
  content: string
  title: string
}

export interface ExtractedContent {
  contentId: string
  text: string
  title: string
  author: string
  wordCount: number
  topics: string[]
}
