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
    'status TEXT NOT NULL, consent_version TEXT NOT NULL, delete_token_hash TEXT NOT NULL);' +
    'CREATE INDEX IF NOT EXISTS pilot_leads_created ON pilot_leads(created_at);'
  );
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
      db.prepare(
        'INSERT INTO pilot_leads (id,created_at,company,contact,email,website,goal,budget,locale,status,consent_version,delete_token_hash) ' +
        'VALUES (?,?,?,?,?,?,?,?,?,?,?,?)'
      ).run(id, now(), company, contact, email, website, goal, budget, locale,
        'new', CONSENT_VERSION, digest(deleteToken).toString('hex'));
      sendJSON(response, 201, { received: true, requestId: id, deleteToken, retentionDays: RETENTION_DAYS });
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
        'SELECT id,created_at,company,contact,email,website,goal,budget,locale,status,consent_version ' +
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

    if (pathname.startsWith('/api/v1/pilots') || pathname.startsWith('/api/v1/operator/')) {
      throw new ApiError(404, 'API route not found');
    }
    return false;
  }
  handle.stop = () => clearInterval(purgeTimer);
  return handle;
}
