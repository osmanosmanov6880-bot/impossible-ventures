const i18n = {
  ru: {
    pilotLink:'СТУДИЯ ПИЛОТОВ',gameLink:'DEAD DROP ↗',stage:'RESEARCH ALPHA / 0.7',
    eyebrow:'ЭКСПЕРИМЕНТАЛЬНАЯ РЕКЛАМА / 001',headline1:'Не угадывай.',headline2:'Проверяй.',
    lead:'Создавайте две рекламные версии. Распределяйте посетителей случайно. Измеряйте реальные переходы к заявке — без стороннего отслеживания и поддельной статистики.',
    startAction:'ОТКРЫТЬ ЭКСПЕРИМЕНТ ↗',pilotAction:'СПЛАНИРОВАТЬ КАМПАНИЮ →',
    random:'СЛУЧАЙНОЕ РАСПРЕДЕЛЕНИЕ',thirdParty:'СТОРОННИХ ТРЕКЕРОВ',consent:'ЯВНОЕ СОГЛАСИЕ',
    band1:'ИССЛЕДОВАНИЕ, НЕ ОБЕЩАНИЯ',band2:'РЕАЛЬНЫЕ СОБЫТИЯ, НЕ ПРОДАННЫЕ ПОКАЗЫ',band3:'ТОЛЬКО С СОГЛАСИЕМ',
    labLabel:'01 / ИНТЕРАКТИВНОЕ ИССЛЕДОВАНИЕ',experimentHeading:'Испытайте новую рекламу.',
    experimentHint:'Выберите активный эксперимент или откройте демонстрацию без передачи данных.',
    chooseLabel:'ВЫБОР ЭКСПЕРИМЕНТА',choose:'Активная кампания',loading:'Проверяем доступные эксперименты…',
    privacyHeading:'Приватность под вашим контролем',privacySubtitle:'Согласие требуется только для измеряемого теста',
    optinText:'Я согласен(на) на анонимное участие в A/B-исследовании и учёт начала сессии и нажатия на кнопку предложения.',
    privacyDetail:'Мы не сохраняем IP-адрес, имя или почту в аналитике. Случайный токен сессии живёт в памяти вкладки, данные сессии удаляются через 7 дней; агрегаты — через 90 дней. Это исследование, не показ оплаченной рекламы.',
    join:'НАЧАТЬ СЛУЧАЙНЫЙ A/B-ТЕСТ ↗',demo:'ПОСМОТРЕТЬ ДЕМО БЕЗ УЧЁТА →',
    untracked:'Пока нет измеряемой сессии.',creativeTitle:'ТВОРЧЕСКАЯ ВЕРСИЯ / ПРЕДПРОСМОТР',
    emptyHeading:'История начинается с выбора.',
    emptyBody:'Выберите активный тест или демонстрацию. До вашего согласия мы не записываем события.',
    editorial:'РЕКЛАМНЫЕ УТВЕРЖДЕНИЯ И ЭФФЕКТИВНОСТЬ НЕ ПРОВЕРЕНЫ НЕЗАВИСИМО',
    p1Title:'Честное распределение',p1Desc:'Сервер случайно назначает A или B, когда человек даёт согласие.',
    p2Title:'Реальное действие',p2Desc:'Одно нажатие CTA учитывается лишь однажды для данной сессии. Это не продажа.',
    p3Title:'Решение на основе данных',p3Desc:'Оператор видит реальные выборки и интервалы неопределённости — без выдуманной победы.',
    closingEyebrow:'02 / ОТ ИССЛЕДОВАНИЯ К БИЗНЕСУ',
    closingHeading:'Следующий шаг — платящие клиенты, а не красивые графики.',
    closingText:'Эксперимент измеряет интерес к призыву действовать. Квалифицированные заявки, выручка и окупаемость требуют отдельной проверки.',
    closingButton:'ОБСУДИТЬ ПИЛОТ ↗',privacyLink:'Обработка данных',operatorLink:'Кабинет оператора',
    footerNote:'Нет рекламы в эфире, оплаты или подтверждённого роста дохода.',
    none:'Сейчас нет активных экспериментов. Демоверсия работает локально и не создаёт статистику.',
    offline:'Сервер экспериментов недоступен. Демоверсия работает без сохранения событий.',
    available:'Выберите кампанию, отметьте согласие и запустите случайное распределение.',
    previewStatus:'Локальный пример без API, без согласия и без учёта событий.',
    assigned:'Вариант назначен сервером. Начало сессии учтено как техническое событие.',
    failed:'Не получилось начать измеряемый тест. Демоверсия по-прежнему доступна.',
    clicked:'Нажатие CTA записано однократно. Это не заявка и не продажа.',
    clickError:'Не удалось записать действие. Можно повторить попытку.',
    previewA:'ДЕМО / ВЕРСИЯ A',previewB:'ДЕМО / ВЕРСИЯ B',
    demoAHeadline:'Ваш следующий рекламный тест может быть понятным.',
    demoABody:'Опишите предложение и сравните обычный рекламный текст с интерактивной историей. Контрольная версия показывает прямое сообщение.',
    demoBHeadline:'Что, если реклама станет вашим выбором?',
    demoBBody:'Представьте, что вы меняете направление истории, а затем открываете продукт. Это только креативная гипотеза — её нужно проверить на аудитории.',
    demoOffer:'ОБРАЗЕЦ / НЕИЗМЕРЯЕМЫЙ ПРОСМОТР',demoCTA:'ПОСМОТРЕТЬ ПИЛОТ ↗',
    previewNote:'Демонстрация не засчитывает показы или клики.',activeNote:'Анонимный тест; клики не означают реальные заявки.',
    sessionError:'Для измеряемой версии требуется активная кампания и согласие.',
    choiceNotice:'Ваш выбор меняет только эту историю в памяти вкладки. Он не отправляется на сервер и не считается конверсией.',
    previewPrompt:'Вы попали в рекламную историю. Какой сценарий ближе?',
    previewChoiceOne:'Хочу сэкономить время',previewRevealOne:'Герой начинает день с ясным планом и успевает завершить важную задачу.',
    previewChoiceTwo:'Хочу увидеть новый подход',previewRevealTwo:'Герой выбирает эксперимент вместо догадок и проверяет настоящий результат.'
  },
  en: {
    pilotLink:'PILOT STUDIO',gameLink:'DEAD DROP ↗',stage:'RESEARCH ALPHA / 0.7',
    eyebrow:'THE EXPERIMENTAL FRONTIER / 001',headline1:'Stop guessing.',headline2:'Start testing.',
    lead:'Compare two creative messages with randomized allocation and genuine opt-in CTA counts. No third-party tracking. No fabricated performance.',
    startAction:'OPEN THE EXPERIMENT ↗',pilotAction:'PLAN A CAMPAIGN →',
    random:'RANDOMIZED ALLOCATION',thirdParty:'THIRD-PARTY TRACKERS',consent:'EXPLICIT CONSENT',
    band1:'RESEARCH, NOT PROMISES',band2:'REAL SIGNALS, NOT MEDIA IMPRESSIONS',band3:'EXPLICIT CONSENT ONLY',
    labLabel:'01 / INTERACTIVE RESEARCH',experimentHeading:'Test a new creative idea.',
    experimentHint:'Choose an active experiment, or inspect the untracked demonstration.',
    chooseLabel:'EXPERIMENT SELECTION',choose:'Active campaign',loading:'Checking available experiments…',
    privacyHeading:'Your privacy stays in your hands',privacySubtitle:'Consent is required only for the measured experiment',
    optinText:'I agree to anonymously participate in this A/B study and have session creation and one CTA click counted.',
    privacyDetail:'No IP address, name or email is stored in experiment analytics. The random session token stays in this browser tab memory. Session rows are erased after 7 days and aggregates after 90 days. This is not paid advertising.',
    join:'START RANDOMIZED A/B TEST ↗',demo:'OPEN UNTRACKED DEMO →',
    untracked:'No measured session is active.',creativeTitle:'CREATIVE EXPERIENCE / PREVIEW',
    emptyHeading:'The story begins with a choice.',
    emptyBody:'Select an active test or try the local demo. No events are recorded without your consent.',
    editorial:'CREATIVE CLAIMS AND RESULTS ARE NOT INDEPENDENTLY VERIFIED',
    p1Title:'Fair allocation',p1Desc:'The server randomly assigns A or B after explicit consent.',
    p2Title:'Real actions',p2Desc:'Each session can record its CTA only once. A click is not a sale.',
    p3Title:'Evidence before conclusions',p3Desc:'Operators see real sample sizes and uncertainty intervals, not invented winners.',
    closingEyebrow:'02 / FROM RESEARCH TO BUSINESS',
    closingHeading:'The next step is paying customers, not pretty charts.',
    closingText:'These tests measure response to a CTA. Qualified leads, revenue and ROI need separate verification.',
    closingButton:'DISCUSS A PILOT ↗',privacyLink:'Data handling',operatorLink:'Operator console',
    footerNote:'No live ad network, payments or proven revenue uplift are claimed.',
    none:'No experiments are running. The local demo does not record any results.',
    offline:'Experiment API unavailable. Local preview works without recording any data.',
    available:'Choose a campaign, opt in, and request random assignment.',
    previewStatus:'Untracked local preview. No API, consent or events.',
    assigned:'Server assignment received. A technical session-start event was recorded.',
    failed:'Unable to start a measured experiment. The local demo remains available.',
    clicked:'CTA click counted once. This is not a lead or sale.',clickError:'CTA could not be recorded. Please retry.',
    previewA:'DEMO / ARM A',previewB:'DEMO / ARM B',
    demoAHeadline:'Make your next creative test understandable.',
    demoABody:'Describe one offer and compare direct copy with an interactive story. This control experience shows a straightforward message.',
    demoBHeadline:'What if advertising became your decision?',
    demoBBody:'Imagine guiding the story before revealing the offer. This is a creative hypothesis, not a proven advantage.',
    demoOffer:'SAMPLE / UNTRACKED PREVIEW',demoCTA:'EXPLORE PILOT ↗',
    previewNote:'Local demonstration does not count impressions or clicks.',activeNote:'Opt-in research. Clicks are not verified leads.',
    sessionError:'A running campaign and consent are required.',
    choiceNotice:'Your choice changes this browser-only story. It is not uploaded or counted as a conversion.',
    previewPrompt:'You entered a campaign story. Which path would you choose?',
    previewChoiceOne:'I want to save time',previewRevealOne:'The protagonist starts their day with clarity and has time for important work.',
    previewChoiceTwo:'I want a new approach',previewRevealTwo:'The protagonist chooses evidence over guessing and runs a real experiment.'
  },
  zh: {
    pilotLink:'试点工作室',gameLink:'DEAD DROP ↗',stage:'研究测试版 / 0.7',
    eyebrow:'互动广告实验 / 001',headline1:'停止猜测。',headline2:'开始验证。',
    lead:'将两个广告创意随机分配给自愿参与者，测量真实的按钮点击。不使用第三方跟踪，也不制造虚假数据。',
    startAction:'打开实验 ↗',pilotAction:'规划广告活动 →',
    random:'随机分配',thirdParty:'第三方跟踪器',consent:'明确同意',
    band1:'研究而非承诺',band2:'真实行动而非购买的展示量',band3:'仅在用户同意时记录',
    labLabel:'01 / 互动研究',experimentHeading:'测试新的广告创意。',
    experimentHint:'选择正在运行的实验，或查看不记录数据的演示。',
    chooseLabel:'选择实验',choose:'正在进行的活动',loading:'正在检查活动…',
    privacyHeading:'隐私由您掌控',privacySubtitle:'仅测量实验需要明确同意',
    optinText:'我同意匿名参加 A/B 测试，并记录一次会话开始和一次 CTA 按钮点击。',
    privacyDetail:'分析不保存 IP、姓名或邮箱。随机会话令牌仅驻留在本标签页内存。会话数据保留最多7天，汇总数据保留最多90天。这不是付费广告。',
    join:'开始随机 A/B 测试 ↗',demo:'查看无追踪演示 →',
    untracked:'暂无测量会话。',creativeTitle:'创意体验 / 预览',
    emptyHeading:'故事从选择开始。',
    emptyBody:'选择实验或体验本地演示。未经同意不会记录事件。',
    editorial:'创意声明及结果未经独立验证',
    p1Title:'公平分配',p1Desc:'获得明确同意后，服务器随机分配 A 或 B。',
    p2Title:'真实行动',p2Desc:'每次会话的 CTA 点击最多计数一次。点击不等于销售。',
    p3Title:'以证据决策',p3Desc:'运营者看到真实样本量及不确定区间，不会获得虚构的赢家。',
    closingEyebrow:'02 / 从研究到商业',closingHeading:'下一步是付费客户，而不只是漂亮图表。',
    closingText:'实验只测量 CTA 响应，合格线索、收入和投资回报需另行核实。',
    closingButton:'洽谈试点 ↗',privacyLink:'数据处理',operatorLink:'运营控制台',
    footerNote:'当前不宣称已开展付费广告、收款或证实收入增长。',
    none:'当前没有运行的实验。本地演示不会生成统计数据。',
    offline:'实验 API 不可用。您仍可查看不记录数据的演示。',
    available:'选择活动、同意参与后申请随机分配。',
    previewStatus:'本地演示，不调用 API，不记录事件。',
    assigned:'服务器已分配版本，并记录技术性会话开始事件。',
    failed:'无法开始测量实验，但本地演示仍可使用。',
    clicked:'CTA 点击已计数一次。这不等于线索或销售。',clickError:'未能记录 CTA，请重试。',
    previewA:'演示 / A 组',previewB:'演示 / B 组',
    demoAHeadline:'让下一次广告测试更清晰。',
    demoABody:'比较直述广告文案与互动故事。此对照版本呈现简明的信息。',
    demoBHeadline:'广告也能由您选择剧情吗？',
    demoBBody:'尝试在了解产品前参与故事选择。这只是需要验证的创意假设。',
    demoOffer:'样本 / 无追踪预览',demoCTA:'查看试点 ↗',
    previewNote:'演示不会统计任何展示或点击。',activeNote:'匿名研究：点击不等于真实线索。',
    sessionError:'需要运行中的活动及明确同意。',
    choiceNotice:'此选择仅改变浏览器中的故事，不会发送至服务器，也不会记为转化。',
    previewPrompt:'您进入了广告故事。会选择哪条道路？',
    previewChoiceOne:'我想节省时间',previewRevealOne:'主角更有计划地开始一天，有时间完成重要任务。',
    previewChoiceTwo:'我想发现新方法',previewRevealTwo:'主角选择用真实实验代替猜测。'
  }
};

const els = {
  lang: document.getElementById('lang'),
  campaign: document.getElementById('campaign'),
  campaignNote: document.getElementById('campaignNote'),
  optin: document.getElementById('optin'),
  start: document.getElementById('start'),
  preview: document.getElementById('preview'),
  status: document.getElementById('testStatus'),
  placeholder: document.getElementById('placeholder'),
  creative: document.getElementById('creative'),
  label: document.getElementById('armLabel'),
  offer: document.getElementById('offerLabel'),
  headline: document.getElementById('creativeHeadline'),
  body: document.getElementById('creativeBody'),
  cta: document.getElementById('cta'),
  storyStep: document.getElementById('storyStep'),
  decisionPrompt: document.getElementById('decisionPrompt'),
  choiceOne: document.getElementById('choiceOne'),
  choiceTwo: document.getElementById('choiceTwo'),
  choiceOutcome: document.getElementById('choiceOutcome'),
  note: document.getElementById('creativeNote')
};
const state = {
  available: [], measured: null, busy: false, preview: null, choice: null,
  screenMode: 'empty', apiAvailable: false
};
function t(key) { return (i18n[els.lang.value] || i18n.ru)[key] || key; }

function selectExperimentId() {
  const candidate = new URLSearchParams(location.search).get('id');
  return /^[a-f0-9]{24}$/.test(candidate || '') ? candidate : '';
}
function updateStart() {
  els.start.disabled = Boolean(state.busy || state.measured || !state.apiAvailable ||
    !state.available.some(item => item.id === els.campaign.value) || !els.optin.checked);
}
function showStatus(message, isError = false) {
  els.status.textContent = message;
  els.status.classList.toggle('error-text', isError);
}
function renderScreen() {
  if (state.screenMode === 'empty') {
    els.placeholder.hidden = false;
    els.creative.hidden = true;
    els.label.textContent = '—';
    els.storyStep.hidden = true;
    els.cta.hidden = false;
    return;
  }
  els.placeholder.hidden = true;
  els.creative.hidden = false;
  if (state.screenMode === 'preview') {
    const a = state.preview === 'A';
    els.label.textContent = t(a ? 'previewA' : 'previewB');
    els.offer.textContent = t('demoOffer');
    els.headline.textContent = t(a ? 'demoAHeadline' : 'demoBHeadline');
    els.body.textContent = t(a ? 'demoABody' : 'demoBBody');
    els.cta.textContent = t('demoCTA');
    els.note.textContent = t('previewNote');
  } else if (state.measured) {
    els.label.textContent = 'EXPERIMENT / ' + state.measured.arm;
    els.offer.textContent = state.measured.creative.offer;
    els.headline.textContent = state.measured.creative.headline;
    els.body.textContent = state.measured.creative.body;
    els.cta.textContent = state.measured.creative.ctaLabel + ' ↗';
    els.note.textContent = t('activeNote');
  }
  const story = state.screenMode === 'preview' && state.preview === 'B'
    ? {
        prompt: t('previewPrompt'),
        choices: [
          { label: t('previewChoiceOne'), reveal: t('previewRevealOne') },
          { label: t('previewChoiceTwo'), reveal: t('previewRevealTwo') }
        ]
      }
    : (state.screenMode === 'measured' ? state.measured?.creative?.interaction : null);
  els.storyStep.hidden = !story;
  if (story && Array.isArray(story.choices) && story.choices.length === 2) {
    els.decisionPrompt.textContent = story.prompt;
    els.choiceOne.textContent = '01 / ' + story.choices[0].label;
    els.choiceTwo.textContent = '02 / ' + story.choices[1].label;
    els.choiceOne.classList.toggle('selected', state.choice === 0);
    els.choiceTwo.classList.toggle('selected', state.choice === 1);
    els.choiceOutcome.hidden = state.choice === null;
    els.choiceOutcome.textContent = state.choice === null ? '' : story.choices[state.choice]?.reveal || '';
  }
  els.cta.hidden = Boolean(story && state.choice === null);
  els.cta.disabled = state.busy;
}
function translate() {
  document.documentElement.lang = els.lang.value === 'zh' ? 'zh-CN' : els.lang.value;
  for (const element of document.querySelectorAll('[data-i18n]')) {
    const key = element.dataset.i18n;
    if (i18n[els.lang.value]?.[key]) element.textContent = t(key);
  }
  els.campaignNote.textContent = !state.apiAvailable ? t('offline') :
    (state.available.length ? t('available') : t('none'));
  renderScreen();
}
function prepareCatalog(items) {
  state.available = items;
  els.campaign.replaceChildren();
  if (items.length === 0) {
    const option = document.createElement('option');
    option.textContent = t('none');
    els.campaign.appendChild(option);
    els.campaign.disabled = true;
  } else {
    for (const item of items) {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = item.title;
      els.campaign.appendChild(option);
    }
    els.campaign.disabled = false;
    const requested = selectExperimentId();
    if (requested && items.some(item => item.id === requested)) els.campaign.value = requested;
  }
  els.campaignNote.textContent = !state.apiAvailable ? t('offline') :
    items.length ? t('available') : t('none');
  updateStart();
}
async function loadCatalog() {
  try {
    const response = await fetch('/api/v1/experiments', { cache: 'no-store' });
    if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
      throw new Error('Experiment API not available');
    }
    const data = await response.json();
    if (!Array.isArray(data.items)) throw new Error('Invalid catalog');
    state.apiAvailable = true;
    prepareCatalog(data.items);
  } catch {
    state.apiAvailable = false;
    prepareCatalog([]);
  }
}
els.lang.addEventListener('change', translate);
els.campaign.addEventListener('change', updateStart);
els.optin.addEventListener('change', updateStart);

els.preview.addEventListener('click', () => {
  if (state.measured) {
    showStatus(t('assigned'));
    return;
  }
  state.preview = state.preview === 'A' ? 'B' : 'A';
  state.screenMode = 'preview';
  state.choice = null;
  renderScreen();
  showStatus(t('previewStatus'));
  els.creative.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

function chooseStory(index) {
  if (state.busy || state.screenMode === 'empty') return;
  if (state.screenMode === 'preview' && state.preview !== 'B') return;
  if (state.screenMode === 'measured' && !state.measured?.creative?.interaction) return;
  state.choice = index;
  renderScreen();
}
els.choiceOne.addEventListener('click', () => chooseStory(0));
els.choiceTwo.addEventListener('click', () => chooseStory(1));

els.start.addEventListener('click', async () => {
  const selected = state.available.find(item => item.id === els.campaign.value);
  if (!selected || !els.optin.checked || state.measured || state.busy) {
    showStatus(t('sessionError'), true);
    return;
  }
  state.busy = true;
  updateStart();
  try {
    const response = await fetch('/api/v1/experiments/' + selected.id + '/sessions', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ consent: true })
    });
    if (!response.ok) throw new Error('Session creation failed');
    const result = await response.json();
    if (!result || !['A', 'B'].includes(result.arm) ||
      !/^[a-f0-9]{32}$/.test(result.sessionId || '') ||
      typeof result.token !== 'string' || !result.creative) throw new Error('Invalid assignment');
    state.measured = { ...result, experimentId: selected.id };
    state.screenMode = 'measured';
    state.preview = null;
    state.choice = null;
    els.preview.disabled = true;
    els.optin.disabled = true;
    showStatus(t('assigned'));
    renderScreen();
    els.creative.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch {
    showStatus(t('failed'), true);
  } finally {
    state.busy = false;
    updateStart();
  }
});

els.cta.addEventListener('click', async () => {
  if (state.busy) return;
  if (!state.measured) {
    // No study event is recorded in the local demonstration.
    location.assign('../pilot/#request');
    return;
  }
  const assigned = state.measured;
  state.busy = true;
  els.cta.disabled = true;
  try {
    const response = await fetch('/api/v1/experiments/' + assigned.experimentId +
      '/sessions/' + assigned.sessionId + '/cta', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + assigned.token }
    });
    if (!response.ok) throw new Error('Recording failed');
    const data = await response.json();
    if (data.event !== 'cta_clicked') throw new Error('Invalid acknowledgement');
    showStatus(t('clicked'));
    // The follow-up pilot request is not automatically attributed to this session.
    location.assign('../pilot/#request');
  } catch {
    showStatus(t('clickError'), true);
    els.cta.disabled = false;
  } finally { state.busy = false; }
});

translate();
loadCatalog();
