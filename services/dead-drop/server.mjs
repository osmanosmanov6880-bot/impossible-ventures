import { createServer } from 'node:http';
import { randomBytes, createHash, timingSafeEqual } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { createReadStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPilotRouter } from '../pilot-studio/pilots.mjs';
import { createExperimentRouter } from '../experiment-lab/experiments.mjs';
import { createRepublicRouter } from '../attention-republic/republic.mjs';
import { refineDossier } from './creative-engine.mjs';
import { localizeRuleDossier } from './dossier-locales.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const CURRENT_FILE = fileURLToPath(import.meta.url);
const ROOM_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const MAX_MESSAGES = 3;
const MAX_ROOM_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function requiredText(value, label, limit = 180) {
  if (typeof value !== 'string') throw new ApiError(400, label + ' is required');
  const normalized = value.trim().replace(/\s+/g, ' ');
  if (normalized.length < 3 || normalized.length > limit) {
    throw new ApiError(400, label + ' must be 3–' + limit + ' characters');
  }
  return normalized;
}

function enumValue(value, allowed, label) {
  if (!allowed.includes(value)) throw new ApiError(400, 'Invalid ' + label);
  return value;
}

function newRoom() {
  const bytes = randomBytes(8);
  return Array.from(bytes, byte => ROOM_ALPHABET[byte % ROOM_ALPHABET.length]).join('');
}

function newToken() {
  return randomBytes(32).toString('base64url');
}

function tokenDigest(token) {
  return createHash('sha256').update(token).digest();
}

function matchesToken(supplied, storedHex) {
  if (typeof supplied !== 'string' || !storedHex || supplied.length > 128) return false;
  const expected = Buffer.from(storedHex, 'hex');
  const actual = tokenDigest(supplied);
  return expected.length === actual.length && timingSafeEqual(actual, expected);
}

function sessionView(mission, role) {
  const messages = mission.messages.map(entry => ({
    role: entry.role,
    text: entry.text,
    at: entry.at
  }));
  return {
    code: mission.code,
    brand: mission.host.brand,
    objective: mission.host.objective,
    status: mission.status,
    role,
    joined: Boolean(mission.guest),
    aiConsent: {
      self: Boolean(mission.aiConsent?.[role]),
      partner: Boolean(mission.aiConsent?.[role === 'product' ? 'audience' : 'product'])
    },
    ownIntel: role === 'product'
      ? {
          product: mission.host.product,
          proof: mission.host.proof
        }
      : {
          audience: mission.guest.audience,
          friction: mission.guest.friction,
          channel: mission.guest.channel
        },
    messages,
    quota: {
      used: mission.messages.filter(m => m.role === role).length,
      max: MAX_MESSAGES,
      partnerUsed: mission.messages.filter(m => m.role !== role).length
    },
    createdAt: mission.createdAt,
    expiresAt: mission.createdAt + MAX_ROOM_AGE_MS,
    dossier: mission.status === 'finalized' ? mission.dossier : null
  };
}

function buildDossier(mission) {
  const host = mission.host;
  const guest = mission.guest;
  const productSignal = mission.messages.find(m => m.role === 'product');
  const audienceSignal = mission.messages.find(m => m.role === 'audience');
  const channelLabel = { social: 'social sequence', video: 'short-form film', landing: 'interactive landing experience' }[guest.channel];
  const action = { awareness: 'Discover the story', leads: 'Request the briefing', launch: 'See what is new' }[host.objective];
  return {
    campaign: 'OPERATION / THE UNSENT SIGNAL',
    brand: host.brand,
    audience: guest.audience,
    openingHook: 'THE STATUS QUO — ' + guest.friction.replace(/[.!?]+$/, '') + '. What would a better alternative look like?',
    concept: 'Turn a familiar tension for ' + guest.audience + ' into a mystery. The audience chooses whether to decode the message before discovering ' + host.product + ' from ' + host.brand + '.',
    execution: 'Build a ' + channelLabel + ' in three beats: interruption, audience choice, and evidence-led reveal.',
    storyboard: [
      { beat: '01 / INTERCEPT', direction: 'Open with the real audience tension: ' + guest.friction + '.' },
      { beat: '02 / DECISION', direction: 'Offer two short choices that expose what the audience values. Avoid asking for personal data.' },
      { beat: '03 / REVEAL', direction: 'Introduce ' + host.product + ' as a possible response; support the claim only with verified evidence.' }
    ],
    callToAction: action,
    evidenceToVerify: host.proof,
    interceptedSignals: {
      productAgent: productSignal ? productSignal.text : '',
      audienceAgent: audienceSignal ? audienceSignal.text : ''
    },
    validation: 'Compare this concept with a direct-response control. Measure qualified actions and repeat engagement, not just clicks.',
    generationMethod: 'rules',
    disclosure: 'Creative hypothesis only. Product evidence is user-supplied and has not been independently verified. No live AI model was used.'
  };
}

function saveMission(db, mission) {
  db.prepare('INSERT INTO missions (code, created_at, payload) VALUES (?, ?, ?) ON CONFLICT(code) DO UPDATE SET payload = excluded.payload')
    .run(mission.code, mission.createdAt, JSON.stringify(mission));
}

function loadMission(db, code, now) {
  const row = db.prepare('SELECT payload FROM missions WHERE code = ?').get(code);
  if (!row) throw new ApiError(404, 'Mission not found');
  const mission = JSON.parse(row.payload);
  if (!mission.aiConsent) mission.aiConsent = { product: false, audience: false };
  if (now() - mission.createdAt > MAX_ROOM_AGE_MS) {
    db.prepare('DELETE FROM missions WHERE code = ?').run(code);
    throw new ApiError(410, 'Mission expired');
  }
  return mission;
}

function authorizedRole(request, mission) {
  const header = request.headers.authorization || '';
  if (!header.startsWith('Bearer ')) throw new ApiError(401, 'Agent token required');
  const token = header.slice(7);
  if (matchesToken(token, mission.hostTokenHash)) return 'product';
  if (matchesToken(token, mission.guestTokenHash)) return 'audience';
  throw new ApiError(403, 'Agent token invalid');
}

async function jsonBody(request) {
  if (!(request.headers['content-type'] || '').toLowerCase().startsWith('application/json')) {
    throw new ApiError(415, 'JSON content type required');
  }
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 16_384) throw new ApiError(413, 'Request too large');
    chunks.push(chunk);
  }
  try {
    const data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Not an object');
    return data;
  } catch {
    throw new ApiError(400, 'Invalid JSON object');
  }
}

const STATIC_FILES = new Map([
  ['/', 'index.html'],
  ['/privacy.html', 'privacy.html'],
  ['/status/', 'apps/status/index.html'],
  ['/status/index.html', 'apps/status/index.html'],
  ['/status/style.css', 'apps/status/style.css'],
  ['/status/app.js', 'apps/status/app.js'],
  ['/apps/dead-drop/', 'apps/dead-drop/index.html'],
  ['/apps/dead-drop/index.html', 'apps/dead-drop/index.html'],
  ['/apps/dead-drop/app.js', 'apps/dead-drop/app.js'],
  ['/apps/dead-drop/i18n.js', 'apps/dead-drop/i18n.js'],
  ['/apps/dead-drop/style.css', 'apps/dead-drop/style.css'],
  ['/apps/dead-drop/favicon.svg', 'apps/dead-drop/favicon.svg'],
  ['/apps/appeal-2049/', 'apps/appeal-2049/index.html'],
  ['/apps/appeal-2049/index.html', 'apps/appeal-2049/index.html'],
  ['/apps/appeal-2049/app.js', 'apps/appeal-2049/app.js'],
  ['/apps/appeal-2049/style.css', 'apps/appeal-2049/style.css'],
  ['/apps/appeal-2049/tribunal-engine.mjs', 'apps/appeal-2049/tribunal-engine.mjs'],
  ['/apps/shared/studio.css', 'apps/shared/studio.css'],
  ['/apps/antipersona/', 'apps/antipersona/index.html'],
  ['/apps/antipersona/index.html', 'apps/antipersona/index.html'],
  ['/apps/antipersona/app.js', 'apps/antipersona/app.js'],
  ['/apps/antipersona/engine.mjs', 'apps/antipersona/engine.mjs'],
  ['/apps/brief-theatre/', 'apps/brief-theatre/index.html'],
  ['/apps/brief-theatre/index.html', 'apps/brief-theatre/index.html'],
  ['/apps/brief-theatre/app.js', 'apps/brief-theatre/app.js'],
  ['/apps/brief-theatre/engine.mjs', 'apps/brief-theatre/engine.mjs'],
  ['/apps/adbiome/', 'apps/adbiome/index.html'],
  ['/apps/adbiome/index.html', 'apps/adbiome/index.html'],
  ['/apps/adbiome/app.js', 'apps/adbiome/app.js'],
  ['/apps/adbiome/engine.mjs', 'apps/adbiome/engine.mjs'],
  ['/apps/museum-of-attention/', 'apps/museum-of-attention/index.html'],
  ['/apps/museum-of-attention/index.html', 'apps/museum-of-attention/index.html'],
  ['/apps/museum-of-attention/app.js', 'apps/museum-of-attention/app.js'],
  ['/apps/museum-of-attention/engine.mjs', 'apps/museum-of-attention/engine.mjs'],
  ['/apps/attention-republic/', 'apps/attention-republic/index.html'],
  ['/apps/attention-republic/index.html', 'apps/attention-republic/index.html'],
  ['/apps/attention-republic/app.js', 'apps/attention-republic/app.js'],
  ['/apps/attention-republic/operator/', 'apps/attention-republic/operator.html'],
  ['/apps/attention-republic/operator.html', 'apps/attention-republic/operator.html'],
  ['/apps/attention-republic/operator.js', 'apps/attention-republic/operator.js'],
  ['/pilot/', 'apps/pilot-studio/index.html'],
  ['/pilot/index.html', 'apps/pilot-studio/index.html'],
  ['/pilot/app.js', 'apps/pilot-studio/app.js'],
  ['/pilot/style.css', 'apps/pilot-studio/style.css'],
  ['/pilot/operator/', 'apps/pilot-studio/operator.html'],
  ['/pilot/operator.html', 'apps/pilot-studio/operator.html'],
  ['/pilot/operator.js', 'apps/pilot-studio/operator.js'],
  ['/experiments/', 'apps/experiment-lab/index.html'],
  ['/experiments/index.html', 'apps/experiment-lab/index.html'],
  ['/experiments/app.js', 'apps/experiment-lab/app.js'],
  ['/experiments/style.css', 'apps/experiment-lab/style.css'],
  ['/experiments/operator/', 'apps/experiment-lab/operator.html'],
  ['/experiments/operator/index.html', 'apps/experiment-lab/operator.html'],
  ['/experiments/operator/app.js', 'apps/experiment-lab/operator.js']
]);

function sendJSON(response, status, payload) {
  const text = JSON.stringify(payload);
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(text)
  });
  response.end(text);
}

function sendStatic(response, pathname) {
  const filename = STATIC_FILES.get(pathname);
  if (!filename) throw new ApiError(404, 'Page not found');
  const path = resolve(ROOT, filename);
  if (!existsSync(path)) throw new ApiError(404, 'Page not found');
  const mime = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.svg': 'image/svg+xml'
  }[extname(path)] || 'application/octet-stream';
  if (pathname.startsWith('/apps/dead-drop/') || pathname.startsWith('/apps/appeal-2049/') || pathname.startsWith('/apps/antipersona/') || pathname.startsWith('/apps/brief-theatre/') || pathname.startsWith('/apps/adbiome/') || pathname.startsWith('/apps/museum-of-attention/') || pathname.startsWith('/apps/attention-republic/') || pathname.startsWith('/apps/shared/') || pathname.startsWith('/pilot/') || pathname.startsWith('/experiments/') || pathname.startsWith('/status/')) {
    response.setHeader('Content-Security-Policy', "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; font-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'");
  }
  response.writeHead(200, {
    'Content-Type': mime,
    'Content-Length': statSync(path).size,
    'Cache-Control': 'no-cache'
  });
  createReadStream(path).pipe(response);
}

function throttle(map, request, now) {
  const ip = request.socket.remoteAddress || 'unknown';
  const current = now();
  const existing = map.get(ip);
  const entry = existing && current - existing.window < 60_000 ? existing : { window: current, count: 0 };
  entry.count += 1;
  map.set(ip, entry);
  if (map.size > 5000) {
    for (const [key, value] of map) {
      if (current - value.window > 60_000) map.delete(key);
    }
  }
  if (entry.count > 90) throw new ApiError(429, 'Request limit exceeded; retry later');
}

export function createApp({
  dbPath = process.env.DB_PATH || join(ROOT, 'data', 'missions.sqlite'),
  now = Date.now,
  aiKey = process.env.OPENAI_API_KEY,
  aiModel = process.env.OPENAI_MODEL,
  modelRefiner = refineDossier
} = {}) {
  if (dbPath !== ':memory:') mkdirSync(dirname(resolve(dbPath)), { recursive: true });
  const db = new DatabaseSync(dbPath);
  db.exec('PRAGMA journal_mode = WAL; PRAGMA secure_delete = ON; CREATE TABLE IF NOT EXISTS missions (code TEXT PRIMARY KEY, created_at INTEGER NOT NULL, payload TEXT NOT NULL); CREATE INDEX IF NOT EXISTS missions_created_at_idx ON missions (created_at); CREATE TABLE IF NOT EXISTS runtime_healthcheck (id INTEGER PRIMARY KEY, touched_at INTEGER NOT NULL);');
  function storageReady() {
    let started = false;
    try {
      db.exec('SAVEPOINT readiness_probe');
      started = true;
      db.prepare('INSERT INTO runtime_healthcheck (id, touched_at) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET touched_at = excluded.touched_at').run(now());
      db.exec('ROLLBACK TO SAVEPOINT readiness_probe; RELEASE SAVEPOINT readiness_probe');
      return true;
    } catch {
      if (started) {
        try { db.exec('ROLLBACK TO SAVEPOINT readiness_probe; RELEASE SAVEPOINT readiness_probe'); } catch {}
      }
      return false;
    }
  }
  // Mission-specific cleanup. Pilot Studio has its own retention mechanism.
  function checkpointAfterDeletion() {
    if (dbPath !== ':memory:') db.exec('PRAGMA wal_checkpoint(TRUNCATE)');
  }
  function pruneExpired() {
    const result = db.prepare('DELETE FROM missions WHERE created_at < ?').run(now() - MAX_ROOM_AGE_MS);
    if (result.changes > 0) checkpointAfterDeletion();
    return Number(result.changes);
  }
  pruneExpired();
  const cleanupTimer = setInterval(pruneExpired, CLEANUP_INTERVAL_MS);
  cleanupTimer.unref();
  const requestsByIP = new Map();
  const handlePilots = createPilotRouter({ db, now, operatorToken: process.env.OPERATOR_TOKEN || '', ApiError, jsonBody, sendJSON });
  const handleExperiments = createExperimentRouter({ db, now, operatorToken: process.env.OPERATOR_TOKEN || '', ApiError, jsonBody, sendJSON });
  const handleRepublic = createRepublicRouter({ db, now, operatorToken: process.env.OPERATOR_TOKEN || '', ApiError, jsonBody, sendJSON });
  const aiAvailable = Boolean(aiKey && aiModel);
  const finalizing = new Set();
  const server = createServer(async (request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'no-referrer');
    response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    try {
      const url = new URL(request.url || '/', 'http://localhost');
      const pathname = url.pathname;
      if (request.method === 'GET' && pathname === '/api/v1/live') {
        return sendJSON(response, 200, { ok: true, service: 'impossible-ventures', check: 'process' });
      }
      if (request.method === 'GET' && (pathname === '/api/v1/ready' || pathname === '/api/v1/health')) {
        const ready = storageReady();
        return sendJSON(response, ready ? 200 : 503, {
          ok: ready,
          service: 'dead-drop',
          mode: 'cooperative',
          persistent: dbPath !== ':memory:',
          aiAvailable,
          version: '0.8.0',
          check: 'sqlite-transaction',
          storage: ready ? 'writable' : 'unavailable'
        });
      }
      if (pathname.startsWith('/api/')) {
        if (request.method === 'POST' || request.method === 'DELETE') throttle(requestsByIP, request, now);
        if (await handlePilots(request, response, pathname)) return;
        if (await handleExperiments(request, response, pathname)) return;
        if (await handleRepublic(request, response, pathname)) return;
        if (pathname === '/api/v1/missions' && request.method === 'POST') {
          const body = await jsonBody(request);
          const host = {
            brand: requiredText(body.brand, 'Brand', 100),
            product: requiredText(body.product, 'Product', 160),
            proof: requiredText(body.proof, 'Evidence', 220),
            objective: enumValue(body.objective, ['awareness', 'leads', 'launch'], 'objective')
          };
          const token = newToken();
          let code;
          do { code = newRoom(); } while (db.prepare('SELECT 1 FROM missions WHERE code = ?').get(code));
          const mission = {
            code, createdAt: now(), status: 'waiting',
            host, guest: null, messages: [], dossier: null,
            aiConsent: { product: false, audience: false },
            hostTokenHash: tokenDigest(token).toString('hex'),
            guestTokenHash: null
          };
          saveMission(db, mission);
          return sendJSON(response, 201, { code, token, mission: sessionView(mission, 'product') });
        }
        const match = /^\/api\/v1\/missions\/([A-Z2-9]{8})(?:\/(join|messages|finalize|ai-consent|export))?$/.exec(pathname);
        if (!match) throw new ApiError(404, 'API route not found');
        let mission = loadMission(db, match[1], now);
        const action = match[2];
        if (request.method === 'POST' && action === 'join') {
          const body = await jsonBody(request);
          const guest = {
            audience: requiredText(body.audience, 'Audience', 160),
            friction: requiredText(body.friction, 'Audience tension', 220),
            channel: enumValue(body.channel, ['social', 'video', 'landing'], 'channel')
          };
          // Body parsing is asynchronous. Re-read the room before changing it,
          // so two simultaneous join requests cannot overwrite one another.
          mission = loadMission(db, match[1], now);
          if (mission.guest || mission.status !== 'waiting') throw new ApiError(409, 'Mission already has two agents');
          mission.guest = guest;
          const token = newToken();
          mission.guestTokenHash = tokenDigest(token).toString('hex');
          mission.status = 'active';
          saveMission(db, mission);
          return sendJSON(response, 201, { code: mission.code, token, mission: sessionView(mission, 'audience') });
        }
        const role = authorizedRole(request, mission);
        if (!action && request.method === 'GET') {
          return sendJSON(response, 200, { mission: sessionView(mission, role) });
        }
        if (action === 'export' && request.method === 'GET') {
          return sendJSON(response, 200, {
            kind: 'dead-drop-agent-export',
            exportedAt: now(),
            scope: 'current-agent-view',
            mission: sessionView(mission, role)
          });
        }
        if (!action && request.method === 'DELETE') {
          const body = await jsonBody(request);
          if (body.confirmCode !== match[1]) throw new ApiError(400, 'Enter the exact mission code to delete');
          mission = loadMission(db, match[1], now);
          authorizedRole(request, mission);
          if (finalizing.has(mission.code)) throw new ApiError(409, 'Cannot delete while the dossier is being generated');
          const result = db.prepare('DELETE FROM missions WHERE code = ?').run(mission.code);
          if (result.changes !== 1) throw new ApiError(404, 'Mission not found');
          checkpointAfterDeletion();
          return sendJSON(response, 200, { deleted: true, code: mission.code });
        }
        if (action === 'ai-consent' && request.method === 'POST') {
          const body = await jsonBody(request);
          if (typeof body.allow !== 'boolean') throw new ApiError(400, 'Consent must be true or false');
          mission = loadMission(db, match[1], now);
          const currentRole = authorizedRole(request, mission);
          if (!mission.guest || mission.status !== 'active' || finalizing.has(mission.code)) {
            throw new ApiError(409, 'Mission cannot accept consent updates');
          }
          mission.aiConsent[currentRole] = body.allow;
          saveMission(db, mission);
          return sendJSON(response, 200, { mission: sessionView(mission, currentRole) });
        }
        if (action === 'messages' && request.method === 'POST') {
          const body = await jsonBody(request);
          const text = requiredText(body.text, 'Transmission', 280);
          // Validate the fresh persisted state after asynchronously reading the body.
          mission = loadMission(db, match[1], now);
          authorizedRole(request, mission);
          if (finalizing.has(mission.code)) throw new ApiError(409, 'The dossier is being finalized');
          if (!mission.guest) throw new ApiError(409, 'Waiting for second agent');
          if (mission.status !== 'active') throw new ApiError(409, 'Mission is closed');
          const used = mission.messages.filter(m => m.role === role).length;
          if (used >= MAX_MESSAGES) throw new ApiError(409, 'Transmission quota exhausted');
          mission.messages.push({ role, text, at: now() });
          saveMission(db, mission);
          return sendJSON(response, 201, { mission: sessionView(mission, role) });
        }
        if (action === 'finalize' && request.method === 'POST') {
          const body = await jsonBody(request);
          if (body.ai !== undefined && typeof body.ai !== 'boolean') throw new ApiError(400, 'Invalid AI consent');
          const language = enumValue(body.language || 'en', ['en', 'ru', 'zh'], 'language');
          mission = loadMission(db, match[1], now);
          authorizedRole(request, mission);
          if (!mission.guest || mission.status !== 'active') throw new ApiError(409, 'Mission is not active');
          if (!mission.messages.some(m => m.role === 'product') || !mission.messages.some(m => m.role === 'audience')) {
            throw new ApiError(409, 'Both agents must transmit at least once');
          }
          if (body.ai === true) {
            if (!aiAvailable) throw new ApiError(409, 'AI is not configured');
            if (!(mission.aiConsent.product && mission.aiConsent.audience)) {
              throw new ApiError(409, 'Both agents must explicitly consent to AI processing');
            }
          }
          if (finalizing.has(mission.code)) throw new ApiError(409, 'Finalization already in progress');
          finalizing.add(mission.code);
          try {
            let dossier = localizeRuleDossier(mission, buildDossier(mission), language);
            if (body.ai === true && aiAvailable) {
              try {
                dossier = await modelRefiner({ mission, draft: dossier, language, apiKey: aiKey, model: aiModel });
              } catch {
                // Provider failures never erase a completed mission. Do not log
                // provider payloads or user-supplied campaign intelligence.
                dossier.aiNotice = 'AI generation was unavailable; rules-based dossier created instead.';
              }
            }
            mission.status = 'finalized';
            mission.dossier = dossier;
            saveMission(db, mission);
            return sendJSON(response, 200, { mission: sessionView(mission, role) });
          } finally {
            finalizing.delete(mission.code);
          }
        }
        throw new ApiError(405, 'Method not allowed');
      }
      if (request.method !== 'GET' && request.method !== 'HEAD') throw new ApiError(405, 'Method not allowed');
      return sendStatic(response, pathname);
    } catch (error) {
      const status = error instanceof ApiError ? error.status : 500;
      if (status === 500) console.error('Dead Drop internal error:', error);
      if (!response.headersSent) sendJSON(response, status, { error: status === 500 ? 'Internal server error' : error.message });
      else response.destroy();
    }
  });
  server.on('close', handlePilots.stop);
  server.on('close', handleExperiments.stop);
  server.on('close', handleRepublic.stop);
  server.on('close', () => clearInterval(cleanupTimer));
  return { server, db, pruneExpired, close: () => { server.close(() => db.close()); } };
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(CURRENT_FILE)) {
  const app = createApp();
  const port = Number(process.env.PORT || 3000);
  app.server.listen(port, '0.0.0.0', () => {
    console.log('Dead Drop cooperative server listening on http://localhost:' + port);
  });
  const shutdown = () => {
    app.server.close(() => { app.db.close(); process.exit(0); });
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}
