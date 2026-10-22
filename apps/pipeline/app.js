import {toPremiumCampaignDraft,makePremiumHandoff,MAX_PREMIUM_IMPORT_BYTES} from '../creative-worlds/studio-bridge.mjs';

const locales={
 ru:{
 commercial:'COMMERCIAL COMMAND ↗',overline:'ОТ ИДЕИ К КАМПАНИИ — С ЧЕЛОВЕКОМ В ЦЕНТРЕ.',
 hero1:'Собери идею.',hero2:'Передай на проверку.',
 intro:'Импортируй творческий результат из одного из пяти продуктов. Получи понятный рекламный черновик и передай его в Commercial Command только после собственного решения. Никакой автоматической публикации.',
 tag1:'05 ФОРМАТОВ',tag2:'00 АВТОМАТИЧЕСКИХ ПУБЛИКАЦИЙ',tag3:'ВСЁ В БРАУЗЕРЕ',
 stage:'01 / ИМПОРТ И ПРОВЕРКА',importHeading:'Загрузи результат творчества.',
 importDescription:'Принимаются JSON-отчёты Appeal 2049, AntiPersona, Brief Theatre, AdBiome и завершённое досье Dead Drop. Файлы читаются только локально.',
 sourceReminder:'Оригинальные отчёты могут содержать рабочие идеи. Держите файлы в безопасности и не включайте в них секретные ключи, персональные данные и реальные пароли.',
 fileLabel:'Файл отчёта (.json до 200 КБ)',pathTitle:'03 ШАГА',
 step1:'Выбери творческий исходник',step1desc:'Не нужно создавать аккаунт и отправлять файл в сеть.',
 step2:'Проверь каждое утверждение',step2desc:'Составь понятный заголовок и призыв, не выдавая гипотезы за доказательства.',
 step3:'Передай черновик осознанно',step3desc:'Файл можно отдельно импортировать в Commercial Command. Он не будет сохранён без команды пользователя.',
 reviewHeading:'Черновик для проверки человеком.',emptyTitle:'Пока нечего проверять.',
 emptyDescription:'Загрузи рабочий JSON-файл слева. Здесь появится редактируемая рекламная идея и кнопка экспорта.',
 unsaved:'НЕ СОХРАНЕНО',titleLabel:'Название кампании',audienceLabel:'Целевая аудитория',
 offerLabel:'Реальное предложение',headlineLabel:'Рекламный заголовок',bodyLabel:'Рекламный текст',
 ctaLabel:'Текст кнопки',warning:'Предпросмотр — не подтверждение фактов. Никаких рассылок, платных показов или публикаций система не запускает.',
 preview:'ПРЕДПРОСМОТР',export:'СКАЧАТЬ РЕДАКТОРСКИЙ ЧЕРНОВИК .JSON ↓',
 openCommand:'ОТКРЫТЬ COMMERCIAL COMMAND ↗',
 p1Title:'Важные данные под контролем.',p1Body:'Неизвестные поля, токены и чужие скрытые сведения не переходят в рекламный черновик.',
 p2Title:'Гипотеза, а не факт.',p2Body:'Текст остаётся материалом для редактора; реальные заявления нужно проверить до публикации.',
 p3Title:'Коммерческий контроль.',p3Body:'Подготовленный файл вручную открывается в Commercial Command и сохраняется только авторизованным пользователем.',
 footnote:'Файлы и черновики обрабатываются в этой вкладке без отправки в API',privacy:'Обработка данных ↗',
 imported:'Данные локально импортированы. Проверьте и отредактируйте все поля.',
 invalid:'Этот файл не соответствует поддерживаемому формату. Необходимо загрузить завершённый отчёт.',
 tooLarge:'Файл больше 200 КБ. Обработка отменена.',
 saved:'Черновик скачан. В Commercial Command загрузите его вручную и отдельно нажмите «Сохранить».',
 invalidDraft:'Проверьте поля: заголовок, аудитория, предложение и действие обязательны.'
 },
 en:{
 commercial:'COMMERCIAL COMMAND ↗',overline:'FROM CREATIVE TO CAMPAIGN — A HUMAN DECIDES.',
 hero1:'Capture the idea.',hero2:'Hand it off deliberately.',
 intro:'Import a local creative deliverable from five supported products, inspect the suggested draft and hand it off to Commercial Command only when you choose. Never auto-published.',
 tag1:'05 FORMATS',tag2:'00 AUTOMATIC PUBLICATIONS',tag3:'BROWSER-ONLY',
 stage:'01 / IMPORT AND REVIEW',importHeading:'Bring your research into the room.',
 importDescription:'Accepts finalized Appeal 2049, AntiPersona, Brief Theatre, AdBiome and Dead Drop agent JSON. Your file stays in the browser.',
 sourceReminder:'Original files may contain unfinished client work. Keep them secure and do not include private passwords, API keys or personal records.',
 fileLabel:'Local JSON report (up to 200 KB)',pathTitle:'03 STEPS',
 step1:'Choose a source artifact',step1desc:'No account or file upload is needed for local review.',
 step2:'Check every claim',step2desc:'Edit the headline and action without claiming unverified evidence.',
 step3:'Hand off with intent',step3desc:'Import the downloaded file into Commercial Command; saving requires a separate permissioned action.',
 reviewHeading:'Human-reviewable campaign draft.',emptyTitle:'No draft to review yet.',
 emptyDescription:'Load a local JSON report to get an editable campaign concept and handoff export.',
 unsaved:'NOT SAVED',titleLabel:'Campaign title',audienceLabel:'Intended audience',
 offerLabel:'Actual offer',headlineLabel:'Campaign headline',bodyLabel:'Campaign body',
 ctaLabel:'Button label',warning:'The preview is not fact verification. No email, paid impressions or publishing action is triggered.',
 preview:'LOCAL PREVIEW',export:'EXPORT EDITORIAL DRAFT .JSON ↓',openCommand:'OPEN COMMERCIAL COMMAND ↗',
 p1Title:'Keep control of private work.',p1Body:'Unrecognized metadata, access tokens and opposing private intelligence are excluded.',
 p2Title:'A hypothesis, not proof.',p2Body:'These are drafts requiring independent editorial and evidence review.',
 p3Title:'A commercial approval gate.',p3Body:'Manually open the prepared file in Commercial Command and save only with an authorized role.',
 footnote:'Files and drafts are processed within this browser tab and not sent to our API',privacy:'Data handling ↗',
 imported:'Source imported locally. Review and edit the draft before export.',
 invalid:'This is not a compatible completed artifact format.',
 tooLarge:'File exceeds 200 KB and was rejected.',
 saved:'Handoff downloaded. Import it into Commercial Command and use a separate Save Draft action.',
 invalidDraft:'Review all mandatory title, audience, offer, headline and action fields.'
 },
 zh:{
 commercial:'COMMERCIAL COMMAND ↗',overline:'从创意到广告活动——由人决定。',
 hero1:'整理创意。',hero2:'由你决定交接。',
 intro:'从五种支持的产品导入本地成果，检查广告草案，只在你主动选择后转入 Commercial Command。不会自动发布。',
 tag1:'05 种格式',tag2:'00 次自动发布',tag3:'仅在浏览器中处理',
 stage:'01 / 导入并审核',importHeading:'将研究成果转成草案。',
 importDescription:'支持 Appeal 2049、AntiPersona、Brief Theatre、AdBiome 和已完成 Dead Drop 特工报告。文件仅在本地读取。',
 sourceReminder:'原始文件可能包含客户创意，请妥善保管；不要包含密码、API 密钥或个人资料。',
 fileLabel:'本地 JSON 报告（最大 200 KB）',pathTitle:'03 个步骤',
 step1:'选择来源文件',step1desc:'本地审查无需账号，也不会上传文件。',
 step2:'检查每项主张',step2desc:'编辑标题和行动，不把未经验证的证据说成事实。',
 step3:'主动进行交接',step3desc:'将下载的文件手动导入 Commercial Command，保存需要另行操作与权限。',
 reviewHeading:'需要人工审核的广告草稿。',emptyTitle:'暂无可审查的草稿。',
 emptyDescription:'上传本地 JSON 报告以获得可编辑的广告概念和交接文件。',
 unsaved:'未保存',titleLabel:'活动名称',audienceLabel:'目标受众',
 offerLabel:'实际提案',headlineLabel:'广告标题',bodyLabel:'广告正文',ctaLabel:'按钮文本',
 warning:'预览不代表事实验证。不会自动发送邮件、投放广告或发布内容。',
 preview:'本地预览',export:'导出编辑草稿 .JSON ↓',openCommand:'打开 COMMERCIAL COMMAND ↗',
 p1Title:'私密工作由你掌控。',p1Body:'不识别的字段、访问令牌和对方未公开的信息不会进入草稿。',
 p2Title:'假设不等于证据。',p2Body:'草案仍需独立编辑审查与证据核查。',
 p3Title:'商业审批步骤。',p3Body:'手动将文件导入 Commercial Command，并且只有具备权限的用户才可保存。',
 footnote:'文件和草稿仅在当前浏览器标签页内处理，不会发送到 API',privacy:'数据处理说明 ↗',
 imported:'来源已在本地导入，请检查并修改草稿。',
 invalid:'不是支持的已完成成果文件。',
 tooLarge:'文件超过 200 KB，已拒绝。',
 saved:'交接文件已下载，须手动导入 Commercial Command 并另行保存。',
 invalidDraft:'请检查活动名称、受众、提案、标题及按钮。'
 }
};
const E={
 locale:document.getElementById('locale'),file:document.getElementById('importFile'),
 status:document.getElementById('fileStatus'),form:document.getElementById('editor'),
 previewTitle:document.getElementById('previewHeadline'),previewBody:document.getElementById('previewBody'),
 previewCta:document.getElementById('previewCta'),
 exportStatus:document.getElementById('exportStatus')
};
const fields={title:'campaignTitle',audience:'campaignAudience',offer:'campaignOffer',
 headline:'campaignHeadline',body:'campaignBody',ctaLabel:'campaignCta'};
let language='ru',base=null;
const t=k=>locales[language][k]??locales.en[k]??k;
function translate(){
 document.documentElement.lang=language==='zh'?'zh-CN':language;
 E.locale.value=language;
 document.querySelectorAll('[data-i18n]').forEach(element=>element.textContent=t(element.dataset.i18n));
 renderPreview();
}
function renderPreview(){
 E.previewTitle.textContent=document.getElementById(fields.headline).value;
 E.previewBody.textContent=document.getElementById(fields.body).value;
 E.previewCta.textContent=document.getElementById(fields.ctaLabel).value;
}
function apply(draft){
 base=draft;
 for(const [name,id] of Object.entries(fields))document.getElementById(id).value=draft[name];
 document.getElementById('sourceName').textContent='SOURCE / '+draft._bridge.source.toUpperCase();
 E.form.hidden=false;document.getElementById('empty').hidden=true;
 E.exportStatus.textContent='';E.status.textContent=t('imported');renderPreview();
}
function values(){
 const current={...base};
 for(const [name,id]of Object.entries(fields))current[name]=document.getElementById(id).value.trim();
 return current;
}
function download(content,filename){
 const url=URL.createObjectURL(new Blob([content],{type:'application/json;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download=filename;
 document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
E.file.addEventListener('change',async()=>{
 const file=E.file.files?.[0];
 E.status.textContent='';E.file.value='';
 if(!file)return;
 if(file.size>MAX_PREMIUM_IMPORT_BYTES||file.size<10){
   E.status.textContent=t('tooLarge');return;
 }
 if(!/\.json$/iu.test(file.name)){E.status.textContent=t('invalid');return;}
 try{
   const artifact=JSON.parse(await file.text());
   apply(toPremiumCampaignDraft(artifact,language));
 }catch{
   E.status.textContent=t('invalid');
 }
});
E.form.addEventListener('input',renderPreview);
E.form.addEventListener('submit',event=>{
 event.preventDefault();E.exportStatus.textContent='';
 if(!base||!E.form.reportValidity())return;
 try{
   const json=makePremiumHandoff(values());
   // Re-import our own file and check every editable field before export.
   const parsed=toPremiumCampaignDraft(json,language);
   if(!parsed.title || parsed.headline.length<5 || parsed.body.length<10)throw Error('Invalid draft');
   download(JSON.stringify(json,null,2),'impossible-ventures-reviewed-creative.json');
   E.exportStatus.textContent=t('saved');
 }catch{
   E.exportStatus.textContent=t('invalidDraft');
 }
});
E.locale.addEventListener('change',()=>{
 language=Object.hasOwn(locales,E.locale.value)?E.locale.value:'ru';translate();
});
const q=new URLSearchParams(location.search).get('lang');
language=Object.hasOwn(locales,q)?q:'ru';
translate();
