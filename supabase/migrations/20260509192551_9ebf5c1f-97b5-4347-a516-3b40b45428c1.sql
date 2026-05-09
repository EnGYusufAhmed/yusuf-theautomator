
ALTER FUNCTION public.set_updated_at() SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.has_role(UUID, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

-- Replace overly broad public listing on bucket; objects are still publicly downloadable via direct URL
DROP POLICY IF EXISTS "Portfolio media public read" ON storage.objects;
CREATE POLICY "Portfolio media admin list" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'portfolio-media' AND public.has_role(auth.uid(),'admin'));
