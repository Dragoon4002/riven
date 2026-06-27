# Lepton Nexus — Daily Build Checklist
# Deadline: Jul 6 2026 11:59 PM ET

Track every item. Check it only when a real user has confirmed it works.

---

## Week 1 — Engine + Research Flow

### Day 1 — Types + DB Schema
- [ ] `packages/types/src/user.ts` — User, Role, GitHubConnection
- [ ] `packages/types/src/wallet.ts` — Wallet, Balance, Transaction
- [ ] `packages/types/src/payment.ts` — PaymentOrder, BatchInstruction, BatchReceipt, OrderBook
- [ ] `packages/types/src/research.ts` — Source, RankedSource, UnlockedContent, Report, Citation
- [ ] `packages/types/src/bounty.ts` — Bounty, Submission, EscrowState, StakeRecord
- [ ] `packages/types/src/agent.ts` — AgentProfile, Reputation, TaskType, Task, AgentResult
- [ ] `packages/types/src/index.ts` — barrel export
- [ ] DB migration 001: users
- [ ] DB migration 002: wallets
- [ ] DB migration 003: sources
- [ ] DB migration 004: reports + citations
- [ ] DB migration 005: bounties
- [ ] DB migration 006: submissions
- [ ] DB migration 007: escrows
- [ ] DB migration 008: payment_orders
- [ ] DB migration 009: batch_receipts
- [ ] DB migration 010: stakes + reputation

### Day 2 — Arc Client + x402 (Stubs)
- [ ] `packages/arc-client/src/wallet.ts` — create, connect, balance, history (STUB)
- [ ] `packages/arc-client/src/transfer.ts` — send, sendBatch (STUB)
- [ ] `packages/arc-client/src/gateway.ts` — submitBatch (STUB → logs to console)
- [ ] `packages/arc-client/src/escrow.ts` — lock, release, refund, status (STUB)
- [ ] `packages/x402/src/server.ts` — gate middleware (STUB)
- [ ] `packages/x402/src/client.ts` — probe, getToken, fetch (STUB)
- [ ] `packages/x402/src/token.ts` — generate, verify (STUB)
- [ ] All stubs compile and return mock data correctly

### Day 3 — Payment Engine
- [ ] `packages/payment-engine/src/order-book.ts` — push, pop, expire
- [ ] `packages/payment-engine/src/net-engine.ts` — net opposing flows by counterparty
- [ ] `packages/payment-engine/src/flush-trigger.ts` — time + count + amount thresholds
- [ ] `packages/payment-engine/src/batch-settler.ts` — calls gateway.submitBatch
- [ ] `packages/payment-engine/src/engine.ts` — orchestrates all, exposes push + onSettle
- [ ] Engine unit tests: push orders, verify flush, verify netting
- [ ] `apps/workers/src/engine-worker.ts` — starts engine, runs indefinitely

### Day 4 — Engine Worker Running + Intent Router
- [ ] Engine worker boots without crashing
- [ ] Engine flushes on 500ms tick (verify via logs)
- [ ] Engine flushes on 50 order count threshold
- [ ] Engine flushes on $1.00 amount threshold
- [ ] Net engine cancels opposing flows correctly (unit test)
- [ ] `packages/agents/src/intent-router.ts` — classifies all 10 TaskTypes
- [ ] Router resolves context references ("this", "that bounty")
- [ ] Router returns GITHUB_REQUIRED for GitHub-gated tasks when not connected

### Day 5 — Discovery + Ranking + Budget Agents
- [ ] `packages/agents/src/research/discovery.ts` — hits Arxiv API
- [ ] `packages/agents/src/research/discovery.ts` — hits Semantic Scholar API
- [ ] `packages/agents/src/research/discovery.ts` — hits GitHub search API
- [ ] `packages/agents/src/research/discovery.ts` — hits HackerNews Algolia API
- [ ] `packages/agents/src/research/ranking.ts` — trust score (domain + citations)
- [ ] `packages/agents/src/research/ranking.ts` — relevance score (semantic similarity)
- [ ] `packages/agents/src/research/ranking.ts` — freshness score (publish date)
- [ ] `packages/agents/src/research/ranking.ts` — cost score (price from x402 probe)
- [ ] `packages/agents/src/research/budget.ts` — autonomous buy/no-buy decision
- [ ] Budget agent has no human approval step
- [ ] Budget agent respects per-query cap + daily cap

### Day 6 — Synthesis + Chat API Route
- [ ] `packages/agents/src/research/synthesis.ts` — LLM report generation
- [ ] Synthesis includes numbered citations linking to paid sources
- [ ] Synthesis includes total cost paid
- [ ] `apps/web/app/api/chat/route.ts` — receives message, loads context, calls router
- [ ] Chat route saves conversation to Redis
- [ ] Chat route persists report to DB
- [ ] ConversationContext tracks activeContext (currentBounty, currentReport)

### Day 7 — Research Flow End to End
- [ ] Full flow works: query → discovery → ranking → budget → x402 pay → unlock → synthesis → report
- [ ] Payment orders queue in engine during flow
- [ ] Batch flush settles all source payments in one transaction
- [ ] Report appears in chat with citations and cost
- [ ] Run 3 real research queries manually and verify

---

## Week 2 — Seller + Bounty + Real SDKs

### Day 8 — Seller Flow
- [ ] `packages/agents/src/seller/ingestion.ts` — PDF ingestion
- [ ] `packages/agents/src/seller/ingestion.ts` — markdown ingestion
- [ ] `packages/agents/src/seller/ingestion.ts` — URL ingestion
- [ ] `packages/agents/src/seller/auto-price.ts` — content length + topic + author rep → price
- [ ] `packages/agents/src/seller/publisher.ts` — creates x402 gated endpoint
- [ ] File upload via chat ("publish this" + file attachment)
- [ ] x402 endpoint registered and discoverable by research agent
- [ ] Seller wallet receives USDC when content cited
- [ ] Onboard first real content seller

### Day 9 — Bounty System + GitHub
- [ ] GitHub OAuth flow wired (onboarding, optional)
- [ ] GitHub not connected → chat message, no block
- [ ] `packages/agents/src/bounty/generator.ts` — issue → bounty spec (title, description, criteria, reward, complexity)
- [ ] `packages/agents/src/bounty/matcher.ts` — finds bounties by skill + reward + age
- [ ] `packages/agents/src/bounty/github-verifier.ts` — PR cross-check against repo
- [ ] `apps/web/app/api/github/webhook/route.ts` — PR merged → escrow release
- [ ] Escrow lock on bounty creation
- [ ] Escrow release on creator approval in chat
- [ ] Escrow release on PR merge via webhook (auto)

### Day 10 — Staked Reputation + Real SDKs
- [ ] Seller stake: deducted on publish, slashed on low citation rate
- [ ] Hunter stake: deducted on bounty claim, slashed on abandon
- [ ] Reputation score updates after each transaction
- [ ] Reputation onchain (Arc) + history offchain (Postgres)
- [ ] Replace `arc-client/wallet.ts` stub → Circle CLI wallet
- [ ] Replace `arc-client/gateway.ts` stub → Arc Gateway REST API
- [ ] Replace `arc-client/escrow.ts` stub → circlefin/arc-escrow
- [ ] Replace `x402/client.ts` stub → circlefin/arc-nanopayments
- [ ] Replace `x402/server.ts` stub → circlefin/arc-nanopayments
- [ ] Real testnet USDC flows end to end

### Day 11 — Chat UI + Full Integration Test
- [ ] Chat interface renders messages correctly
- [ ] File upload in chat works
- [ ] Wallet balance visible in chat
- [ ] GitHub connect CTA shows when needed
- [ ] Bounty cards render in chat
- [ ] Report renders with clickable citations
- [ ] Full loop test: seller publishes → buyer queries → seller paid → bounty created → hunter solves → escrow released

---

## Week 3 — Traction + Polish + Submit

### Day 12-14 — First Traction Push
- [ ] Live URL deployed on Vercel
- [ ] 5+ real users onboarded with wallets
- [ ] 20+ real research queries run
- [ ] 3+ real sellers with published content
- [ ] At least 2 sellers earning from citations
- [ ] Submit first draft to forms.gle/SMqLaw2pMGDe58LFA
- [ ] Record first draft video demo

### Day 15-18 — Traction Scale
- [ ] 25+ users onboarded
- [ ] 200+ research queries
- [ ] 100+ citation payments
- [ ] 5+ bounties created
- [ ] 2+ bounties completed + escrow released
- [ ] TestMint funds confirmed available for users

### Day 19-21 — Final Polish + Submit
- [ ] Final video demo recorded (under 3 minutes, follows Section 7 script)
- [ ] README complete with architecture diagram
- [ ] GitHub repo public and readable without explanation
- [ ] Live URL works without login friction
- [ ] Traction numbers documented: users / txns / volume / citations / bounties
- [ ] Final submission to forms.gle/SMqLaw2pMGDe58LFA before Jul 6 11:59 PM ET

---

## Traction Tracker

Update this daily:

| Date | Users | Queries | Transactions | USDC Volume | Citations Paid | Bounties |
|---|---|---|---|---|---|---|
| Jun 22 | | | | | | |
| Jun 25 | | | | | | |
| Jun 29 | | | | | | |
| Jul 3  | | | | | | |
| Jul 6  | | | | | | |

---

## Circle Tool Usage Tracker

Every tool used adds to the 20% Circle score. Track what is wired:

- [ ] Wallets API — create + manage agent wallets
- [ ] Gateway Nanopayments — batch citation payments
- [ ] x402 Protocol — content gating
- [ ] Escrow — bounty lock + release
- [ ] App Kit Send — direct wallet transfers
- [ ] USDC — settlement currency throughout
- [ ] Circle CLI — wallet provisioning
- [ ] Arc Testnet — all transactions

---

*Lepton Nexus · Lepton Agents Hackathon · deadline Jul 6 2026*
