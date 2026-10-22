'use strict';

const form = document.getElementById('operatorLogin');
const tokenInput = document.getElementById('operatorToken');
const statusNode = document.getElementById('operatorState');
const list = document.getElementById('operatorList');
const stats = document.getElementById('operatorStats');
const refresh = document.getElementById('refreshOperator');
const logout = document.getElementById('logoutOperator');
const languagePicker = document.getElementById('operatorLocale');

const dictionary = {
  ru: {
    operatorLabel: 'ОПЕРАТОР / ЛОКАЛЬНЫЙ КЛЮЧ', language: 'Язык', experimentNav: 'КАБИНЕТ ЭКСПЕРИМЕНТОВ ↗',
    access: 'ДОСТУП ОГРАНИЧЕН / БЕЗ SSO',
    eyebrow: 'ЗАЯВКИ / АЛЬФА', pilot: 'Pilot', command: 'Контроль.',
    explanation: 'Просматривайте реальные заявки, сохранённые на этом сервере. Никаких вымышленных клиентов и доходов. Установите сильный OPERATOR_TOKEN: браузер не сохраняет ключ в постоянном хранилище.',
    tokenLabel: 'КЛЮЧ ДОСТУПА ОПЕРАТОРА',
    tokenPlaceholder: 'Введите серверный ключ оператора',
    openPipeline: 'ОТКРЫТЬ ЗАЯВКИ ↗', refresh: 'ОБНОВИТЬ ↻', logout: 'ВЫЙТИ ↗',
    footerWarning: 'НЕ ИСПОЛЬЗУЙТЕ ДЛЯ КОНФИДЕНЦИАЛЬНЫХ ДАННЫХ КЛИЕНТОВ',
    total: 'ВСЕГО', new: 'НОВЫЕ', contacted: 'НА СВЯЗИ', qualified: 'ЦЕЛЕВЫЕ',
    won: 'ВЫИГРАНО', lost: 'ОТКАЗ',
    company: 'КОМПАНИЯ', contact: 'КОНТАКТ', email: 'EMAIL', website: 'САЙТ',
    goal: 'ЦЕЛЬ', budget: 'БЮДЖЕТ', locale: 'ЯЗЫК', attributed: 'A/B ЭКСПЕРИМЕНТ', status: 'СТАТУС',
    saveStatus: 'СОХРАНИТЬ', noRequests: 'Заявок на этом сервере пока нет.',
    refreshed: 'Показаны только сохранённые заявки. Обновлено: ', updated: 'Обновлён статус заявки ',
    loggedOut: 'Сеанс завершён. Ключ удалён из памяти этой страницы.',
    invalidToken: 'Ключ доступа не принят. Проверьте серверный OPERATOR_TOKEN.',
    missingServer: 'Операторский доступ на сервере не настроен.',
    unexpectedError: 'Не удалось получить заявки.'
  },
  en: {
    operatorLabel: 'OPERATOR / LOCAL ACCESS TOKEN', language: 'Language', experimentNav: 'EXPERIMENT COMMAND ↗',
    access: 'ACCESS CONTROLLED / NO SSO',
    eyebrow: 'PIPELINE OPERATIONS / ALPHA', pilot: 'Pilot', command: 'Command.',
    explanation: 'Review genuine requests stored on this server. No fictional leads, payments or revenue. Use a strong OPERATOR_TOKEN environment variable; the browser never stores the key persistently.',
    tokenLabel: 'OPERATOR ACCESS TOKEN', tokenPlaceholder: 'Enter your server-side operator token',
    openPipeline: 'OPEN PIPELINE ↗', refresh: 'REFRESH DATA ↻', logout: 'LOG OUT ↗',
    footerWarning: 'DO NOT USE FOR HIGHLY SENSITIVE CUSTOMER DATA',
    total: 'TOTAL', new: 'NEW', contacted: 'CONTACTED', qualified: 'QUALIFIED',
    won: 'WON', lost: 'LOST',
    company: 'COMPANY', contact: 'CONTACT', email: 'EMAIL', website: 'WEBSITE',
    goal: 'GOAL', budget: 'BUDGET', locale: 'LANGUAGE', attributed: 'A/B EXPERIMENT', status: 'STATUS',
    saveStatus: 'SAVE STATUS', noRequests: 'No real pilot requests have been received.',
    refreshed: 'Showing real stored pilot requests. Last refreshed: ', updated: 'Updated request ',
    loggedOut: 'Signed out. The access key was cleared from this page’s memory.',
    invalidToken: 'Operator access key was not accepted. Verify OPERATOR_TOKEN on the server.',
    missingServer: 'Operator access is not configured on the server.',
    unexpectedError: 'Could not load the pilot requests.'
  },
  zh: {
    operatorLabel: '运营人员 / 本地访问令牌', language: '语言', experimentNav: '实验管理 ↗',
    access: '受控访问 / 未启用单点登录',
    eyebrow: '潜在客户管理 / 测试版', pilot: 'Pilot', command: '控制台。',
    explanation: '仅查看保存在当前服务器上的真实申请，不展示虚构的客户、支付或收入。请设置强随机 OPERATOR_TOKEN；浏览器不会持久保存令牌。',
    tokenLabel: '运营人员访问令牌', tokenPlaceholder: '输入服务器设置的访问令牌',
    openPipeline: '打开申请列表 ↗', refresh: '刷新数据 ↻', logout: '退出登录 ↗',
    footerWarning: '请勿提交高度敏感的客户资料',
    total: '总计', new: '新申请', contacted: '已联系', qualified: '有效客户',
    won: '成功', lost: '未成交',
    company: '公司', contact: '联系人', email: '邮箱', website: '网站',
    goal: '目标', budget: '预算', locale: '语言', attributed: '关联 A/B 实验', status: '状态',
    saveStatus: '保存状态', noRequests: '这台服务器目前没有收到真实申请。',
    refreshed: '只显示服务器中实际保存的申请。更新时间：',
    updated: '已更新申请 ', loggedOut: '已退出，此页面内存中的令牌已清除。',
    invalidToken: '访问令牌无效。请检查服务器的 OPERATOR_TOKEN。',
    missingServer: '服务器未配置运营人员访问权限。',
    unexpectedError: '无法读取申请记录。'
  }
};

const statuses = ['new', 'contacted', 'qualified', 'won', 'lost'];
const localeCodes = { ru: 'ru-RU', en: 'en-GB', zh: 'zh-CN' };

let language = 'ru';
let accessToken = '';
let authEpoch = 0;
let lastResponse = null;
let stateKind = 'none';
let stateDetail = '';

function phrase(key) {
  return dictionary[language][key] || dictionary.en[key] || key;
}

function setStatus(kind, detail = '') {
  stateKind = kind;
  stateDetail = detail;
  if (kind === 'none') statusNode.textContent = '';
  else if (kind === 'error') statusNode.textContent = detail || phrase('unexpectedError');
  else statusNode.textContent = phrase(kind) + detail;
}

function applyLanguage() {
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : language;
  languagePicker.value = language;
  for (const node of document.querySelectorAll('[data-i18n]')) {
    node.textContent = phrase(node.dataset.i18n);
  }
  for (const node of document.querySelectorAll('[data-i18n-placeholder]')) {
    node.placeholder = phrase(node.dataset.i18nPlaceholder);
  }
  if (lastResponse) render(lastResponse);
  setStatus(stateKind, stateDetail);
}

function makeNode(tag, className = '', value) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (value !== undefined) el.textContent = String(value);
  return el;
}

async function request(path, method = 'GET', body) {
  const response = await fetch(path, {
    method,
    cache: 'no-store',
    headers: {
      Authorization: 'Bearer ' + accessToken,
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' })
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) throw new Error(phrase('invalidToken'));
    if (response.status === 503) throw new Error(phrase('missingServer'));
    throw new Error(data.error || phrase('unexpectedError'));
  }
  return data;
}

function render(data) {
  stats.replaceChildren();
  list.replaceChildren();

  for (const key of ['total', ...statuses]) {
    const card = makeNode('div', 'operator-stat');
    card.append(makeNode('span', '', phrase(key)), makeNode('strong', '', data.summary[key] ?? 0));
    stats.appendChild(card);
  }

  if (!data.items.length) list.appendChild(makeNode('p', 'operator-empty', phrase('noRequests')));

  for (const item of data.items) {
    const card = makeNode('article', 'operator-card');
    const top = makeNode('div', 'operator-card-top');
    const heading = makeNode('div');
    heading.append(makeNode('h3', '', item.company), makeNode('span', 'operator-meta', item.id));

    const date = makeNode('time', 'operator-meta',
      new Date(item.createdAt).toLocaleString(localeCodes[language]));
    date.dateTime = new Date(item.createdAt).toISOString();
    top.append(heading, date);

    const details = makeNode('div', 'operator-details');
    for (const [label, value] of [
      ['contact', item.contact], ['email', item.email], ['website', item.website || '—'],
      ['goal', item.goal], ['budget', item.budget], ['locale', item.locale]
    ]) {
      const block = makeNode('div');
      block.append(makeNode('small', '', phrase(label)), makeNode('span', '', value));
      details.appendChild(block);
    }
    if (item.experimentId) {
      const linked = makeNode('div');
      linked.append(
        makeNode('small', '', phrase('attributed')),
        makeNode('span', '', item.experimentId + ' / ' + (item.experimentArm || '—'))
      );
      details.appendChild(linked);
    }

    const controls = makeNode('div', 'operator-controls');
    const label = makeNode('label', '', phrase('status'));
    const select = makeNode('select');
    select.setAttribute('aria-label', phrase('status'));
    for (const value of statuses) {
      const option = makeNode('option', '', phrase(value));
      option.value = value;
      select.appendChild(option);
    }
    select.value = item.status;

    const save = makeNode('button', 'download', phrase('saveStatus'));
    save.type = 'button';
    save.addEventListener('click', async () => {
      save.disabled = true;
      const epoch = authEpoch;
      try {
        await request('/api/v1/operator/pilots/' + item.id + '/status', 'POST', { status: select.value });
        if (epoch !== authEpoch) return;
        setStatus('updated', item.id);
        await load();
      } catch (error) {
        if (epoch === authEpoch) setStatus('error', error.message);
      } finally {
        save.disabled = false;
      }
    });

    label.appendChild(select);
    controls.append(label, save);
    card.append(top, details, controls);
    list.appendChild(card);
  }
}

async function load() {
  const epoch = authEpoch;
  if (!accessToken) return;
  const data = await request('/api/v1/operator/pilots');
  if (epoch !== authEpoch || !accessToken) return;
  lastResponse = data;
  render(data);
  const stamp = new Date().toLocaleTimeString(localeCodes[language], {
    hour: '2-digit', minute: '2-digit'
  });
  setStatus('refreshed', stamp + '.');
}

function forgetSession() {
  authEpoch += 1;
  accessToken = '';
  tokenInput.value = '';
  lastResponse = null;
  stats.replaceChildren();
  list.replaceChildren();
  refresh.disabled = true;
  logout.disabled = true;
  setStatus('loggedOut');
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  accessToken = tokenInput.value;
  tokenInput.value = '';
  const epoch = ++authEpoch;
  try {
    await load();
    if (epoch === authEpoch) {
      refresh.disabled = false;
      logout.disabled = false;
    }
  } catch (error) {
    if (epoch === authEpoch) {
      forgetSession();
      setStatus('error', error.message || phrase('unexpectedError'));
    }
  }
});

refresh.addEventListener('click', () => {
  load().catch(error => {
    if (accessToken) setStatus('error', error.message || phrase('unexpectedError'));
  });
});
logout.addEventListener('click', forgetSession);

languagePicker.addEventListener('change', () => {
  language = Object.hasOwn(dictionary, languagePicker.value) ? languagePicker.value : 'ru';
  try { localStorage.setItem('pilot-operator-locale', language); } catch {}
  applyLanguage();
});

try {
  const stored = localStorage.getItem('pilot-operator-locale');
  language = Object.hasOwn(dictionary, stored) ? stored : 'ru';
} catch {
  language = 'ru';
}
applyLanguage();
