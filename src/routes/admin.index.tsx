import { createFileRoute, Link } from "@tanstack/react-router";
import { useProjects, useServices, useTestimonials } from "@/lib/portfolio-queries";
import { FolderKanban, Wrench, MessageSquareQuote } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: projects = [] } = useProjects();
  const { data: services = [] } = useServices();
  const { data: testimonials = [] } = useTestimonials();

  const cards = [
    { to: "/admin/projects", label: "Projects", count: projects.length, icon: FolderKanban },
    { to: "/admin/services", label: "Services", count: services.length, icon: Wrench },
    { to: "/admin/testimonials", label: "Testimonials", count: testimonials.length, icon: MessageSquareQuote },
  ] as const;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Manage your portfolio content.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.to} to={c.to} className="rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-soft">
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <span className="font-display text-3xl font-semibold">{c.count}</span>
              </div>
              <p className="mt-4 font-medium">{c.label}</p>
              <p className="text-sm text-muted-foreground">Manage →</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
