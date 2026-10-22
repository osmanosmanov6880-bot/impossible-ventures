import {
  EDITION, LANGUAGES, createRun, nextStage, choose, rewind, progress,
  heuristicScores, report, worldIntro, CreativeInputError
} from './engine.mjs';
import { WORLDS, WORLD_IDS } from './worlds.mjs';

const root = document.body;
const worldId = root.dataset.world;
if (!WORLD_IDS.includes(worldId)) throw new Error('Unknown world page');

const ui = Object.fromEntries([
  'locale','navWorld','worldMode','heroSymbol','heroTitle','heroDescription','heroGoal','heroDisclaimer',
  'setupPanel','projectForm','brand','product','audience','demoProject','sessionPanel',
  'progress','progressText','currentChapter','currentQuestion','currentContext','choices',
  'decisionForm','note','noteLabel','noteHint','selectedPreview','continueButton','backButton',
  'scoreboard','feedback','finishPanel','finishHeading','finishCopy','finishMetrics',
  'finishDecisions','download','restart','resultNotice'
].map(key => [key, document.getElementById(key)]));

const localeCopy = {
 ru: {
  nav:'ТВОРЧЕСКИЕ ВСЕЛЕННЫЕ',projectTitle:'Настройте вашу историю.',projectIntro:'Введите реальные рабочие сведения или откройте готовый пример. Никакой регистрации, сервера аналитики и передачи данных.',
  brand:'БРЕНД / КОМАНДА',product:'ПРОДУКТ / ПРЕДЛОЖЕНИЕ',audience:'КОМУ ЭТО НУЖНО',
  start:'ЗАПУСТИТЬ СЦЕНАРИЙ ↗',demo:'ЗАПОЛНИТЬ ПРИМЕРОМ',chapter:'ГЛАВА',previous:'НАЗАД',
  continue:'ПРИНЯТЬ РЕШЕНИЕ →',finish:'ЗАВЕРШИТЬ СЦЕНАРИЙ ↗',note:'АВТОРСКАЯ МЫСЛЬ / РЕПЛИКА',
  noteOptional:'Необязательно. Ваш текст останется только в браузере до экспорта.',
  noteRequired:'Нужно не менее восьми символов. Это ваша авторская реплика, а не текст от ИИ.',
  selected:'ЧТО ИЗМЕНИТ ЭТО РЕШЕНИЕ',choose:'Выберите один из трёх вариантов.',
  completed:'ИСТОРИЯ СОБРАНА.',report:'Ваш результат — самостоятельный творческий документ. Проверьте факты до любой реальной рекламной публикации.',
  download:'СКАЧАТЬ РЕЗУЛЬТАТ JSON ↓',again:'НАЧАТЬ ЗАНОВО',commercial:'ИМПОРТИРОВАТЬ В КОНСТРУКТОР ↗',
  scoreNotice:'Игровые баллы: только эвристика сценария, не клики и не статистика.',
  disclaimer:'ЛОКАЛЬНЫЙ ТВОРЧЕСКИЙ ТРЕНАЖЁР / НЕТ ТРЕКИНГА',
  reportWarning:'Это художественный сценарий и гипотезы, а не настоящие показы, продажи, аудитория или платформа размещения.',
  privacyBanner:'ПРИВАТНОСТЬ / Вводимые сведения используются только здесь, в браузере. Мы не отправляем тексты игры серверу и не сохраняем их автоматически.',
  stageTitle:'ВАШИ РЕШЕНИЯ.',
  stageIntro:'Каждое решение меняет дальнейший рассказ и итоговый креатив. Баллы — игровая эвристика, не настоящая рекламная аналитика.',
  footerWarning:'НЕ СОБИРАЕМ ПОЛЬЗОВАТЕЛЬСКИЕ СОБЫТИЯ • НЕ ИМИТИРУЕМ РЕАЛЬНЫЕ ПРОДАЖИ',
  stageDone:'Принято. Следующая глава открыта.',success:'Ваша творческая работа готова к экспорту.',
  count:'из',line:'Ваша реплика',withoutLine:'Без авторской реплики',metric:'ИГРОВЫЕ ПОКАЗАТЕЛИ',
  finalAct:'ИТОГИ ВЫБОРА',control:'Контроль',world:'Вселенная'
 },
 en: {
  nav:'CREATIVE UNIVERSES',projectTitle:'Set the scene.',projectIntro:'Enter a real working concept or load a safe example. No registration, analytics server or data transfer.',
  brand:'BRAND / TEAM',product:'PRODUCT / OFFER',audience:'INTENDED AUDIENCE',
  start:'BEGIN THE EXPERIENCE ↗',demo:'USE SAMPLE PROJECT',chapter:'CHAPTER',previous:'BACK',
  continue:'COMMIT DECISION →',finish:'FINISH THE EXPERIENCE ↗',note:'YOUR CREATIVE LINE / REFLECTION',
  noteOptional:'Optional. This text remains only in your browser until you download it.',
  noteRequired:'At least eight characters. This is your authored line, not an AI output.',
  selected:'WHAT YOUR DECISION CHANGES',choose:'Select one of the three directions.',
  completed:'YOUR STORY IS COMPLETE.',report:'A creative deliverable you can take away. Verify all facts before any real advertising.',
  download:'DOWNLOAD REPORT JSON ↓',again:'RESTART',commercial:'IMPORT INTO CAMPAIGN BUILDER ↗',
  scoreNotice:'Game scores are design heuristics, never clicks or real performance.',
  disclaimer:'BROWSER-ONLY CREATIVE WORKSHOP / NO TRACKING',
  reportWarning:'An authored simulation and hypotheses, not actual impressions, customers, sales or a live ad network.',
  privacyBanner:'PRIVACY / Your input stays inside this browser experience. Nothing is automatically saved or submitted to our business APIs.',
  stageTitle:'YOUR DECISIONS.',
  stageIntro:'Each decision changes the narrative and resulting creative artifact. Game scores are heuristics, not advertising analytics.',
  footerWarning:'NO PARTICIPANT TRACKING • NO SIMULATED REAL SALES',
  stageDone:'Decision recorded. Next chapter opened.',success:'Your creative artifact is ready to export.',
  count:'of',line:'Your authored line',withoutLine:'No authored line',metric:'ILLUSTRATIVE METRICS',
  finalAct:'YOUR DECISIONS',control:'Control',world:'World'
 },
 zh: {
  nav:'创意世界',projectTitle:'设定您的故事。',projectIntro:'输入真实的工作概念或选择演示项目。无需注册、分析服务器或传输数据。',
  brand:'品牌 / 团队',product:'产品 / 服务',audience:'目标受众',
  start:'开始体验 ↗',demo:'使用示例项目',chapter:'章节',previous:'返回',
  continue:'确认选择 →',finish:'完成体验 ↗',note:'您的创作台词 / 反思',
  noteOptional:'可选。此文字仅保留在浏览器中，直到您主动下载。',
  noteRequired:'至少八个字符。这是您写的台词，不是AI生成。',
  selected:'此决定将带来的变化',choose:'请选择三个方向之一。',
  completed:'故事已完成。',report:'您可以带走创意成果。在真实投放广告前，请核实所有事实。',
  download:'下载 JSON 报告 ↓',again:'重新开始',commercial:'导入广告活动编辑器 ↗',
  scoreNotice:'游戏分数只是设计启发，不代表真实点击或效果。',
  disclaimer:'仅浏览器本地创作 / 不跟踪',
  reportWarning:'这是创意模拟与假设，并非真实展示、客户、销售或广告网络。',
  privacyBanner:'隐私说明 / 您输入的信息仅在当前浏览器体验中使用，不会自动保存或发送至业务API。',
  stageTitle:'您的选择。',
  stageIntro:'每个决定都会改变故事与最终创意。游戏分数仅是启发式模型，不代表真实广告数据。',
  footerWarning:'不追踪参与者 • 不虚构真实销售',
  stageDone:'选择已记录。下一章已开启。',success:'您的创意成果可以下载。',
  count:'共',line:'您的原创台词',withoutLine:'无原创台词',metric:'示意指标',
  finalAct:'您的选择',control:'控制',world:'世界'
 }
};
const sampleProject = {
 ru:{brand:'Aurora Creative Lab',product:'Программа по созданию честных рекламных кампаний',audience:'Маркетинговые команды небольших компаний'},
 en:{brand:'Aurora Creative Lab',product:'A workshop for evidence-led interactive advertising',audience:'Marketing teams at small companies'},
 zh:{brand:'Aurora Creative Lab',product:'以证据为基础的互动广告创作课程',audience:'中小企业营销团队'}
};

let run = null;
let pending = '';
function tr(key) {return localeCopy[ui.locale.value]?.[key] || localeCopy.ru[key] || key}
function element(tag,className='',value) {
 const node=document.createElement(tag);
 if(className)node.className=className;
 if(value!==undefined)node.textContent=String(value);
 return node;
}
function announce(message,failed=false) {
 ui.feedback.textContent=message;
 ui.feedback.classList.toggle('error',failed);
}
function renderIntro() {
 const info=worldIntro(worldId,ui.locale.value);
 ui.worldMode.textContent=info.mode+' / '+info.number+' OF 07';
 ui.navWorld.textContent=tr('nav');
 ui.heroSymbol.textContent=info.symbol;
 ui.heroTitle.textContent=info.title;
 ui.heroDescription.textContent=info.introduction;
 ui.heroGoal.textContent=info.objective;
 ui.heroDisclaimer.textContent=tr('disclaimer');
 document.getElementById('privacyBanner').textContent=tr('privacyBanner');
 document.getElementById('asideExplain').textContent=info.objective;
 document.getElementById('stageTitle').textContent=tr('stageTitle');
 document.getElementById('stageIntro').textContent=tr('stageIntro');
 document.getElementById('footerWarning').textContent=tr('footerWarning');
 const submit=ui.projectForm.querySelector('button[type="submit"]');
 submit.textContent=tr('start');
 ui.demoProject.textContent=tr('demo');
 for(const [key,label] of [['brand','brand'],['product','product'],['audience','audience']]) {
  const input=ui[key],wrap=input.closest('label');
  if(wrap)wrap.querySelector('span').textContent=tr(label);
 }
 const title=document.querySelector('#projectTitle');
 const detail=document.querySelector('#projectIntro');
 title.textContent=tr('projectTitle');detail.textContent=tr('projectIntro');
 document.querySelector('#resultWarning').textContent=tr('reportWarning');
 ui.download.textContent=tr('download');
 ui.restart.textContent=tr('again');
 document.getElementById('toCommercial').textContent=tr('commercial');
}
function metricCards(scores,target) {
 target.replaceChildren();
 for(const score of scores) {
  const wrap=element('div','metric');
  const top=element('div','metric-top');
  top.append(element('span','',score.label),element('strong','',String(score.value)+' / 100'));
  const meter=element('progress','metric-progress');
  meter.max=100;meter.value=score.value;
  meter.setAttribute('aria-label',score.label);
  wrap.append(top,meter);target.appendChild(wrap);
 }
}
function renderStage() {
 const stage=nextStage(run);
 if(!stage) {renderFinish();return}
 ui.setupPanel.hidden=true;
 ui.finishPanel.hidden=true;
 ui.sessionPanel.hidden=false;
 const count=progress(run);
 ui.progress.max=count.total;
 ui.progress.value=count.completed;
 ui.progressText.textContent=tr('chapter')+' '+(stage.index+1)+' '+tr('count')+' '+stage.total;
 ui.currentChapter.textContent=stage.title;
 ui.currentQuestion.textContent=stage.question;
 ui.currentContext.textContent=stage.consequenceFromPrevious || worldIntro(worldId,ui.locale.value).objective;
 ui.noteLabel.textContent=tr('note');
 ui.noteHint.textContent=stage.requiredNote?tr('noteRequired'):tr('noteOptional');
 ui.note.placeholder=stage.hint;
 ui.note.required=stage.requiredNote;
 ui.note.minLength=stage.requiredNote?8:0;
 ui.note.value='';
 ui.backButton.disabled=count.completed===0;
 ui.backButton.textContent=tr('previous');
 ui.continueButton.textContent=stage.index===stage.total-1?tr('finish'):tr('continue');
 document.querySelector('#scoreTitle').textContent=tr('metric');
 document.querySelector('#scoreCaveat').textContent=tr('scoreNotice');
 ui.choices.replaceChildren();
 pending='';
 for(const [index,item] of stage.choices.entries()) {
  const button=element('button','choice');
  button.type='button';button.dataset.choiceId=item.id;button.setAttribute('aria-pressed','false');
  button.append(element('span','choice-number',String(index+1).padStart(2,'0')),element('strong','',item.label));
  const arrow=element('span','choice-arrow','↗');arrow.setAttribute('aria-hidden','true');button.appendChild(arrow);
  button.addEventListener('click',()=>{
    pending=item.id;
    for(const other of ui.choices.querySelectorAll('button')) {
      const selected=other.dataset.choiceId===pending;
      other.classList.toggle('selected',selected);
      other.setAttribute('aria-pressed',String(selected));
    }
    ui.selectedPreview.hidden=false;
    ui.selectedPreview.replaceChildren(element('small','',tr('selected')),element('p','',item.consequence));
    ui.continueButton.disabled=false;
    announce('');
  });
  ui.choices.appendChild(button);
 }
 ui.continueButton.disabled=true;
 ui.selectedPreview.hidden=true;
 metricCards(heuristicScores(run),ui.scoreboard);
 ui.sessionPanel.scrollIntoView({block:'start',behavior:'smooth'});
}
function renderFinish() {
 const result=report(run);
 ui.setupPanel.hidden=true;ui.sessionPanel.hidden=true;ui.finishPanel.hidden=false;
 ui.finishHeading.textContent=tr('completed');
 ui.finishCopy.textContent=result.ending;
 ui.resultNotice.textContent=tr('report');
 document.querySelector('#decisionHeading').textContent=tr('finalAct');
 metricCards(result.heuristics,ui.finishMetrics);
 ui.finishDecisions.replaceChildren();
 for(const decision of result.decisions) {
  const card=element('article','result-decision');
  card.append(element('small','',String(decision.chapter).padStart(2,'0')+' / '+decision.heading));
  card.append(element('h3','',decision.decision));
  card.append(element('p','',decision.simulatedConsequence));
  if(decision.authoredLine) {
    const q=element('blockquote','',decision.authoredLine);
    q.setAttribute('aria-label',tr('line'));
    card.appendChild(q);
  }
  ui.finishDecisions.appendChild(card);
 }
 announce(tr('success'));
 ui.finishPanel.scrollIntoView({block:'start',behavior:'smooth'});
}
function applyLanguage() {
 const locale=ui.locale.value;
 document.documentElement.lang=locale==='zh'?'zh-CN':locale;
 document.title=WORLDS[worldId].name+' — Impossible Ventures';
 if(run)run={...run,locale};
 renderIntro();
 if(!run)return;
 if(progress(run).finished)renderFinish();
 else renderStage();
}
ui.locale.addEventListener('change',applyLanguage);
ui.demoProject.addEventListener('click',()=>{
 const data=sampleProject[ui.locale.value];
 for(const key of ['brand','product','audience'])ui[key].value=data[key];
 announce('');
 ui.brand.focus();
});
ui.projectForm.addEventListener('submit',event=>{
 event.preventDefault();
 if(!ui.projectForm.reportValidity())return;
 try {
  run=createRun(worldId,{
   brand:ui.brand.value,product:ui.product.value,audience:ui.audience.value
  },ui.locale.value);
  announce('');
  renderStage();
 } catch(error) {announce(error.message,true)}
});
ui.decisionForm.addEventListener('submit',event=>{
 event.preventDefault();
 if(!run)return;
 try{
  if(!pending)throw new CreativeInputError(tr('choose'));
  const note=ui.note.value;
  run=choose(run,pending,note);
  announce(tr('stageDone'));
  if(progress(run).finished)renderFinish();
  else renderStage();
 }catch(error){announce(error.message,true)}
});
ui.backButton.addEventListener('click',()=>{
 if(!run)return;
 run=rewind(run);
 renderStage();
});
ui.restart.addEventListener('click',()=>{
 run=null;pending='';ui.finishPanel.hidden=true;ui.sessionPanel.hidden=true;
 ui.setupPanel.hidden=false;announce('');
 ui.setupPanel.scrollIntoView({block:'start',behavior:'smooth'});
});
ui.download.addEventListener('click',()=>{
 if(!run || !progress(run).finished)return;
 try{
  const data=report(run);
  const blob=new Blob([JSON.stringify(data,null,2)+'\n'],{type:'application/json;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download='iv-'+worldId+'-creative-brief.json';
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
 }catch(error){announce(error.message,true)}
});
applyLanguage();
