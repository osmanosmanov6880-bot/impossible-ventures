import { WORLDS, WORLD_IDS, pick } from './worlds.mjs';

const isText = (v, min, max) => typeof v === 'string' && v.trim().length >= min
  && v.length <= max && !/[\u0000-\u001f\u007f-\u009f\u202a-\u202e]/u.test(v);
const safe = (v, max) => v.trim().replace(/\s+/g, ' ').slice(0, max);
const notices = {
  ru: 'ТВОРЧЕСКАЯ ГИПОТЕЗА, НЕ ДОКАЗАННЫЕ ФАКТЫ. Проверьте тексты и заявления перед запуском.',
  en: 'CREATIVE HYPOTHESIS, NOT VERIFIED FACTS. Review claims and evidence before any launch.',
  zh: '创意假设，而非已验证事实。发布前请审查广告主张与证据。'
};
const cta = {ru:'Обсудить пилот',en:'Discuss a pilot',zh:'讨论试点项目'};

/**
 * Converts an opt-in locally downloaded game artifact into a strictly typed,
 * UNSAVED campaign draft. Never reads a token, payment, CTR or customer record.
 * The caller must require explicit review and subsequent Save Draft action.
 */
export function toCampaignDraft(artifact, locale = 'ru') {
  if (!['ru','en','zh'].includes(locale)) throw new Error('Unsupported language');
  if (!artifact || typeof artifact !== 'object' || Array.isArray(artifact) ||
      artifact.schema !== 'iv-creative-deliverable-v1' ||
      !artifact.world || !WORLD_IDS.includes(artifact.world.id) ||
      !artifact.project || !Array.isArray(artifact.decisions) ||
      !artifact.provenance || artifact.provenance.mode !== 'browser-only' ||
      artifact.provenance.tracking !== 'none' ||
      artifact.provenance.realParticipants !== false ||
      artifact.metricType !== 'illustrative-design-heuristic-not-conversion-or-customer-data') {
    throw new Error('Not a compatible, explicitly local creative-world report');
  }
  const world = WORLDS[artifact.world.id];
  if (artifact.decisions.length !== world.turns.length) {
    throw new Error('The creative-world report is incomplete');
  }
  for (let i = 0; i < artifact.decisions.length; i++) {
    const chapter = artifact.decisions[i], definition = world.turns[i];
    if (!chapter || typeof chapter !== 'object' || chapter.stageId !== definition.id ||
        !definition.choices.some(choice => choice.id === chapter.selectedChoice) ||
        (chapter.authoredLine !== null && chapter.authoredLine !== undefined &&
        !isText(chapter.authoredLine, 0, 600))) {
      throw new Error('Invalid creative decision in imported file');
    }
  }
  const { brand, product, audience } = artifact.project;
  if (!isText(brand,2,90)||!isText(product,3,180)||!isText(audience,3,180)) {
    throw new Error('Invalid project metadata in imported report');
  }
  const lines=world.turns.map((chapter,i)=>{
    const part=artifact.decisions[i];
    const choice=chapter.choices.find(o=>o.id===part.selectedChoice);
    const personal=typeof part.authoredLine==='string' && part.authoredLine.trim()
      ? ' — '+safe(part.authoredLine,110):'';
    return String(i+1)+'. '+pick(choice.label,locale)+personal;
  });
  // Strictly do not propagate game scores into a server-backed campaign or an
  // unsupported claim such as "achieved 90% conversion rate".
  const body=safe(notices[locale]+'\n'+lines.join('\n'),700);
  return {
    title:safe(world.name+' / '+brand,100),
    venture:world.id,
    goal:'validation',
    channel:'landing',
    audience:safe(audience,300),
    offer:safe(product,240),
    headline:safe(product.length>=5?product:'Idea: '+product,180),
    body,
    ctaLabel:cta[locale],
    _bridge:{
      source:'local-authored-experience',
      steps:world.turns.length,
      persisted:false,
      requiresEditorialReview:true,
      noRealPerformanceMetrics:true
    }
  };
}
