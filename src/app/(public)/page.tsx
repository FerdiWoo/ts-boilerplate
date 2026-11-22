import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-6 py-16 sm:px-10">
      <section>
        <p className="text-accent mb-3 font-mono text-xs font-semibold tracking-[0.18em] uppercase">
          TS boilerplate
        </p>
        <h1 className="max-w-3xl text-5xl leading-tight font-semibold tracking-tight sm:text-7xl">
          A clean starting point for the next application.
        </h1>
        <p className="text-muted mt-6 max-w-2xl text-lg leading-8">
          Product features stay together while shared infrastructure remains
          explicit and replaceable.
        </p>
        <Link
          className="bg-accent text-accent-foreground mt-8 inline-flex h-11 items-center rounded-xl px-5 text-sm font-semibold transition hover:brightness-110"
          href="/dashboard"
        >
          Open example dashboard
        </Link>
      </section>
    </main>
  );
}
