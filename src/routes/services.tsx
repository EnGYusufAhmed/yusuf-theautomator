import { createFileRoute } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { useServices } from "@/lib/portfolio-queries";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Yusuf Ahmed" },
      { name: "description", content: "AI automation services: workflow design, custom agents, document AI, and integrations." },
      { property: "og:title", content: "Services — Yusuf Ahmed" },
      { property: "og:description", content: "What I build for clients." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { data: services = [] } = useServices();

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <p className="text-sm uppercase tracking-widest text-muted-foreground">Services</p>
      <h1 className="mt-2 font-display text-4xl font-semibold md:text-6xl">What I build</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        From simple connectors to multi-step AI agents — engineered to be reliable in production.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {services.map((s) => {
          const Icon = (Icons[s.icon as keyof typeof Icons] ?? Icons.Sparkles) as React.ComponentType<{ className?: string }>;
          return (
            <div key={s.id} className="rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 font-display text-2xl font-semibold">{s.title}</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">{s.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
