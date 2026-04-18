# AssociateVoiceMatters

Standalone associate voice and AI advocacy platform at [associatevoicematters.com](https://associatevoicematters.com).

> "Every voice matters. Especially yours."

## Two Wings

| Wing | Model | Function |
| --- | --- | --- |
| **Channel** | Always Free | Anonymous feedback — any employee, any employer |
| **Envoy** | Success-Fee Only | Identity-unlocked AI advocacy, negotiation & placement |

## Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS with AVM brand tokens
- **Database**: PostgreSQL via Prisma (standalone — own DB, not shared with TalkAIQ)
- **Auth**: NextAuth.js email magic link
- **API**: tRPC over Next.js route handlers
- **AI**: Anthropic Claude (`claude-sonnet-4-6`)

## Getting Started

```bash
cp .env.example .env.local
# fill in DATABASE_URL, NEXTAUTH_SECRET, IDENTITY_ENCRYPTION_KEY, etc.
npm install
npm run db:generate
npm run db:push
npm run dev
```

## Independence from TalkAIQ

AVM is a fully standalone platform — own repo, own Vercel project, own PostgreSQL, own auth. A future data bridge to TalkAIQ.com is designed in via:

- Clean `/api/external/*` API surfaces (reserved, inactive at launch)
- `talkaiq_partner_flag` on the Employer model (wired, all `false` at launch)
- `bridge_consent_flag` on the Associate model (associate-controlled)

**No direct cross-database access — ever.** All future bridge traffic is API-only and event-driven.

## Identity Architecture

PII (`email_hash`, `npi_hash`, `real_name`) lives in isolated tables. Market aggregates (`MarketRate`) carry no `associate_id` foreign key. The identity unlock is always associate-initiated; the AI recommends, never forces.

See the seed doc §4.2 for the full identity bridge security model.

## Build Phases

- **Phase 0** — Website scaffold, brand, public pages ✅
- **Phase 1** — CRM core: schema, Prisma, identity bridge, NextAuth ✅
- **Phase 2** — Channel flow: signup, feedback intake, employer routing
- **Phase 3** — Compensation database + pre-launch surveys
- **Phase 4** — Envoy flow: identity unlock, NPI verification, advocacy
- **Phase 5** — Intelligence & TalkAIQ bridge prep

## Contact

- General — hello@associatevoicematters.com
- Employers — employers@associatevoicematters.com
- Privacy — privacy@associatevoicematters.com
