-- Ocean Harmony Initiative: storage buckets.
-- Run after 0002. Files are public to read by URL; only admins can upload, replace or remove them.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('media', 'media', true, 5242880,
    array['image/webp', 'image/jpeg', 'image/png', 'image/avif']),
  ('audio', 'audio', true, 15728640,
    array['audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/aac', 'audio/ogg', 'audio/wav', 'audio/webm'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "media and audio: admin list"
  on storage.objects for select
  to authenticated
  using (bucket_id in ('media', 'audio') and (select private.is_admin()));

create policy "media and audio: admin upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id in ('media', 'audio') and (select private.is_admin()));

create policy "media and audio: admin update"
  on storage.objects for update
  to authenticated
  using (bucket_id in ('media', 'audio') and (select private.is_admin()))
  with check (bucket_id in ('media', 'audio') and (select private.is_admin()));

create policy "media and audio: admin delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id in ('media', 'audio') and (select private.is_admin()));
