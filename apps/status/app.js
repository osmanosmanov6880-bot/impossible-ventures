'use strict';

const text = {
  ru: {
    language: 'Язык', home: 'На главную ↗', system: 'ДИАГНОСТИКА / LIVE',
    heroFirst: 'Всё под', heroSecond: 'контролем.',
    intro: 'Проверяем не красивую анимацию, а реальную доступность этого экземпляра сервера и возможность записи в базу данных.',
    overall: 'ОБЩЕЕ СОСТОЯНИЕ', checking: 'Проверка...', connecting: 'Подключаемся к API',
    checks: 'ДВЕ НЕЗАВИСИМЫЕ ПРОВЕРКИ',
    processTitle: 'Сервер приложения', processDesc: 'Проверяем, отвечает ли запущенный Node.js-процесс на запрос.',
    storageTitle: 'База данных', storageDesc: 'Проверяем запись в SQLite с откатом пробной транзакции. Данные клиентов не изменяются.',
    detailEyebrow: 'ДЕТАЛИ НАБЛЮДЕНИЯ', detailsTitle: 'Проверка без секретов.',
    refresh: 'Проверить снова', lastChecked: 'Последняя проверка', notYet: 'Ещё не проводилась',
    modeTitle: 'Режим', unknown: 'Не определён', credentialsTitle: 'Данные пользователей',
    notShown: 'Не отображаются',
    disclaimer: 'Это техническая проверка одного экземпляра сервера, а не гарантия непрерывной работы во всём мире. На статическом GitHub Pages API недоступен — это нормально для демоверсии.',
    visitGame: 'Открыть игру ↗', visitPilot: 'Открыть кабинет ↗', privacy: 'Обработка данных ↗',
    healthy: 'Система отвечает', healthyDetail: 'Сервер работает, SQLite принимает запись',
    degraded: 'Требуется внимание', degradedDetail: 'Процесс доступен, но база данных не готова',
    offline: 'Сервер недоступен', offlineDetail: 'Не удалось подтвердить работу сервера',
    preview: 'Деморежим', previewDetail: 'Статический сайт без серверной части',
    reachable: 'Сервер отвечает', storageWorking: 'Запись подтверждена',
    unavailable: 'Не отвечает', storageFailed: 'Запись не подтверждена',
    staticValue: 'Статическая версия', singleValue: 'Один сервер Node.js', notConnected: 'Нет соединения'
  },
  en: {
    language: 'Language', home: 'Homepage ↗', system: 'DIAGNOSTICS / LIVE',
    heroFirst: 'Know your', heroSecond: 'systems.',
    intro: 'Checking the actual availability of this server instance and its ability to write to the database — not a decorative status animation.',
    overall: 'OVERALL STATUS', checking: 'Checking...', connecting: 'Contacting the API',
    checks: 'TWO INDEPENDENT CHECKS',
    processTitle: 'Application server', processDesc: 'Checks whether the running Node.js process responds.',
    storageTitle: 'Database', storageDesc: 'Tests a rolled-back SQLite write. Customer records are not modified.',
    detailEyebrow: 'OBSERVABILITY', detailsTitle: 'Diagnostics without secrets.',
    refresh: 'Check again', lastChecked: 'Last checked', notYet: 'Not checked yet',
    modeTitle: 'Mode', unknown: 'Not determined', credentialsTitle: 'User information',
    notShown: 'Not displayed',
    disclaimer: 'This checks only one server instance, not worldwide uptime or service-level guarantees. A static GitHub Pages preview has no API — this is expected.',
    visitGame: 'Open the game ↗', visitPilot: 'Open Pilot Studio ↗', privacy: 'Data handling ↗',
    healthy: 'Service is responding', healthyDetail: 'Node.js responds and SQLite accepts writes',
    degraded: 'Action required', degradedDetail: 'The process is online but database readiness failed',
    offline: 'Server unreachable', offlineDetail: 'The live application could not be confirmed',
    preview: 'Preview mode', previewDetail: 'Static website without the server API',
    reachable: 'Server responds', storageWorking: 'Write test passed',
    unavailable: 'Unreachable', storageFailed: 'Write test failed',
    staticValue: 'Static preview', singleValue: 'Single Node.js server', notConnected: 'Not connected'
  },
  zh: {
    language: '语言', home: '返回主页 ↗', system: '系统诊断 / 实时',
    heroFirst: '系统尽在', heroSecond: '掌控。',
    intro: '验证当前服务器实例的实际连接情况和数据库写入能力，而不是显示装饰性的在线动画。',
    overall: '整体状态', checking: '检查中...', connecting: '正在连接 API',
    checks: '两项独立检测',
    processTitle: '应用服务器', processDesc: '检查运行中的 Node.js 进程是否响应。',
    storageTitle: '数据库', storageDesc: '执行并回滚 SQLite 写入测试，不会更改客户记录。',
    detailEyebrow: '运行状态', detailsTitle: '不暴露秘密的诊断。',
    refresh: '重新检测', lastChecked: '上次检测', notYet: '尚未检测',
    modeTitle: '运行模式', unknown: '未知', credentialsTitle: '用户资料',
    notShown: '不予显示',
    disclaimer: '此页面只检测一个服务器实例，不代表全球正常运行时间或服务保证。GitHub Pages 静态预览没有 API，这是正常情况。',
    visitGame: '打开游戏 ↗', visitPilot: '打开 Pilot Studio ↗', privacy: '数据处理说明 ↗',
    healthy: '服务响应正常', healthyDetail: 'Node.js 正常响应，SQLite 支持写入',
    degraded: '需要处理', degradedDetail: '服务进程在线，但数据库未就绪',
    offline: '无法连接服务器', offlineDetail: '无法确认应用服务器状态',
    preview: '演示模式', previewDetail: '仅静态网站，没有服务器 API',
    reachable: '服务器正常', storageWorking: '写入检测成功',
    unavailable: '无法访问', storageFailed: '写入检测失败',
    staticValue: '静态预览', singleValue: '单实例 Node.js', notConnected: '未连接'
  }
};

const localeControl = document.getElementById('statusLocale');
const refreshButton = document.getElementById('refreshStatus');
let language = 'ru';
let lastProbe = null;
let busy = false;

function copy(key) {
  return text[language][key] || text.ru[key] || key;
}

function el(id) {
  return document.getElementById(id);
}

function stateOf(id, stateName) {
  el(id).dataset.state = stateName;
}

function localize() {
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : language;
  for (const node of document.querySelectorAll('[data-i18n]')) {
    node.textContent = copy(node.dataset.i18n);
  }
  if (lastProbe) render(lastProbe);
}

function setLanguage(next) {
  language = Object.hasOwn(text, next) ? next : 'ru';
  localeControl.value = language;
  try { localStorage.setItem('impossible-status-locale', language); } catch {}
  localize();
}

async function requestProbe(path) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const response = await fetch(path, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
      signal: controller.signal
    });
    let data = null;
    try {
      if ((response.headers.get('content-type') || '').includes('application/json')) {
        data = await response.json();
      }
    } catch {}
    return {
      status: response.status,
      ok: response.ok && data?.ok === true,
      data
    };
  } catch {
    return { status: 0, ok: false, data: null };
  } finally {
    clearTimeout(timeout);
  }
}

function render(snapshot) {
  const live = snapshot.live.ok;
  const ready = snapshot.ready.ok;
  const preview = snapshot.live.status === 404 && snapshot.ready.status === 404;
  let overall;
  let detail;
  let mode;
  if (live && ready) {
    overall = 'healthy';
    detail = 'healthyDetail';
    mode = 'singleValue';
  } else if (preview) {
    overall = 'preview';
    detail = 'previewDetail';
    mode = 'staticValue';
  } else if (live) {
    overall = 'degraded';
    detail = 'degradedDetail';
    mode = 'singleValue';
  } else {
    overall = 'offline';
    detail = 'offlineDetail';
    mode = 'notConnected';
  }

  const visualState = overall === 'healthy' ? 'ok' : overall === 'preview' ? 'pending' : 'error';
  stateOf('statusPlate', visualState);
  stateOf('processMetric', live ? 'ok' : preview ? 'pending' : 'error');
  stateOf('storageMetric', ready ? 'ok' : preview ? 'pending' : 'error');
  el('overallStatus').textContent = copy(overall);
  el('overallDetail').textContent = copy(detail);
  el('processStatus').textContent = copy(live ? 'reachable' : preview ? 'preview' : 'unavailable');
  el('storageStatus').textContent = copy(ready ? 'storageWorking' : preview ? 'preview' : 'storageFailed');
  el('modeValue').textContent = copy(mode);
  el('lastChecked').textContent = new Date(snapshot.checkedAt).toLocaleString(
    { ru: 'ru-RU', en: 'en-GB', zh: 'zh-CN' }[language],
    { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  );
}

async function refresh() {
  if (busy) return;
  if (document.body.dataset.staticPreview === 'true') {
    lastProbe = {
      live: { status: 404, ok: false },
      ready: { status: 404, ok: false },
      checkedAt: Date.now()
    };
    render(lastProbe);
    return;
  }
  busy = true;
  refreshButton.disabled = true;
  try {
    const [live, ready] = await Promise.all([
      requestProbe('/api/v1/live'),
      requestProbe('/api/v1/ready')
    ]);
    lastProbe = { live, ready, checkedAt: Date.now() };
    render(lastProbe);
  } finally {
    busy = false;
    refreshButton.disabled = false;
  }
}

localeControl.addEventListener('change', () => setLanguage(localeControl.value));
refreshButton.addEventListener('click', refresh);

try {
  const stored = localStorage.getItem('impossible-status-locale') ||
    localStorage.getItem('dda-locale');
  language = Object.hasOwn(text, stored) ? stored : 'ru';
} catch {
  language = 'ru';
}
localize();
refresh();

setInterval(() => {
  if (!document.hidden) refresh();
}, 30_000);
