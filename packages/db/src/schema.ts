import {
  pgTable,
  text,
  integer,
  real,
  boolean,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core'

export const bountyStatusEnum = pgEnum('bounty_status', ['active', 'completed', 'cancelled'])
export const submissionStatusEnum = pgEnum('submission_status', ['pending', 'approved', 'rejected'])
export const escrowStatusEnum = pgEnum('escrow_status', ['locked', 'released', 'refunded'])
export const paymentDirectionEnum = pgEnum('payment_direction', ['in', 'out'])
export const paymentStatusEnum = pgEnum('payment_status', ['queued', 'batched', 'settled', 'failed', 'expired'])

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique(),
  walletId: text('wallet_id').notNull(),
  githubId: text('github_id'),
  role: text('role').notNull().default('user'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const wallets = pgTable('wallets', {
  id: text('id').primaryKey(),
  arcWalletId: text('arc_wallet_id').notNull(),
  address: text('address').notNull().unique(),
  userId: text('user_id').notNull().references(() => users.id),
  balance: real('balance').notNull().default(0),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const sources = pgTable('sources', {
  id: text('id').primaryKey(),
  url: text('url').notNull(),
  title: text('title').notNull(),
  authorId: text('author_id').notNull().references(() => users.id),
  price: real('price').notNull(),
  trustScore: real('trust_score').notNull().default(0.5),
  x402Endpoint: text('x402_endpoint').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const reports = pgTable('reports', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  query: text('query').notNull(),
  content: text('content').notNull(),
  totalSpent: real('total_spent').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const citations = pgTable('citations', {
  id: text('id').primaryKey(),
  reportId: text('report_id').notNull().references(() => reports.id),
  sourceId: text('source_id').notNull().references(() => sources.id),
  amount: real('amount').notNull(),
  txHash: text('tx_hash').notNull(),
})

export const bounties = pgTable('bounties', {
  id: text('id').primaryKey(),
  creatorId: text('creator_id').notNull().references(() => users.id),
  githubIssueId: text('github_issue_id').notNull(),
  repoUrl: text('repo_url').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  reward: real('reward').notNull(),
  status: bountyStatusEnum('status').notNull().default('active'),
  escrowId: text('escrow_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const submissions = pgTable('submissions', {
  id: text('id').primaryKey(),
  bountyId: text('bounty_id').notNull().references(() => bounties.id),
  hunterId: text('hunter_id').notNull().references(() => users.id),
  prUrl: text('pr_url').notNull(),
  status: submissionStatusEnum('status').notNull().default('pending'),
  submittedAt: timestamp('submitted_at').notNull().defaultNow(),
})

export const escrows = pgTable('escrows', {
  id: text('id').primaryKey(),
  bountyId: text('bounty_id').notNull().references(() => bounties.id),
  amount: real('amount').notNull(),
  status: escrowStatusEnum('status').notNull().default('locked'),
  arcEscrowId: text('arc_escrow_id').notNull(),
  lockedAt: timestamp('locked_at').notNull().defaultNow(),
  releasedAt: timestamp('released_at'),
  releasedTo: text('released_to'),
})

export const paymentOrders = pgTable('payment_orders', {
  id: text('id').primaryKey(),
  direction: paymentDirectionEnum('direction').notNull(),
  amount: real('amount').notNull(),
  counterparty: text('counterparty').notNull(),
  ref: text('ref').notNull(),
  x402RequestId: text('x402_request_id'),
  status: paymentStatusEnum('status').notNull().default('queued'),
  batchId: text('batch_id'),
  txHash: text('tx_hash'),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const batchReceipts = pgTable('batch_receipts', {
  id: text('id').primaryKey(),
  txHash: text('tx_hash').notNull(),
  ordersSettled: integer('orders_settled').notNull(),
  totalAmount: real('total_amount').notNull(),
  gasCost: real('gas_cost').notNull(),
  settledAt: timestamp('settled_at').notNull(),
  durationMs: integer('duration_ms').notNull(),
})
