# Impossible Ventures

**FIVE DEVELOPMENT WAVES / v1.5.0 — SEVEN WORKING EXPERIMENTAL CREATIVE WORLDS.** Open the premium international portal at http://localhost:3000/ and explore all seven branded app routes. This is an experimental source release, not seven registered companies, a worldwide advertising network or proven business. Full implementation record: [Five-wave report](docs/five-waves-release.md).

**Platform v0.8 — Operations & Recovery.** Dead Drop, Pilot Studio and Experiment Lab now share writable SQLite diagnostics, a backup/restore tool and a multilingual server status page. This is source-level staging readiness, **not a confirmed public deployment**.

## Static preview distribution

The main-branch Pages workflow publishes only when GitHub Pages is configured. Even if it is not, a downloadable artifact named **impossible-ventures-static-preview** is produced by Actions. It contains untracked demos only; applications and measured experiments need the Node server. See [deployment instructions](docs/deployment.md).

## NEW — Experiment Lab v0.7 / First-party research

The project now contains a **real opt-in A/B experiment engine**: a randomly assigned direct-control ad (A) versus an authored two-choice interactive story (B), with separate results, anonymous session tokens, durable daily SQLite aggregates, once-only CTA counting, 7-day session expiry and 90-day aggregate retention. The operator can create drafts, activate/pause/finish tests and export CSV of measured sessions and CTA clicks. No registration is needed for the public untracked story preview.

- Public: http://localhost:3000/experiments/
- Operator: http://localhost:3000/experiments/operator/
- Full architecture and risk limitations: [docs/experiment-lab.md](docs/experiment-lab.md)

**These counts are not validated ad impressions, unique users, qualified leads, payments, uplift or revenue.** The new experiment UI supports RU / EN / Chinese; creative text in real experiments is authored by the operator and is not machine-translated. A live public deployment has not been confirmed.


## New: Pilot Studio v0.4

A standalone commercial validation workflow at `/pilot/`, with Russian / English / Chinese UI, modeled campaign economics, a controlled A/B test plan and a consent-based SQLite pilot application. Authorized operator console: `/pilot/operator/` (set `OPERATOR_TOKEN`, minimum 32 characters).

This is **experimental code**, not a live advertising network or actual revenue. See [Pilot Studio implementation and security gaps](docs/pilot-studio.md). This extension does not replace the Dead Drop v0.5 optional AI and data-management functionality described below.


Seven experimental creative-technology products are now individually navigable **working prototypes**: Dead Drop Agency, Appeal 2049, AntiPersona, Brief Theatre, AdBiome, Museum of Attention and Attention Republic. This is source-level product development, not evidence of seven registered companies or commercial traction.

> These are not seven registered businesses. There is no confirmed product-market fit, production cloud deployment, licensed AI usage or payments.

## Dead Drop Agency — the real game

1. **Agent Vector** creates a mission with private product facts.
2. **Agent Echo** joins with private audience insight using an eight-character room code.
3. Each operative gets **three messages**. Their private fields are hidden from the other role until the dossier is completed.
4. Both must send at least one message; the dossier combines the two perspectives.
5. The dossier is downloadable and identifies unverified claims as user-supplied.
6. Each role may export its authorized data view or delete the entire shared room after entering the exact confirmation code.

**No sign-up is necessary for this experimental alpha.** A local training mode works without a running backend. The interactive workspace is translated into **Russian, English, and Simplified Chinese**; deterministic dossier copy supports the same languages.

## Seven branded prototype entrypoints

| World | Local URL | Real mechanic |
|---|---|---|
| Dead Drop Agency | http://localhost:3000/apps/dead-drop/ | Two agents, rule-based or mutual-consent AI dossier |
| Appeal 2049 | http://localhost:3000/apps/appeal-2049/ | Five-signal editorial tribunal |
| AntiPersona | http://localhost:3000/apps/antipersona/ | Four perspective challenges and rebuttal |
| Brief Theatre | http://localhost:3000/apps/brief-theatre/ | Three authored acts and director choices |
| AdBiome | http://localhost:3000/apps/adbiome/ | Five creative genes, mutation and crossover |
| Museum of Attention | http://localhost:3000/apps/museum-of-attention/ | Four openly fictional exhibits, visitor placard |
| Attention Republic | http://localhost:3000/apps/attention-republic/ | Real moderated anonymous consented session ballots |
| Republic Operator | http://localhost:3000/apps/attention-republic/operator/ | Authenticated challenge creation and lifecycle |

The local creativity engines work without a model or registration. **Attention Republic live voting** requires the Node/SQLite server and a manually published operator question. Its static version runs an untracked demonstration only. Operators must set a strong OPERATOR_TOKEN through the host environment; do not commit secrets.

## Launch locally (Node.js 22+)

```bash
git clone https://github.com/osmanosmanov6880-bot/impossible-ventures.git
cd impossible-ventures
npm start
```

Open http://localhost:3000/apps/dead-drop/ and create a mission. Open the same reachable URL on a different browser or device and join by room code.

Other routes:

- Portfolio: http://localhost:3000/
- Appeal 2049: http://localhost:3000/apps/appeal-2049/
- Health: http://localhost:3000/api/v1/health
- Multilingual Dead Drop data notice: http://localhost:3000/privacy.html
- Pilot Studio: http://localhost:3000/pilot/
- Experiment Lab: http://localhost:3000/experiments/
- Server diagnostics (RU/EN/ZH): http://localhost:3000/status/
- Writable SQLite readiness: http://localhost:3000/api/v1/ready
- Process liveness: http://localhost:3000/api/v1/live

The server uses SQLite at `data/missions.sqlite` by default. This is a **single-instance demonstration**, not a distributed production cluster.

## Mission privacy, export and retention

- The **Your Data** panel shows the mission expiration time, provides JSON export of the currently authorized role and allows deletion of the shared room.
- Either agent can delete the room, after entering the exact eight-character code. This immediately revokes both agent tokens. Merely leaving the session does **not** delete the server room.
- Expired missions are pruned at startup, hourly and on access. The deadline is seven days after creation; cleanup may be delayed by one hour while the server runs, or until restart if it is offline.
- SQLite secure-delete and WAL truncation cannot erase external backups, snapshots or physical media; production deletion/legal procedures need independent review.
- See the [data handling notice (EN/RU/ZH)](privacy.html) for exact limitations. These **Dead Drop mission controls are separate** from Pilot Studio application deletion tokens and the Pilot Studio retention policy.

## Optional real AI editing (mutual opt-in only)

The original rules-based brief works without a model key and makes no external AI request.

To enable **optional** server-side OpenAI Responses API creative editing:

1. Copy `.env.example` to `.env`. Supply your own API key and choose a model that supports the Responses API and structured output.
2. Start the server:

```bash
npm run start:ai
```

3. **Both agents** must independently select the AI opt-in checkbox. Either agent may withdraw consent before finalization.
4. If both consent, a model can refine the brief. If either does not, the brief remains rules-based. If the provider fails, a clearly labeled rules-based fallback is returned.

**Privacy:** Enabling AI forwards product/audience information and exchanged transmissions to an external provider after both opt in. Do not enter personal data, client secrets or restricted materials. Mutual opt-in does not itself establish GDPR compliance. Keys are never embedded in frontend bundles. The code requests `store: false`, subject to provider policy.

One finalization per mission, output-token limits and a timeout limit misuse; full production spend controls are not implemented.

Docker:

```bash
docker compose up --build
```

The named Docker volume retains SQLite. Supply `OPENAI_API_KEY` and `OPENAI_MODEL` through the container environment for the optional AI feature.

## Static preview (no server)

```bash
python3 -m http.server 8000
```

Open http://localhost:8000/apps/dead-drop/ for **single-browser training only**. GitHub Pages can host the static preview, but **cannot** run the multiplayer Node API or optional AI.

## Staging deployment

The repository now contains a Docker entrypoint that adjusts mounted volume permissions and then drops root privileges, a Railway healthcheck configuration, and a Docker restart smoke workflow. See the [staging deployment playbook](docs/deployment.md). No public multiplayer server or Railway account is confirmed. Do not expose real customer data before completing security and privacy review.

## Operations, backups and operator control (v0.8)

- The public `/status/` screen shows real process and SQLite write-readiness (Russian, English, Chinese). It does not disclose personal information or guarantee global uptime.
- The recovery CLI snapshots the **shared database containing all three products** via SQLite `VACUUM INTO`, validates integrity and table counts and restores only into a NEW file. Backups contain private mission and pilot data. Never upload them to GitHub.

  ```bash
  npm run db:inspect -- --db ./data/missions.sqlite
  npm run db:backup -- --db ./data/missions.sqlite --out /secure/backup.sqlite
  npm run db:restore -- --from /secure/backup.sqlite --out /secure/restored.sqlite
  ```

- Pilot Studio's operator console now has RU/EN/ZH controls, explicit logout and basic IP throttling. The same strong `OPERATOR_TOKEN` enables both Pilot and Experiment operator tools; this shared-token model is **not production SSO**.
- A Docker CI job creates a consistent backup, boots a restored database on a second container, and checks file permissions.
- Consult the [Operations & Recovery Runbook](docs/operations-runbook.md) before handling real data. Off-host encrypted backups, alerting, proper identity, privacy policies and production hosting still require operator setup.

## Test

```bash
npm run check
```

GitHub Actions additionally runs Chromium end-to-end tests for two agents, language switching, mutual AI consent, training and mobile layout. A CI pass is not a penetration test.

## Portfolio

| Product | Status |
|---|---|
| Dead Drop Agency | Two-agent cooperative alpha, training and optional model-assisted editing |
| Experiment Lab | Anonymous opt-in A/B research alpha with local counters (not verified lift) |
| Appeal 2049 | Working 5-criterion creative review, privacy-first Dead Drop import, 3 languages |
| AntiPersona | Four-opponent rebuttal trainer with structured local export |
| Brief Theatre | User-authored 3-act branching creative scripts |
| AdBiome | Five-gene creative variants, mutation, crossover and provenance |
| Museum of Attention | Four fictional future exhibit rooms and visitor artifacts |
| Attention Republic | Real moderated consented anonymous SQLite ballots, plus untracked static demo |

## Documentation

- [Two-agent protocol and API](docs/dead-drop-coop.md)
- [Security and privacy gaps](docs/security.md)
- [Product and commercial roadmap](docs/roadmap.md)
- [Portfolio thesis](docs/portfolio.md)
- [Staging deployment guide](docs/deployment.md)
- [Multilingual Dead Drop data handling notice](privacy.html)
- [Operations & Recovery Runbook](docs/operations-runbook.md)
- [Five full development waves / source release](docs/five-waves-release.md)

## Operational and legal limitations

- No confirmed public multiplayer host, production identities, payments, configured off-host backups or alerting, distributed deployment or legal company registrations.
- SQLite is local to one process. Rate limiting is basic and in-memory.
- Dead Drop missions expire after seven days and are pruned on server startup, hourly, and when accessed. Pilot Studio uses its own separately implemented retention mechanism.
- Live model use requires a server key, two agents' consent and a funded API account.
- Never commit secrets or customer data. `.env` and the local mission database are ignored by Git.
- Brand names/domains are unverified. Commercial pricing and revenue are hypotheses.


## Wave 1 / Appeal 2049 Creative Tribunal (v0.9)

**A genuinely working new client-side review studio**, not a static render:

- Separate pure deterministic review engine with five 0–4 *editorial writing signals* (clarity, audience, evidence hints, next step, specificity).
- A maximum of 20 is **not** a quality certification or probability of sales; evidence is always marked **unverified** until independently checked by a human.
- Flags risky guarantee, #1 and artificial urgency language for review, never validates them as true.
- RU/EN/Simplified Chinese interface, accessible large text, responsive layout and privacy-first client-side file processing.
- Imports final Dead Drop dossier JSON from a local file, including role-scoped mission exports, **without importing bearer tokens, room identifiers or private role fields**.
- Downloads JSON or TXT editorial reports; can copy the report locally. No API is called with ad concept data.
- Dead Drop now offers an intentional **Export for Appeal** action after finalizing a dossier; the user controls this private local transfer.
- Node, browser, source and static-page test paths cover validation, CSP, translations, private import and report export.

Open \`http://localhost:3000/apps/appeal-2049/\`. For static previews, the same page works with no server. This is **not an AI judge**, legal clearance, brand fact-check or prediction of campaign ROI.
