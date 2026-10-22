'use strict';
const catalog={
  ru:{
    navWorlds:'Вселенная продуктов',navTools:'Инструменты',navMission:'Миссия',explore:'ИССЛЕДОВАТЬ ↗',
    overline:'СЕМЬ МИРОВ / ОДНА КРЕАТИВНАЯ ЛАБОРАТОРИЯ',
    heroA:'Невозможное —',heroB:'это направление.',
    heroText:'Семь отдельных экспериментальных продуктов для новых рекламных идей: от игры двух креаторов до проверяемых гипотез, живых сценариев и добровольного внимания.',
    enterWorlds:'ОТКРЫТЬ 7 ВСЕЛЕННЫХ',startGame:'НАЧАТЬ С DEAD DROP',
    disclaimer:'Рабочие прототипы. Это не семь зарегистрированных компаний и не действующая международная рекламная сеть.',
    worldsLabel:'01 / КАТАЛОГ ПРОДУКТОВ',worldsTitle:'Семь разных миров.\nСемь разных механик.',
    worldsSub:'Каждая карточка ведёт в работающий интерактивный продукт. Интерфейсы доступны на русском, английском и китайском; доступность серверных функций зависит от размещения.',
    prototypeCount:'ИНТЕРАКТИВНЫХ ПРОТОТИПОВ',
    all:'ВСЕ ПРОДУКТЫ',creative:'КРЕАТИВ',review:'ПРОВЕРКА',community:'СООБЩЕСТВО',
    launch:'ОТКРЫТЬ ПРОДУКТ',
    typeCoop:'ДВА АГЕНТА',deadTitle:'Рекламная операция на двоих.',
    deadDesc:'Один агент знает продукт, другой — аудиторию. Обменяйтесь ограниченными сообщениями и создайте рекламное досье.',
    typeReview:'ПЯТЬ КРИТЕРИЕВ',appealTitle:'Отправьте рекламу на суд.',
    appealDesc:'Проверьте обещание, аргументы и качество доказательств. Импортируйте готовое досье Dead Drop.',
    typeCritic:'ЧЕТЫРЕ ОППОНЕНТА',antiTitle:'Ваш самый полезный критик.',
    antiDesc:'Поспорьте со скептиком, финансистом или занятым человеком. Сильная идея должна выдержать вопросы.',
    typeStage:'ТРИ АКТА',theatreTitle:'Бриф превращается в сцену.',
    theatreDesc:'Сыграйте три акта: интрига, доказательство и призыв. Ваши решения меняют следующую сцену.',
    typeDna:'ПЯТЬ ГЕНОВ',biomeTitle:'Выращивайте идеи как ДНК.',
    biomeDesc:'Меняйте тон, обещание или доказательство. Скрещивайте варианты и изучайте, что изменилось.',
    typeMuseum:'МУЗЕЙ БУДУЩЕГО',museumTitle:'Археология того, чего не было.',
    museumDesc:'Исследуйте четыре вымышленных артефакта рекламы будущего и создайте собственный экспонат.',
    typeRepublic:'ДОБРОВОЛЬНЫЙ ВЫБОР',republicTitle:'У внимания есть право голоса.',
    republicDesc:'Участвуйте в вопросах, открытых модератором. Согласие обязательно; демонстрация не записывает голоса.',
    catalogNote:'Весь контент экспериментальный: оценки текстов не подтверждают продажи, а анонимные сессии не равны уникальным людям.',
    infraLabel:'02 / ОПЕРАЦИОННЫЕ ИНСТРУМЕНТЫ',infraTitle:'От идей — к доказательствам.',
    infraText:'Отдельные инструменты помогают оценить гипотезы, запустить исследование и проверить состояние сервера.',
    pilotDesc:'Планирование бюджета, гипотез и реальные заявки на пилот при работающем сервере.',
    experimentDesc:'Контролируемое A/B-исследование с согласием и настоящими счётчиками событий.',
    statusDesc:'Живая диагностика процесса и записи в SQLite. На статическом сайте — честный деморежим.',
    openTool:'ОТКРЫТЬ ИНСТРУМЕНТ ↗',missionLabel:'03 / ЧЕСТНАЯ КАРТИНА',
    missionTitle:'Прототип — это начало. Не победа.',
    missionText:'Мы строим портфель разных рекламных продуктов. Сейчас они доступны как исследовательские приложения; до мировой коммерческой платформы остаются реальные платящие клиенты, безопасный хостинг, авторизация, юридическая проверка и масштабирование.',
    source:'ИЗУЧИТЬ ИСХОДНЫЙ КОД',
    footerText:'Семь экспериментальных креативных продуктов. Без подтверждённой выручки и без вымышленных пользователей.',
    footerStatus:'Состояние',footerPrivacy:'Приватность'
  },
  en:{
    navWorlds:'Creative worlds',navTools:'Tools',navMission:'Mission',explore:'EXPLORE ↗',
    overline:'SEVEN WORLDS / ONE CREATIVE LAB',
    heroA:'Impossible',heroB:'is a direction.',
    heroText:'Seven distinct experimental products for a new kind of advertising: from a two-person creative game to reviewable hypotheses, living scripts and voluntary attention.',
    enterWorlds:'EXPLORE ALL 7 WORLDS',startGame:'BEGIN WITH DEAD DROP',
    disclaimer:'Working prototypes, not seven incorporated companies or an operating international advertising network.',
    worldsLabel:'01 / PRODUCT UNIVERSE',worldsTitle:'Seven creative worlds.\nSeven different mechanics.',
    worldsSub:'Each card opens a functional interactive prototype. Interfaces support Russian, English and Chinese; online-only capabilities require a Node server.',
    prototypeCount:'INTERACTIVE PROTOTYPES',
    all:'ALL PRODUCTS',creative:'CREATIVE',review:'CRITIQUE',community:'COMMUNITY',
    launch:'OPEN EXPERIENCE',
    typeCoop:'TWO AGENTS',deadTitle:'A classified two-person ad mission.',
    deadDesc:'One agent knows the product; the other knows the audience. Share limited transmissions and unlock a creative dossier.',
    typeReview:'FIVE SIGNALS',appealTitle:'Put your campaign on trial.',
    appealDesc:'Review the promise, argument and evidence signals; import a finalized Dead Drop dossier locally.',
    typeCritic:'FOUR ADVERSARIES',antiTitle:'Your most useful critic.',
    antiDesc:'Debate a skeptic, finance executive or busy customer. Better ideas withstand questions.',
    typeStage:'THREE ACTS',theatreTitle:'A brief becomes a performance.',
    theatreDesc:'Write three acts: tension, evidence and action. Each choice shapes the following scene.',
    typeDna:'FIVE GENES',biomeTitle:'Grow concepts from creative DNA.',
    biomeDesc:'Mutate voice, promise or proof. Crossbreed variants and understand the differences.',
    typeMuseum:'FUTURE MUSEUM',museumTitle:'Archaeology of things yet to exist.',
    museumDesc:'Explore four clearly fictional ad-future artifacts and author your own museum placard.',
    typeRepublic:'VOLUNTARY CHOICE',republicTitle:'Attention has a voice.',
    republicDesc:'Participate in operator-moderated challenges with explicit consent. Static preview records no ballots.',
    catalogNote:'All results are experimental: editorial scores do not verify sales and anonymous sessions do not equal unique human participants.',
    infraLabel:'02 / RESEARCH INFRASTRUCTURE',infraTitle:'From ideas to evidence.',
    infraText:'Separate tools help model a pilot, measure an experiment and inspect server readiness.',
    pilotDesc:'Campaign budgeting and genuine pilot applications when a Node server is available.',
    experimentDesc:'Consent-based first-party A/B research with actual event counters.',
    statusDesc:'Live process and SQLite write-readiness checks; honest demo mode on static hosting.',
    openTool:'OPEN TOOL ↗',missionLabel:'03 / THE REAL STATUS',
    missionTitle:'A prototype is a beginning. Not a victory.',
    missionText:'We are building a portfolio of distinct advertising products. Today they are research applications, not seven operating companies. World-scale commercialization still needs paying customers, safe hosting, verified identity, legal review and scalability.',
    source:'VIEW OPEN SOURCE',
    footerText:'Seven experimental creative products. No verified revenue or fabricated customer metrics.',
    footerStatus:'System status',footerPrivacy:'Privacy'
  },
  zh:{
    navWorlds:'创意世界',navTools:'工具',navMission:'使命',explore:'探索 ↗',
    overline:'七个世界 / 一个创意实验室',
    heroA:'不可能，',heroB:'只是一个方向。',
    heroText:'七个不同的实验性广告产品：从双人创意游戏到可审视的假设、不断发展的脚本与自愿关注。',
    enterWorlds:'探索七大创意世界',startGame:'从 DEAD DROP 开始',
    disclaimer:'这些是可运行的原型，不是七家已注册的公司，也不是运营中的国际广告网络。',
    worldsLabel:'01 / 产品宇宙',worldsTitle:'七个创意世界。\n七种不同机制。',
    worldsSub:'每张卡片都能进入可互动的研究原型。支持俄语、英语和中文；多人及服务端功能需要 Node 服务器。',
    prototypeCount:'互动原型',
    all:'全部产品',creative:'创意',review:'审查',community:'社区',
    launch:'进入产品',
    typeCoop:'双人协作',deadTitle:'双人机密创意任务。',
    deadDesc:'一位特工了解产品，另一位了解受众。交换有限消息并生成创意档案。',
    typeReview:'五项指标',appealTitle:'让广告接受审查。',
    appealDesc:'检验承诺、论证和证据线索；在本地导入已完成的 Dead Drop 档案。',
    typeCritic:'四种反对者',antiTitle:'最有帮助的批评者。',
    antiDesc:'与怀疑者、财务负责人或忙碌顾客辩论。好的创意需要经得起提问。',
    typeStage:'三幕创作',theatreTitle:'让简报登上舞台。',
    theatreDesc:'写出冲突、证据和行动三个场景，每次决定都会影响下一幕。',
    typeDna:'五个基因',biomeTitle:'用创意 DNA 培育概念。',
    biomeDesc:'改变语气、承诺或证据，交叉不同版本并观察真正的差异。',
    typeMuseum:'未来博物馆',museumTitle:'考古尚未发生的事物。',
    museumDesc:'探索四件明确标注为虚构的未来广告展品，创作自己的展品说明。',
    typeRepublic:'自愿选择',republicTitle:'注意力也有发言权。',
    republicDesc:'明确同意后参与管理员审核的问题；静态演示不会记录任何选票。',
    catalogNote:'所有结果均为实验性质：文本评分不证明销售结果，匿名会话不等于经验证的独立真人。',
    infraLabel:'02 / 研究基础设施',infraTitle:'从创意到证据。',
    infraText:'规划试点、研究真实行为，并检查服务器的读写状态。',
    pilotDesc:'预算规划与真实试点申请（需要 Node 服务器）。',
    experimentDesc:'明确同意的第一方 A/B 研究和实际事件计数。',
    statusDesc:'真实的进程与 SQLite 写入检测，静态站点会如实显示演示模式。',
    openTool:'打开工具 ↗',missionLabel:'03 / 真实状态',
    missionTitle:'原型只是开始，不是胜利。',
    missionText:'我们正在构建不同广告产品的组合。目前它们是研究性应用，并非七家运营中的公司。全球商业化仍需付费客户、安全托管、身份管理、法律审查和规模化。',
    source:'查看源代码',
    footerText:'七个实验性创意产品，没有经验证的收入或虚构的客户数据。',
    footerStatus:'系统状态',footerPrivacy:'隐私'
  }
};
let locale='ru',group='all';
const language=document.getElementById('language');
const cards=Array.from(document.querySelectorAll('.world-card'));
const buttons=Array.from(document.querySelectorAll('[data-filter]'));
function translate(){
  document.documentElement.lang=locale==='zh'?'zh-CN':locale;
  language.value=locale;
  for(const node of document.querySelectorAll('[data-t]')){
    const value=catalog[locale][node.dataset.t];
    if(value!==undefined)node.textContent=value;
  }
}
function filter(next){
  group=['all','creative','review','community'].includes(next)?next:'all';
  for(const card of cards){
    card.hidden=group!=='all'&&card.dataset.group!==group;
  }
  for(const button of buttons){
    const selected=button.dataset.filter===group;
    button.classList.toggle('active',selected);
    button.setAttribute('aria-pressed',String(selected));
  }
}
language.addEventListener('change',()=>{
  locale=Object.hasOwn(catalog,language.value)?language.value:'ru';
  try{localStorage.setItem('iv-site-locale',locale);}catch{}
  translate();
});
for(const button of buttons)button.addEventListener('click',()=>filter(button.dataset.filter));
try{
  const remembered=localStorage.getItem('iv-site-locale');
  locale=Object.hasOwn(catalog,remembered)?remembered:'ru';
}catch{locale='ru';}
translate();
filter('all');
