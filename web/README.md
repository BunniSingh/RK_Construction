# R.K. Constructions — Portfolio Site

## Local development
1. Copy `.env.example` to `.env.local` and fill in the Sanity project ID,
   dataset, write token, Resend API key, and contact destination email.
2. `npm install`
3. `npm run dev` — site at http://localhost:3000, CMS at http://localhost:3000/studio
4. `npm test` — run the test suite
5. `npm run seed` — one-time: populate Sanity with initial content and the
   curated ETP project photography (requires `SANITY_API_WRITE_TOKEN`)

## Editing content
Non-technical staff log into `/studio` with their Sanity account (Google or
email magic link) and edit Projects, Clients, Services, Gallery Images, and
Site Settings directly — changes go live within a minute (ISR revalidates
every 60 seconds).

## Deployment
1. Push this repo to GitHub.
2. Import it in Vercel, set the project root to `web/`.
3. Add the same environment variables from `.env.local` in the Vercel
   project settings.
4. Deploy. Point your purchased domain at the Vercel deployment (spec §7,
   §10 — domain not yet purchased as of this plan).
