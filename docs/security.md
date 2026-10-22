# Security model and gaps — alpha

## Implemented in source
- Random 32-byte bearer tokens; only SHA-256 digests persist on disk.
- Eight-character cryptographically generated room identifiers.
- Role-specific JSON projections; private fields are never sent to the opposing role before finalization.
- Explicit server input length and enum validation. JSON body limit: 16 KiB.
- Role message quota, one-time room join, finalize preconditions.
- Static file allowlist, security response headers and a restrictive CSP on the Dead Drop interface.
- Single-process, per-remote-IP POST request limit.
- No third-party analytics or LLM requests in the alpha.

## Known gaps
- Room code is an invitation capability and can be used by whoever possesses it before the intended person joins.
- Session tokens in sessionStorage can be compromised by XSS or malware; do not use for sensitive accounts.
- No user login, MFA, token rotation/revocation, distributed rate limiter, WAF, audit events, or security monitoring.
- SQLite remains on the server host; v0.5 adds room erasure, secure_delete, WAL checkpoint and automatic expiry pruning. Configure encrypted disks, production backup and retention policies, monitoring and incident response separately.
- No TLS termination is included. **Never expose directly to the Internet without HTTPS proxy and operational hardening**.
- Do not enter personal or commercially sensitive information. This prototype has not undergone a privacy, legal or penetration assessment.
- Users should verify factual claims before publishing a generated campaign.
- Brand ownership, trademarks and domains remain unverified.

Production gates: threat model, authorization review, automated accessibility/browser QA, GDPR assessment, data deletion workflow, observability, load tests, incident response, and independent security review.


## Additional v0.4 safeguards

- Explicit opt-in by **both** Agent Vector and Agent Echo is enforced on the server before optional external AI processing.
- Role-specific consent states can be revoked before finalization; no AI call is made when either consent flag is false.
- Server-side OpenAI credential is read from the process environment and never exposed in browser responses.
- Structured model output is validated and cannot replace the submitted brand, audience, evidence field or transmitted messages. A failed/slow provider yields a rules-based fallback.
- AI response is requested with `store: false`; this is not a guarantee of zero data retention or regulatory compliance.
- One successful dossier finalization per room limits duplicate model usage. An in-memory per-room lock prevents concurrent finalizations.
- Async join/message mutations re-read the latest SQLite state before mutation.
- Local database and screenshot artifacts are excluded from source control by `.gitignore`.

### Gaps that remain

- **Mutual consent alone does not make processing lawful or GDPR-compliant**; provider terms, data flows, DPA, purpose, legal basis, retention/deletion, geographic transfers and incident procedures require independent review.
- No production authentication, tenant-specific permissions, anti-bot protection, distributed rate limits or financial spend caps.
- Requests go to a third-party model API when both agents opt in. Do not submit personal, confidential, regulated or client-restricted data.
- Consent flags are scoped to ephemeral bearer tokens, not verified legal identities.
- No model hallucination-free guarantee. Human fact-checking of all campaign materials is mandatory.
- No public server/TLS/monitoring has been confirmed. Do not represent the source as production-hardened.

## v0.7 Experiment Lab: measured research safeguards and remaining gaps

- Operator-created campaigns are server-authenticated; drafts are invisible to public catalogs and can be activated explicitly.
- Participants must explicitly opt in to create a measured A/B session. The non-measured demonstration does not write a session.
- Each visit receives a random 256-bit bearer token and random session ID; only a SHA-256 token digest and anonymous assignment are stored in SQLite.
- Only the first CTA per session is included in the aggregate, using a transaction for idempotency; choice branch stays in browser memory and is not transmitted.
- Anonymous sessions expire after seven days; daily counters are kept for 90 days. Startup, scheduled hourly and operator reads trigger cleanup.
- Single-instance memory-based IP throttling can still temporarily retain requester IPs; reverse-proxy logs may store IP and demand independent privacy controls.
- The client does not use marketing cookies, browser storage or third-party trackers for the experiment.
- Aggregates count technical session starts and CTA clicks only; they do not prove human reach, sales, ad performance or lift.
- Content is inserted with DOM textContent, not interpolated into raw HTML. Exported spreadsheet values are neutralized against formula execution.
- Remaining work includes stronger identity and MFA, granular operator roles, abuse/bot mitigation, distributed rate limits, TLS and legal analysis, monitoring and backup deletion enforcement. These are deployment blockers, not optional polish.

## Five-wave v1.0-beta security and customer-facing financial boundaries

- Organizations and their content are isolated by workspace ID. Only a configured system OPERATOR_TOKEN may create a workspace. Workspace access is controlled by independent random capability tokens; only hashes are stored, not plaintext.
- The owner may issue editor/viewer credentials (1–90 days), inspect audit metadata, revoke access and delete the workspace. Owner credentials expire after 180 days, with rotation under system operator control. The role system is **not** employee identity verification, MFA, password login, SSO or automatic onboarding.
- Campaign editing uses an optimistic revision check. Only owners approve public previews or publish private proposal links. Published creatives reveal only public copy, not a private workspace ID or customer contact.
- Proposals are tenant-scoped and do not expose client email to anonymous visitors. Private viewing requires a long bearer token in the request Authorization header. The browser reads the shared fragment token into ephemeral memory, removing it from history. Link decisions are **not validated human identity signatures** and no payments are processed.
- A/B-to-Pilot Studio attribution is based on a cryptographically random, one-use server-verified CTA receipt held temporarily in sessionStorage, and a **separate contact form consent**. The API rejects reused, invalid or expired receipts and links only the actual submitted form to the recorded experiment arm.
- Proposal contact records are purged after 180 days of alpha retention (startup/hourly/normal API read); other workspace content remains until owner-driven export/delete. Runtime deletion does not remove backups, proxy logs or screenshots.
- Commercial Command is still a **single Node server and SQLite store**. Rate limits are process-local, shared system operator key is not least-privilege IAM, tenant isolation is application-enforced rather than PostgreSQL row-level policy. An independent security review, TLS, WAF, DPA and authorized data controller information are required before external production traffic.
