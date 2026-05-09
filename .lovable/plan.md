## Yusuf Ahmed — AI Automation Portfolio

A clean, minimal light portfolio site with an admin panel to manage projects, plus a floating contact button with WhatsApp / LinkedIn / Gmail.

### Design direction

- Clean minimal light: white/near-white background, charcoal text, single subtle accent (soft indigo).
- Generous whitespace, large editorial typography (Inter / display serif accent for headings).
- Subtle hover lifts, smooth transitions, no neon/glow.
- Fully responsive (mobile-first; preview is currently mobile width).
- Semantic tokens defined in `src/styles.css` (oklch) — no hardcoded colors in components.

### Pages (TanStack routes)

```
src/routes/
  __root.tsx          → shared shell: header nav + floating contact button + footer
  index.tsx           → Hero + About preview + featured projects + services preview
  projects.tsx        → Full grid of AI automations (image/video + description)
  projects.$slug.tsx  → Project detail page (full media, long description, tags)
  services.tsx        → Services offered
  about.tsx           → About Yusuf (bio, skills, experience)
  testimonials.tsx    → Client testimonials
  login.tsx           → Admin login (email/password)
  _authenticated/admin.tsx          → Admin dashboard
  _authenticated/admin.projects.tsx → Manage projects (CRUD + media upload)
  _authenticated/admin.testimonials.tsx → Manage testimonials
  _authenticated/admin.services.tsx → Manage services
```

Each route gets its own `head()` with unique title/description/og tags.

### Floating contact button

- Fixed bottom-right on every page (visible across all routes via `__root.tsx`).
- Circular primary button with chat icon.
- On click: animated radial menu reveals 3 options:
  - **WhatsApp** → `https://wa.me/201131176318`
  - **LinkedIn** → `https://www.linkedin.com/in/yusuf-ahmed-4781003b7/`
  - **Gmail** → `mailto:yusufahmedyusuf321@gmail.com`
- Each option has its brand icon + label tooltip, opens in new tab.
- Closes on outside click / ESC.

### Admin panel (Lovable Cloud)

Enable Lovable Cloud for:
- **Auth**: email + password login (only Yusuf's account; no public signup UI).
- **Database**: tables for `projects`, `services`, `testimonials`, `profiles`, `user_roles`.
- **Storage**: bucket `portfolio-media` for project images and videos.

Admin features:
- Login at `/login`, redirects to `/admin`.
- Projects CRUD: title, slug, short description, long description (rich text/markdown), tags, cover image upload, gallery images, optional video URL or upload, featured flag, display order.
- Services CRUD: title, description, icon name, order.
- Testimonials CRUD: client name, role/company, quote, avatar, order.
- All admin routes gated behind `_authenticated` layout + `has_role(uid, 'admin')` check.

### Public sections detail

1. **Hero** — "Yusuf Ahmed · AI Automation Engineer" + tagline + CTA (View Work / Contact).
2. **About** — short bio + skills (n8n, Make, OpenAI, Zapier, custom GPTs, etc.).
3. **Projects grid** — cards with cover image, title, short description, tag chips. Click → detail page with full media + long description.
4. **Services** — list/cards of automations offered.
5. **Testimonials** — quote cards with avatar + name.
6. **Footer** — name, copyright, social links.

### Technical details

- **Database schema**:
  - `projects` (id, slug unique, title, short_description, long_description, cover_url, video_url, gallery jsonb, tags text[], featured bool, display_order int, created_at)
  - `services` (id, title, description, icon, display_order)
  - `testimonials` (id, name, role, quote, avatar_url, display_order)
  - `profiles` (id → auth.users, full_name, avatar_url)
  - `user_roles` (id, user_id, role app_role enum) + `has_role()` SECURITY DEFINER function
- **RLS**: public SELECT on projects/services/testimonials; admin-only INSERT/UPDATE/DELETE via `has_role(auth.uid(), 'admin')`.
- **Storage**: `portfolio-media` bucket — public read, admin write.
- **Data fetching**: `createServerFn` for admin writes; browser `supabase` client for public reads via TanStack Query.
- **Validation**: Zod schemas on all admin forms.
- **Design tokens**: extend `src/styles.css` with refined light palette (background, surface, foreground, muted, accent) — all oklch.
- **Components**: shadcn (already available) — Card, Button, Dialog, Form, Input, Textarea, Tabs, Sheet for mobile nav.
- **SEO**: per-route `head()` meta + JSON-LD Person schema on home + Project schema on detail pages.
- **First admin user**: after Cloud is enabled, you sign up once via `/login`, then I'll insert an `admin` role row for your user_id.

### Build order

1. Enable Lovable Cloud + create schema, RLS, storage bucket.
2. Define design tokens + base layout (root header, footer, floating contact button).
3. Public pages (Home, Projects list, Project detail, Services, About, Testimonials) with sample seed data.
4. Auth (login page + `_authenticated` guard).
5. Admin pages (Projects, Services, Testimonials CRUD with media upload).
6. SEO meta + polish + responsive QA.
