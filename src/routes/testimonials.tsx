import { createFileRoute } from "@tanstack/react-router";
import { useTestimonials } from "@/lib/portfolio-queries";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials — Yusuf Ahmed" },
      { name: "description", content: "What clients say about working with Yusuf Ahmed on AI automation projects." },
      { property: "og:title", content: "Testimonials — Yusuf Ahmed" },
      { property: "og:description", content: "Kind words from past clients." },
    ],
  }),
  component: TestimonialsPage,
});

function TestimonialsPage() {
  const { data: testimonials = [] } = useTestimonials();

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <p className="text-sm uppercase tracking-widest text-muted-foreground">Testimonials</p>
      <h1 className="mt-2 font-display text-4xl font-semibold md:text-6xl">Kind words</h1>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {testimonials.map((t) => (
          <figure key={t.id} className="rounded-2xl border border-border bg-card p-8">
            <blockquote className="font-display text-xl leading-snug">"{t.quote}"</blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              {t.avatar_url && (
                <img src={t.avatar_url} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
              )}
              <div>
                <div className="font-medium">{t.name}</div>
                {t.role && <div className="text-sm text-muted-foreground">{t.role}</div>}
              </div>
            </figcaption>
          </figure>
        ))}
        {testimonials.length === 0 && (
          <p className="text-muted-foreground">No testimonials yet.</p>
        )}
      </div>
    </div>
  );
}
