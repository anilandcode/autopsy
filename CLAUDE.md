# Autopsy AI — Project Instructions

## Identity

Autopsy AI is a Next.js web app that lets users research why companies failed. Six specialized AI agents analyze, debate, and synthesize postmortems based on public data, SEC filings, and news.

## Tech Stack

- **Framework:** Next.js 16.2.4 (App Router, React 19.2.4)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`), no `tailwind.config` file
- **Animation:** Framer Motion, GSAP + ScrollTrigger
- **3D / WebGL:** Three.js (background effects)
- **Fonts:** Inter (sans), Newsreader (serif/display), JetBrains Mono (mono) — loaded via `next/font/google`
- **Icons:** Lucide React (`lucide-react`)
- **Utilities:** `clsx`, `tailwind-merge`, `class-variance-authority`
- **API layer:** Route handlers in `app/api/*` for LLM calls (Fireworks `accounts/fireworks/models/kimi-k2p6` default)

## Design System Summary

- **Palette:** Dark mode. Primary accent `#4B4BA0`, bg `#1A1E1C`, surface `#0F1110`, text `#FFFFFF` / `#A1A1AA`.
- **Typography:** Newsreader 48 px/200 wt for display; Inter 14 px/200 wt for body.
- **Spacing:** 4.8 px base unit. Section padding `24px`–`48px`; card padding `40px`–`48px`.
- **Elevation:** Elevated surfaces, gradient-border shells, specific shadow recipes (see `lesson.md`).
- **Radii:** `12px`, `15px`, `16px`, `32px`, `9999px`. Cards usually `0px`–`16px`, buttons pill (`9999px`).
- **Motion:** Moderate. Durations `150ms`, `300ms`, `700ms`. Easing `cubic-bezier(0.4, 0, 0.2, 1)`. Scroll reveals via GSAP ScrollTrigger.

For full tokens and do/don't rules, read `lesson.md` or invoke `/autopsy-design-system`.

## Key File Paths

| Path | Purpose |
|------|---------|
| `app/page.tsx` | Homepage (hero, search, recent cases, what-ifs) |
| `app/investigate/page.tsx` | Main investigation flow UI |
| `app/about/page.tsx` | About page |
| `app/architecture/page.tsx` | Architecture page |
| `app/api/investigate/route.ts` | Investigation LLM API |
| `app/api/premortem/route.ts` | Premortem agent API |
| `app/api/founder-mode/route.ts` | Founder mode API |
| `app/api/counterfactual/route.ts` | Counterfactual API |
| `app/api/synthesize/route.ts` | Synthesis API |
| `components/investigation/*` | Investigation UI components |
| `components/HeroVideoBackground.tsx` | Hero background effect |
| `components/DataWaveBackground.tsx` | Data wave background |
| `app/globals.css` | Global CSS vars + Tailwind v4 theme inline |
| `app/layout.tsx` | Root layout, fonts, metadata |
| `next.config.ts` | Next config (transpile `motion`, LLM model env) |
| `DESIGN.md` | Canonical design system document |
| `lesson.md` | Quick-reference design system cheat sheet |

## Build Rules

- `npm run build` must pass before considering changes complete.
- `npm run lint` runs ESLint (Next.js config).
- No `tailwind.config` — theming is done in `globals.css` via `@theme inline`.
- Keep Tailwind arbitrary values minimal; prefer CSS vars or theme tokens.
- Use `next/font/google` for fonts; never import Google Fonts via `<link>`.
- Prefer server components; mark `'use client'` only when hooks or browser APIs are required.
- Route handlers should validate with Zod where possible.

## Agents & API Notes

- Default LLM model is `accounts/fireworks/models/kimi-k2p6` (set in `next.config.ts` env).
- The app runs four modes: Investigate, Premortem, Founder Mode, Counterfactual.
- Each mode hits its own route handler; responses are streamed or JSON depending on the endpoint.

## Global Rules

@AGENTS.md
