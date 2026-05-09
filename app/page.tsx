'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import HeroVideoBackground from '@/components/HeroVideoBackground';
import MagneticButton from '@/components/MagneticButton';

const recentCases = [
  { company: "Quibi", years: "2018 — 2020", industry: "Streaming", desc: "Wrong format, wrong timing — $1.75B gone in 6 months", outcome: "Capital burned: $1.75B" },
  { company: "Theranos", years: "2003 — 2018", industry: "Healthcare", desc: "Blood-testing tech that never worked, $9B valuation built on fraud", outcome: "Capital burned: $700M" },
  { company: "Google+", years: "2011 — 2019", industry: "Social Media", desc: "Late to social, privacy scandal, engagement never took off", outcome: "Capital burned: Internal" },
  { company: "WeWork", years: "2010 — 2023", industry: "Real Estate", desc: "Leadership chaos, $47B valuation to bankruptcy in 6 weeks", outcome: "Capital burned: $11B+" },
  { company: "Blockbuster", years: "1985 — 2010", industry: "Rental", desc: "Passed on Netflix for $50M — late fees were more important than the future", outcome: "Capital burned: Public" },
  { company: "Kodak", years: "1888 — 2012", industry: "Imaging", desc: "Invented digital photography then buried it to protect film", outcome: "Capital burned: Public" }
];

const whatIfs = [
  { match: "Blockbuster x Netflix", year: "2000", desc: "What if Blockbuster had acquired Netflix?" },
  { match: "Kodak x Digital", year: "1975", desc: "What if Kodak had commercialized their digital camera?" },
  { match: "Yahoo x Google", year: "1998", desc: "What if Yahoo had acquired Google for $1M in 1998?" },
];

const STAGGER_CHILD = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
};

export default function Home() {
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const placeholders = ["Quibi", "Theranos", "WeWork", "Google+", "MoviePass"];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % placeholders.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [placeholders.length]);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
      className="flex flex-col w-full h-full relative z-10 font-sans text-white focus:outline-none"
    >
      {/* Hero Section */}
      <motion.div variants={STAGGER_CHILD} className="flex flex-col items-center text-center px-6 py-24 md:py-36 border-b border-white/5 relative bg-[#0F1110] overflow-hidden">
        {/* Abstract Data Wave Mesh */}
        <HeroVideoBackground />

        {/* Ambient Center Light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(75,75,160,0.15)_0%,rgba(26,30,28,0)_70%)] pointer-events-none z-0"></div>

        <motion.div variants={STAGGER_CHILD} className="flex items-center gap-2 mb-8 relative z-10">
           <span className="flex items-center justify-center border border-[#4B4BA0]/30 shadow-[0_0_15px_-3px_rgba(75,75,160,0.4)] rounded-full px-4 py-1 text-[11px] font-medium tracking-widest uppercase text-[#A1A1AA] bg-[#4B4BA0]/10">
             Enterprise Grade Analysis
           </span>
        </motion.div>

        <motion.h1 variants={STAGGER_CHILD} className="text-[56px] md:text-[80px] lg:text-[100px] font-serif tracking-tight leading-[0.95] text-white font-[200] max-w-4xl mb-8 relative z-10">
          Uncover why <br />
          <span className="italic text-[#4B4BA0] opacity-90 drop-shadow-lg">companies fail.</span>
        </motion.h1>

        <motion.p variants={STAGGER_CHILD} className="text-[16px] md:text-[18px] text-[#A1A1AA] max-w-2xl leading-relaxed font-[300] mb-12 relative z-10">
          Six specialized AI agents analyze, debate, and synthesize postmortems based on public data, SEC filings, and news. Find the true reasons behind the fall.
        </motion.p>

        <motion.div variants={STAGGER_CHILD} className="relative w-full max-w-3xl mt-4 z-10 group">
          {/* Gradient Border Glow shell */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-white/10 via-[#4B4BA0]/50 to-white/10 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]"></div>

          <Link href="/investigate" className="relative w-full h-[68px] bg-[#0F1110]/80 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-full px-4 py-2 flex items-center justify-between shadow-[0_0_40px_-10px_rgba(75,75,160,0.3)] transition-all cursor-text overflow-hidden">
            <div className="flex items-center gap-4 pl-4 overflow-hidden relative w-full h-full">
               <Search size={22} className="text-[#4B4BA0] opacity-80 shrink-0" />
               <div className="text-[#A1A1AA] text-[16px] font-[300] flex items-center gap-1">
                 <span>Investigate</span>
                 <span className="relative h-[24px] w-[200px] overflow-hidden inline-block ml-1">
                   <AnimatePresence mode="popLayout">
                     <motion.span
                       key={placeholderIdx}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -20 }}
                       transition={{ duration: 0.4, ease: "easeOut" }}
                       className="absolute left-0 top-0 text-white font-[400]"
                     >
                       {placeholders[placeholderIdx]}...
                     </motion.span>
                   </AnimatePresence>
                 </span>
               </div>
            </div>
            <div className="flex items-center gap-3 pr-2 shrink-0">
              <span className="text-[12px] text-[#A1A1AA]/50 font-mono hidden sm:flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded">⌘</kbd>
                <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded">K</kbd>
              </span>
              <span className="text-[14px] bg-[#4B4BA0]/20 px-6 py-2.5 rounded-full text-white/90 border border-[#4B4BA0]/30 shadow-lg group-hover:bg-[#4B4BA0] group-hover:text-white transition-all font-medium">
                Initialize
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Quick Filters */}
        <motion.div variants={STAGGER_CHILD} className="flex flex-wrap items-center justify-center gap-3 mt-10">
          <Link href="/investigate?preset=postmortem" className="px-4 py-2.5 bg-[#4B4BA0]/10 border border-[#4B4BA0]/30 rounded-full text-[13px] flex items-center gap-2 hover:bg-[#4B4BA0]/20 transition-colors">
            <span className="text-white font-medium">Postmortem</span>
            <span className="text-[#A1A1AA]">Why it died</span>
          </Link>
          <Link href="/investigate?preset=premortem" className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-[13px] flex items-center gap-2 hover:border-white/20 hover:bg-white/10 transition-colors">
            <span className="text-white">Pre-Mortem</span>
            <span className="text-[#A1A1AA]">What could kill it</span>
          </Link>
          <Link href="/investigate?preset=founder" className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-[13px] flex items-center gap-2 hover:border-white/20 hover:bg-white/10 transition-colors">
            <span className="text-white">Founder Mode</span>
            <span className="text-[#A1A1AA]">Will yours survive</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Triplet Feature Cards */}
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="grid grid-cols-1 md:grid-cols-3 border-b border-white/5">
        <motion.div variants={STAGGER_CHILD} className="col-span-1 p-8 md:p-10 lg:p-12 border-b md:border-b-0 md:border-r border-white/5 flex flex-col gap-6 group hover:bg-white/[0.02] transition-colors cursor-default relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4B4BA0]/0 to-[#4B4BA0]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="w-12 h-12 rounded-[12px] bg-[#4B4BA0]/10 border border-[#4B4BA0]/20 flex items-center justify-center mb-2 relative z-10">
             <div className="text-[18px] text-[#4B4BA0]">01</div>
          </div>
          <div className="relative z-10">
            <h3 className="text-[18px] text-white font-[400] mb-3">Smart Prompts</h3>
            <p className="text-[14px] leading-relaxed text-[#A1A1AA] font-[300]">
              Quickly formulate complex queries to stress-test your ideas. We provide suggestions based on established market patterns.
            </p>
          </div>
        </motion.div>

        <motion.div variants={STAGGER_CHILD} className="col-span-1 p-8 md:p-10 lg:p-12 border-b md:border-b-0 md:border-r border-white/5 flex flex-col gap-6 group hover:bg-white/[0.02] transition-colors cursor-default relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#8F47AE]/0 to-[#8F47AE]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="w-12 h-12 rounded-[12px] bg-[#8F47AE]/10 border border-[#8F47AE]/20 flex items-center justify-center mb-2 relative z-10">
             <div className="text-[18px] text-[#8F47AE]">02</div>
          </div>
          <div className="relative z-10">
             <h3 className="text-[18px] text-white font-[400] mb-3">Deep Research</h3>
            <p className="text-[14px] leading-relaxed text-[#A1A1AA] font-[300]">
              Six specialized AI agents work in parallel to synthesize SEC filings, press mentions, and internal memos into a cohesive autopsy.
            </p>
          </div>
        </motion.div>

        <motion.div variants={STAGGER_CHILD} className="col-span-1 p-8 md:p-10 lg:p-12 flex flex-col gap-6 group hover:bg-white/[0.02] transition-colors cursor-default relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="w-12 h-12 rounded-[12px] bg-white/5 border border-white/10 flex items-center justify-center mb-2 relative z-10">
             <div className="text-[18px] text-white">03</div>
          </div>
          <div className="relative z-10">
             <h3 className="text-[18px] text-white font-[400] mb-3">Actionable Synthesis</h3>
            <p className="text-[14px] leading-relaxed text-[#A1A1AA] font-[300]">
              Beyond just facts, we provide a unified verdict with confidence ratings and actionable takeaways for your own ventures.
            </p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
         {/* Recent Cases Section */}
         <div className="col-span-1 md:col-span-2 border-r border-white/5 flex flex-col">
           <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-[20px] font-medium text-white">Recent Postmortems</h2>
                <p className="text-[14px] text-[#A1A1AA] mt-1">Explore why the giants stumbled.</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 h-full">
            {recentCases.map((item, i) => (
              <motion.div variants={STAGGER_CHILD} key={i} className={`p-8 border-b border-white/5 flex flex-col hover:bg-white/[0.02] transition-colors group cursor-default ${i % 2 === 0 ? 'md:border-r border-white/5' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[16px] text-white font-serif group-hover:text-[#4B4BA0] transition-colors">{item.company}</h3>
                  <span className="text-[11px] px-2 py-1 border border-white/10 rounded tracking-widest uppercase text-white/50">{item.years}</span>
                </div>
                <div className="text-[12px] text-[#4B4BA0] mb-3 flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#4B4BA0] rounded-full"></span>
                  {item.industry}
                </div>
                <p className="text-[14px] text-[#A1A1AA] font-[300] leading-relaxed mb-6 flex-grow">
                  {item.desc}
                </p>
                <div className="text-[12px] text-white/80 font-mono bg-white/5 border border-white/5 inline-flex self-start px-2.5 py-1.5 rounded transition-colors group-hover:border-white/10">
                  {item.outcome}
                </div>
              </motion.div>
            ))}
           </div>
         </div>

         {/* What Ifs Section */}
         <div className="col-span-1 flex flex-col bg-[#1A1E1C]/50">
           <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <motion.div variants={STAGGER_CHILD}>
                <h2 className="text-[20px] font-medium text-white">Counterfactuals</h2>
                <p className="text-[14px] text-[#A1A1AA] mt-1">What-ifs of tech history.</p>
              </motion.div>
           </div>

           <div className="flex flex-col h-full">
             {whatIfs.map((item, i) => (
               <motion.div variants={STAGGER_CHILD} key={i} className="p-8 border-b border-white/5 hover:bg-white/[0.02] transition-colors flex-grow group flex flex-col justify-center">
                 <div className="text-[12px] text-[#8F47AE] mb-3 uppercase tracking-widest font-mono">{item.year}</div>
                 <h3 className="text-[18px] text-white font-serif mb-3 transition-colors group-hover:text-[#8F47AE]">{item.match}</h3>
                 <p className="text-[14px] text-[#A1A1AA] font-[300] leading-relaxed italic">
                   &quot;{item.desc}&quot;
                 </p>
                 <button className="mt-5 text-[12px] text-[#A1A1AA] flex items-center gap-2 uppercase tracking-wide font-medium group-hover:text-white transition-colors self-start">
                   Run Simulation <span className="group-hover:translate-x-1 transition-transform">→</span>
                 </button>
               </motion.div>
             ))}
           </div>
         </div>
      </motion.div>

       {/* CTA Lower Section */}
       <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="grid grid-cols-1 md:grid-cols-2 min-h-[30vh]">
        <motion.div variants={STAGGER_CHILD} className="col-span-1 p-8 md:p-[72px] flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/5 relative overflow-hidden">
           <div className="absolute -left-32 -bottom-32 w-64 h-64 bg-[#4B4BA0]/10 blur-[80px] rounded-full"></div>
           <h2 className="text-[32px] md:text-[42px] font-serif tracking-tight leading-[1.1] text-white font-[200] max-w-sm mb-6 relative z-10">
             Ready to dissect a failure?
           </h2>
           <p className="text-[15px] leading-relaxed text-[#A1A1AA] font-[300] max-w-sm relative z-10">
             Learn from the mistakes of others before they become your own. Provide a company name or startup idea to begin.
           </p>
        </motion.div>

        <motion.div variants={STAGGER_CHILD} className="col-span-1 p-8 md:p-[72px] flex items-center justify-center bg-[#0F1110]">
           <MagneticButton>
             <Link href="/investigate" className="bg-[#4B4BA0] hover:bg-[#4B4BA0]/90 text-white font-medium text-[15px] px-8 py-4 rounded-full transition-all shadow-[0_0_20px_-5px_rgba(75,75,160,0.5)] hover:shadow-[0_0_30px_-5px_rgba(75,75,160,0.7)] hover:-translate-y-0.5 flex items-center gap-2">
               Start Investigation
               <motion.svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
               >
                 <path d="M5 12h14M12 5l7 7-7 7"/>
               </motion.svg>
             </Link>
           </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Development Context */}
      <section className="flex flex-col gap-6 mt-6">
        <div className="text-[12px] font-[300] uppercase tracking-widest text-[#8F47AE] border-b border-white/5 pb-2">
          Development Context
        </div>
        <div className="p-[1px] rounded-[16px] bg-gradient-to-b from-white/20 via-white/5 to-transparent">
          <div className="bg-[#0F1110] rounded-[15px] p-12 flex flex-col gap-6">
            <h2 className="text-[48px] font-serif font-[200] leading-[48px] tracking-tight text-white">
              AMD Developer Hackathon 2026
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-[14px] font-[200] leading-[22.75px] text-[#A1A1AA]">
              <p>
                Autopsy was built for the AMD Developer Hackathon 2026, a global competition focused on
                leveraging AMD hardware for AI-driven applications. The project uses Kimi K2.6 via
                Fireworks AI for agent reasoning and plans a migration to self-hosted inference on AMD MI300X
                GPUs for cost-efficient, high-throughput postmortem generation.
              </p>
              <p>
                The MI300X advantage is real: 192GB of HBM3 memory enables all six agents to run in parallel
                on a single GPU. On an H100 (80GB), you&apos;d need three sequential rounds. On the MI300X, the
                agents debate in real time. The hardware doesn&apos;t just make it faster — it makes the debate
                architecture possible.
              </p>
            </div>
          </div>
        </div>
      </section>

    </motion.div>
  );
}
