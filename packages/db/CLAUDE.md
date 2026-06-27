@../../CLAUDE.md

## packages/db

Database layer. Drizzle ORM + Neon serverless Postgres.

Imports: `@riven/types` only.

Key exports (`src/index.ts`):
- `db` — Drizzle client (Neon serverless)
- `schema` — all table definitions
- `UserQueries`, `WalletQueries`, `SourceQueries`, `ReportQueries`, `BountyQueries`, `SubmissionQueries`, `EscrowQueries`, `PaymentQueries` — typed query functions

Schema: `src/schema.ts` — users, wallets, sources, reports, citations, bounties, submissions, escrows, paymentOrders.
Queries: `src/queries/*.ts` — one file per table, typed inputs/outputs.

## Commands

```bash
NEON_DATABASE_URL="..." bunx drizzle-kit push    # Push schema changes
NEON_DATABASE_URL="..." bunx drizzle-kit generate # Generate migration files
```

Never put business logic here — queries only, no agent or payment logic.
