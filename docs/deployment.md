# Deployment playbook — Impossible Ventures staged deployment (v0.8)

## First-party Launch Studio v1.2 — deployment requirements

The new /play/?id=LAUNCH_ID requires a live, protected Node and SQLite host. Unlike the seven browser creative training apps, the customer microsite cannot function on a static-only GitHub Pages preview.

1. Back up the existing database with npm run db:backup before upgrading. Startup safely creates commercial_launches, launch_sessions, launch_daily and adds missing pilot_leads.launch_id.
2. Use HTTPS and secure, rotated OPERATOR_TOKEN and workspace capability tokens. Only owner can publish, pause, resume and retire a launch.
3. Same-origin iframe only. X-Frame-Options SAMEORIGIN plus Content-Security-Policy frame-ancestors self are applied only to the public story; other protected screens remain DENY.
4. Consent is optional for story play. Counts are opt-in technical signals, not attested impressions or revenue. Random session secrets are hashed, and separate consent is required to link a CTA receipt to a contact form.
5. Monitor /api/v1/ready, keep encrypted off-host backups, confirm data retention and verify a restore before inviting actual customers.
6. Run npm run check, the pinned Chromium browser test and Docker storage smoke. Static preview intentionally excludes protected /play/ public-server features.

See [v1.2 deployment and privacy runbook](launch-studio-v12.md).
## v1.1 creative worlds: no-account static products

Five new worlds are served from /apps/anti-persona/, /apps/brief-theatre/, /apps/ad-biome/, /apps/museum-of-attention/ and /apps/attention-republic/. Their static runner is common under /apps/creative-worlds/. They do not invoke a backend API or require OPERATOR_TOKEN, but normal HTTP delivery of ES modules is required. The .mjs response MIME must be JavaScript; a wrong MIME blocks these apps in Chromium.

GitHub Pages static preview includes all five. Static-only mode is honest: no remote campaign management, tracking, customer login or payment collection. The full server and experiment workspace features still require a protected Node.js staging host.

See [five playable worlds v1.1](five-playable-worlds-v11.md).

## Five-WAVE v1.0 commercial staging additions

This code branch adds **/commercial/** (seven-world creative demo and operator-provisioned workspaces), **/showcase/** (approved public creative), and **/proposal/** (private commercial offer and recorded customer decision), alongside /experiments/, /pilot/ and the existing /status/ diagnostics.

- Set a cryptographically strong **OPERATOR_TOKEN** through the hosting secret manager. This shared token provisions workspaces; owner/editor/viewer credentials are separate, expiring, one-time displayed capabilities.
- Use an HTTPS staging domain and synthetic companies only. Do not submit real payment data, secrets, or confidential customer information to a non-reviewed alpha.
- A/B CTA attribution connects only to separately consented Pilot Studio forms, not payment confirmations.
- Pricing is stored in integer cents but no billing gateway, legally binding electronic signature or revenue recognition is implemented.
- Static build offers **local templates and estimates without registration**; it cannot accept authenticated company actions, leads or private proposal decisions. No operator or private customer data is packaged.
- The original v0.8 **/api/v1/ready**, **/api/v1/live**, multilingual status and consistent SQLite backup/restore routines remain required deployment gates.
- Detailed source, API, privacy and release gates: [Five-WAVE release](five-wave-release.md).


**Status:** deployment source/configuration is prepared, but **no public Node server, Railway project, verified domain, or paid model connection is claimed**. Use a controlled staging environment with synthetic test data only. Never put API secrets in Git.

## v0.7 — Experiment Lab staging (not a production advertising network)

The Docker image also includes the Experiment Lab operator and participant workflow. Operator access requires a strong environment variable OPERATOR_TOKEN. For docker compose, pass it through your local uncommitted environment or secret manager. Generate an unpredictable value with Node's crypto.randomBytes; see [Experiment Lab source and retention plan](experiment-lab.md).

- /experiments/ — public experiment UI and local untracked preview.
- /experiments/operator/ — private operator UI; do not expose openly without HTTPS and network access controls.
- /pilot/operator/ — separate pilot-request operator UI.
- /api/v1/operator/experiments — protected API; no third-party ad networks are connected.

A valid HTTPS staging domain, signed off data handling, distributed rate limits, a verified controller, backups and a threat-model review are still **required before real customer data**.

## Local Docker smoke

```bash
docker compose up --build -d
curl -fsS http://localhost:3000/api/v1/ready
curl -fsS http://localhost:3000/api/v1/live
docker compose logs -f
```

Open http://localhost:3000/apps/dead-drop/ and create a room in one browser; join from another browser. The named volume `mission-data` holds `/data/missions.sqlite` across container restarts.

```bash
docker compose down
```

**Avoid** `docker compose down -v` if you want to retain the test database; `-v` destroys named volumes.

### Container security model

The `Dockerfile` installs `su-exec`. Its minimal entrypoint starts as root to make a mounted `/data` directory writable, then immediately launches Node as the unprivileged `node` account. The Node server binds to `0.0.0.0:${PORT:-3000}`; the container healthcheck uses the configured port. The app is deliberately a **single writer / single-instance SQLite deployment**.

## Railway staging deployment — prepared, not executed

1. Open [Railway](https://railway.com/) and create a new project.
2. Connect the **GitHub repository** `osmanosmanov6880-bot/impossible-ventures` as the service source.
3. Railway should detect the root `Dockerfile` automatically. The committed `railway.json` defines the writable-SQLite readiness endpoint `/api/v1/ready`.
4. Attach a **persistent Railway Volume** to the service with mount path **`/data`**. This is essential. The SQLite database must not live solely in ephemeral container storage.
5. Under service variables, set `DB_PATH=/data/missions.sqlite`. Set `RAILWAY_RUN_UID=0` if required by Railway's root-owned volume mount. The Docker entrypoint then drops privileges to `node` before launching the app. `PORT` can be supplied by Railway.
6. **Do not enable `OPENAI_API_KEY` initially.** Keep the deterministic game functional while testing the hosting setup. If/when you add optional AI, set `OPENAI_API_KEY` and `OPENAI_MODEL` as Railway **secrets**, not source files, and enforce a provider spend limit. Both agents still must opt in.
7. Keep **one replica**. Never scale this SQLite container horizontally or deploy into multiple regions without first migrating persistence to a shared managed database with safe transactions.
8. In the service Networking settings, **Generate Domain** (or attach your verified domain) and confirm HTTPS is active. Copy the actual assigned URL only after deployment succeeds; do not guess it.
9. Confirm process and writable database checks:

   ```bash
   curl -fsS "https://YOUR-ASSIGNED-DOMAIN/api/v1/live"
   curl -fsS "https://YOUR-ASSIGNED-DOMAIN/api/v1/ready"
   ```

   Open `https://YOUR-ASSIGNED-DOMAIN/status/` to check RU/EN/ZH diagnostics, then open `https://YOUR-ASSIGNED-DOMAIN/apps/dead-drop/` in two browsers, check room joining, role isolation, finalization and JSON export. Test deletion and confirm both roles are revoked.
10. Supply `OPERATOR_TOKEN` as a strong cryptographically generated **secret** for the Pilot Studio and Experiment Lab operator tools. Use a verified account system rather than a shared token for production.
11. Configure encrypted *off-host* backups, tested restoration, monitoring, service access, domain ownership, incident response and resource budgets in the hosting account before any customer pilot. Logs must not capture private campaign payloads or bearer tokens.

Official Railway documentation:
- [Dockerfile detection](https://docs.railway.com/builds/dockerfiles)
- [Volume creation, mounting, and non-root images](https://docs.railway.com/volumes)
- [Public domains](https://docs.railway.com/guides/docker-compose)
- [Deploy-time healthchecks](https://docs.railway.com/deployments/healthchecks)
- [Config as code](https://docs.railway.com/config-as-code)

## GitHub Pages (static training mode only)

The `.github/workflows/pages.yml` workflow packages the portfolio, Dead Drop static app, Appeal 2049 static app and `privacy.html` when changes reach `main`. If Pages has not been enabled with GitHub Actions as its source, an administrator must configure the repository's Pages settings. **No live Pages URL is asserted.**

Static mode is intentionally training-only. GitHub Pages **cannot** run the Node mission API, SQLite, or optional AI.

## Operational release checklist

- [ ] GitHub Actions quality gates and Chromium tests green on the release commit
- [ ] Docker build and restart/persistence smoke test green
- [ ] Persistent volume attached at `/data`
- [ ] HTTPS and assigned public domain verified
- [ ] Role isolation tested on the deployed staging URL
- [ ] JSON export, confirmation-based deletion, restart and expiry tested
- [ ] AI disabled by default; provider keys not in repo/logs
- [ ] Login/abuse/bot controls, rate-limits and audit requirements reviewed
- [ ] SQLite WAL snapshot/restore drill passed for all three products and backups kept off-host under an enforceable retention policy
- [ ] Readiness `/api/v1/ready` reflects a writable persistent volume
- [ ] Restore backup and deletion/privacy impact documented
- [ ] Privacy controller, legal basis and supplier transfer assessment completed for any real data

A green staging demo is **not** enough to describe this as a production, GDPR-certified or commercially scaled platform.

## Shared database recovery and status

This project now uses one SQLite database for Dead Drop, Pilot Studio **and Experiment Lab**. The recovery CLI protects all three products, including anonymous experiment sessions and aggregated counters. See [Operations & Recovery Runbook](operations-runbook.md) for `VACUUM INTO` snapshot, checksum validation, **non-overwriting** restoration and the implications of backup retention for user-requested deletion. No actual off-host backup scheduler or live cloud deployment is created by these source files.

## Static demo delivery when GitHub Pages is not enabled

The repository's main-branch workflow "Static preview package and optional Pages deployment" now always builds a static demo bundle and uploads the GitHub Actions artifact named **impossible-ventures-static-preview** (retained for 30 days), even if GitHub Pages has not been enabled. The static demo includes the portfolio, Dead Drop offline training, Appeal 2049, Pilot Studio calculator and Experiment Lab untracked story preview. It intentionally excludes the operator frontends and all server state/API.

**This is not a live Node hosting deployment.** The static demo cannot accept pilot applications or record measured A/B sessions.

To enable the public URL, a repository administrator must do the one-time GitHub UI setup:

1. Repository **Settings → Pages**.
2. Under **Build and deployment**, select **Source: GitHub Actions**.
3. Run the "Static preview package and optional Pages deployment" workflow (or push a new main-branch commit).
4. Verify the deployed address shown in the workflow's Deploy step. Do not assume any public URL is active until it is verified.

GitHub's official configure-pages@v5 action requires extra credentials to enable a site automatically; the normal workflow GITHUB_TOKEN is insufficient for first-time enablement. This project deliberately does not create or expose a long-lived token to get around the manual setup.
