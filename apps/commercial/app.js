const dict = {
  ru: {
    experiments:'ЭКСПЕРИМЕНТЫ',pilots:'ПИЛОТЫ',
    headline:'Большие рекламные идеи. Реальные рабочие инструменты.',
    lead:'Семь творческих направлений, отдельные рабочие пространства, версия каждой кампании и проверяемый путь до настоящего рекламного эксперимента. Без фиктивных продаж и обещаний заработка.',
    openStudio:'ОТКРЫТЬ СТУДИЮ ↗',tryExperiment:'ПОПРОБОВАТЬ A/B-ТЕСТ →',
    worlds:'НАПРАВЛЕНИЙ КРЕАТИВА',roles:'УРОВНЯ ДОСТУПА',revenue:'НЕПОДТВЕРЖДЁННЫХ ПРОДАЖ',
    accessTitle:'Ваше рекламное пространство.',accessExplain:'Создайте организацию с системным токеном или войдите по выданному ключу. Ключи не сохраняются браузером: запишите их безопасно.',
    newWorkspace:'СОЗДАТЬ ОРГАНИЗАЦИЮ',existingWorkspace:'ВОЙТИ В СУЩЕСТВУЮЩЕЕ',
    workspaceName:'НАЗВАНИЕ КОМПАНИИ',systemToken:'СИСТЕМНЫЙ ТОКЕН OPERATOR_TOKEN',
    workspaceId:'ИДЕНТИФИКАТОР ПРОСТРАНСТВА',workspaceToken:'КЛЮЧ ВЛАДЕЛЬЦА / РЕДАКТОРА / НАБЛЮДАТЕЛЯ',
    createWorkspace:'СОЗДАТЬ ПРОСТРАНСТВО ↗',openWorkspace:'ВОЙТИ В КАБИНЕТ →',
    bootstrapNotice:'Создание доступно только оператору сервера; публичная регистрация отключена.',
    noLocalStore:'Секрет находится только в памяти этой вкладки до закрытия.',
    signout:'ВЫЙТИ И УДАЛИТЬ КЛЮЧ ИЗ ПАМЯТИ',campaigns:'КАМПАНИИ',drafts:'ЧЕРНОВИКИ',approved:'ОДОБРЕНО',archived:'В АРХИВЕ',
    storedRecords:'РЕАЛЬНЫЕ ЗАПИСИ',notPublished:'НЕ ОПУБЛИКОВАНЫ',publicPreviews:'ПУБЛИЧНЫЙ ПРЕДПРОСМОТР',hiddenPreviews:'СКРЫТО ОТ ПУБЛИКИ',
    chooseWorld:'Выберите рекламную вселенную.',
    worldExplain:'Каждая карточка — исходный творческий шаблон, не отдельная запущенная компания. Выбор заполняет редактор кампании.',
    buildTitle:'От идеи к рекламному макету.',
    buildExplain:'Редактируйте материал, сохраните версию и отправьте на проверку владельцу. Одобрение публикует лишь предпросмотр, не запускает реальную рекламу.',
    editorTitle:'РЕДАКТОР КРЕАТИВА',campaignName:'НАЗВАНИЕ КАМПАНИИ',universe:'ВСЕЛЕННАЯ',goal:'ЦЕЛЬ',channel:'КАНАЛ',
    audience:'АУДИТОРИЯ',offer:'ПРЕДЛОЖЕНИЕ',headlineLabel:'ЗАГОЛОВОК',bodyLabel:'ТЕКСТ РЕКЛАМЫ',ctaLabel:'ТЕКСТ КНОПКИ',
    saveDraft:'СОХРАНИТЬ ЧЕРНОВИК ↗',reset:'НОВАЯ КАМПАНИЯ',revisionNote:'Сохранение выполняется на сервере. При конфликте изменений редактор попросит обновить запись.',
    previewTitle:'ЖИВОЙ ПРЕДПРОСМОТР',previewEmpty:'Ваш заголовок появится здесь.',previewBodyEmpty:'Заполните форму слева, чтобы увидеть рекламный макет.',
    previewNotice:'Это макет. Кнопка отключена, реальные показы и клики не имитируются.',
    pipelineTitle:'Рабочий журнал кампаний.',pipelineExplain:'Каждая карточка — запись из базы. Владелец может одобрить публичный предпросмотр или убрать его в архив.',
    reload:'ОБНОВИТЬ ↻',team:'УПРАВЛЕНИЕ ДОСТУПОМ',memberLabel:'МЕТКА КЛЮЧА',memberRole:'РОЛЬ',days:'СРОК (ДНИ)',issue:'ВЫДАТЬ КЛЮЧ ↗',
    footnote:'Черновики и публичные макеты не являются закупленными рекламными размещениями.',privacy:'ПРИВАТНОСТЬ ↗',
    saveDone:'Черновик сохранён в базе данных.',updated:'Черновик обновлён. Изменения сохранены на сервере.',
    approvedDone:'Публичный макет одобрен. Это не запуск рекламы.',archivedDone:'Макет отправлен в архив, публичный доступ закрыт.',
    loaded:'Данные организации и кампании загружены.',denied:'Не удалось получить доступ.',missingBackend:'Серверное API недоступно; нужен запуск Node.js.',
    newReady:'Новый черновик. Выберите вселенную или заполните поля самостоятельно.',
    readOnly:'Режим наблюдателя: изменение кампаний заблокировано.',
    approval:'ОДОБРИТЬ МАКЕТ',archiveAction:'АРХИВИРОВАТЬ',editAction:'РЕДАКТИРОВАТЬ',openAction:'ПУБЛИЧНЫЙ МАКЕТ ↗',
    issued:'Ключ создан. Сохраните его сейчас: повторно показать невозможно.',
    created:'Организация создана. Сохраните ID и ключ владельца.',
    revoked:'Доступ отозван.',roleLabel:'Роль',owner:'Владелец',editor:'Редактор',viewer:'Наблюдатель',
    tokenEmpty:'Пока нет выданных ключей.',campaignEmpty:'Кампаний пока нет. Выберите рекламную вселенную и создайте первый черновик.',
    auditTitle:'ПОСЛЕДНИЕ ДЕЙСТВИЯ',credentialTitle:'АКТИВНЫЕ КЛЮЧИ',revoke:'ОТОЗВАТЬ',
    accessNotSecure:'Внимание: для реального доступа через интернет необходим HTTPS и аудит безопасности.'
  },
  en: {
    experiments:'EXPERIMENTS',pilots:'PILOTS',headline:'Big creative ideas. Real operating tools.',
    lead:'Seven creative directions, isolated workspaces, versioned campaigns and a measurable path to an actual advertising experiment. No fabricated sales or revenue promises.',
    openStudio:'OPEN THE STUDIO ↗',tryExperiment:'TRY A/B EXPERIMENT →',worlds:'CREATIVE DIRECTIONS',roles:'ACCESS LEVELS',revenue:'UNVERIFIED SALES CLAIMED',
    accessTitle:'Your advertising workspace.',accessExplain:'Provision a workspace using the system token or sign in with a pre-issued capability. No keys are saved by the browser.',
    newWorkspace:'PROVISION WORKSPACE',existingWorkspace:'ACCESS EXISTING WORKSPACE',workspaceName:'ORGANIZATION NAME',systemToken:'SYSTEM OPERATOR_TOKEN',
    workspaceId:'WORKSPACE ID',workspaceToken:'OWNER / EDITOR / VIEWER TOKEN',createWorkspace:'CREATE WORKSPACE ↗',openWorkspace:'OPEN WORKSPACE →',
    bootstrapNotice:'Only the server operator can create workspaces. Public signup is disabled.',noLocalStore:'The token is kept in this tab memory and cleared when closed.',
    signout:'SIGN OUT AND CLEAR TOKEN',campaigns:'CAMPAIGNS',drafts:'DRAFTS',approved:'APPROVED',archived:'ARCHIVED',
    storedRecords:'SAVED RECORDS',notPublished:'NOT PUBLISHED',publicPreviews:'PUBLIC CREATIVE PREVIEWS',hiddenPreviews:'HIDDEN FROM PUBLIC',
    chooseWorld:'Choose a creative universe.',worldExplain:'Each card is a starter creative template, not a separately launched company. Your selection populates the editor.',
    buildTitle:'From concept to creative.',buildExplain:'Edit copy, save a revision and submit for owner approval. Approval only publishes a preview, not an actual campaign.',
    editorTitle:'CREATIVE EDITOR',campaignName:'CAMPAIGN NAME',universe:'CREATIVE UNIVERSE',goal:'OBJECTIVE',channel:'CHANNEL',
    audience:'AUDIENCE',offer:'OFFER',headlineLabel:'HEADLINE',bodyLabel:'AD COPY',ctaLabel:'BUTTON TEXT',
    saveDraft:'SAVE DRAFT ↗',reset:'NEW CAMPAIGN',revisionNote:'Drafts are persisted on the server with conflict detection.',
    previewTitle:'LIVE CREATIVE PREVIEW',previewEmpty:'Your headline goes here.',previewBodyEmpty:'Fill in the form to see your creative.',
    previewNotice:'A non-clickable preview. No real impressions or clicks are simulated.',
    pipelineTitle:'Campaign operations.',pipelineExplain:'Every card represents a database record. Owners can approve or archive public previews.',
    reload:'REFRESH ↻',team:'ACCESS CONTROL',memberLabel:'TOKEN LABEL',memberRole:'ROLE',days:'VALID DAYS',issue:'ISSUE TOKEN ↗',
    footnote:'Drafts and public previews are not purchased advertising placements.',privacy:'DATA HANDLING ↗',
    saveDone:'Draft saved to the server.',updated:'Draft revision saved successfully.',
    approvedDone:'Public preview approved. This is not paid ad delivery.',archivedDone:'Creative archived and public link disabled.',
    loaded:'Workspace and campaigns loaded.',denied:'Access denied.',missingBackend:'Backend unavailable. Run the Node.js server.',
    newReady:'New draft. Choose a universe or provide your own content.',readOnly:'Viewer mode: campaign changes are disabled.',
    approval:'APPROVE PREVIEW',archiveAction:'ARCHIVE',editAction:'EDIT DRAFT',openAction:'PUBLIC PREVIEW ↗',
    issued:'Token created. Save it now; it cannot be shown again.',
    created:'Workspace created. Save your ID and owner key.',
    revoked:'Credential revoked.',roleLabel:'Role',owner:'Owner',editor:'Editor',viewer:'Viewer',
    tokenEmpty:'No credentials issued yet.',campaignEmpty:'No campaigns. Choose a universe and save your first draft.',
    auditTitle:'RECENT ACTIVITY',credentialTitle:'WORKSPACE TOKENS',revoke:'REVOKE',
    accessNotSecure:'Use HTTPS and a security review before any public customer exposure.'
  },
  zh: {
    experiments:'实验',pilots:'试点',headline:'大胆的广告创意。真正的运营工具。',
    lead:'七种创意方向、独立工作空间、版本化广告方案，以及可衡量的实验流程。没有虚构销售或收入承诺。',
    openStudio:'打开工作室 ↗',tryExperiment:'体验 A/B 实验 →',worlds:'创意方向',roles:'权限级别',revenue:'虚构销售记录',
    accessTitle:'您的广告工作空间。',accessExplain:'使用系统密钥创建组织，或使用发放的工作空间令牌登录。浏览器不会持久保存密钥。',
    newWorkspace:'创建组织',existingWorkspace:'进入已有工作空间',workspaceName:'组织名称',systemToken:'系统 OPERATOR_TOKEN',
    workspaceId:'工作空间 ID',workspaceToken:'所有者/编辑/只读令牌',createWorkspace:'创建工作空间 ↗',openWorkspace:'进入工作空间 →',
    bootstrapNotice:'仅服务器运营者可创建组织，不开放公共注册。',noLocalStore:'令牌仅保存在当前标签页的内存中。',
    signout:'退出并清除令牌',campaigns:'广告活动',drafts:'草稿',approved:'已批准',archived:'已归档',
    storedRecords:'真实记录',notPublished:'尚未发布',publicPreviews:'公开预览',hiddenPreviews:'不可公开',
    chooseWorld:'选择创意世界。',worldExplain:'每张卡片是创意模板，不代表已运营的独立公司。选择后会填充编辑器。',
    buildTitle:'从创意到广告素材。',buildExplain:'编辑内容，保存修订版本并交由所有者批准。批准只发布预览，不投放广告。',
    editorTitle:'广告创意编辑器',campaignName:'活动名称',universe:'创意世界',goal:'目标',channel:'渠道',
    audience:'受众',offer:'产品方案',headlineLabel:'标题',bodyLabel:'正文',ctaLabel:'按钮文字',
    saveDraft:'保存草稿 ↗',reset:'新建活动',revisionNote:'服务器保存草稿，并防止旧版本覆盖新版本。',
    previewTitle:'实时预览',previewEmpty:'您的标题将显示在此。',previewBodyEmpty:'填写左侧表单即可预览。',
    previewNotice:'预览按钮不可点击，不模拟真实展示或点击。',
    pipelineTitle:'活动管理。',pipelineExplain:'每个卡片都来自数据库。所有者可批准或归档公开预览。',
    reload:'刷新 ↻',team:'权限管理',memberLabel:'令牌标签',memberRole:'角色',days:'有效天数',issue:'发放令牌 ↗',
    footnote:'草稿和预览不属于已购买的广告投放。',privacy:'数据处理 ↗',
    saveDone:'草稿已保存。',updated:'草稿修订已保存。',approvedDone:'预览已批准，但并未投放广告。',archivedDone:'已归档并停止公开预览。',
    loaded:'已加载工作空间数据。',denied:'访问被拒绝。',missingBackend:'API 不可用，请启动 Node.js 服务。',
    newReady:'新草稿。选择世界或自行填写。',readOnly:'只读模式，无法修改活动。',
    approval:'批准预览',archiveAction:'归档',editAction:'编辑草稿',openAction:'公开预览 ↗',
    issued:'令牌已创建，请立即保存，无法再次显示。',created:'组织已创建，请保存 ID 和所有者令牌。',
    revoked:'权限已撤销。',roleLabel:'角色',owner:'所有者',editor:'编辑',viewer:'只读',
    tokenEmpty:'暂无令牌。',campaignEmpty:'暂无活动，请选择世界并创建草稿。',
    auditTitle:'最新活动',credentialTitle:'工作空间令牌',revoke:'撤销',
    accessNotSecure:'公开使用前需要 HTTPS 和安全审查。'
  }
};

const elements = Object.fromEntries([
  'lang','bootstrapForm','loginForm','receipt','accessMessage','workspaceApp','currentWorkspace',
  'workspaceMeta','logout','countTotal','countDraft','countApproved','countArchived','ventureGrid',
  'campaignForm','venture','editingRevision','adPreview','previewVenture','previewHeadline','previewBody',
  'previewCTA','previewOffer','campaignList','ownerTools','tokenForm','tokenList','auditLog','reload',
  'listStatus','newCampaign','saveCampaign'
].map(id => [id, document.getElementById(id)]));

const state = { workspaceId: '', token: '', role: '', workspaceName: '', templates: [], campaigns: [], editing: null, demo: false };
const palette = { cyan:'#8feafe',violet:'#c5a8fb',coral:'#ffb1aa',gold:'#ffe0a2',mint:'#adf7cd',pink:'#f4b5f5',blue:'#9acaff' };
const glyphs = { 'dead-drop':'◇','appeal-2049':'⚖','anti-persona':'⌁','brief-theatre':'◈','ad-biome':'✳','museum-of-attention':'✧','attention-republic':'◎' };
const t = k => (dict[elements.lang.value] || dict.ru)[k] || k;
function el(tag, cls, content) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (content !== undefined) n.textContent = String(content);
  return n;
}
function feedback(message, fail = false) {
  elements.accessMessage.textContent = message;
  elements.accessMessage.classList.toggle('error', fail);
}
function receipt(title, values) {
  elements.receipt.replaceChildren();
  const h = el('strong','',title);elements.receipt.appendChild(h);
  for(const [name,value] of Object.entries(values)){
    elements.receipt.appendChild(el('code','',name+': '+value));
  }
  elements.receipt.appendChild(el('p','small','Copy these values to a secure password manager now. Only the credential hash is stored on the server.'));
}
async function api(path, { method = 'GET', token = state.token, body } = {}) {
  const headers = { ...(token ? { Authorization: 'Bearer ' + token } : {}) };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const response = await fetch(path, {
    method, headers, cache:'no-store',
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  if (!(response.headers.get('content-type') || '').includes('application/json')) throw Error(t('missingBackend'));
  const data = await response.json();
  if (!response.ok) throw Error(data.error || 'HTTP ' + response.status);
  return data;
}
function translate() {
  document.documentElement.lang = elements.lang.value === 'zh' ? 'zh-CN' : elements.lang.value;
  for(const n of document.querySelectorAll('[data-i18n]')){
    const key=n.dataset.i18n;
    if (key === 'headline') {
      const text=t(key), cut=text.indexOf('. ');
      if (cut>0) {
        n.replaceChildren(document.createTextNode(text.slice(0,cut+1)),el('span','gradient',' '+text.slice(cut+2)));
      } else {
        n.textContent=text;
      }
    } else if(dict[elements.lang.value]?.[key]) n.textContent=t(key);
  }
  renderCampaigns();
  renderTemplates();
  renderPreview();
  renderProposals();
  estimateProposal();
}
function emptyForm() {
  elements.campaignForm.reset();
  state.editing = null;
  elements.editingRevision.textContent='NEW / DRAFT';
  elements.saveCampaign.textContent=t('saveDraft');
  elements.campaignForm.querySelector('[name="venture"]').value=state.templates[0]?.id || '';
  renderPreview();
}
function formData() { return Object.fromEntries(new FormData(elements.campaignForm).entries()); }
function renderPreview() {
  const data=formData();
  const tpl=state.templates.find(x=>x.id===data.venture);
  elements.previewVenture.textContent=(tpl?.name || 'CREATIVE WORLD')+' / IV';
  elements.previewHeadline.textContent=data.headline?.trim() || t('previewEmpty');
  elements.previewBody.textContent=data.body?.trim() || t('previewBodyEmpty');
  elements.previewOffer.textContent=data.offer?.trim() || '—';
  elements.previewCTA.textContent=(data.ctaLabel?.trim() || 'CALL TO ACTION')+' ↗';
  elements.adPreview.style.background = 'radial-gradient(ellipse at 76% 12%, '+(palette[tpl?.accent]||'#adcff0')+'45,transparent 55%),linear-gradient(145deg,#223656,#0e1727)';
}
function applyTemplate(tpl) {
  emptyForm();
  const fields={
    title:tpl.name+' / Pilot 001',
    venture:tpl.id,goal:'validation',channel:'landing',
    audience:tpl.audience,
    offer:'Обсудить короткий рекламный эксперимент без обязательств',
    headline:tpl.exampleHeadline,body:tpl.exampleBody,
    ctaLabel:'Обсудить рекламный пилот'
  };
  for(const [name,value] of Object.entries(fields)){
    if(elements.campaignForm.elements[name])elements.campaignForm.elements[name].value=value;
  }
  renderTemplates(tpl.id);
  renderPreview();
  document.getElementById('builder').scrollIntoView({behavior:'smooth'});
}
function renderTemplates(selected = elements.venture.value) {
  elements.ventureGrid.replaceChildren();
  for(const [i,tpl] of state.templates.entries()){
    const card=el('button','venture-card'+(selected===tpl.id?' selected':''));card.type='button';
    card.style.setProperty('--world-color',palette[tpl.accent]||'#b6e6ff');
    card.append(
      el('span','venture-no',String(i+1).padStart(2,'0')+' / WORLD'),
      el('span','venture-glyph',glyphs[tpl.id]||'✦'),
      el('strong','',tpl.name),el('p','',tpl.concept),
      el('span','venture-tag',tpl.audience)
    );
    card.addEventListener('click',()=>applyTemplate(tpl));
    const wrapper=el('div','venture-shell');
    wrapper.appendChild(card);
    // Separate interactive action: template remains selectable by its button,
    // while the link opens an actual standalone world without credentials.
    const playWords={ru:'ИГРАТЬ БЕЗ РЕГИСТРАЦИИ ↗',en:'PLAY THE INTERACTIVE WORLD ↗',zh:'无需注册即可体验 ↗'};
    const worldLink=el('a','venture-play',playWords[elements.lang.value]||playWords.ru);
    worldLink.href='../apps/'+tpl.id+'/';
    worldLink.setAttribute('aria-label',tpl.name+' — '+worldLink.textContent);
    wrapper.appendChild(worldLink);
    elements.ventureGrid.appendChild(wrapper);
  }
}
function setPermission() {
  const canEdit=['owner','editor'].includes(state.role) || state.demo;
  for(const input of elements.campaignForm.querySelectorAll('input,select,textarea'))input.disabled=!canEdit;
  elements.saveCampaign.disabled=!canEdit || state.demo;
  elements.ownerTools.hidden=state.role!=='owner';
  for(const input of document.querySelectorAll('#proposalForm input,#proposalForm select,#proposalForm textarea'))input.disabled=!canEdit;
  document.getElementById('saveProposal').disabled=!canEdit || state.demo;
  document.getElementById('worldImport').disabled=!canEdit;
  if(!canEdit && !state.demo)feedback(t('readOnly'));
}
function renderCampaigns() {
  elements.campaignList.replaceChildren();
  const count={ draft:0,approved:0,archived:0 };
  for(const c of state.campaigns)if(Object.hasOwn(count,c.status))count[c.status]++;
  elements.countTotal.textContent=String(state.campaigns.length);
  elements.countDraft.textContent=String(count.draft);
  elements.countApproved.textContent=String(count.approved);
  elements.countArchived.textContent=String(count.archived);
  elements.listStatus.textContent=String(state.campaigns.length)+' / '+t('storedRecords');
  if(!state.campaigns.length){
    elements.campaignList.appendChild(el('p','small',t('campaignEmpty')));
    return;
  }
  for(const c of state.campaigns){
    const card=el('article','campaign-card');
    const top=el('div','campaign-top');
    const title=el('h3','',c.title),stage=el('span','stage',c.status.toUpperCase());
    top.append(title,stage);card.appendChild(top);
    card.append(el('p','campaign-meta',c.venture.toUpperCase()+' / '+c.goal.toUpperCase()+' / '+c.channel.toUpperCase()+' · REV '+c.revision));
    card.append(el('p','',c.headline));
    card.append(el('p','small',c.offer));
    const actions=el('div','campaign-actions');
    if(c.status==='draft' && state.role!=='viewer'){
      const edit=el('button','secondary',t('editAction'));edit.type='button';
      edit.addEventListener('click',()=>editCampaign(c));actions.appendChild(edit);
    }
    if(c.status==='draft' && state.role==='owner'){
      const approve=el('button','primary',t('approval'));approve.type='button';
      approve.addEventListener('click',()=>changeStage(c.id,'approve'));
      actions.appendChild(approve);
    }
    if(c.status!=='archived' && state.role==='owner'){
      const archive=el('button','secondary',t('archiveAction'));archive.type='button';
      archive.addEventListener('click',()=>changeStage(c.id,'archive'));
      actions.appendChild(archive);
    }
    if(c.status==='approved'){
      const open=el('a','secondary',t('openAction'));
      open.href='/showcase/?id='+c.id;open.target='_blank';open.rel='noopener noreferrer';
      actions.appendChild(open);
    }
    card.appendChild(actions);
    elements.campaignList.appendChild(card);
  }
}
function editCampaign(c) {
  if(c.status!=='draft'||state.role==='viewer')return;
  state.editing={id:c.id,revision:c.revision};
  for(const key of ['title','venture','goal','channel','audience','offer','headline','body','ctaLabel']){
    if(elements.campaignForm.elements[key])elements.campaignForm.elements[key].value=c[key];
  }
  elements.editingRevision.textContent='REV '+c.revision+' / '+c.id.slice(0,8);
  renderTemplates(c.venture);renderPreview();
  document.getElementById('builder').scrollIntoView({behavior:'smooth'});
}
async function refresh() {
  if(!state.workspaceId)return;
  const data=await api('/api/v1/workspaces/'+state.workspaceId+'/campaigns');
  state.campaigns=data.items||[];
  renderCampaigns();
  prepareProposalCampaigns();
}
async function loadWorkspace() {
  state.demo=false;
  const data=await api('/api/v1/workspaces/'+state.workspaceId);
  state.role=data.credential.role;
  state.workspaceName=data.workspace.name;
  elements.currentWorkspace.textContent=state.workspaceName;
  elements.workspaceMeta.textContent=state.workspaceId+' / '+t('roleLabel')+': '+t(state.role);
  elements.workspaceApp.hidden=false;
  setPermission();
  await refresh();
  await refreshProposals();
  if(state.role==='owner')await refreshOwner();
  feedback(t('loaded'));
}
async function refreshOwner(){
  const root='/api/v1/workspaces/'+state.workspaceId;
  const [tokens,audit]=await Promise.all([api(root+'/tokens'),api(root+'/audit')]);
  elements.tokenList.replaceChildren(el('h3','',t('credentialTitle')));
  for(const token of tokens.items){
    const row=el('div','token-row');
    const left=el('div');left.append(el('strong','',token.label+' / '+token.role),el('small','',token.id+' / expires '+new Date(token.expiresAt).toLocaleDateString()));
    row.appendChild(left);
    if(token.revokedAt!==null)row.append(el('span','small','REVOKED'));
    else if(token.id!==undefined && token.role!=='owner'){
      const button=el('button','secondary',t('revoke'));button.type='button';
      button.addEventListener('click',async()=>{
        button.disabled=true;
        try{await api(root+'/tokens/'+token.id+'/revoke',{method:'POST'});await refreshOwner();feedback(t('revoked'))}
        catch(err){feedback(err.message,true)}finally{button.disabled=false}
      });row.appendChild(button);
    }
    elements.tokenList.appendChild(row);
  }
  elements.auditLog.replaceChildren(el('h3','',t('auditTitle')));
  for(const item of audit.items.slice(0,12)){
    elements.auditLog.append(el('div','audit-row',item.action+' / '+new Date(item.at).toLocaleString()));
  }
}
async function changeStage(id,action){
  try{
    await api('/api/v1/workspaces/'+state.workspaceId+'/campaigns/'+id+'/'+action,{method:'POST'});
    await refresh();await refreshOwner();
    if(state.editing?.id===id)emptyForm();
    feedback(t(action==='approve'?'approvedDone':'archivedDone'));
  }catch(err){feedback(err.message,true)}
}
elements.lang.addEventListener('change',translate);
elements.campaignForm.addEventListener('input',renderPreview);
elements.venture.addEventListener('change',()=>{renderPreview();renderTemplates()});
elements.newCampaign.addEventListener('click',()=>{emptyForm();feedback(t('newReady'))});
elements.logout.addEventListener('click',()=>{
  state.token='';state.workspaceId='';state.role='';state.workspaceName='';state.campaigns=[];state.editing=null;state.demo=false;
  elements.workspaceApp.hidden=true;elements.receipt.replaceChildren();elements.bootstrapForm.reset();elements.loginForm.reset();
  proposalState.items=[];proposalState.summary=null;proposalState.editing=null;
  proposalUI.receipt.replaceChildren();proposalUI.form.reset();
  feedback('Session cleared.');emptyForm();
});
elements.bootstrapForm.addEventListener('submit',async e=>{
  e.preventDefault();
  if(!elements.bootstrapForm.reportValidity())return;
  const d=Object.fromEntries(new FormData(elements.bootstrapForm).entries());
  try{
    const result=await api('/api/v1/operator/workspaces',{
      method:'POST',token:d.systemToken,body:{name:d.name}
    });
    receipt(t('created'),{WORKSPACE_ID:result.workspace.id,OWNER_TOKEN:result.ownerCredential.token});
    state.workspaceId=result.workspace.id;state.token=result.ownerCredential.token;
    elements.bootstrapForm.reset();
    await loadWorkspace();
    elements.workspaceApp.scrollIntoView({behavior:'smooth'});
  }catch(err){feedback(err.message,true)}
});
elements.loginForm.addEventListener('submit',async e=>{
  e.preventDefault();
  if(!elements.loginForm.reportValidity())return;
  const d=Object.fromEntries(new FormData(elements.loginForm).entries());
  state.workspaceId=d.workspaceId;state.token=d.workspaceToken;
  elements.loginForm.reset();
  try{await loadWorkspace();elements.workspaceApp.scrollIntoView({behavior:'smooth'})}
  catch(err){state.token='';state.workspaceId='';state.role='';elements.workspaceApp.hidden=true;feedback(err.message,true)}
});
elements.campaignForm.addEventListener('submit',async e=>{
  e.preventDefault();
  if(!elements.campaignForm.reportValidity()||!state.workspaceId)return;
  const value=formData();
  const save=elements.saveCampaign;save.disabled=true;
  try{
    const path='/api/v1/workspaces/'+state.workspaceId+'/campaigns';
    const update=state.editing;
    const data=await api(update?path+'/'+update.id:path,{
      method:update?'PATCH':'POST',
      body:update?{...value,expectedRevision:update.revision}:value
    });
    if(!data.campaign?.id)throw Error('Missing persisted campaign');
    const wasEdit=!!update;
    emptyForm();await refresh();await refreshOwner();
    feedback(t(wasEdit?'updated':'saveDone'));
  }catch(err){feedback(err.message,true)}
  finally{save.disabled=state.role==='viewer'}
});
elements.tokenForm.addEventListener('submit',async e=>{
  e.preventDefault();if(!elements.tokenForm.reportValidity())return;
  const fields=Object.fromEntries(new FormData(elements.tokenForm).entries());
  try{
    const result=await api('/api/v1/workspaces/'+state.workspaceId+'/tokens',{
      method:'POST',body:{label:fields.label,role:fields.role,ttlDays:Number(fields.ttlDays)}
    });
    receipt(t('issued'),{TOKEN_ID:result.credential.id,ACCESS_TOKEN:result.token});
    elements.tokenForm.reset();await refreshOwner();feedback(t('issued'));
  }catch(err){feedback(err.message,true)}
});
elements.reload.addEventListener('click',()=>refresh().then(()=>feedback(t('loaded'))).catch(err=>feedback(err.message,true)));
async function init(){
  translate();
  try{
    const catalog=document.body.dataset.staticPreview==='true'
      ? {items:staticTemplates}
      : await api('/api/v1/commercial/ventures');
    state.templates=Array.isArray(catalog.items)?catalog.items:[];
    elements.venture.replaceChildren();
    for(const venture of state.templates){
      const option=el('option','',venture.name);option.value=venture.id;
      elements.venture.appendChild(option);
    }
    renderTemplates();emptyForm();
    if(document.body.dataset.staticPreview==='true'){
      for(const form of [elements.bootstrapForm,elements.loginForm]){
        for(const control of form.querySelectorAll('input,button'))control.disabled=true;
      }
      openDemo();
    }
  }catch(err){feedback(err.message,true)}
}

/* WAVE 5: Commercial proposals live in the same tenant as their source creative.
   Figures here describe offers/contracts, not Stripe charges or recognized revenue. */
const proposalUI={
 form:document.getElementById('proposalForm'),
 campaign:document.getElementById('proposalCampaign'),
 list:document.getElementById('proposalList'),
 summary:document.getElementById('proposalSummary'),
 receipt:document.getElementById('proposalReceipt'),
 total:document.getElementById('estimateTotal'),
 revision:document.getElementById('proposalRevision'),
 save:document.getElementById('saveProposal'),
 clear:document.getElementById('clearProposal')
};
const proposalState={items:[],summary:null,editing:null};
Object.assign(dict.ru,{
 privacyToolsNote:'Владелец может выгрузить данные своей организации или удалить весь кабинет. Удаление закрывает макеты и приватные предложения.',
 exportWorkspace:'ЭКСПОРТИРОВАТЬ ДАННЫЕ JSON ↓',deleteWorkspace:'УДАЛИТЬ ОРГАНИЗАЦИЮ',
 workspaceExportDone:'Приватный экспорт сформирован. Храните его в безопасном месте.',
 deleteConfirmPrompt:'Чтобы удалить всё без возможности отмены, введите точное название организации:',
 deleteMismatch:'Название организации не совпало. Ничего не удалено.',
 workspaceDeleted:'Рабочее пространство и связанные данные удалены из активной базы данных.',

 demoHeading:'Сначала просто посмотрите, как всё устроено.',
 demoExplain:'Деморежим открывает все семь творческих шаблонов и редактор без ключей, записи данных и регистрации.',
 viewDemo:'ОТКРЫТЬ ДЕМО БЕЗ РЕГИСТРАЦИИ →',demoStatus:'Открыта локальная демонстрация. Ничего не сохраняется и не публикуется.',
 proposalTitle:'Предложения, которые можно принять.',
 proposalExplain:'Создайте предложение по конкретной кампании, определите стоимость и передайте приватную ссылку заказчику. Принятие не является оплатой.',
 proposalEditor:'РЕДАКТОР ПРЕДЛОЖЕНИЯ',linkedCampaign:'СВЯЗАННАЯ КАМПАНИЯ',
 clientName:'КОМПАНИЯ ЗАКАЗЧИКА',contactEmail:'ПОЧТА ДЛЯ СВЯЗИ',serviceScope:'ОПИСАНИЕ ОБЪЁМА РАБОТ',
 currency:'ВАЛЮТА',months:'МЕСЯЦЕВ',setup:'РАЗОВАЯ РАБОТА (ВАЛЮТА)',monthly:'ЕЖЕМЕСЯЧНАЯ УСЛУГА (ВАЛЮТА)',
 totalEstimate:'ОБЩАЯ СУММА ПРЕДЛОЖЕНИЯ',quoteCaveat:'Это расчётная сумма, а не оплаченный доход.',
 saveProposal:'СОХРАНИТЬ ПРЕДЛОЖЕНИЕ ↗',newProposal:'НОВОЕ ПРЕДЛОЖЕНИЕ',proposalJournal:'ЖУРНАЛ ПРЕДЛОЖЕНИЙ',
 proposalEmpty:'Пока нет коммерческих предложений.',quoteTerms:'Система не отправляет email автоматически, не выставляет счёт-фактуру и не проводит оплату. Ссылка передаётся отдельно.',
 sentLink:'ПРИВАТНАЯ ССЫЛКА НА ПРЕДЛОЖЕНИЕ (СОХРАНИТЕ ЕЁ)',offerSaved:'Черновик предложения действительно сохранён.',
 offerSent:'Предложение отмечено отправленным; передайте приватную ссылку клиенту самостоятельно.',
 offerChanged:'Данные предложения обновлены.',offerCancelled:'Предложение отменено. Принятие недоступно.',
 sendProposal:'ПОДГОТОВИТЬ ССЫЛКУ',rotateLink:'ПЕРЕВЫПУСТИТЬ ССЫЛКУ',cancelProposal:'ОТМЕНИТЬ',editProposal:'РЕДАКТИРОВАТЬ',
 acceptedNominal:'ПРИНЯТЫХ ПРЕДЛОЖЕНИЙ',sentNominal:'ОЖИДАЮТ РЕШЕНИЯ',realRevenue:'ПОДТВЕРЖДЁННЫХ ПЛАТЕЖЕЙ: НЕТ ИНТЕГРАЦИИ'
});
Object.assign(dict.en,{
 privacyToolsNote:'Owners may export workspace data or delete the entire account. Deletion disables previews and private proposal links.',
 exportWorkspace:'EXPORT PRIVATE JSON ↓',deleteWorkspace:'DELETE WORKSPACE',
 workspaceExportDone:'Private export created. Store it securely.',
 deleteConfirmPrompt:'To permanently delete this workspace, type its exact name:',
 deleteMismatch:'Workspace name did not match. No changes made.',
 workspaceDeleted:'Workspace and related data removed from active database.',

 demoHeading:'Explore the platform before creating an account.',
 demoExplain:'Preview seven creative worlds and the editor without credentials or server writes.',
 viewDemo:'EXPLORE WITHOUT REGISTRATION →',demoStatus:'Local preview is open. No campaign or proposal is stored.',
 proposalTitle:'Proposals clients can actually review.',
 proposalExplain:'Create a quote from a saved campaign and share a private link. Acceptance is not verified payment.',
 proposalEditor:'PROPOSAL EDITOR',linkedCampaign:'LINKED CAMPAIGN',
 clientName:'CLIENT COMPANY',contactEmail:'CONTACT EMAIL',serviceScope:'SCOPE OF SERVICES',
 currency:'CURRENCY',months:'MONTHS',setup:'ONE-TIME FEE',monthly:'MONTHLY SERVICE',
 totalEstimate:'TOTAL QUOTED VALUE',quoteCaveat:'Proposed amount, not collected revenue.',
 saveProposal:'SAVE PROPOSAL ↗',newProposal:'NEW PROPOSAL',proposalJournal:'PROPOSAL PIPELINE',
 proposalEmpty:'No proposals created.',quoteTerms:'No email is sent, no invoice generated and no money charged. Share the private link separately.',
 sentLink:'PRIVATE PROPOSAL LINK (SAVE IT)',offerSaved:'Draft proposal saved.',
 offerSent:'Proposal marked as sent. Share the link with the customer securely.',
 offerChanged:'Proposal updated.',offerCancelled:'Proposal cancelled; acceptance disabled.',
 sendProposal:'ISSUE PRIVATE LINK',rotateLink:'ROTATE PRIVATE LINK',cancelProposal:'CANCEL',editProposal:'EDIT PROPOSAL',
 acceptedNominal:'ACCEPTED PROPOSALS',sentNominal:'AWAITING DECISION',realRevenue:'VERIFIED PAYMENTS: NOT INTEGRATED'
});
Object.assign(dict.zh,{
 privacyToolsNote:'所有者可以导出工作空间数据或删除整个工作空间。删除后预览与私人报价链接立即失效。',
 exportWorkspace:'导出私人 JSON ↓',deleteWorkspace:'删除工作空间',
 workspaceExportDone:'私人数据导出完成，请妥善保管。',
 deleteConfirmPrompt:'如需永久删除，请输入工作空间的完整准确名称：',
 deleteMismatch:'名称不匹配，未删除任何数据。',
 workspaceDeleted:'工作空间和相关记录已从活动数据库删除。',

 demoHeading:'无需注册，先了解平台。',
 demoExplain:'预览七种创意世界和编辑器，不需要密钥，也不会保存数据。',
 viewDemo:'免注册体验 →',demoStatus:'本地预览已打开。不会保存或发布任何活动。',
 proposalTitle:'客户可以查看的真实报价。',
 proposalExplain:'从保存的广告活动创建报价并分享私人链接。接受不等于已付款。',
 proposalEditor:'报价编辑器',linkedCampaign:'关联广告活动',
 clientName:'客户公司',contactEmail:'联系邮箱',serviceScope:'服务范围',
 currency:'货币',months:'月数',setup:'一次性费用',monthly:'每月服务',
 totalEstimate:'报价总额',quoteCaveat:'只是报价，不代表已收款。',
 saveProposal:'保存报价 ↗',newProposal:'新建报价',proposalJournal:'报价管理',
 proposalEmpty:'暂无报价。',quoteTerms:'不自动发送邮件，不生成正式发票，也不收款。请自行安全分享私人链接。',
 sentLink:'私人报价链接（请保存）',offerSaved:'报价草稿已保存。',
 offerSent:'报价已标记发送。请安全地将链接分享给客户。',
 offerChanged:'报价已更新。',offerCancelled:'报价已取消，无法接受。',
 sendProposal:'创建私人链接',rotateLink:'重置私人链接',cancelProposal:'取消',editProposal:'编辑报价',
 acceptedNominal:'已接受报价',sentNominal:'等待决定',realRevenue:'已验证付款：尚未集成'
});
function quotationCents(input) {
 const number=Number(input);
 if(!Number.isFinite(number)||number<0||number>5_000_000)throw Error('Invalid proposal price');
 const amount=Math.round(number*100);
 if(!Number.isSafeInteger(amount))throw Error('Invalid price precision');
 return amount;
}
function moneyDisplay(cents,currency){
 try{return new Intl.NumberFormat(elements.lang.value==='zh'?'zh-CN':elements.lang.value,
   {style:'currency',currency:currency||'USD'}).format(cents/100)}
 catch{return String(cents/100)+' '+currency}
}
function proposalValues() {
 const d=Object.fromEntries(new FormData(proposalUI.form));
 const months=Number(d.months);
 if(!Number.isInteger(months)||months<1||months>24)throw Error('Invalid number of months');
 return {
  campaignId:d.campaignId,clientName:d.clientName,contactEmail:d.contactEmail,
  description:d.description,currency:d.currency,months,
  setupCents:quotationCents(d.setup),monthlyCents:quotationCents(d.monthly)
 };
}
function estimateProposal() {
 try{
  const d=proposalValues(),total=d.setupCents+d.monthlyCents*d.months;
  proposalUI.total.textContent=moneyDisplay(total,d.currency);
 }catch{proposalUI.total.textContent='—'}
}
function prepareProposalCampaigns() {
 const selected=proposalUI.campaign.value;
 proposalUI.campaign.replaceChildren();
 for(const c of state.campaigns){
  if(c.status==='archived')continue;
  const opt=el('option','',c.title+' / '+c.venture+' / '+c.status);
  opt.value=c.id;proposalUI.campaign.appendChild(opt);
 }
 if([...proposalUI.campaign.options].some(o=>o.value===selected))proposalUI.campaign.value=selected;
 estimateProposal();
}
function clearProposal() {
 proposalState.editing=null;proposalUI.revision.textContent='NEW / DRAFT';
 proposalUI.form.reset();prepareProposalCampaigns();
 proposalUI.save.textContent=t('saveProposal');estimateProposal();
}
function editProposal(item) {
 if(item.status!=='draft'||state.role==='viewer')return;
 proposalState.editing={id:item.id,revision:item.revision};
 const values={
  campaignId:item.campaignId,clientName:item.clientName,contactEmail:item.contactEmail,
  description:item.description,currency:item.currency,months:item.months,
  setup:item.setupCents/100,monthly:item.monthlyCents/100
 };
 for(const [key,value] of Object.entries(values))if(proposalUI.form.elements[key])proposalUI.form.elements[key].value=value;
 proposalUI.revision.textContent='REV '+item.revision+' / '+item.id.slice(0,8);
 estimateProposal();proposalUI.form.scrollIntoView({behavior:'smooth'});
}
function showProposalReceipt(relative){
 proposalUI.receipt.replaceChildren();
 const heading=el('strong','',t('sentLink'));
 const code=el('code','',location.origin+relative);
 const copy=el('button','secondary','COPY ↗');copy.type='button';
 copy.addEventListener('click',async()=>{
  if(navigator.clipboard?.writeText) {
    try { await navigator.clipboard.writeText(location.origin+relative);feedback('Copied.');return; }
    catch {}
  }
  feedback('Select and copy the private link above.');
 });
 proposalUI.receipt.append(heading,code,copy);
}
function proposalStageTag(status){
 return {draft:'DRAFT',sent:'AWAITING CUSTOMER',accepted:'ACCEPTED (UNPAID)',declined:'DECLINED',cancelled:'CANCELLED'}[status]||status;
}
function financeTile(label,value,detail){
 const tile=el('div','score');tile.append(el('span','',label),el('strong','',value),el('small','',detail));return tile;
}
function renderProposals(){
 proposalUI.summary.replaceChildren();
 const summary=proposalState.summary;
 const items=proposalState.items;
 proposalUI.summary.append(
  financeTile('TOTAL PROPOSALS',String(items.length),'SERVER RECORDS'),
  financeTile(t('sentNominal'),String(summary?.count?.sent||0),'NOT COLLECTED'),
  financeTile(t('acceptedNominal'),String(summary?.count?.accepted||0),'NOT A PAYMENT')
 );
 for(const currency of ['USD','EUR']){
  const sum=['sent','accepted'].reduce((total,status)=>total+(summary?.byCurrency?.[currency]?.[status]?.nominalCents||0),0);
  if(sum)proposalUI.summary.append(financeTile('PIPELINE / '+currency,moneyDisplay(sum,currency),'PROPOSED VALUE ONLY'));
 }
 proposalUI.list.replaceChildren();
 if(!items.length){proposalUI.list.append(el('p','small',t('proposalEmpty')));return}
 for(const item of items){
  const card=el('article','proposal-item');
  const top=el('div','campaign-top');
  top.append(el('h3','',item.clientName),el('span','stage',proposalStageTag(item.status)));
  card.appendChild(top);
  card.append(el('p','campaign-meta',item.currency+' / '+item.id+' / REV '+item.revision));
  card.append(el('p','',item.description));
  card.append(el('strong','proposal-money',moneyDisplay(item.totalCents,item.currency)));
  const actions=el('div','campaign-actions');
  if(item.status==='draft'&&state.role!=='viewer'){
    const edit=el('button','secondary',t('editProposal'));edit.type='button';
    edit.addEventListener('click',()=>editProposal(item));actions.appendChild(edit);
  }
  if(item.status==='draft'&&state.role==='owner'){
    const send=el('button','primary',t('sendProposal'));send.type='button';
    send.addEventListener('click',()=>actProposal(item,'send'));actions.appendChild(send);
  }
  if(item.status==='sent'&&state.role==='owner'){
    const rotate=el('button','secondary',t('rotateLink'));rotate.type='button';
    rotate.addEventListener('click',()=>actProposal(item,'reissue'));
    const cancel=el('button','secondary',t('cancelProposal'));cancel.type='button';
    cancel.addEventListener('click',()=>actProposal(item,'cancel'));
    actions.append(rotate,cancel);
  }
  card.appendChild(actions);proposalUI.list.appendChild(card);
 }
}
async function refreshProposals(){
 if(!state.workspaceId)return;
 const result=await api('/api/v1/workspaces/'+state.workspaceId+'/proposals');
 proposalState.items=result.items||[];
 proposalState.summary=result.summary||null;
 renderProposals();
}
async function actProposal(item,action){
 try{
  const root='/api/v1/workspaces/'+state.workspaceId+'/proposals/'+item.id;
  const result=await api(root+'/'+action,{method:'POST'});
  if(result.secureShareFragment)showProposalReceipt(result.secureShareFragment);
  await refreshProposals();await refreshOwner();
  feedback(t(action==='cancel'?'offerCancelled':'offerSent'));
 }catch(err){feedback(err.message,true)}
}
proposalUI.form.addEventListener('input',estimateProposal);
proposalUI.clear.addEventListener('click',clearProposal);
proposalUI.form.addEventListener('submit',async event=>{
 event.preventDefault();
 if(!proposalUI.form.reportValidity()||!state.workspaceId)return;
 const save=proposalUI.save;save.disabled=true;
 try{
  const data=proposalValues();
  if(!data.campaignId)throw Error('Create a campaign first.');
  const editing=proposalState.editing;
  const path='/api/v1/workspaces/'+state.workspaceId+'/proposals'+(editing?'/'+editing.id:'');
  const result=await api(path,{
   method:editing?'PATCH':'POST',body:editing?{...data,expectedRevision:editing.revision}:data
  });
  if(!result.proposal?.id)throw Error('Proposal was not persisted');
  clearProposal();await refreshProposals();await refreshOwner();
  feedback(t(editing?'offerChanged':'offerSaved'));
 }catch(err){feedback(err.message,true)}
 finally{save.disabled=state.role==='viewer'}
});
elements.logout.addEventListener('click',()=>{proposalState.items=[];proposalState.summary=null;proposalUI.receipt.replaceChildren()});
document.getElementById('exportWorkspace').addEventListener('click',async()=>{
 if(state.role!=='owner'||!state.workspaceId)return;
 try{
   const data=await api('/api/v1/workspaces/'+state.workspaceId+'/export');
   const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
   const link=el('a');link.href=url;link.download='iv-workspace-'+state.workspaceId+'-private-export.json';
   document.body.append(link);link.click();link.remove();URL.revokeObjectURL(url);
   feedback(t('workspaceExportDone'));
 }catch(err){feedback(err.message,true)}
});
document.getElementById('deleteWorkspace').addEventListener('click',async()=>{
 if(state.role!=='owner'||!state.workspaceId)return;
 const typed=window.prompt(t('deleteConfirmPrompt')+' '+state.workspaceName);
 if(typed===null)return;
 if(typed!==state.workspaceName){feedback(t('deleteMismatch'),true);return}
 const id=state.workspaceId;
 try{
   const r=await api('/api/v1/workspaces/'+id,{method:'DELETE',body:{confirmName:typed}});
   if(!r.deleted)throw Error('No deletion acknowledgement');
   elements.logout.click();
   feedback(t('workspaceDeleted'));
 }catch(err){feedback(err.message,true)}
});


const staticTemplates=[
 {id:'dead-drop',name:'Dead Drop Agency',audience:'Маркетологи и основатели',concept:'Совместная секретная миссия двух рекламных агентов.',exampleHeadline:'У вас есть одно секретное задание.',exampleBody:'Один агент знает продукт, второй — аудиторию. Совместите сведения в рекламной истории.',accent:'cyan'},
 {id:'appeal-2049',name:'Appeal 2049',audience:'Продуктовые команды',concept:'Суд будущего испытывает факты и рекламные аргументы.',exampleHeadline:'Ваше рекламное обещание вызвали в суд.',exampleBody:'В 2049 году каждое обещание проверяется на доказательства и слабые стороны.',accent:'violet'},
 {id:'anti-persona',name:'AntiPersona',audience:'Креативные команды',concept:'Роли меняются — попробуйте рекламу для неожиданных людей.',exampleHeadline:'Ваш клиент может быть совсем другим.',exampleBody:'Посмотрите на продукт глазами человека, которого вы не считали потенциальным покупателем.',accent:'coral'},
 {id:'brief-theatre',name:'Brief Theatre',audience:'Агентства',concept:'Рекламная сцена меняется с каждым новым ограничением.',exampleHeadline:'Один продукт, три неожиданных роли.',exampleBody:'Меняйте сценарий, сохраняя честное предложение продукта.',accent:'gold'},
 {id:'ad-biome',name:'AdBiome',audience:'Performance-специалисты',concept:'Экосистема творческих вариантов для осторожного экспериментирования.',exampleHeadline:'Проверяйте рекламные идеи на практике.',exampleBody:'Создайте творческую гипотезу и сравните её в реальном эксперименте.',accent:'mint'},
 {id:'museum-of-attention',name:'Museum of Attention',audience:'Бренды и школы',concept:'Интерактивные экспонаты о том, на что обращают внимание люди.',exampleHeadline:'Добро пожаловать в музей секунд.',exampleBody:'Откройте короткую историю о человеческом внимании.',accent:'pink'},
 {id:'attention-republic',name:'Attention Republic',audience:'Сообщества',concept:'Вымышленная республика творческих решений и общей ответственности.',exampleHeadline:'Ваша идея может изменить город.',exampleBody:'Примите участие в выборе новой рекламной истории и оцените последствия.',accent:'blue'}
];
function openDemo(){
 if(!state.templates.length){feedback(t('missingBackend'),true);return}
 state.demo=true;state.workspaceId='';state.token='';state.role='demo';state.campaigns=[];state.editing=null;
 state.workspaceName='DEMO / CREATIVE STUDIO';
 elements.currentWorkspace.textContent='DEMO / CREATIVE STUDIO';
 elements.workspaceMeta.textContent='UNTRACKED LOCAL PREVIEW / NO ACCOUNT / NO DATABASE';
 elements.workspaceApp.hidden=false;
 setPermission();renderCampaigns();prepareProposalCampaigns();emptyForm();clearProposal();
 feedback(t('demoStatus'));
 elements.workspaceApp.scrollIntoView({behavior:'smooth'});
}
document.getElementById('viewDemo').addEventListener('click',openDemo);

/* WAVE 10 — Private, explicit creative-world artifact bridge.
 * The browser parses a local file. It never sends JSON to the backend until
 * the user separately reviews and saves the imported campaign draft.
 */
Object.assign(dict.ru, {
 importTitle:'Импортировать результат игры в рекламный черновик.',
 importDisclaimer:'Локальный JSON из одного из пяти новых миров превратится в редактируемый черновик. Данные файла не отправляются в API. Сохранение в организации — только по отдельному действию.',
 importLabel:'ВЫБРАТЬ JSON-ФАЙЛ',
 importSuccess:'Творческий результат загружен в редактор. Проверьте реальные утверждения, внесите исправления и сохраните черновик отдельно.',
 importError:'Не удалось импортировать игровой отчёт. Файл должен быть создан одним из пяти миров и иметь корректную структуру.',
 importReadOnly:'Только владелец, редактор или демонстрационный режим могут заполнять рекламный черновик.'
});
Object.assign(dict.en, {
 importTitle:'Bring your creative world into a campaign draft.',
 importDisclaimer:'Import a local JSON file from one of five worlds into an editable draft. The file content is not uploaded by importing. Server saving always requires a separate action.',
 importLabel:'CHOOSE A LOCAL JSON FILE',
 importSuccess:'Creative report loaded into the editor. Verify all claims, refine the copy and save deliberately.',
 importError:'Could not import this creative report. It must have a valid five-world format.',
 importReadOnly:'Only owners, editors or local demo mode can prepare a campaign draft.'
});
Object.assign(dict.zh, {
 importTitle:'将创意世界成果导入广告草稿。',
 importDisclaimer:'从五个世界之一导入本地JSON文件，生成可编辑草稿。导入时不会上传文件内容；服务器保存必须另行确认。',
 importLabel:'选择本地 JSON 文件',
 importSuccess:'成果已导入编辑器。请核实所有主张，完善文案，然后再选择保存。',
 importError:'无法导入该创意报告。必须是有效的五世界文件格式。',
 importReadOnly:'只有所有者、编辑者或本地演示模式可以准备广告草稿。'
});
const worldImport=document.getElementById('worldImport');
const worldImportState=document.getElementById('worldImportState');
worldImport.addEventListener('change',async()=>{
 const file=worldImport.files?.[0];
 worldImportState.textContent='';
 worldImportState.classList.remove('error');
 if(!file)return;
 if(!(['owner','editor'].includes(state.role) || state.demo)){
   worldImportState.textContent=t('importReadOnly');
   worldImportState.classList.add('error');
   worldImport.value='';
   return;
 }
 try{
   if(file.size<20 || file.size>200_000 || !/\.json$/i.test(file.name))
     throw Error('Choose a JSON file no larger than 200 KB');
   const text=await file.text();
   const source=JSON.parse(text);
   const {toCampaignDraft}=await import('../apps/creative-worlds/bridge.mjs');
   const draft=toCampaignDraft(source,elements.lang.value);
   emptyForm();
   for(const key of ['title','venture','goal','channel','audience','offer','headline','body','ctaLabel']){
     if(elements.campaignForm.elements[key])elements.campaignForm.elements[key].value=draft[key];
   }
   renderTemplates(draft.venture);
   renderPreview();
   worldImportState.textContent=t('importSuccess');
   feedback(t('importSuccess'));
   elements.campaignForm.scrollIntoView({behavior:'smooth'});
 }catch(error){
   worldImportState.textContent=t('importError')+' '+(error.message||'');
   worldImportState.classList.add('error');
   feedback(t('importError'),true);
 }finally{worldImport.value=''}
});



init();
