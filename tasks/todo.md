# Riven — Task Tracker
# Hackathon deadline: Jul 6 2026 · Today: Jun 27 2026 · 9 days left

---

## DONE

### Infrastructure
- ✅ Monorepo, types, DB schema (Neon), arc-client stubs, x402 stubs
- ✅ Payment engine (OrderBook → NetEngine → FlushTrigger → BatchSettler)
- ✅ Engine worker + GitHub worker
- ✅ Redis (docker-compose)

### Web + Auth
- ✅ Onboarding — wallet create → DB → cookie
- ✅ /api/github/oauth — full OAuth (needs creds in env)
- ✅ /api/github/webhook — PR merged → escrow auto-release
- ✅ /api/sources/[id] — Redis content delivery route
- ✅ Chat UI + chat API route + rate limiting + sanitization

### LLM Layer
- ✅ packages/agents/src/llm.ts — 4-key Gemini rotation, Redis rate limit, input sanitize

### Research Pipeline (F02) — COMPLETE
- ✅ discovery.ts — Arxiv + HN Algolia + internal DB sources
- ✅ ranking.ts — deterministic scoring (trust × relevance × freshness / price)
- ✅ budget.ts — autonomous buy/no-buy ($1 per-query cap)
- ✅ synthesis.ts — Gemini, numbered citations, Sources section
- ✅ research_query handler — external sources fetch directly, seller sources via x402

### Seller Pipeline (F04) — COMPLETE
- ✅ ingestion.ts — URL fetch + HTML strip + Gemini topic extraction
- ✅ pricing.ts — Gemini auto-pricing via llmObject ($0.01–$0.08)
- ✅ publisher.ts — DB insert + Redis content store (30d TTL)
- ✅ publish_content handler — one-shot ingest → price → publish

### Bounty System (F05) — COMPLETE
- ✅ bounty_lister — real DB query
- ✅ bounty_generator — Gemini llmObject (title, criteria, reward, complexity)
- ✅ create_bounty handler — GitHub issue fetch → generator → escrow lock → DB
- ✅ approve_submission handler — escrow release (stub arc-client)
- ✅ submit_solution handler — delegates to verifier
- ✅ github_verifier — real GitHub API PR lookup (no LLM)

### Intent Router
- ✅ All 10 task types classified
- ✅ Param extraction: url (PUBLISH), issueUrl (CREATE_BOUNTY), prUrl (SUBMIT), bountyId (APPROVE)

---

## REMAINING

### 1. GitHub credentials (blocker for GitHub features)
- ❌ Add GITHUB_CLIENT_ID to .env + .env.local
- ❌ Add GITHUB_CLIENT_SECRET to .env + .env.local
- ❌ Add GITHUB_WEBHOOK_SECRET to .env + .env.local (for webhook signature validation)
- ❌ Create GitHub OAuth app at github.com/settings/developers
  - Callback URL: http://localhost:3000/api/github/oauth (dev) + Vercel URL (prod)

### 2. Webhook signature validation (security)
- ❌ /api/github/webhook — add HMAC-SHA256 signature check
  (currently accepts any POST — must validate x-hub-signature-256 header)

### 3. Vercel deployment
- ❌ Push repo to public GitHub
- ❌ Connect to Vercel, set all env vars in Vercel dashboard
- ❌ Set NEXT_PUBLIC_APP_URL to Vercel URL
- ❌ Update GitHub OAuth app callback URL to Vercel URL

### 4. Real SDKs (after demo works end-to-end with stubs)
- ❌ arc-client/wallet.ts → Circle CLI
- ❌ arc-client/gateway.ts → Arc Gateway REST API
- ❌ arc-client/escrow.ts → circlefin/arc-escrow
- ❌ x402/client.ts → circlefin/arc-nanopayments
- ❌ x402/server.ts → circlefin/arc-nanopayments
- ❌ TestMint testnet USDC (testmint.myproceeds.xyz)

### 5. UI polish
- ❌ Chat: render bounty cards (structured LIST_BOUNTIES data)
- ❌ Chat: render citations as clickable links
- ❌ Settings page: GitHub connect button wired
- ❌ TrustScore update on citation settle (onSettle callback)

### 6. Traction (starts after deploy)
- ❌ 5+ real users onboarded
- ❌ 20+ research queries run
- ❌ 3+ sellers with published content
- ❌ 2+ bounties created + escrow locked
- ❌ Submit first draft: forms.gle/SMqLaw2pMGDe58LFA
- ❌ Record 3-min demo (script in hackathon/AGENT_PROMPT.md Section 7)

---

## Attack Order
1. GitHub OAuth app + credentials in env → enables GitHub features locally
2. Webhook signature validation → security fix before deploy
3. Vercel deploy → live URL
4. Test full flows end-to-end (research, publish, bounty)
5. Real Circle/Arc SDKs → real USDC on testnet
6. UI polish (bounty cards, citation links)
7. Traction push + submit
