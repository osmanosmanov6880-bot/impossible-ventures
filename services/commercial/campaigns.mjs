import { randomBytes } from 'node:crypto';

export const VENTURES = Object.freeze([
  {
    id: 'dead-drop',
    name: 'Dead Drop Agency',
    audience: 'Команды маркетинга и основатели',
    concept: 'Секретная миссия двух агентов, превращающая факты о продукте в рекламную историю.',
    exampleHeadline: 'У вас есть одно секретное задание.',
    exampleBody: 'Один агент знает продукт, второй понимает аудиторию. Объедините информацию и раскройте идею кампании.',
    accent: 'cyan'
  },
  {
    id: 'appeal-2049',
    name: 'Appeal 2049',
    audience: 'Стратеги и продуктовые команды',
    concept: 'Воображаемый суд будущего, который проверяет гипотезы и слабые аргументы рекламы.',
    exampleHeadline: 'Ваше рекламное обещание вызвали в суд.',
    exampleBody: 'Представьте 2049 год. Алгоритм оспаривает ваши заявления: смогут ли факты выдержать проверку?',
    accent: 'violet'
  },
  {
    id: 'anti-persona',
    name: 'AntiPersona',
    audience: 'Креативные специалисты',
    concept: 'Мир обратных ролей: реклама для тех, кто принципиально не похож на типичного покупателя.',
    exampleHeadline: 'Создайте предложение для человека, которого не ждёте.',
    exampleBody: 'Забудьте привычный портрет клиента и проверьте необычный ракурс, не выдавая фантазию за исследование.',
    accent: 'coral'
  },
  {
    id: 'brief-theatre',
    name: 'Brief Theatre',
    audience: 'Рекламные агентства и бренды',
    concept: 'Сцена, где один продукт меняет драматургию под новые ограничения.',
    exampleHeadline: 'Один продукт. Три неожиданных роли.',
    exampleBody: 'Откройте занавес. Каждое решение меняет рекламную сцену, но реальное обещание бренда остаётся проверяемым.',
    accent: 'gold'
  },
  {
    id: 'ad-biome',
    name: 'AdBiome',
    audience: 'Команды performance-маркетинга',
    concept: 'Воображаемая экосистема вариантов креативов и естественного отбора через честные A/B-тесты.',
    exampleHeadline: 'Вырастите рекламную идею в контролируемом эксперименте.',
    exampleBody: 'Вместо догадок — несколько творческих гипотез, измеримые события и осторожные выводы.',
    accent: 'mint'
  },
  {
    id: 'museum-of-attention',
    name: 'Museum of Attention',
    audience: 'Бренды и образовательные проекты',
    concept: 'Интерактивный музей человеческого внимания с короткими экспонатами-историями.',
    exampleHeadline: 'Вы вошли в музей исчезающих секунд.',
    exampleBody: 'Каждый экспонат показывает, почему мы обращаем внимание на одни истории и пропускаем другие.',
    accent: 'pink'
  },
  {
    id: 'attention-republic',
    name: 'Attention Republic',
    audience: 'Креативные сообщества',
    concept: 'Воображаемая республика гражданских творческих задач и коллективного выбора.',
    exampleHeadline: 'Ваша идея способна изменить город.',
    exampleBody: 'Станьте участником рекламного совета: предложите вариант, обсудите последствия и выберите сценарий.',
    accent: 'blue'
  }
]);
const IDS = new Set(VENTURES.map(v => v.id));
const GOALS = ['awareness', 'leads', 'sales', 'validation'];
const CHANNELS = ['landing', 'social', 'video', 'email', 'display'];
const WORKFLOW = ['draft', 'approved', 'archived'];
function secureId() { return randomBytes(12).toString('hex'); }
function required(value, label, Err, min = 3, max = 220) {
  if (typeof value !== 'string') throw new Err(400, label + ' is required');
  const s = value.trim().replace(/\s+/g, ' ');
  if (s.length < min || s.length > max ||
      /[\u0000-\u001f\u007f-\u009f\u202a-\u202e]/.test(s)) throw new Err(400, 'Invalid ' + label);
  return s;
}
function choice(value, values, label, Err) {
  if (!values.includes(value)) throw new Err(400, 'Invalid ' + label);
  return value;
}
function fields(body, Err) {
  return {
    title: required(body.title, 'title', Err, 3, 100),
    venture: choice(body.venture, [...IDS], 'venture', Err),
    goal: choice(body.goal, GOALS, 'goal', Err),
    channel: choice(body.channel, CHANNELS, 'channel', Err),
    audience: required(body.audience, 'audience', Err, 3, 300),
    offer: required(body.offer, 'offer', Err, 3, 240),
    headline: required(body.headline, 'headline', Err, 5, 180),
    body: required(body.body, 'creative body', Err, 10, 700),
    ctaLabel: required(body.ctaLabel, 'CTA label', Err, 3, 60)
  };
}
function privateRow(row) {
  return {
    id: row.id, workspaceId: row.workspace_id,
    title: row.title, venture: row.venture, goal: row.goal,
    channel: row.channel, audience: row.audience, offer: row.offer,
    headline: row.headline, body: row.body, ctaLabel: row.cta_label,
    status: row.status, revision: row.revision,
    createdAt: row.created_at, updatedAt: row.updated_at
  };
}
function publishedRow(row) {
  return {
    id: row.id, title: row.title, venture: row.venture, goal: row.goal,
    headline: row.headline, body: row.body, offer: row.offer, ctaLabel: row.cta_label,
    disclaimer: 'An approved public creative preview, not a delivered advertising campaign or substantiated product claim.'
  };
}

export function createCampaigns({ db, now = Date.now, workspaces, ApiError, jsonBody, sendJSON }) {
  db.exec(
    'CREATE TABLE IF NOT EXISTS commercial_campaigns (' +
    'id TEXT PRIMARY KEY, workspace_id TEXT NOT NULL, title TEXT NOT NULL, ' +
    'venture TEXT NOT NULL, goal TEXT NOT NULL, channel TEXT NOT NULL, audience TEXT NOT NULL, ' +
    'offer TEXT NOT NULL, headline TEXT NOT NULL, body TEXT NOT NULL, cta_label TEXT NOT NULL, ' +
    'status TEXT NOT NULL, revision INTEGER NOT NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL);' +
    'CREATE INDEX IF NOT EXISTS commercial_campaigns_ws ON commercial_campaigns(workspace_id,created_at);'
  );

  function find(ws, id) {
    const row = db.prepare('SELECT * FROM commercial_campaigns WHERE workspace_id = ? AND id = ?').get(ws, id);
    if (!row) throw new ApiError(404, 'Campaign not found');
    return row;
  }
  async function handle(req, res, path) {
    if (req.method === 'GET' && path === '/api/v1/commercial/ventures') {
      sendJSON(res, 200, {
        items: VENTURES,
        disclaimer: 'Creative world templates, not seven separately deployed revenue-generating advertising systems.'
      });
      return true;
    }

    const publiclyApproved = /^\/api\/v1\/showcase\/([a-f0-9]{24})$/.exec(path);
    if (publiclyApproved && req.method === 'GET') {
      const row = db.prepare('SELECT * FROM commercial_campaigns WHERE id = ? AND status = ?')
        .get(publiclyApproved[1], 'approved');
      if (!row) throw new ApiError(404, 'Public campaign preview not found');
      sendJSON(res, 200, { creative: publishedRow(row) });
      return true;
    }

    const list = /^\/api\/v1\/workspaces\/([a-f0-9]{24})\/campaigns$/.exec(path);
    if (list && req.method === 'GET') {
      workspaces.requireRole(req, list[1]);
      const rows = db.prepare(
        'SELECT * FROM commercial_campaigns WHERE workspace_id = ? ORDER BY created_at DESC,id DESC LIMIT 200'
      ).all(list[1]);
      const statuses = { draft: 0, approved: 0, archived: 0 };
      const groups = db.prepare('SELECT status,COUNT(*) AS n FROM commercial_campaigns WHERE workspace_id = ? GROUP BY status').all(list[1]);
      for (const group of groups) if (Object.hasOwn(statuses, group.status)) statuses[group.status] = group.n;
      sendJSON(res, 200, { items: rows.map(privateRow), counts: statuses });
      return true;
    }
    if (list && req.method === 'POST') {
      const actor = workspaces.requireRole(req, list[1], ['owner','editor']);
      const data = fields(await jsonBody(req), ApiError);
      const id = secureId(), timestamp = now();
      db.prepare(
        'INSERT INTO commercial_campaigns (' +
        'id,workspace_id,title,venture,goal,channel,audience,offer,headline,body,cta_label,status,revision,created_at,updated_at) ' +
        'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
      ).run(id, list[1], data.title, data.venture, data.goal, data.channel,
        data.audience, data.offer, data.headline, data.body, data.ctaLabel,
        'draft', 1, timestamp, timestamp);
      workspaces.audit(list[1], 'campaign.created', actor.token.id, id);
      sendJSON(res, 201, { campaign: privateRow(find(list[1], id)) });
      return true;
    }

    const item = /^\/api\/v1\/workspaces\/([a-f0-9]{24})\/campaigns\/([a-f0-9]{24})$/.exec(path);
    if (item && req.method === 'GET') {
      workspaces.requireRole(req, item[1]);
      sendJSON(res, 200, { campaign: privateRow(find(item[1], item[2])) });
      return true;
    }
    if (item && req.method === 'PATCH') {
      const actor = workspaces.requireRole(req, item[1], ['owner','editor']);
      const input = await jsonBody(req);
      const revision = input.expectedRevision;
      if (!Number.isInteger(revision) || revision < 1) throw new ApiError(400, 'Expected revision is required');
      const existing = find(item[1], item[2]);
      if (existing.status !== 'draft') throw new ApiError(409, 'Only drafts can be edited');
      const data = fields({ ...privateRow(existing), ...input }, ApiError);
      const result = db.prepare(
        'UPDATE commercial_campaigns SET title=?,venture=?,goal=?,channel=?,audience=?,offer=?,headline=?,body=?,cta_label=?,revision=revision+1,updated_at=? ' +
        'WHERE workspace_id=? AND id=? AND revision=? AND status=?'
      ).run(data.title, data.venture, data.goal, data.channel, data.audience, data.offer,
        data.headline, data.body, data.ctaLabel, now(), item[1], item[2], revision, 'draft');
      if (!result.changes) throw new ApiError(409, 'Campaign changed since it was loaded; refresh before saving');
      workspaces.audit(item[1], 'campaign.updated', actor.token.id, item[2]);
      sendJSON(res, 200, { campaign: privateRow(find(item[1], item[2])) });
      return true;
    }

    const action = /^\/api\/v1\/workspaces\/([a-f0-9]{24})\/campaigns\/([a-f0-9]{24})\/(approve|archive)$/.exec(path);
    if (action && req.method === 'POST') {
      const actor = workspaces.requireRole(req, action[1], ['owner']);
      const current = find(action[1], action[2]);
      if (action[3] === 'approve' && current.status !== 'draft') throw new ApiError(409, 'Only drafts can be approved');
      if (action[3] === 'archive' && current.status === 'archived') throw new ApiError(409, 'Campaign is already archived');
      const next = action[3] === 'approve' ? 'approved' : 'archived';
      const updated = db.prepare(
        'UPDATE commercial_campaigns SET status=?,revision=revision+1,updated_at=? WHERE id=? AND workspace_id=? AND status=?'
      ).run(next, now(), action[2], action[1], current.status);
      if (!updated.changes) throw new ApiError(409, 'Concurrent campaign status change');
      workspaces.audit(action[1], 'campaign.' + next, actor.token.id, action[2]);
      sendJSON(res, 200, {
        campaign: privateRow(find(action[1], action[2])),
        publicPreview: next === 'approved' ? '/showcase/?id=' + action[2] : null
      });
      return true;
    }

    // Routes beginning with '/api/v1/workspaces/' are shared with workspace and
    // future commercial modules: do not blanket-block routes not owned here.
    if (path.startsWith('/api/v1/showcase/') || path.startsWith('/api/v1/commercial/ventures')) {
      throw new ApiError(404, 'Campaign route not found');
    }
    return false;
  }
  return { handle, find, fields };
}
