# Lessons

Patterns learned from mistakes. Updated after every correction.

## Monorepo

- Git root is `riven/`, not `apps/`. Never `cd apps/web` to run root-level scripts.
- `bun run typecheck` checks packages only; run `bun run build` inside `apps/web` to verify web types.
- Workspace deps use `workspace:*` protocol in package.json — bun resolves them from the monorepo root.

## Dependency Rules

- Only `packages/arc-client` may import Circle SDK. Any other package importing it directly is a bug.
- Only `packages/x402` may do raw HTTP 402 handling. Agents use the x402 wrapper, not fetch directly.
- `packages/payment-engine` has no db dependency — settlement receipts are written by the worker, not the engine.

## Stubs

- `packages/arc-client` and `packages/x402` are fully stubbed. Calling their methods returns dummy data.
  Do not write agent logic that depends on real ARC responses until stubs are replaced.
- Keep stub interfaces identical to what the real SDK will expose — changing them later will break callers.
