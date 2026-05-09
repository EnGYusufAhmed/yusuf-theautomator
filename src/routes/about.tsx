import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Yusuf Ahmed" },
      { name: "description", content: "Yusuf Ahmed — AI automation engineer focused on production-grade agents, integrations and document AI." },
      { property: "og:title", content: "About — Yusuf Ahmed" },
      { property: "og:description", content: "Background, skills and approach." },
    ],
  }),
  component: AboutPage,
});

const skills = [
  "n8n", "Make (Integromat)", "Zapier", "OpenAI", "Gemini", "Claude",
  "RAG / Vector DBs", "LangChain", "Document AI", "TypeScript", "Python", "Supabase",
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-sm uppercase tracking-widest text-muted-foreground">About</p>
      <h1 className="mt-2 font-display text-4xl font-semibold md:text-6xl">Hi, I'm Yusuf.</h1>

      <div className="mt-8 space-y-5 text-lg leading-relaxed text-foreground">
        <p>
          I'm an AI automation engineer who helps founders and ops teams replace
          manual workflows with reliable, well-instrumented systems.
        </p>
        <p>
          My focus is the boring-but-critical work: making sure agents don't hallucinate
          on the things that matter, that pipelines fail loudly, and that humans stay in
          the loop where it counts.
        </p>
        <p>
          I work end-to-end — from scoping the workflow to building it, monitoring it,
          and iterating with the people who use it every day.
        </p>
      </div>

      <h2 className="mt-14 font-display text-2xl font-semibold">Tools & stack</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {skills.map((s) => (
          <span key={s} className="rounded-full border border-border bg-card px-3 py-1 text-sm">{s}</span>
        ))}
      </div>
    </div>
  );
}
