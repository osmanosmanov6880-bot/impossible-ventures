# Portfolio architecture

## Thesis

Build seven distinct brands with separate value propositions and customer experiences. Reuse infrastructure only where appropriate: identity, billing, event taxonomy, prompt orchestration, design tokens, and admin operations. Keep data access tenant-scoped and business accounting distinct.

| Venture | Customer | Core outcome | Revenue hypothesis | Status |
|---|---|---|---|---|
| Dead Drop Agency | Founders, marketers, agencies | Campaign brief through missions | Free tier, creator/team plans | Browser MVP |
| Appeal 2049 | Marketing teams | Stress-test campaign assumptions | Credits, team plans | Concept |
| AntiPersona | Creative professionals | Train non-obvious thinking | Subscription | Concept |
| Brief Theatre | Creative agencies | Scripts under changing constraints | Per export, team plan | Concept |
| AdBiome | Performance teams | Explore creative variants | SaaS by volume | Concept |
| Museum of Attention | Brands, schools | Interactive exhibits | Sponsorship, licenses | Concept |
| Attention Republic | Creative communities | Challenges and peer collaboration | Sponsored challenges | Concept |

## Five-wave alpha: status clarification

The seven venture names above are distinct creative concepts in a server-provided **template gallery**, available in Commercial Command as editable starter ideas. Dead Drop is an interactive cooperative browser prototype; Appeal 2049 is a separate browser critique demo. The other five are not yet independent deployed products or companies.

Commercial Command v1.0 beta implements organization-scoped campaign drafts, approved-only creative previews, expiring capability credentials, opt-in A/B-to-pilot-form attribution, private customer proposal review, and data export/deletion. Payment collection, advertising delivery, identity verification, audited GDPR compliance, multi-instance tenant isolation and real sales are still unimplemented.

See [five-wave release evidence](five-wave-release.md).

## Proposed production stack (not implemented)

- Next.js / TypeScript frontends, PostgreSQL with tenant boundaries.
- API service for stateful mission orchestration; model calls are server-side.
- Stripe or regionally available payment provider, subject to compliance.
- Event tracking: mission_started, step_completed, mission_completed, brief_copied, signup_completed, purchase_completed.
- CI: lint, typecheck, unit tests, browser smoke tests; preview deploys.

## First milestone

Validate Dead Drop with 15–25 participants and track completion, usefulness, sharing, and willingness to pay. Only then implement accounts and monetization.

## Important limitations

Brand names and domains have not been legally cleared. Simulated audience feedback must not be represented as actual market research. Pricing and costs are hypotheses. No legal entities have been registered.
