-- Ocean Harmony Initiative: content tables.
-- Paste into the Supabase SQL editor and run once, before 0002 and 0003.
--
-- Conventions
--   status        draft | published | archived. Only published rows reach the public site.
--   sort_order    lower numbers first. Editors drag to reorder in /admin.
--   images        jsonb: { "path", "alt", "width", "height", "caption", "credit" }.
--                 path is the object path inside the public "media" bucket.
--   rich text     jsonb: Tiptap JSON document. Rendered server-side through a node whitelist.
--   seo           jsonb: { "title", "description", "image" }.
--   repeatable    small nested lists (pillars, episodes, gallery, socials) are jsonb arrays
--                 edited as one document, so a single save is atomic.

create extension if not exists citext with schema extensions;

-- updated_at trigger -------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Admins -------------------------------------------------------------------

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.admins is 'Users allowed to edit content. Rows are added by hand in the SQL editor.';

-- Single-row tables ----------------------------------------------------------

create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  tagline text,
  contact_email text,
  whatsapp_number text,
  socials jsonb not null default '[]'::jsonb,
  footer_closing_line text,
  footer_accent_word text,
  donations_enabled boolean not null default false,
  donation_url text,
  default_og_image jsonb,
  updated_at timestamptz not null default now()
);

create table public.home (
  id smallint primary key default 1 check (id = 1),
  hero_image jsonb,
  hero_headline text,
  hero_accent_word text,
  hero_intro text,
  featured_storymap_id uuid,
  featured_story_ids uuid[] not null default '{}',
  seo jsonb,
  updated_at timestamptz not null default now()
);

create table public.approach (
  id smallint primary key default 1 check (id = 1),
  intro text,
  pillars jsonb not null default '[]'::jsonb,
  seo jsonb,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (1);
insert into public.home (id) values (1);
insert into public.approach (id) values (1);

-- Places ---------------------------------------------------------------------

create table public.places (
  id uuid primary key default gen_random_uuid(),
  slug citext not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  country text,
  summary text,
  hero_image jsonb,
  latitude double precision check (latitude between -90 and 90),
  longitude double precision check (longitude between -180 and 180),
  place_status text not null default 'active' check (place_status in ('active', 'upcoming', 'past')),
  body jsonb,
  seo jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Stories ----------------------------------------------------------------------

create table public.stories (
  id uuid primary key default gen_random_uuid(),
  slug citext not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  story_type text not null default 'field_story'
    check (story_type in ('field_story', 'community_voice', 'photo_essay', 'video')),
  place_id uuid references public.places (id) on delete set null,
  published_on date,
  author text,
  excerpt text,
  hero_image jsonb,
  body jsonb,
  video_url text check (video_url is null or video_url ~* '^https://(www\.)?(youtube\.com|youtu\.be|vimeo\.com)/'),
  gallery jsonb not null default '[]'::jsonb,
  seo jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index stories_place_id_idx on public.stories (place_id);

-- Radio campaigns --------------------------------------------------------------

create table public.radio_campaigns (
  id uuid primary key default gen_random_uuid(),
  slug citext not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  station text,
  place_id uuid references public.places (id) on delete set null,
  start_date date,
  end_date date,
  summary text,
  hero_image jsonb,
  gallery jsonb not null default '[]'::jsonb,
  topics text[] not null default '{}',
  -- [{ "title", "date", "audio_path" (in the audio bucket) or "audio_url", "duration", "summary" }]
  episodes jsonb not null default '[]'::jsonb,
  seo jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date is null or start_date is null or end_date >= start_date)
);

create index radio_campaigns_place_id_idx on public.radio_campaigns (place_id);

-- StoryMaps ----------------------------------------------------------------------

create table public.storymaps (
  id uuid primary key default gen_random_uuid(),
  slug citext not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  place_id uuid references public.places (id) on delete set null,
  summary text,
  poster_image jsonb,
  url text check (url is null or url ~* '^https://storymaps\.arcgis\.com/'),
  seo jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index storymaps_place_id_idx on public.storymaps (place_id);

alter table public.home
  add constraint home_featured_storymap_fk
  foreign key (featured_storymap_id) references public.storymaps (id) on delete set null;

create index home_featured_storymap_id_idx on public.home (featured_storymap_id);

-- Opportunities ----------------------------------------------------------------
-- Open, closing soon and closed are derived from the dates at render time, never stored.

create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  slug citext not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  opportunity_type text not null default 'volunteer'
    check (opportunity_type in ('volunteer', 'fellowship', 'internship', 'program')),
  place_id uuid references public.places (id) on delete set null,
  opens_on date,
  closes_on date,
  summary text,
  eligibility text,
  body jsonb,
  apply_url text check (apply_url is null or apply_url ~* '^https?://'),
  seo jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (closes_on is null or opens_on is null or closes_on >= opens_on)
);

create index opportunities_place_id_idx on public.opportunities (place_id);

-- Partners, team, support programs -------------------------------------------------

create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo jsonb,
  website text check (website is null or website ~* '^https?://'),
  partner_type text not null default 'other'
    check (partner_type in ('school', 'university', 'funder', 'ngo', 'community', 'government', 'other')),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  photo jsonb,
  bio text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.support_programs (
  id uuid primary key default gen_random_uuid(),
  slug citext not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  summary text,
  image jsonb,
  funds text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Triggers -----------------------------------------------------------------------

do $$
declare
  t text;
begin
  foreach t in array array[
    'site_settings', 'home', 'approach', 'places', 'stories', 'radio_campaigns',
    'storymaps', 'opportunities', 'partners', 'team_members', 'support_programs'
  ]
  loop
    execute format(
      'create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      t
    );
  end loop;
end;
$$;
