import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { useProjects, useServices, useTestimonials } from "@/lib/portfolio-queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yusuf Ahmed — AI Automation Engineer" },
      { name: "description", content: "I design and ship production AI automations: agents, document AI, and end-to-end workflow integrations." },
      { property: "og:title", content: "Yusuf Ahmed — AI Automation Engineer" },
      { property: "og:description", content: "Production AI automations, agents, and integrations." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data: projects = [] } = useProjects();
  const { data: services = [] } = useServices();
  const { data: testimonials = [] } = useTestimonials();
  const featured = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-24 md:pt-32 md:pb-32">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3" /> Available for new projects
        </div>
        <h1 className="mt-6 max-w-4xl font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
          AI automations that quietly run your business.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          I'm Yusuf Ahmed — an AI automation engineer. I build agents, document
          pipelines and workflow integrations that replace hours of manual work.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/projects" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]">
            View my work <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/services" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-surface">
            What I build
          </Link>
        </div>
      </section>

      {/* Featured projects */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-muted-foreground">Selected work</p>
            <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">Featured automations</h2>
          </div>
          <Link to="/projects" className="hidden items-center gap-1 text-sm text-muted-foreground hover:text-foreground md:inline-flex">
            All projects <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((p) => (
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
                <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.short_description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Services preview */}
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">What I do</p>
          <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">Services</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {services.slice(0, 4).map((s) => (
              <div key={s.id} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">Kind words</p>
          <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">Trusted by operators</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t) => (
              <figure key={t.id} className="rounded-2xl border border-border bg-card p-6">
                <blockquote className="font-display text-lg leading-snug">"{t.quote}"</blockquote>
                <figcaption className="mt-4 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{t.name}</span>
                  {t.role && <> · {t.role}</>}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl border border-border bg-card p-10 text-center md:p-16">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold md:text-5xl">
            Have a workflow that drains your team?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Tell me what you're trying to automate. I'll come back with a plan.
          </p>
          <a
            href="https://wa.me/201131176318"
            target="_blank" rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
          >
            Start a conversation <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
