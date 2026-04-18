# Deploy AssociateVoiceMatters

Two paths. Pick one.

## Path A — Local dev (fastest to visuals)

Prerequisites: Node 20+, a Postgres URL (Neon / Supabase / Railway / Docker / local).

```bash
# 1. Install
npm install

# 2. Seed secrets into .env.local
cp .env.example .env.local
npm run secrets >> .env.local   # appends NEXTAUTH_SECRET, IDENTITY_ENCRYPTION_KEY, IDENTITY_HASH_PEPPER

# 3. Edit .env.local and fill in DATABASE_URL + DIRECT_URL (same value is fine for now)
#    Optional but recommended for email magic-link auth:
#      EMAIL_SERVER_HOST / PORT / USER / PASSWORD, EMAIL_FROM
#    Optional for AI moderator:
#      ANTHROPIC_API_KEY

# 4. Create tables + seed demo data so bars aren't empty
npm run db:push
npm run db:seed

# 5. Run
npm run dev
# → http://localhost:3000
# → http://localhost:3000/home-health
# → http://localhost:3000/home-hospice
```

You should see animated bars populated by ~50 simulated ballots across the
two verticals. Your own visits update the counts live.

## Path B — Vercel + Neon (production-ready)

1. **Neon** (free tier works). Create a project at
   [neon.tech](https://neon.tech). Copy the **pooled** connection string
   for `DATABASE_URL` and the **direct** connection string for `DIRECT_URL`.
2. **Vercel**. Import the repo into a new project.
3. **Environment Variables** (Vercel → Project → Settings → Environment Variables):
   - `DATABASE_URL` — Neon pooled connection string
   - `DIRECT_URL` — Neon direct connection string
   - `NEXTAUTH_URL` — your production URL, e.g. `https://associatevoicematters.com`
   - `NEXTAUTH_SECRET` — run `npm run secrets` locally and paste the value
   - `IDENTITY_ENCRYPTION_KEY` — from `npm run secrets` (must be 64 hex chars)
   - `IDENTITY_HASH_PEPPER` — from `npm run secrets`
   - (Optional) `ANTHROPIC_API_KEY` — for the AI moderator
   - (Optional) `EMAIL_SERVER_*` + `EMAIL_FROM` — for magic-link auth
4. **First deploy**. Vercel will build. On first boot it won't have tables yet —
   run this once from your laptop against the prod DB:
   ```bash
   DATABASE_URL='...prod pooled...' \
   DIRECT_URL='...prod direct...' \
     npm run db:push
   ```
5. **Seed demo data** (optional — skip on real launch):
   ```bash
   DATABASE_URL='...prod...' DIRECT_URL='...prod...' \
   IDENTITY_HASH_PEPPER='...same as Vercel...' \
     npm run db:seed
   ```
6. **Redeploy** and visit `/home-health` + `/home-hospice`.

## Quick regeneration

```bash
npm run secrets   # prints three fresh secrets — never writes files
```

Rotating `IDENTITY_HASH_PEPPER` breaks existing ballot dedup and username
continuity. Rotate deliberately, not incidentally.

## Troubleshooting

- **Empty bars** — did `db:seed` run against the right DB?
- **`Invalid prisma.surveyResponse.upsert() invocation`** — `db:push` wasn't run. Tables don't exist yet.
- **Magic-link email doesn't send** — leave `EMAIL_SERVER_*` blank and use the local dev flow; sign-in is optional for the vertical pulse pages (they're public).
- **AI moderator fails silently** — that's by design. `ANTHROPIC_API_KEY` is optional. The raw feedback still saves even when structuring fails.
