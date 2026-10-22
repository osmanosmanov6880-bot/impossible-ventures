import { createHash, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';

const DAY_MS = 86_400_000;
export const SESSION_TTL_DAYS = 7;
export const AGGREGATE_RETENTION_DAYS = 90;
const STATUSES = ['draft', 'running', 'paused', 'completed'];
const TRANSITIONS = Object.freeze({
  draft: ['running', 'completed'],
  running: ['paused', 'completed'],
  paused: ['running', 'completed'],
  completed: []
});

function hash(value) {
  return createHash('sha256').update(value).digest();
}

function equalsSecret(value, expected) {
  if (typeof value !== 'string' || typeof expected !== 'string' ||
      value.length > 256 || value.length === 0) return false;
  return timingSafeEqual(hash(value), hash(expected));
}

function digestMatches(value, digestHex) {
  if (typeof value !== 'string' || value.length < 32 || value.length > 256) return false;
  const stored = Buffer.from(digestHex || '', 'hex');
  const actual = hash(value);
  return stored.length === actual.length && timingSafeEqual(stored, actual);
}

function bearer(request) {
  const value = request.headers.authorization || '';
  return /^Bearer [A-Za-z0-9._~+/-]+=*$/.test(value) ? value.slice(7) : '';
}

function field(value, label, ApiError, min = 3, max = 180) {
  if (typeof value !== 'string') throw new ApiError(400, label + ' is required');
  const clean = value.trim().replace(/\s+/g, ' ');
  if (clean.length < min || clean.length > max ||
      /[\u0000-\u001f\u007f-\u009f\u202a-\u202e]/.test(clean)) {
    throw new ApiError(400, label + ' must contain ' + min + '–' + max + ' printable characters');
  }
  return clean;
}

function utcDay(now) {
  return Math.floor(now / DAY_MS);
}

function wilson95(successes, trials) {
  if (!trials) return { low: 0, high: 0 };
  const z = 1.959963984540054;
  const p = successes / trials;
  const den = 1 + z * z / trials;
  const center = (p + z * z / (2 * trials)) / den;
  const margin = z / den * Math.sqrt(p * (1 - p) / trials + z * z / (4 * trials * trials));
  return { low: Math.max(0, center - margin), high: Math.min(1, center + margin) };
}

function numbers(rows) {
  const arms = {
    A: { exposures: 0, cta: 0, responseRate: 0, wilson95: { low: 0, high: 0 } },
    B: { exposures: 0, cta: 0, responseRate: 0, wilson95: { low: 0, high: 0 } }
  };
  for (const row of rows) {
    if (arms[row.arm]) {
      arms[row.arm].exposures += Number(row.exposures);
      arms[row.arm].cta += Number(row.cta);
    }
  }
  for (const arm of Object.values(arms)) {
    arm.responseRate = arm.exposures ? arm.cta / arm.exposures : 0;
    arm.wilson95 = wilson95(arm.cta, arm.exposures);
  }
  const total = arms.A.exposures + arms.B.exposures;
  return {
    arms, totalExposures: total, totalCTA: arms.A.cta + arms.B.cta,
    observedDifferencePP: 100 * (arms.B.responseRate - arms.A.responseRate),
    sampleRatioWarning: total >= 100 && Math.abs(arms.A.exposures - arms.B.exposures) > 3 * Math.sqrt(total),
    interpretation: 'Descriptive anonymous CTA counts only. Not sales, qualified leads, incrementality or a statistically proven winner. Confidence intervals describe each arm, not a significance test.'
  };
}

function operatorView(row) {
  return {
    id: row.id, title: row.title, audience: row.audience, offer: row.offer,
    hypothesis: row.hypothesis,
    controlHeadline: row.control_headline, controlBody: row.control_body,
    variantHeadline: row.variant_headline, variantBody: row.variant_body,
    decisionPrompt: row.decision_prompt,
    choiceOneLabel: row.choice_one_label, choiceOneReveal: row.choice_one_reveal,
    choiceTwoLabel: row.choice_two_label, choiceTwoReveal: row.choice_two_reveal,
    ctaLabel: row.cta_label, status: row.status,
    createdAt: row.created_at, updatedAt: row.updated_at
  };
}

export function createExperimentRouter({ db, now = Date.now, operatorToken = '', ApiError, jsonBody, sendJSON }) {
  db.exec(
    'CREATE TABLE IF NOT EXISTS ab_experiments (' +
    'id TEXT PRIMARY KEY, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, ' +
    'title TEXT NOT NULL, audience TEXT NOT NULL, offer TEXT NOT NULL, hypothesis TEXT NOT NULL, ' +
    'control_headline TEXT NOT NULL, control_body TEXT NOT NULL, ' +
    'variant_headline TEXT NOT NULL, variant_body TEXT NOT NULL, ' +
    'decision_prompt TEXT NOT NULL, choice_one_label TEXT NOT NULL, choice_one_reveal TEXT NOT NULL, ' +
    'choice_two_label TEXT NOT NULL, choice_two_reveal TEXT NOT NULL, ' +
    'cta_label TEXT NOT NULL, status TEXT NOT NULL);' +
    'CREATE TABLE IF NOT EXISTS ab_sessions (' +
    'id TEXT PRIMARY KEY, experiment_id TEXT NOT NULL, arm TEXT NOT NULL, token_hash TEXT NOT NULL, ' +
    'created_at INTEGER NOT NULL, cohort_day INTEGER NOT NULL, cta_recorded INTEGER NOT NULL DEFAULT 0);' +
    'CREATE INDEX IF NOT EXISTS ab_sessions_experiment_created ON ab_sessions(experiment_id, created_at);' +
    'CREATE TABLE IF NOT EXISTS ab_daily (' +
    'experiment_id TEXT NOT NULL, cohort_day INTEGER NOT NULL, arm TEXT NOT NULL, ' +
    'exposures INTEGER NOT NULL DEFAULT 0, cta INTEGER NOT NULL DEFAULT 0, ' +
    'PRIMARY KEY (experiment_id, cohort_day, arm));'
  );
  const requestWindows = new Map();
  const createSession = db.prepare(
    'INSERT INTO ab_sessions (id, experiment_id, arm, token_hash, created_at, cohort_day, cta_recorded) VALUES (?, ?, ?, ?, ?, ?, 0)'
  );
  const addExposure = db.prepare(
    'INSERT INTO ab_daily (experiment_id, cohort_day, arm, exposures, cta) VALUES (?, ?, ?, 1, 0) ' +
    'ON CONFLICT(experiment_id, cohort_day, arm) DO UPDATE SET exposures = exposures + 1'
  );
  const addCTA = db.prepare(
    'UPDATE ab_daily SET cta = cta + 1 WHERE experiment_id = ? AND cohort_day = ? AND arm = ?'
  );
  function cleanup() {
    db.prepare('DELETE FROM ab_sessions WHERE created_at < ?')
      .run(now() - SESSION_TTL_DAYS * DAY_MS);
    db.prepare('DELETE FROM ab_daily WHERE cohort_day < ?')
      .run(utcDay(now()) - (AGGREGATE_RETENTION_DAYS - 1));
  }
  cleanup();
  const purgeTimer = setInterval(cleanup, 3_600_000);
  purgeTimer.unref();

  function throttleSessions(request) {
    const remote = request.socket.remoteAddress || 'unknown';
    const time = now();
    const found = requestWindows.get(remote);
    const slot = found && time - found.since < 3_600_000
      ? found : { since: time, count: 0 };
    slot.count += 1;
    requestWindows.set(remote, slot);
    if (requestWindows.size > 5000) {
      for (const [key, value] of requestWindows) {
        if (time - value.since >= 3_600_000) requestWindows.delete(key);
      }
    }
    if (slot.count > 20) throw new ApiError(429, 'Experiment session limit exceeded');
  }

  function authorizeOperator(request) {
    if (typeof operatorToken !== 'string' || operatorToken.length < 32) {
      throw new ApiError(503, 'Operator access is not configured');
    }
    const supplied = bearer(request);
    if (!supplied) throw new ApiError(401, 'Operator token required');
    if (!equalsSecret(supplied, operatorToken)) throw new ApiError(403, 'Operator token invalid');
  }

  function findExperiment(id) {
    const row = db.prepare('SELECT * FROM ab_experiments WHERE id = ?').get(id);
    if (!row) throw new ApiError(404, 'Experiment not found');
    return row;
  }

  function snapshot(id) {
    const rows = db.prepare(
      'SELECT arm, SUM(exposures) AS exposures, SUM(cta) AS cta ' +
      'FROM ab_daily WHERE experiment_id = ? GROUP BY arm'
    ).all(id);
    return numbers(rows);
  }

  async function handle(request, response, pathname) {
    const method = request.method;

    if (pathname === '/api/v1/experiments' && method === 'GET') {
      const available = db.prepare(
        'SELECT id, title, audience, offer FROM ab_experiments WHERE status = ? ORDER BY created_at DESC LIMIT 30'
      ).all('running');
      sendJSON(response, 200, {
        items: available.map(row => ({ id: row.id, title: row.title, audience: row.audience, offer: row.offer })),
        measurement: 'Consent-required, anonymous and first-party; not a paid ad campaign.'
      });
      return true;
    }

    if (pathname === '/api/v1/operator/experiments' && method === 'GET') {
      authorizeOperator(request);
      cleanup();
      const rows = db.prepare('SELECT * FROM ab_experiments ORDER BY created_at DESC LIMIT 100').all();
      sendJSON(response, 200, {
        items: rows.map(row => ({ ...operatorView(row), metrics: snapshot(row.id) })),
        retentionDays: AGGREGATE_RETENTION_DAYS,
        note: 'Real, self-selected alpha sessions only. Operators can change experiment statuses, not reported counters.'
      });
      return true;
    }

    if (pathname === '/api/v1/operator/experiments' && method === 'POST') {
      authorizeOperator(request);
      const body = await jsonBody(request);
      const data = {
        title: field(body.title, 'Title', ApiError, 3, 100),
        audience: field(body.audience, 'Audience', ApiError, 3, 180),
        offer: field(body.offer, 'Offer', ApiError, 3, 160),
        hypothesis: field(body.hypothesis, 'Hypothesis', ApiError, 10, 300),
        controlHeadline: field(body.controlHeadline, 'Control headline', ApiError, 5, 125),
        controlBody: field(body.controlBody, 'Control copy', ApiError, 10, 450),
        variantHeadline: field(body.variantHeadline, 'Variant headline', ApiError, 5, 125),
        variantBody: field(body.variantBody, 'Variant copy', ApiError, 10, 450),
        decisionPrompt: field(body.decisionPrompt, 'Decision prompt', ApiError, 8, 220),
        choiceOneLabel: field(body.choiceOneLabel, 'First choice', ApiError, 3, 70),
        choiceOneReveal: field(body.choiceOneReveal, 'First story outcome', ApiError, 8, 280),
        choiceTwoLabel: field(body.choiceTwoLabel, 'Second choice', ApiError, 3, 70),
        choiceTwoReveal: field(body.choiceTwoReveal, 'Second story outcome', ApiError, 8, 280),
        ctaLabel: field(body.ctaLabel, 'CTA label', ApiError, 3, 45)
      };
      if (data.choiceOneLabel === data.choiceTwoLabel) {
        throw new ApiError(422, 'Interactive choices must be distinct');
      }
      if (data.controlHeadline === data.variantHeadline && data.controlBody === data.variantBody) {
        throw new ApiError(422, 'The control and interactive variant must differ');
      }
      const id = randomBytes(12).toString('hex');
      const createdAt = now();
      db.prepare(
        'INSERT INTO ab_experiments (id,created_at,updated_at,title,audience,offer,hypothesis,' +
        'control_headline,control_body,variant_headline,variant_body,' +
        'decision_prompt,choice_one_label,choice_one_reveal,choice_two_label,choice_two_reveal,cta_label,status) ' +
        'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
      ).run(id, createdAt, createdAt, data.title, data.audience, data.offer, data.hypothesis,
        data.controlHeadline, data.controlBody, data.variantHeadline, data.variantBody,
        data.decisionPrompt, data.choiceOneLabel, data.choiceOneReveal, data.choiceTwoLabel,
        data.choiceTwoReveal, data.ctaLabel, 'draft');
      sendJSON(response, 201, { created: true, id, status: 'draft', sharePath: '/experiments/?id=' + id });
      return true;
    }

    const statusRoute = /^\/api\/v1\/operator\/experiments\/([a-f0-9]{24})\/status$/.exec(pathname);
    if (statusRoute && method === 'POST') {
      authorizeOperator(request);
      const body = await jsonBody(request);
      if (!STATUSES.includes(body.status)) throw new ApiError(400, 'Invalid experiment status');
      const experiment = findExperiment(statusRoute[1]);
      if (!TRANSITIONS[experiment.status].includes(body.status)) {
        throw new ApiError(409, 'Invalid experiment status transition');
      }
      db.prepare('UPDATE ab_experiments SET status = ?, updated_at = ? WHERE id = ?')
        .run(body.status, now(), experiment.id);
      sendJSON(response, 200, { updated: true, status: body.status });
      return true;
    }

    const assign = /^\/api\/v1\/experiments\/([a-f0-9]{24})\/sessions$/.exec(pathname);
    if (assign && method === 'POST') {
      throttleSessions(request);
      const body = await jsonBody(request);
      if (body.consent !== true) throw new ApiError(422, 'Explicit opt-in to anonymous experiment measurement required');
      const exp = findExperiment(assign[1]);
      if (exp.status !== 'running') throw new ApiError(409, 'Experiment is not accepting new sessions');
      const sessionId = randomBytes(16).toString('hex');
      const token = randomBytes(32).toString('base64url');
      const arm = randomInt(2) === 0 ? 'A' : 'B';
      const createdAt = now(), day = utcDay(createdAt);
      db.exec('BEGIN IMMEDIATE');
      try {
        createSession.run(sessionId, exp.id, arm, hash(token).toString('hex'), createdAt, day);
        addExposure.run(exp.id, day, arm);
        db.exec('COMMIT');
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
      sendJSON(response, 201, {
        sessionId, token, arm, expiresInDays: SESSION_TTL_DAYS,
        creative: {
          headline: arm === 'A' ? exp.control_headline : exp.variant_headline,
          body: arm === 'A' ? exp.control_body : exp.variant_body,
          offer: exp.offer, ctaLabel: exp.cta_label,
          interaction: arm === 'B' ? {
            prompt: exp.decision_prompt,
            choices: [
              { label: exp.choice_one_label, reveal: exp.choice_one_reveal },
              { label: exp.choice_two_label, reveal: exp.choice_two_reveal }
            ]
          } : null
        },
        disclaimer: 'Random first-party research assignment. A session start is not a verified human impression. No cookies, ad network or personal identity tracking.'
      });
      return true;
    }

    const ctaRoute = /^\/api\/v1\/experiments\/([a-f0-9]{24})\/sessions\/([a-f0-9]{32})\/cta$/.exec(pathname);
    if (ctaRoute && method === 'POST') {
      const token = bearer(request);
      if (!token) throw new ApiError(401, 'Session bearer token required');
      const session = db.prepare('SELECT * FROM ab_sessions WHERE id = ? AND experiment_id = ?')
        .get(ctaRoute[2], ctaRoute[1]);
      if (!session) throw new ApiError(404, 'Session not found');
      if (now() - session.created_at > SESSION_TTL_DAYS * DAY_MS) throw new ApiError(410, 'Session expired');
      if (!digestMatches(token, session.token_hash)) throw new ApiError(403, 'Session token invalid');
      db.exec('BEGIN IMMEDIATE');
      let recorded = false;
      try {
        const changed = db.prepare(
          'UPDATE ab_sessions SET cta_recorded = 1 WHERE id = ? AND experiment_id = ? AND cta_recorded = 0'
        ).run(session.id, session.experiment_id);
        if (changed.changes) {
          addCTA.run(session.experiment_id, session.cohort_day, session.arm);
          recorded = true;
        }
        db.exec('COMMIT');
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
      sendJSON(response, 200, {
        recorded, alreadyRecorded: !recorded,
        event: 'cta_clicked',
        note: 'A recorded CTA is not a lead, purchase or verified business outcome.'
      });
      return true;
    }

    if (pathname.startsWith('/api/v1/experiments') || pathname.startsWith('/api/v1/operator/experiments')) {
      throw new ApiError(404, 'Experiment API route not found');
    }
    return false;
  }

  handle.stop = () => clearInterval(purgeTimer);
  handle.cleanup = cleanup;
  return handle;
}
