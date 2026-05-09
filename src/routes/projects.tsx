import { createFileRoute, Link } from "@tanstack/react-router";
import { useProjects } from "@/lib/portfolio-queries";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Yusuf Ahmed" },
      { name: "description", content: "AI automation projects built by Yusuf Ahmed: agents, document pipelines, and workflow integrations." },
      { property: "og:title", content: "Projects — Yusuf Ahmed" },
      { property: "og:description", content: "Selected AI automation work." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { data: projects = [], isLoading } = useProjects();

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <p className="text-sm uppercase tracking-widest text-muted-foreground">Portfolio</p>
      <h1 className="mt-2 font-display text-4xl font-semibold md:text-6xl">All projects</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        A selection of AI automations I've designed, built and shipped.
      </p>

      {isLoading ? (
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-surface" />
          ))}
        </div>
      ) : (
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Link
              key={p.id}
              to="/projects/$slug"
              params={{ slug: p.slug }}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lift"
            >
              <div className="aspect-[4/3] overflow-hidden bg-surface">
                {p.cover_url && (
                  <img src={p.cover_url} alt={p.title} loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                )}
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.slice(0, 3).map((t) => (
                    <span key={t} className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">{t}</span>
                  ))}
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.short_description}</p>
              </div>
            </Link>
          ))}
          {projects.length === 0 && (
            <p className="text-muted-foreground">No projects yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
