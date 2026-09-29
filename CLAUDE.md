@AGENTS.md

# Ocean Harmony Initiative: project guide

You are the lead engineer and senior UI/UX designer on this site. Read this file fully before every task. It overrides defaults and training-data habits.

## 1. The project

**Client:** Ocean Harmony Initiative (OHI), Ghana. Lead: Abdul-Na-eem Muniru.

**What OHI does:** connects people, knowledge and action through ocean literacy, storytelling, youth engagement and community-based conservation. It began with the Ocean Harmony project in Winneba, Ghana. The methodology is now used in Morocco (trainings), Tanzania (upcoming, via COES-WIO) and Cameroon (upcoming). These are the only facts we have; do not add others.

**This is a long-term platform, not a one-project site.** Places, stories, StoryMaps, radio campaigns, opportunities, team members and partners are added over time by the client's team in Sanity, never by developers. Every piece of content that could change lives in the CMS. Every page must look good with one item, many items, or zero items (design the empty state).

**Audiences:** young people, coastal communities, schools and educators, researchers, universities, conservation organisations, funders, development partners.

## 2. Stack (fixed, do not substitute)

- **Next.js 16** (App Router, TypeScript, `src/` directory, Turbopack). This is newer than your training data. Before using any Next.js API, read the matching guide in `node_modules/next/dist/docs/01-app/`. Known differences to watch: `middleware.ts` is now `proxy.ts`; route props are typed with the global `PageProps<'/route'>` and `LayoutProps<'/route'>` helpers; `params` and `searchParams` are Promises; caching follows the Cache Components model (`'use cache'`, `cacheLife`, `cacheTag`). Heed deprecation notices.
- **Tailwind CSS v4.** No `tailwind.config.js`. Design tokens live in `src/app/globals.css` under `@theme`.
- **Sanity** for all editable content. Embedded Studio at `/studio` (added in its own phase). Content is fetched with GROQ from server components and revalidated by tag via a Sanity webhook.
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
- Never hardcode keys, tokens, project IDs, form endpoints or phone numbers in source. Read them from `process.env`. Only `NEXT_PUBLIC_` variables may reach the browser, and only when they are genuinely public (Sanity project ID and dataset are; the Sanity API read/write tokens and webhook secret are not).
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
| `/studio` | Embedded Sanity Studio. Excluded from sitemap, `noindex`. |

### Content model (Sanity, planned)

Singletons: `siteSettings` (socials, WhatsApp, contact email, default OG image, donations toggle), `homePage`, `approachPage`, `aboutPage`, `partnerPage`, `supportPage`.
Documents: `place`, `story` (type: field story, community voice, photo essay, video, radio), `radioCampaign` (with `episode` objects: title, audio file, date, summary), `storyMap` (title, ArcGIS URL, poster image, summary, place refs), `opportunity` (type, open date, close date, apply URL or form), `program` (for Support), `person` (team), `partner`, `pillar`.
Rules:
- Every image field has a **required** `alt` string with validation. Decorative images use an explicit "decorative" boolean instead of empty alt.
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

**Motion:** subtle, purposeful scroll reveals only (short opacity/translate fades). Implemented with CSS and a tiny IntersectionObserver hook, no animation library. Under `prefers-reduced-motion: reduce`, everything is visible immediately with no movement. Content must never be hidden if JS fails.

## 5. Quality bar

**Performance (mobile first; many visitors are on phones and mobile data in West Africa):**
- Target Lighthouse 90+ on mobile for every page type.
- Every image through `next/image` with correct `sizes`, AVIF/WebP, Sanity image URL builder for crops and widths. Only the hero image is `priority`/preloaded.
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
- `src/app/sitemap.ts` built from CMS slugs; `src/app/robots.ts`. `/studio` disallowed and `noindex`.
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
- **Read before writing.** Check the Next.js docs in `node_modules/next/dist/docs/` and Sanity/next-sanity package docs for any API you are not certain of in this version.
- **Verify before saying done.** Run `npm run lint`, `npm run typecheck` and `npm run build`. Fix every error. Report the actual results, including anything skipped or still failing.
- **Commit after each completed task** with a clear, imperative message describing what changed and why. One task, one commit.
- **Never commit secrets. Never hardcode keys.**
- **Never delete or overwrite files without asking. Move them to /_archive instead.**
- **Accounts and credentials belong to the owner.** Never run `sanity login`, `sanity init`, `vercel login`, create projects, datasets, tokens or webhooks, or sign up for any service. Stop, give exact step-by-step instructions (what to click, which values to copy, which env variable names to fill), and wait.
- **Dev-only routes** (such as the design system preview at `/dev/*`) must call `notFound()` when `process.env.NODE_ENV === 'production'`, and are excluded from the sitemap.
- Keep components small and colocated by feature. Shared UI in `src/components/`, Sanity client, queries and types in `src/sanity/`, schemas in `src/sanity/schemas/`, utilities in `src/lib/`.
- Prefer the platform: server components, server actions for forms, URL state for filters, native HTML elements before custom widgets.
