# Dead Drop Agency — Cooperative Mission Alpha

## Product loop

1. **Agent Vector** creates a room and enters private product intelligence: product, supporting evidence and a campaign objective.
2. Vector shares an eight-character **room code**, **never their agent token**.
3. **Agent Echo** joins from another browser and enters private audience intelligence: audience, tension and preferred channel.
4. Agents exchange at most **three messages each**. Each can view their own private intelligence, the public brand/objective, and the shared messages. They cannot read the other agent's private fields.
5. After both agents transmit at least once, either agent may **decode the dossier**.
6. The server combines both sets of private intelligence and the transmitted signals into a structured, deterministic creative brief. It is **not AI-generated** and provides no performance guarantees.

The training simulation runs all roles in one browser and does **not** provide role secrecy or remote multiplayer.

## Run

Node.js 22 or newer:

```bash
npm start
```

Open http://localhost:3000/apps/dead-drop/

For two-player testing, use two different browsers or a second device on the same reachable server. Share the site URL and the room code. The server listens on port 3000 by default. A reverse proxy with HTTPS is required before exposing it publicly.

Docker:

```bash
docker compose up --build
```

Persistent state: SQLite in `/data/missions.sqlite` inside the Docker volume or `data/missions.sqlite` for a normal Node start. Tests use in-memory SQLite:

```bash
npm test
```

## API

All endpoints use JSON. API version `/api/v1`.

| Endpoint | Method | Description |
|---|---|---|
| `/health` | GET | Health check |
| `/missions` | POST | Create; returns host token and room |
| `/missions/:code/join` | POST | Join once; returns audience token |
| `/missions/:code` | GET | Room state; Bearer agent token required |
| `/missions/:code/messages` | POST | Transmit 3–280 characters |
| `/missions/:code/finalize` | POST | Generate deterministic dossier after one message per agent |
| `/missions/:code/export` | GET | Authenticated, role-scoped JSON export; no raw tokens or peer-private fields before finalization |
| `/missions/:code` | DELETE | Authenticated erasure of whole shared room; body `{ "confirmCode": "ROOMCODE" }` must match exact code |

**Tokens** are generated randomly and only their SHA-256 hashes are stored in SQLite. Clients retain their token in sessionStorage for refreshes, not as an invitation link. Room codes are not agent tokens. No username/password system exists.

## Alpha limitations (do not mistake for production)

- SQLite is designed here for a **single application instance**, not a multi-region deployment.
- Agent tokens are bearer secrets, not user accounts. Anyone with an unclaimed room code can become the second agent. Do not enter confidential client materials.
- No formal identity recovery, backups, infrastructure monitoring, per-account billing, rate-limit sharing across replicas or legal privacy assessment.
- Source v0.5: rooms expire seven days after creation; a startup and hourly task prunes expired rows, and stale reads also expire. While a server is offline, cleanup resumes when it restarts. Physical deletion beyond the current SQLite host is not guaranteed.
- An in-memory 90-POST/minute per-IP limit prevents basic spam but is not sufficient for a public, hostile environment.
- No LLM is connected. A later optional model integration must be server-side with audited prompts and output checks.
- GitHub Pages can host static demos only. The multiplayer API requires a running Node server and TLS proxy.

## Acceptance tests for beta

- Different agents do not receive the other side's private intelligence prior to dossier finalization.
- A third agent cannot join an already claimed room.
- Neither agent can exceed three transmissions.
- Finalization fails before both agents have contributed.
- A persisted mission survives a server restart.
- Generated briefs identify unverified evidence as user-supplied.
- Test keyboard flow, mobile layout, screen reader announcements, color contrast and browser compatibility manually before public release.

See [security notes](security.md) and [roadmap](roadmap.md).


## v0.4: Multilingual UI and consent-gated AI

- Language switcher: English, Russian, Simplified Chinese. Locale is stored only in browser localStorage.
- Deterministic dossiers for all three languages, including offline training.
- Optional server-side model refinement uses the OpenAI Responses API (strict JSON output schema, bounded output and timeout). If not configured or if provider fails, a rules-based dossier is returned.
- **Both agents must independently consent** in the active mission before the server transmits product/audience data and shared messages to the model. Each can revoke consent until finalization. Consent is a feature safeguard, not a substitute for a legal basis/privacy review.
- New endpoint: `POST /api/v1/missions/:code/ai-consent` with an authorized role Bearer token and JSON `{"allow":true|false}`. Response includes only consent booleans in role-scoped view.
- On `POST /finalize`, JSON `{"ai":true,"language":"ru"}` is accepted only if AI is configured and **both** agent consents are true. Otherwise the user must finalize without AI. The persisted result reports `generationMethod`: `rules` or `ai-assisted`.
- Source-of-truth product evidence, audience fields and agent messages cannot be replaced by model output. Model output is a draft requiring independent review.
- Corrected asynchronous join/message races; a per-room finalization lock stops mid-generation writes and duplicate model calls in this single-process alpha.

Use `npm run start:ai` after creating a local `.env` file from `.env.example` and adding your own API configuration. `npm start` remains entirely functional without any key.

This is NOT a certified GDPR-compliant app or a production-ready multi-tenant platform.
