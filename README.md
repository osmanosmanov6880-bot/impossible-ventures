# Impossible Ventures

**Seven original creative-technology concepts. Two interactive browser demos. One real two-agent cooperative alpha.**

Impossible Ventures is an experimental product portfolio, not seven registered or launched companies.

## The flagship: Dead Drop Agency v0.3

The original questionnaire has evolved into **a two-person classified advertising mission**:

1. **Agent Vector** starts a room with private product intelligence.
2. **Agent Echo** joins using an eight-character invite code and private audience insight.
3. Each operative has **three limited transmissions** to exchange.
4. A structured creative dossier is unlocked only after both operatives participate.

The server hides each participant's private fields from the other until the final dossier. The creative synthesis is deterministic and clearly labeled — **not live AI**.

A polished single-browser **training simulation** is also available without a backend. It does not offer real secrecy between roles.

## Run the full two-player app

Requirements: **Node.js 22+**. No npm dependencies or API keys.

```bash
git clone https://github.com/osmanosmanov6880-bot/impossible-ventures.git
cd impossible-ventures
npm start
```

Open **http://localhost:3000/apps/dead-drop/**. Open the same URL in a second browser or second device that can reach your server, and share the room code. Run integration tests with:

```bash
npm test
npm run check
```

Alternatively, start the container:

```bash
docker compose up --build
```

The Docker Compose named volume keeps the SQLite mission store across restarts. For a normal Node start, missions persist in \`data/missions.sqlite\`.

## Static preview

Serve the repository with a static file server to open the portfolio and try the **single-browser training simulation**:

```bash
python3 -m http.server 8000
```

Open these URLs:

- Portfolio: http://localhost:8000/
- Dead Drop training mode: http://localhost:8000/apps/dead-drop/
- Appeal 2049 creative tribunal: http://localhost:8000/apps/appeal-2049/

A static host such as GitHub Pages **cannot run the Node API**, so only the training mode is available there.

## Portfolio roadmap

| Venture | Implementation |
|---|---|
| Dead Drop Agency | Cooperative alpha with SQLite API, deterministic dossier, training simulation |
| Appeal 2049 | Deterministic critique demo |
| AntiPersona | Concept |
| Brief Theatre | Concept |
| AdBiome | Concept |
| Museum of Attention | Concept |
| Attention Republic | Concept |

## Source structure

- \`index.html\` — portfolio homepage
- \`apps/dead-drop/\` — responsive cooperative game UI
- \`apps/appeal-2049/\` — critique browser demo
- \`services/dead-drop/server.mjs\` — mission API and SQLite storage
- \`services/dead-drop/server.test.mjs\` — integration tests
- \`Dockerfile\`, \`compose.yaml\` — container runtime
- \`docs/dead-drop-coop.md\` — complete gameplay and API description
- \`docs/security.md\` — implemented controls and security gaps
- \`docs/roadmap.md\` — production and commercialization roadmap

## Security and claims

This is **not a security-audited production SaaS**. It has no real AI model, customer login, payment processing, legal entities, production TLS proxy, formal privacy compliance assessment or global deployment. Do not enter real confidential customer material. Campaign factual claims must be checked before use.

Brand and domain availability have not been verified. Commercial pricing is a hypothesis.
