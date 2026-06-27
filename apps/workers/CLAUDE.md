@../../CLAUDE.md

## apps/workers

Long-running background processes. Not a web server — never handle HTTP requests here.

Imports: `@riven/payment-engine` + `@riven/arc-client` + `@riven/db` + `@riven/types`.

## Workers

### engine-worker.ts
Runs the PaymentEngine flush cycle continuously.
- Creates `PaymentEngine`, calls `.start()`
- On settle: writes `BatchReceipt` to db, logs volume
- Runs forever; restart on crash

### github-worker.ts
Processes GitHub webhook events (PR merges → escrow release).
- Listens for events queued by `POST /api/github/webhook`
- On PR merged: find matching bounty, call `EscrowClient.release()`
- Updates submission status + bounty status in db

## Commands (from apps/workers/)

```bash
bun engine    # Start engine-worker.ts
bun github    # Start github-worker.ts
```

Both processes must be running for full functionality.
In production: deploy on Railway or Fly.io as separate services.
