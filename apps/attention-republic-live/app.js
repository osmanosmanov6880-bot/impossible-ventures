const languages={
ru:{
 alpha:'ПУБЛИЧНЫЙ ПИЛОТ / НЕ ВЫБОРЫ',museumLink:'MUSEUM ↗',eyebrow:'КОМУ ПРИНАДЛЕЖИТ ВНИМАНИЕ?',
 heroA:'Внимание —',heroB:'добровольный выбор.',
 heroText:'Маленькая исследовательская республика рекламных идей. Голосуйте только после явного согласия: сервер учитывает реальные анонимные сессии, а не выдуманных людей. Без регистрации и cookies.',
 tagA:'01 БЮЛЛЕТЕНЬ НА СЕССИЮ',tagB:'00 ВЫДУМАННЫХ ГОЛОСОВ',tagC:'ЯВНОЕ СОГЛАСИЕ',
 begin:'01 / УЧАСТИЕ',eyebrowPanel:'РЕСПУБЛИКА / ЛОКАЛЬНАЯ ПЛОЩАДКА',
 chooseTitle:'Выберите открытый вопрос.',chooseHint:'На сервере отображаются только вопросы, вручную проверенные и активированные оператором. Если сервер не подключён, работает демонстрация без записи.',
 loading:'Проверяем доступные вопросы…',catalogLabel:'Открытые вопросы',consentLabel:'Условия участия',
 consentText:'Я согласен(на) на создание анонимной сессии и запись ровно одного выбора. Это не официальный опрос или выборы.',
 enter:'НАЧАТЬ УЧАСТИЕ ↗',demo:'ДЕМО БЕЗ ЗАПИСИ →',
 privacyNote:'Токен анонимной сессии живёт только в памяти вкладки. Сессии удаляются через семь дней, агрегаты — через 90. Это не защита от множества новых сессий одного человека.',
 ballotEyebrow:'РЕШЕНИЕ / ОДНА СЕССИЯ',emptyTitle:'Избирательный участок пуст.',
 emptyDesc:'Выберите вопрос и согласитесь на анонимное участие — либо откройте демо без записи голосов.',
 resultTitle:'ПОДТВЕРЖДЁННЫЕ СЕРВЕРНЫЕ ДАННЫЕ / ИЛИ ДЕМО',
 p1Title:'Право отказаться.',p1Text:'Измеряемая сессия создаётся только после явного согласия; демонстрация не записывает голос.',
 p2Title:'Только записанные события.',p2Text:'Счётчики читаются из SQLite. Они не доказывают уникальных людей, репрезентативность или честность выборов.',
 p3Title:'Вопросы под контролем.',p3Text:'Публикацию вопросов выполняет оператор, а не анонимный пользователь. Это уменьшает риск спама.',
 footerNote:'Без платёжной системы, глобального голосования и верификации личности',privacyLink:'Обработка данных ↗',
 noLive:'Нет открытых вопросов. Оператор пока ничего не опубликовал. Демо без записи доступно.',
 ready:'Сервер подключён. Доступно вопросов: ',offline:'Нет живого сервера. Доступно только локальное демо.',
 choose:'Выберите активный вопрос',sessionOpened:'Анонимная сессия создана; выбор записывается только после нажатия на вариант.',
 consentRequired:'Для измеряемого участия нужно отдельное согласие.',loadError:'Не удалось получить список вопросов.',
 voteSuccess:'Ваш выбор записан как один голос анонимной сессии.',voteFailed:'Не удалось записать голос. Он не должен учитываться как подтверждённый.',
 demoTitle:'Как должно выглядеть уважение к вниманию?',demoQuestion:'Вы бы предпочли рекламу, которая появляется по вашему запросу, или рекламу, которую всегда можно мгновенно скрыть?',
 demoA:'Появляется только по запросу',demoB:'Всегда можно сразу скрыть',demoLabel:'ЛОКАЛЬНАЯ ДЕМОНСТРАЦИЯ / БЕЗ ЗАПИСИ',
 demoDone:'В демонстрации выбор остался только в этой вкладке. Голосов и статистики на сервере не появилось.',
 liveLabel:'ИЗМЕРЯЕМАЯ СЕССИЯ',optionA:'ВАРИАНТ A',optionB:'ВАРИАНТ B',
 tallyA:'ЗАПИСАНО ЗА A',tallyB:'ЗАПИСАНО ЗА B',total:'ВСЕГО СЕССИЙ С ВЫБОРОМ',
 metricDisclaimer:'Это технические выборы анонимных сессий, не уникальные или проверенные люди.',
 done:'Сессия уже сделала выбор. Повторное голосование этим токеном невозможно.',
 cancelSession:'ОТМЕНИТЬ УЧАСТИЕ И УДАЛИТЬ СЕССИЮ ↗',revoked:'Согласие отозвано. Незавершённая сессия удалена без записи голоса.',revokeFailed:'Не удалось подтвердить удаление сессии. Повторите попытку.'
},
en:{
 alpha:'PUBLIC PILOT / NOT AN ELECTION',museumLink:'MUSEUM ↗',eyebrow:'WHO OWNS ATTENTION?',
 heroA:'Attention is',heroB:'a voluntary choice.',
 heroText:'A small research commons for advertising ideas. Choose only after opt-in: the server records actual anonymous sessions, not invented people. No account or cookies.',
 tagA:'01 BALLOT PER SESSION',tagB:'00 FABRICATED VOTES',tagC:'EXPLICIT CONSENT',
 begin:'01 / PARTICIPATE',eyebrowPanel:'REPUBLIC / RESEARCH COMMONS',
 chooseTitle:'Choose an open question.',chooseHint:'Only operator-reviewed and activated prompts appear. Without a server, an untracked local demo remains available.',
 loading:'Looking for active challenges…',catalogLabel:'Open questions',consentLabel:'Participation terms',
 consentText:'I consent to creating an anonymous session and recording exactly one choice. This is not an official poll or election.',
 enter:'START PARTICIPATION ↗',demo:'TRY UNTRACKED DEMO →',
 privacyNote:'Session token stays in this tab. Sessions expire after 7 days and aggregates after 90. This does not prevent one person from making multiple fresh sessions.',
 ballotEyebrow:'YOUR DECISION / ONE SESSION',emptyTitle:'No ballot opened yet.',
 emptyDesc:'Select an active question and consent to participate, or explore a no-tracking demo.',
 resultTitle:'RECORDED SERVER EVENTS / OR UNTRACKED DEMO',
 p1Title:'The right to refuse.',p1Text:'A measured session is created only after opt-in; the demo stores no vote.',
 p2Title:'Recorded events only.',p2Text:'Counters come from SQLite. They do not prove unique people, representative samples or election integrity.',
 p3Title:'Operator moderation.',p3Text:'Challenges are activated by an operator rather than anonymous public writers, reducing spam.',
 footerNote:'No payments, worldwide ballot system or verified identities',privacyLink:'Data handling ↗',
 noLive:'No active questions have been published by the operator. The untracked demo is available.',
 ready:'Server connected. Open questions: ',offline:'Live server unavailable. Only the local demo is available.',
 choose:'Choose an active question',sessionOpened:'Anonymous session created. The ballot is recorded only when you select an option.',
 consentRequired:'Explicit consent is required for tracked participation.',loadError:'Could not load active challenges.',
 voteSuccess:'Your choice was recorded as one anonymous-session ballot.',voteFailed:'The ballot was not recorded; do not count it as a verified event.',
 demoTitle:'What does respecting attention look like?',demoQuestion:'Would you prefer ads shown only when requested, or ads that can always be instantly dismissed?',
 demoA:'Only when requested',demoB:'Always easy to dismiss',demoLabel:'LOCAL DEMO / NO EVENTS RECORDED',
 demoDone:'This demo selection stays in your browser tab. No votes or server metrics were recorded.',
 liveLabel:'MEASURED ANONYMOUS SESSION',optionA:'OPTION A',optionB:'OPTION B',
 tallyA:'RECORDED A',tallyB:'RECORDED B',total:'BALLOT SESSIONS',
 metricDisclaimer:'These are anonymous session ballots, not verified distinct humans.',
 done:'This session already cast its one ballot.',
 cancelSession:'CANCEL AND DELETE UNVOTED SESSION ↗',revoked:'Consent withdrawn. The unvoted session was deleted without recording a ballot.',revokeFailed:'Session deletion was not confirmed. Try again.'
},
zh:{
 alpha:'公开试点 / 并非选举',museumLink:'MUSEUM ↗',eyebrow:'注意力属于谁？',
 heroA:'注意力是',heroB:'自愿的选择。',
 heroText:'这是一个关于广告创意的小型研究社区。只有明确同意后才计数：服务器记录真实匿名会话，而不是虚构的人。无需账户或 Cookie。',
 tagA:'每会话 01 票',tagB:'00 份虚构票数',tagC:'明确同意',
 begin:'01 / 参与',eyebrowPanel:'社区 / 研究广场',
 chooseTitle:'选择开放问题。',chooseHint:'只有管理员审核并激活的问题才会显示。没有服务器时可使用不记录数据的本地演示。',
 loading:'正在加载问题…',catalogLabel:'开放问题',consentLabel:'参与条件',
 consentText:'我同意创建匿名会话并记录一次选择。这不是官方民调或选举。',
 enter:'开始参与 ↗',demo:'查看不记录的演示 →',
 privacyNote:'匿名会话令牌只留在当前标签页。会话保留 7 天，聚合结果保留 90 天。这无法防止同一人创建多个新会话。',
 ballotEyebrow:'你的决定 / 一个会话',emptyTitle:'投票尚未开始。',
 emptyDesc:'选择开放问题并同意参与，或打开不会记录事件的演示。',
 resultTitle:'服务器真实记录 / 或不记录的演示',
 p1Title:'拒绝的权利。',p1Text:'只有同意后才创建测量会话；演示不写入投票。',
 p2Title:'只统计实际记录。',p2Text:'计数来自 SQLite，不代表独立用户、代表性样本或选举公正。',
 p3Title:'管理员审核。',p3Text:'问题由管理员激活，不接受匿名用户直接发布，以降低垃圾信息风险。',
 footerNote:'无支付系统、全球选举或身份验证',privacyLink:'数据处理说明 ↗',
 noLive:'管理员尚未发布开放问题，但可体验不记录的演示。',
 ready:'服务器已连接。开放问题数量：',offline:'服务器不可用，只能体验本地演示。',
 choose:'选择开放问题',sessionOpened:'已创建匿名会话，选择选项后才会记录。',
 consentRequired:'被记录的参与需要明确同意。',loadError:'无法加载问题。',
 voteSuccess:'你的选择已记录为一份匿名会话选票。',voteFailed:'未能记录选择，请勿计入已验证结果。',
 demoTitle:'尊重注意力意味着什么？',demoQuestion:'你更希望广告仅在主动请求时出现，还是始终可以立即关闭？',
 demoA:'仅在主动请求时出现',demoB:'始终可以立即关闭',demoLabel:'本地演示 / 不记录事件',
 demoDone:'此次演示选择仅保存在当前标签页，不会向服务器写入投票或统计。',
 liveLabel:'匿名测量会话',optionA:'选项 A',optionB:'选项 B',
 tallyA:'已记录 A',tallyB:'已记录 B',total:'已投票会话总数',
 metricDisclaimer:'这些是匿名会话选票，不是经验证的独立真人。',
 done:'该会话已投过一次，无法重复投票。',
 cancelSession:'取消参与并删除未投票会话 ↗',revoked:'已撤回同意。未投票的会话已删除，没有记录选票。',revokeFailed:'无法确认删除会话，请重试。'
}
};
let locale='ru',challenges=[],active=null,session=null,mode=null,voted=false,lastCounts=null,busy=false,choiceMade=null;
const el=id=>document.getElementById(id);
const t=k=>languages[locale][k]??languages.en[k]??k;
function node(tag,cls,val){const x=document.createElement(tag);if(cls)x.className=cls;if(val!==undefined)x.textContent=String(val);return x;}
function setMessage(key,id){el(id).textContent=t(key);}
function translate(){
 document.documentElement.lang=locale==='zh'?'zh-CN':locale;
 el('locale').value=locale;
 for(const n of document.querySelectorAll('[data-i18n]'))n.textContent=t(n.dataset.i18n);
 if(mode)renderBallot();
 if(challenges.length)updateCatalog();
}
function updateControls(){
 el('startVote').disabled=busy||!el('consent').checked||!challenges.length||mode==='live';
 el('demo').disabled=busy||(mode==='live'&&session!==null);
}
function updateCatalog(){
 const select=el('challenge');const selected=select.value;
 select.replaceChildren();
 for(const c of challenges){
   const option=node('option','',c.title);option.value=c.id;select.append(option);
 }
 if(!challenges.length){
   const option=node('option','',t('choose'));option.value='';select.append(option);
 }
 select.disabled=!challenges.length||mode==='live';
 if(challenges.some(x=>x.id===selected))select.value=selected;
 updateControls();
}
async function loadCatalog(){
 if(document.body.dataset.staticPreview==='true'){
   challenges=[];
   el('connection').textContent=t('offline');
   updateCatalog();
   return;
 }
 try{
   const res=await fetch('/api/v1/republic/challenges',{cache:'no-store'});
   if(!res.ok)throw new Error('No API');
   const data=await res.json();
   challenges=Array.isArray(data.items)?data.items:[];
   el('connection').textContent=challenges.length?t('ready')+challenges.length:t('noLive');
 }catch{
   challenges=[];
   el('connection').textContent=t('offline');
 }
 updateCatalog();
}
function demoQuestion(){
 return {id:'local-demo',title:t('demoTitle'),question:t('demoQuestion'),
   choices:{a:t('demoA'),b:t('demoB')},locale,counts:null};
}
function renderBallot(){
 el('empty').hidden=true;el('ballot').hidden=false;
 const c=mode==='demo'?demoQuestion():active;
 if(!c)return;
 el('ballotMode').textContent=t(mode==='demo'?'demoLabel':'liveLabel');
 el('ballotLocale').textContent=(c.locale||locale).toUpperCase();
 el('ballotTitle').textContent=c.title;
 el('ballotQuestion').textContent=c.question;
 const area=el('ballotOptions');area.replaceChildren();
 for(const choice of ['a','b']){
   const btn=node('button','button ghost wide',t(choice==='a'?'optionA':'optionB')+' / '+c.choices[choice]);
   btn.type='button';btn.dataset.ballotChoice=choice;btn.disabled=busy||voted;
   area.append(btn);
 }
 el('cancelSession').hidden=!(mode==='live'&&session!==null&&!voted);
 el('cancelSession').disabled=busy;
 const result=el('ballotResult');result.hidden=!voted;
 if(voted){
   el('outcomeHeading').textContent=mode==='demo'?t('demoLabel'):t('voteSuccess');
   el('outcomeNote').textContent=t(mode==='demo'?'demoDone':'metricDisclaimer');
   const metrics=el('countMetrics');metrics.replaceChildren();
   if(mode==='live'&&lastCounts){
     for(const [key,value] of [['tallyA',lastCounts.a],['tallyB',lastCounts.b],['total',lastCounts.total]]){
       const metric=node('div','metric');
       metric.append(node('span','',t(key)),node('strong','',value));
       metrics.append(metric);
     }
   }
 }
}
el('consent').addEventListener('change',updateControls);
el('demo').addEventListener('click',()=>{
 mode='demo';active=null;session=null;voted=false;lastCounts=null;choiceMade=null;
 el('startStatus').textContent=t('demoLabel');el('ballotStatus').textContent='';
 renderBallot();
});
el('startVote').addEventListener('click',async()=>{
 if(busy||mode==='live')return;
 if(!el('consent').checked){setMessage('consentRequired','startStatus');return;}
 const id=el('challenge').value;
 const challenge=challenges.find(x=>x.id===id);
 if(!challenge)return;
 busy=true;updateControls();
 try{
  const response=await fetch('/api/v1/republic/challenges/'+id+'/sessions',{
   method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({consent:true})
  });
  const data=await response.json();
  if(!response.ok||!data.token||!data.sessionId)throw new Error('Session unavailable');
  session={id:data.sessionId,token:data.token};
  mode='live';active=challenge;voted=false;lastCounts=null;choiceMade=null;
  setMessage('sessionOpened','startStatus');el('ballotStatus').textContent='';
 }catch{setMessage('loadError','startStatus');}
 finally{busy=false;updateControls();if(mode)renderBallot();}
});
el('cancelSession').addEventListener('click',async()=>{
 if(mode!=='live'||!active||!session||busy||voted)return;
 busy=true;updateControls();renderBallot();
 try{
   const reply=await fetch('/api/v1/republic/challenges/'+active.id+'/sessions/'+session.id,{
     method:'DELETE',headers:{Authorization:'Bearer '+session.token}
   });
   const data=await reply.json();
   if(!reply.ok||data.revoked!==true||data.ballotRecorded!==false)throw Error('Not revoked');
   session=null;mode=null;active=null;voted=false;lastCounts=null;choiceMade=null;
   el('consent').checked=false;
   el('ballot').hidden=true;el('empty').hidden=false;
   setMessage('revoked','startStatus');
 }catch{setMessage('revokeFailed','ballotStatus');}
 finally{busy=false;updateControls();if(mode)renderBallot();}
});
el('ballotOptions').addEventListener('click',async e=>{
 const button=e.target.closest('[data-ballot-choice]');
 if(!button||busy||voted)return;
 const choice=button.dataset.ballotChoice;
 if(mode==='demo'){
  voted=true;choiceMade=choice;renderBallot();setMessage('demoDone','ballotStatus');return;
 }
 if(!session||!active)return;
 busy=true;renderBallot();
 try{
   const response=await fetch('/api/v1/republic/challenges/'+active.id+'/votes',{
    method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+session.token},
    body:JSON.stringify({sessionId:session.id,choice})
   });
   const data=await response.json();
   if(!response.ok||data.recorded!==true)throw new Error('Not recorded');
   voted=true;choiceMade=choice;lastCounts=data.counts;
   // Immediately destroy the raw token after the one successful ballot.
   session=null;
   setMessage('voteSuccess','ballotStatus');
 }catch{setMessage('voteFailed','ballotStatus');}
 finally{busy=false;renderBallot();}
});
el('locale').addEventListener('change',()=>{
 locale=Object.hasOwn(languages,el('locale').value)?el('locale').value:'ru';
 translate();
});
const q=new URLSearchParams(location.search).get('lang');
locale=Object.hasOwn(languages,q)?q:'ru';
translate();loadCatalog();
