const form = document.getElementById('experimentForm');
const authForm = document.getElementById('authForm');
const authInput = document.getElementById('operatorToken');
const dashboard = document.getElementById('dashboard');
const flash = document.getElementById('message');
const list = document.getElementById('experimentList');
const refreshButton = document.getElementById('refresh');
const downloadButton = document.getElementById('download');
let operatorToken = '';
let experiments = [];
const transitions = {
  draft: ['running', 'completed'],
  running: ['paused', 'completed'],
  paused: ['running', 'completed'],
  completed: []
};
const statuses = {
  draft: 'ЧЕРНОВИК', running: 'АКТИВЕН', paused: 'ПАУЗА', completed: 'ЗАВЕРШЁН'
};
function make(tag, className = '', content) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (content !== undefined) element.textContent = String(content);
  return element;
}
function setMessage(message, error = false) {
  flash.textContent = message;
  flash.classList.toggle('error-text', error);
}
async function api(path, method = 'GET', body) {
  const headers = { Authorization: 'Bearer ' + operatorToken };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const response = await fetch(path, {
    method, headers, cache: 'no-store',
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('Невозможно получить API оператора.');
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'HTTP ' + response.status);
  return data;
}
function pct(value) {
  return (Number(value || 0) * 100).toFixed(1) + '%';
}
function pp(value) {
  const n = Number(value || 0);
  return (n >= 0 ? '+' : '') + n.toFixed(1) + ' п.п.';
}
function tile(label, value) {
  const root = make('div', 'stat-tile');
  root.append(make('span', '', label), make('b', '', value));
  return root;
}
function armPanel(letter, arm) {
  const panel = make('div', 'operator-arm');
  panel.append(make('strong', '', 'GROUP ' + letter),
    make('small', '', 'НАЧАЛО СЕССИИ: ' + arm.exposures),
    make('small', '', 'CTA КЛИКОВ: ' + arm.cta),
    make('strong', '', 'ОТКЛИК: ' + pct(arm.responseRate)),
    make('small', '', '95% Уилсон: ' + pct(arm.wilson95.low) + ' — ' + pct(arm.wilson95.high)));
  return panel;
}
function renderItem(item) {
  const card = make('article', 'experiment-item');
  const head = make('div', 'experiment-item-head');
  const titlebox = make('div');
  titlebox.append(make('h3', '', item.title), make('small', '', item.id));
  const stage = make('span', 'arm-label', statuses[item.status] || item.status);
  head.append(titlebox, stage);
  card.appendChild(head);

  const meta = make('p', 'micro-text', item.audience + ' · ' + item.offer);
  card.appendChild(meta);
  const summary = make('div', 'operator-summary');
  summary.append(
    tile('СЕССИИ', item.metrics.totalExposures),
    tile('CTA', item.metrics.totalCTA),
    tile('B – A', pp(item.metrics.observedDifferencePP))
  );
  card.appendChild(summary);
  const arms = make('div', 'operator-arms');
  arms.append(armPanel('A', item.metrics.arms.A), armPanel('B', item.metrics.arms.B));
  card.appendChild(arms);

  const warnings = [
    'Только технические сессии и CTA. Не лиды, не продажи и не вывод о статистической значимости.'
  ];
  if (item.metrics.sampleRatioWarning) warnings.push('Возможен перекос распределения A/B: изучите тест и источники трафика.');
  if (item.metrics.totalExposures < 100) warnings.push('Малая выборка: выводы крайне ненадёжны.');
  card.append(make('p', 'operator-annotation', warnings.join(' ')));

  const controls = make('div', 'operator-controls');
  const link = make('a', '', 'ПУБЛИЧНАЯ ССЫЛКА ↗');
  link.href = '../?id=' + item.id;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  controls.appendChild(link);
  if (transitions[item.status]?.length) {
    const label = make('label', 'operator-mini');
    const select = make('select');
    select.setAttribute('aria-label', 'Новый статус эксперимента ' + item.title);
    for (const value of transitions[item.status]) {
      const option = make('option', '', statuses[value] || value);
      option.value = value;
      select.appendChild(option);
    }
    const update = make('button', 'btn btn-outline', 'ПРИМЕНИТЬ');
    update.type = 'button';
    update.addEventListener('click', async () => {
      update.disabled = true;
      try {
        await api('/api/v1/operator/experiments/' + item.id + '/status', 'POST', { status: select.value });
        await load();
        setMessage('Статус эксперимента обновлён.');
      } catch (error) { setMessage(error.message, true); }
      finally { update.disabled = false; }
    });
    label.append(select, update);
    controls.appendChild(label);
  }
  card.appendChild(controls);
  return card;
}
function render() {
  list.replaceChildren();
  if (!experiments.length) {
    list.appendChild(make('p', 'operator-annotation',
      'Пока нет реальных экспериментов. Создайте черновик слева и вручную переведите его в активный статус.'));
    return;
  }
  for (const experiment of experiments) list.appendChild(renderItem(experiment));
}
async function load() {
  const result = await api('/api/v1/operator/experiments');
  if (!Array.isArray(result.items)) throw new Error('Неверный ответ сервера.');
  experiments = result.items;
  render();
}
authForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!authForm.reportValidity()) return;
  operatorToken = authInput.value;
  authInput.value = '';
  try {
    await load();
    dashboard.hidden = false;
    setMessage('Доступ подтверждён. Загружены только реальные записи текущей базы.');
  } catch (error) {
    operatorToken = '';
    experiments = [];
    dashboard.hidden = true;
    setMessage(error.message, true);
  }
});
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  const create = document.getElementById('create');
  create.disabled = true;
  try {
    const result = await api('/api/v1/operator/experiments', 'POST', data);
    if (!result.created || !result.id) throw new Error('Нет подтверждения создания.');
    form.reset();
    await load();
    setMessage('Черновик сохранён: ' + result.id + '. Пока он не получает трафик.');
  } catch (error) { setMessage(error.message, true); }
  finally { create.disabled = false; }
});
document.getElementById('sample').addEventListener('click', () => {
  const values = {
    title: 'Signal / Research Example',
    audience: 'Основатели небольших компаний, которые тестируют новую рекламу',
    offer: 'Бесплатная консультация о структуре рекламного эксперимента',
    hypothesis: 'История с выбором вызовет больше нажатий на тот же призыв к действию, чем прямой рекламный текст.',
    controlHeadline: 'Проверьте рекламу до масштабирования.',
    controlBody: 'Получите план A/B-теста для вашего рекламного сообщения: бюджет, аудитория и измеримый результат.',
    variantHeadline: 'Вы директор рекламы. Перед вами два возможных будущих.',
    variantBody: 'Вы можете продолжить публиковать объявления вслепую или провести эксперимент и узнать, что действительно сработало.',
    ctaLabel: 'Обсудить рекламный пилот'
  };
  for (const [name, value] of Object.entries(values)) form.elements[name].value = value;
  setMessage('Форма заполнена примером. Ничего не сохранено — проверьте данные перед созданием.');
});
refreshButton.addEventListener('click', () => {
  load().then(() => setMessage('Данные обновлены.')).catch(error => setMessage(error.message, true));
});
function escapeCSV(input) {
  let value = String(input ?? '');
  // Avoid interpreting exported, operator-entered copy as a spreadsheet formula.
  if (/^\s*[=+\-@]/.test(value)) value = "'" + value;
  return '"' + value.replace(/"/g, '""') + '"';
}
downloadButton.addEventListener('click', () => {
  if (!experiments.length) {
    setMessage('Для экспорта сначала создайте эксперимент.', true);
    return;
  }
  const rows = [[
    'id', 'name', 'status', 'audience', 'offer', 'hypothesis',
    'control_headline', 'variant_headline', 'exposure_a', 'cta_a', 'response_a',
    'exposure_b', 'cta_b', 'response_b', 'difference_pp', 'measurement_limit'
  ]];
  for (const item of experiments) {
    const A = item.metrics.arms.A, B = item.metrics.arms.B;
    rows.push([
      item.id, item.title, item.status, item.audience, item.offer, item.hypothesis,
      item.controlHeadline, item.variantHeadline, A.exposures, A.cta, A.responseRate,
      B.exposures, B.cta, B.responseRate, item.metrics.observedDifferencePP,
      'Technical, consent-gated CTA actions only; not verified human reach or revenue'
    ]);
  }
  const csv = '\uFEFF' + rows.map(row => row.map(escapeCSV).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = make('a');a.href = url;a.download = 'iv-experiment-lab-results.csv';
  document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  setMessage('Экспортирована только агрегированная статистика и настройки тестов.');
});
