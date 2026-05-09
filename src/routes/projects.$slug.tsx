import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useProject } from "@/lib/portfolio-queries";

export const Route = createFileRoute("/projects/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Yusuf Ahmed` },
      { name: "description", content: `AI automation case study by Yusuf Ahmed.` },
    ],
  }),
  component: ProjectDetail,
});

function ProjectDetail() {
  const { slug } = Route.useParams();
  const { data: project, isLoading } = useProject(slug);

  if (isLoading) {
    return <div className="mx-auto max-w-4xl px-6 py-20"><div className="h-96 animate-pulse rounded-2xl bg-surface" /></div>;
  }
  if (!project) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="font-display text-3xl">Project not found</h1>
        <Link to="/projects" className="mt-4 inline-block text-sm text-muted-foreground hover:text-foreground">← Back to projects</Link>
      </div>
    );
  }

  const gallery = (Array.isArray(project.gallery) ? project.gallery : []) as string[];

  return (
    <article className="mx-auto max-w-4xl px-6 py-16">
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All projects
      </Link>
      <header className="mt-6">
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <span key={t} className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">{t}</span>
          ))}
        </div>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl">{project.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{project.short_description}</p>
      </header>

      {project.cover_url && (
        <img src={project.cover_url} alt={project.title}
          className="mt-10 aspect-[16/9] w-full rounded-2xl border border-border object-cover" />
      )}

      {project.video_url && (
        <div className="mt-6 aspect-video overflow-hidden rounded-2xl border border-border bg-black">
          <video src={project.video_url} controls className="h-full w-full" />
        </div>
      )}

      <div className="prose prose-neutral mt-10 max-w-none whitespace-pre-wrap text-base leading-relaxed text-foreground">
        {project.long_description}
      </div>

      {gallery.length > 0 && (
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {gallery.map((url, i) => (
            <img key={i} src={url} alt={`${project.title} ${i + 1}`} className="rounded-xl border border-border" />
          ))}
        </div>
      )}
    </article>
  );
}
