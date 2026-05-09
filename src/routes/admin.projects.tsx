import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useProjects, type Project } from "@/lib/portfolio-queries";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia } from "@/lib/upload-media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, Star } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/projects")({
  component: AdminProjectsPage,
});

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function AdminProjectsPage() {
  const { data: projects = [], refetch } = useProjects();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [saving, setSaving] = useState(false);

  function newProject() {
    setEditing({ title: "", slug: "", short_description: "", long_description: "", tags: [], featured: false, display_order: projects.length, gallery: [] });
  }

  async function save() {
    if (!editing?.title) return toast.error("Title required");
    setSaving(true);
    try {
      const slug = editing.slug?.trim() || slugify(editing.title);
      const payload = {
        title: editing.title,
        slug,
        short_description: editing.short_description ?? "",
        long_description: editing.long_description ?? "",
        cover_url: editing.cover_url ?? null,
        video_url: editing.video_url ?? null,
        tags: editing.tags ?? [],
        gallery: editing.gallery ?? [],
        featured: editing.featured ?? false,
        display_order: editing.display_order ?? 0,
      };
      const { error } = editing.id
        ? await supabase.from("projects").update(payload).eq("id", editing.id)
        : await supabase.from("projects").insert(payload);
      if (error) throw error;
      toast.success("Saved");
      setEditing(null);
      await refetch();
      qc.invalidateQueries({ queryKey: ["projects"] });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    refetch();
  }

  async function onCoverUpload(file: File) {
    if (!editing) return;
    try {
      const url = await uploadMedia(file, "covers");
      setEditing({ ...editing, cover_url: url });
      toast.success("Image uploaded");
    } catch (e: any) { toast.error(e.message); }
  }

  async function onVideoUpload(file: File) {
    if (!editing) return;
    try {
      const url = await uploadMedia(file, "videos");
      setEditing({ ...editing, video_url: url });
      toast.success("Video uploaded");
    } catch (e: any) { toast.error(e.message); }
  }

  async function onGalleryUpload(file: File) {
    if (!editing) return;
    try {
      const url = await uploadMedia(file, "gallery");
      const gallery = [...((editing.gallery as string[]) ?? []), url];
      setEditing({ ...editing, gallery });
    } catch (e: any) { toast.error(e.message); }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Projects</h1>
          <p className="text-muted-foreground">Add and manage your AI automation case studies.</p>
        </div>
        <Button onClick={newProject}><Plus className="mr-2 h-4 w-4" />New project</Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.slug}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.display_order}</td>
                <td className="px-4 py-3">{p.featured && <Star className="h-4 w-4 fill-current text-primary" />}</td>
                <td className="px-4 py-3 text-right">
                  <Button size="icon" variant="ghost" onClick={() => setEditing(p)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No projects yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit project" : "New project"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Title</Label>
                  <Input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: editing.slug || slugify(e.target.value) })} />
                </div>
                <div>
                  <Label>Slug</Label>
                  <Input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} />
                </div>
              </div>

              <div>
                <Label>Short description</Label>
                <Textarea rows={2} value={editing.short_description ?? ""} onChange={(e) => setEditing({ ...editing, short_description: e.target.value })} />
              </div>
              <div>
                <Label>Long description</Label>
                <Textarea rows={6} value={editing.long_description ?? ""} onChange={(e) => setEditing({ ...editing, long_description: e.target.value })} />
              </div>

              <div>
                <Label>Tags (comma-separated)</Label>
                <Input value={(editing.tags ?? []).join(", ")} onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Cover image</Label>
                  <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onCoverUpload(e.target.files[0])} />
                  {editing.cover_url && <img src={editing.cover_url} alt="" className="mt-2 h-24 rounded object-cover" />}
                  <Input className="mt-2" placeholder="or paste image URL" value={editing.cover_url ?? ""} onChange={(e) => setEditing({ ...editing, cover_url: e.target.value })} />
                </div>
                <div>
                  <Label>Video (optional)</Label>
                  <Input type="file" accept="video/*" onChange={(e) => e.target.files?.[0] && onVideoUpload(e.target.files[0])} />
                  <Input className="mt-2" placeholder="or paste video URL" value={editing.video_url ?? ""} onChange={(e) => setEditing({ ...editing, video_url: e.target.value })} />
                </div>
              </div>

              <div>
                <Label>Gallery</Label>
                <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onGalleryUpload(e.target.files[0])} />
                {((editing.gallery as string[]) ?? []).length > 0 && (
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {((editing.gallery as string[]) ?? []).map((url, i) => (
                      <div key={i} className="relative">
                        <img src={url} alt="" className="h-16 w-full rounded object-cover" />
                        <button onClick={() => setEditing({ ...editing, gallery: (editing.gallery as string[]).filter((_, idx) => idx !== i) })}
                          className="absolute right-0 top-0 rounded-bl bg-destructive px-1 text-xs text-destructive-foreground">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <Label>Display order</Label>
                  <Input type="number" value={editing.display_order ?? 0} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} />
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={!!editing.featured} onCheckedChange={(v) => setEditing({ ...editing, featured: v })} />
                  <Label>Featured</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
