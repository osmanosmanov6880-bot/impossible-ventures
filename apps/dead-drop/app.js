'use strict';

const root = document.getElementById('appRoot');
const indicator = document.getElementById('serverState');
const roomIndicator = document.getElementById('roomIndicator');
const stageIndex = document.getElementById('stageIndex');
const handlerMessage = document.getElementById('handlerMessage');
const toastElement = document.getElementById('toast');
const state = {
  online: false,
  view: 'intro',
  mode: 'live',
  room: '',
  token: '',
  mission: null,
  training: null,
  busy: false
};
let refreshTimer = null;
let toastTimer = null;

const objectiveLabels = {
  awareness: 'Brand awareness',
  leads: 'Qualified leads',
  launch: 'Product launch'
};
const channelLabels = {
  social: 'Social sequence',
  video: 'Short-form video',
  landing: 'Interactive landing'
};
const agentNames = {
  product: 'AGENT VECTOR',
  audience: 'AGENT ECHO'
};

function safe(value) {
  return String(value === undefined || value === null ? '' : value)
    .replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function showToast(message) {
  clearTimeout(toastTimer);
  toastElement.textContent = message;
  toastElement.classList.add('visible');
  toastTimer = setTimeout(() => toastElement.classList.remove('visible'), 3200);
}

function showError(message) {
  const node = root.querySelector('.form-error');
  if (node) node.textContent = message;
  else showToast(message);
}

function setProgress(step) {
  const ids = ['nav-brief', 'nav-partner', 'nav-signal', 'nav-dossier'];
  ids.forEach((id, index) => {
    const element = document.getElementById(id);
    element.classList.toggle('active', index === step);
    element.classList.toggle('complete', index < step);
  });
  stageIndex.textContent = ['01 / THE BRIEF', '02 / THE PARTNER', '03 / THE EXCHANGE', '04 / FINAL DOSSIER'][step];
  roomIndicator.textContent = state.room ? 'OPERATION / ' + state.room : 'ENCRYPTED ROLES · NO ACCOUNT';
}

function updateGuide(message) {
  handlerMessage.textContent = message;
}

function startRefresh() {
  stopRefresh();
  if (!state.online || state.mode !== 'live' || !state.room || !state.token) return;
  refreshTimer = setInterval(() => {
    if (!document.hidden && !state.busy) syncMission(true);
  }, 3000);
}

function stopRefresh() {
  if (refreshTimer) clearInterval(refreshTimer);
  refreshTimer = null;
}

function clearMission() {
  stopRefresh();
  try { sessionStorage.removeItem('dda-session-v1'); } catch {}
  state.view = 'intro';
  state.mode = 'live';
  state.room = '';
  state.token = '';
  state.mission = null;
  state.training = null;
  state.busy = false;
  render();
}

function saveSession() {
  try {
    sessionStorage.setItem('dda-session-v1', JSON.stringify({ code: state.room, token: state.token }));
  } catch {}
}

async function api(path, method = 'GET', body) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (state.token) headers.Authorization = 'Bearer ' + state.token;
  const abort = new AbortController();
  const timeout = setTimeout(() => abort.abort(), 12000);
  try {
    const response = await fetch('/api/v1' + path, {
      method, headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: 'no-store',
      signal: abort.signal
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Request failed');
    return result;
  } finally {
    clearTimeout(timeout);
  }
}

async function syncMission(silent = false) {
  if (!state.online || !state.token || !state.room) return;
  try {
    const data = await api('/missions/' + state.room);
    if (JSON.stringify(data.mission) !== JSON.stringify(state.mission)) {
      state.mission = data.mission;
      state.view = 'room';
      render();
    }
  } catch (error) {
    if (!silent) showToast('Could not restore mission: ' + error.message);
  }
}

function modeCard(icon, title, description, action, disabled = false, wide = false) {
  return '<button type="button" class="mode-card' + (wide ? ' mode-card-wide secondary' : '') +
    '" data-action="' + action + '"' + (disabled ? ' disabled' : '') + '>' +
    '<span class="mode-icon" aria-hidden="true">' + icon + '</span>' +
    '<span><span class="mode-title">' + title + '</span>' +
    '<span class="mode-description">' + description + '</span></span>' +
    '<span class="mode-arrow">ENTER PROTOCOL ↗</span></button>';
}

function renderIntro() {
  setProgress(0);
  updateGuide('Two operatives. Two fragments of the truth. Neither can solve the brief alone. The intelligence you exchange becomes the creative direction.');
  return '<div class="hero">' +
    '<div class="hero-label">WELCOME TO THE AGENCY</div>' +
    '<h1>Great ideas<br>are <span class="gradient-text">classified.</span></h1>' +
    '<p class="intro-copy">The world does not need another ad generator. It needs two people who see the same problem differently. <strong>Join a covert creative operation, exchange limited signals, and unlock a campaign dossier.</strong></p>' +
    '<div class="mode-grid">' +
    modeCard('⌁', 'Create a mission', 'You know the product. Recruit a partner who knows the audience.', 'new-host', !state.online) +
    modeCard('↗', 'Join as Agent Echo', 'You know the people. Use an invitation code to join an operation.', 'new-join', !state.online) +
    modeCard('◎', 'Training simulation', 'Try both roles in one browser. No server or account is required.', 'new-training', false, true) +
    '</div>' +
    '<div class="callout' + (state.online ? '' : ' warning') + '"><strong>' +
    (state.online ? 'Co-op server connected.' : 'Static preview mode.') + '</strong> ' +
    (state.online
      ? 'Separate participants can join the same mission from different browsers using an eight-character code. Missions expire after seven days.'
      : 'Real remote collaboration requires the included Node server. The training simulation below lets you try the entire game without a backend.') +
    '</div></div>';
}

function field(label, name, placeholder, options = {}) {
  const type = options.type || 'text';
  const hint = options.hint ? '<small>' + safe(options.hint) + '</small>' : '';
  if (options.items) {
    return '<div class="field"><label for="' + name + '">' + label + '</label><select id="' + name + '" name="' + name + '" required>' +
      options.items.map(item => '<option value="' + safe(item[0]) + '">' + safe(item[1]) + '</option>').join('') +
      '</select>' + hint + '</div>';
  }
  const limit = Number(options.max || 160);
  if (type === 'textarea') {
    return '<div class="field"><label for="' + name + '">' + label + '</label><textarea id="' + name + '" name="' + name +
      '" maxlength="' + limit + '" minlength="3" required placeholder="' + safe(placeholder) + '"></textarea>' + hint + '</div>';
  }
  return '<div class="field"><label for="' + name + '">' + label + '</label><input id="' + name + '" name="' + name +
    '" type="text" maxlength="' + limit + '" minlength="3" required placeholder="' + safe(placeholder) + '" autocomplete="off">' +
    hint + '</div>';
}

function renderHost() {
  setProgress(0);
  updateGuide('You are Agent Vector. Keep the most important product details on your side of the operation. Your partner will supply the audience reality.');
  const training = state.view === 'training-host';
  return '<div class="form-shell"><div class="eyebrow">AGENT VECTOR / PRODUCT INTELLIGENCE</div>' +
    '<h1 class="screen-heading">Define the<br><span class="gradient-text">operation.</span></h1>' +
    '<p class="subheading">Your partner will not see your confidential product notes until the final dossier. Only share information you have permission to use.</p>' +
    '<form id="hostForm"><div class="fields">' +
    '<div class="fields two-column">' +
    field('BRAND / ORGANIZATION', 'brand', 'Northstar Coffee', { max: 100 }) +
    field('WHAT ARE WE PROMOTING?', 'product', 'Specialty coffee subscription') + '</div>' +
    field('EVIDENCE TO SUPPORT THE CLAIM', 'proof', 'Verified example, demonstration or measured customer outcome', { max: 220, type: 'textarea', hint: 'Evidence is user-supplied and will be marked unverified.' }) +
    field('PRIMARY CAMPAIGN OBJECTIVE', 'objective', '', { items: Object.entries(objectiveLabels) }) +
    '</div><div class="form-footer"><button class="btn btn-primary" type="submit">' +
    (training ? 'CONTINUE TO AGENT ECHO' : 'CREATE CLASSIFIED ROOM') +
    ' <span aria-hidden="true">↗</span></button><button type="button" data-action="back" class="btn btn-ghost">GO BACK</button></div>' +
    '<div class="form-error" role="alert"></div></form></div>';
}

function renderJoin(training = false) {
  setProgress(1);
  updateGuide('Agent Echo understands the audience. Be specific about whom you want to reach and what they resist. Your insights will remain private until the reveal.');
  return '<div class="form-shell"><div class="eyebrow">AGENT ECHO / AUDIENCE INTELLIGENCE</div>' +
    '<h1 class="screen-heading">Know the people.<br><span class="gradient-text">Find the signal.</span></h1>' +
    '<p class="subheading">' +
    (training ? 'Training mode: switch roles after entering both sets of intelligence. This is a simulation, not private multiplayer.' :
      'Enter the room code sent by Agent Vector. Only one audience operative can join each mission.') +
    '</p><form id="' + (training ? 'trainingGuestForm' : 'guestForm') + '"><div class="fields">' +
    (training ? '' : field('EIGHT-CHARACTER ROOM CODE', 'roomCode', 'A7K9P2M4', { max: 8, hint: 'Ask Agent Vector to copy the code from their briefing.' })) +
    field('WHO ARE THE PEOPLE?', 'audience', 'Remote workers who value a quiet morning routine') +
    field('THEIR REAL FRUSTRATION', 'friction', 'Their daily coffee ritual has become expensive and inconvenient', { max: 220, type: 'textarea' }) +
    field('BEST FORMAT', 'channel', '', { items: Object.entries(channelLabels) }) +
    '</div><div class="form-footer"><button class="btn btn-primary" type="submit">' +
    (training ? 'START TRAINING EXCHANGE' : 'JOIN CLASSIFIED OPERATION') +
    ' <span aria-hidden="true">↗</span></button><button type="button" data-action="back" class="btn btn-ghost">GO BACK</button></div>' +
    '<div class="form-error" role="alert"></div></form></div>';
}

function localView() {
  const mission = state.training;
  const role = mission.currentRole;
  return {
    code: 'TRAINING', brand: mission.host.brand, objective: mission.host.objective,
    status: mission.status, role, joined: true,
    ownIntel: role === 'product' ? {
      product: mission.host.product, proof: mission.host.proof
    } : {
      audience: mission.guest.audience, friction: mission.guest.friction, channel: mission.guest.channel
    },
    messages: mission.messages,
    quota: {
      used: mission.messages.filter(entry => entry.role === role).length,
      max: 3,
      partnerUsed: mission.messages.filter(entry => entry.role !== role).length
    },
    dossier: mission.dossier
  };
}

function buildTrainingDossier(mission) {
  const host = mission.host;
  const guest = mission.guest;
  const messages = mission.messages;
  const channel = { social: 'social sequence', video: 'short-form film', landing: 'interactive landing experience' }[guest.channel];
  const action = { awareness: 'Discover the story', leads: 'Request the briefing', launch: 'See what is new' }[host.objective];
  return {
    campaign: 'OPERATION / THE UNSENT SIGNAL',
    brand: host.brand,
    audience: guest.audience,
    openingHook: 'What if the answer to ' + guest.friction + ' was closer than you thought?',
    concept: 'Turn a familiar tension for ' + guest.audience + ' into a mystery. The audience chooses whether to decode the message before discovering ' + host.product + ' from ' + host.brand + '.',
    execution: 'Build a ' + channel + ' in three beats: interruption, audience choice, and evidence-led reveal.',
    storyboard: [
      { beat: '01 / INTERCEPT', direction: 'Open with the real audience tension: ' + guest.friction + '.' },
      { beat: '02 / DECISION', direction: 'Offer two short choices that expose what the audience values. Avoid asking for personal data.' },
      { beat: '03 / REVEAL', direction: 'Introduce ' + host.product + ' as a possible response; support the claim only with verified evidence.' }
    ],
    callToAction: action,
    evidenceToVerify: host.proof,
    interceptedSignals: {
      productAgent: (messages.find(m => m.role === 'product') || {}).text || '',
      audienceAgent: (messages.find(m => m.role === 'audience') || {}).text || ''
    },
    validation: 'Compare this concept with a direct-response control. Measure qualified actions and repeat engagement, not just clicks.',
    disclosure: 'Creative hypothesis only. Product evidence is user-supplied and has not been independently verified. No live AI model was used.'
  };
}

function renderRoom() {
  const mission = state.mode === 'training' ? localView() : state.mission;
  if (!mission) return renderIntro();
  if (mission.status === 'finalized') return renderDossier(mission.dossier);
  setProgress(mission.joined ? 2 : 1);
  const isProduct = mission.role === 'product';
  const title = isProduct ? 'PRODUCT INTELLIGENCE' : 'AUDIENCE INTELLIGENCE';
  const intel = isProduct
    ? [['THE PRODUCT', mission.ownIntel.product], ['EVIDENCE TO VERIFY', mission.ownIntel.proof], ['CAMPAIGN OBJECTIVE', objectiveLabels[mission.objective]]]
    : [['THE AUDIENCE', mission.ownIntel.audience], ['THE FRICTION', mission.ownIntel.friction], ['CHANNEL', channelLabels[mission.ownIntel.channel]]];
  const countProduct = mission.messages.filter(m => m.role === 'product').length;
  const countAudience = mission.messages.filter(m => m.role === 'audience').length;
  const canFinalize = mission.joined && countProduct > 0 && countAudience > 0;
  const canTransmit = mission.joined && mission.quota.used < mission.quota.max;
  updateGuide(!mission.joined
    ? 'Your room is ready. Give the eight-character code to someone you trust. The mission begins only when Agent Echo joins.'
    : isProduct
      ? 'Agent Vector: you know the product, but not the audience frustration. Ask an open question. Do not waste your three transmissions.'
      : 'Agent Echo: you know the audience, but not the product proof. Challenge the other agent to provide one concrete, verifiable benefit.');
  const transcript = mission.messages.length ? mission.messages.map(message => {
    const partner = message.role !== mission.role;
    return '<div class="transmission' + (partner ? ' partner' : '') + '"><div class="transmission-top">' +
      safe(agentNames[message.role]) + (partner ? ' / INCOMING' : ' / SENT') + '</div><p>' + safe(message.text) + '</p></div>';
  }).join('') : '<p class="empty-state">No transmissions intercepted yet. Ask a focused question instead of sharing the whole brief.</p>';

  return '<div class="room-head"><div><div class="eyebrow">' +
    (state.mode === 'training' ? 'TRAINING OPERATION / TWO ROLES' : 'SECURE ROOM / TWO AGENTS') +
    '</div><h1>' + safe(agentNames[mission.role]) + '<span class="accent">_</span></h1><p>' +
    safe(mission.brand) + ' · ' + safe(objectiveLabels[mission.objective]) +
    '<br>' + (mission.joined ? 'Both operatives are in position.' : 'Waiting for Agent Echo to join.') +
    '</p></div><div class="room-code"><span class="micro-label">OPERATION CODE</span><strong>' +
    safe(mission.code) + '</strong>' +
    (state.mode === 'live' ? '<button type="button" class="btn btn-small btn-ghost" data-action="copy-code">COPY INVITATION ↗</button>' :
      '<span class="badge amber">LOCAL SIMULATION</span>') +
    '</div></div>' +
    (state.mode === 'training' ? '<div class="role-toggle"><span>TRAINING: YOU CAN VIEW BOTH ROLES. THERE IS NO REAL SECRECY.</span>' +
      '<button class="btn btn-small btn-ghost" type="button" data-action="switch-role">SWITCH TO ' +
      safe(agentNames[isProduct ? 'audience' : 'product']) + ' ↔</button></div>' : '') +
    '<div class="room-grid"><section class="intel-card"><div class="card-top"><span class="card-title">' + title +
    '</span><span class="badge signal">PRIVATE TO YOU</span></div>' +
    intel.map(pair => '<div class="intel-row"><span class="intel-label">' + safe(pair[0]) + '</span><div class="intel-value">' + safe(pair[1]) + '</div></div>').join('') +
    '<div class="callout"><strong>Information asymmetry:</strong> the other agent cannot read your private fields until the dossier is finalized. You may choose what to reveal in a transmission.</div></section>' +
    '<section class="transcript-card"><div class="card-top"><span class="card-title">INTERCEPTED TRANSMISSIONS</span><span class="badge">' +
    (mission.quota.max - mission.quota.used) + ' OF ' + mission.quota.max + ' LEFT</span></div>' +
    '<div class="transcript-list" id="transcript">' + transcript + '</div>' +
    '<form id="messageForm" class="send-form"><label for="messageText" class="micro-label">SEND A SHORT SIGNAL (3–280 CHARACTERS)</label>' +
    '<textarea id="messageText" class="transmission-input" name="text" maxlength="280" minlength="3" required placeholder="' +
    (isProduct ? 'What is the audience most skeptical about?' : 'Which specific promise can the product genuinely prove?') +
    '"' + (canTransmit ? '' : ' disabled') + '></textarea>' +
    '<div class="send-row"><span class="micro-label">' +
    (mission.joined ? 'EVERY WORD COUNTS' : 'AWAITING SECOND AGENT') +
    '</span><button class="btn btn-small btn-primary" type="submit"' +
    (canTransmit ? '' : ' disabled') + '>TRANSMIT ↗</button></div><div class="form-error" role="alert"></div></form></section></div>' +
    '<div class="room-actions"><button type="button" class="btn btn-primary" data-action="finalize"' +
    (canFinalize ? '' : ' disabled') + '>DECODE THE CREATIVE DOSSIER ↗</button><small>' +
    (canFinalize ? 'Both agents have transmitted. Your dossier is ready.' :
      'Each agent must send at least one transmission before decoding.') + '</small></div>';
}

function resultCard(label, heading, body, wide = false) {
  return '<article class="result-card' + (wide ? ' wide' : '') + '"><div class="eyebrow">' + safe(label) +
    '</div><h2>' + safe(heading) + '</h2><p>' + safe(body) + '</p></article>';
}

function renderDossier(dossier) {
  setProgress(3);
  updateGuide('The two agents combined their intelligence. Now test the hypothesis with real people and verify the evidence before publishing.');
  return '<div class="dossier-heading"><div class="eyebrow">MISSION ACCOMPLISHED / CLASSIFIED DOSSIER</div>' +
    '<h1>Signal <span class="gradient-text">decoded.</span></h1><p class="subheading">' +
    'A concept built from two different perspectives. This structured creative brief is a starting point for human review.</p>' +
    '<div class="badge signal">' + safe(dossier.campaign) + '</div></div>' +
    '<div class="dossier-grid">' +
    resultCard('01 / THE OPENING HOOK', 'Stop the scroll.', dossier.openingHook, true) +
    resultCard('02 / CREATIVE DIRECTION', 'The big idea.', dossier.concept, true) +
    resultCard('03 / EXECUTION', 'Where it comes to life.', dossier.execution) +
    resultCard('04 / THE ACTION', 'Call to action.', dossier.callToAction) +
    '</div><div class="eyebrow">THE THREE-BEAT EXPERIENCE</div><div class="story-grid">' +
    dossier.storyboard.map(beat => '<article class="story-card"><strong>' + safe(beat.beat) +
      '</strong><p>' + safe(beat.direction) + '</p></article>').join('') + '</div>' +
    '<div class="dossier-grid">' +
    resultCard('05 / PRODUCT EVIDENCE', 'Verify before publishing.', dossier.evidenceToVerify) +
    resultCard('06 / MEASUREMENT', 'Run a real test.', dossier.validation) +
    resultCard('07 / AGENT VECTOR', 'Intercepted product signal.', dossier.interceptedSignals.productAgent) +
    resultCard('08 / AGENT ECHO', 'Intercepted audience signal.', dossier.interceptedSignals.audienceAgent) +
    '</div><div class="callout warning"><strong>Editorial note:</strong> ' + safe(dossier.disclosure) + '</div>' +
    '<div class="form-footer"><button class="btn btn-primary" data-action="copy-dossier" type="button">COPY DOSSIER ↗</button>' +
    '<button class="btn btn-ghost" data-action="download-dossier" type="button">EXPORT .TXT ↓</button>' +
    '<button class="btn btn-ghost" data-action="new-operation" type="button">NEW OPERATION</button></div>';
}

function render() {
  indicator.textContent = state.online ? '● CO-OP SERVER CONNECTED' : '● TRAINING / STATIC PREVIEW';
  if (state.view === 'intro') root.innerHTML = renderIntro();
  else if (state.view === 'host' || state.view === 'training-host') root.innerHTML = renderHost();
  else if (state.view === 'join' || state.view === 'training-guest') root.innerHTML = renderJoin(state.view === 'training-guest');
  else root.innerHTML = renderRoom();
}

function formValues(form) {
  return Object.fromEntries(new FormData(form).entries());
}

async function withBusy(callback) {
  if (state.busy) return;
  state.busy = true;
  try { await callback(); }
  catch (error) { showError(error.message || 'Operation failed'); }
  finally { state.busy = false; }
}

root.addEventListener('submit', event => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  event.preventDefault();
  withBusy(async () => {
    const data = formValues(form);
    if (form.id === 'hostForm') {
      if (state.view === 'training-host') {
        state.training = {
          host: data, guest: null, messages: [], status: 'active',
          currentRole: 'product', dossier: null
        };
        state.view = 'training-guest';
        render();
      } else {
        const result = await api('/missions', 'POST', data);
        state.mode = 'live';
        state.room = result.code;
        state.token = result.token;
        state.mission = result.mission;
        state.view = 'room';
        saveSession();
        render();
        startRefresh();
      }
    } else if (form.id === 'guestForm') {
      const code = String(data.roomCode || '').trim().toUpperCase();
      if (!/^[A-Z2-9]{8}$/.test(code)) throw new Error('Please enter a valid eight-character room code');
      const result = await api('/missions/' + code + '/join', 'POST', {
        audience: data.audience, friction: data.friction, channel: data.channel
      });
      state.mode = 'live';
      state.room = result.code;
      state.token = result.token;
      state.mission = result.mission;
      state.view = 'room';
      saveSession();
      render();
      startRefresh();
    } else if (form.id === 'trainingGuestForm') {
      state.training.guest = data;
      state.training.currentRole = 'product';
      state.mode = 'training';
      state.room = 'TRAINING';
      state.view = 'room';
      render();
    } else if (form.id === 'messageForm') {
      const text = String(data.text || '').trim();
      if (text.length < 3) throw new Error('Send at least three characters');
      if (state.mode === 'training') {
        const m = state.training;
        if (m.messages.filter(x => x.role === m.currentRole).length >= 3) throw new Error('Transmission quota exhausted');
        m.messages.push({ role: m.currentRole, text, at: Date.now() });
        render();
      } else {
        const result = await api('/missions/' + state.room + '/messages', 'POST', { text });
        state.mission = result.mission;
        render();
      }
    }
  });
});

root.addEventListener('click', event => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;
  if (action === 'new-host' && state.online) { state.mode = 'live'; state.view = 'host'; render(); }
  if (action === 'new-join' && state.online) { state.mode = 'live'; state.view = 'join'; render(); }
  if (action === 'new-training') { state.mode = 'training'; state.view = 'training-host'; render(); }
  if (action === 'back') { state.view = 'intro'; render(); }
  if (action === 'new-operation') clearMission();
  if (action === 'switch-role' && state.training) {
    state.training.currentRole = state.training.currentRole === 'product' ? 'audience' : 'product';
    render();
  }
  if (action === 'copy-code') {
    const invitation = 'Join my Dead Drop Agency mission: ' + location.origin + location.pathname + '\nROOM CODE: ' + state.room;
    navigator.clipboard.writeText(invitation).then(() => showToast('Invitation copied. Send it to your partner.'))
      .catch(() => showToast('Clipboard unavailable. Share the room code displayed above.'));
  }
  if (action === 'finalize') withBusy(async () => {
    if (state.mode === 'training') {
      const m = state.training;
      if (!m.messages.some(x => x.role === 'product') || !m.messages.some(x => x.role === 'audience')) {
        throw new Error('Both agents must transmit');
      }
      m.dossier = buildTrainingDossier(m);
      m.status = 'finalized';
    } else {
      const result = await api('/missions/' + state.room + '/finalize', 'POST', {});
      state.mission = result.mission;
    }
    stopRefresh();
    render();
  });
  if (action === 'copy-dossier' || action === 'download-dossier') {
    const dossier = state.mode === 'training' ? state.training.dossier : state.mission.dossier;
    if (!dossier) return;
    const text = dossierText(dossier);
    if (action === 'copy-dossier') {
      navigator.clipboard.writeText(text).then(() => showToast('Dossier copied to clipboard.'))
        .catch(() => showToast('Clipboard unavailable. Use export instead.'));
    } else {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'dead-drop-dossier.txt';
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast('Dossier exported.');
    }
  }
});

document.getElementById('resetButton').addEventListener('click', clearMission);

function dossierText(dossier) {
  return [
    'DEAD DROP AGENCY — CLASSIFIED CREATIVE DOSSIER',
    dossier.campaign,
    '',
    'BRAND: ' + dossier.brand,
    'AUDIENCE: ' + dossier.audience,
    '',
    'THE HOOK', dossier.openingHook,
    '',
    'BIG IDEA', dossier.concept,
    '',
    'EXECUTION', dossier.execution,
    '',
    'STORYBOARD',
    ...dossier.storyboard.map(beat => beat.beat + ': ' + beat.direction),
    '',
    'CALL TO ACTION', dossier.callToAction,
    '',
    'EVIDENCE TO VERIFY', dossier.evidenceToVerify,
    '',
    'PRODUCT AGENT SIGNAL', dossier.interceptedSignals.productAgent,
    '',
    'AUDIENCE AGENT SIGNAL', dossier.interceptedSignals.audienceAgent,
    '',
    'VALIDATION', dossier.validation,
    '',
    dossier.disclosure
  ].join('\n');
}

async function bootstrap() {
  try {
    const response = await fetch('/api/v1/health', { cache: 'no-store' });
    const health = await response.json();
    state.online = response.ok && health.ok && health.mode === 'cooperative';
  } catch {
    state.online = false;
  }
  if (state.online) {
    try {
      const saved = JSON.parse(sessionStorage.getItem('dda-session-v1') || 'null');
      if (saved && /^[A-Z2-9]{8}$/.test(saved.code) && typeof saved.token === 'string') {
        state.room = saved.code;
        state.token = saved.token;
        state.mode = 'live';
        await syncMission();
        if (state.mission) {
          state.view = 'room';
          startRefresh();
        } else {
          state.room = '';
          state.token = '';
          sessionStorage.removeItem('dda-session-v1');
        }
      }
    } catch {
      state.room = '';
      state.token = '';
    }
  }
  render();
}
bootstrap();
