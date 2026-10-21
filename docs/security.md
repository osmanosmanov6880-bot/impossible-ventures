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
- SQLite remains on the server host; configure encrypted disks, backups, retention purge and incident response externally.
- No TLS termination is included. **Never expose directly to the Internet without HTTPS proxy and operational hardening**.
- Do not enter personal or commercially sensitive information. This prototype has not undergone a privacy, legal or penetration assessment.
- Users should verify factual claims before publishing a generated campaign.
- Brand ownership, trademarks and domains remain unverified.

Production gates: threat model, authorization review, automated accessibility/browser QA, GDPR assessment, data deletion workflow, observability, load tests, incident response, and independent security review.
