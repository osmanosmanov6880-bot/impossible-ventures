# Impossible Ventures

Seven experimental creative-technology products. **Dead Drop Agency v0.5** is the flagship multiplayer alpha. **Appeal 2049** is a separate browser prototype. Five further concepts are documented but not commercially launched.

> These are not seven registered businesses. There is no confirmed product-market fit, production cloud deployment, licensed AI usage or payments.

## Dead Drop Agency — the real game

1. **Agent Vector** creates a mission with private product facts.
2. **Agent Echo** joins with private audience insight using an eight-character room code.
3. Each operative gets **three messages**. Their private fields are hidden from the other role until the dossier is completed.
4. Both must send at least one message; the dossier combines the two perspectives.
5. The dossier is downloadable and identifies unverified claims as user-supplied.
6. Either role can export their authorized JSON view or permanently delete the room for both agents, after confirming the exact code.

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
- Transparent privacy/retention notice: http://localhost:3000/privacy.html

The server uses SQLite at `data/missions.sqlite` by default. This is a **single-instance demonstration**, not a distributed production cluster.

## Mission lifecycle and privacy controls

- The dedicated **Your Data** panel shows the scheduled expiry time and offers role-scoped JSON export. Raw agent access tokens, hashes and the other agent's pre-finalization private fields are excluded.
- **Delete Mission** requires typing the exact room code. Either authorized agent can delete the shared mission, immediately revoking both roles. Leaving a session only clears the local token and does **not** delete server data.
- SQLite stores missions for at most seven days from creation, subject to up to one hour of scheduled cleanup delay while the process is running. Expired rooms are purged at startup, hourly, and on access; if the server is offline, cleanup resumes when it restarts.
- SQLite secure_delete and WAL truncation are best-effort local cleanup; neither guarantees data removal from backups, disk snapshots or physical storage. No production backup/delete policy is implemented.
- See the multilingual [data handling notice](privacy.html) for exact limitations.

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

## Deploy a controlled staging server

The repository now includes a Railway configuration (`railway.json`), a Docker runtime that drops root privileges after preparing the persistent volume, and a Docker smoke test that exercises a restart.

See [the staging deployment playbook](docs/deployment.md) for the exact GitHub, volume, environment and HTTPS setup. A Railway hosting account must be connected and provisioned separately; no live server is claimed.

**Do not expose this alpha to real customer campaign data.** First finish the threat model, production authentication, distributed anti-abuse controls, privacy assessment, backup/deletion procedures and operating budget.

## Test

```bash
npm run check
```

GitHub Actions additionally runs Chromium end-to-end tests for two agents, language switching, mutual AI consent, training and mobile layout. A CI pass is not a penetration test.

## Portfolio

| Product | Status |
|---|---|
| Dead Drop Agency | Two-agent cooperative alpha, training and optional model-assisted editing |
| Appeal 2049 | Deterministic browser critique demo |
| AntiPersona | Concept |
| Brief Theatre | Concept |
| AdBiome | Concept |
| Museum of Attention | Concept |
| Attention Republic | Concept |

## Documentation

- [Two-agent protocol and API](docs/dead-drop-coop.md)
- [Security and privacy gaps](docs/security.md)
- [Product and commercial roadmap](docs/roadmap.md)
- [Portfolio thesis](docs/portfolio.md)
- [Deploy and smoke-test the staging build](docs/deployment.md)
- [Multilingual data handling notice](privacy.html)

## Operational and legal limitations

- No confirmed public multiplayer host, production user identity service, payments, formal backups, distributed deployment or legal company registrations.
- SQLite is local to one process. Rate limiting is basic and in-memory.
- Missions expire after seven days and are cleared on server startup and hourly, with cleanup upon access. Actual physical erasure beyond the SQLite host is not guaranteed.
- Live model use requires a server key, two agents' consent and a funded API account.
- Never commit secrets or customer data. `.env` and the local mission database are ignored by Git.
- Brand names/domains are unverified. Commercial pricing and revenue are hypotheses.
