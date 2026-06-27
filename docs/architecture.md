# Riven — Architecture Reference

Canonical source of truth for system design. Read before implementing any feature.

## System Overview

```
User (chat)
  ↓
apps/web  POST /api/chat
  ↓
packages/agents  classifyIntent → runTask
  ↓
[handler]
  ├── packages/db          (read/write Neon Postgres)
  ├── packages/arc-client  (wallet, escrow, gateway)
  ├── packages/x402        (source gating, payment probing)
  └── packages/payment-engine (queue payment orders)
        ↓
  apps/workers/engine-worker  (flush cycle, ARC Gateway settlement)
```

## Database Schema

Tables in `packages/db/src/schema.ts`:

| Table | Purpose |
|-------|---------|
| users | id, email, walletId, githubId, role, createdAt |
| wallets | id, arcWalletId, address, userId, balance, updatedAt |
| sources | id, url, title, authorId, price, trustScore, x402Endpoint, createdAt |
| reports | id, userId, query, content, totalSpent, createdAt |
| citations | id, reportId, sourceId, amount, txHash |
| bounties | id, creatorId, githubIssueId, repoUrl, title, description, reward, status, escrowId, createdAt |
| submissions | id, bountyId, hunterId, prUrl, status, submittedAt |
| escrows | id, bountyId, amount, status, arcEscrowId, lockedAt, releasedAt, releasedTo |
| paymentOrders | id, direction, amount, counterparty, ref, x402RequestId, status, batchId, txHash, queuedAt, expiresAt |

## API Endpoints (apps/web/app/api/)

### POST /api/chat
Main chat endpoint. Requires: `{ message, sessionId, userId }`.
1. Appends user message to Redis session
2. Loads user + wallet from DB
3. Calls `runTask` with AgentContext
4. Appends assistant reply to Redis session
5. Returns `{ text, data, totalSpent }`

### GET /api/user/me
Returns current user + wallet info. Reads session cookie.

### POST /api/wallet/create
Creates an ARC wallet for a new user via `arc-client`. Called during onboarding.

### GET /api/github/oauth
GitHub OAuth redirect. Returns code for exchange.

### POST /api/github/webhook
Receives GitHub PR merge events. Triggers escrow auto-release.

## Agent Flows

### Research Flow (RESEARCH_QUERY)
```
packages/agents/research/
  discovery.ts   → search Arxiv, Semantic Scholar, GitHub, HackerNews
  ranking.ts     → score by trust + relevance + cost + freshness
  budget.ts      → autonomous buy decision (trustScore/cost ratio ≥ threshold)
  synthesis.ts   → LLM report with inline citations
```
Each source purchase = one PaymentOrder pushed to engine.
No human approval step. Agent decides autonomously.
Report includes citation trail + total USDC spent.

### Seller Flow (PUBLISH_CONTENT)
```
packages/agents/seller/
  ingestion.ts   → extract PDF/markdown/URL content
  pricing.ts     → LLM auto-price based on length + topic + author reputation
  publisher.ts   → create x402 endpoint, insert into sources table
```
Seller stakes USDC to publish. Stake slashes on low citation rate.

### Bounty Flow (CREATE_BOUNTY, LIST_BOUNTIES, SUBMIT_SOLUTION, APPROVE_SUBMISSION)
```
packages/agents/bounty/
  generator.ts   → GitHub issue → bounty spec (LLM)
  lister.ts      → query bounties table, filter by status
  matcher.ts     → match hunter skills to open bounties
  verifier.ts    → check hunter PRs against bounty repo (GitHub API)
```
CREATE_BOUNTY: lock escrow via arc-client.
APPROVE_SUBMISSION: release escrow to hunter.
GitHub webhook (PR merged): auto-release escrow.

### Wallet Flow (WALLET_QUERY)
```
packages/agents/wallet/
  wallet-agent.ts → read wallets table, format balance + history
```

## Payment Engine Internals

```
packages/payment-engine/src/
  engine.ts        → PaymentEngine (orchestrator)
  order-book.ts    → OrderBook (in-memory queue, pop by direction)
  net-engine.ts    → NetEngine (cancel opposing flows, return net instructions)
  flush-trigger.ts → FlushTrigger (500ms timer | 50 count | $1.00 amount)
  batch-settler.ts → BatchSettler (calls arc-client.gateway.settle)
```

Flush conditions (whichever fires first): 500ms elapsed, 50 orders queued, $1.00 total queued.
NetEngine finds matching in/out pairs for same counterparty and cancels them before settling.
One ARC Gateway transaction per flush = gasless batch settlement.

## Session / Conversation Context

Redis stores full conversation history per session.
Key: `session:{sessionId}:{userId}`
Value: array of `{ role, content, timestamp }`

`packages/agents/src/session.ts` exports: `appendMessage`, `loadContext`

AgentContext passed to every handler includes `conversation` (full history) so handlers can resolve references like "this" or "that bounty".

## Environment Variables

```bash
# Database
NEON_DATABASE_URL=         # Neon serverless Postgres

# Cache
REDIS_URL=                 # Redis (localhost:6379 dev, Upstash prod)

# GitHub OAuth
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_WEBHOOK_SECRET=

# ARC / Circle (fill when replacing stubs)
CIRCLE_API_KEY=
ARC_RPC_URL=
ARC_TESTNET_CHAIN_ID=

# LLM
ANTHROPIC_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Stub Status

| Package | Status | Blocked By |
|---------|--------|------------|
| arc-client | Stubbed | Real Circle/ARC SDK |
| x402 | Stubbed | arc-nanopayments integration |
| agents/* handlers | Mostly stubbed | Phase 2 implementation |
| payment-engine | Real | — |

## Feature Priority (Hackathon)

Build order: Research flow → Seller flow → Bounty flow → Real SDKs → Traction

Core differentiators (do not cut):
- Batch order-book payment engine
- Autonomous research agent (no human approval)
- GitHub bounty → escrow → auto-release on PR merge
- Citation trail (proof payments flowed to real authors)
