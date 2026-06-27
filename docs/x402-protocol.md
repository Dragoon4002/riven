# x402 Protocol Reference

Read this before writing any seller gating, content unlocking, or buyer payment probing code.

## What x402 Is

HTTP 402 Payment Required — a protocol for content behind a paywall.
Server returns `402` with payment instructions. Client pays, retries with proof. Server unlocks.

Primary reference: `github.com/circlefin/arc-nanopayments` (x402 implementation for ARC).

## How It Works

```
Buyer agent → GET /source/123
Server      ← 402 { payment_required: { amount, address, token } }
Buyer agent → push PaymentOrder to engine, wait for receipt
Buyer agent → GET /source/123  (with payment proof header)
Server      ← 200 { content }
```

## Riven Integration Points

All x402 handling goes through `packages/x402`. Never write raw 402 logic elsewhere.

```
x402/src/
  server.ts  → X402Server  (create gated endpoint, verify payment proof)
  client.ts  → X402Client  (probe for 402, submit payment, retry)
```

Current status: stubbed. Replace with `circlefin/arc-nanopayments` x402 implementation.

### Server Side (SellerAgent — publisher.ts)

When a seller publishes content:
1. `X402Server.createGate({ price, address, contentId })` → returns `x402Endpoint` URL
2. Store `x402Endpoint` in `sources` table
3. When buyer hits endpoint with valid proof → return content

### Client Side (ResearchAgent — budget.ts)

When buying a source:
1. `X402Client.probe(url)` → returns `{ amount, address }` or null if free
2. If price passes budget threshold → push PaymentOrder to engine
3. On settle receipt → `X402Client.unlock(url, proof)` → returns content
4. Content used in synthesis, citation recorded

## Testnet USDC

All payments use testnet USDC from TestMint (`testmint.myproceeds.xyz`).
x402 client should send testnet-chain payment proofs during development.

## Guardrails

- Never write raw 402 header parsing outside `packages/x402`
- Never call x402 endpoints from `apps/web` directly — go through agents
- Payment proof must come from a settled BatchReceipt, not a pending order
