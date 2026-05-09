import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Mail, Linkedin } from "lucide-react";

const WHATSAPP = "https://wa.me/201131176318";
const LINKEDIN = "https://www.linkedin.com/in/yusuf-ahmed-4781003b7/";
const GMAIL = "mailto:yusufahmedyusuf321@gmail.com";

// Simple WhatsApp glyph
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.747.456 3.453 1.32 4.95L2 22l5.265-1.378a9.876 9.876 0 0 0 4.774 1.215h.004c5.46 0 9.91-4.45 9.91-9.91 0-2.648-1.03-5.137-2.903-7.01A9.84 9.84 0 0 0 12.04 2zm0 18.06h-.004a8.226 8.226 0 0 1-4.193-1.148l-.3-.178-3.124.819.834-3.044-.196-.312a8.227 8.227 0 0 1-1.262-4.388c0-4.54 3.694-8.235 8.241-8.235 2.2 0 4.267.857 5.823 2.413a8.18 8.18 0 0 1 2.413 5.83c-.002 4.54-3.696 8.234-8.232 8.234z"/>
    </svg>
  );
}

const options = [
  { label: "WhatsApp", href: WHATSAPP, icon: WhatsAppIcon, color: "var(--brand-whatsapp)" },
  { label: "LinkedIn", href: LINKEDIN, icon: Linkedin, color: "var(--brand-linkedin)" },
  { label: "Gmail",    href: GMAIL,    icon: Mail,     color: "var(--brand-gmail)" },
];

export function FloatingContact() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (open && ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {options.map((opt, i) => {
        const Icon = opt.icon;
        return (
          <a
            key={opt.label}
            href={opt.href}
            target={opt.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className={`group flex items-center gap-3 transition-all duration-300 ${
              open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
            }`}
            style={{ transitionDelay: open ? `${i * 60}ms` : "0ms" }}
            aria-label={`Contact via ${opt.label}`}
          >
            <span className="rounded-full bg-card px-3 py-1.5 text-sm font-medium text-foreground shadow-soft">
              {opt.label}
            </span>
            <span
              className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lift transition-transform group-hover:scale-105"
              style={{ backgroundColor: opt.color }}
            >
              <Icon className="h-5 w-5" />
            </span>
          </a>
        );
      })}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Contact me"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lift transition-all hover:scale-105"
      >
        <span className="relative h-6 w-6">
          <MessageCircle
            className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${open ? "scale-50 opacity-0" : "scale-100 opacity-100"}`}
          />
          <X
            className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${open ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
          />
        </span>
      </button>
    </div>
  );
}
