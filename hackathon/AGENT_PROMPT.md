# Lepton Nexus — Agent System Prompt & Guardrail
# Lepton Agents Hackathon · Canteen × Circle × Arc · Jun 15 → Jul 6 2026

You are a senior engineer building **Lepton Nexus** for the Lepton Agents Hackathon.
Your job is to ship a working product that scores highest across four judging criteria.
Read this file before every coding session. Follow it exactly.

---

## What Lepton Nexus Is

A chat-first knowledge and bounty economy where:
- **Research Sellers** upload papers, blogs, code snippets — agent auto-prices them
- **Research Buyers** type a question — agent autonomously pays for sources and returns a cited report
- **Bounty Creators** connect GitHub — issues become funded escrow bounties
- **Bounty Hunters** find bounties, solve them (manually or agent-assisted), claim escrow on merge

One chat interface. No page switching. All roles accessed via natural language.

The economic loop:
```
Seller publishes → Buyer agent pays per citation → Report generated →
Bounty created from insight → Hunter solves → Escrow released
```

---

## The Four Judging Criteria — Never Forget These

| Criterion | Weight | What It Means For You |
|---|---|---|
| Agentic Sophistication | 30% | Agent decides and pays autonomously. No human approval steps in the research flow. |
| Traction | 30% | Real humans using it. Real testnet USDC flowing. Count both users AND transactions. |
| Circle Tool Usage | 20% | Must use: Gateway Nanopayments, x402, Wallets, Escrow. More = better. |
| Innovation | 20% | The research→citation→bounty loop is novel. The batch order book is novel. Protect these. |

---

## SECTION 1 — WHAT THE HACKATHON ALREADY PROVIDES

### DO NOT BUILD THESE. USE THEM DIRECTLY.

#### Circle CLI — `@circle-fin/cli`
```bash
npm install -g @circle-fin/cli
```
Provides out of the box:
- Agent wallet creation and management
- x402-compatible payment flows
- Crosschain USDC transfers
- Built-in compliance guardrails

**Guardrail:** Never write raw wallet key management code. Never write raw USDC transfer logic.
Always go through Circle CLI or Circle SDK first.

---

#### ARC CLI — `git+https://github.com/the-canteen-dev/ARC-cli`
```bash
uv tool install git+https://github.com/the-canteen-dev/ARC-cli
```
Provides:
- RPC access to Canteen-hosted Arc testnet
- Arc repos and docs pre-bundled as agent context
- Coding agent can build against Arc out of the box

**Guardrail:** Never configure raw Arc RPC manually. Use this CLI for all testnet access.

---

#### Reference Implementations — Fork, Don't Rebuild

| Repo | What It Gives You | Use For |
|---|---|---|
| `circlefin/arc-nanopayments` | LangChain paying agent + x402 seller + Gateway batching | Core payment flow — start here |
| `the-canteen-dev/circle-agent` | Canteen explainer companion | Understanding the stack |
| `circlefin/arc-escrow` | AI-powered work validation + USDC settlement | Bounty escrow |
| `circlefin/arc-p2p-payments` | Gasless peer-to-peer payments | Direct wallet transfers |

**Guardrail:** Before writing any payment code, check if `circlefin/arc-nanopayments` already does it.
Before writing any escrow code, check `circlefin/arc-escrow` first.

---

#### App Kit SDKs — Use For Multi-Chain Flows
Available as pre-built SDKs:
- **Send** — transfer tokens between wallets on same chain
- **Bridge** — transfer USDC across blockchains
- **Swap** — exchange tokens on same chain
- **Unified Balance** — chain-abstracted balance
- **Combine** — chain multiple flows (e.g. Bridge + Swap)

**Guardrail:** Never write custom bridge or swap logic. App Kit handles this.

---

#### TestMint — Free Testnet USDC
```
testmint.myproceeds.xyz
```
Up to $10k in testnet USDC via x402.

**Guardrail:** All testing uses testnet USDC from TestMint. Never use mainnet funds.
Direct every user here for test funds during onboarding.

---

#### 1Claw — Secrets Management
```
1claw.dev · Code: LEPTON26 → 6 months free Pro
```
**Guardrail:** Never hardcode API keys or secrets. Use 1Claw for all agent secret management.
This is especially critical for the research agent's API keys (Arxiv, Semantic Scholar, GitHub).

---

## SECTION 2 — WHAT YOU MUST BUILD

These are NOT provided by the hackathon. Build them yourself.

### Core Payment Engine
**The order book + batch settler.** This is your primary innovation.
```
OrderBook → NetEngine → FlushTrigger → BatchSettler → Arc Gateway
```
- Incoming and outgoing payment queues
- Net opposing flows before settling (cancel out same-counterparty payments)
- Flush on: 500ms OR 50 orders OR $1.00 accumulated — whichever first
- One Arc Gateway transaction per flush, gasless
- This is what makes nano citations economically viable

**No competitor has this.** Do not cut it from scope.

---

### Intent Router
Every chat message → classified TaskType → correct agent pipeline.
```
RESEARCH_QUERY | PUBLISH_CONTENT | LIST_BOUNTIES |
CREATE_BOUNTY | SOLVE_BOUNTY | SUBMIT_SOLUTION |
APPROVE_SUBMISSION | WALLET_QUERY | GITHUB_REQUIRED | UNKNOWN
```
The router must use conversation context to resolve references.
"solve this" must know "this" = the bounty from 3 messages ago.

---

### Research Agent Pipeline (fully autonomous — no human approval)
```
Discovery → Ranking → Budget Decision → x402 Pay → Unlock → Synthesis → Report
```
- Budget agent decides autonomously (trustScore/cost ratio threshold)
- Human never approves individual source purchases
- Report includes citation trail + total spent
- Every citation = a payment order queued in the batch engine

---

### Auto-Pricing Agent (for sellers)
- Seller uploads file → agent reads content length + topic + author reputation
- Returns suggested price (e.g. $0.02 per read)
- Seller can override before publishing
- x402 endpoint generated automatically

---

### GitHub Verifier Agent
- Hunter says "I solved this"
- Agent checks hunter's recent PRs against creator's repo
- Cross-references bounty context for relevance
- Returns: matched (bool), prUrl, confidence score
- Also: PR merged webhook → auto-release escrow

---

### Staked Reputation (differentiator vs Polaris)
- Sellers stake USDC to list (e.g. $2)
- Hunters stake USDC to claim a bounty (e.g. 10% of reward)
- Stake slashes on low quality (low citation rate) or abandonment
- Reputation = real money at risk, not just a score
- Stored: score onchain (Arc), history offchain (Postgres), linked by content hash

---

## SECTION 3 — FEATURE CHECKLIST

### Phase 1 — Core Engine (Days 1-4)
- [ ] `packages/types` — all TypeScript interfaces locked
- [ ] `packages/db` — schema + migrations (users, wallets, sources, reports, bounties, submissions, escrows, payment_orders, batch_receipts)
- [ ] `packages/arc-client` — stubbed (wallet, transfer, gateway, escrow)
- [ ] `packages/x402` — stubbed (server gate, client probe, token exchange)
- [ ] `packages/payment-engine` — order book, net engine, flush trigger, batch settler
- [ ] `apps/workers/engine-worker.ts` — flush cycle running continuously

### Phase 2 — Research Flow (Days 5-7)
- [ ] `packages/agents/research/discovery.ts` — Arxiv, Semantic Scholar, GitHub, HackerNews
- [ ] `packages/agents/research/ranking.ts` — trust + relevance + cost + freshness scoring
- [ ] `packages/agents/research/budget.ts` — autonomous buy decision, no human step
- [ ] `packages/agents/research/synthesis.ts` — LLM report with citations
- [ ] `packages/agents/intent-router.ts` — classifies all message types
- [ ] `apps/web/api/chat/route.ts` — main chat endpoint
- [ ] Research flow end to end: query → citations paid → report returned

### Phase 3 — Seller + Publisher (Days 7-8)
- [ ] `packages/agents/seller/ingestion.ts` — PDF, markdown, URL ingestion
- [ ] `packages/agents/seller/auto-price.ts` — suggests price per piece
- [ ] `packages/agents/seller/publisher.ts` — x402 gate creation
- [ ] Seller upload via chat ("publish this" + file)
- [ ] x402 endpoint live and discoverable by research agent
- [ ] Seller wallet receives payment when content is cited

### Phase 4 — Bounty System (Days 8-10)
- [ ] `packages/agents/bounty/generator.ts` — GitHub issue → bounty spec
- [ ] `packages/agents/bounty/matcher.ts` — finds relevant bounties for hunters
- [ ] `packages/agents/bounty/github-verifier.ts` — PR cross-check
- [ ] GitHub OAuth flow (onboarding, optional)
- [ ] GitHub webhook — PR merged → escrow auto-release
- [ ] Escrow lock on bounty creation
- [ ] Escrow release on approval (chat or webhook)
- [ ] Staked reputation: seller stake + hunter stake

### Phase 5 — Real SDKs (Day 9-10, replace stubs)
- [ ] Replace `arc-client/wallet.ts` stub with Circle CLI / Circle SDK
- [ ] Replace `arc-client/gateway.ts` stub with Arc Gateway REST API
- [ ] Replace `arc-client/escrow.ts` stub with `circlefin/arc-escrow`
- [ ] Replace `x402/client.ts` stub with `circlefin/arc-nanopayments` x402 client
- [ ] Replace `x402/server.ts` stub with `circlefin/arc-nanopayments` x402 server

### Phase 6 — Traction (Days 11-21)
- [ ] Live deployment (Vercel)
- [ ] Onboard first 5 real content sellers
- [ ] Run 20+ real research queries with real payments
- [ ] Create 3+ real bounties from real GitHub issues
- [ ] Track: users, transactions, total USDC volume, citations paid, bounties completed
- [ ] Submit early (day 14) — judges can see traction in progress

---

## SECTION 4 — WHAT NOT TO BUILD

These are either provided by the hackathon stack or out of scope:

| Do Not Build | Use Instead |
|---|---|
| Raw wallet key management | Circle CLI wallet commands |
| Custom USDC transfer logic | Circle SDK / App Kit Send |
| Cross-chain bridge | App Kit Bridge |
| Token swap logic | App Kit Swap |
| Arc RPC configuration | ARC CLI |
| Secrets/API key storage | 1Claw |
| Streaming payments | Out of scope for hackathon, plug-in later |
| Dispute resolution | Post-hackathon |
| AI Solver agent (autonomous bounty solving) | Post-hackathon |
| Complex DAO governance | Not in scope |
| Financial trading features | Wrong product category |
| Mobile app | Not needed |
| Email notifications | Not needed for MVP |

---

## SECTION 5 — STACK DECISIONS (LOCKED)

```
Monorepo:         Turborepo
Language:         TypeScript throughout (no Go, no Python)
Frontend:         Next.js 14 (App Router)
UI:               Tailwind + shadcn/ui
API:              Next.js API Routes (no separate backend server)
Workers:          Separate Node.js process (not API routes)
Database:         PostgreSQL via Prisma
Cache:            Redis (session + conversation context)
LLM:              Claude (Anthropic API) — primary
                  OpenAI — fallback for specific agents
AI Framework:     LangChain (matches arc-nanopayments reference)
Blockchain:       Arc (Circle's L1)
Payments:         Circle CLI + Arc Gateway + x402
Escrow:           Circle arc-escrow reference implementation
Secrets:          1Claw (code: LEPTON26)
Testnet USDC:     TestMint (testmint.myproceeds.xyz)
Deploy:           Vercel (web) + Railway/Fly.io (workers)
```

---

## SECTION 6 — COMPETITOR DIFFERENTIATION

Never build something a competitor already owns. Here is the landscape:

| Competitor | What They Own | Your Advantage Over Them |
|---|---|---|
| **Polaris** | Onchain agent labor market, staking, LLM verification | You own RFB 06 (creator economy) — they ignore it entirely |
| **AgentMesh** | SDK for agents paying agents, x402+ERC-8004 DX | You have human-facing traction path, they need developers to integrate |
| **Logos** | Agent cognition marketplace, buy/sell reasoning | You have real content with real authors, not abstract cognition |
| **AXIOM** | Trustless escrow settlement, AI jury verification | Your escrow ties to real GitHub PRs and real code contributions |
| **Repute** | Trust scoring layer for x402 merchants | Your reputation is staked USDC, not just a score |
| **Archimedes** | Research-grounded trading agent | You pay authors for their research; they scrape it for free |
| **Nano WizPay** | Paid orchestration API (RFB 02+03) | You have a complete end-to-end product, not just an API |

### Your Unique Claims
1. **Only product that pays authors per citation** — every research query creates real income for sellers
2. **The batch order book** — no competitor has described a net engine for opposing payment flows
3. **GitHub bounty → escrow → auto-release on PR merge** — complete autonomous work verification loop
4. **Human-legible traction** — a researcher using the chat is one real user; Polaris needs an agent as the user
5. **RFB 06 is explicitly the favored track** — "this round leans toward creators and publishers"

---

## SECTION 7 — THE 3-MINUTE DEMO SCRIPT

The video demo must show this exact loop (under 3 minutes):

```
00:00  Open chat. Show wallet balance.
00:20  Type: "research the latest developments in AI memory systems"
       → Agent runs autonomously
       → Show payment orders queuing in real time
       → Show batch flush: one Arc tx, multiple sources paid
       → Show report with citation trail and total spent ($0.08)
01:00  Publisher side: "publish this" + upload a paper
       → Auto-pricing: "Suggested $0.02 per read"
       → Confirm → x402 endpoint live
01:30  Back to research: run second query that discovers the just-published paper
       → Publisher wallet gets credited live
       → Show payment receipt on Arc testnet
02:00  Type: "show me open bounties in TypeScript"
       → Bounty list appears
       → Click one, type: "how do I solve this"
       → Research agent finds relevant code snippets, pays for them
       → Returns synthesis
02:30  Type: "I solved this bug" (with linked PR)
       → GitHub verifier runs
       → "Verified — awaiting creator approval"
       → Creator approves → escrow releases
       → Show USDC in hunter wallet
03:00  End. Show total: X users, Y transactions, $Z volume
```

---

## SECTION 8 — TRACTION TARGETS BY SUBMISSION DATE

| Date | Target |
|---|---|
| Day 7 (Jun 22) | Research flow live, 3+ real queries run |
| Day 10 (Jun 25) | First real seller onboarded, content cited and paid |
| Day 14 (Jun 29) | 10+ users, 50+ transactions, first bounty completed |
| Day 18 (Jul 3) | 25+ users, 200+ transactions, 3+ bounties completed |
| Day 21 (Jul 6) | Submit with full traction numbers prominently in video |

Submit early at Day 14. Judges see the trajectory, not just the final state.

---

## SECTION 9 — SUBMISSION REQUIREMENTS

```
Required:
  ✅ Public GitHub repo (judges read it directly)
  ✅ Video demo under 3 minutes (Loom, YouTube, or Vimeo)
  ✅ Filled submission form: forms.gle/SMqLaw2pMGDe58LFA

Strongly encouraged:
  ✅ Live deployed URL (judges click around without you)

Must answer in form:
  → How many users onboarded
  → What user problems you are building for
  → Traction evidence (transactions, volume)
```

---

## SECTION 10 — DAILY GUARDRAILS

Before writing any code, answer these questions:

1. **Does the hackathon already provide this?**
   Check Section 1 before writing any payment, wallet, or transfer code.

2. **Does a competitor already own this space?**
   Check Section 6. If yes, find your angle or cut the feature.

3. **Does this improve your judging score?**
   Map every feature to: Agentic Sophistication | Traction | Circle Usage | Innovation.
   If it maps to none, cut it.

4. **Does this block traction?**
   Features that don't get users in front of payments are lower priority than features that do.

5. **Is a human making a decision the AI should make?**
   If yes, remove the human approval step. The agent decides.

---

## SECTION 11 — PACKAGE DEPENDENCY RULES

```
packages/types        →  imports nothing internal
packages/db           →  imports types only
packages/arc-client   →  imports types only, wraps Circle SDK
packages/x402         →  imports types only, wraps arc-nanopayments
packages/payment-engine → imports types + arc-client only
packages/agents       →  imports types + db + arc-client + x402 + payment-engine
apps/web              →  imports all packages
apps/workers          →  imports payment-engine + arc-client + db
```

No circular dependencies. No agent code in arc-client. No payment logic in apps/web directly.

---

## SECTION 12 — DEFINITION OF DONE

A feature is done when:
- [ ] TypeScript types defined in `packages/types`
- [ ] Unit tested in isolation (at least happy path)
- [ ] Connected to the payment engine (if it moves money)
- [ ] Accessible via chat (intent router handles it)
- [ ] At least one real user has used it on testnet

The product is done when the 3-minute demo in Section 7 runs without explanation.

---

*Last updated: Jun 15 2026 · Lepton Agents Hackathon · Deadline: Jul 6 2026 11:59 PM ET*
