import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[calc(100dvh-0px)] bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <div className="flex flex-col gap-10">
          <header className="flex flex-col gap-4">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Autopsy
            </p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Investigate why startups failed — with an AI agent crew.
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-7 text-zinc-700 dark:text-zinc-300">
              This is the foundation scaffold. Next we’ll add a multi-agent
              system (6 specialists + 1 synthesizer). For now, verify the core
              plumbing via the test endpoint.
            </p>
          </header>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/investigate"
              className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-6 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Open Investigation App
            </Link>
            <Link
              href="/about"
              className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-6 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              About
            </Link>
            <a
              href="/api/test"
              className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-6 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Run foundation check (`/api/test`)
            </a>
          </div>

          <section className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            <p className="font-medium text-zinc-950 dark:text-zinc-50">
              Next steps (after you verify the foundation)
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Implement SSE in `/api/investigate`.</li>
              <li>Add agent prompts + orchestrator.</li>
              <li>Build the corkboard-style UI.</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
