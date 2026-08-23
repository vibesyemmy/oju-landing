# Oju portfolio — Mobbin research

Source: Mobbin web sections/screens search, 2026-08-23.

## The core problem
Oju sells **two things** (design craft + software engineering). Most studio sites
prove only one. Design-led sites look pretty but read as "they can't ship";
dev-led sites list frameworks and read as "they have no taste". Every layout
choice below is judged on whether it carries both.

---

## 1. Hero

| Site | Pattern | Verdict for Oju |
|---|---|---|
| [basement.studio](https://mobbin.com/sites/sections/a3cf46f9-dafe-4cee-9fee-186aabb025aa) | Bold sans statement + client logo wall immediately below | **Best fit.** Claim then proof, in one screen. |
| [Studio Freight](https://mobbin.com/sites/sections/37214c10-d891-48bc-a46e-6050033671b4) | Giant serif fills the viewport, art-directed | Pure taste flex. Zero engineering signal. |
| [Büro](https://mobbin.com/sites/sections/42aaad97-8c45-41d3-be1e-c4b9b9654332) | Statement over B/W team photo | Humanising. Needs a real team photo. |

Note: [OFF+BRAND hero](https://mobbin.com/sites/sections/1c082bfd-e527-418c-af97-002e96fe42ca)
captured mid scroll-animation — mostly blank frame, judge on the live site.

**Recommendation:** basement.studio structure. Statement names both crafts —
e.g. *"We design and build the products people actually use."* Logo wall
underneath. If Oju has no client logos yet, swap for 3 project cards.

## 2. Work index

| Site | Pattern | Verdict for Oju |
|---|---|---|
| [Locomotive](https://mobbin.com/sites/sections/280c1a2d-41d4-4495-a4bd-816763c93ad3) | **Text-only list** — project / sector / city columns, no images | **Best fit for launch.** 6 projects looks deliberate, not thin. Images can't be inconsistent if there are none. |
| [Vucko](https://mobbin.com/sites/sections/ceab4ab4-d046-4356-bde4-32acd9781fa8) | Horizontal scroll strip, caption `Title (Client)` | Motion-showcase. Needs strong stills. |
| [Koto](https://mobbin.com/sites/sections/d820c5ae-eeff-4b27-bf9b-4f78df222c89) | Sidebar label + asymmetric mosaic | Needs 12+ great assets. |
| [MOUTHWASH](https://mobbin.com/sites/sections/9c2b6408-fce2-44db-9c0b-3def5bddba12) | Filter row *is* the headline; dense small thumbs | Nice discipline-filter idea — steal the interaction, not the density. |
| [basement.studio](https://mobbin.com/sites/sections/ada390ad-f606-421f-b096-c569f72a2146) | Uniform logo-card grid, count badge ("Showcase 25") | Volume play. Only works at scale. |

**Recommendation:** Locomotive list now → Koto/Vucko mosaic once there are
8+ projects with real art direction. Borrow MOUTHWASH's filter-as-headline
so one grid serves both Design and Product audiences.

## 3. Services / capabilities

| Site | Pattern | Verdict for Oju |
|---|---|---|
| [Raw Materials](https://mobbin.com/sites/sections/67c9761c-a201-45f1-910a-ca8faa50cb33) | 3 columns: **DESIGN / STRATEGY / TECHNOLOGY** | **Best fit — near-exact match for Oju's shape.** One glance proves both crafts. |
| [Büro](https://mobbin.com/sites/sections/bc636344-6e5b-4b98-9baa-809b622456fb) | 4 quadrants under one statement | Same idea, softer. |
| [Aino Agency](https://mobbin.com/sites/sections/9bd5d780-e303-4640-b68f-d0a9f9dc2862) | Capabilities as footer columns — UI/UX beside Frontend/Backend | Cheap win: capability list in the footer, on every page. |
| [Mother Design](https://mobbin.com/sites/sections/83653e9e-1c8a-4dbb-b9e2-103d731e662f) | Big type list, no descriptions | Confident. Design-only vocabulary. |
| [Koto](https://mobbin.com/sites/sections/968754c4-c525-4315-a823-07721be58b1b) | One service per screen, expanded | Deep but long. |
| [basement.studio](https://mobbin.com/sites/sections/46c7d616-63fa-43e1-9d92-a40549a89e16) | 4 cards, copy formula *"From X to Y, we do Z"* | **Steal the copy formula.** Concrete range beats adjectives. |

**Recommendation:** Raw Materials 3-column layout, filled with basement.studio's
sentence formula. Columns: `DESIGN` (UI/UX, brand, motion, design systems) ·
`PRODUCT` (discovery, strategy, roadmap) · `ENGINEERING` (web, mobile, APIs, infra).

## 4. Case study page

| Site | Pattern | Verdict for Oju |
|---|---|---|
| [Tailscale](https://mobbin.com/sites/sections/84f94fa1-216c-40e9-aa21-d4b6e8039f5b) | Outcome-framed title + sidebar meta (Company / Website / Industry) | **Best skeleton.** Add Role, Year, Team. |
| [Customer.io](https://mobbin.com/sites/sections/257b16f8-16a4-4371-ab8c-0959f41f56b8) | 3-up cards, metric burned onto the image | Best index-teaser format. |
| [Mixpanel](https://mobbin.com/sites/sections/e6f6cfe2-cf9e-4cb4-9f91-b71b6cea4651) | Single quantified impact statement + CTA | Good homepage proof block. |
| [Dropbox Paper](https://mobbin.com/sites/sections/c8b92330-0ff0-4c52-9d02-d7396c5b5b06) | "Key Results" checklist above the narrative | Results before story — correct order. |

Note: [Studio Freight case study](https://mobbin.com/sites/sections/04bc9268-6890-43e0-ae18-3eed6a91bb66)
also captured mid-animation, blank frame.

**Template:** Outcome headline → meta sidebar → key results → problem →
process (**show design artefacts AND architecture/shipping detail**) → outcome → next project.

The process section is where Oju's dual claim is won or lost. Wireframes only =
design shop. Include the build.

---

## Page skeleton

1. Hero — statement naming both crafts + logo wall / 3 featured projects
2. Selected work — Locomotive-style index, discipline filter
3. Capabilities — 3 columns (Design · Product · Engineering)
4. Proof — one quantified outcome (Mixpanel block)
5. About / team — Büro-style photo + statement
6. Contact — "Start a project"
7. Footer — full capability columns (Aino)

## Caveats
- Mobbin `search_screens` returned tool UIs (Webflow editor, Savee, Bolt.new), not
  agency sites. `search_sections` is the right tool for this — use it for follow-ups.
- Two results were blank scroll-animation frames; noted inline above.
- Everything here is layout research. Visual identity for Oju is a separate pass.
