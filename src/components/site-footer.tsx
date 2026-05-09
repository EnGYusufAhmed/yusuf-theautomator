import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center">
        <div>
          <p className="font-display text-lg font-semibold">Yusuf Ahmed</p>
          <p className="text-sm text-muted-foreground">AI Automation Engineer</p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
          <Link to="/projects" className="hover:text-foreground">Projects</Link>
          <Link to="/services" className="hover:text-foreground">Services</Link>
          <Link to="/about" className="hover:text-foreground">About</Link>
          <a href="mailto:yusufahmedyusuf321@gmail.com" className="hover:text-foreground">Contact</a>
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Yusuf Ahmed</p>
      </div>
    </footer>
  );
}
