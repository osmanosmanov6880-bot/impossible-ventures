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
