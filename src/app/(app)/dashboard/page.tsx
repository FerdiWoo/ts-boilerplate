import { Button } from '@/components/ui/button';
import { archiveProjectAction } from '@/features/projects/actions/projects.actions';
import { listProjectsQuery } from '@/features/projects/server/projects.queries';
import { CreateProjectForm } from '@/features/projects/ui/create-project-form';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const projects = await listProjectsQuery();

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-16 sm:px-10">
      <header className="mb-12">
        <p className="text-accent mb-3 font-mono text-xs font-semibold tracking-[0.18em] uppercase">
          TS boilerplate
        </p>
        <h1 className="max-w-2xl text-4xl leading-tight font-semibold tracking-tight sm:text-6xl">
          Ship the domain, not the plumbing.
        </h1>
        <p className="text-muted mt-5 max-w-xl text-base leading-7 sm:text-lg">
          Next.js, Tailwind CSS, Neon Postgres, Drizzle ORM, TypeScript, and Zod
          with clear server-side boundaries.
        </p>
      </header>

      <section className="border-border bg-surface rounded-3xl border p-5 shadow-2xl shadow-black/10 sm:p-8">
        <h2 className="mb-5 text-lg font-semibold">Projects</h2>
        <CreateProjectForm />

        <div className="mt-8 grid gap-3">
          {projects.length ? (
            projects.map((project) => (
              <article
                className="border-border bg-background flex items-center justify-between gap-4 rounded-2xl border px-4 py-3"
                key={project.id}
              >
                <div className="min-w-0">
                  <h3 className="truncate font-medium">{project.name}</h3>
                  <p className="text-muted truncate font-mono text-xs">
                    {project.slug}
                  </p>
                </div>
                <form action={archiveProjectAction}>
                  <input name="projectId" type="hidden" value={project.id} />
                  <Button size="small" type="submit" variant="ghost">
                    Archive
                  </Button>
                </form>
              </article>
            ))
          ) : (
            <p className="border-border text-muted rounded-2xl border border-dashed p-8 text-center text-sm">
              Create the first project to verify the full stack.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
