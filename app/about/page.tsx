import Link from "next/link";
import {
  BarChart3,
  UserCog,
  DollarSign,
  MessageSquareQuote,
  Code2,
  History,
} from "lucide-react";

const agents = [
  {
    name: "Market Analyst",
    icon: BarChart3,
    color: "#EF4444",
    methodology:
      "Searches for market timing, competitive dynamics, demand signals, and TAM/SAM misalignments. Looks for category-killers that entered the same space.",
    bias: "Tends to over-weight timing and under-weight execution quality.",
  },
  {
    name: "The Operator",
    icon: UserCog,
    color: "#F97316",
    methodology:
      "Investigates team decisions, hiring patterns, pivots that didn't happen, and execution velocity. Reads Glassdoor, LinkedIn, and ex-employee interviews.",
    bias: "Often blames leadership before acknowledging market headwinds.",
  },
  {
    name: "Money Trail",
    icon: DollarSign,
    color: "#22C55E",
    methodology:
      "Traces burn rate, funding history, unit economics, runway math, and whether the business model was ever viable at scale.",
    bias: "Will flag a broken unit economics model even when traction is strong.",
  },
  {
    name: "Customer Voice",
    icon: MessageSquareQuote,
    color: "#3B82F6",
    methodology:
      "Scrapes reviews, Reddit threads, social sentiment, and churn signals. Builds a composite voice-of-customer from first-principles complaints.",
    bias: "Can overweight early-adopter complaints and miss mainstream adoption curves.",
  },
  {
    name: "The Engineer",
    icon: Code2,
    color: "#A855F7",
    methodology:
      "Analyzes technical architecture, scalability decisions, product trade-offs, and tech debt accumulation. Checks GitHub activity and engineering blog posts.",
    bias: "Frequently concludes 'the tech was fine, the market was wrong.'",
  },
  {
    name: "The Historian",
    icon: History,
    color: "#EAB308",
    methodology:
      "Pattern-matches against historical failures with similar DNA. Draws from case studies, academic research, and longitudinal industry data.",
    bias: "May over-fit to historical analogies and miss novel category risks.",
  },
];

const techStack = [
  { name: "Next.js", description: "React framework for the UI" },
  { name: "DeepSeek V4 Pro", description: "LLM running on Fireworks AI" },
  { name: "AMD MI300X", description: "GPU inference on day 3 (planned)" },
  { name: "Tavily", description: "Real-time web search for evidence" },
  { name: "LangGraph", description: "Agent orchestration and state machine" },
  { name: "Vercel", description: "Deployment and edge hosting" },
];

export default function AboutPage() {
  return (
    <main className="min-h-dvh bg-[#0A0A0A] text-[#FAFAFA]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 sm:px-12">
        <Link
          href="/"
          className="text-sm text-[#71717A] transition-colors hover:text-[#FAFAFA]"
        >
          Home
        </Link>
        <span className="font-mono text-lg font-bold tracking-wider text-[#EF4444]">
          AUTOPSY
        </span>
        <Link
          href="/investigate"
          className="inline-flex h-9 items-center justify-center rounded-full bg-[#EF4444] px-5 text-sm font-medium text-white hover:bg-[#DC2626]"
        >
          Launch App
        </Link>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-16 sm:px-12">
        <h1 className="mb-12 text-4xl font-bold tracking-tight text-[#FAFAFA] sm:text-5xl">
          About Autopsy
        </h1>

        {/* What is Autopsy */}
        <section className="mb-20">
          <h2 className="mb-6 font-mono text-sm font-medium uppercase tracking-wider text-[#EF4444]">
            What is Autopsy?
          </h2>
          <div className="space-y-4 text-base leading-8 text-[#A1A1AA]">
            <p>
              Autopsy is a forensic AI tool that investigates why startups,
              products, and companies failed. Instead of a single chatbot
              guessing at a postmortem, Autopsy deploys six specialist agents
              — each with a distinct investigative lens — who research in
              parallel, debate their findings, and produce a synthesized verdict
              backed by live web sources.
            </p>
            <p>
              The result is not an opinion. It is a structured forensic report
              with a primary cause of death, an evidence trail, counterfactual
              analysis (what would have saved it), and actionable lessons for
              builders. Every claim is sourced. Every agent has a known bias.
              The disagreements are surfaced, not hidden.
            </p>
          </div>
        </section>

        {/* The 6 Agents */}
        <section className="mb-20">
          <h2 className="mb-8 font-mono text-sm font-medium uppercase tracking-wider text-[#EF4444]">
            The 6 Agents
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {agents.map((agent) => {
              const Icon = agent.icon;
              return (
                <div
                  key={agent.name}
                  className="rounded-xl border border-[#222222] bg-[#111111] p-6"
                >
                  <div className="mb-3 flex items-center gap-2.5">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-md"
                      style={{
                        backgroundColor: `${agent.color}15`,
                        color: agent.color,
                      }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-base font-semibold text-[#FAFAFA]">
                      {agent.name}
                    </span>
                  </div>
                  <p className="mb-3 text-sm leading-6 text-[#A1A1AA]">
                    {agent.methodology}
                  </p>
                  <p className="text-xs italic text-[#52525B]">
                    Bias: {agent.bias}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Built With */}
        <section className="mb-20">
          <h2 className="mb-8 font-mono text-sm font-medium uppercase tracking-wider text-[#EF4444]">
            Built With
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="rounded-lg border border-[#222222] bg-[#111111] px-5 py-4"
              >
                <div className="text-sm font-semibold text-[#FAFAFA]">
                  {tech.name}
                </div>
                <div className="mt-0.5 text-xs text-[#71717A]">
                  {tech.description}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Hackathon */}
        <section className="mb-20">
          <h2 className="mb-6 font-mono text-sm font-medium uppercase tracking-wider text-[#EF4444]">
            AMD Developer Hackathon 2026
          </h2>
          <p className="text-base leading-8 text-[#A1A1AA]">
            Autopsy was built for the AMD Developer Hackathon 2026, a global
            competition focused on leveraging AMD hardware for AI-driven
            applications. The project uses DeepSeek V4 Pro via Fireworks AI for
            agent reasoning and plans a day-3 migration to self-hosted inference
            on AMD MI300X GPUs for cost-efficient, high-throughput postmortem
            generation.
          </p>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#222222] px-6 py-12 sm:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <span className="font-mono text-lg font-bold tracking-wider text-[#EF4444]">
            AUTOPSY
          </span>
          <p className="mt-2 text-sm text-[#71717A]">
            6 agents. 1 verdict. No survivors.
          </p>
          <p className="mt-4 text-xs text-[#52525B]">
            Built for AMD Developer Hackathon 2026
          </p>
        </div>
      </footer>
    </main>
  );
}
