-- RLS self-test. Paste into the Supabase SQL editor and run (confirm the warning dialog).
-- It always ends in an error that carries the results, which rolls back every change it made.
-- Expected: tables without RLS 0, anon sees drafts 0, every insert/upload blocked, update/delete rows 0,
-- anon reads home 1, non-admin sees drafts 0.
-- Last run 2026-11-12: all checks passed (39 public policies, 4 storage policies, 2 buckets).
do $$
declare r text := ''; n int;
begin
  select count(*) into n from pg_policies where schemaname = 'public'; r := r || 'public policies: ' || n || '; ';
  select count(*) into n from pg_policies where schemaname = 'storage' and policyname like 'media and audio%'; r := r || 'storage policies: ' || n || '; ';
  select count(*) into n from storage.buckets where id in ('media','audio'); r := r || 'buckets: ' || n || '; ';
  select count(*) into n from pg_tables where schemaname = 'public' and not rowsecurity; r := r || 'tables without RLS: ' || n || '; ';
  insert into public.places (slug, name, status) values ('rls-test', 'RLS test', 'draft');
  set local role anon;
  select count(*) into n from public.places; r := r || 'anon sees drafts: ' || n || '; ';
  begin insert into public.places (slug, name) values ('anon-x', 'x'); r := r || 'anon insert: ALLOWED; ';
  exception when others then r := r || 'anon insert: blocked; '; end;
  update public.home set hero_intro = 'x'; get diagnostics n = row_count; r := r || 'anon update rows: ' || n || '; ';
  delete from public.places; get diagnostics n = row_count; r := r || 'anon delete rows: ' || n || '; ';
  begin insert into storage.objects (bucket_id, name) values ('media', 'x.webp'); r := r || 'anon upload: ALLOWED; ';
  exception when others then r := r || 'anon upload: blocked; '; end;
  select count(*) into n from public.home; r := r || 'anon reads home: ' || n || '; ';
  set local role authenticated;
  select count(*) into n from public.places; r := r || 'non-admin sees drafts: ' || n || '; ';
  begin insert into public.places (slug, name) values ('auth-x', 'x'); r := r || 'non-admin insert: ALLOWED; ';
  exception when others then r := r || 'non-admin insert: blocked; '; end;
  reset role;
  raise exception 'RLS CHECK => %', r;
end;
$$;
