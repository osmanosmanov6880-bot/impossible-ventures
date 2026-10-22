const dict={
ru:{
 alpha:'ОПЕРАТОР / ТОЛЬКО РЕАЛЬНЫЕ ДАННЫЕ',return:'ПУБЛИЧНЫЙ САЙТ ↗',overline:'ОРГАНИЗАЦИЯ ВОПРОСОВ / БЕЗ ПОДДЕЛЬНЫХ ГОЛОСОВ',
 h1a:'Республика',h1b:'под контролем.',intro:'Создавайте вопросы, проверяйте формулировки, открывайте и закрывайте голосование. Сервер учитывает только реальные анонимные сессии с согласием — не уникальных граждан.',
 authLabel:'01 / ДОСТУП ОПЕРАТОРА',authTitle:'Контроль публикации.',authNote:'Используйте секрет OPERATOR_TOKEN из переменных сервера. Он никогда не сохраняется в localStorage и не показывается посетителям.',
 tokenLabel:'Ключ оператора',tokenHint:'OPERATOR_TOKEN',login:'ОТКРЫТЬ КАБИНЕТ ↗',logout:'ВЫЙТИ ↗',
 newTitle:'02 / СОЗДАТЬ ВОПРОС',titleLabel:'Название дискуссии',titleHint:'Свобода выбора внимания',
 questionLabel:'Вопрос',questionHint:'Какой формат рекламы вы предпочитаете?',
 choiceALabel:'Вариант A',choiceAHint:'Только по запросу',choiceBLabel:'Вариант B',choiceBHint:'Всегда можно закрыть',questionLocale:'Язык текста вопроса',
 reviewNotice:'Проверяйте вопросы до публикации. Публичные пользователи не могут создавать темы напрямую.',
 create:'СОХРАНИТЬ ЧЕРНОВИК ↗',
 overviewLabel:'03 / ФАКТИЧЕСКИЕ ДАННЫЕ',overviewTitle:'Модерация голосований.',overviewHint:'Статусы активируются вручную. Счётчики обозначают анонимные технические сессии, а не подтверждённых людей.',
 locked:'Кабинет закрыт.',lockedText:'Войдите с ключом оператора, чтобы увидеть реальные сохранённые вопросы.',refresh:'ОБНОВИТЬ ↻',
 footerText:'Общие токены и IP-лимиты не заменяют корпоративную авторизацию',privacy:'Обработка данных ↗',
 draft:'ЧЕРНОВИК',active:'ОТКРЫТ',paused:'ПАУЗА',closed:'ЗАКРЫТ',
 activate:'ОПУБЛИКОВАТЬ ↗',pause:'ПРИОСТАНОВИТЬ',close:'ЗАКРЫТЬ',resume:'ВОЗОБНОВИТЬ',
 sessions:'ЗАПИСАННЫХ ГОЛОСОВ',created:'Черновик создан на сервере.',loginOK:'Ключ принят. Показаны реальные вопросы.',
 loggedOut:'Вы вышли. Ключ удалён из памяти страницы.',noChallenges:'Пока нет вопросов на этом сервере.',
 failed:'Операция не выполнена. Проверьте разрешения и сервер.',authFailed:'Неверный ключ или доступ не настроен.'
},
en:{
 alpha:'OPERATOR / REAL DATA ONLY',return:'PUBLIC SITE ↗',overline:'CURATE QUESTIONS / NO FAKE VOTES',
 h1a:'Republic',h1b:'under control.',intro:'Create prompts, review wording, open and close ballots. The server only counts consented anonymous sessions, never verified unique citizens.',
 authLabel:'01 / OPERATOR ACCESS',authTitle:'Control publication.',authNote:'Use the OPERATOR_TOKEN secret from server environment. It is never persisted in localStorage or shown to visitors.',
 tokenLabel:'Operator token',tokenHint:'OPERATOR_TOKEN',login:'OPEN OPERATOR DESK ↗',logout:'LOG OUT ↗',
 newTitle:'02 / CREATE QUESTION',titleLabel:'Discussion title',titleHint:'The right to choose attention',
 questionLabel:'Question',questionHint:'Which kind of advertising do you prefer?',
 choiceALabel:'Choice A',choiceAHint:'Only on request',choiceBLabel:'Choice B',choiceBHint:'Always dismissible',questionLocale:'Question text language',
 reviewNotice:'Review questions before activation. Visitors cannot publish topics directly.',
 create:'SAVE DRAFT ↗',
 overviewLabel:'03 / RECORDED EVENTS',overviewTitle:'Moderate the ballots.',overviewHint:'Operators manually activate status. Counters measure anonymous sessions, not verified unique people.',
 locked:'Operator desk locked.',lockedText:'Use your operator token to see real saved questions.',refresh:'REFRESH ↻',
 footerText:'Shared secrets and IP limits are not enterprise identity protection',privacy:'Data handling ↗',
 draft:'DRAFT',active:'ACTIVE',paused:'PAUSED',closed:'CLOSED',
 activate:'ACTIVATE ↗',pause:'PAUSE',close:'CLOSE',resume:'RESUME',
 sessions:'RECORDED SESSION BALLOTS',created:'Draft saved on the server.',loginOK:'Token accepted. Showing real challenges.',
 loggedOut:'Signed out. Operator token cleared from page memory.',noChallenges:'No challenges have been created on this server.',
 failed:'Action failed. Check service and permissions.',authFailed:'Invalid token or operator access not configured.'
},
zh:{
 alpha:'管理员 / 仅真实数据',return:'公开网站 ↗',overline:'审核问题 / 不虚构票数',
 h1a:'让研究社区',h1b:'保持可控。',intro:'创建问题、审核措辞、开启和关闭投票。服务器只计数明确同意的匿名会话，不代表经验证的独立公民。',
 authLabel:'01 / 管理员权限',authTitle:'控制发布。',authNote:'使用服务器环境中的 OPERATOR_TOKEN。令牌不会保存到 localStorage，也不展示给访客。',
 tokenLabel:'管理员令牌',tokenHint:'OPERATOR_TOKEN',login:'打开管理页面 ↗',logout:'退出 ↗',
 newTitle:'02 / 创建问题',titleLabel:'讨论标题',titleHint:'注意力选择权',
 questionLabel:'问题',questionHint:'你更希望哪种广告？',
 choiceALabel:'选项 A',choiceAHint:'仅在请求时出现',choiceBLabel:'选项 B',choiceBHint:'始终可关闭',questionLocale:'问题文本语言',
 reviewNotice:'请在公开之前审核问题。访客不能直接发布话题。',
 create:'保存草稿 ↗',
 overviewLabel:'03 / 实际记录',overviewTitle:'审核投票。',overviewHint:'管理员手动激活状态。计数代表匿名会话，不代表经验证的独立真人。',
 locked:'管理页面已锁定。',lockedText:'请输入管理员令牌查看真实保存的问题。',refresh:'刷新 ↻',
 footerText:'共享密钥和 IP 限速无法代替企业级身份验证',privacy:'数据处理说明 ↗',
 draft:'草稿',active:'开放',paused:'暂停',closed:'结束',
 activate:'发布 ↗',pause:'暂停',close:'结束',resume:'恢复',
 sessions:'已记录会话选票',created:'草稿已保存在服务器。',loginOK:'令牌有效，已显示真实问题。',
 loggedOut:'已退出，令牌已从此页面内存清除。',noChallenges:'服务器中尚无问题。',
 failed:'操作失败，请检查服务器和权限。',authFailed:'令牌无效或服务器未配置管理员权限。'
}
};
const el=id=>document.getElementById(id);
const node=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=String(txt);return n;};
let locale='ru',token='',epoch=0,items=[],loggedIn=false;
const t=k=>dict[locale][k]??dict.en[k]??k;
function translate(){
 document.documentElement.lang=locale==='zh'?'zh-CN':locale;el('locale').value=locale;
 for(const n of document.querySelectorAll('[data-i18n]'))n.textContent=t(n.dataset.i18n);
 for(const n of document.querySelectorAll('[data-placeholder]'))n.placeholder=t(n.dataset.placeholder);
 if(loggedIn)render();
}
async function api(path,method='GET',data){
 const res=await fetch(path,{
  method,cache:'no-store',headers:{
   Authorization:'Bearer '+token,
   ...(data===undefined?{}:{'Content-Type':'application/json'})
  },body:data===undefined?undefined:JSON.stringify(data)
 });
 let body={};try{body=await res.json()}catch{}
 if(!res.ok)throw new Error(body.error||t('failed'));
 return body;
}
function signOut(){
 epoch++;token='';loggedIn=false;items=[];
 el('operatorToken').value='';el('challengeForm').hidden=true;
 el('operatorPanel').hidden=true;el('empty').hidden=false;el('logout').disabled=true;
 el('challengeList').replaceChildren();el('loginStatus').textContent=t('loggedOut');
}
function render(){
 const target=el('challengeList');target.replaceChildren();
 if(!items.length){target.append(node('p','panel-description',t('noChallenges')));return;}
 for(const item of items){
  const card=node('article','card');
  const top=node('div','card-top',item.id+' / '+t(item.status));
  const title=node('h3','',item.title);
  const question=node('p','quote',item.question);
  const choices=node('p','',item.choices.a+'  /  '+item.choices.b);
  const numbers=node('p','',t('sessions')+': '+item.counts.total+' (A: '+item.counts.a+' / B: '+item.counts.b+')');
  const row=node('div','button-row');
  const transitions=item.status==='draft'?['active','closed']:item.status==='active'?['paused','closed']:item.status==='paused'?['active','closed']:[];
  for(const status of transitions){
   const btn=node('button','button small ghost',t(status==='active'?(item.status==='paused'?'resume':'activate'):status==='paused'?'pause':'close'));
   btn.type='button';btn.dataset.challengeId=item.id;btn.dataset.status=status;
   row.append(btn);
  }
  card.append(top,title,question,choices,numbers,row);target.append(card);
 }
}
async function load(){
 const current=epoch;
 if(!token)return;
 const result=await api('/api/v1/operator/republic/challenges');
 if(epoch!==current||!token)return;
 items=result.items||[];loggedIn=true;
 el('challengeForm').hidden=false;el('operatorPanel').hidden=false;
 el('empty').hidden=true;el('logout').disabled=false;
 render();
}
el('operatorLogin').addEventListener('submit',async e=>{
 e.preventDefault();if(!e.target.reportValidity())return;
 token=el('operatorToken').value;el('operatorToken').value='';
 epoch++;
 try{await load();el('loginStatus').textContent=t('loginOK');}
 catch{signOut();el('loginStatus').textContent=t('authFailed');}
});
el('challengeForm').addEventListener('submit',async e=>{
 e.preventDefault();if(!e.target.reportValidity()||!loggedIn)return;
 try{
   await api('/api/v1/operator/republic/challenges','POST',{
    title:el('challengeTitle').value,question:el('question').value,
    choiceA:el('choiceA').value,choiceB:el('choiceB').value,locale:el('questionLocale').value
   });
   el('createStatus').textContent=t('created');
   el('question').value='';el('challengeTitle').value='';
   el('choiceA').value='';el('choiceB').value='';
   await load();
 }catch{el('createStatus').textContent=t('failed')}
});
el('challengeList').addEventListener('click',async e=>{
 const btn=e.target.closest('[data-challenge-id]');
 if(!btn||!token)return;
 btn.disabled=true;
 try{
   await api('/api/v1/operator/republic/challenges/'+btn.dataset.challengeId+'/status','POST',{status:btn.dataset.status});
   await load();
 }catch{el('loginStatus').textContent=t('failed')}
 finally{btn.disabled=false}
});
el('refresh').addEventListener('click',()=>load().catch(()=>{el('loginStatus').textContent=t('failed')}));
el('logout').addEventListener('click',signOut);
el('locale').addEventListener('change',()=>{locale=Object.hasOwn(dict,el('locale').value)?el('locale').value:'ru';translate();});
const q=new URLSearchParams(location.search).get('lang');
locale=Object.hasOwn(dict,q)?q:'ru';translate();
