import { WORLDS, WORLD_IDS, pick } from './worlds.mjs';

export const EDITION = '1.1.0-beta.1';
export const LANGUAGES = Object.freeze(['ru', 'en', 'zh']);
const MAX_NOTE = 600;
const MIN_SCRIPT_LINE = 8;

export class CreativeInputError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CreativeInputError';
  }
}
function safeInput(value, name, min, max) {
  if (typeof value !== 'string') throw new CreativeInputError(name + ': text required');
  const clean = value.trim().replace(/\s+/g, ' ');
  if (clean.length < min || clean.length > max ||
      /[\u0000-\u001f\u007f-\u009f\u202a-\u202e]/u.test(clean)) {
    throw new CreativeInputError(name + ': invalid length or control characters');
  }
  return clean;
}
function knownWorld(id) {
  if (!WORLD_IDS.includes(id)) throw new CreativeInputError('Unknown creative world');
  return WORLDS[id];
}
function knownLocale(locale) {
  if (!LANGUAGES.includes(locale)) throw new CreativeInputError('Unknown locale');
  return locale;
}
function cloneRun(run) {
  return { ...run, project: { ...run.project }, answers: run.answers.map(a => ({ ...a })) };
}
function checkRun(run) {
  if (!run || typeof run !== 'object' || Array.isArray(run)) throw new CreativeInputError('Invalid experience');
  const world = knownWorld(run.worldId);
  knownLocale(run.locale);
  if (!run.project || typeof run.project.brand !== 'string') throw new CreativeInputError('Missing project');
  if (!Array.isArray(run.answers) || run.answers.length > world.turns.length) {
    throw new CreativeInputError('Invalid answer history');
  }
  const seen = new Set();
  run.answers.forEach((answer, index) => {
    const step = world.turns[index];
    if (!step || typeof answer !== 'object' || answer.turnId !== step.id ||
        seen.has(step.id) || !step.choices.some(o => o.id === answer.choiceId)) {
      throw new CreativeInputError('Invalid narrative branch');
    }
    seen.add(step.id);
    safeInput(answer.note || '', 'answer', 0, MAX_NOTE);
    if (step.requiredNote && answer.note.length < MIN_SCRIPT_LINE) {
      throw new CreativeInputError('A scripted line is missing');
    }
  });
  return world;
}

/** Start in memory. Never persists any user-entered brand or product information. */
export function createRun(worldId, project, locale = 'ru') {
  const world = knownWorld(worldId);
  knownLocale(locale);
  if (!project || typeof project !== 'object') throw new CreativeInputError('Project is required');
  const fields = {
    brand: safeInput(project.brand, 'brand', 2, 90),
    product: safeInput(project.product, 'product', 3, 180),
    audience: safeInput(project.audience, 'audience', 3, 180)
  };
  return {
    schema: 'iv-local-world-run-v1', version: EDITION, worldId: world.id,
    locale, project: fields, answers: []
  };
}

export function nextStage(run) {
  const world = checkRun(run);
  const turn = world.turns[run.answers.length];
  if (!turn) return null;
  const prior = run.answers.length
    ? world.turns[run.answers.length - 1].choices.find(x => x.id === run.answers.at(-1).choiceId)
    : null;
  return {
    index: run.answers.length,
    total: world.turns.length,
    id: turn.id,
    title: pick(turn.heading, run.locale),
    question: pick(turn.question, run.locale),
    hint: pick(turn.hint, run.locale),
    requiredNote: turn.requiredNote,
    consequenceFromPrevious: prior ? pick(prior.consequence, run.locale) : null,
    choices: turn.choices.map(option => ({
      id: option.id,
      label: pick(option.label, run.locale),
      consequence: pick(option.consequence, run.locale),
      delta: { ...option.delta }
    }))
  };
}

export function choose(run, choiceId, note = '') {
  const current = nextStage(run);
  if (!current) throw new CreativeInputError('The experience is already finished');
  if (typeof choiceId !== 'string' || !current.choices.some(o => o.id === choiceId)) {
    throw new CreativeInputError('Choose one of the available decisions');
  }
  const input = safeInput(note, 'note', current.requiredNote ? MIN_SCRIPT_LINE : 0, MAX_NOTE);
  const updated = cloneRun(run);
  updated.answers.push({
    turnId: current.id, choiceId, note: input
  });
  return updated;
}

export function rewind(run) {
  checkRun(run);
  if (run.answers.length === 0) return cloneRun(run);
  const updated = cloneRun(run);
  updated.answers.pop();
  return updated;
}

export function progress(run) {
  const world = checkRun(run);
  return { completed: run.answers.length, total: world.turns.length,
    finished: run.answers.length === world.turns.length };
}

export function heuristicScores(run) {
  const world = checkRun(run);
  const scores = { ...world.seed };
  for (const answer of run.answers) {
    const turn = world.turns.find(x => x.id === answer.turnId);
    const option = turn.choices.find(x => x.id === answer.choiceId);
    for (const [name, effect] of Object.entries(option.delta)) {
      if (!Object.hasOwn(scores, name) || !Number.isFinite(effect) || Math.abs(effect) > 30) {
        throw new CreativeInputError('Invalid game metric');
      }
      scores[name] = Math.max(0, Math.min(100, scores[name] + effect));
    }
  }
  return world.dimensions.map(d => ({ id: d.id, label: pick(d.label, run.locale), value: scores[d.id] }));
}

const DISCLAIMER = {
  ru: 'Только авторский локальный сценарий и эвристические игровые баллы. Это не результаты кампании, рекламные показы, исследование аудитории, мнение реальных людей, доход или юридическая экспертиза.',
  en: 'Authored local scenario and heuristic game scores only. Not campaign results, ad impressions, audience research, real user opinions, revenue or legal review.',
  zh: '仅为本地创作情境及启发式游戏分数。不代表广告效果、真实展示、受众研究、真实用户意见、收入或法律审查。'
};
const VERIFICATION = {
  ru: [
    'Проверьте все свойства продукта и сравнительные заявления независимыми фактами.',
    'Убедитесь, что участие добровольное и пользователь может отказаться без последствий.',
    'При работе с людьми получите согласие; не подменяйте реальные результаты игровыми баллами.'
  ],
  en: [
    'Verify every product and comparative claim using independent evidence.',
    'Make participation optional with a clear way to decline.',
    'Obtain informed consent and never confuse game scores with real performance.'
  ],
  zh: [
    '使用独立证据核实所有产品及比较性主张。',
    '确保参与自愿，用户可以清楚地拒绝。',
    '获得知情同意，切勿将游戏分数当作真实绩效。'
  ]
};

/**
 * Returns a structured deliverable. Neither scores nor annotations are sent
 * anywhere; the browser can optionally download this JSON file locally.
 */
export function report(run) {
  const world = checkRun(run);
  if (run.answers.length !== world.turns.length) {
    throw new CreativeInputError('Finish every chapter before exporting');
  }
  const decisions = world.turns.map((step, index) => {
    const answer = run.answers[index];
    const option = step.choices.find(o => o.id === answer.choiceId);
    return {
      chapter: index + 1,
      stageId: step.id,
      heading: pick(step.heading, run.locale),
      question: pick(step.question, run.locale),
      selectedChoice: option.id,
      decision: pick(option.label, run.locale),
      simulatedConsequence: pick(option.consequence, run.locale),
      contribution: option.artifact,
      authoredLine: answer.note || null
    };
  });
  return {
    schema: 'iv-creative-deliverable-v1',
    version: EDITION,
    type: world.mode,
    world: { id: world.id, name: world.name, title: pick(world.title, run.locale) },
    language: run.locale,
    project: { ...run.project },
    objective: pick(world.objective, run.locale),
    decisions,
    metricType: 'illustrative-design-heuristic-not-conversion-or-customer-data',
    heuristics: heuristicScores(run),
    ending: pick(world.ending, run.locale),
    evidenceChecklist: [...VERIFICATION[run.locale]],
    disclaimer: DISCLAIMER[run.locale],
    provenance: {
      mode: 'browser-only', tracking: 'none', externalAI: false,
      purchases: false, realParticipants: false,
      selectedBranches: decisions.length
    }
  };
}

export function worldIntro(worldId, locale) {
  const world = knownWorld(worldId);
  knownLocale(locale);
  return {
    id: world.id, name: world.name, symbol: world.symbol,
    number: world.number, mode: world.mode,
    title: pick(world.title, locale),
    introduction: pick(world.introduction, locale),
    objective: pick(world.objective, locale),
    chapters: world.turns.length,
    disclaimer: DISCLAIMER[locale]
  };
}

/** Defensive schema audit, executed in CI and unit tests for every world. */
export function auditWorldDefinitions() {
  if (WORLD_IDS.length !== 5) throw new CreativeInputError('Expected exactly five playable worlds');
  for (const id of WORLD_IDS) {
    const world = knownWorld(id);
    if (!world.turns || world.turns.length < 4 || world.dimensions.length !== 3) {
      throw new CreativeInputError('Incomplete creative world: ' + id);
    }
    if (new Set(world.dimensions.map(d => d.id)).size !== 3) {
      throw new CreativeInputError('Duplicate metric');
    }
    const fields = [world.title, world.introduction, world.objective, world.ending];
    const stages = new Set();
    for (const step of world.turns) {
      if (stages.has(step.id) || step.choices.length !== 3) {
        throw new CreativeInputError('Invalid chapter design');
      }
      stages.add(step.id);
      fields.push(step.heading, step.question, step.hint);
      const seen = new Set();
      for (const o of step.choices) {
        if (seen.has(o.id)) throw new CreativeInputError('Duplicate choice');
        seen.add(o.id);
        fields.push(o.label, o.consequence);
        if (!Object.keys(o.delta).length) throw new CreativeInputError('Decision has no consequence');
        for (const [key, delta] of Object.entries(o.delta)) {
          if (!world.dimensions.some(m => m.id === key) ||
              !Number.isInteger(delta) || Math.abs(delta) > 30) {
            throw new CreativeInputError('Invalid decision scoring');
          }
        }
      }
    }
    for (const value of fields) {
      if (LANGUAGES.some(locale => typeof value?.[locale] !== 'string' || value[locale].length < 3)) {
        throw new CreativeInputError('Translation missing from ' + id);
      }
    }
  }
  return { worlds: WORLD_IDS.length, languages: LANGUAGES.length,
    chapters: WORLD_IDS.reduce((sum, id) => sum + WORLDS[id].turns.length, 0) };
}
