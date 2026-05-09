import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTestimonials, type Testimonial } from "@/lib/portfolio-queries";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia } from "@/lib/upload-media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/testimonials")({ component: Page });

function Page() {
  const { data: items = [], refetch } = useTestimonials();
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);

  async function save() {
    if (!editing?.name || !editing?.quote) return toast.error("Name and quote required");
    const payload = {
      name: editing.name,
      role: editing.role ?? "",
      quote: editing.quote,
      avatar_url: editing.avatar_url ?? null,
      display_order: editing.display_order ?? 0,
    };
    const { error } = editing.id
      ? await supabase.from("testimonials").update(payload).eq("id", editing.id)
      : await supabase.from("testimonials").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    refetch();
  }

  async function remove(id: string) {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) return toast.error(error.message);
    refetch();
  }

  async function onAvatar(file: File) {
    if (!editing) return;
    try {
      const url = await uploadMedia(file, "avatars");
      setEditing({ ...editing, avatar_url: url });
    } catch (e: any) { toast.error(e.message); }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Testimonials</h1>
        <Button onClick={() => setEditing({ name: "", role: "", quote: "", display_order: items.length })}>
          <Plus className="mr-2 h-4 w-4" />New testimonial
        </Button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {items.map((t) => (
          <div key={t.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <blockquote className="font-display text-base">"{t.quote}"</blockquote>
              <div className="flex">
                <Button size="icon" variant="ghost" onClick={() => setEditing(t)}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => remove(t.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">{t.name} · {t.role}</div>
          </div>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "Edit testimonial" : "New testimonial"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div><Label>Name</Label><Input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><Label>Role / Company</Label><Input value={editing.role ?? ""} onChange={(e) => setEditing({ ...editing, role: e.target.value })} /></div>
              <div><Label>Quote</Label><Textarea rows={4} value={editing.quote ?? ""} onChange={(e) => setEditing({ ...editing, quote: e.target.value })} /></div>
              <div>
                <Label>Avatar</Label>
                <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onAvatar(e.target.files[0])} />
                {editing.avatar_url && <img src={editing.avatar_url} alt="" className="mt-2 h-12 w-12 rounded-full object-cover" />}
              </div>
              <div><Label>Display order</Label><Input type="number" value={editing.display_order ?? 0} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} /></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
