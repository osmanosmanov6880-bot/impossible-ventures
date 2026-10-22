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

const state = { workspaceId: '', token: '', role: '', workspaceName: '', templates: [], campaigns: [], editing: null };
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
    elements.ventureGrid.appendChild(card);
  }
}
function setPermission() {
  const canEdit=['owner','editor'].includes(state.role);
  for(const input of elements.campaignForm.querySelectorAll('input,select,textarea'))input.disabled=!canEdit;
  elements.saveCampaign.disabled=!canEdit;
  elements.ownerTools.hidden=state.role!=='owner';
  if(!canEdit)feedback(t('readOnly'));
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
}
async function loadWorkspace() {
  const data=await api('/api/v1/workspaces/'+state.workspaceId);
  state.role=data.credential.role;
  state.workspaceName=data.workspace.name;
  elements.currentWorkspace.textContent=state.workspaceName;
  elements.workspaceMeta.textContent=state.workspaceId+' / '+t('roleLabel')+': '+t(state.role);
  elements.workspaceApp.hidden=false;
  setPermission();
  await refresh();
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
  state.token='';state.workspaceId='';state.role='';state.workspaceName='';state.campaigns=[];state.editing=null;
  elements.workspaceApp.hidden=true;elements.receipt.replaceChildren();elements.bootstrapForm.reset();elements.loginForm.reset();
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
    const catalog=await api('/api/v1/commercial/ventures');
    state.templates=Array.isArray(catalog.items)?catalog.items:[];
    elements.venture.replaceChildren();
    for(const venture of state.templates){
      const option=el('option','',venture.name);option.value=venture.id;
      elements.venture.appendChild(option);
    }
    renderTemplates();emptyForm();
  }catch(err){feedback(err.message,true)}
}
init();
