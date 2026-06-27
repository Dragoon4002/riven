# Lepton Nexus — Stack Reference
# What to use, what to build, what to never touch

---

## Hackathon-Provided Stack (Use These First)

### Installed Tools

```bash
# ARC CLI — Arc testnet access + agent context
uv tool install git+https://github.com/the-canteen-dev/ARC-cli

# Circle CLI — wallets + x402 + crosschain transfers
npm install -g @circle-fin/cli
# Requires Node.js v20.18.2+

# TestMint — up to $10k testnet USDC
# URL: testmint.myproceeds.xyz
# Use x402 to claim test funds

# 1Claw — secrets management
# URL: 1claw.dev
# Code: LEPTON26 → 6 months Pro free
# Use for ALL API keys (Arxiv, Semantic Scholar, Anthropic, GitHub OAuth)
```

---

### Reference Repos (Read Before Writing Payment Code)

```bash
# Primary reference — start here before ANY payment code
git clone https://github.com/circlefin/arc-nanopayments

# Canteen explainer companion
git clone https://github.com/the-canteen-dev/circle-agent

# Escrow reference — read before writing escrow
git clone https://github.com/circlefin/arc-escrow

# P2P payments — gasless direct transfers
git clone https://github.com/circlefin/arc-p2p-payments

# Commerce reference
git clone https://github.com/circlefin/arc-commerce
```

---

### Arc Developer Docs
```
Chain config, App Kit, sample apps:  docs.arc.network
Nanopayments (Gateway):              developers.circle.com/gateway/nanopayments
Agent Stack:                         developers.circle.com/agent-stack/circle-cli
Arc 101 demo:                        arc-node.thecanteenapp.com
```

---

### App Kit SDKs (Multi-Chain Payment Flows)

| Kit | What It Does | Install |
|---|---|---|
| Send | Transfer tokens same chain | `@circle-fin/app-kit` |
| Bridge | Transfer USDC cross-chain | same package |
| Swap | Exchange tokens same chain | same package |
| Unified Balance | Chain-abstracted balance | same package |
| Combine | Compose multiple flows | same package |

---

## Your Project Stack

### Monorepo Structure
```
lepton-nexus/
├── apps/
│   ├── web/          Next.js 14 (App Router)
│   └── workers/      Node.js long-running processes
├── packages/
│   ├── types/        TypeScript interfaces (no imports)
│   ├── db/           Prisma + PostgreSQL
│   ├── arc-client/   Circle SDK wrapper
│   ├── x402/         x402 protocol wrapper
│   ├── payment-engine/ Order book + batch settler
│   └── agents/       All AI agents
└── turbo.json
```

---

### Key Dependencies Per Package

**packages/arc-client**
```json
{
  "@circle-fin/circle-sdk": "latest",
  "@circle-fin/cli": "latest"
}
```
Never import Circle SDK anywhere except this package.

**packages/x402**
```json
{
  "x402": "latest"
}
```
Based on circlefin/arc-nanopayments x402 implementation.
Never write raw 402 handling outside this package.

**packages/payment-engine**
```json
{
  "@lepton/types": "workspace:*",
  "@lepton/arc-client": "workspace:*"
}
```
No database, no agents, no HTTP in this package.

**packages/agents**
```json
{
  "@anthropic-ai/sdk": "latest",
  "langchain": "latest",
  "@langchain/community": "latest",
  "@lepton/types": "workspace:*",
  "@lepton/db": "workspace:*",
  "@lepton/arc-client": "workspace:*",
  "@lepton/x402": "workspace:*",
  "@lepton/payment-engine": "workspace:*"
}
```

**apps/web**
```json
{
  "next": "14",
  "tailwindcss": "latest",
  "shadcn-ui": "latest",
  "@tanstack/react-query": "latest",
  "redis": "latest",
  "@lepton/types": "workspace:*",
  "@lepton/db": "workspace:*",
  "@lepton/agents": "workspace:*",
  "@lepton/payment-engine": "workspace:*"
}
```

---

### External APIs Used By Agents

| API | Purpose | Free Tier | Secret Location |
|---|---|---|---|
| Arxiv API | Research paper discovery | Free, no key | n/a |
| Semantic Scholar API | Academic source ranking | Free, key optional | 1Claw |
| GitHub API | Repo search + PR verification | 60 req/hr unauth, 5k auth | 1Claw |
| HackerNews Algolia | Tech blog discovery | Free, no key | n/a |
| Anthropic API | Synthesis + intent routing | Paid | 1Claw |
| OpenAI API | Fallback LLM | Paid | 1Claw |

---

### Database Schema Summary

```sql
users          (id, email, wallet_id, github_id, created_at)
wallets        (id, arc_wallet_id, address, user_id, balance, updated_at)
sources        (id, url, title, author_id, price, trust_score, x402_endpoint, stake_amount, created_at)
reports        (id, user_id, query, content, total_spent, created_at)
citations      (id, report_id, source_id, amount, tx_hash)
bounties       (id, creator_id, github_issue_id, repo_url, title, description, reward, status, escrow_id, created_at)
submissions    (id, bounty_id, hunter_id, pr_url, status, submitted_at)
escrows        (id, bounty_id, amount, status, arc_escrow_id, locked_at, released_at, released_to)
stakes         (id, user_id, type, amount, ref_id, status, created_at)
reputation     (id, user_id, role, score, total_txns, success_rate, total_volume, updated_at)
payment_orders (id, direction, amount, counterparty, ref, x402_request_id, status, batch_id, tx_hash, queued_at, expires_at)
batch_receipts (id, tx_hash, orders_settled, total_amount, gas_cost, settled_at, duration_ms)
```

---

### Infrastructure

```
Development:
  PostgreSQL:  Docker (docker-compose.yml)
  Redis:       Docker (docker-compose.yml)
  Workers:     Local Node.js process

Production:
  Web:         Vercel
  Workers:     Railway or Fly.io
  DB:          Railway PostgreSQL or Supabase
  Redis:       Upstash
  Secrets:     1Claw (LEPTON26)
  Testnet:     TestMint (testmint.myproceeds.xyz)
```

---

### LLM Usage Guidelines

```
Intent Router:     Claude claude-haiku-3 (fast, cheap, classification task)
Research Synthesis: Claude claude-sonnet-4-6 (quality matters, cited output)
Auto-Pricing:      Claude claude-haiku-3 (simple scoring task)
Bounty Generator:  Claude claude-sonnet-4-6 (structured output, nuanced)
GitHub Verifier:   Deterministic logic first, LLM only for relevance check
```

Never use LLM where deterministic logic works.
Never use a large model where a small model is sufficient.

---

### Environment Variables

```bash
# Arc + Circle
CIRCLE_API_KEY=          # from 1Claw
ARC_RPC_URL=             # from ARC CLI
ARC_TESTNET_CHAIN_ID=    # from Arc docs

# Database
DATABASE_URL=            # PostgreSQL connection string
REDIS_URL=               # Redis connection string

# GitHub
GITHUB_CLIENT_ID=        # OAuth app
GITHUB_CLIENT_SECRET=    # from 1Claw
GITHUB_WEBHOOK_SECRET=   # from 1Claw

# LLM
ANTHROPIC_API_KEY=       # from 1Claw
OPENAI_API_KEY=          # from 1Claw, fallback only

# App
NEXTAUTH_SECRET=         # random string
NEXTAUTH_URL=            # deployment URL
```

All secrets stored in 1Claw. Never in .env committed to git.

---

*Lepton Nexus · Lepton Agents Hackathon · deadline Jul 6 2026*
