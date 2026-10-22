/**
 * Appeal 2049 — transparent, deterministic campaign critique engine.
 *
 * These are editorial heuristics and cannot independently establish the truth
 * of any product claim, legal compliance, lift, conversion or commercial fit.
 * No network calls or browser storage. Safe to import from Node and browser.
 */
export const EVALUATOR_VERSION = 'appeal-2049-v1';
export const MAX_IMPORT_BYTES = 256 * 1024;
export const CRITERIA = ['clarity', 'audience', 'proof', 'action', 'distinctiveness'];
export const GOALS = ['awareness', 'leads', 'sales'];
export const RISK_PATTERNS = Object.freeze([
  { id: 'guarantee', pattern: /\bguaranteed?\b|\b100\s*%\b|гарантир|保证|保證/iu },
  { id: 'superlative', pattern: /\b(best|number\s*one|no\.\s*1)\b|(?:#|№)\s*1\b|лучши|самый|第一|最佳/iu },
  { id: 'unsupportedUrgency', pattern: /\b(last\s*chance|act\s*now|only\s*today)\b|только\s*сегодня|последний\s*шанс|最后机会/iu }
]);

function normalizedText(value, field, maximum) {
  if (typeof value !== 'string') throw new TypeError(field + ' must be text');
  const normalized = value.trim().replace(/\s+/gu, ' ');
  if (normalized.length < 3 || normalized.length > maximum) {
    throw new RangeError(field + ' must be 3–' + maximum + ' characters');
  }
  return normalized;
}

export function validateCase(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new TypeError('Expected a campaign object');
  }
  if (!GOALS.includes(data.goal)) throw new RangeError('Invalid campaign goal');
  return Object.freeze({
    product: normalizedText(data.product, 'Product', 160),
    idea: normalizedText(data.idea, 'Campaign idea', 1600),
    audience: normalizedText(data.audience, 'Audience', 240),
    evidence: typeof data.evidence === 'string' ? data.evidence.trim().replace(/\s+/gu, ' ').slice(0, 600) : '',
    goal: data.goal
  });
}

function bounded(count) { return Math.max(0, Math.min(4, Math.floor(count))); }

export function evaluateCase(data) {
  const input = validateCase(data);
  const combined = [input.product, input.idea, input.audience, input.evidence].join(' ');
  const flagIds = RISK_PATTERNS.filter(r => r.pattern.test(combined)).map(r => r.id);
  const hasNumber = /\d/u.test(input.idea);
  const hasAction = /\b(visit|explore|request|try|compare|book|start|join|sign\s*up|download|register|discover|buy)\b|запиш|попроб|скач|заявк|узнай|купить|注册|申请|预约|下载/iu.test(input.idea);
  const audienceDetail = input.audience.length >= 30 || /[,;]|\b(who|with|for|because)\b|котор|когда|具有|需要/iu.test(input.audience);
  const externalEvidenceHint = /\b(doi|study|trial|audit|source|report|research)\b|исследован|отч[её]т|аудит|Источник|报告|研究|https?:\/\//iu.test(input.evidence);
  const proofLength = input.evidence.length;
  const actionGoalSignal = {
    awareness: /\b(remember|discover|learn|explore|recognize|story)\b|помн|узнай|истори|了解|认识/iu,
    leads: /\b(request|register|book|contact|consult|download|sign\s*up)\b|заявк|консультац|запиш|申请|咨询/iu,
    sales: /\b(buy|purchase|checkout|subscribe|order|compare)\b|куп|заказ|оплат|подпис|购买|下单/iu
  }[input.goal];

  const signals = Object.freeze({
    clarity: bounded(1 + Number(input.idea.length >= 65) + Number(input.idea.length >= 140) + Number(!flagIds.includes('guarantee'))),
    audience: bounded(1 + Number(input.audience.length >= 15) + Number(audienceDetail) + Number(/\b(for|because|need|struggle)\b|нужд|проблем|痛点|需要/iu.test(combined))),
    proof: bounded(Number(proofLength >= 12) + Number(proofLength >= 40) + Number(externalEvidenceHint) + Number(proofLength >= 80)),
    action: bounded(1 + Number(hasAction) + Number(actionGoalSignal.test(input.idea)) + Number(input.idea.length >= 80)),
    distinctiveness: bounded(1 + Number(hasNumber) + Number(input.idea.length >= 120) + Number(!flagIds.includes('superlative')))
  });
  const total = CRITERIA.reduce((sum, key) => sum + signals[key], 0);
  const gaps = CRITERIA.filter(key => signals[key] <= 2);
  const review = {
    version: EVALUATOR_VERSION,
    input,
    signals,
    total,
    maximum: 20,
    gaps,
    riskFlags: flagIds,
    humanVerificationRequired: true,
    evidenceVerified: false,
    reliabilityNote: 'The score counts writing signals, not verified truth, legal compliance or ad performance.'
  };
  return review;
}

function plainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Accepts ONLY a completed Dead Drop dossier (direct, or from an authorized
 * agent-scoped export). Ignores every access token and private pre-finalization
 * field. Never returns room codes, messages or bearer-token hashes.
 */
export function extractDeadDropDossier(payload) {
  if (!plainObject(payload)) throw new TypeError('Invalid JSON dossier');
  let dossier = payload;
  if (payload.kind === 'dead-drop-agent-export') {
    if (!plainObject(payload.mission) || payload.mission.status !== 'finalized') {
      throw new Error('The Dead Drop mission must be finalized before review');
    }
    dossier = payload.mission.dossier;
  }
  if (!plainObject(dossier) || typeof dossier.concept !== 'string' ||
      typeof dossier.brand !== 'string' || typeof dossier.audience !== 'string') {
    throw new Error('Not a compatible Dead Drop final dossier');
  }
  return validateCase({
    product: dossier.brand,
    idea: [dossier.openingHook, dossier.concept, dossier.callToAction].filter(x => typeof x === 'string').join('\n').slice(0, 1600),
    audience: dossier.audience.slice(0, 240),
    evidence: typeof dossier.evidenceToVerify === 'string' ? dossier.evidenceToVerify : '',
    goal: /\b(request|contact|lead|briefing|заяв|申请)\b/iu.test(dossier.callToAction || '') ? 'leads' : 'awareness'
  });
}

export function csvSafe(value) {
  const normalized = String(value ?? '').replace(/[\r\n\t]/gu, ' ').trim();
  // Prevent spreadsheet formula execution if a CSV report is later added.
  return /^[=+\-@\uFF1D\uFF0B\uFF0D\uFF20]/u.test(normalized) ? "'" + normalized : normalized;
}
