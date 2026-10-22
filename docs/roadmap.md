# Impossible Ventures — evidence-led roadmap

Updated 2026-10-22. **Statements of implementation are scoped to source files, not a verified production deployment.**

## v0.7 Experiment Lab extension — code only

- Working first-party A/B sessions with true random 50/50 assignment probability, consent, static control creative and a two-choice interactive treatment.
- Operator-controlled draft→running→paused→completed lifecycle; authenticated API, time-bucketed anonymous CTA counts and 95% Wilson descriptive intervals.
- Client-side story choices do not create server event profiles. Test sessions expire after seven days; daily aggregates after ninety days. Browser preview without consent creates no analytics.
- Two working operator surfaces for experiment reporting and B2B pilot requests; both use the same configurable shared token, **not** production employee accounts.
- Automated API/privacy and Playwright testing, but no confirmed paid customer, ad network delivery, billing or causal effect. See [Experiment Lab specification](experiment-lab.md).

## In the repository

- Portfolio landing with seven separate concepts.
- Dead Drop v0.3: responsive two-agent game, role-specific private fields, codes, three transmissions each, client refresh, local training mode, exportable deterministic dossier.
- Node 22 REST API with server-side validation, SHA-256 agent token digests, SQLite persistence and basic rate limiting.
- API integration tests and GitHub Actions quality checks.
- Appeal 2049 browser-based deterministic critique demo.
- Dockerfile and Compose single-instance runtime.

## Gate 1 — Alpha verification

- CI must report green for tests and syntax checks.
- Manually verify two browser sessions, mobile widths, keyboard access and screen reader navigation.
- Validate threat model, token handling, room-join race behavior and PII risks.
- Test copy/export, refresh/reconnect and mission expiry.
- Collect 10–20 user interviews from freelance marketers, agencies and founders.

## Gate 2 — Production backend

- Replace raw bearer-by-room identity with proper managed accounts (optional guest experience remains).
- Migrate persistence to managed PostgreSQL with tenant isolation and least-privilege row policies.
- Distributed rate limiting, monitoring, audit events, abuse controls, backups and disaster recovery.
- Extend v0.5's single-room authenticated delete/export into account-level data lifecycle and tenant-wide retention and deletion workflow. Assess EU/other regional privacy requirements.
- Serve with HTTPS and a real domain; deploy preview/staging and enable rollback.

## Gate 3 — AI assistance (optional)

- Server-side model orchestration, no client-side model keys.
- Define prompts and structured schemas; protect confidential business content.
- Add evaluation examples for factuality, diversity, usefulness and unsafe outputs.
- Implement per-tenant quotas, spend ceilings and human confirmation of claims.

## Gate 4 — Paid pilots

- Interview at least 20 prospective customers; ask them to compare Dead Drop to their current workflow.
- Measure: first-mission completion, partner-invite acceptance, repeats within 14 days, dossier usefulness and willingness to pay.
- Seek **3–5 genuinely paying pilots** before expanding infrastructure or launching all seven products.
- Customer requests determine whether to build image generation, export formats and integrations.

## Product portfolio expansion

1. Dead Drop — differentiated 2-agent collaboration.
2. Appeal 2049 — evidence-review workflow for Dead Drop dossiers.
3. AdBiome — real campaign variants and experiment metadata once customers ask for it.
4. AntiPersona, Brief Theatre, Museum of Attention and Attention Republic follow measurable customer demand.

## Not completed

No live hosted cooperative server, production security certification, LLM connection, paid accounts, complete accessibility audit, enterprise SLAs or confirmed commercial demand. Existing demos are prototypes only.


## v0.4 implementation increment (source)

- Optional server-side model editing with strict output schema and bounded request size.
- Server-enforced mutual agent consent and revocation before model data transfer.
- RU/EN/zh-CN UI language switcher and localized rule-based dossiers.
- Integration coverage for concurrency, role permissions, consent, AI fallback and translations.
- Browser regression tests for language selection and two-agent consent.
- Private local mission database and `.env` excluded from Git.

**Release criterion:** both GitHub Actions quality gates and real Chromium end-to-end tests must pass before merge. Production host, real paid-model connection and commercial market fit remain unverified.

## Next development priorities

1. Verified staging deployment with HTTPS, telemetry, backup policy and complete retention deletion.
2. Replace bearer-only room identities with optional managed accounts and tenant isolation.
3. Independent privacy/security review of consent, supplier processing and rate/spend controls.
4. User testing (including Russian/English/Chinese usability and accessibility) and paid pilot validation.
5. Improve model evaluations against factuality, creativity and conversion-oriented usefulness.

## v0.8 operational reliability milestone (source)

- Real process vs writable-SQLite readiness endpoints and a readable localized public status dashboard.
- Consistent live SQLite `VACUUM INTO` snapshots, SHA-256/integrity verification, non-overwriting restore CLI.
- Docker integration smoke that backs up a running database and boots the restored data in a separate container.
- Operator console localized to RU/EN/ZH with in-page logout and basic IP request throttling.

**Next release gates, not yet finished:** encrypted off-host backup scheduling, automatic restore drills, real hosting with a verified HTTPS domain, production identity and anti-abuse infrastructure, operational alerts and privacy/legal supplier review. A working status page does not imply a global SLA.
