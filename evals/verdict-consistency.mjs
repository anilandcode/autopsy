import { readFileSync, writeFileSync } from "node:fs";

/*
 * Multi-agent verdict-consistency eval. Autopsy's agents produce findings, then a
 * synthesizer ships a verdict. The failure mode to guard against is a verdict that
 * drifts beyond what the agents actually found. For each recorded investigation,
 * a judge scores whether the VERDICT is supported by the FINDINGS. Runs keyless
 * via a deterministic mock; set OPENAI_API_KEY to judge with a real model. No deps.
 * Mirrors the Litmus harness (github.com/anilandcode/litmus).
 *
 *   node evals/verdict-consistency.mjs   (or: npm run evals)
 */

const fixtures = JSON.parse(readFileSync(new URL("./fixtures.json", import.meta.url), "utf8"));

async function judge(findings, verdict) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    const ctx = findings.join(" ").toLowerCase();
    const words = verdict.toLowerCase().match(/[a-z]{4,}/g) ?? [];
    const overlap = words.filter((w) => ctx.includes(w)).length / Math.max(1, words.length);
    return overlap >= 0.3 ? 1 : 0.2;
  }
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: 'Score how well the VERDICT is supported by the FINDINGS. Return JSON {"score":0..1}. 1 = fully supported; 0 = introduces claims not in findings. JSON only.' },
        { role: "user", content: `FINDINGS:\n${findings.join("\n")}\n\nVERDICT:\n${verdict}` },
      ],
    }),
  });
  const data = await res.json();
  try {
    return Math.max(0, Math.min(1, Number(JSON.parse(data.choices[0].message.content).score) || 0));
  } catch {
    return 0;
  }
}

const rows = [];
for (const f of fixtures) {
  rows.push({ id: f.id, score: await judge(f.findings, f.verdict), consistent: f.consistent });
}

const mean = rows.reduce((s, r) => s + r.score, 0) / (rows.length || 1);
const passRate = rows.filter((r) => r.score >= 0.7).length / (rows.length || 1);

const md = [
  "# EVAL_SUMMARY — Autopsy verdict consistency",
  "",
  `_${rows.length} investigations · judge: ${process.env.OPENAI_API_KEY ? (process.env.OPENAI_MODEL ?? "gpt-4o-mini") : "deterministic mock"}_`,
  "",
  `- **meanConsistency: ${mean.toFixed(3)}**`,
  `- **passRate (>=0.7): ${passRate.toFixed(3)}**`,
  "",
  "| id | company | score | expected consistent |",
  "|---|---|---:|:--:|",
  ...rows.map((r, i) => `| ${r.id} | ${fixtures[i].company} | ${r.score.toFixed(2)} | ${r.consistent ? "yes" : "no"} |`),
  "",
].join("\n");

writeFileSync(new URL("./EVAL_SUMMARY.md", import.meta.url), md);
console.log(md);
