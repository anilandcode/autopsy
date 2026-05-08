"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { Corkboard } from "./corkboard";
import { FinalVerdict } from "./final-verdict";
import type { AgentFinding, PostmortemReport } from "@/types/investigation";

const examples = [
  "Quibi", "Theranos", "Google+", "MoviePass",
  "Juicero", "WeWork", "Vine", "Clubhouse",
];

const mockFindings: AgentFinding[] = [
  {
    role: "market-analyst",
    displayName: "Market Analyst",
    status: "done",
    primaryCause: "Wrong product-market fit — short-form video was already owned by TikTok",
    evidence: ["TikTok had 800M users when Quibi launched", "Mobile-only format ignored TV viewing habits"],
    confidence: 0.91,
    fullAnalysis:
      "Quibi attempted to create a new category of premium short-form mobile video, but the market had already consolidated around TikTok for casual short video and Netflix for premium long-form. The 'in-between' slot did not exist. Consumer behavior data showed users either want 15-second dopamine hits or 45-minute narrative arcs. 10-minute episodes on a phone during commutes was a niche that no one asked for.",
    sources: [{ title: "Quibi Shutdown Announcement", url: "https://variety.com" }],
  },
  {
    role: "operator",
    displayName: "The Operator",
    status: "done",
    primaryCause: "Leadership refused to adapt — doubled down on mobile-only after data showed TV demand",
    evidence: ["CEO Meg Whitman ignored internal research", "No pivot plan existed after 3 months of flat growth"],
    confidence: 0.85,
    fullAnalysis:
      "Operational rigidity was fatal. The leadership team, led by Hollywood veterans, operated with a movie-studio mentality rather than a tech product mindset. When early engagement metrics showed users wanted TV casting, the product team was forbidden from building it. This locked-in strategy persisted even as daily active users flatlined.",
    sources: [{ title: "Quibi Postmortem by former PM", url: "https://techcrunch.com" }],
  },
  {
    role: "money-trail",
    displayName: "Money Trail",
    status: "analyzing",
    primaryCause: "",
    evidence: [],
    confidence: 0,
    fullAnalysis: "",
    sources: [],
  },
  {
    role: "customer-voice",
    displayName: "Customer Voice",
    status: "analyzing",
    primaryCause: "",
    evidence: [],
    confidence: 0,
    fullAnalysis: "",
    sources: [],
  },
  {
    role: "engineer",
    displayName: "The Engineer",
    status: "researching",
    primaryCause: "",
    evidence: [],
    confidence: 0,
    fullAnalysis: "",
    sources: [],
  },
  {
    role: "historian",
    displayName: "The Historian",
    status: "researching",
    primaryCause: "",
    evidence: [],
    confidence: 0,
    fullAnalysis: "",
    sources: [],
  },
];

const mockReport: PostmortemReport = {
  subject: "Quibi",
  executiveSummary:
    "Quibi spent $1.75 billion to prove that a market gap between TikTok and Netflix did not exist. The company combined Hollywood production budgets with a product format no consumer asked for, then locked itself into a mobile-only strategy even as usage data screamed for pivot. The leadership operated with movie-studio rigidity in a world that demands tech agility. By the time they allowed TV casting, users had already left and never returned.",
  primaryCauseOfDeath: "Product-market misfit compounded by leadership rigidity",
  confidenceScore: 0.88,
  agentFindings: mockFindings,
  disagreements: [
    {
      agentA: "market-analyst",
      agentB: "operator",
      topic: "Was the failure market-driven or leadership-driven?",
      agentAPosition: "The mobile-only premium short-form slot simply did not exist as a market category.",
      agentBPosition: "Leadership could have pivoted to TV casting and longer episodes but actively refused.",
    },
  ],
  whatWouldHaveSavedIt: [
    "Launch with TV casting from day one",
    "Fund 10 pilots, not 175 full productions — test format before committing $1B",
    "Hire a tech-native CEO alongside the Hollywood creative lead",
  ],
  lessonsForBuilders: [
    "Never bet a billion dollars on a consumer behavior you haven't validated at small scale",
    "Format-first, content-second — the container matters as much as what goes in it",
    "Leadership diversity (tech + creative) prevents single-domain blind spots",
  ],
  generatedAt: new Date().toISOString(),
};

export function InvestigationRoom() {
  const searchParams = useSearchParams();
  const [subject, setSubject] = useState("");
  const [investigating, setInvestigating] = useState(false);

  useEffect(() => {
    const s = searchParams.get("subject");
    if (s) setSubject(s);
  }, [searchParams]);

  const handleStart = useCallback(() => {
    if (!subject.trim()) return;
    setInvestigating(true);
  }, [subject]);

  return (
    <main className="min-h-dvh bg-[#0A0A0A] text-[#FAFAFA]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 sm:px-12">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[#71717A] transition-colors hover:text-[#FAFAFA]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </Link>
        </div>
        <span className="font-mono text-lg font-bold tracking-wider text-[#EF4444]">
          AUTOPSY
        </span>
        <div className="w-20" />
      </nav>

      <AnimatePresence mode="wait">
        {!investigating ? (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-auto flex max-w-2xl flex-col items-center px-6 pt-20 pb-20 sm:px-12 sm:pt-28"
          >
            <h1 className="mb-3 text-center text-3xl font-bold tracking-tight text-[#FAFAFA] sm:text-5xl">
              What failed?
            </h1>
            <p className="mb-10 text-center text-[#71717A]">
              6 agents will research and debate in parallel
            </p>

            <div className="w-full">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#52525B]" />
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleStart()}
                  placeholder="e.g. Quibi, Theranos, Google Glass, your startup..."
                  className="h-14 w-full rounded-xl border border-[#222222] bg-[#111111] pl-12 pr-5 text-[#FAFAFA] placeholder-[#52525B] outline-none transition-colors focus:border-[#EF4444]/50"
                />
              </div>

              <button
                onClick={handleStart}
                disabled={!subject.trim()}
                className="mt-4 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#EF4444] px-8 text-base font-semibold text-white shadow-lg shadow-[#EF4444]/20 transition-all hover:bg-[#DC2626] hover:shadow-[#EF4444]/30 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Begin Investigation
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            {/* Example chips */}
            <div className="mt-10 w-full">
              <p className="mb-3 text-sm text-[#71717A]">
                or choose a famous failure:
              </p>
              <div className="flex flex-wrap gap-2">
                {examples.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setSubject(ex)}
                    className="rounded-full border border-[#222222] bg-[#111111] px-4 py-2 text-sm text-[#A1A1AA] transition-all hover:border-[#EF4444]/30 hover:text-[#FAFAFA]"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="investigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6 py-10 sm:px-12"
          >
            <Corkboard subject={subject} findings={mockFindings} />
            <FinalVerdict report={mockReport} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
