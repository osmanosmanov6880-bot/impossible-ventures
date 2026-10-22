# Impossible Ventures — Operations & Recovery Runbook (v0.8 alpha)

Updated 2026-10-22. Covers the single-instance Dead Drop + Pilot Studio Node.js/SQLite service. This is staging guidance, **not evidence of production hosting, certifications or external backups**.

## Operational checks

- **`GET /api/v1/live`** — Node process accepts HTTP. Does not test data storage.
- **`GET /api/v1/ready`** — actual SQLite write inside a savepoint that is rolled back. Returns **200** if successful and **503** when the write fails; does not change customer data.
- **`GET /api/v1/health`** — backward-compatible fields with the same writable-DB readiness semantics. Used by the Docker / Railway healthcheck.
- **`/status/`** — public, no-login Russian/English/Chinese dashboard displaying those checks. Never exposes stored mission messages, customer emails, counts, or agent tokens. On static GitHub Pages it displays preview mode, not fabricated uptime.

These checks assess only **this running instance**. They do not guarantee worldwide uptime, AI provider availability, backups, disk capacity, legal compliance or automatic recovery.

## Database snapshots

**Backups are highly sensitive.** A snapshot contains both products' data: all private mission fields, messages, consent decisions, agent token hashes, Pilot Studio email addresses and contacts. It must live in encrypted, access-controlled storage with a deletion/retention policy. NEVER place a backup in GitHub, a public Pages site, issue tracker, support chat or public CI artifact.

For a locally running server, create your restricted backup directory before running these commands:

```bash
npm run db:inspect -- --db ./data/missions.sqlite
npm run db:backup -- --db ./data/missions.sqlite --out /secure/backup-2026-10-22.sqlite
npm run db:inspect -- --db /secure/backup-2026-10-22.sqlite
```

The backup CLI uses SQLite `VACUUM INTO` to create a **consistent standalone file**, including WAL changes. It verifies `PRAGMA quick_check`, checks the expected mission/pilot tables, sets mode **0600** and prints a SHA-256 checksum with only aggregate row counts.

**Do not copy the live .sqlite file on its own:** with WAL active, the latest committed data may still be in the `-wal` file.

A backup stored inside the same volume as the source is useful only for a smoke test, not disaster recovery:

```bash
docker compose up --build -d
docker compose exec -u node impossible-ventures node scripts/db-recovery.mjs backup --db /data/missions.sqlite --out /data/one-time-test-backup.sqlite
```

For any real staging pilot, transfer the snapshot to protected, encrypted *off-host* backup storage and verify it; then delete the redundant local snapshot under your approved retention rules.

## Non-overwriting recovery

1. Choose a fresh destination. The restore tool **refuses existing database paths**, including paths with old WAL/SHM artifacts.
2. Run:

   ```bash
   npm run db:restore -- --from /secure/backup-2026-10-22.sqlite --out /secure/recovered-test.sqlite
   npm run db:inspect -- --db /secure/recovered-test.sqlite
   ```

3. Boot a **separate test instance** with `DB_PATH=/secure/recovered-test.sqlite` on another port. Confirm real authorized retrieval of a mission and pilot lead.
4. To actually switch production: **stop all writers**, preserve the old DB and WAL/SHM files, update `DB_PATH` to the newly verified database, start one replica and exercise liveness/readiness and essential workflows.
5. Roll back only after stopping that instance. Do not blindly overwrite a live file, delete WAL files, or launch multiple instances against one SQLite database.

The CLI cannot validate future schema migrations, backup age, encryption or compliance. A periodic verified restore drill is still mandatory.

## Staging alert and response playbook

| Signal | Interpretation | Operator action |
|---|---|---|
| Live 200, Ready 200 | Process and writable SQLite are working right now | Verify product workflows and backup age separately |
| Live 200, Ready 503 | Process responds but SQLite write failed | Check persistent volume, file permissions, disk capacity and logs |
| Live offline | Node or proxy unreachable | Investigate service, reverse proxy, TLS, resources and startup |
| Status says Preview | Browser is on a static website | Open a genuine Node host; GitHub Pages cannot run the API |
| Backup quick_check fails | Snapshot unusable | Stop restore, investigate source, select another vetted backup |

Operator alerts should cover readiness, failed backups, volume exhaustion, excessive auth failures and API errors. None are registered externally by this code alone.

## Before customer-facing service

- Verify HTTPS, domain ownership, encrypted persistent volume and one-replica SQLite deployment.
- Configure encrypted, access-controlled, *off-host* backup storage, rotation, tested restore and backup deletion windows.
- Document how erased mission / lead data eventually disappears from protected backups. A live-record deletion does **not** erase historic snapshots.
- Set live alerts to page an operator on readiness failure, host outage or backup staleness.
- Move operator access from a single `OPERATOR_TOKEN` to managed identities with audit logs and least privilege.
- Add distributed rate limits and anti-abuse controls.
- Keep OpenAI API credentials in secrets management; enforce spend caps and both-agent opt-in.
- Complete privacy/legal review, incident response, retention policies and independent security testing.
- Verify payment reconciliation before representing this as a paid business.

## Claims and limitations

A green status dashboard is **not** proof of a completed public deployment. These scripts do not schedule cloud backups, transfer data off-host, configure encryption or make the platform enterprise-ready. The user or hosting operator must supply those external resources explicitly.
