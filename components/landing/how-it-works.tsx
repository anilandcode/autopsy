"use client";

import { motion } from "framer-motion";
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
    description: "Timing, competition, demand signals",
    icon: BarChart3,
    color: "#EF4444",
  },
  {
    name: "The Operator",
    description: "Team decisions, execution failures",
    icon: UserCog,
    color: "#F97316",
  },
  {
    name: "Money Trail",
    description: "Burn rate, funding, unit economics",
    icon: DollarSign,
    color: "#22C55E",
  },
  {
    name: "Customer Voice",
    description: "Reviews, churn, user complaints",
    icon: MessageSquareQuote,
    color: "#3B82F6",
  },
  {
    name: "The Engineer",
    description: "Tech debt, product decisions, scalability",
    icon: Code2,
    color: "#A855F7",
  },
  {
    name: "The Historian",
    description: "Pattern-matching to past failures",
    icon: History,
    color: "#EAB308",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-[#222222] bg-[#0A0A0A] px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-[#FAFAFA] sm:text-4xl">
          6 agents. 1 verdict.
        </h2>
        <p className="mx-auto mb-14 max-w-xl text-center text-[#71717A]">
          Each agent investigates from a different angle, then a synthesizer
          distills the final postmortem.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-xl border border-[#222222] bg-[#111111] p-6 transition-colors hover:border-[#333333]"
            >
              <div
                className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${agent.color}15`, color: agent.color }}
              >
                <agent.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#FAFAFA]">
                {agent.name}
              </h3>
              <p className="mt-1 text-sm text-[#71717A]">
                {agent.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
