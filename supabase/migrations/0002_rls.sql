-- Ocean Harmony Initiative: row level security.
-- Run after 0001. Anyone can read published rows; only users listed in public.admins can write.
-- The site only ever holds the publishable key, so these policies are the whole security model.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

-- True when the signed-in user is listed in public.admins.
-- security definer so the check works even though admins is locked down by its own RLS.
create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins a where a.user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;

-- Admins: a user may see only their own row (used by /admin to confirm access). No API writes.

alter table public.admins enable row level security;

create policy "admins: read own row"
  on public.admins for select
  to authenticated
  using (user_id = (select auth.uid()));

-- Single-row tables: always public to read, admin-only to update. No insert or delete.

do $$
declare
  t text;
begin
  foreach t in array array['site_settings', 'home', 'approach']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy "%1$s: public read" on public.%1$I for select to anon, authenticated using (true)',
      t
    );
    execute format(
      'create policy "%1$s: admin update" on public.%1$I for update to authenticated
         using ((select private.is_admin())) with check ((select private.is_admin()))',
      t
    );
  end loop;
end;
$$;

-- Collections: published rows are public; admins see and write everything.

do $$
declare
  t text;
begin
  foreach t in array array[
    'places', 'stories', 'radio_campaigns', 'storymaps', 'opportunities',
    'partners', 'team_members', 'support_programs'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy "%1$s: read published or admin" on public.%1$I for select to anon, authenticated
         using (status = ''published'' or (select private.is_admin()))',
      t
    );
    execute format(
      'create policy "%1$s: admin insert" on public.%1$I for insert to authenticated
         with check ((select private.is_admin()))',
      t
    );
    execute format(
      'create policy "%1$s: admin update" on public.%1$I for update to authenticated
         using ((select private.is_admin())) with check ((select private.is_admin()))',
      t
    );
    execute format(
      'create policy "%1$s: admin delete" on public.%1$I for delete to authenticated
         using ((select private.is_admin()))',
      t
    );
  end loop;
end;
$$;
