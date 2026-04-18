# /api/external — Reserved for the TalkAIQ data bridge

This namespace is reserved for the future AVM ↔ TalkAIQ.com bridge (seed §9).
**Inactive at launch.** No routes are wired to partners yet.

## Bridge principles — non-negotiable

1. **API-only.** TalkAIQ calls AVM endpoints here; AVM calls TalkAIQ endpoints on
   the other side. No direct cross-database access, ever.
2. **Event-driven.** AVM emits events (case opened, placement completed, comp
   data added). TalkAIQ listens. Vice versa.
3. **Associate consent required.** No data crosses the bridge without explicit
   `Associate.bridgeConsentFlag = true` and a matching `IdentityUnlockEvent`
   for any identity-bearing payload.
4. **NPI-anchored identity.** The NPI (via `npiHash`) is the universal
   identifier. No plaintext email or name crosses the bridge.

## Planned endpoints (scaffold only — DO NOT enable without security review)

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/external/ping` | GET | Health check — already live, no auth required |
| `/api/external/compensation/aggregate` | GET | De-identified benchmark sync |
| `/api/external/case/events` | POST | Webhook — case status changes |
| `/api/external/placement/events` | POST | Webhook — placement lifecycle |
| `/api/external/identity/resolve` | POST | NPI hash → external ID lookup, consent-gated |

## Auth

The bridge will authenticate via a pre-shared key in the
`X-TalkAIQ-Bridge-Key` header, validated against `TALKAIQ_BRIDGE_API_KEY`, and
gated by `TALKAIQ_BRIDGE_ENABLED=true`. At launch both values are blank and
`enabled` is `false`.
