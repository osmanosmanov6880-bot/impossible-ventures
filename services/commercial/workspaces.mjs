import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

/**
 * WAVE 2 — isolated commercial workspaces.
 * Capability tokens are stored only as digests, never in plaintext.
 * This is deliberately invite-only: no public signup, SSO or email identity assertions.
 */
const ROLES = Object.freeze(['owner', 'editor', 'viewer']);
const DAYS = 86_400_000;
const tokenHash = secret => createHash('sha256').update(secret).digest('hex');
const makeToken = () => 'ivw_' + randomBytes(36).toString('base64url');
const makeId = () => randomBytes(12).toString('hex');

function parseBearer(req) {
  const h = req.headers.authorization;
  if (typeof h !== 'string' || h.length > 280 || !h.startsWith('Bearer ')) return '';
  return h.slice(7);
}
function safeSame(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length > 256 || !a) return false;
  const ah = createHash('sha256').update(a).digest();
  const bh = createHash('sha256').update(b).digest();
  return timingSafeEqual(ah, bh);
}
function printable(v, label, Err, max = 100, min = 2) {
  if (typeof v !== 'string') throw new Err(400, label + ' is required');
  const s = v.trim().replace(/\s+/g, ' ');
  if (s.length < min || s.length > max ||
      /[\u0000-\u001f\u007f-\u009f\u202a-\u202e]/.test(s)) throw new Err(400, 'Invalid ' + label);
  return s;
}
function tokenPublic(row) {
  return {
    id: row.id, label: row.label, role: row.role,
    createdAt: row.created_at, expiresAt: row.expires_at,
    revokedAt: row.revoked_at
  };
}
function workspacePublic(row) {
  return { id: row.id, name: row.name, createdAt: row.created_at, status: row.status };
}

export function createWorkspaces({ db, now = Date.now, operatorToken = '', ApiError, jsonBody, sendJSON }) {
  db.exec(
    'CREATE TABLE IF NOT EXISTS commercial_workspaces (' +
    'id TEXT PRIMARY KEY, name TEXT NOT NULL, status TEXT NOT NULL, created_at INTEGER NOT NULL);' +
    'CREATE TABLE IF NOT EXISTS commercial_tokens (' +
    'id TEXT PRIMARY KEY, workspace_id TEXT NOT NULL, token_hash TEXT NOT NULL UNIQUE, ' +
    'label TEXT NOT NULL, role TEXT NOT NULL, created_at INTEGER NOT NULL, ' +
    'expires_at INTEGER NOT NULL, revoked_at INTEGER);' +
    'CREATE INDEX IF NOT EXISTS commercial_tokens_workspace ON commercial_tokens(workspace_id);' +
    'CREATE TABLE IF NOT EXISTS commercial_audit (' +
    'id TEXT PRIMARY KEY, workspace_id TEXT NOT NULL, action TEXT NOT NULL, ' +
    'actor_token_id TEXT, subject_id TEXT, at INTEGER NOT NULL);' +
    'CREATE INDEX IF NOT EXISTS commercial_audit_ws ON commercial_audit(workspace_id, at);'
  );

  function audit(workspaceId, action, actorId, subjectId = null) {
    db.prepare('INSERT INTO commercial_audit (id,workspace_id,action,actor_token_id,subject_id,at) VALUES (?,?,?,?,?,?)')
      .run(makeId(), workspaceId, action, actorId, subjectId, now());
  }

  function requireSystem(request) {
    if (!operatorToken || operatorToken.length < 32) throw new ApiError(503, 'System operator is not configured');
    const given = parseBearer(request);
    if (!given) throw new ApiError(401, 'System operator token is required');
    if (!safeSame(given, operatorToken)) throw new ApiError(403, 'Access denied');
  }

  function requireRole(request, workspaceId, roles = ROLES) {
    if (!/^[a-f0-9]{24}$/.test(workspaceId)) throw new ApiError(404, 'Workspace not found');
    const presented = parseBearer(request);
    if (!/^ivw_[A-Za-z0-9_-]{48}$/.test(presented)) throw new ApiError(401, 'Workspace token required');
    const token = db.prepare(
      'SELECT id,workspace_id,label,role,created_at,expires_at,revoked_at FROM commercial_tokens ' +
      'WHERE token_hash = ?'
    ).get(tokenHash(presented));
    if (!token || token.workspace_id !== workspaceId ||
        token.revoked_at !== null || token.expires_at <= now()) throw new ApiError(403, 'Workspace access denied');
    const workspace = db.prepare('SELECT * FROM commercial_workspaces WHERE id = ?').get(workspaceId);
    if (!workspace || workspace.status !== 'active') throw new ApiError(403, 'Workspace is inactive');
    if (!roles.includes(token.role)) throw new ApiError(403, 'Insufficient workspace permission');
    return { token, workspace };
  }

  async function handle(req, res, path) {
    if (path === '/api/v1/operator/workspaces' && req.method === 'POST') {
      requireSystem(req);
      const input = await jsonBody(req);
      const name = printable(input.name, 'workspace name', ApiError, 110, 3);
      const id = makeId(), secret = makeToken(), keyId = makeId();
      const timestamp = now(), expiry = timestamp + 180 * DAYS;
      db.exec('BEGIN IMMEDIATE');
      try {
        db.prepare('INSERT INTO commercial_workspaces (id,name,status,created_at) VALUES (?,?,?,?)')
          .run(id, name, 'active', timestamp);
        db.prepare(
          'INSERT INTO commercial_tokens (id,workspace_id,token_hash,label,role,created_at,expires_at,revoked_at) ' +
          'VALUES (?,?,?,?,?,?,?,NULL)'
        ).run(keyId, id, tokenHash(secret), 'Initial workspace owner', 'owner', timestamp, expiry);
        audit(id, 'workspace.created', null, keyId);
        db.exec('COMMIT');
      } catch (error) { db.exec('ROLLBACK'); throw error; }
      sendJSON(res, 201, {
        workspace: { id, name, status: 'active', createdAt: timestamp },
        ownerCredential: { token: secret, id: keyId, expiresAt: expiry },
        warning: 'Store this owner token in a secure password manager; it is displayed once and cannot be recovered.'
      });
      return true;
    }
    if (path === '/api/v1/operator/workspaces' && req.method === 'GET') {
      requireSystem(req);
      const rows = db.prepare(
        'SELECT id,name,status,created_at FROM commercial_workspaces ORDER BY created_at DESC,id DESC LIMIT 100'
      ).all();
      sendJSON(res, 200, { items: rows.map(workspacePublic), total: db.prepare('SELECT COUNT(*) AS n FROM commercial_workspaces').get().n });
      return true;
    }

    const workspaceRoute = /^\/api\/v1\/workspaces\/([a-f0-9]{24})$/.exec(path);
    if (workspaceRoute && req.method === 'GET') {
      const { token, workspace } = requireRole(req, workspaceRoute[1]);
      sendJSON(res, 200, { workspace: workspacePublic(workspace), credential: tokenPublic(token) });
      return true;
    }

    // An owner can export tenant-owned data, including proposal contact details.
    // Secrets are NEVER included: only metadata about issued credentials.
    const exportRoute = /^\/api\/v1\/workspaces\/([a-f0-9]{24})\/export$/.exec(path);
    if (exportRoute && req.method === 'GET') {
      const { workspace } = requireRole(req, exportRoute[1], ['owner']);
      const campaigns = db.prepare(
        'SELECT id,title,venture,goal,channel,audience,offer,headline,body,cta_label,status,revision,created_at,updated_at ' +
        'FROM commercial_campaigns WHERE workspace_id = ? ORDER BY created_at DESC'
      ).all(workspace.id);
      const proposals = db.prepare(
        'SELECT id,campaign_id,client_name,contact_email,description,currency,setup_cents,monthly_cents,' +
        'months,total_cents,status,revision,created_at,updated_at,decided_at ' +
        'FROM commercial_proposals WHERE workspace_id = ? ORDER BY created_at DESC'
      ).all(workspace.id);
      const tokens = db.prepare(
        'SELECT id,label,role,created_at,expires_at,revoked_at FROM commercial_tokens WHERE workspace_id = ?'
      ).all(workspace.id);
      const auditRows = db.prepare(
        'SELECT id,action,actor_token_id,subject_id,at FROM commercial_audit WHERE workspace_id = ? ORDER BY at DESC'
      ).all(workspace.id);
      sendJSON(res, 200, {
        exportedAt: now(), workspace: workspacePublic(workspace), campaigns, proposals, tokenMetadata: tokens, audit: auditRows,
        note: 'Contains contact email data. Protect this local export; no original plaintext access credentials are included.'
      });
      return true;
    }

    if (workspaceRoute && req.method === 'DELETE') {
      const { workspace } = requireRole(req, workspaceRoute[1], ['owner']);
      const input = await jsonBody(req);
      if (input.confirmName !== workspace.name) throw new ApiError(422, 'Type the exact organization name to delete');
      // Scope every mutation to the authenticated tenant. Public creative links,
      // outstanding proposals and all tenant credentials cease to work immediately.
      db.exec('BEGIN IMMEDIATE');
      try {
        db.prepare('DELETE FROM commercial_proposals WHERE workspace_id = ?').run(workspace.id);
        db.prepare('DELETE FROM commercial_campaigns WHERE workspace_id = ?').run(workspace.id);
        db.prepare('DELETE FROM commercial_audit WHERE workspace_id = ?').run(workspace.id);
        db.prepare('DELETE FROM commercial_tokens WHERE workspace_id = ?').run(workspace.id);
        db.prepare('DELETE FROM commercial_workspaces WHERE id = ?').run(workspace.id);
        db.exec('COMMIT');
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
      sendJSON(res, 200, {
        deleted: true, workspaceId: workspace.id,
        note: 'Tenant data removed from active SQLite tables; physical media, server backups and logs require separate deletion controls. Global Pilot Studio submissions are separate from workspace data.'
      });
      return true;
    }

    const tokensRoute = /^\/api\/v1\/workspaces\/([a-f0-9]{24})\/tokens$/.exec(path);
    if (tokensRoute && req.method === 'GET') {
      requireRole(req, tokensRoute[1], ['owner']);
      const rows = db.prepare(
        'SELECT id,label,role,created_at,expires_at,revoked_at FROM commercial_tokens ' +
        'WHERE workspace_id = ? ORDER BY created_at DESC,id DESC LIMIT 100'
      ).all(tokensRoute[1]);
      sendJSON(res, 200, { items: rows.map(tokenPublic) });
      return true;
    }
    if (tokensRoute && req.method === 'POST') {
      const { token } = requireRole(req, tokensRoute[1], ['owner']);
      const data = await jsonBody(req);
      const label = printable(data.label, 'credential label', ApiError, 80, 3);
      if (!['editor','viewer'].includes(data.role)) throw new ApiError(400, 'New credential role must be editor or viewer');
      const ttlDays = data.ttlDays === undefined ? 30 : data.ttlDays;
      if (!Number.isInteger(ttlDays) || ttlDays < 1 || ttlDays > 90) throw new ApiError(400, 'Credential TTL must be 1–90 days');
      const active = db.prepare(
        'SELECT COUNT(*) AS n FROM commercial_tokens WHERE workspace_id = ? AND revoked_at IS NULL AND expires_at > ?'
      ).get(tokensRoute[1], now()).n;
      if (active >= 30) throw new ApiError(409, 'Workspace credential limit exceeded');
      const id = makeId(), secret = makeToken(), createdAt = now(), expiresAt = createdAt + ttlDays * DAYS;
      db.exec('BEGIN IMMEDIATE');
      try {
        db.prepare('INSERT INTO commercial_tokens (id,workspace_id,token_hash,label,role,created_at,expires_at,revoked_at) VALUES (?,?,?,?,?,?,?,NULL)')
          .run(id, tokensRoute[1], tokenHash(secret), label, data.role, createdAt, expiresAt);
        audit(tokensRoute[1], 'token.issued', token.id, id);
        db.exec('COMMIT');
      } catch(error) { db.exec('ROLLBACK'); throw error; }
      sendJSON(res, 201, {
        credential: { id, label, role: data.role, createdAt, expiresAt },
        token: secret,
        warning: 'The new token is displayed once. Do not put it in email links or client-side persistent storage.'
      });
      return true;
    }

    const revokeRoute = /^\/api\/v1\/workspaces\/([a-f0-9]{24})\/tokens\/([a-f0-9]{24})\/revoke$/.exec(path);
    if (revokeRoute && req.method === 'POST') {
      const { token } = requireRole(req, revokeRoute[1], ['owner']);
      if (token.id === revokeRoute[2]) throw new ApiError(409, 'Cannot revoke your own owner credential here');
      const info = db.prepare(
        'UPDATE commercial_tokens SET revoked_at = ? WHERE id = ? AND workspace_id = ? AND revoked_at IS NULL'
      ).run(now(), revokeRoute[2], revokeRoute[1]);
      if (!info.changes) throw new ApiError(404, 'Active credential not found');
      audit(revokeRoute[1], 'token.revoked', token.id, revokeRoute[2]);
      sendJSON(res, 200, { revoked: true });
      return true;
    }

    const rotateRoute = /^\/api\/v1\/operator\/workspaces\/([a-f0-9]{24})\/rotate-owner$/.exec(path);
    if (rotateRoute && req.method === 'POST') {
      requireSystem(req);
      const workspace = db.prepare('SELECT id FROM commercial_workspaces WHERE id = ?').get(rotateRoute[1]);
      if (!workspace) throw new ApiError(404, 'Workspace not found');
      const createdAt = now(), id = makeId(), secret = makeToken(), expiresAt = createdAt + 180 * DAYS;
      db.exec('BEGIN IMMEDIATE');
      try {
        db.prepare('UPDATE commercial_tokens SET revoked_at = ? WHERE workspace_id = ? AND role = ? AND revoked_at IS NULL')
          .run(createdAt, workspace.id, 'owner');
        db.prepare('INSERT INTO commercial_tokens (id,workspace_id,token_hash,label,role,created_at,expires_at,revoked_at) VALUES (?,?,?,?,?,?,?,NULL)')
          .run(id, workspace.id, tokenHash(secret), 'Rotated workspace owner', 'owner', createdAt, expiresAt);
        audit(workspace.id, 'owner.rotated', null, id);
        db.exec('COMMIT');
      } catch(error) { db.exec('ROLLBACK'); throw error; }
      sendJSON(res, 200, { rotated: true, ownerCredential: { id, token: secret, expiresAt } });
      return true;
    }

    const auditRoute = /^\/api\/v1\/workspaces\/([a-f0-9]{24})\/audit$/.exec(path);
    if (auditRoute && req.method === 'GET') {
      requireRole(req, auditRoute[1], ['owner']);
      const rows = db.prepare('SELECT id,action,actor_token_id,subject_id,at FROM commercial_audit WHERE workspace_id = ? ORDER BY at DESC,id DESC LIMIT 100')
        .all(auditRoute[1]);
      sendJSON(res, 200, { items: rows.map(row => ({ id: row.id, action: row.action, actorId: row.actor_token_id, subjectId: row.subject_id, at: row.at })) });
      return true;
    }

    // Campaign, finance and other tenant-scoped modules share this URL prefix.
    // Let downstream routers decide whether they own the remaining path.
    if (path.startsWith('/api/v1/operator/workspaces')) {
      throw new ApiError(404, 'Workspace API route not found');
    }
    return false;
  }

  return { handle, requireRole, requireSystem, audit };
}
