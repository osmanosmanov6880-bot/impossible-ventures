import {startPlay,advancePlay,currentAct,scriptSummary,VERSION,ACTS} from './engine.mjs';
const localeData={
 ru:{
  prototype:'РУЧНАЯ РЕПЕТИЦИЯ / БЕЗ AI',other:'ANTIPERSONA ↗',eyebrow:'ТРИ АКТА. ОДНА КАМПАНИЯ. НИКАКИХ ИЛЛЮЗИЙ.',
  h1a:'Бриф выходит',h1b:'на сцену.',
  lead:'Рекламная идея меняется, когда режиссёр добавляет ограничения. Напишите вступление, доказательство и призыв к действию — три сцены, которые вы действительно создадите сами.',
  tag1:'03 АКТА',tag2:'02 РЕЖИССЁРСКИХ ВЫБОРА',tag3:'01 ЭКСПОРТ СЦЕНАРИЯ',sequence:'01 / ПОДГОТОВКА СЦЕНЫ',
  briefTitle:'Что должно стать историей?',briefDescription:'Сначала сформулируйте исходную идею и аудиторию. После начала репетиции эти поля будут сохранены только в памяти вкладки.',
  brand:'Продукт или бренд',brandExample:'Aurora Studio',audience:'Для кого история',audienceExample:'Независимые агентства',
  concept:'Исходная идея',conceptExample:'Открываем проблему, затем показываем её решение…',
  channel:'Основная площадка',social:'Социальные сети',video:'Короткое видео',landing:'Посадочная страница',
  notice:'Это авторская работа с ограничениями. Сценарий не создаётся нейросетью и не публикуется.',
  localNote:'Сцены не сохраняются на сервере',start:'НАЧАТЬ РЕПЕТИЦИЮ ↗',rightEyebrow:'СЦЕНА / ПРЯМОЙ ЭФИР МЫСЛИ',
  emptyTitle:'Занавес закрыт.',emptyDescription:'Заполните бриф слева. Затем режиссёр предложит вам три последовательных задачи с реальными творческими решениями.',
  playTitle:'Репетиция началась.',directionLabel:'Режиссёрский выбор',
  careful:'Точность и ясность',bold:'Смелость и конфликт',
  writeScene:'Напишите эту сцену',sceneExample:'Что зритель увидит и поймёт?',next:'СЫГРАТЬ СЦЕНУ ↗',
  completed:'ТРЕТИЙ АКТ ЗАВЕРШЁН / ДЛЯ ПРОВЕРКИ ЧЕЛОВЕКОМ',finale:'Занавес. Теперь нужен реальный тест.',
  finalWarning:'Три сцены написаны вами. Баллы — сигналы структуры текста, не продажи, качество рекламы или доказательства.',
  timeline:'ХРОНИКА РЕПЕТИЦИИ',export:'СКАЧАТЬ СЦЕНАРИЙ .JSON ↓',restart:'НАЧАТЬ ЗАНОВО ↻',
  p1Head:'Интрига вместо клише.',p1Text:'Первый акт открывает конфликт, понятный настоящей аудитории.',
  p2Head:'Доказательство вместо мифа.',p2Text:'Второй акт требует конкретного источника или демонстрации — без автоматической проверки.',
  p3Head:'Зритель должен понимать шаг.',p3Text:'Третий акт заканчивается ясным действием, которое затем надо проверить с реальными людьми.',
  footerDisclaimer:'Не использует AI · Не запускает рекламу · Не придумывает реальные результаты',privacy:'Данные и приватность ↗',
  scene:{opening:'АКТ 1 · ЗАХВАТ ВНИМАНИЯ',evidence:'АКТ 2 · ДОКАЗАТЕЛЬСТВО',conversion:'АКТ 3 · ДЕЙСТВИЕ'},
  prompt:{opening:'Откройте историю реальной проблемой аудитории. Избегайте размытых обещаний.',
    evidence:'Покажите, какое доказательство или демонстрация могло бы поддержать главную мысль.',
    conversion:'Завершите понятным следующим действием. Не создавайте ложную срочность.'},
  nextRisk:'Вы выбрали смелую подачу. Теперь проверьте риск неподтверждённого обещания.',
  nextClarity:'Вы выбрали точность. Следующая сцена должна быть ясна человеку без контекста.',
  firstHint:'Для начала выберите режиссёрский подход и напишите сцену.',
  signal:'СИГНАЛЫ СТРУКТУРЫ',human:'Все утверждения требуют проверки; это не оценка фактической эффективности.',
  sceneError:'Напишите не менее 20 символов для сцены и выберите режиссёрское направление.',
  briefError:'Проверьте все поля исходного брифа.',saved:'Сценарий выгружен в JSON.',
  stopped:'Репетиция завершена. Новый сценарий можно начать с кнопки «Начать заново».',
  draft:'Незавершённый черновик. Заполните три акта для итогового сценария.'
 },
 en:{
  prototype:'AUTHOR-LED REHEARSAL / NO AI',other:'ANTIPERSONA ↗',eyebrow:'THREE ACTS. ONE CAMPAIGN. NO ILLUSIONS.',
  h1a:'Your brief',h1b:'takes the stage.',
  lead:'A creative idea changes when the director adds constraints. Write an opening, proof scene and next action — three scenes authored by you.',
  tag1:'03 ACTS',tag2:'02 DIRECTOR CHOICES',tag3:'01 SCRIPT EXPORT',sequence:'01 / SET THE STAGE',
  briefTitle:'What should become the story?',briefDescription:'Write the original concept and audience. The rehearsal stays in this browser tab only.',
  brand:'Product or brand',brandExample:'Aurora Studio',audience:'Who is it for?',audienceExample:'Independent agencies',
  concept:'Original idea',conceptExample:'Open with the problem, reveal a better alternative…',
  channel:'Primary channel',social:'Social media',video:'Short video',landing:'Landing page',
  notice:'An author-led writing exercise with constraints. No model generates or publishes your scenes.',
  localNote:'No scenes are stored on the server',start:'START REHEARSAL ↗',rightEyebrow:'STAGE / LIVE WRITING',
  emptyTitle:'The curtain is closed.',emptyDescription:'Fill in the brief. The director will reveal three sequential constraints that you must address yourself.',
  playTitle:'Rehearsal is in session.',directionLabel:'Director choice',
  careful:'Clarity and precision',bold:'Boldness and conflict',
  writeScene:'Write this scene',sceneExample:'What should the viewer see and understand?',next:'PERFORM SCENE ↗',
  completed:'THIRD ACT COMPLETE / HUMAN REVIEW REQUIRED',finale:'Curtain call. Now test it for real.',
  finalWarning:'These scenes were written by you. Scores count writing signals, not sales or independently verified claims.',
  timeline:'REHEARSAL TIMELINE',export:'EXPORT SCRIPT .JSON ↓',restart:'START AGAIN ↻',
  p1Head:'Drama over clichés.',p1Text:'The first act opens with a real audience tension.',
  p2Head:'Proof over myth.',p2Text:'The second act asks for a testable source or demo, without pretending to verify one.',
  p3Head:'A clear next step.',p3Text:'The third act makes the audience action obvious; it must then be tested with people.',
  footerDisclaimer:'No AI · No published campaigns · No fabricated commercial results',privacy:'Data and privacy ↗',
  scene:{opening:'ACT 1 · THE HOOK',evidence:'ACT 2 · EVIDENCE',conversion:'ACT 3 · ACTION'},
  prompt:{opening:'Open with a recognizable audience tension. Avoid vague promises.',
    evidence:'Show what proof or demonstration would support your creative direction.',
    conversion:'End with a clear next action. Avoid fabricated urgency.'},
  nextRisk:'Your previous direction was bold. Examine the risks of claims you cannot substantiate.',
  nextClarity:'Your previous direction was careful. Make the next scene clear to a viewer with no background.',
  firstHint:'Choose a director approach and write the first scene.',
  signal:'WRITING STRUCTURE SIGNALS',human:'All claims require human review; this is not a measure of commercial effectiveness.',
  sceneError:'Write at least 20 characters and choose a direction.',
  briefError:'Check the required brief fields.',saved:'Script exported as JSON.',
  stopped:'Rehearsal complete. Start a new script to continue.',
  draft:'Partial draft. Finish all three acts to create the final script.'
 },
 zh:{
  prototype:'作者主导排练 / 无 AI',other:'ANTIPERSONA ↗',eyebrow:'三个剧幕，一项广告，没有虚假承诺。',
  h1a:'让创意简报',h1b:'登上舞台。',
  lead:'导演增加限制后，创意会不断改变。请亲自写出开场、证据和行动三个场景。',
  tag1:'03 幕',tag2:'02 种导演选择',tag3:'01 份剧本导出',sequence:'01 / 布置舞台',
  briefTitle:'哪个想法应该变成故事？',briefDescription:'先写原始概念和受众。排练仅留在当前浏览器标签页。',
  brand:'产品或品牌',brandExample:'Aurora Studio',audience:'目标受众',audienceExample:'独立创意公司',
  concept:'原始创意',conceptExample:'从真实问题开始，再展示可能的解决办法…',
  channel:'主要渠道',social:'社交媒体',video:'短视频',landing:'落地页',
  notice:'这是由作者完成的限制性创作练习。系统不会使用 AI 生成或发布场景。',
  localNote:'场景不保存到服务器',start:'开始排练 ↗',rightEyebrow:'舞台 / 实时创作',
  emptyTitle:'帷幕尚未拉开。',emptyDescription:'填写左侧创意简报。导演会依次给出三个需要您亲自完成的任务。',
  playTitle:'排练开始。',directionLabel:'导演选择',
  careful:'精准与清晰',bold:'大胆与冲突',
  writeScene:'写出这一幕',sceneExample:'观众应该看到并理解什么？',next:'完成这一幕 ↗',
  completed:'第三幕完成 / 需要人工审核',finale:'谢幕。现在需要真实测试。',
  finalWarning:'三幕由您亲自撰写。分数只是文本结构信号，不代表销售或核实后的事实。',
  timeline:'排练时间线',export:'导出剧本 .JSON ↓',restart:'重新开始 ↻',
  p1Head:'冲突胜过陈词滥调。',p1Text:'第一幕从受众真实的困扰出发。',
  p2Head:'证据胜过神话。',p2Text:'第二幕要求可验证的资料或演示，系统本身不核实。',
  p3Head:'明确下一步。',p3Text:'第三幕给出清晰行动，再与真实受众验证。',
  footerDisclaimer:'不用 AI · 不发布广告 · 不虚构商业成果',privacy:'数据与隐私 ↗',
  scene:{opening:'第一幕 · 开场',evidence:'第二幕 · 证据',conversion:'第三幕 · 行动'},
  prompt:{opening:'以受众能理解的真实问题开场，避免模糊承诺。',
    evidence:'展示可以支持创意方向的证据或演示。',
    conversion:'以明确的下一步收尾，不要制造虚假的紧迫感。'},
  nextRisk:'上一幕选择了大胆表达。现在检查未经证实的主张可能产生的风险。',
  nextClarity:'上一幕强调精确。请确保下一幕让没有背景知识的观众也能理解。',
  firstHint:'选择导演风格，并写出第一幕。',
  signal:'文本结构信号',human:'所有声明都需要人工审核，不能据此评估商业成果。',
  sceneError:'请输入至少 20 个字符并选择一个方向。',
  briefError:'请检查必填字段。',saved:'剧本已导出为 JSON。',
  stopped:'排练完成，可以开始新的剧本。',
  draft:'这是部分草稿，请完成全部三幕。'
 }
};
let language='ru';
let play=null;
const el=id=>document.getElementById(id);
const t=k=>localeData[language][k]??localeData.en[k]??k;
function node(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=String(text);return n}
function localize(){
 document.documentElement.lang=language==='zh'?'zh-CN':language;
 el('locale').value=language;
 for(const element of document.querySelectorAll('[data-i18n]'))element.textContent=t(element.dataset.i18n);
 for(const element of document.querySelectorAll('[data-placeholder]'))element.placeholder=t(element.dataset.placeholder);
 if(play)render();
}
function render(){
 if(!play)return;
 el('empty').hidden=true;el('playArea').hidden=false;
 el('actProgress').textContent=play.history.length+' / 3';
 for(let i=0;i<3;i++){
   el('step'+(i+1)).classList.toggle('active',i===Math.min(play.actIndex,2));
 }
 const complete=play.status==='complete';
 el('currentScene').hidden=complete;
 el('complete').hidden=!complete;
 if(!complete){
   const act=currentAct(play);
   el('actLabel').textContent='ACT 0'+act.number+' / 03 · '+play.brief.channel.toUpperCase();
   el('actHeading').textContent=t('scene')[act.act];
   el('actInstructions').textContent=t('prompt')[act.act];
   el('directorPressure').textContent=!act.lastDirection?t('firstHint'):
     t(act.pressure==='challengeRisk'?'nextRisk':'nextClarity');
 }
 const history=el('history');history.replaceChildren();
 for(let i=0;i<play.history.length;i++){
   const item=play.history[i];
   const card=node('article','record');
   card.append(node('div','eyebrow','ACT 0'+(i+1)+' / '+t('scene')[item.act]),
     node('h3','',t(item.direction)),
     node('p','',item.draft),
     node('span','pill',t('signal')+': '+item.structureSignals+' / 3'));
   history.append(card);
 }
}
el('playForm').addEventListener('submit',e=>{
 e.preventDefault();
 if(!e.target.reportValidity())return;
 try{
  play=startPlay({brand:el('brand').value,audience:el('audience').value,
    concept:el('concept').value,channel:el('channel').value});
  el('stageStatus').textContent='';el('briefError').textContent='';
  el('sceneDraft').value='';render();
  el('playArea').scrollIntoView({behavior:'smooth',block:'nearest'});
 }catch{el('briefError').textContent=t('briefError')}
});
el('sceneForm').addEventListener('submit',e=>{
 e.preventDefault();
 if(!e.target.reportValidity())return;
 try{
   play=advancePlay(play,{draft:el('sceneDraft').value,direction:el('direction').value});
   el('sceneDraft').value='';
   el('stageStatus').textContent=play.status==='complete'?t('stopped'):'';
   render();
 }catch{el('stageStatus').textContent=t('sceneError')}
});
el('exportJSON').addEventListener('click',()=>{
 if(!play)return;
 const data=play.status==='complete'?scriptSummary(play):{
  kind:'brief-theatre-partial-draft',version:VERSION,play,disclaimer:t('draft')
 };
 const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'}));
 const anchor=node('a');anchor.href=url;anchor.download='brief-theatre-script.json';
 document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 el('stageStatus').textContent=t('saved');
});
el('resetPlay').addEventListener('click',()=>{
 play=null;el('sceneDraft').value='';el('empty').hidden=false;el('playArea').hidden=true;
 el('stageStatus').textContent='';el('briefError').textContent='';
 el('playForm').scrollIntoView({behavior:'smooth',block:'nearest'});
});
el('locale').addEventListener('change',()=>{
 language=Object.hasOwn(localeData,el('locale').value)?el('locale').value:'ru';localize();
});
const param=new URLSearchParams(location.search).get('lang');
language=Object.hasOwn(localeData,param)?param:'ru';localize();
