import { randomBytes, createHash, timingSafeEqual } from 'node:crypto';

export const RETENTION_DAYS = 90;
const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;
const BUDGETS = Object.freeze(['under-1k', '1k-5k', '5k-25k', '25k-plus', 'unsure']);
const GOALS = Object.freeze(['leads', 'sales', 'awareness', 'validation']);
const STATUSES = Object.freeze(['new', 'contacted', 'qualified', 'won', 'lost']);
const CONSENT_VERSION = 'pilot-v1-2026-10';

function digest(value) {
  return createHash('sha256').update(value).digest();
}

function safeEquals(value, reference) {
  if (typeof value !== 'string' || typeof reference !== 'string' || value.length > 256) return false;
  return timingSafeEqual(digest(value), digest(reference));
}

function readBearer(request) {
  const header = request.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : '';
}

function validateText(value, label, ApiError, { min = 2, max = 120 } = {}) {
  if (typeof value !== 'string') throw new ApiError(400, label + ' is required');
  const text = value.trim().replace(/\s+/g, ' ');
  if (text.length < min || text.length > max || /[\u0000-\u001f\u007f]/.test(text)) {
    throw new ApiError(400, label + ' must contain ' + min + '–' + max + ' printable characters');
  }
  return text;
}

function validateEmail(value, ApiError) {
  if (typeof value !== 'string' || value.length > 160) throw new ApiError(400, 'Valid email is required');
  const email = value.trim().toLowerCase();
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(email)) throw new ApiError(400, 'Valid email is required');
  return email;
}

function validateWebsite(value, ApiError) {
  if (value == null || value === '') return '';
  if (typeof value !== 'string' || value.length > 220) throw new ApiError(400, 'Invalid website');
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || !url.hostname.includes('.') || url.username || url.password) throw new Error('Invalid');
    return url.toString();
  } catch {
    throw new ApiError(400, 'Website must be a public HTTPS URL');
  }
}

function oneOf(value, options, label, ApiError) {
  if (!options.includes(value)) throw new ApiError(400, 'Invalid ' + label);
  return value;
}

function visibleLead(row) {
  return {
    id: row.id,
    company: row.company,
    contact: row.contact,
    email: row.email,
    website: row.website,
    goal: row.goal,
    budget: row.budget,
    locale: row.locale,
    status: row.status,
    experimentId: row.experiment_id ?? null,
    experimentArm: row.experiment_arm ?? null,
    launchId: row.launch_id ?? null,
    consentVersion: row.consent_version,
    createdAt: row.created_at
  };
}

export function createPilotRouter({ db, now, operatorToken = '', ApiError, jsonBody, sendJSON }) {
  db.exec(
    'CREATE TABLE IF NOT EXISTS pilot_leads (' +
    'id TEXT PRIMARY KEY, created_at INTEGER NOT NULL, company TEXT NOT NULL, ' +
    'contact TEXT NOT NULL, email TEXT NOT NULL, website TEXT NOT NULL, ' +
    'goal TEXT NOT NULL, budget TEXT NOT NULL, locale TEXT NOT NULL, ' +
    'status TEXT NOT NULL, consent_version TEXT NOT NULL, delete_token_hash TEXT NOT NULL, ' +
    'experiment_id TEXT, experiment_arm TEXT, launch_id TEXT);' +
    'CREATE INDEX IF NOT EXISTS pilot_leads_created ON pilot_leads(created_at);'
  );
  // Existing pilot leads remain intact on upgraded databases.
  const leadColumns = new Set(db.prepare('PRAGMA table_info(pilot_leads)').all().map(row => row.name));
  if (!leadColumns.has('experiment_id')) db.exec('ALTER TABLE pilot_leads ADD COLUMN experiment_id TEXT');
  if (!leadColumns.has('experiment_arm')) db.exec('ALTER TABLE pilot_leads ADD COLUMN experiment_arm TEXT');
  db.exec('CREATE INDEX IF NOT EXISTS pilot_leads_experiment ON pilot_leads(experiment_id,experiment_arm);');
  if (!leadColumns.has('launch_id')) db.exec('ALTER TABLE pilot_leads ADD COLUMN launch_id TEXT');
  db.exec('CREATE INDEX IF NOT EXISTS pilot_leads_launch ON pilot_leads(launch_id,created_at);');
  const byAddress = new Map();
  const operatorAttemptsByAddress = new Map();

  function cleanup() {
    db.prepare('DELETE FROM pilot_leads WHERE created_at < ?').run(now() - RETENTION_MS);
  }

  cleanup();
  const purgeTimer = setInterval(cleanup, 60_000);
  purgeTimer.unref();

  function limitIntake(request) {
    const address = request.socket.remoteAddress || 'unknown';
    const current = now();
    const previous = byAddress.get(address);
    const record = previous && current - previous.at < 3_600_000
      ? previous : { at: current, count: 0 };
    record.count += 1;
    byAddress.set(address, record);
    if (byAddress.size > 5000) {
      for (const [key, entry] of byAddress) {
        if (current - entry.at > 3_600_000) byAddress.delete(key);
      }
    }
    if (record.count > 5) throw new ApiError(429, 'Too many pilot requests. Try later.');
  }

  function limitOperatorRequests(request) {
    const address = request.socket.remoteAddress || 'unknown';
    const current = now();
    const previous = operatorAttemptsByAddress.get(address);
    const record = previous && current - previous.at < 60_000
      ? previous : { at: current, count: 0 };
    record.count += 1;
    operatorAttemptsByAddress.set(address, record);
    if (operatorAttemptsByAddress.size > 5000) {
      for (const [key, value] of operatorAttemptsByAddress) {
        if (current - value.at > 60_000) operatorAttemptsByAddress.delete(key);
      }
    }
    if (record.count > 30) throw new ApiError(429, 'Operator request limit exceeded; retry later');
  }

  function requireOperator(request) {
    limitOperatorRequests(request);
    if (typeof operatorToken !== 'string' || operatorToken.length < 32) {
      throw new ApiError(503, 'Operator access is not configured');
    }
    const given = readBearer(request);
    if (!given) throw new ApiError(401, 'Operator token required');
    if (!safeEquals(given, operatorToken)) throw new ApiError(403, 'Operator token invalid');
  }

  async function handle(request, response, pathname) {
    const method = request.method;
    if (pathname === '/api/v1/pilots' && method === 'POST') {
      limitIntake(request);
      const body = await jsonBody(request);
      if (body.website_confirm) {
        sendJSON(response, 202, { received: true });
        return true;
      }
      if (body.consent !== true) throw new ApiError(422, 'Explicit contact and retention consent required');
      const company = validateText(body.company, 'Company', ApiError, { max: 120 });
      const contact = validateText(body.contact, 'Contact', ApiError, { max: 100 });
      const email = validateEmail(body.email, ApiError);
      const website = validateWebsite(body.website, ApiError);
      const goal = oneOf(body.goal, GOALS, 'goal', ApiError);
      const budget = oneOf(body.budget, BUDGETS, 'budget', ApiError);
      const locale = oneOf(body.locale, ['ru', 'en', 'zh'], 'locale', ApiError);
      cleanup();
      const id = randomBytes(12).toString('hex');
      const deleteToken = randomBytes(32).toString('base64url');
      let attributedSession = null;
      const a = body.attribution;
      const l = body.launchAttribution;
      if (a && l) throw new ApiError(422, 'Only one attribution source may be claimed');
      if (a !== undefined && a !== null) {
        if (!a || typeof a !== 'object' || Array.isArray(a) ||
            !/^[a-f0-9]{32}$/.test(a.sessionId || '') ||
            !/^iva_[A-Za-z0-9_-]{32}$/.test(a.receipt || '')) {
          throw new ApiError(422, 'Invalid experiment attribution receipt');
        }
        attributedSession = db.prepare(
          'SELECT id,experiment_id,arm,created_at,receipt_hash,cta_recorded,attributed_lead_id ' +
          'FROM ab_sessions WHERE id = ?'
        ).get(a.sessionId);
        const age = attributedSession ? now() - attributedSession.created_at : -1;
        if (!attributedSession || age < 0 || age > 7 * 86_400_000 ||
            attributedSession.cta_recorded !== 1 || attributedSession.attributed_lead_id !== null ||
            !attributedSession.receipt_hash ||
            !safeEquals(digest(a.receipt).toString('hex'), attributedSession.receipt_hash)) {
          throw new ApiError(422, 'Experiment attribution receipt is invalid, expired or already claimed');
        }
      }
      let attributedLaunch = null;
      if (l !== undefined && l !== null) {
        if (!l || typeof l !== 'object' || Array.isArray(l) ||
            !/^[a-f0-9]{32}$/.test(l.sessionId || '') ||
            !/^ivl_[A-Za-z0-9_-]{32}$/.test(l.receipt || '')) {
          throw new ApiError(422, 'Invalid launch attribution receipt');
        }
        attributedLaunch=db.prepare(
          'SELECT id,launch_id,created_at,receipt_hash,cta_recorded,claimed_lead_id ' +
          'FROM launch_sessions WHERE id=?'
        ).get(l.sessionId);
        const age=attributedLaunch ? now()-attributedLaunch.created_at : -1;
        if (!attributedLaunch || age<0 || age>7*86_400_000 ||
            attributedLaunch.cta_recorded!==1 || attributedLaunch.claimed_lead_id!==null ||
            !attributedLaunch.receipt_hash ||
            !safeEquals(digest(l.receipt).toString('hex'), attributedLaunch.receipt_hash)) {
          throw new ApiError(422,'Launch attribution receipt is invalid, expired or already used');
        }
      }
      db.exec('BEGIN IMMEDIATE');
      try {
        if (attributedSession) {
          const claimed = db.prepare(
            'UPDATE ab_sessions SET attributed_lead_id = ? WHERE id = ? ' +
            'AND cta_recorded = 1 AND receipt_hash = ? AND attributed_lead_id IS NULL'
          ).run(id, attributedSession.id, digest(a.receipt).toString('hex'));
          if (!claimed.changes) throw new ApiError(409, 'Experiment attribution has already been claimed');
        }
        if (attributedLaunch) {
          const claimed=db.prepare(
            'UPDATE launch_sessions SET claimed_lead_id=? WHERE id=? AND cta_recorded=1 '+
            'AND receipt_hash=? AND claimed_lead_id IS NULL'
          ).run(id,attributedLaunch.id,digest(l.receipt).toString('hex'));
          if (!claimed.changes) throw new ApiError(409,'Launch receipt has already been claimed');
        }
        db.prepare(
          'INSERT INTO pilot_leads (id,created_at,company,contact,email,website,goal,budget,locale,status,consent_version,delete_token_hash,experiment_id,experiment_arm,launch_id) ' +
          'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
        ).run(id, now(), company, contact, email, website, goal, budget, locale,
          'new', CONSENT_VERSION, digest(deleteToken).toString('hex'),
          attributedSession?.experiment_id ?? null, attributedSession?.arm ?? null,
          attributedLaunch?.launch_id ?? null);
        db.exec('COMMIT');
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
      sendJSON(response, 201, {
        received: true, requestId: id, deleteToken, retentionDays: RETENTION_DAYS,
        attributed: Boolean(attributedSession || attributedLaunch),
        attributionSource: attributedLaunch?'first-party-launch':attributedSession?'experiment':null,
        note: 'Submission is not a qualified lead or verified paid customer.'
      });
      return true;
    }

    const deletion = /^\/api\/v1\/pilots\/([0-9a-f]{24})$/.exec(pathname);
    if (deletion && method === 'DELETE') {
      const row = db.prepare('SELECT delete_token_hash FROM pilot_leads WHERE id = ?').get(deletion[1]);
      if (!row) throw new ApiError(404, 'Pilot request not found');
      const presented = readBearer(request);
      if (!presented || !safeEquals(digest(presented).toString('hex'), row.delete_token_hash)) {
        throw new ApiError(403, 'Deletion token invalid');
      }
      db.prepare('DELETE FROM pilot_leads WHERE id = ?').run(deletion[1]);
      sendJSON(response, 200, { deleted: true });
      return true;
    }

    if (pathname === '/api/v1/operator/pilots' && method === 'GET') {
      requireOperator(request);
      cleanup();
      const rows = db.prepare(
        'SELECT id,created_at,company,contact,email,website,goal,budget,locale,status,consent_version,experiment_id,experiment_arm,launch_id ' +
        'FROM pilot_leads ORDER BY created_at DESC, id DESC LIMIT 100'
      ).all();
      const counts = { new: 0, contacted: 0, qualified: 0, won: 0, lost: 0 };
      for (const row of db.prepare('SELECT status, COUNT(*) AS amount FROM pilot_leads GROUP BY status').all()) {
        if (Object.hasOwn(counts, row.status)) counts[row.status] = row.amount;
      }
      sendJSON(response, 200, {
        items: rows.map(visibleLead),
        summary: { ...counts, total: Object.values(counts).reduce((a, b) => a + b, 0) },
        note: 'Statuses are manually assigned, not payment or revenue verification.'
      });
      return true;
    }

    const stateMatch = /^\/api\/v1\/operator\/pilots\/([0-9a-f]{24})\/status$/.exec(pathname);
    if (stateMatch && method === 'POST') {
      requireOperator(request);
      const body = await jsonBody(request);
      const status = oneOf(body.status, STATUSES, 'status', ApiError);
      cleanup();
      const info = db.prepare('UPDATE pilot_leads SET status = ? WHERE id = ?').run(status, stateMatch[1]);
      if (!info.changes) throw new ApiError(404, 'Pilot request not found');
      sendJSON(response, 200, { updated: true, status });
      return true;
    }

    if (pathname.startsWith('/api/v1/pilots') || pathname.startsWith('/api/v1/operator/pilots')) {
      throw new ApiError(404, 'API route not found');
    }
    return false;
  }
  handle.stop = () => clearInterval(purgeTimer);
  return handle;
}
