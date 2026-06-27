@../../CLAUDE.md

## packages/agents

Intent router + all agent handlers. Highest-level package — imports everything.

Imports: `@riven/types` + `@riven/db` + `@riven/arc-client` + `@riven/x402` + `@riven/payment-engine`.

Key exports (`src/index.ts`):
- `classifyIntent(message, context)` → `IntentResult` — regex-based, returns TaskType + params + confidence
- `runTask(input, agentCtx)` → `TaskResult` — dispatches to correct handler
- `appendMessage` / `loadContext` — Redis session management

## Structure

```
src/
  intent-router.ts    regex → TaskType classification
  registry.ts         TaskType → { agents, requiresGithub, requiresWallet, paymentIntensity }
  task-runner.ts      runTask dispatcher
  session.ts          Redis session (appendMessage, loadContext)
  handlers/           one file per TaskType
  research/           discovery, ranking, budget, synthesis (Phase 2 — mostly stubbed)
  bounty/             lister, generator, matcher, verifier (Phase 4 — mostly stubbed)
  seller/             ingestion, pricing, publisher (Phase 3 — mostly stubbed)
  wallet/             wallet-agent.ts (Phase 2)
```

## Adding a Handler

1. Add TaskType to `@riven/types` if new
2. Add entry to `registry.ts` (agents needed, github/wallet requirements)
3. Create `handlers/my_task.ts` with `export async function handle(input, ctx): Promise<TaskResult>`
4. Import + register in `task-runner.ts`

## LLM Usage

Use `@anthropic-ai/sdk`. Model choices in root `CLAUDE.md`.
Never use LLM where deterministic logic works (e.g. don't LLM a balance query).
