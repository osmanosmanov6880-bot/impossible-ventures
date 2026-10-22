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
