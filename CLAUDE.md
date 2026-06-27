# Riven

AI-powered research + bounty marketplace. Chat-first. Intent router dispatches to specialized agents. Payments via USDC micro-transactions batched through an order-book engine (ARC Gateway + x402).

Hackathon: Lepton Agents (Canteen × Circle × Arc) · Deadline Jul 6 2026

## Repo Layout

```
riven/                          ← git root (not apps/)
  apps/
    web/        Next.js 16 + React 19 (primary UI + API routes)
    workers/    Background processes (engine-worker, github-worker)
  packages/
    types/          Shared TS interfaces — imports nothing internal
    db/             Drizzle ORM + Neon Postgres
    arc-client/     ARC/Circle SDK wrapper (STUBBED — awaiting real Circle SDK)
    x402/           x402 protocol wrapper (STUBBED — awaiting real SDK)
    payment-engine/ OrderBook → NetEngine → FlushTrigger → BatchSettler (REAL)
    agents/         Intent router + all agent handlers
  infrastructure/ docker-compose (Redis)
  docs/           Architecture + protocol reference — READ BEFORE CODING
  tasks/          todo.md (current sprint) + lessons.md
  hackathon/      Judging criteria, checklist, competitor analysis
```

## Dev Commands (from repo root)

```bash
bun run dev          # Next.js dev server (apps/web, localhost:3000)
bun run build        # Production build (apps/web)
bun run typecheck    # Type-check all packages (excludes apps/web)
```

```bash
# Push schema changes to Neon
cd packages/db && NEON_DATABASE_URL="..." bunx drizzle-kit push
```

```bash
docker compose -f infrastructure/docker-compose.yml up -d   # Redis
```

## Implementation Status

### REAL (working)
- Payment engine: OrderBook → NetEngine → FlushTrigger → BatchSettler
- Research pipeline: discovery (Arxiv + HN + DB) → ranking → budget → synthesis (Gemini)
- Seller pipeline: ingestion (URL fetch) → pricing (Gemini) → publisher (DB)
- LLM layer: `packages/agents/src/llm.ts` — 4-key Gemini rotation, Redis rate limit, sanitize
- GitHub OAuth: `/api/github/oauth` — stores githubId on user
- GitHub webhook: `/api/github/webhook` — PR merged → auto-release escrow
- Onboarding: wallet create → DB insert → cookie set
- Chat API route: session, intent classification, handler dispatch

### STUBBED (returns mock data)
- `packages/arc-client` — all methods (wallet create/balance, gateway submitBatch, escrow lock/release)
- `packages/x402` — all methods (probe, getToken, fetch, gate, verify)
- `packages/agents/src/bounty/verifier.ts` — always returns matched: false
- `packages/agents/src/bounty/generator.ts` — returns hardcoded spec
- `packages/agents/src/handlers/create_bounty.ts` — just asks for issue URL
- `packages/agents/src/wallet/wallet-agent.ts` — balance always $100 (stub arc-client)

### MISSING
- Intent router does NOT extract params from messages (url, issueUrl, bountyId, prUrl)
- External sources (Arxiv/HN) in research handler use x402 probe — should fetch directly
- Content delivery route `/api/sources/[id]` does not exist
- Content text not stored anywhere after publish (only metadata in DB)

## LLM

All LLM goes through `packages/agents/src/llm.ts`. Never import ai SDK or @ai-sdk/google directly in handlers.

```typescript
import { llmText, llmObject } from '../llm'  // from within packages/agents/src/
```

Model: `gemini-2.0-flash-exp` (default). Keys: `GOOGLE_AI_KEY_1` → `GOOGLE_AI_KEY_4` in env.
Rate limit: 20 calls/min per user (Redis). Keys rotate on 429/quota error.

| Agent | Model | Why |
|-------|-------|-----|
| Research Synthesis | gemini-2.0-flash-exp | Quality report |
| Auto-Pricing | gemini-2.0-flash-exp | Structured output via llmObject |
| Bounty Generator | gemini-2.0-flash-exp | Structured output via llmObject |
| Topic Extraction | gemini-2.0-flash-exp | Simple classification |
| GitHub Verifier | GitHub API first, LLM for relevance only | Deterministic preferred |

## Product Architecture

### Chat → Intent → Agents

```
POST /api/chat
  → sanitize + rate limit (checkRateLimit)
  → appendMessage (Redis session)
  → classifyIntent (regex → TaskType + params)
  → runTask (TaskRegistry → handler)
  → handler uses: db, arc-client, x402, payment-engine, llm
  → appendMessage (assistant reply)
  → return { text, data, totalSpent }
```

| Intent | Handler | Needs GitHub | Status |
|--------|---------|--------------|--------|
| RESEARCH_QUERY | research pipeline | No | ⚠️ external fetch broken |
| PUBLISH_CONTENT | seller pipeline | No | ⚠️ params not extracted |
| LIST_BOUNTIES | bounty lister | No | ✅ |
| CREATE_BOUNTY | bounty generator | Yes | ❌ stub |
| SOLVE_BOUNTY | research pipeline | No | ⚠️ same as research |
| SUBMIT_SOLUTION | github verifier | Yes | ❌ stub verifier |
| APPROVE_SUBMISSION | approval handler | No | ✅ (stub escrow) |
| WALLET_QUERY | wallet agent | No | ✅ (stub balance) |

### Payment Engine Flow (REAL, engine running)

```
OrderBook → NetEngine → BatchSettler
FlushTrigger: 500ms | 50 orders | $1 threshold → whichever first
→ ARC Gateway (one tx per flush, gasless) — STUBBED until real SDK
```

NetEngine cancels opposing flows between same counterparties before settling.
Every research citation = one PaymentOrder pushed to engine.

### Pricing Model

| Type | Range | Set by | Stored |
|------|-------|--------|--------|
| Source citation | $0.01–$0.08 | Gemini auto-price, seller overrides | sources.price |
| External sources (Arxiv/HN) | $0.02 fixed | Hardcoded | Not in DB |
| Bounty reward | $1–$500 | Gemini suggests, creator confirms | bounties.reward |
| Per-query spend cap | $1.00 | Hardcoded in research handler | — |
| Daily spend cap | $5.00 | Hardcoded in research handler | — |

### TrustScore lifecycle
- Seller content starts at 0.5 on publish
- +0.05 per citation received (update in onSettle callback — NOT YET WIRED)
- Capped at 1.0
- External sources: fixed (arxiv=0.9, hn=0.7)

## Package Dependency Rules (strict — no exceptions)

```
types           →  nothing internal
db              →  types only
arc-client      →  types only
x402            →  types only
payment-engine  →  types + arc-client only
agents          →  types + db + arc-client + x402 + payment-engine
apps/web        →  all packages
apps/workers    →  payment-engine + arc-client + db + types
```

No circular deps. No payment logic in apps/web. No agent code in arc-client.

## Key Conventions

- All user interaction through chat — no modals for errors/gates
- TypeScript strict mode (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- No comments unless WHY is non-obvious
- Micro-payments batched, never per-request
- Never import Circle SDK outside `packages/arc-client`
- Never write raw 402 handling outside `packages/x402`
- Never use LLM where deterministic works; never use large model where small is sufficient
- GitHub required → chat message only, never redirect, never block UI

## Task Tracking

- Current sprint + blockers → `tasks/todo.md`
- Lessons from mistakes → `tasks/lessons.md`
- Hackathon judging criteria → `hackathon/FEATURES.md`
- Competitor landscape → `hackathon/COMPETITORS.md`
