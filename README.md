# AUTOPSY
## Forensic Intelligence — 4 Modes, 24 Agents, 1 Verdict

![Autopsy](https://autopsy-nine.vercel.app/opengraph-image)

### What it is

Autopsy investigates why companies fail — and what could have saved them. Six specialized AI agents per mode research in parallel, debate each other's findings, and produce a forensic verdict in ~22 seconds.

Four modes:
- **Postmortem** — investigate why a company failed
- **Pre-Mortem** — predict what could kill a living company
- **Founder Mode** — analyze your own startup before it fails
- **Counterfactual** — explore alternate histories: "What if they made a different decision?"

### Counterfactual Mode

The 4th mode asks: **What if [company] had made a different decision?**

Six counterfactual agents reason about what *didn't* happen:
- **CF Market Analyst** — skeptical about internal decisions changing external market realities
- **CF Operator** — assesses whether the alternate decision could actually be executed
- **CF Money Trail** — models the financial impact of the alternate path
- **CF Customer Voice** — evaluates whether users would have responded differently
- **CF Engineer** — honest about technical complexity vs. leadership beliefs
- **CF Historian** — finds real precedents (requires 2+ historical cases as evidence)

Each agent must: understand the actual causal chain, identify the decision point, model the alternate chain, find real precedents, and assess second-order consequences (butterfly effects).

The synthesizer renders one of five verdicts: *would have survived*, *would have delayed failure*, *would have failed differently*, *would have made no difference*, or *could have transformed the company*.

Preset scenarios: Blockbuster/Netflix, Kodak/Digital, Yahoo/Google, Quibi/TV, Theranos/Real Science, MySpace/Better Tech.

### Why AMD MI300X

192GB HBM3 lets us load all 6 agents (each ~70B parameters) simultaneously. On a single H100 (80GB), this requires 3 sequential rounds. On MI300X, it runs in one parallel pass — enabling real-time agent debate that wasn't possible before.

| | H100 | MI300X |
|---|---|---|
| Memory | 80 GB HBM3 | 192 GB HBM3 |
| Agents | 3 sequential rounds | 1 parallel pass |
| Debate | Impossible | Real-time |
| Time | ~75s | ~22s |

### Architecture

[See the full architecture breakdown →](https://autopsy-nine.vercel.app/architecture)

### Tech Stack
- Next.js 15 + TypeScript + Tailwind v4
- DeepSeek V4 Pro (development) / Llama 3.3 70B on AMD MI300X (production)
- Tavily Search API for evidence gathering
- Server-Sent Events for streaming agent updates
- Vercel edge deployment

### Local Development

```bash
# Clone
git clone https://github.com/anilandcode/autopsy.git
cd autopsy

# Install
npm install

# Environment
cp .env.example .env.local
# Add your API keys:
# FIREWORKS_API_KEY=     (for DeepSeek V4 Pro via Fireworks AI)
# TAVILY_API_KEY=        (for web search)

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### License

MIT

### Built for

AMD Developer Hackathon 2026 by lablab.ai
