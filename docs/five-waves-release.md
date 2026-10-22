# Impossible Ventures — Five Full Development Waves

Experimental portfolio release: v1.5.0, October 2026.

This repository contains seven individually branded interactive prototype websites plus the prior Pilot Studio and Experiment Lab services. A GitHub repository and its subpaths do NOT constitute seven registered companies or purchased domains. No live paid revenue or worldwide scale is asserted.

## WAVE 1 — Appeal 2049 / Creative Tribunal

Source: apps/appeal-2049/; tests: services/appeal-2049/tribunal.test.mjs.

Delivered a premium Russian/English/Chinese editorial critique studio. Five transparent writing-quality signals (clarity, audience, proof hints, next action, specificity), each bounded 0–4. Warnings identify guarantee, superlative and artificial-urgency phrases. No independent factual or legal verification and no claim that the resulting score predicts sales.

A finalized Dead Drop dossier can be downloaded as local JSON and then imported into Appeal without copying role access tokens, room codes or private pre-finalization intelligence. Completed review reports download as JSON/TXT, or can be copied locally. No model API call transmits creative contents.

**Independent commercial hypothesis:** agency-team creative review / QA subscriptions. Unverified willingness to pay.

## WAVE 2 — AntiPersona / Adversarial Sparring

Source: apps/antipersona/; shared design: apps/shared/studio.css; tests: services/antipersona/engine.test.mjs.

Four editorial adversaries (skeptical buyer, CFO, busy audience member, accessibility advocate), three distinct role-specific objections, two intensity settings, human-written responses and structured rebuttal feedback. Multilingual accessible premium UI and local JSON export.

**Caveat:** no simulated real human personality, no actual paid LLM and no evidence verification.

**Independent commercial hypothesis:** creative-team workshops and repeatable messaging process tools. Needs validation.

## WAVE 3 — Brief Theatre / Three-Act Rehearsal

Source: apps/brief-theatre/; tests: services/brief-theatre/theatre.test.mjs.

Three genuine user-written acts: Opening, Evidence, Action. The director choice (bold or precise) changes the following stage instruction. Branching state machine tracks completion, scene text and structure signals; exports partial drafts and completed three-act scripts.

**Caveat:** output is an authoring exercise, not auto-generated film, audience study or verified campaign performance.

**Independent commercial hypothesis:** creative-production workshop licensing and structured brief collaboration.

## WAVE 4 — AdBiome / Creative DNA Lab

Source: apps/adbiome/; tests: services/adbiome/engine.test.mjs.

Five genes: Promise, Proof, Tension, Voice, Action. Exactly one trait changes per mutation; hybrid variants inherit alternating genes from two parents. Stable deterministic identifiers, provenance, RU/EN/ZH rendered examples, 12-variant local session cap and JSON export.

DNA distance is the number of different text genes. It is NOT CTR, lift, conversion rate or scientific evidence.

**Independent commercial hypothesis:** agency experiment variants and creative iteration platform.

## WAVE 5A — Museum of Attention / Speculative Archive

Source: apps/museum-of-attention/; tests: services/museum-of-attention/museum.test.mjs.

Four explicitly FICTIONAL future artifacts, filters for 2030s / 2040s / 2050s, three-language narrative rooms, questions about voluntary advertising and visitor-created fictional placards. Local export only.

**Caveat:** dates, artifacts, history and galleries are fictional concepts, not documented events or real sponsors.

**Independent commercial hypothesis:** licensed interactive exhibitions and clearly disclosed brand collaborations.

## WAVE 5B — Attention Republic / Consent-Based Research

Source: apps/attention-republic/ and services/attention-republic/; tests: republic.test.mjs.

Real single-instance Node/SQLite research service:
- Operator-authenticated drafts and explicit activation, pause and irreversible close.
- Public list includes only activated questions and actual database counts; there are no fabricated seeded ballots.
- Explicit visitor opt-in before a measured session.
- Random token stored only as SHA-256 digest on the server; raw bearer held in tab memory.
- One vote per anonymous session enforced by SQLite transaction; session expiry 7 days.
- Real daily A/B totals retained up to 90 days; challenge expiry 14 days.
- Three-language operator console and a truly untracked offline/static demo.

**Caveat:** sessions are NOT unique verified humans. The prototype does not establish election integrity, representative research, anti-Sybil guarantees or precise individual deletion of previously aggregated anonymous ballots. A shared operator token is not production-grade authentication.

**Independent commercial hypothesis:** opt-in branded feedback communities and moderated creative testing; privacy and sampling bias require review.

## Unified world-level experience

The root site is a premium responsive RU/EN/ZH portfolio with seven real working product routes, each with differentiated palette and mechanics, three functional category filters, and separate entry points for Pilot Studio, Experiment Lab and System Status.

Dead Drop and other existing source, static training mode, multilingual UI, consent-gated optional AI, pilot intake, experiment research and SQLite persistence remain included. Products are interoperable through explicit user-controlled local files and navigation; this is not an unbounded autonomous agent system.

Static GitHub Pages bundles must exclude private operator consoles, SQLite, secrets and live APIs. The Republic static preview demonstrates without recording votes; full multiplayer and research require the Node server.

## How to run and test

Node.js 22+:
1. git clone https://github.com/osmanosmanov6880-bot/impossible-ventures.git
2. cd impossible-ventures
3. npm start
4. Open http://localhost:3000/
5. Run npm run check for syntax, server and security tests.
6. Run python3 scripts/build_static_preview.py for no-backend static preview.
7. GitHub Actions provides real Chromium mobile/E2E and Docker/SQLite backup-recovery smoke gates.

The merged release must have all three gates green on its exact final source head; green tests do not equal a penetration test or SLA.

## Essential production blockers

- Live public host, verified HTTPS, durable encrypted storage and off-host backup schedule
- Real identities, operator roles / MFA, tenant isolation, audit logs
- Cross-instance rate limits, anti-bot and anonymous-voter integrity
- Supplier contracts, geographic transfer and lawful-basis review, backup deletion and incident response
- AI spending controls and actual vendor/provider tests
- Actual paid pilots, brand/domain rights, unit economics and measured long-term retention

Product verdict for each independent business thesis: VALIDATE until external customers and payments are verified. The software can be demonstrated now; no registered seven-company structure, real market traction or billion-dollar revenue is established by code alone.
