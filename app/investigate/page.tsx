import Link from "next/link";

export default function InvestigatePage() {
  return (
    <main className="min-h-dvh bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              Investigation
            </h1>
            <p className="text-zinc-700 dark:text-zinc-300">
              UI and agents are intentionally not implemented yet. Validate the
              foundation via <a className="underline" href="/api/test">/api/test</a>.
            </p>
          </header>

          <section className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            <p className="font-medium text-zinc-950 dark:text-zinc-50">
              Upcoming endpoint
            </p>
            <p className="mt-2">
              The streaming investigation endpoint will live at{" "}
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50">
                /api/investigate
              </code>
              . For now it returns 501.
            </p>
          </section>

          <div className="flex gap-4">
            <Link className="underline" href="/">
              Home
            </Link>
            <Link className="underline" href="/about">
              About
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

