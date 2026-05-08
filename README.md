# AUTOPSY
## Forensic Postmortem Intelligence — 6 AI Agents, 1 Verdict

![Autopsy](https://autopsy-nine.vercel.app/opengraph-image)

### What it is

Autopsy investigates why companies fail. Six specialized AI agents — Market Analyst, Operator, Money Trail, Customer Voice, Engineer, Historian — research in parallel, debate each other's findings, and produce a forensic postmortem in 90 seconds.

Three modes:
- **Postmortem** — investigate why a company failed
- **Pre-Mortem** — predict what could kill a living company
- **Founder Mode** — analyze your own startup before it fails

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
