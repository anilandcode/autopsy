import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-dvh bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">About</h1>
            <p className="text-zinc-700 dark:text-zinc-300">
              Autopsy is an AI agent system that investigates why startups and
              products failed. This repo currently contains only the foundation
              scaffold (LLM + web search + a test endpoint).
            </p>
          </header>

          <section className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            <p className="font-medium text-zinc-950 dark:text-zinc-50">
              Foundation check
            </p>
            <p className="mt-2">
              Hit <a className="underline" href="/api/test">/api/test</a> after
              you set `LLM_API_KEY` and `TAVILY_API_KEY` in `.env.local`.
            </p>
          </section>

          <div>
            <Link className="underline" href="/">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

