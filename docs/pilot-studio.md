# Pilot Studio v0.4 — business pilot intake and experimental economics

Stage: **source-code alpha**. No actual advertiser accounts, payment, campaign buying or verified uplift.

## Entry points

- \`/pilot/\` — multilingual (English, Russian, Chinese) public landing, financial hypothesis model, 50/50 A/B experiment outline and consent-based pilot request.
- \`/pilot/operator/\` — operator console, using a server-side configured bearer token entered for the browser session only. Shows actual saved requests and allows manual status changes.
- \`/apps/dead-drop/\` — existing cooperative mission to develop an initial creative dossier.
- \`/apps/appeal-2049/\` — existing browser-only critique demo.

## Run

Requires Node.js 22+ with built-in SQLite support.

\`\`\`sh
export OPERATOR_TOKEN="replace-with-a-random-string-longer-than-32-characters"
npm start
\`\`\`

Open \`http://localhost:3000/pilot/\` and \`http://localhost:3000/pilot/operator/\`.

On Windows PowerShell:

\`\`\`powershell
$env:OPERATOR_TOKEN = "replace-with-a-random-string-longer-than-32-characters"
npm start
\`\`\`

Set \`DB_PATH\` if the SQLite database should reside outside \`data/missions.sqlite\`.
For hosted environments deploy the Node process behind HTTPS, set \`OPERATOR_TOKEN\` via secret management and protect administrator networking.

## REST contracts

\`POST /api/v1/pilots\` — public, JSON, 16 KiB maximum body, 5 submissions/hour/IP in a single instance. Explicit \`consent: true\` required. Accepts \`company\`, \`contact\`, \`email\`, optional HTTPS \`website\`, \`goal\` (leads, sales, awareness, validation), \`budget\` (under-1k, 1k-5k, 5k-25k, 25k-plus, unsure), \`locale\` (en, ru, zh). A nonempty hidden \`website_confirm\` field receives a non-recording 202 response.

A valid response is **201** and provides \`requestId\` plus a one-time **deletion token**. The latter is never saved in clear text and cannot be recovered later. It is displayed to the submitter once.

\`DELETE /api/v1/pilots/:id\` — submitter-controlled deletion. Pass \`Authorization: Bearer <deletion token>\`.

\`GET /api/v1/operator/pilots\` — operator-only listing and current status totals, no simulated data. Pass \`Authorization: Bearer <OPERATOR_TOKEN>\`. Max 100 most recent records.

\`POST /api/v1/operator/pilots/:id/status\` — manually set one of \`new\`, \`contacted\`, \`qualified\`, \`won\`, \`lost\`. Status **won** is not proof of invoiced or collected revenue.

\`GET /api/v1/health\` — existing health endpoint.

## Measurement

The financial calculator derives:

- impressions = media spend / CPM * 1,000;
- clicks = impressions * assumed CTR / 100;
- conversions = clicks * assumed CVR / 100;
- media-only CPA = spend / conversions.

All displayed results are **hypothetical scenarios**; no real performance metrics, attribution claims or incremental revenue calculations are made.

A proposed 50/50 split is not a running experiment. Do not conclude significance or superiority from projected numbers.

## Security and data handling

- HTTPS is required in production. The source app alone does **not** terminate TLS.
- SQLite stores submitted contact details and hashed deletion tokens.
- No advertising trackers or third-party model calls are added.
- Data is cleaned on intake or operator listing after the 90-day threshold; a continuously running cleanup timer and deployment-level retention enforcement are required for a strict maximum retention guarantee.
- Auth is a single shared operator bearer token, not user-level IAM.
- Rate limits are process-memory only; distributed abuse controls, monitoring, retention job, backups, GDPR legal basis/documentation and incident procedures remain deployment blockers.
- Do not collect customer secrets, confidential campaign information, payments, or production credentials in this alpha.

## Launch gates before real commercial exposure

1. GitHub Actions unit/integration and browser tests green.
2. HTTPS preview with isolated test database and secret-managed operator token.
3. External security review and real enforced retention/deletion policy.
4. Consent and privacy notice reviewed for target jurisdictions.
5. 10–20 advertiser interviews; 3–5 genuinely paid pilots using separate compliant invoicing workflow.
6. Only then decide on CRM, billing, AI assistance or connecting the seven other advertising platforms.