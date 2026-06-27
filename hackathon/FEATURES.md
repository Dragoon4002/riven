# Lepton Nexus — Feature Spec
# Every feature mapped to judging criteria

## Judging Weights Reminder
- Agentic Sophistication: 30%
- Traction: 30%
- Circle Tool Usage: 20%
- Innovation: 20%

---

## Core Features — Must Ship

### F01 — Batch Payment Order Book
**What:** Incoming and outgoing payment queues. Net opposing flows. Batch flush via Arc Gateway.
**Judging impact:** Circle (20%) + Innovation (20%)
**Why critical:** This is the foundational primitive. Every payment in the system goes through this.
**Circle tools:** Gateway Nanopayments, USDC
**Cut if:** Never. This is the core.

---

### F02 — Research Agent Pipeline (Fully Autonomous)
**What:** Query → Discovery → Ranking → Budget Decision → x402 Pay → Unlock → Synthesis → Report
**Judging impact:** Agentic (30%) + Circle (20%)
**Why critical:** Agent pays autonomously. No human approval. This is the primary agentic story.
**Circle tools:** x402, Wallets, Gateway (via order book)
**Cut if:** Never. This is the primary product.

---

### F03 — Intent Router
**What:** Every chat message classified into TaskType. Context-aware ("this" resolves to prior bounty).
**Judging impact:** Agentic (30%)
**Why critical:** Without this, the chat interface doesn't work.
**Circle tools:** None directly
**Cut if:** Never.

---

### F04 — Seller Upload + Auto-Pricing
**What:** Upload file via chat. Agent prices it. x402 endpoint generated. Discoverable by research agents.
**Judging impact:** Traction (30%) + Circle (20%) + Innovation (20%)
**Why critical:** Creates real sellers with real content. Enables citation payments to flow to real people.
**Circle tools:** x402 server, Wallets
**Cut if:** Never. This is the creator economy differentiation.

---

### F05 — GitHub Bounty Creation
**What:** Connect GitHub → issue detected → bounty spec generated → escrow locked → listed.
**Judging impact:** Traction (30%) + Circle (20%) + Innovation (20%)
**Why critical:** Creates the second traction metric (bounties) and showcases escrow.
**Circle tools:** Escrow, Wallets
**Cut if:** Ship the core research flow first. Bounties are week 2.

---

### F06 — GitHub Verifier + Auto Escrow Release
**What:** Hunter says solved → agent checks PR → PR merged webhook → escrow auto-releases.
**Judging impact:** Agentic (30%) + Innovation (20%)
**Why critical:** Full autonomous work verification without AI jury. GitHub merge = ground truth.
**Circle tools:** Escrow
**Cut if:** Manual approval is the fallback. Auto-release is the upgrade.

---

### F07 — Wallet Provisioning on Signup
**What:** Every user gets an Arc wallet on account creation. Prerequisite for all other flows.
**Judging impact:** Circle (20%) + Traction (30%)
**Why critical:** Blocks everything else. Must be first.
**Circle tools:** Wallets API
**Cut if:** Never.

---

### F08 — Staked Reputation
**What:** Sellers stake USDC to publish. Hunters stake to claim. Stakes slash on failure.
**Judging impact:** Innovation (20%) + Agentic (30%)
**Why critical:** Reputation = real money at risk. Beats score-only systems. Differentiates from Repute.
**Circle tools:** Wallets, USDC transfers
**Cut if:** If time is critical, ship with score-only reputation and add staking in week 3.

---

## Secondary Features — Ship If Time Allows

### F09 — Conversation Context Memory
**What:** Redis stores full conversation history. Agent knows what bounty was discussed 3 messages ago.
**Judging impact:** Agentic (30%)
**Cut if:** Never — without this, the chat is stateless and broken.

---

### F10 — Citation Trail in Reports
**What:** Every claim in the report links to the paid source. Shows cost paid per citation.
**Judging impact:** Innovation (20%) + Traction (30%)
**Cut if:** Never. This is proof that payments flowed to real content.

---

### F11 — Wallet Dashboard in Chat
**What:** "What's my balance" → shows USDC balance, earned today, spent today, transaction history.
**Judging impact:** Traction (30%) + Circle (20%)
**Cut if:** Low priority. Nice to have.

---

### F12 — Bounty Matching Agent
**What:** Hunter asks for bounties → agent matches to their skills and past work.
**Judging impact:** Agentic (30%)
**Cut if:** Ship simple list first. Matching is the upgrade.

---

### F13 — Research-to-Bounty Flow
**What:** Report surfaces unsolved problem → one message → "Create Bounty" → pre-filled spec.
**Judging impact:** Innovation (20%) + Traction (30%)
**Cut if:** This is the demo money shot. Do not cut it.

---

## Deferred Features — Post-Hackathon Only

### NOT in scope for Jul 6 submission

| Feature | Why Deferred |
|---|---|
| Streaming payments | Complex, low traction impact in 3 weeks |
| Dispute resolution | Requires arbitration system |
| AI Solver agent | Autonomous code writing is a separate product |
| EURC support | USDC is sufficient for hackathon |
| Mobile app | Not needed |
| Email notifications | Not needed |
| Multi-language support | Not needed |
| DAO governance | Wrong product category |

---

## Feature Priority Matrix

```
          HIGH JUDGING IMPACT
                ↑
F01 Batch Engine          F02 Research Agent
F07 Wallet Signup         F04 Seller Upload
F03 Intent Router         F13 Research→Bounty
                │
LOW TRACTION ───┼─── HIGH TRACTION
                │
F08 Staking      │        F05 Bounty Creation
F06 Auto-Escrow  │        F10 Citation Trail
                │
                ↓
          LOW JUDGING IMPACT
```

Build in this order: top-right → top-left → bottom-right → bottom-left

---

*Lepton Nexus · Lepton Agents Hackathon · deadline Jul 6 2026*
