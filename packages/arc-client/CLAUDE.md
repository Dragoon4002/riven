@../../CLAUDE.md

## packages/arc-client

ARC/Circle SDK wrapper. The ONLY place in the repo that touches Circle SDK or raw ARC APIs.

Imports: `@riven/types` only. No db, no agents, no HTTP outside this package.

Current status: **ALL STUBS** — returns dummy data. Replace with real Circle SDK when integrating.

Key exports (`src/index.ts`):
- `WalletClient` — create wallet, get balance, get history
- `EscrowClient` — lock escrow, release escrow, query status
- `GatewayClient` — batch settle payment instructions via ARC Gateway Nanopayments
- `TransferClient` — P2P gasless transfers

## Replacing Stubs

Read `docs/arc-protocol.md` first.
Primary reference: `github.com/circlefin/arc-nanopayments`
Escrow reference: `github.com/circlefin/arc-escrow`

Replace one client at a time. Keep the same interface — callers in `packages/agents` and `packages/payment-engine` must not change.

Never import Circle SDK from anywhere other than this package.
