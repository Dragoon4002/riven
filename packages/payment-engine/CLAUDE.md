@../../CLAUDE.md

## packages/payment-engine

Batch payment order book. The core innovation of Riven. **Real implementation — not stubbed.**

Imports: `@riven/types` + `@riven/arc-client` only. No db, no agents, no HTTP.

Key exports (`src/index.ts`):
- `PaymentEngine` — main orchestrator. Call `.start()` in workers, `.push(order)` from agents.
- `OrderBook` — in-memory queue, pop by direction (in/out)
- `NetEngine` — cancels opposing flows between same counterparty, returns net instructions
- `FlushTrigger` — fires flush on: 500ms elapsed | 50 orders | $1.00 accumulated
- `BatchSettler` — calls `GatewayClient.settle(instructions)`

## Usage Pattern

```ts
// In apps/workers/engine-worker.ts
const engine = new PaymentEngine()
engine.start()
engine.onSettle(receipt => { /* log to db */ })

// In any agent handler
agentCtx.engine.push({ direction: 'out', amount: 0.02, counterparty: sellerAddress, ref: sourceId, ... })
```

## Invariants

- Never flush while already flushing (`flushing` guard)
- Expire stale orders before flush (`book.expire()`)
- Skip flush if no orders after expiry
- One ARC Gateway tx per flush = gasless batch
