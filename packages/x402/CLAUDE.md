@../../CLAUDE.md

## packages/x402

x402 protocol wrapper. The ONLY place in the repo that handles HTTP 402 Payment Required.

Imports: `@riven/types` only.

Current status: **ALL STUBS** — returns dummy data. Replace with arc-nanopayments x402 implementation.

Key exports (`src/index.ts`):
- `X402Server` — create gated endpoint, verify payment proof, serve content on valid proof
- `X402Client` — probe URL for 402, build payment request, unlock content with receipt proof

## How It Fits

SellerAgent (`packages/agents/seller/publisher.ts`) uses `X402Server` to gate content.
ResearchAgent (`packages/agents/research/budget.ts`) uses `X402Client` to probe + unlock sources.

## Replacing Stubs

Read `docs/x402-protocol.md` first.
Reference: `github.com/circlefin/arc-nanopayments` — has full x402 client + server implementation.

Keep the same interface — callers in `packages/agents` must not change.
Never write raw 402 header parsing outside this package.
