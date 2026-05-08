"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Skull, TrendingDown, FlaskConical, CreditCard, GlassWater, Building2, Radio, Megaphone } from "lucide-react";

const examples = [
  {
    name: "Quibi",
    hint: "Wrong format, wrong timing, $1.75B gone in 6 months",
    year: "2020",
    icon: Video,
  },
  {
    name: "Theranos",
    hint: "Fraudulent blood-testing tech, $9B valuation collapse",
    year: "2018",
    icon: FlaskConical,
  },
  {
    name: "Google+",
    hint: "Late to social, privacy scandal, engagement never took off",
    year: "2019",
    icon: Users,
  },
  {
    name: "MoviePass",
    hint: "Unsustainable $9.95 model burned $150M in 18 months",
    year: "2019",
    icon: CreditCard,
  },
  {
    name: "Juicero",
    hint: "$400 WiFi juicer, press could be done by hand",
    year: "2017",
    icon: GlassWater,
  },
  {
    name: "WeWork",
    hint: "Leadership chaos, $47B to bankruptcy in 6 weeks",
    year: "2019",
    icon: Building2,
  },
  {
    name: "Vine",
    hint: "Twitter cut the cord before short-form video went global",
    year: "2016",
    icon: Radio,
  },
  {
    name: "Clubhouse",
    hint: "Audio-only hype cycle, no lasting moat",
    year: "2021",
    icon: Megaphone,
  },
];

function Video(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </svg>
  );
}

function Users(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function Examples() {
  return (
    <section className="px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-[#FAFAFA] sm:text-4xl">
          Investigate a famous failure
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {examples.map((ex, i) => (
            <motion.div
              key={ex.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link
                href={`/investigate?subject=${encodeURIComponent(ex.name)}`}
                className="group flex h-full flex-col rounded-xl border border-[#222222] bg-[#111111] p-5 transition-all hover:border-[#EF4444]/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.08)]"
              >
                <div className="mb-3 flex items-center justify-between">
                  <ex.icon className="h-5 w-5 text-[#EF4444]" />
                  <span className="font-mono text-xs text-[#71717A]">{ex.year}</span>
                </div>
                <h3 className="text-lg font-semibold text-[#FAFAFA]">{ex.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#71717A]">{ex.hint}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
