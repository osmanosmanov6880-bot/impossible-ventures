import {openChallenge,assessDefense,PERSONAS,VERSION} from './engine.mjs';
const text={
 ru:{
  alpha:'РУЧНОЙ СПОР / ИССЛЕДОВАТЕЛЬСКАЯ ВЕРСИЯ',appealLink:'APPEAL 2049 ↗',kicker:'НЕ СОГЛАШАТЬСЯ. ВОПРОШАТЬ. УСИЛИВАТЬ.',
  headFirst:'Хорошие идеи',headSecond:'выдержат спор.',
  subtitle:'Проверьте рекламную концепцию глазами скептика, финансового директора, занятого человека или сторонника доступности. Получите реальные вопросы, а не автоматическое одобрение.',
  tagA:'04 ТИПА ОППОНЕНТОВ',tagB:'03 ВОЗРАЖЕНИЯ',tagC:'00 ВНЕШНИХ AI-ЗАПРОСОВ',
  stage:'01 / ОТКРОЙТЕ СПОР',briefHeading:'Что будем оспаривать?',
  briefHint:'Введите настоящую рекламную гипотезу. ИИ здесь нет — вопросы формируются по прозрачным редакторским правилам.',
  brand:'Продукт или бренд',brandPlaceholder:'Aurora Studio',audience:'Целевая аудитория',audiencePlaceholder:'Независимые дизайнеры',
  idea:'Ваша рекламная идея',ideaPlaceholder:'Наш сервис упрощает согласование макетов…',
  opponent:'Кто будет спорить?',skeptic:'Недоверчивый клиент',finance:'Финансовый директор',impatient:'Человек без времени',inclusion:'Защитник доступности',
  pressure:'Напряжение',focused:'Конструктивно',intense:'Максимум вопросов',
  privacy:'Текст остаётся в памяти этой вкладки. Вы можете выгрузить результат вручную; сервер не получает вашу идею.',
  disclaimer:'Это редакторский тренажёр, а не AI и не рыночный прогноз.',start:'ОТКРЫТЬ ДЕБАТЫ ↗',
  resultHeader:'ОППОНЕНТ / ОТКРЫТОЕ ЗАСЕДАНИЕ',emptyHeading:'Пока никто не спорит.',
  emptyBody:'После отправки идеи появятся три неудобных вопроса и возможность ответить на один из них.',
  resultsTitle:'Три вопроса без компромиссов.',defenseLabel:'ВАША ОЧЕРЕДЬ / ОТВЕТИТЬ НА ОДИН ВОПРОС',
  which:'Какой вопрос выбираете?',answer:'Ваша защита идеи',defensePlaceholder:'Какой конкретный факт или тест снимет сомнение?',
  defend:'ПРОВЕРИТЬ ЗАЩИТУ ↗',revision:'РЕДАКТОРСКАЯ ОБРАТНАЯ СВЯЗЬ',notProof:'Даже сильная защита — это структура аргумента, а не независимое подтверждение.',
  download:'СКАЧАТЬ ДЕБАТЫ .JSON ↓',theatreLink:'BRIEF THEATRE ↗',
  p1Heading:'Оппонент с точкой зрения.',p1Text:'У каждого персонажа — собственный набор возражений: вера, цена, время или доступность.',
  p2Heading:'Факты остаются вашей работой.',p2Text:'Система не изображает реальных покупателей и не проверяет рекламные утверждения.',
  p3Heading:'Следующая версия сильнее.',p3Text:'Используйте вопросы, чтобы улучшить черновик и проверить его на настоящей аудитории.',
  footerText:'Нет регистрации, платного API и скрытого сохранения идей',footerLink:'Данные и приватность ↗',
  question:{
   claim:'Почему я должен верить этому обещанию, если вижу только рекламный текст?',proof:'Какие независимые документы или демонстрация подтверждают главный результат?',trust:'Что произойдёт, если продукт не выполнит обещание?',
   roi:'Какой результат компания получит за свои деньги и как его измерить?',cost:'Какова полная цена, включая время команды, настройку и скрытые издержки?',measurement:'Что считаем успехом: заявки, качество контактов или реально оплаченные заказы?',
   clarity:'Что вы предлагаете, если у меня всего пять секунд?',time:'Зачем мне тратить время на переход по вашей ссылке?',action:'Какое одно конкретное действие мне нужно сделать прямо сейчас?',
   access:'Поймёт ли предложение человек с особыми потребностями или слабым интернетом?',assumption:'Какие слова или образы могут исключать часть аудитории?'
  },
  severe:'Какие факты смогли бы опровергнуть это утверждение?',reviewLabel:'ВОЗРАЖЕНИЕ',
  riskGuarantee:'Проверить формулировку о гарантии: доказательство отсутствует.',riskSuperlative:'Нужно доказать превосходство «лучший / №1».',
  riskUrgency:'Уточните, настоящая ли срочность или дефицит.',human:'Все утверждения требуют человеческой проверки.',
  resultWeak:'Нужны конкретные доказательства и способ проверки.',resultBetter:'Аргумент структурирован, но источник фактов всё ещё не проверен.',
  scoreLabel:'СИГНАЛЫ СТРУКТУРЫ АРГУМЕНТА',saved:'Дебаты выгружены локально.',error:'Проверьте заполнение всех обязательных полей.',
  defenseError:'Выберите возражение и дайте ответ длиной не менее 12 символов.'
 },
 en:{
  alpha:'EDITORIAL RESEARCH / PROTOTYPE',appealLink:'APPEAL 2049 ↗',kicker:'DISAGREE. QUESTION. STRENGTHEN.',
  headFirst:'Great ideas',headSecond:'survive debate.',
  subtitle:'View your creative concept through a skeptic, finance director, time-poor customer or accessibility advocate. Get useful objections — not automatic praise.',
  tagA:'04 ADVERSARIES',tagB:'03 OBJECTIONS',tagC:'00 EXTERNAL AI CALLS',
  stage:'01 / OPEN A DEBATE',briefHeading:'Which idea should we challenge?',
  briefHint:'Enter a real campaign hypothesis. This version is rule-based; no external AI makes these arguments.',
  brand:'Product or brand',brandPlaceholder:'Aurora Studio',audience:'Target audience',audiencePlaceholder:'Independent designers',
  idea:'Campaign idea',ideaPlaceholder:'Our product simplifies creative reviews…',
  opponent:'Choose your critic',skeptic:'Skeptical customer',finance:'Finance director',impatient:'Time-poor customer',inclusion:'Accessibility advocate',
  pressure:'Challenge intensity',focused:'Focused',intense:'Demanding',
  privacy:'Content lives only in this tab. You may export it manually; your idea is never sent to our API.',
  disclaimer:'An editorial exercise, not live AI or a market forecast.',start:'OPEN THE DEBATE ↗',
  resultHeader:'ADVERSARY / HEARING IN SESSION',emptyHeading:'No debate started yet.',
  emptyBody:'Submit an idea to receive three uncomfortable questions and a chance to defend one.',
  resultsTitle:'Three questions without compromise.',defenseLabel:'YOUR TURN / DEFEND ONE QUESTION',
  which:'Choose a question',answer:'Your response',defensePlaceholder:'Which concrete fact or test would address this objection?',
  defend:'CHALLENGE MY DEFENSE ↗',revision:'EDITORIAL FEEDBACK',notProof:'Even a well-structured defense does not independently verify its facts.',
  download:'EXPORT DEBATE .JSON ↓',theatreLink:'BRIEF THEATRE ↗',
  p1Heading:'A critic with a perspective.',p1Text:'Each opponent tests trust, spending, attention or inclusion.',
  p2Heading:'Facts are your responsibility.',p2Text:'The system does not portray actual buyers or independently check your advertising claims.',
  p3Heading:'Evolve the idea.',p3Text:'Use the objections to improve your draft and test it with real audiences.',
  footerText:'No registration, paid model call or hidden campaign storage',footerLink:'Data and privacy ↗',
  question:{
   claim:'Why should I believe this promise when all I see is advertising copy?',proof:'Which independent documents or demos support your main claim?',trust:'What happens if the product does not deliver?',
   roi:'Which measurable business outcome justifies the spending?',cost:'What is the full cost, including setup time and hidden overhead?',measurement:'Is success defined as clicks, qualified leads or actual orders?',
   clarity:'What are you offering if I only have five seconds?',time:'Why should I spend my time clicking your link?',action:'What is one specific action you want me to take now?',
   access:'Could someone with accessibility needs or slow connectivity understand and use this?',assumption:'Which words or imagery might exclude part of your audience?'
  },
  severe:'What evidence could falsify the claim?',reviewLabel:'OBJECTION',
  riskGuarantee:'Verify any guarantee language; no proof has been independently reviewed.',
  riskSuperlative:'Back up "best / #1" with an appropriate comparison.',
  riskUrgency:'Check whether urgency or scarcity is genuinely applicable.',
  human:'A human must verify all claims.',resultWeak:'Add concrete supporting evidence and a testable next step.',
  resultBetter:'The argument has some structure, but its evidence is still unverified.',
  scoreLabel:'ARGUMENT STRUCTURE SIGNALS',saved:'Debate exported locally.',
  error:'Check all required input fields.',defenseError:'Choose an objection and enter a response of at least 12 characters.'
 },
 zh:{
  alpha:'编辑研究 / 测试原型',appealLink:'APPEAL 2049 ↗',kicker:'提出异议。深入追问。完善创意。',
  headFirst:'好创意',headSecond:'经得起质疑。',
  subtitle:'从怀疑者、财务负责人、忙碌客户或无障碍倡导者的角度审视广告概念，得到真正有用的问题，而不是自动赞同。',
  tagA:'04 类质疑者',tagB:'03 项异议',tagC:'00 次外部 AI 请求',
  stage:'01 / 开始辩论',briefHeading:'应该质疑哪项创意？',
  briefHint:'输入真实的营销假设。当前版本按明确规则提出问题，不调用外部 AI。',
  brand:'产品或品牌',brandPlaceholder:'Aurora Studio',audience:'目标受众',audiencePlaceholder:'自由设计师',
  idea:'广告创意',ideaPlaceholder:'我们的产品让设计审核更简单…',
  opponent:'选择反对者',skeptic:'持怀疑态度的客户',finance:'财务负责人',impatient:'忙碌的客户',inclusion:'无障碍倡导者',
  pressure:'质疑强度',focused:'聚焦问题',intense:'深入追问',
  privacy:'内容仅保存在当前浏览器标签页。您可主动导出，创意不会发送到我们的 API。',
  disclaimer:'编辑练习，不是真实 AI 或市场预测。',start:'开始辩论 ↗',
  resultHeader:'反对者 / 审查开始',emptyHeading:'辩论尚未开始。',
  emptyBody:'输入创意后，会出现三个尖锐问题，并可以选择其中一个回应。',
  resultsTitle:'三个不回避的问题。',defenseLabel:'轮到你 / 回答一个问题',
  which:'选择问题',answer:'你的回应',defensePlaceholder:'哪些具体事实或测试能解答质疑？',
  defend:'检验回答 ↗',revision:'编辑反馈',notProof:'即使论证结构完善，也不意味着事实已经获得独立验证。',
  download:'导出辩论 .JSON ↓',theatreLink:'BRIEF THEATRE ↗',
  p1Heading:'每个对手都有立场。',p1Text:'不同角色关注信任、成本、注意力或包容性。',
  p2Heading:'事实仍需人工核实。',p2Text:'系统不代表真实顾客，也不会独立确认广告声明。',
  p3Heading:'迭代创意。',p3Text:'利用异议改善草案，再与真实受众检验。',
  footerText:'无需注册、付费 AI 或隐藏存储',footerLink:'数据与隐私 ↗',
  question:{
   claim:'如果只看到广告文案，我为什么应该相信这个承诺？',proof:'哪些独立资料或演示可以证明主要主张？',trust:'如果产品未兑现承诺会怎样？',
   roi:'怎样衡量花费对应的实际商业成果？',cost:'包含安装时间和隐性成本在内的全部费用是多少？',measurement:'成功的定义是点击、合格线索，还是付费订单？',
   clarity:'如果我只有五秒钟，你要表达什么？',time:'我为什么值得花时间点击？',action:'你希望我现在完成哪一项具体行动？',
   access:'网络较慢或有无障碍需求的用户能否理解并使用？',assumption:'哪些用语或图像可能将部分受众排除在外？'
  },
  severe:'哪些证据可以推翻这一主张？',reviewLabel:'异议',
  riskGuarantee:'请核实任何保证性表述，目前证据尚未通过独立审查。',
  riskSuperlative:'请提供“最佳 / 第一”的合理对比证据。',riskUrgency:'确认紧迫性或稀缺条件是否真实。',
  human:'所有主张均需人工核实。',resultWeak:'补充具体证据和可验证的下一步。',
  resultBetter:'论证有一定结构，但事实仍未经核实。',
  scoreLabel:'论证结构信号',saved:'辩论已导出到本地。',
  error:'请检查所有必填字段。',defenseError:'请选择一个问题并输入至少 12 个字符的回应。'
 }
};
const locale= document.getElementById('locale');
const form=document.getElementById('briefForm');
const defenseForm=document.getElementById('defenseForm');
const el=id=>document.getElementById(id);
let language='ru';
let debate=null;
let defense=null;
function t(k){return text[language][k]??text.en[k]??k}
function create(tag,className,txt){
 const n=document.createElement(tag);if(className)n.className=className;
 if(txt!==undefined)n.textContent=String(txt);
 return n;
}
function localize(){
 document.documentElement.lang=language==='zh'?'zh-CN':language;
 locale.value=language;
 for(const n of document.querySelectorAll('[data-i18n]'))n.textContent=t(n.dataset.i18n);
 for(const n of document.querySelectorAll('[data-placeholder]'))n.placeholder=t(n.dataset.placeholder);
 if(debate)render();
}
function render(){
 if(!debate)return;
 el('empty').hidden=true;
 el('results').hidden=false;
 const target=el('challengeList');target.replaceChildren();
 const selector=el('chosenChallenge');selector.replaceChildren();
 for(const challenge of debate.challenges){
   const card=create('article','card');
   const top=create('div','card-top',t('reviewLabel')+' 0'+challenge.sequence+' / '+t(debate.brief.persona));
   const title=create('h3','',t('question')[challenge.id]);
   card.append(top,title);
   if(debate.brief.pressure==='intense')card.append(create('p','card-note',t('severe')));
   target.append(card);
   const option=create('option','',String(challenge.sequence).padStart(2,'0')+' / '+t('question')[challenge.id]);
   option.value=challenge.id;selector.append(option);
 }
 if(defense){
   selector.value=defense.challenge;
   el('defenseResult').hidden=false;
   el('responseRating').textContent=t('scoreLabel')+' · '+defense.readiness+' / '+defense.maximum;
   el('responseAdvice').textContent=t(defense.readiness<2?'resultWeak':'resultBetter');
 }else el('defenseResult').hidden=true;
}
function triggerDownload(obj,file){
 const url=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:'application/json;charset=utf-8'}));
 const a=create('a');a.href=url;a.download=file;document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
 el('exportStatus').textContent=t('saved');
}
form.addEventListener('submit',event=>{
 event.preventDefault();el('formStatus').textContent='';
 if(!form.reportValidity())return;
 try{
   debate=openChallenge({
     brand:el('brand').value,audience:el('audience').value,idea:el('idea').value,
     persona:el('persona').value,pressure:el('pressure').value
   });
   defense=null;el('defense').value='';el('exportStatus').textContent='';
   render();el('results').scrollIntoView({behavior:'smooth',block:'nearest'});
 }catch{el('formStatus').textContent=t('error')}
});
defenseForm.addEventListener('submit',event=>{
 event.preventDefault();
 if(!defenseForm.reportValidity())return;
 try{
   defense=assessDefense({challenge:el('chosenChallenge').value,reply:el('defense').value,debate});
   render();el('defenseResult').scrollIntoView({behavior:'smooth',block:'nearest'});
 }catch{el('exportStatus').textContent=t('defenseError')}
});
el('exportJSON').addEventListener('click',()=>{
 if(debate)triggerDownload({
   kind:'antipersona-debate-report',version:VERSION,debate,defense,
   disclosure:'Rule-based editorial prompts only; no actual buyers or verified claims.'
 },'antipersona-debate.json');
});
locale.addEventListener('change',()=>{
 language=Object.hasOwn(text,locale.value)?locale.value:'ru';
 localize();
});
const query=new URLSearchParams(location.search).get('lang');
language=Object.hasOwn(text,query)?query:'ru';
localize();
