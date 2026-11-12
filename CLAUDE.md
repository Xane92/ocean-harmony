@AGENTS.md

# Ocean Harmony Initiative: project guide

You are the lead engineer and senior UI/UX designer on this site. Read this file fully before every task. It overrides defaults and training-data habits.

## 1. The project

**Client:** Ocean Harmony Initiative (OHI), Ghana. Lead: Abdul-Na-eem Muniru.

**What OHI does:** connects people, knowledge and action through ocean literacy, storytelling, youth engagement and community-based conservation. It began with the Ocean Harmony project in Winneba, Ghana. The methodology is now used in Morocco (trainings), Tanzania (upcoming, via COES-WIO) and Cameroon (upcoming). These are the only facts we have; do not add others.

**This is a long-term platform, not a one-project site.** Places, stories, StoryMaps, radio campaigns, opportunities, team members and partners are added over time by the client's team in the custom admin at `/admin` (Supabase), never by developers. Every piece of content that could change lives in the CMS. Every page must look good with one item, many items, or zero items (design the empty state).

**Audiences:** young people, coastal communities, schools and educators, researchers, universities, conservation organisations, funders, development partners.

## 2. Stack (fixed, do not substitute)

- **Next.js 16** (App Router, TypeScript, `src/` directory, Turbopack). This is newer than your training data. Before using any Next.js API, read the matching guide in `node_modules/next/dist/docs/01-app/`. Known differences to watch: `middleware.ts` is now `proxy.ts`; route props are typed with the global `PageProps<'/route'>` and `LayoutProps<'/route'>` helpers; `params` and `searchParams` are Promises; caching follows the Cache Components model (`'use cache'`, `cacheLife`, `cacheTag`). Heed deprecation notices.
- **Tailwind CSS v4.** No `tailwind.config.js`. Design tokens live in `src/app/globals.css` under `@theme`.
- **Supabase** for all editable content, files and editor sign-in. Custom admin at `/admin` (config-driven, see section 8). Public pages read with the publishable key through `publicClient()` in `src/lib/supabase/public.ts`, cached and tagged per table; admin saves expire those tags. Sanity was retired on 2026-11-12; its code is in git history (commit ef22764) and in the untracked `/_archive/sanity`.
- **Deploy:** GitHub (`origin` = github.com/Xane92/ocean-harmony) to Vercel. Node.js runtime only; never `runtime = 'edge'`.
- **Single package.** No monorepo, no workspaces. `package-lock.json` is committed. Use `npm`, never pnpm or yarn.

### Scripts (must always exist in package.json)

| Script | Command |
| --- | --- |
| `dev` | `next dev` |
| `build` | `next build` |
| `start` | `next start` |
| `lint` | `eslint` |
| `typecheck` | `tsc --noEmit` |

### Environment variables

- `.env.example` lists every variable name the app reads, with no values and a one-line comment each. Add a variable there in the same commit that first reads it.
- `.gitignore` ignores `.env*`; it must keep an `!.env.example` exception.
- Never hardcode keys, tokens, project IDs, form endpoints or phone numbers in source. Read them from `process.env`. Only `NEXT_PUBLIC_` variables may reach the browser, and only when they are genuinely public (the Supabase URL and publishable key are; a Supabase secret or service-role key never enters this project).
- Never commit secrets. Check `git diff --staged` before every commit.

## 3. Information architecture

**Primary nav:** Approach, Places, Explore, Stories, Opportunities, About. One filled button: **Support**.
**Footer adds:** Partner With Us, Contact, Instagram, Facebook (URLs from CMS site settings).

| Route | Purpose |
| --- | --- |
| `/` | Home. One continuous story scroll: hero on real field photography, OHI in one line, the approach in brief, places strip, featured StoryMap, latest stories, open opportunities, Support and Partner CTAs. |
| `/approach` | The methodology as the flagship. Pillars: ocean literacy, storytelling, play-based learning, exploration, local and community knowledge, youth engagement. Shows where the approach has travelled (driven by Place documents). |
| `/places`, `/places/[slug]` | Index plus one page per place, Winneba first. Each place page pulls in its stories, StoryMaps, radio campaigns and partners by reference. |
| `/explore`, `/explore/[slug]` | ArcGIS StoryMaps embedded in-page, never linked out. See "StoryMap embeds" below. |
| `/stories`, `/stories/[slug]` | Field stories, community voices, photo essays, video, radio. Filter by type and by place (URL search params, so filtered views are shareable and work without JS). |
| `/stories/radio/[slug]` | Radio campaign detail: photos, audio player, episode list, summary of the conversations. |
| `/opportunities`, `/opportunities/[slug]` | Listings with type (volunteer, fellowship, internship, program) and status (open, closing soon, closed) computed from dates, with an apply link or form. |
| `/partner` | Pathways for organisations, schools, universities, funders and communities that want to collaborate or adapt the approach. Inquiry form. |
| `/support` | Ways to support specific programs. Inquiry form now. Reserve a clearly bounded slot (component + CMS toggle) for online donations, a later phase. |
| `/about` | Story, team, partners. |
| `/contact` | Contact form plus WhatsApp button (number from CMS/env). |
| `/admin` | Custom content admin (Supabase Auth, email and password). Excluded from sitemap, `noindex` (metadata and an `X-Robots-Tag` header from `src/proxy.ts`). |

### Content model (Supabase tables, see `supabase/migrations/`)

Single-row tables (id = 1): `site_settings`, `home`, `approach`.
Collections: `places`, `stories`, `radio_campaigns` (episodes as a jsonb list), `storymaps`, `opportunities`, `partners`, `team_members`, `support_programs`. Every collection row has `status` (draft, published, archived) and `sort_order`. Images are jsonb `{ path, alt, width, height, caption, credit }` pointing into the public `media` bucket; audio lives in the `audio` bucket. Small nested lists (pillars, episodes, gallery, socials) are jsonb arrays saved with their parent.
Rules:
- Every image has a **required** `alt` string, enforced by server-side validation in `src/admin/validate.ts`.
- Every document with a page has `slug` (required, unique) and an `seo` object (title, description, OG image), each falling back to sensible defaults.
- Relationships use references (a story references places), never duplicated text.
- Opportunity status is never stored; it is derived from dates at render time. "Closing soon" means the close date is within `CLOSING_SOON_DAYS` (14) days. That value lives as a single named constant in `src/lib/constants.ts`; never repeat the number elsewhere.

### StoryMap embeds

- Click-to-load facade: poster image (`next/image`), title, short summary, "Open map" button. The ArcGIS `<iframe>` is only mounted after the click. No iframe on first load, ever.
- Full-width, responsive (aspect ratio on desktop, taller on mobile), `title` attribute on the iframe, a fullscreen control (Fullscreen API with a graceful fallback), and a plain link to the StoryMap for no-JS and assistive tech users.
- Allowlist the ArcGIS StoryMaps origin in any CSP `frame-src`.

## 4. Design direction

**It must not feel like a generic NGO site.** Modern, visual, exploratory, editorial. People, communities, places and field knowledge at the centre. The reference is a well-made magazine, not a charity brochure. No stock-photo heroes with centred text over a blue gradient, no icon grids, no rounded card soup, no "impact counters" with invented numbers.

### System: Paper & Ink, adapted

**Palette** (defined once as `@theme` tokens; never use raw hex in components):

| Token | Value | Use |
| --- | --- | --- |
| `sand` | `#F5F1EA` | Page background. Text colour on dark sections and on Tide buttons. |
| `deep` | `#0B2530` | Body and headline text. Background of dark sections. |
| `tide` | `#276E69` | Accent on Sand only: eyebrow numbers, links, focus rings, buttons, accent rules. Accent only, never body copy. **Never used on Deep.** |
| `tide-light` | `#6FB8B0` | Accent inside Deep sections only (eyebrow numbers, links, focus rings). Never used on Sand. |
| `mist` | `#8A958F` | **Decorative only:** rules, icons, non-text marks. Never text. |
| `mist-ink` | `#5E6A64` | Secondary text on Sand: captions, metadata, labels, dates. |
| `rule` | `rgba(11,37,48,0.12)` | Hairline rules and dividers on Sand. On Deep, use `rule-deep` (Sand at 0.16). |

**Measured contrast (WCAG 2.x):**
- Deep on Sand: about 14:1.
- Tide on Sand, and Sand text on a Tide button: about 5.3:1. Passes AA at all text sizes.
- Mist-ink on Sand: about 5:1. Passes AA at all text sizes.
- Tide-light on Deep: about 6.9:1. Passes AA at all text sizes.
- Mist on Sand: about 2.8:1. Fails, which is why it is decorative only.
- Secondary text inside Deep sections uses Sand at reduced opacity (0.72 or higher, about 8:1), not Mist.

**Type** (Google Fonts via `next/font/google`, self-hosted, all four preloaded, `display: swap`, `latin` subset only). These are the only weights loaded; do not use any other weight or style in components, and do not add one without approval:

| Font | Weights / style | Use |
| --- | --- | --- |
| **Instrument Sans** | 500, 600 (normal) | 500: display and headlines. 600: nav, buttons, small headings. |
| **Instrument Serif** | 400 italic | Exactly one accent word per headline, never more, never body copy. |
| **JetBrains Mono** | 400 (normal) | Eyebrows, labels, metadata, dates, counts. Uppercase, tracked. |
| **Raleway** | 400, 600 (normal) | 400: body copy. 600: emphasis and strong text. Comfortable measure (about 60 to 72 characters), generous line height. |

No Raleway italic is loaded, so body emphasis uses weight 600. Latin only means characters such as Ɛ and Ɔ (used in Fante and Twi) render in a fallback font; if the client's copy needs them, add `latin-ext` (approval required).

**Signatures:**
- Mono eyebrow with a Tide number above each section headline (`01 / Approach`).
- One serif-italic accent word per headline.
- Thin rules instead of boxy cards. Lists of stories, places and opportunities are separated by hairlines, not shadows or rounded containers.
- Big numbers as anchors (section numbers, episode numbers, years). Only real numbers from the client; never invented statistics.
- Generous whitespace. Full-bleed field photography.
- Dark sections: Deep background, Sand text.

**Components** live in `src/components/ui/` (Container, Grid, Text, Eyebrow, Headline, Rule, Button, PhotoBlock, BigNumber, DeepSection, Reveal). Preview them at `/dev/system` in development. Use surface-aware colour utilities in components: `text-ink`, `text-muted`, `text-accent`, `bg-accent`, `text-on-accent`, `border-line`, `bg-surface`. They switch automatically inside `DeepSection`, which is how Tide stays off Deep. Use raw palette utilities (`text-tide`, `bg-deep`) only where a colour must not change with the surface.

**Motion:** subtle, purposeful scroll reveals only (short opacity/translate fades). Implemented with CSS and a tiny IntersectionObserver hook, no animation library. Under `prefers-reduced-motion: reduce`, everything is visible immediately with no movement. Content must never be hidden if JS fails.

## 5. Quality bar

**Performance (mobile first; many visitors are on phones and mobile data in West Africa):**
- Target Lighthouse 90+ on mobile for every page type.
- Every image through `next/image` with correct `sizes`, AVIF/WebP; uploads are already resized in the browser (see section 8). Only the hero image is `priority`/preloaded.
- Server components by default. `'use client'` only on the smallest interactive leaf (menu toggle, StoryMap facade, audio player, filters). No heavy client libraries; justify any new dependency in the plan.
- No third-party scripts on first load. Embeds (ArcGIS, video, audio) load on interaction.

**Accessibility (WCAG 2.2 AA):**
- Semantic HTML: one `h1` per page, landmark elements, real `<button>` and `<a>`, lists as lists.
- Full keyboard navigation, skip-to-content link, visible focus states (Tide ring with offset on Sand, Tide-light ring in Deep sections, never `outline: none` without a replacement).
- Alt text required on every CMS image field (enforced in schema validation).
- Forms: visible labels, error messages tied with `aria-describedby`, success and failure announced.
- Mobile nav is a proper disclosure with focus management and Escape to close.

**SEO:**
- `generateMetadata` on every route, fed by the document's `seo` object with fallbacks.
- Open Graph images per page (CMS image, or generated with `opengraph-image.tsx` using the brand type).
- `src/app/sitemap.ts` built from CMS slugs; `src/app/robots.ts`. `/admin` disallowed and `noindex`.
- Canonical URLs from a `NEXT_PUBLIC_SITE_URL` env variable.

## 6. Copy rules

Apply to UI strings, placeholder copy, alt text examples, metadata, commit messages and this file.

- **Never use em dashes.** Use commas, semicolons, colons or periods.
- Voice: warm, grounded, specific to real places and people.
- Banned: NGO cliches such as "make a difference", "empowering communities", "together we can", "change lives", "join the movement". No rule-of-three lists as a tic. No "not X but Y" constructions.
- Where real content is missing, use placeholder copy marked clearly as `[PLACEHOLDER]`, for example `[PLACEHOLDER: one-line description of the Winneba project]`.
- **Never invent facts, numbers, names, quotes, dates or partners.** Placeholder people, partners and stats are marked `[PLACEHOLDER]` and never styled to look real.

## 7. Working rules

- **Plan first.** Any task touching more than 3 files: show the plan (files, what changes, new dependencies) and wait for approval before writing code.
- **Read before writing.** Check the Next.js docs in `node_modules/next/dist/docs/` and the `@supabase/ssr` README for any API you are not certain of in this version.
- **Verify before saying done.** Run `npm run lint`, `npm run typecheck` and `npm run build`. Fix every error. Report the actual results, including anything skipped or still failing.
- **Commit after each completed task** with a clear, imperative message describing what changed and why. One task, one commit.
- **Never commit secrets. Never hardcode keys.**
- **Never delete or overwrite files without asking. Move them to /_archive instead.**
- **Accounts and credentials belong to the owner.** Never run `supabase login`, `vercel login`, create projects, keys, tokens, users or webhooks, or sign up for any service. Stop, give exact step-by-step instructions (what to click, which values to copy, which env variable names to fill), and wait.
- **Dev-only routes** (such as the design system preview at `/dev/*`) must call `notFound()` when `process.env.NODE_ENV === 'production'`, and are excluded from the sitemap.
- Keep components small and colocated by feature. Shared UI in `src/components/`, Supabase clients and row types in `src/lib/supabase/`, the admin in `src/admin/` (schema, validation, actions, components), SQL in `supabase/`, utilities in `src/lib/`.
- Prefer the platform: server components, server actions for forms, URL state for filters, native HTML elements before custom widgets.

## 8. Supabase and the admin

**Security model.** The site only holds the publishable key. Row level security is the whole gate:
- Collections: anyone may `select` rows where `status = 'published'`; `private.is_admin()` users may read everything and insert, update, delete.
- Single-row tables: public read, admin update, no insert or delete.
- Storage: buckets `media` (5MB, images only) and `audio` (15MB) are public to read by URL; only admins upload, replace or delete.
- `private.is_admin()` is `security definer` and checks `public.admins` for `auth.uid()`. Admins are added by hand in the SQL editor; there is no sign-up path.
- `supabase/tests/rls_check.sql` proves it (anon and non-admin cannot write or see drafts). Run it after any policy change.

**Schema changes.** Write a new numbered file in `supabase/migrations/`, apply it in the SQL editor, update `src/lib/supabase/types.ts` and the matching config in `src/admin/schema.ts`. Never edit an applied migration.

**Admin rules.**
- Config-driven: `src/admin/schema.ts` holds one plain-data config per content type over one field registry (`src/admin/components/Fields.tsx`). Add a field there, not a new form.
- Every save goes through `validateDocument` on the server. The client form is a convenience, never the gate.
- Saves never publish. Status changes are separate actions; archive instead of delete.
- `src/admin/revalidate.ts` is the only place that decides what refreshes after a save.
- Images are compressed in the browser (WebP, long edge `UPLOAD_IMAGE_MAX_EDGE`) before upload. Long recordings use a link field, not an upload.

**Rich text** is stored as Tiptap JSON and rendered by `src/components/rich-text/RichText.tsx`, which whitelists node and mark types, renders text as React text and allows only http, https and mailto links. Never render stored content with `dangerouslySetInnerHTML`.

**Fallbacks.** Public loaders (`src/content/*.ts`) fall back to local content when a table is empty and when a query errors, so a paused or unreachable database never breaks a page.

**Keep-alive.** Free Supabase projects pause after 7 days without activity. `vercel.json` runs a daily cron to `/api/keepalive` (one tiny read). If `CRON_SECRET` is set on Vercel, the route only accepts Vercel's cron.
