import {
  evaluateCase, extractDeadDropDossier, CRITERIA,
  MAX_IMPORT_BYTES, EVALUATOR_VERSION
} from './tribunal-engine.mjs';

const dictionary = {
  ru: {
    alpha:'ИССЛЕДОВАТЕЛЬСКИЙ ПРОТОТИП / 01',deadDrop:'DEAD DROP ↗',overline:'ВОЗРАЖЕНИЕ ПРИНЯТО / 2049',
    heroFirst:'Твоя реклама',heroSecond:'на допросе.',
    intro:'Проверьте рекламную идею на понятность, убедительность и качество доказательств — прежде чем тратить бюджет. Никаких выдуманных побед и неподтверждённых обещаний.',
    trustA:'Чёткие критерии',trustB:'Без авторизации',trustC:'Данные остаются в браузере',
    caseStart:'01 / ОТКРЫТЬ ДЕЛО',formTitle:'Расскажите, что рекламируем.',
    formHint:'Достаточно черновой идеи — трибунал покажет, что нужно усилить.',
    productLabel:'Продукт или бренд',productExample:'Например, Aurora — AI-помощник',
    ideaLabel:'Рекламная идея',ideaExample:'Что обещаем, как это показываем и что предлагаем сделать?',
    audienceLabel:'Для кого это',audienceExample:'Самозанятые дизайнеры и небольшие агентства',
    proofLabel:'Какие есть доказательства?',evidenceExample:'Демо, исследование, источник или факт для проверки',
    goalLabel:'Цель кампании',awareness:'Узнаваемость',leads:'Заявки',sales:'Продажи',
    importTitle:'Уже есть досье Dead Drop?',importHint:'Загрузите JSON из финализированной миссии. Чужие закрытые поля и токены не импортируются.',
    importButton:'ИМПОРТИРОВАТЬ .JSON',privateNote:'Без загрузки данных на сервер',reviewButton:'НАЧАТЬ РАЗБОР',
    emptyTitle:'Суд ещё не начался.',emptyText:'Добавьте идею слева. Здесь появится оценка по пяти критериям, конкретные возражения и файл отчёта.',
    readinessLabel:'СИГНАЛЫ ГОТОВНОСТИ',notPerformance:'Это сигналы качества текста, а не вероятность продаж или независимая проверка фактов.',
    objectionsLabel:'ВОЗРАЖЕНИЯ ТРИБУНАЛА',riskLabel:'ПРОВЕРИТЬ ПЕРЕД ПУБЛИКАЦИЕЙ',
    exportJson:'СКАЧАТЬ ОТЧЁТ .JSON ↓',exportText:'СКАЧАТЬ .TXT ↓',copy:'КОПИРОВАТЬ ↗',
    p1Title:'Правда прежде креатива.',p1Body:'Поле доказательств не значит, что факт подтверждён. Проверка источников остаётся за человеком.',
    p2Title:'Люди, а не клики.',p2Body:'Оценка помогает обнаружить слабый оффер, но не предсказывает интерес реальной аудитории.',
    p3Title:'Следующий шаг — тест.',p3Body:'После редакторского разбора можно проверять гипотезу в контролируемом A/B-эксперименте.',
    experimentsLink:'EXPERIMENT LAB ↗',footerPrivacy:'Обработка только в браузере · Результаты не проверены',privacyLink:'Условия обработки данных ↗',
    importSuccess:'Досье загружено. Проверьте поля перед отправкой на разбор.',
    importFailed:'Файл не распознан как финализированное досье Dead Drop.',
    tooLarge:'Файл слишком большой. Допустимый размер — 256 КБ.',
    validation:'Заполните продукт, аудиторию и рекламную идею.',
    copied:'Отчёт скопирован',copyFailed:'Не удалось скопировать. Скачайте .TXT.',
    exported:'Отчёт сохранён в файл',readiness:'Готовность черновика',
    scoreNames:{clarity:'Ясность идеи',audience:'Точность аудитории',proof:'Сигналы доказательств',action:'Следующий шаг',distinctiveness:'Конкретика'},
    questions:{clarity:'Сформулируйте главный результат для клиента в одном предложении, без общих обещаний.',
      audience:'Опишите одну реальную ситуацию и причину, по которой этой аудитории важно предложение.',
      proof:'Добавьте проверяемый источник, воспроизводимую демонстрацию или измеримый факт.',
      action:'Укажите понятное действие пользователя, согласованное с целью кампании.',
      distinctiveness:'Покажите конкретное отличие без голословных заявлений о превосходстве.'},
    clean:'Явных пробелов по пяти текстовым признакам не найдено. Всё равно проведите исследование аудитории.',
    risks:{guarantee:'Есть формулировка о гарантии или 100% результате. Проверьте документальные основания и ограничения.',
      superlative:'Обнаружено превосходство «лучший / №1». Нужны доказательства и корректная методология сравнения.',
      unsupportedUrgency:'Есть срочность или дефицит. Убедитесь, что условие действительно действует.'},
    verification:'Все утверждения и источники требуют независимой проверки человеком перед публикацией.',
    genericError:'Не удалось обработать идею. Проверьте введённые данные.'
  },
  en: {
    alpha:'RESEARCH PROTOTYPE / 01',deadDrop:'DEAD DROP ↗',overline:'OBJECTION ACCEPTED / 2049',
    heroFirst:'Your next ad',heroSecond:'is on trial.',
    intro:'Review a campaign idea for clarity, audience fit and proof before investing. No fictional wins, guaranteed performance or invented evidence.',
    trustA:'Clear criteria',trustB:'No registration',trustC:'Content stays in your browser',
    caseStart:'01 / OPEN A CASE',formTitle:'Tell us what you are advertising.',
    formHint:'An early draft is enough — the tribunal highlights what to strengthen.',
    productLabel:'Product or brand',productExample:'e.g. Aurora — an AI assistant',
    ideaLabel:'Campaign concept',ideaExample:'What do you promise, show, and ask people to do?',
    audienceLabel:'Who is this for?',audienceExample:'Independent designers and small agencies',
    proofLabel:'What evidence exists?',evidenceExample:'Demo, independent research, source or a fact to verify',
    goalLabel:'Campaign objective',awareness:'Awareness',leads:'Qualified leads',sales:'Sales',
    importTitle:'Already have a Dead Drop dossier?',importHint:'Import JSON from a finalized mission. No access token or other agent’s private fields are imported.',
    importButton:'IMPORT .JSON',privateNote:'No content uploaded to our API',reviewButton:'EXAMINE IDEA',
    emptyTitle:'Court is not in session.',emptyText:'Submit an idea on the left to see five writing signals, specific objections and an exportable report.',
    readinessLabel:'DRAFT READINESS SIGNALS',notPerformance:'These count writing signals, not sales probabilities, independently verified facts or legal compliance.',
    objectionsLabel:'TRIBUNAL OBJECTIONS',riskLabel:'VERIFY BEFORE PUBLICATION',
    exportJson:'EXPORT REPORT .JSON ↓',exportText:'EXPORT .TXT ↓',copy:'COPY REPORT ↗',
    p1Title:'Truth before creative.',p1Body:'Entering evidence is not independent verification. Humans must check sources.',
    p2Title:'People, not clicks.',p2Body:'Editorial scoring can expose weak messaging, but cannot predict real audience behavior.',
    p3Title:'Test what matters.',p3Body:'After editorial review, validate the hypothesis in a measured, consent-based A/B experiment.',
    experimentsLink:'EXPERIMENT LAB ↗',footerPrivacy:'Processed only in this browser · Claims unverified',privacyLink:'Data handling ↗',
    importSuccess:'Dossier imported. Review all fields before examination.',
    importFailed:'This is not a compatible finalized Dead Drop dossier.',
    tooLarge:'File exceeds 256 KB.',validation:'Enter a product, audience and campaign idea.',
    copied:'Report copied',copyFailed:'Copy failed. Download a TXT report instead.',
    exported:'Report saved',readiness:'Draft readiness',
    scoreNames:{clarity:'Clarity of idea',audience:'Audience specificity',proof:'Evidence signals',action:'Next action',distinctiveness:'Specificity'},
    questions:{clarity:'Express one clear customer outcome without vague promises.',
      audience:'Describe one recognizable situation and why the audience cares.',
      proof:'Provide a checkable source, repeatable demonstration or measurable fact.',
      action:'State a concrete action consistent with your campaign goal.',
      distinctiveness:'Show a concrete difference without an unproven superiority claim.'},
    clean:'No obvious gaps in the five text signals. Real customer research is still required.',
    risks:{guarantee:'A guarantee or 100% result appears. Verify the supporting evidence and limitations.',
      superlative:'“Best / #1” language detected. Support it with an appropriate comparative method.',
      unsupportedUrgency:'Urgency or scarcity detected. Confirm the deadline or condition is real.'},
    verification:'Humans must independently verify all product claims and sources before publication.',
    genericError:'Could not evaluate this draft. Check the input fields.'
  },
  zh: {
    alpha:'研究原型 / 01',deadDrop:'DEAD DROP ↗',overline:'异议已受理 / 2049',
    heroFirst:'你的广告',heroSecond:'接受审查。',
    intro:'在投入预算之前检查广告概念的清晰度、受众匹配和证据质量。不虚构成功、效果承诺或证明。',
    trustA:'清晰的标准',trustB:'无需注册',trustC:'内容留在浏览器中',
    caseStart:'01 / 开始审查',formTitle:'介绍你的产品。',
    formHint:'早期草案即可，系统会标出需要加强的地方。',
    productLabel:'产品或品牌',productExample:'例如 Aurora AI 助手',
    ideaLabel:'广告创意',ideaExample:'承诺什么、展示什么、让用户采取什么行动？',
    audienceLabel:'目标受众',audienceExample:'自由设计师和小型创意公司',
    proofLabel:'有什么证据？',evidenceExample:'演示、研究、来源或有待核实的事实',
    goalLabel:'活动目标',awareness:'品牌认知',leads:'潜在客户',sales:'销售',
    importTitle:'已有 Dead Drop 档案？',importHint:'导入已完成任务的 JSON。不会导入访问令牌或对方私密字段。',
    importButton:'导入 .JSON',privateNote:'不会将内容上传至 API',reviewButton:'开始审查',
    emptyTitle:'审查尚未开始。',emptyText:'在左侧填写广告概念，查看五项文本信号、修改建议和可导出的报告。',
    readinessLabel:'草案准备程度指标',notPerformance:'这些只是文本特征，不代表销售概率、事实验证或法律合规。',
    objectionsLabel:'审查意见',riskLabel:'发布前需核实',
    exportJson:'导出报告 .JSON ↓',exportText:'导出 .TXT ↓',copy:'复制报告 ↗',
    p1Title:'事实优先于创意。',p1Body:'填写证据不代表已验证。需要人工核查来源。',
    p2Title:'关注人，而非点击。',p2Body:'评分有助于发现表达问题，但无法预测真实受众表现。',
    p3Title:'用实验验证。',p3Body:'完成编辑审查后，在明确同意的 A/B 实验中检验假设。',
    experimentsLink:'EXPERIMENT LAB ↗',footerPrivacy:'仅在浏览器内处理 · 事实未经核实',privacyLink:'数据处理说明 ↗',
    importSuccess:'档案已导入。请在审查前检查所有字段。',
    importFailed:'此文件不是有效的已完成 Dead Drop 档案。',
    tooLarge:'文件超过 256 KB。',validation:'请填写产品、受众和广告创意。',
    copied:'报告已复制',copyFailed:'复制失败，请下载 TXT 报告。',
    exported:'报告已保存',readiness:'草案准备程度',
    scoreNames:{clarity:'想法清晰度',audience:'受众具体性',proof:'证据线索',action:'下一步行动',distinctiveness:'具体程度'},
    questions:{clarity:'用一句话说明具体客户收益，避免空泛承诺。',
      audience:'描述受众的真实情境和需求。',
      proof:'提供可核查的来源、可重复演示或可衡量事实。',
      action:'明确与活动目标一致的下一步行动。',
      distinctiveness:'用具体差异而非未经证实的最高级宣传。'},
    clean:'五项文本信号没有明显缺口，但仍需真实用户研究。',
    risks:{guarantee:'出现保证或 100% 效果表述，请核对证据与限制。',
      superlative:'出现“第一 / 最佳”表述，请提供合理的对比证据。',
      unsupportedUrgency:'出现紧迫或稀缺表述，请确认期限真实有效。'},
    verification:'发布前必须由人工独立核实所有产品声明及来源。',
    genericError:'无法审查此草案，请检查输入。'
  }
};

const localeSelect = document.getElementById('locale');
const fields = ['product','idea','audience','evidence','goal'];
const form = document.getElementById('caseForm');
const fileInput = document.getElementById('dossierFile');
let language = 'ru';
let lastReview = null;
let lastTime = null;
let casesInThisTab = 0;

function t(key) { return dictionary[language][key] || dictionary.en[key] || key; }
function el(id) { return document.getElementById(id); }
function node(tag,className,textValue) {
  const result = document.createElement(tag);
  if (className) result.className = className;
  if (textValue !== undefined) result.textContent = String(textValue);
  return result;
}
function updateLanguage() {
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : language;
  localeSelect.value = language;
  for (const element of document.querySelectorAll('[data-i18n]')) {
    const textValue = t(element.dataset.i18n);
    // All localized content is plain text, not executable HTML.
    element.textContent = textValue;
  }
  for (const element of document.querySelectorAll('[data-placeholder]')) {
    element.placeholder = t(element.dataset.placeholder);
  }
  if (lastReview) render(lastReview);
}
function getFormValues() {
  const source = {};
  for (const name of fields) source[name] = el(name).value;
  return source;
}
function changeFields(next) {
  for (const name of fields) {
    if (next[name] !== undefined) el(name).value = next[name];
  }
}
function safeReport() {
  if (!lastReview) throw new Error('No review has been created');
  return {
    kind:'appeal-2049-editorial-report',
    version:EVALUATOR_VERSION,
    createdAt:lastTime,
    evaluation:lastReview,
    disclaimer:t('notPerformance')
  };
}
function textReport() {
  const report = safeReport();
  const e = report.evaluation;
  const lines = [
    'APPEAL 2049 / ' + t('readiness'),
    '-------------------------------',
    t('productLabel') + ': ' + e.input.product,
    t('audienceLabel') + ': ' + e.input.audience,
    t('goalLabel') + ': ' + e.input.goal,
    t('ideaLabel') + ': ' + e.input.idea,
    t('proofLabel') + ': ' + (e.input.evidence || '—'),
    '',
    t('readinessLabel') + ': ' + e.total + ' / 20'
  ];
  for (const key of CRITERIA) lines.push(t('scoreNames')[key] + ': ' + e.signals[key] + '/4');
  lines.push('', t('objectionsLabel'));
  for (const key of e.gaps) lines.push('- ' + t('questions')[key]);
  if (!e.gaps.length) lines.push('- ' + t('clean'));
  lines.push('', t('riskLabel'));
  for (const key of e.riskFlags) lines.push('- ' + t('risks')[key]);
  lines.push('- ' + t('verification'));
  lines.push('',t('notPerformance'));
  return lines.join('\n');
}
function download(content, filename, mime) {
  const url = URL.createObjectURL(new Blob([content], { type:mime }));
  const anchor = node('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.hidden = true;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 300);
  el('reportStatus').textContent = t('exported');
}
function objection(index, message) {
  const wrapper = node('div','objection');
  wrapper.append(node('span','objection-index',String(index).padStart(2,'0')+' /'),node('p','',message));
  return wrapper;
}
function render(review) {
  el('reviewEmpty').hidden = true;
  el('reviewContent').hidden = false;
  el('caseCount').textContent = String(casesInThisTab).padStart(3,'0');
  el('totalScore').textContent = String(review.total);
  const meter = el('meterProgress');
  meter.style.strokeDashoffset = String(308 - Math.min(1,review.total / 20) * 308);
  const scorecards = el('scorecards');
  scorecards.replaceChildren();
  for (const key of CRITERIA) {
    const row = node('div','score-item');
    const label = node('span','',t('scoreNames')[key]);
    const track = node('div','score-track');
    const bar = node('span','score-bar');
    bar.style.width = (review.signals[key] / 4 * 100) + '%';
    track.append(bar);
    row.append(label,track,node('strong','',review.signals[key]+'/4'));
    scorecards.append(row);
  }
  const objections = el('objectionList');
  objections.replaceChildren();
  const messages = review.gaps.length
    ? review.gaps.map(key => t('questions')[key])
    : [t('clean')];
  messages.forEach((message,i) => objections.append(objection(i+1,message)));
  const risks = el('riskList');
  risks.replaceChildren();
  [...review.riskFlags.map(key => t('risks')[key]),t('verification')]
    .forEach((message,i) => risks.append(objection(i+1,message)));
}

form.addEventListener('submit', event => {
  event.preventDefault();
  el('formError').textContent = '';
  if (!form.reportValidity()) return;
  try {
    lastReview = evaluateCase(getFormValues());
    casesInThisTab += 1;
    lastTime = new Date().toISOString();
    el('reportStatus').textContent = '';
    render(lastReview);
    el('reviewContent').scrollIntoView({block:'nearest',behavior:'smooth'});
  } catch {
    el('formError').textContent = t('validation');
  }
});
fileInput.addEventListener('change', async () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  el('formError').textContent = '';
  if (file.size > MAX_IMPORT_BYTES) {
    el('formError').textContent = t('tooLarge');
    fileInput.value = '';
    return;
  }
  try {
    const payload = JSON.parse(await file.text());
    const imported = extractDeadDropDossier(payload);
    changeFields(imported);
    el('reportStatus').textContent = '';
    el('formError').textContent = t('importSuccess');
  } catch {
    el('formError').textContent = t('importFailed');
  } finally {
    fileInput.value = '';
  }
});
el('downloadJSON').addEventListener('click', () => {
  if (lastReview) download(JSON.stringify(safeReport(),null,2),'appeal-2049-review.json','application/json;charset=utf-8');
});
el('downloadText').addEventListener('click', () => {
  if (lastReview) download(textReport(),'appeal-2049-review.txt','text/plain;charset=utf-8');
});
el('copyReport').addEventListener('click', async () => {
  if (!lastReview) return;
  try {
    await navigator.clipboard.writeText(textReport());
    el('reportStatus').textContent = t('copied');
  } catch {
    el('reportStatus').textContent = t('copyFailed');
  }
});
localeSelect.addEventListener('change', () => {
  language = Object.hasOwn(dictionary,localeSelect.value) ? localeSelect.value : 'ru';
  updateLanguage();
});
const urlLocale = new URLSearchParams(location.search).get('lang');
language = Object.hasOwn(dictionary,urlLocale) ? urlLocale : 'ru';
updateLanguage();
