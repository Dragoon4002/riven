@../../CLAUDE.md
@AGENTS.md

## Web App Specifics

- Next.js 16 App Router (not pages dir)
- Read `node_modules/next/dist/docs/` before using any Next.js API — v16 has breaking changes
- Tailwind v4 (PostCSS plugin, no config file)
- `app/` dir at `apps/web/app/`
- Types in `apps/web/types/`

## File Structure Conventions

```
app/
  (onboarding)/     wallet + github connect flows
  (app)/            main chat UI
    chat/
  api/              route handlers
components/
  chat/
  wallet/
  bounty/
lib/
  agents/           ResearchAgent, BountyAgent, SellerAgent, WalletAgent
  payment/          OrderBook, NetEngine, BatchSettler, FlushTrigger
  intent/           intent router
  github/           GitHub OAuth + verifier
```
