import { STORY, local, IDS } from './story.mjs';

const copy = {
  ru: {
    offer:'ПРЕДЛОЖЕНИЕ', unavailable:'История недоступна: не опубликована, приостановлена или закрыта владельцем.',
    start:'НАЧАТЬ ИСТОРИЮ →', next:'СЛЕДУЮЩАЯ ГЛАВА →',finish:'ЗАВЕРШИТЬ ИСТОРИЮ ↗',
    introTitle:'Ваш выбор изменит историю.', consent:'Добровольно разрешаю учёт запуска истории, завершения и нажатия на кнопку. Без согласия игра работает точно так же; ответы не передаются.',
    detail:'Можно продолжить без галочки. Отказ не ограничивает контент. Случайная сессия удаляется через 7 дней, агрегированные показатели — через 90.',
    status:'ИНТЕРАКТИВНАЯ ИСТОРИЯ / ДОБРОВОЛЬНО',chapter:'ГЛАВА', outOf:'из',
    choose:'Выберите направление.', journal:'ВАШ МАРШРУТ', sidebar:'Действия меняют сюжет, но это не имитация рекламных показов, клиентов или продаж.',
    recorded:'Технические события записываются только с согласия.',untracked:'Без учёта событий — история доступна полностью.',
    failedTrack:'Учёт событий недоступен. История продолжится без отправки игровых ответов.',
    endTitle:'История завершена.',end:'Ваш путь собран. Вы можете продолжить без контакта или отдельно запросить коммерческий пилот.',
    cta:'ОБСУДИТЬ ПИЛОТ ↗',restart:'ПРОЙТИ ЗАНОВО',
    ctaDisclosure:'Переход в Pilot Studio доброволен. Для отправки контактной формы понадобится отдельное согласие. Здесь нет оплаты и покупки рекламы.',
    consentPanel:'Первичный добровольный учёт','message':'',
    noRevenue:'ЭТО НЕ ПЛАТНАЯ РЕКЛАМА И НЕ ПОДТВЕРЖДЁННЫЕ ПРОДАЖИ',privacy:'ПРИВАТНОСТЬ ↗',
    unknown:'Некорректная ссылка на кампанию.', world:'МИР', stageDone:'Выбранный сценарий сохранён только в памяти вкладки.'
  },
  en: {
    offer:'THE OFFER',unavailable:'Story unavailable: not published, paused, or retired by its owner.',
    start:'BEGIN STORY →',next:'NEXT CHAPTER →',finish:'FINISH STORY ↗',
    introTitle:'Your choice shapes the story.',consent:'I voluntarily allow counting a session start, completion and CTA signal. Gameplay works equally without consent; my choices are not submitted.',
    detail:'You can continue unchecked. Declining never blocks content. A random session lasts at most 7 days; aggregate event counts last 90 days.',
    status:'INTERACTIVE STORY / OPTIONAL PARTICIPATION',chapter:'CHAPTER',outOf:'of',
    choose:'Choose a direction.',journal:'YOUR STORY PATH',sidebar:'Choices change the narrative; they do not represent ad impressions, clients or purchases.',
    recorded:'Technical events are counted only with explicit consent.',untracked:'Untracked play: the full story remains available.',
    failedTrack:'Measurement is unavailable. Story continues without uploading your choices.',
    endTitle:'Story completed.',end:'Your path is ready. Leave without contact or separately request a commercial pilot.',
    cta:'DISCUSS A PILOT ↗',restart:'PLAY AGAIN',
    ctaDisclosure:'Pilot Studio is optional. Sending a contact form requires separate consent. This is neither a payment nor ad buying.',
    noRevenue:'NOT PAID AD DELIVERY OR VERIFIED REVENUE',privacy:'PRIVACY ↗',unknown:'Invalid campaign link.',world:'WORLD',
    stageDone:'Your choice remains only in this tab’s memory.'
  },
  zh: {
    offer:'产品与服务',unavailable:'故事不可用：可能尚未发布、已暂停或被所有者结束。',
    start:'开始故事 →',next:'下一章 →',finish:'完成故事 ↗',
    introTitle:'您的选择将改变故事。',consent:'我自愿同意记录一次启动、完成和按钮点击。不勾选也可以完整体验，故事选项不会上传。',
    detail:'可以不勾选继续体验。拒绝不会限制内容。随机会话最多保留7天，汇总事件保留90天。',
    status:'互动故事 / 自愿参与',chapter:'章节',outOf:'共',
    choose:'请选择故事方向。',journal:'您的故事路线',sidebar:'选择影响剧情，并不代表真实广告展示、客户或销售。',
    recorded:'仅在您明确同意后记录技术事件。',untracked:'无事件记录模式，仍可完整体验。',
    failedTrack:'事件统计不可用。故事将继续，不上传您的选择。',
    endTitle:'故事完成。',end:'您已经完成选择。可以直接离开，也可以单独申请商业试点。',
    cta:'讨论试点 ↗',restart:'再次体验',
    ctaDisclosure:'前往 Pilot Studio 完全自愿。提交联系表单需要单独同意。这里不处理付款或广告购买。',
    noRevenue:'非付费广告投放或经核实的收入',privacy:'隐私 ↗',unknown:'无效的广告活动链接。',world:'世界',
    stageDone:'您的选择仅保存在当前标签页内存。'
  }
};
const ui=Object.fromEntries([
  'locale','worldLabel','storyStatus','heroTitle','creativeBody','offerLabel','offer','worldGlyph',
  'preflight','introTitle','storyIntro','consentAnalytics','consentLabel','consentDetail','start',
  'storyPanel','chapterNo','progress','chapterTitle','chapterPrompt','answers','consequence','next',
  'journalLabel','journal','sidebarDisclaimer','finishPanel','finishTitle','finishDescription',
  'pathSummary','ctaButton','restart','ctaDisclosure','message','footerDisclaimer','privacy'
].map(key=>[key,document.getElementById(key)]));
let live=null, story=null, phase='loading',step=0,pending=null,choices=[];
let session=null, optIn=false, completionSignaled=false;
const id=new URLSearchParams(location.search).get('id')||'';
const t=key=>copy[ui.locale.value]?.[key]||copy.ru[key]||key;
const node=(tag,className='',value)=>{
 const n=document.createElement(tag); if(className)n.className=className;
 if(value!==undefined)n.textContent=String(value);return n;
};
function notice(text,bad=false){
 ui.message.textContent=text||'';
 ui.message.classList.toggle('error',bad);
}
async function api(path,{method='GET',body,token}={}){
 const headers={};
 if(body!==undefined)headers['Content-Type']='application/json';
 if(token)headers.Authorization='Bearer '+token;
 const response=await fetch(path,{method,headers,cache:'no-store',
    body:body===undefined?undefined:JSON.stringify(body)});
 if(!response.headers.get('content-type')?.includes('application/json'))
   throw new Error('The first-party story API is not available');
 const data=await response.json();
 if(!response.ok)throw new Error(data.error||'HTTP '+response.status);
 return data;
}
function renderBase(){
 const locale=ui.locale.value;
 document.documentElement.lang=locale==='zh'?'zh-CN':locale;
 ui.offerLabel.textContent=t('offer');
 ui.introTitle.textContent=t('introTitle');
 ui.consentLabel.textContent=t('consent');
 ui.consentDetail.textContent=t('detail');
 ui.storyStatus.textContent=t('status');
 ui.start.textContent=t('start');
 ui.journalLabel.textContent=t('journal');
 ui.sidebarDisclaimer.textContent=t('sidebar');
 ui.finishTitle.textContent=t('endTitle');
 ui.finishDescription.textContent=t('end');
 ui.ctaButton.textContent=t('cta');
 ui.restart.textContent=t('restart');
 ui.ctaDisclosure.textContent=t('ctaDisclosure');
 ui.footerDisclaimer.textContent=t('noRevenue');
 ui.privacy.textContent=t('privacy');
 if(live&&story){
  ui.worldLabel.textContent=story.label;
  ui.worldGlyph.textContent=story.symbol;
  ui.heroTitle.textContent=live.headline;
  ui.creativeBody.textContent=live.body;
  ui.offer.textContent=live.offer;
  ui.storyIntro.textContent=local(story.intro,locale);
 }
 if(phase==='story')renderStory();
 if(phase==='completed')renderFinish();
}
function renderStory(){
 const locale=ui.locale.value;
 const current=story.scenes[step];
 ui.storyPanel.hidden=false;ui.preflight.hidden=true;ui.finishPanel.hidden=true;
 ui.chapterNo.textContent=t('chapter')+' '+(step+1)+' '+t('outOf')+' '+story.scenes.length;
 ui.progress.max=story.scenes.length;
 ui.progress.value=step;
 ui.chapterTitle.textContent=local(current.title,locale);
 ui.chapterPrompt.textContent=local(current.prompt,locale);
 ui.answers.replaceChildren();
 current.options.forEach((answer,i)=>{
  const button=node('button','choice');
  button.type='button';
  button.dataset.id=answer.id;
  const selected=pending===answer.id;
  button.setAttribute('aria-pressed',String(selected));
  if(selected)button.classList.add('selected');
  button.append(node('b','',String(i+1).padStart(2,'0')),node('span','',local(answer.label,locale)));
  button.addEventListener('click',()=>{
    pending=answer.id;renderStory();notice('');
  });
  ui.answers.appendChild(button);
 });
 ui.consequence.hidden=!pending;
 if(pending){
  const answer=current.options.find(x=>x.id===pending);
  ui.consequence.textContent=local(answer.after,locale);
 }
 ui.next.disabled=!pending;
 ui.next.textContent=step===story.scenes.length-1?t('finish'):t('next');
 ui.journal.replaceChildren();
 for(let i=0;i<choices.length;i++){
  const entry=choices[i],data=story.scenes[i];
  const answer=data.options.find(x=>x.id===entry.choiceId);
  const li=node('li');
  li.append(node('strong','',local(data.title,locale)),node('span','',local(answer.label,locale)));
  ui.journal.appendChild(li);
 }
}
function renderFinish(){
 const locale=ui.locale.value;
 ui.storyPanel.hidden=true;ui.preflight.hidden=true;ui.finishPanel.hidden=false;
 ui.pathSummary.replaceChildren();
 for(let i=0;i<choices.length;i++){
  const decision=choices[i],data=story.scenes[i],selected=data.options.find(x=>x.id===decision.choiceId);
  const card=node('div');
  card.append(node('span','',local(data.title,locale)),node('strong','',local(selected.label,locale)));
  ui.pathSummary.appendChild(card);
 }
}
async function recordCompletion(){
 if(!optIn||!session||completionSignaled)return;
 try{
  await api('/api/v1/launches/'+id+'/sessions/'+session.sessionId+'/complete',{
   method:'POST',token:session.sessionToken
  });
  completionSignaled=true;
 }catch{
  // Failure must never bar a non-tracked creative experience.
  notice(t('failedTrack'));
 }
}
async function begin(){
 if(phase!=='ready'||!story)return;
 const consent=ui.consentAnalytics.checked;
 ui.start.disabled=true;
 session=null;completionSignaled=false;optIn=consent;
 if(consent){
  try{
   const result=await api('/api/v1/launches/'+id+'/sessions',{
    method:'POST',body:{consent:true}
   });
   if(!result.sessionId||!result.sessionToken)throw Error('No session credential');
   session={sessionId:result.sessionId,sessionToken:result.sessionToken};
   notice(t('recorded'));
  }catch{
   session=null;optIn=false;notice(t('failedTrack'));
  }
 }else notice(t('untracked'));
 choices=[];step=0;pending=null;phase='story';renderStory();
 ui.storyPanel.scrollIntoView({behavior:'smooth',block:'start'});
}
async function advance(){
 if(phase!=='story'||!pending)return;
 const current=story.scenes[step];
 if(!current.options.some(x=>x.id===pending))return;
 choices.push({stageId:current.id,choiceId:pending});
 if(choices.length===story.scenes.length){
  pending=null;phase='completed';renderFinish();
  await recordCompletion();
  ui.finishPanel.scrollIntoView({behavior:'smooth',block:'start'});
 }else{
  step++;pending=null;renderStory();notice(t('stageDone'));
 }
}
async function requestPilot(){
 ui.ctaButton.disabled=true;
 if(optIn&&session&&completionSignaled){
  try{
   const result=await api('/api/v1/launches/'+id+'/sessions/'+session.sessionId+'/cta',{
    method:'POST',token:session.sessionToken
   });
   if(result.recorded&&result.attribution?.receipt){
    // The browser keeps this one-time proof only in this tab until a new
    // separately consented Pilot Studio form submission, never in a URL.
    try{
     sessionStorage.setItem('iv_launch_attribution',JSON.stringify({
      sessionId:result.attribution.sessionId,
      receipt:result.attribution.receipt,createdAt:Date.now()
     }));
    }catch{}
   }
  }catch{/* Ordinary contact path remains available if analytics fails. */}
 }
 window.location.assign('/pilot/');
}
ui.locale.addEventListener('change',renderBase);
ui.start.addEventListener('click',begin);
ui.next.addEventListener('click',advance);
ui.restart.addEventListener('click',()=>{
 phase='ready';session=null;optIn=false;step=0;pending=null;choices=[];completionSignaled=false;
 ui.finishPanel.hidden=true;ui.storyPanel.hidden=true;ui.preflight.hidden=false;
 ui.start.disabled=false;ui.consentAnalytics.checked=false;notice('');
 ui.preflight.scrollIntoView({behavior:'smooth',block:'start'});
});
ui.ctaButton.addEventListener('click',requestPilot);
async function boot(){
 if(!/^[a-f0-9]{24}$/.test(id)){notice(t('unknown'),true);return}
 try{
  const result=await api('/api/v1/launches/'+id);
  if(!result.creative||!IDS.includes(result.creative.venture))throw Error('Invalid first-party creative');
  live=result.creative;story=STORY[live.venture];phase='ready';
  ui.start.disabled=false;
  renderBase();
 }catch{
  phase='unavailable';
  ui.preflight.hidden=true;
  notice(t('unavailable'),true);
 }
}
renderBase();
boot();
