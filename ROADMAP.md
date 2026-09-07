# ZambiTour — Action Plan

Reference docs: `BRD_Zambi_Tour.pdf` (2026-08-30) and the ZambiTour corporate
profile. RF-xxx below refers to the BRD's functional requirement IDs, kept
for traceability between this plan, the Prisma schema, and future code.

One sequenced list, MECE — each phase below has a crisp boundary with its
neighbours (stated explicitly where two phases could otherwise blur, like
Catalog CRUD vs. Reservations). Colour/logo/visual direction is yours to
drive (2026-09-07) — I hold off on that unless you point me at a specific
page; everything else below is mine to build unless you say otherwise.

A note on the BRD's own 15-day estimate (§15): that schedule assumes Payen
sandbox access, approved pricing rules, and business/finance availability
from day one — none of which exist yet. Treat the numbering below as
*sequencing*, not a calendar commitment.

---

### Phase 0 — Database — done
- Postgres + Prisma installed (`prisma@7.10.0`, current stable — deliberately
  *not* the `8.0.0-rc` prerelease that's floating around, since this is
  meant to be a stable base).
- Full data model in `prisma/schema.prisma`: destinations, flights, hotels,
  vehicles, packages, ancillary services (visa/insurance/guide/protocol),
  promo pricing, customers, reservations (with the exact RF-026 status
  list), reservation notes, payments, webhook idempotency ledger,
  reconciliation, FAQ entries, admin users/roles, audit log.
- First migration generated and **verified against a real local Postgres**
  (migrated, seeded, queried, then torn down) — not just schema-validated.
- `src/lib/prisma.ts` client singleton, `prisma/seed.ts` with sample
  catalog data (no fake admin accounts — see Phase 2).
- `.env.example` added; `npm run db:migrate` / `db:studio` / `db:seed`
  scripts added.

**What you need to do:** pick where Postgres actually lives — `npx prisma
dev` for a zero-config local instance while building, or **Prisma Postgres**
(`npx create-db`, or console.prisma.io) for a persistent one — that's the
convention across your other Prisma projects (jstore-website and elleza
both run on it via `db.prisma.io`; xclusivo is the outlier on a
self-managed VPS). Needs zero code changes here — the driver-adapter setup
in `src/lib/prisma.ts` already matches Prisma Postgres's standard Node.js
connection path exactly. Put the connection string in `.env`.

### Phase 1 — Admin & Auth backoffice — done (RF-016, §9, §9.1)
Staff identity and the shell everything else in the backoffice hangs off.
- NextAuth v4 + CredentialsProvider + bcryptjs + JWT sessions (`src/lib/auth.ts`),
  matching the pattern from xclusivo/jstore-website/elleza exactly — see
  memory `user-stack-preference`. The 5 roles from §9.1 live on `AdminUser.role`.
- `src/proxy.ts` extended (not replaced — still handles locale redirects)
  with JWT-based gating on `/admin/*`, plus rate limiting on the login
  endpoint specifically (10 attempts / 15 min per IP).
- Every route/action re-checks the session independently of proxy.ts
  (`src/lib/require-permission.ts`) — Server Actions can bypass a proxy
  matcher entirely, so proxy alone was never sufficient.
- `/admin` route tree (`src/app/admin/`) with role-filtered nav, its own
  root layout (Next's "multiple root layouts" pattern — no changes to the
  public site's `[lang]/layout.tsx`), login page, dashboard placeholder.
- `npm run admin:bootstrap` creates the first Administrator from `.env`
  (`BOOTSTRAP_ADMIN_*`) — no self-service sign-up exists anywhere, matching
  the BRD (an Administrator creates every other account).
- Audit log wired for login/logout (`src/lib/audit.ts`); catalog/reservation
  mutation logging arrives with those features in Phases 2/3.
- **Verified live**, not just built: real Postgres instance, real HTTP
  requests — confirmed unauthenticated redirect, wrong-password rejection,
  correct-password session issuance, role-filtered nav for both an
  Administrator (all 5 modules visible) and a Booking Agent (only
  Painel + Reservas visible), and the rate limiter tripping at exactly
  the 11th attempt as configured.
- **In scope:** who can log in, what they're allowed to touch, and proving
  an action to an actor. **Not in scope:** any actual catalog or booking
  screens — those are Phases 2 and 3.

### Phase 2 — Catalog CRUD (RF-010–016) — done
Managing *what ZambiTour sells*. No customers, no bookings, no money.
- Admin screens for destinations, hotels, vehicles, packages, ancillary
  services, promo offers: create/edit, draft→review→approved→published
  workflow, PT/EN fields side by side.
- Public site switches from the hardcoded `pt.json`/`en.json` catalog
  content to reading from the database. UI copy (nav labels, static page
  text) stays in the JSON dictionaries — only the catalog *data* moves.
- **In scope:** everything an agent needs to define and publish a sellable
  item and its price. **Not in scope:** anything a customer does with that
  item once it's published — that's Phase 3.

**2026-09-07 decision:** the public site's "Tours" carousel and "Packages"
grid (both on `/destinations`) are two display treatments of one catalog
type, not two — both now source from `TravelPackage`.

**Schema additions found while auditing every public page against the
schema** (all additive, migrated): `Destination.tagline{En,Pt}` (short
carousel line, distinct from the long description), `Hotel.stars` (int,
distinct from the free-text `category`), `Vehicle.type` (badge distinct
from `category`), `TravelPackage.theme` (new `PackageTheme` enum, was a
free-text "tag"), `PromoOffer.highlight{En,Pt}` + `PromoOffer.featured`
(replaces a raw CSS class name — `badgeClass` — that was being stored as
content; same fix applied to the ancillary-services "dark" flag, now
computed from card position instead of stored).

**Progress on connecting the public site to the database** (per-type: admin
CRUD + the public page reading real rows, not deferred to the end):
- **Destinations** — `DestinationService`, REST API, admin screen at
  `/admin/catalogo/destinos`. `/destinations` page now reads published
  rows (section hidden entirely when there are none). Verified live:
  full CRUD + status workflow + audit log + the public page rendering a
  real published destination in both locales, then correctly disappearing
  once unpublished/deleted.
- **Hotels** — same pattern, admin screen at `/admin/catalogo/hoteis`
  (with a destination picker, since every hotel belongs to one). `/hotels`
  page wired the same way. Verified live end-to-end including the
  destination relation resolving correctly on the public card.
- **Vehicles** — admin screen at `/admin/catalogo/viaturas`, no
  destination relation (a fleet isn't destination-scoped). `/cars` page
  wired the same way. Verified live.
- **Packages** (+ the merged Tours display) — admin screen at
  `/admin/catalogo/pacotes`, optional destination link, `theme` enum for
  the PRAIA/SAFARI/etc. badge. `/destinations` page's Tours carousel and
  Packages grid both now read the same published `TravelPackage` rows.
  Verified live that a single record renders correctly in both card
  designs simultaneously.
- **Ancillary Services** — admin screen at `/admin/catalogo/servicos`.
  `/about` page wired the same way; the light/dark card alternation is
  now computed from position instead of a stored per-item flag. Verified
  live.
- **Promo Fares** — admin screen at `/admin/catalogo/promocoes`. This
  one's structurally different: the homepage strip is inherently
  flight-route shaped, so the admin form creates a `FlightOffer` +
  `PromoOffer` pair together in one transaction, and delete/status also
  operate on the pair atomically. Scoped to flight-linked promos only —
  `PromoOffer` itself can link to any of six catalog types, but this is
  the only one with a public display today; a hotel/vehicle/package promo
  screen is a small follow-up if the site ever shows one. Verified live
  including the transaction rolling both rows in on create and cleaning
  both up on delete (checked directly against the database, zero orphan
  rows left behind).

**Every one of the six is now live end to end**: create in the admin
screen → draft→review→approved→published workflow → shows up on the
actual public page in both languages → disappears cleanly when archived
or deleted. Nothing on the public site's catalog sections is hardcoded
JSON any more — an empty catalog renders an empty (not broken) page,
exactly as asked.

**Two real bugs caught and fixed while building this, not just features
added:**
1. Both `/destinations` and `/hotels` were getting statically prerendered
   at build time — meaning a page reading live catalog data would have
   frozen at whatever was published during the last build, silently
   ignoring anything an admin published afterward. Both now force dynamic
   rendering; every subsequent catalog-reading page needs the same.
2. The Destinos and Hotéis admin screens briefly had no server-side
   permission check at all (the earlier placeholder page had one; it got
   dropped when the real screen replaced it). The underlying API was
   still protected, so this wasn't a data leak, but a wrong-role user
   could have loaded the page shell. Fixed by splitting every admin
   catalog screen into a server-component `page.tsx` (the permission gate)
   plus a `*-client.tsx` (the interactive form/list) — that split is now
   the required pattern for every remaining catalog screen.

### Phase 3 — Reservations (RF-020–027, §8.3)
Managing *what a customer does with the catalog* — a genuinely different
concern from Phase 2, not a variation of it: this is transactional/workflow
logic (a request moving through states), not content management.
- Wire the existing booking form (`booking.tsx`) to actually submit —
  right now `onSubmit` calls `preventDefault()` and does nothing.
- Server action / API route: validate, create `Customer` + `Reservation`,
  generate a human-facing reference, set status `RECEIVED`.
- Agent-side reservation queue in the backoffice: filter, notes, status
  transitions through the exact RF-026 state list, quote attachment.
- Freeze the quoted price on the reservation at quote time (RF-027) —
  schema already supports this (`quotedPrice`/`quotedCurrency`).
- **In scope:** a customer's request and its lifecycle to a quote.
  **Not in scope:** editing the catalog item itself (Phase 2), and
  collecting money for it (Phase 6 — a reservation can sit at
  "Cotação enviada" with nothing paid yet).

### Phase 4 — UI & new pages from the corporate profile
The site content/structure work — building the pages, not deciding the
palette or logo (that's yours). I build the sections and bilingual copy;
you keep driving colour/visual direction on top of them.
- About page: Mission / Vision / Values + the "Porquê a ZambiTour"
  six-differentiator block. Currently just a generic hero + description.
- Services section: corporate profile lists 8 services (flights, hotels,
  packages, insurance, car rental, visa/documentation, tour guide,
  protocol) vs. 4 generic ones on the site today — new copy in both
  `pt.json`/`en.json`, plus new icons or a redesigned grid.
- "Como Trabalhamos" 5-step process block, "Para Quem Trabalhamos" segment
  list — both in the corporate profile, neither on the site yet.
- Favicon/app icons: `src/app/favicon.ico` is still the Next.js default
  and `public/icons/` is empty — no ZambiTour tab icon exists yet.
- Social links are still placeholder `#` hrefs — need real URLs, or drop
  the ones that don't exist rather than link to nowhere.

### Phase 5 — FAQ bot (§11, RF-060–067)
- Needs Phase 2's content workflow (approved/published state) for its
  answer content, and benefits from Phase 4's pages existing to link back
  to — otherwise independent of Phases 3 and 6.
- Bot UI + backoffice FAQ management (`FaqEntry` table already modelled),
  handoff to WhatsApp/phone/email, logging of unanswered questions
  (`FaqUnanswered`, RF-065).
- Motor/engine choice (simple keyword match vs. an LLM-backed answer
  engine) is BRD decision D-06 — open.

### Phase 6 — Payments: Payen / M-Pesa / e-Mola (§10, RF-040–047)
Sequenced last on purpose: it's the phase blocked on an external party
(Payen sandbox access), so everything above it can proceed regardless of
how long that takes. Worth starting that access request now in parallel —
it's the longest lead time in the whole plan, independent of build order.
**Also blocked on BRD decisions D-01, D-02, D-03** (currency/conversion
rule, Payen sandbox credentials, what "confirmed" means) — business/
finance calls, not engineering ones.
- Payment intent creation against Payen, webhook receiver with the
  idempotency ledger (`WebhookEvent`, RF-044/T-08) already modelled.
- Exception handling per §10.3: timeout, duplicate, divergent amount,
  repeated webhook, abandonment, Payen downtime, wallet failure.
- Reconciliation screen for Finance: expected vs. received, divergence
  queue, export (RF-047).
- **In scope:** collecting and reconciling money against an existing
  reservation. **Not in scope:** anything about the reservation's own
  lifecycle — that's entirely Phase 3's concern, Payments only reacts to it.

### Phase 7 — Hardening & launch
- Testing against the BRD's own scenario list (§17.1, T-01…T-12).
- Observability/logging tied to reservation & payment references (NFR
  Observabilidade), backups, SEO pass, accessibility pass.

---

## Sequencing summary

```
Phase 0 done (database) → Phase 1 done (admin & auth) → Phase 2 done (catalog CRUD)
                                                       │
                                                       ▼
                                                 Phase 3 (reservations)
                                                       │
                                                       ▼
                                                 Phase 4 (UI & new pages)
                                                       │
                                                       ▼
                                                 Phase 5 (FAQ bot)
                                                       │
                                                       ▼
                                                 Phase 6 (payments) *
                                                       │
                                                       ▼
                                                 Phase 7 (hardening & launch)
```
\* Payen access-request should start now, in parallel, regardless of where
build order is — it's not gated on any other phase, only on an external
party responding.

## What's next
Phase 2 (catalog CRUD) is done — all six catalog types have real admin
screens and the public site reads every one of them live from the
database. Phase 3 (reservations) is next: wiring the booking form to
actually submit, and the agent-side reservation queue.

**2026-09-07 — demo content:** the catalog is now populated with realistic
showcase data for client presentation — 8 destinations, 12 hotels, 6
vehicles, 8 packages, 5 services, 5 promo fares, all real place/hotel/
airline names with market-realistic pricing, generated via `ChatGPT` and
injected through `scripts/seed-demo-content.mjs` (goes through the same
admin API + publish workflow as a human agent would, not a raw DB write —
see that file's header comment). Content source: `scripts/demo-content.json`.
Re-runnable per catalog type with `--section=<name>` if the database ever
gets reset.

**2026-09-07 — loading states:** every catalog-reading section (all five
public pages) now streams independently behind a `<Suspense>` boundary
with an animated skeleton fallback (`components/ui/skeleton.tsx`) —
the static hero/header renders instantly, only the part actually waiting
on the database shows the shimmer, and it's replaced by the real content
the moment the query resolves. Language switcher now shows real South
Africa / Mozambique flag images (via flagcdn.com) instead of emoji flags
— matches "no emoji" while giving English the region's actual market
(South Africa) instead of the UK.

Three known follow-ups, not blocking:
- `Utilizadores` (staff account management) is still a placeholder —
  the only way to create an account is `admin:bootstrap`, which only
  makes Administrators. Deferred at your call (2026-09-07).
- `TravelPackage.inclusions`/`exclusions` are single-language in the
  schema (not `fooEn`/`fooPt` like every other field) — the same
  checklist shows in both locales until that's split out.
- `FlightOffer.destinationLabel` is likewise single-language — the demo
  data surfaced this concretely: the Portuguese homepage shows
  "Johannesburg"/"Lisbon" instead of "Joanesburgo"/"Lisboa", since the
  promo-fares admin form only collects one destination name, not a PT/EN
  pair like every other catalog type.
