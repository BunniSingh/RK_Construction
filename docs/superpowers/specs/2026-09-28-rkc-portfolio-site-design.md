# R.K. Constructions — Portfolio Website Design Spec

Date: 2026-09-28
Status: Approved (visual design confirmed via mockup; ready for implementation planning)

## 1. Goal

Build a B2B-facing portfolio/brochure website for R.K. Constructions (RKC), an
industrial construction company in Raigarh, Chhattisgarh, so it can win new
contracts from steel plants, power plants and similar industrial clients.
Primary audience: procurement/project decision-makers at companies like
Jindal Steel & Power, JSW Steel, NTPC. Secondary benefit: general online
credibility for partners, banks, and other stakeholders.

Success criteria: a visitor can, within a minute, understand RKC's scale
(workforce, machinery, annual project value), see relevant past projects for
their industry, see recognizable existing clients, and submit an inquiry.

## 2. Content Source

All copy is sourced from `doc/RKC Profile UPDATED.pdf` (company profile).
Real site photos, the logo, and turnover chart data are **not yet available**
— see Section 6 (Placeholder Imagery).

## 3. Information Architecture

Single-page scrolling site (sections, not separate routes), matching the
approved mockup:

1. **Hero** — headline, subhead, CTA (Request a Proposal / View Projects),
   stat readout (years in operation, annual project value, workforce,
   engineering staff)
2. **Overview** — company description + fact panel (HQ, workforce, machinery,
   annual project value)
3. **Mission & Vision**
4. **Core Values** — Excellence, Integrity, Safety, Planning & Deliverables
5. **Services** — 12 service categories drawn from the profile
6. **Projects** — 6 named projects (client, location, category, photo)
7. **Clients** — 5 key clients (name, location)
8. **Site Gallery** — photo grid (6 placeholder slots initially)
9. **Contact** — address, phone, email, inquiry form

## 4. Content Model (Sanity schemas)

Non-technical RKC staff edit content through Sanity Studio (hosted, free
tier). Schemas:

- **`project`**: title, client, location, category, description, photo
  (optional image), order/year
- **`client`**: name, location, logo (optional image)
- **`service`**: name, short description, order
- **`galleryImage`**: image, caption
- **`siteSettings`** (singleton): mission, vision, workforce count,
  engineering staff count, machinery list, annual project value, address,
  phone, email

Every image field is **optional** — see Section 6.

## 5. Visual Design System

Carried over from the approved mockup ("engineering drawing set" concept):

- **Palette**: steel/concrete neutrals with a single safety-orange accent
  (`--accent`). Full light and dark token sets already defined.
- **Type**: Big Shoulders Display (headings), Archivo (body), IBM Plex Mono
  (stats, labels, data)
- **Motifs**: numbered "sheet" section labels, drawing-title-block footer,
  spec-sheet-style cards, cross-hatch placeholder plates for pending photos
- **Motion**: scroll-triggered reveal (staggered per section), hero stat
  count-up on load, hover lift + shadow on cards, animated nav underline,
  scroll progress bar, theme-toggle icon cross-fade. All motion respects
  `prefers-reduced-motion`.
- **Theme**: light and dark palettes both fully designed. **Default theme is
  dark** (new decision — overrides plain system-preference default). A
  visible toggle lets visitors switch; their explicit choice is remembered
  (`localStorage`) and takes precedence over the dark default on return
  visits.

## 6. Placeholder Imagery (no real photos yet)

Until RKC supplies real photography, every image slot (project photo, client
logo, gallery image) that has no uploaded Sanity asset renders the existing
**hatch-pattern "photo pending" plate** component from the mockup (cross-hatch
fill, corner registration marks, mono caption) instead of stock/dummy photos.
This is implemented as a genuine fallback in the image component — not
seeded fake data — so:

- The mockup's visual language carries straight into the real site.
- The moment staff upload a real photo in Sanity Studio, it replaces the
  placeholder automatically, with no code change.
- No risk of a placeholder stock photo being mistaken for a real project
  photo later.

## 7. Tech Architecture

- **Frontend**: Next.js (App Router), statically generated where possible,
  deployed on Vercel (free tier).
- **CMS**: Sanity (hosted Studio + API), free tier. Images served via
  Sanity's CDN with automatic optimization once uploaded.
- **Contact form**: posts to a Vercel serverless function that emails the
  inquiry to RKC's address — no database needed for leads.
- **Domain**: to be purchased separately (not yet owned) and pointed at
  Vercel.

## 8. Non-Functional Requirements

- Responsive down to ~360px width; no horizontal scroll.
- Keyboard-focusable interactive elements with visible focus states.
- Lighthouse pass (performance + accessibility) before launch.
- Contact form delivers a real email end-to-end before launch.

## 9. Out of Scope (this iteration)

- Multi-language support
- Project filtering/search UI
- Client testimonials
- Certifications section (none supplied in source material)
- Turnover chart visualization (source data is an image in the PDF, not
  numbers per year — revisit if RKC provides real figures)

## 10. Open Items (need RKC input before/at launch)

- Real project/site photos, company logo, and client logos (staff will
  upload directly into Sanity Studio once available)
- Domain name choice and purchase
- Destination email address for contact-form leads (currently assumed to be
  `raju2021rgh@gmail.com` from the profile PDF)
