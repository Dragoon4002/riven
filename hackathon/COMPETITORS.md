# Lepton Nexus — Competitor Map
# Know exactly what lane you own and what to avoid

---

## The Field (Lepton + Agora Combined)

### Tier 1 — Direct Threats (overlap your RFBs)

---

**Polaris** · polarisswarm.vercel.app
- RFB: 02 + 03
- What: Onchain agent labor market. Agents stake USDC, bid on tasks, compete, get scored by LLM, paid or slashed automatically. Entire state reconstructed from Arc event logs. No traditional backend.
- Strength: Fully autonomous, live, deep onchain, staking = real reputation
- Weakness: Agents are the users — no human-facing traction path. Ignores RFB 06 entirely.
- Your angle: You pay human creators per citation. Polaris pays agents per task. Different economy.
- Watch: Their LLM-scored auto-verification. If yours is weaker, judges will notice.

---

**AgentMesh** (applying, not yet live)
- RFB: 02 + 03
- What: SDK for agents to find and pay for services in 3 lines of code. x402 + ERC-8004 experience from prior project.
- Strength: Developer DX focus, prior protocol experience, clean SDK story
- Weakness: No product, needs developers to integrate before any traction
- Your angle: You have a complete product users can use today. They have a library.
- Watch: If they ship fast with a polished SDK, they score high on Circle tool usage.

---

**Logos** · logos-arc.vercel.app
- RFB: 02 + 03
- What: Marketplace where agents buy and sell cognition (reasoning, analysis) per query. Python package published.
- Strength: Live, published PyPI package, agent-to-agent focus, clear specialization story
- Weakness: Abstract product — "buying cognition" is hard to explain to non-technical users. No human traction path.
- Your angle: You pay authors for specific, real documents. They trade abstract reasoning outputs.
- Watch: Their PyPI package is smart distribution. Consider if an npm package makes sense for you.

---

**AXIOM** · axiom-xi-mauve.vercel.app
- RFB: Escrow + settlement
- What: Post job → lock USDC → agent works → AI jury verifies → payment releases. No trust, no middlemen.
- Strength: Live, real USDC onchain, AI jury verification, 4 registered agents
- Weakness: General-purpose escrow with no specific domain (not knowledge, not code)
- Your angle: Your escrow is tied to GitHub PRs — verifiable by anyone, not just an AI jury.
- Watch: Their "AI jury" verification is clever. Your GitHub verifier needs to be equally trustless.

---

**Repute** · tryrepute.vercel.app
- RFB: 03 (trust infrastructure)
- What: Indexes x402 payments on Arc, tracks if merchants deliver, builds live reliability scores. API + SDKs.
- Strength: Live, running benchmark with malicious merchants, real trust data
- Weakness: Infrastructure only — no end product built on top of it
- Your angle: Your reputation is staked USDC (slashable), not just a score. Money > numbers.
- Consider: Could you use Repute's API to seed your seller trust scores? Would save build time.

---

### Tier 2 — Different Lane (no direct overlap)

| Project | What They Do | Your Relationship |
|---|---|---|
| Archimedes | Research-grounded trading agent | You pay authors for the research they scrape for free |
| Aegis | AI portfolio manager, Circle stack showcase | Different category entirely (trading vs knowledge) |
| Sumplus Vault | Autonomous portfolio rebalancer, smart contract | Different category, strong Circle tool usage |
| Nano WizPay | Paid orchestration API for swap + payroll | Different use case, but x402 pattern is similar |
| GiwaRemit | Natural language USDC remittance | Different category entirely |
| CopyGuard Bond | Risk protection for copy-trading | Different category entirely |
| Pharos | Prediction markets with fair value | Different category entirely |
| FLOAT | Idle USDC → USYC yield | Different category entirely |
| Arc Agents Dashboard | ERC-8004 agent aggregator | Could be your reputation data source |

---

## The White Space You Own

```
RFB 06 — Creator & Publisher Monetization
```

Look at the competitor list above. Not one of them touches creator payments, pay-per-citation, or content monetization. Every single competitor went agent-to-agent or trading.

The hackathon doc says explicitly:
> "This round leans toward RFB 6: Creator & Publisher Monetization, the people the payment floor priced out."

You have this lane entirely to yourself. Never give it up.

---

## The One Claim No Competitor Can Make

**"Every research query creates real income for real authors."**

- Polaris: agents pay agents
- AgentMesh: agents pay APIs
- Logos: agents pay agents for cognition
- You: agents pay human authors for their actual work

This is the pitch. This is what judges remember in the video. Say it in the first 20 seconds.

---

## What You Must Do That Competitors Haven't

**1. Staked Reputation (beats Repute's score-based system)**
```
Seller stakes $2 to publish → slashes if citation rate drops below threshold
Hunter stakes 10% of reward to claim → slashes if they abandon
```
Polaris does staking but only for agents entering the network.
You do staking at the content + task level. More granular, more honest.

**2. The Batch Order Book (beats everyone on Circle tool usage)**
No competitor has described a net engine that cancels opposing flows before settling.
This is your most defensible technical contribution.
Make sure it's visible in the demo. Show the netting happening.

**3. GitHub as Ground Truth (beats AXIOM's AI jury)**
AXIOM uses an AI to verify work. That AI can be wrong.
You use GitHub merge status — a fact, not an opinion.
PR merged = work delivered. Escrow releases automatically. No AI jury needed.

---

## Red Lines — Never Copy These

| From Competitor | Why Not To Copy |
|---|---|
| Polaris's staking-to-register model | You don't need agents to stake to join. Sellers + hunters stake per action. |
| Logos's agent-sells-cognition model | Too abstract. Your sellers are humans with real documents. |
| AXIOM's AI jury for verification | GitHub merge is stronger. Don't add an AI jury layer. |
| Archimedes's trading strategy focus | Wrong product category for your RFBs. |
| Any trading or portfolio management feature | Not your lane. Judges will see it as scope creep. |

---

## Scoring Estimate vs Top Competitors

| | Agentic (30%) | Traction (30%) | Circle (20%) | Innovation (20%) | Est. Total |
|---|---|---|---|---|---|
| **Lepton Nexus** | 22/30 | 25/30 | 18/20 | 18/20 | **83/100** |
| Polaris | 28/30 | 20/30 | 16/20 | 17/20 | 81/100 |
| AgentMesh | 20/30 | 10/30 | 17/20 | 15/20 | 62/100 |
| Logos | 24/30 | 18/30 | 15/20 | 16/20 | 73/100 |
| AXIOM | 20/30 | 22/30 | 16/20 | 14/20 | 72/100 |

Estimates only. Traction column is the most variable — it's won in the field, not in code.

Your win condition: **outpace Polaris on traction** because their users are agents (hard to count as "genuine users") while yours are humans (clearly countable).

---

*Lepton Nexus · Lepton Agents Hackathon · deadline Jul 6 2026*
