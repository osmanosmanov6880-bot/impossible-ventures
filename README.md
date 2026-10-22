# Impossible Ventures

## NEW / v1.8 — First-party Launch Studio (five full WAVE 11–15)

Launch Studio links an approved campaign to a **real first-party interactive microsite**. A workspace owner freezes an approved revision, activates or pauses a public link and can permanently retire it. Seven authored RU/EN/ZH interactive story paths play on mobile without login or analytics consent.

Optional opt-in event collection counts session starts, single completion and CTA signals. A cryptographically random one-time CTA receipt may be linked to an actual Pilot Studio form only after **separate contact consent**. The workspace board shows real technical event aggregates, submitted leads and manually qualified leads, with CSV export.

**Commercial boundary:** This is not third-party paid ad placement, independently attested impressions, unique real human reach, verified sales or collected revenue. No external ad network, financial gateway, cookie tracker or behavioral profile is connected. GitHub Pages static preview cannot host live launches; use the Node backend.

Open the protected /commercial/ Launch Studio, then a live first-party page /play/?id=LAUNCH_ID. [v1.8 release guide](docs/launch-studio-v12.md).

## FIVE DEVELOPMENT WAVES — v1.6 experimental release

The code now includes a premium **Russian / English / Chinese** portal with **seven individually branded interactive research experiences**, plus all previously developed **Commercial Command**, Pilot Studio, Experiment Lab, operational recovery tools and earlier creative-world prototypes. The premium studio routes are separate, so no older product is overwritten.

| Premium creative world | Path | Real source-level mechanic |
|---|---|---|
| Dead Drop Agency | `/apps/dead-drop/` | Two-person mission, shared dossier and mutual-consent optional AI |
| Appeal 2049 — Creative Tribunal | `/apps/appeal-2049-studio/` | Five-criterion editorial review and private Dead Drop dossier import |
| AntiPersona | `/apps/antipersona/` | Four adversarial viewpoints, rebuttal and local report |
| Brief Theatre Studio | `/apps/brief-theatre-studio/` | Three user-written acts with branch-sensitive director constraints |
| AdBiome | `/apps/adbiome/` | Five-gene creative mutation, crossover and deterministic lineage |
| Museum of Attention Studio | `/apps/museum-of-attention-studio/` | Four openly fictional artifacts and visitor-authored placards |
| Attention Republic Live | `/apps/attention-republic-live/` | Operator-moderated, opt-in anonymous one-ballot-per-session SQLite voting |

Real server-only voting, commercial and pilot actions require a running Node.js backend. On GitHub Pages, the Republic product only supports an **untracked local demo**. These source files do not create seven legal companies, domain registrations, verified customers, advertising revenues or GDPR certification.

- Full engineering and commercialization caveats: [Five-Wave Source Report](docs/five-waves-release.md)
- Start locally with Node 22+: `npm start`, then open **http://localhost:3000/**.
- Run all source and server regression tests: `npm run check`.

---
**Platform v1.8 beta — v1.7 premium seven-world studios plus first-party Launch Studio, Commercial Command and v0.8 recovery.** Dead Drop, Pilot Studio and Experiment Lab now share writable SQLite diagnostics, a backup/restore tool and a multilingual server status page. This is source-level staging readiness, **not a confirmed public deployment**.


## NEW — Five fully playable worlds / v1.1 beta

Five independent interactive world workshops have moved beyond placeholder cards. Each has a unique deterministic story, choices that alter authored outcomes, independent chapter mechanics, a premium responsive interface, complete Russian/English/Chinese copy, transparent game-only heuristics and a locally downloadable JSON creative deliverable. No registration is required.

| Wave | World | Playable browser experience |
|---|---|---|
| 6 | [AntiPersona](apps/anti-persona/) | Counter-audience investigation, objections, custom pitch and reality check |
| 7 | [Brief Theatre](apps/brief-theatre/) | Four-act screenplay with mandatory authored lines and evidence scene |
| 8 | [AdBiome](apps/ad-biome/) | Four rounds of creative mutations and a proposed honest A/B test |
| 9 | [Museum of Attention](apps/museum-of-attention/) | Four interactive exhibits about attention, clarity and visitor agency |
| 10 | [Attention Republic](apps/attention-republic/) | Five policy choices balancing modeled trust, inclusion and sustainability |

**Browser paths:** /apps/anti-persona/, /apps/brief-theatre/, /apps/ad-biome/, /apps/museum-of-attention/, /apps/attention-republic/.

**Real workflow bridge:** Download a finished world’s JSON, open /commercial/, choose the local file under Creative World import and review the prepared draft. Import does not automatically save, send private inputs or publish an ad. A separately authorized Save Draft action is required.

**Evidence and limits:** [Five playable worlds — release guide](docs/five-playable-worlds-v11.md). All five are scripted creative workshops, **not** ad-delivery networks, production AI services, real audience panels or paying customers. Scores are fictional design heuristics and must not be mistaken for CTR or conversion lift.

## Five-WAVE Commercial Command v1.0 beta — implemented in source

This release adds a premium Russian-first global entry page; a no-registration seven-world local creative demonstration; real operator-provisioned organization workspaces with expiring owner/editor/viewer credentials and auditing; organization-scoped versioned creative campaigns and approved-only shareable previews; opt-in one-time attribution of measured A/B CTA to a separately consented Pilot Studio form; and real customer-viewable commercial proposals with exact monetary arithmetic, private tokens, decision tracking and 180-day proposal retention.

The full five-wave release log, setup steps, API semantics, risk controls and verified boundaries are documented in **[docs/five-wave-release.md](docs/five-wave-release.md)**.

**Working Node server pages**
- [Main premium marketing site](/) — open locally at http://localhost:3000/
- http://localhost:3000/commercial/ — seven-world interactive demo plus persisted workspaces and campaign/proposal editor.
- http://localhost:3000/experiments/ — genuinely consent-gated experiment flow.
- http://localhost:3000/pilot/ — campaign model and separately consented commercial pilot request.
- http://localhost:3000/showcase/?id=CAMPAIGN_ID — published creative only, no advertising network delivery.
- http://localhost:3000/proposal/?id=PROPOSAL_ID#token=PRIVATE_SECRET — private customer quote, not invoice or payment.

Quick start (Node 22+):

```powershell
git clone https://github.com/osmanosmanov6880-bot/impossible-ventures.git
cd impossible-ventures
$env:OPERATOR_TOKEN = node -e "process.stdout.write(require('node:crypto').randomBytes(48).toString('base64url'))"
npm start
```

Use npm run check for integrated server tests, or the published CI workflow for Playwright, Docker and static preview QA. The static bundle lets visitors explore the seven worlds and view mockups without registration; it cannot persist real data or accept customer decisions.

**Commercial limitation:** accepted quotes, manual lead status and CTA activity **do not prove collected revenue, invoiced charges, unique human audience, actual ad delivery or independent sales**. No live third-party ad-platform connector, Stripe billing, MFA/SSO or externally verified commercial deployment is claimed. First deploy only to protected staging with synthetic data and review privacy/security before real customers.


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


Seven experimental creative-technology worlds have working prototype implementations in the premium studio routes listed above. Earlier browser-only demonstrations and Commercial Command retain their original paths. No prototype should be represented as a registered, commercially launched company.

> These are not seven registered businesses. There is no confirmed product-market fit, production cloud deployment, licensed AI usage or payments.

## Dead Drop Agency — the real game

1. **Agent Vector** creates a mission with private product facts.
2. **Agent Echo** joins with private audience insight using an eight-character room code.
3. Each operative gets **three messages**. Their private fields are hidden from the other role until the dossier is completed.
4. Both must send at least one message; the dossier combines the two perspectives.
5. The dossier is downloadable and identifies unverified claims as user-supplied.
6. Each role may export its authorized data view or delete the entire shared room after entering the exact confirmation code.

**No sign-up is necessary for this experimental alpha.** A local training mode works without a running backend. The interactive workspace is translated into **Russian, English, and Simplified Chinese**; deterministic dossier copy supports the same languages.

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
| Experiment Lab | Anonymous opt-in A/B research alpha with local counters and separately consented lead attribution (not verified lift) |
| Commercial Command | Seven editable creative worlds, tenant-scoped campaign/proposal beta; no third-party ad buying or payments |
| Appeal 2049 | Deterministic browser critique demo |
| AntiPersona | Standalone 4-stage interactive browser workshop |
| Brief Theatre | Standalone authored four-act interactive browser workshop |
| AdBiome | Standalone creative mutation and experiment-planning workshop |
| Museum of Attention | Standalone four-gallery interactive browser workshop |
| Attention Republic | Standalone five-council strategy simulator |

## Documentation

- [Two-agent protocol and API](docs/dead-drop-coop.md)
- [Security and privacy gaps](docs/security.md)
- [Product and commercial roadmap](docs/roadmap.md)
- [Portfolio thesis](docs/portfolio.md)
- [Staging deployment guide](docs/deployment.md)
- [Multilingual Dead Drop data handling notice](privacy.html)
- [Operations & Recovery Runbook](docs/operations-runbook.md)
- [Five-WAVE commercial beta specification](docs/five-wave-release.md)
- [Five playable-world game releases](docs/five-playable-worlds-v11.md)
- [Launch Studio first-party advertising lifecycle — five WAVE](docs/launch-studio-v12.md)

## Operational and legal limitations

- No confirmed public multiplayer host, production identities, payments, configured off-host backups or alerting, distributed deployment or legal company registrations.
- SQLite is local to one process. Rate limiting is basic and in-memory.
- Dead Drop missions expire after seven days and are pruned on server startup, hourly, and when accessed. Pilot Studio uses its own separately implemented retention mechanism.
- Live model use requires a server key, two agents' consent and a funded API account.
- Never commit secrets or customer data. `.env` and the local mission database are ignored by Git.
- Brand names/domains are unverified. Commercial pricing and revenue are hypotheses.
