# Portfolio architecture

## Thesis

Build seven distinct brands with separate value propositions and customer experiences. Reuse infrastructure only where appropriate: identity, billing, event taxonomy, prompt orchestration, design tokens, and admin operations. Keep data access tenant-scoped and business accounting distinct.

| Venture | Customer | Core outcome | Revenue hypothesis | Status |
|---|---|---|---|---|
| Dead Drop Agency | Founders, marketers, agencies | Campaign brief through missions | Free tier, creator/team plans | Browser MVP |
| Appeal 2049 | Marketing teams | Stress-test campaign assumptions | Credits, team plans | Concept |
| AntiPersona | Creative professionals | Train non-obvious thinking | Subscription | Browser workshop |
| Brief Theatre | Creative agencies | Scripts under changing constraints | Per export, team plan | Browser workshop |
| AdBiome | Performance teams | Explore creative variants | SaaS by volume | Browser workshop |
| Museum of Attention | Brands, schools | Interactive exhibits | Sponsorship, licenses | Browser workshop |
| Attention Republic | Creative communities | Challenges and peer collaboration | Sponsored challenges | Browser workshop |


## v1.2: First-party Launch Studio

Source code now contains owner-governed campaign publication, seven mobile interactive end-user story paths, opt-in event signals, one-time CTA-to-lead attribution, tenant metrics and CSV reporting. This is a first-party hosted microsite product, not an ad-network integration, verified third-party impression tracker, unique visitor attestation or confirmed revenue source. [v1.2 release guide](launch-studio-v12.md).
## v1.1: five distinct playable creative worlds

AntiPersona, Brief Theatre, AdBiome, Museum of Attention and Attention Republic have individual browser experiences with real decision mechanics, localized scripts and local export. The mechanics are authored deterministic games, **not verified commercial software products, actual audience measurements or ad distribution**. Dead Drop cooperative MVP and Appeal 2049 existing browser prototype remain separate. See [release and explicit status](five-playable-worlds-v11.md).

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
