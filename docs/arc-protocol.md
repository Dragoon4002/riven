# ARC Protocol Reference

Read this before writing any wallet, payment, escrow, or transfer code.

## What ARC Is

Circle's L1 chain. Provides gasless USDC payments via Gateway Nanopayments.
All payments in Riven settle on-chain via ARC.

## Installed Tools

```bash
# ARC CLI — testnet access + pre-bundled agent context
uv tool install git+https://github.com/the-canteen-dev/ARC-cli

# Circle CLI — wallets + x402 + crosschain transfers
npm install -g @circle-fin/cli
# Requires Node.js v20.18.2+
```

## Reference Repos (read before writing payment code)

```bash
# PRIMARY — start here before any payment code
git clone https://github.com/circlefin/arc-nanopayments
# Has: LangChain paying agent + x402 seller + Gateway batching

git clone https://github.com/the-canteen-dev/circle-agent
# Has: Canteen explainer + Arc overview

git clone https://github.com/circlefin/arc-escrow
# Has: AI-powered work validation + USDC settlement

git clone https://github.com/circlefin/arc-p2p-payments
# Has: Gasless peer-to-peer payments
```

## Documentation

- Chain config + App Kit + sample apps: `docs.arc.network`
- Gateway Nanopayments: `developers.circle.com/gateway/nanopayments`
- Agent Stack + Circle CLI: `developers.circle.com/agent-stack/circle-cli`
- Arc 101 demo: `arc-node.thecanteenapp.com`

## App Kit SDKs (`@circle-fin/app-kit`)

| Kit | Purpose |
|-----|---------|
| Send | Transfer tokens same chain |
| Bridge | Transfer USDC cross-chain |
| Swap | Exchange tokens same chain |
| Unified Balance | Chain-abstracted balance view |
| Combine | Compose multiple flows |

Never write custom bridge/swap logic — App Kit handles it.

## Testnet USDC

TestMint: `testmint.myproceeds.xyz` — up to $10k testnet USDC via x402.
All dev/testing uses testnet USDC. Never use mainnet funds.

## Riven Integration Points

All ARC access goes through `packages/arc-client`. Never call Circle SDK from anywhere else.

```
arc-client/src/
  wallet.ts    → WalletClient  (create, balance, history)
  escrow.ts    → EscrowClient  (lock, release, query)
  gateway.ts   → GatewayClient (batch settle via Nanopayments)
  transfer.ts  → TransferClient (P2P payments)
```

Current status: stubbed. Replace with real Circle SDK / ARC CLI when available.

## Guardrails

- Never write raw wallet key management code — Circle CLI handles this
- Never write raw USDC transfer logic — go through arc-client
- Never configure raw ARC RPC manually — use ARC CLI for testnet access
- Never hardcode API keys — use environment variables
