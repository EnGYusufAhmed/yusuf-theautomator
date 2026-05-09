import { createFileRoute, Outlet, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const { session, loading, isAdmin, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/login" });
  }, [loading, session, navigate]);

  if (loading || !session) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">Not an admin</h1>
        <p className="mt-3 text-muted-foreground">
          Your account ({user?.email}) doesn't have admin access yet. Ask Lovable to grant your user the <code className="rounded bg-surface px-1.5 py-0.5">admin</code> role.
        </p>
        <p className="mt-2 break-all text-xs text-muted-foreground">User ID: {user?.id}</p>
        <Button className="mt-6" variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-display text-lg font-semibold">Yusuf Ahmed</Link>
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Admin</span>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/admin" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground font-medium" }} className="text-muted-foreground hover:text-foreground">Dashboard</Link>
            <Link to="/admin/projects" activeProps={{ className: "text-foreground font-medium" }} className="text-muted-foreground hover:text-foreground">Projects</Link>
            <Link to="/admin/services" activeProps={{ className: "text-foreground font-medium" }} className="text-muted-foreground hover:text-foreground">Services</Link>
            <Link to="/admin/testimonials" activeProps={{ className: "text-foreground font-medium" }} className="text-muted-foreground hover:text-foreground">Testimonials</Link>
            <Button size="sm" variant="ghost" onClick={() => supabase.auth.signOut()}>Sign out</Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
