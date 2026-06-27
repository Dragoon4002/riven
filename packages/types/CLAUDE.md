@../../CLAUDE.md

## packages/types

Foundation layer. All shared TypeScript interfaces for the monorepo.

**Rule:** imports nothing from other `@riven/*` packages. Zero internal dependencies.

Key exports (`src/index.ts`):
- `TaskType` — intent enum (RESEARCH_QUERY, LIST_BOUNTIES, etc.)
- `AgentContext` — passed to every handler (userId, sessionId, wallet, github, engine, conversation)
- `PaymentOrder` / `BatchReceipt` / `FlushConfig` — payment engine types
- `WalletInfo` / `GitHubInfo` — user capability types
- `ConversationContext` — Redis session shape

Add new types here first before implementing in other packages.
Never add runtime logic to this package — types and interfaces only.
