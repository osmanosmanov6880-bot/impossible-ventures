import {listExhibits,createPlacard,VERSION} from './engine.mjs';
const translations={
ru:{
 fiction:'ВЫМЫШЛЕННЫЕ ЭКСПОНАТЫ / НЕ ИСТОРИЯ',biomeLink:'ADBIOME ↗',eyebrow:'АРХЕОЛОГИЯ ТОГО, ЧЕГО ЕЩЁ НЕ БЫЛО.',
 headFirst:'Музей',headSecond:'завтрашнего внимания.',
 lead:'Прогуляйтесь по четырём вымышленным экспонатам будущего рекламы: от последнего баннера до сада добровольного внимания. Затем создайте собственную музейную табличку.',
 tagA:'04 ВЫМЫШЛЕННЫХ АРТЕФАКТА',tagB:'03 ЭПОХИ',tagC:'ЭКСПОНАТЫ НЕ ЯВЛЯЮТСЯ ИСТОРИЕЙ',
 archiveLabel:'01 / КОЛЛЕКЦИЯ',galleryTitle:'Архив несбывшегося.',galleryHint:'Все экспонаты — художественные гипотезы. Мы не представляем их как реальные исторические события.',
 eraLabel:'Эпоха',allEras:'Все эпохи',detailLabel:'02 / ЗАЛ ЭКСПОЗИЦИИ',
 emptyTitle:'Выберите экспонат.',emptyBody:'Нажмите на артефакт слева, чтобы прочитать его вымышленную историю и вопрос к современному маркетингу.',
 fictionLabel:'ХУДОЖЕСТВЕННЫЙ ВЫМЫСЕЛ',questionLabel:'ВОПРОС ПОСЕТИТЕЛЮ',
 verification:'Эта история не является фактом, исследованием рынка или прогнозом будущего.',
 createLabel:'03 / ВАШ ЭКСПОНАТ',placardTitle:'Название артефакта',titleHint:'Капсула тихой рекламы',
 futureYear:'Воображаемый год',medium:'Формат',interactive:'Интерактив',sound:'Звук',archive:'Архив',spatial:'Пространство',
 interpretation:'Ваша фантастическая интерпретация',interpretationHint:'Как посетители будущего объясняли бы этот объект?',
 createButton:'СОЗДАТЬ МУЗЕЙНУЮ ТАБЛИЧКУ ↗',export:'СКАЧАТЬ ЭКСПОНАТ .JSON ↓',republicLink:'ATTENTION REPUBLIC ↗',
 p1Title:'Никакой поддельной истории.',p1Text:'Будущие даты и экспонаты открыто обозначены как художественный вымысел.',
 p2Title:'Переосмысление рекламы.',p2Text:'Экспозиция задаёт неудобные вопросы об уважении внимания и выборе человека.',
 p3Title:'Ваш собственный артефакт.',p3Text:'Сделайте музейную табличку, сохраните её локально и продолжите дискуссию в сообществе.',
 footerNote:'Будущие экспонаты вымышлены · Данные посетителя не отправляются в API',privacy:'Данные и приватность ↗',
 view:'ОТКРЫТЬ ЭКСПОНАТ ↗',count:'Экспонатов в выбранной эпохе: ',
 visitor:'ЭКСПОНАТ ПОСЕТИТЕЛЯ / ВЫМЫСЕЛ',created:'Табличка создана локально. Вы можете скачать её.',
 failed:'Введите название, воображаемый год (2030–2099) и описание от 20 символов.',
 exported:'Вымышленный экспонат сохранён как JSON.',fictionDetail:'Вымышленный артефакт. Не архивный документ.'
},
en:{
 fiction:'FICTIONAL EXHIBITS / NOT HISTORY',biomeLink:'ADBIOME ↗',eyebrow:'ARCHAEOLOGY OF THINGS THAT NEVER EXISTED.',
 headFirst:'Museum of',headSecond:'Tomorrow’s Attention.',
 lead:'Visit four imagined artifacts from advertising’s future: from the last banner to a garden of voluntary attention. Then make a visitor placard of your own.',
 tagA:'04 FICTIONAL ARTIFACTS',tagB:'03 FUTURE ERAS',tagC:'NOT HISTORICAL RECORDS',
 archiveLabel:'01 / THE COLLECTION',galleryTitle:'Archive of the unbuilt.',galleryHint:'All exhibits are speculative fiction, not documented historical events.',
 eraLabel:'Era',allEras:'All eras',detailLabel:'02 / EXHIBITION ROOM',
 emptyTitle:'Choose an exhibit.',emptyBody:'Select an artifact on the left to read its fictional story and question about modern advertising.',
 fictionLabel:'SPECULATIVE FICTION',questionLabel:'A QUESTION FOR YOU',
 verification:'This story is not historical fact, market research or a future forecast.',
 createLabel:'03 / YOUR ARTIFACT',placardTitle:'Artifact title',titleHint:'The Quiet Ad Capsule',
 futureYear:'Imagined year',medium:'Medium',interactive:'Interactive',sound:'Sound',archive:'Archive',spatial:'Spatial',
 interpretation:'Your future interpretation',interpretationHint:'How would visitors of the future explain this artifact?',
 createButton:'CREATE VISITOR PLACARD ↗',export:'DOWNLOAD PLACARD .JSON ↓',republicLink:'ATTENTION REPUBLIC ↗',
 p1Title:'No counterfeit history.',p1Text:'Future dates and objects are clearly labeled fiction.',
 p2Title:'Rethinking advertising.',p2Text:'The archive raises uncomfortable questions about attention and personal choice.',
 p3Title:'Your artifact.',p3Text:'Create a fictional museum placard, save it locally and join the wider conversation.',
 footerNote:'All future exhibits are fictional · Visitor data not submitted to API',privacy:'Data and privacy ↗',
 view:'VIEW EXHIBIT ↗',count:'Exhibits in this era: ',visitor:'VISITOR PLACARD / FICTION',
 created:'Placard created locally. You may download it.',failed:'Enter a title, imagined year (2030–2099) and a description of at least 20 characters.',
 exported:'Fictional exhibit saved as JSON.',fictionDetail:'Imagined artifact. Not a historical record.'
},
zh:{
 fiction:'虚构展品 / 并非历史',biomeLink:'ADBIOME ↗',eyebrow:'考古尚未发生的事物。',
 headFirst:'未来注意力',headSecond:'博物馆。',
 lead:'参观四件关于广告未来的虚构展品：从最后一条横幅到自愿关注的花园，再创造自己的展品说明。',
 tagA:'04 件虚构展品',tagB:'03 个未来年代',tagC:'不是历史记录',
 archiveLabel:'01 / 藏品',galleryTitle:'未发生的档案。',galleryHint:'所有展品都是推想小说，并非真实历史事件。',
 eraLabel:'年代',allEras:'全部年代',detailLabel:'02 / 展厅',
 emptyTitle:'请选择展品。',emptyBody:'点击左侧展品，阅读虚构故事与对现代广告的提问。',
 fictionLabel:'推想小说',questionLabel:'给参观者的问题',
 verification:'故事并非历史事实、市场研究或未来预测。',
 createLabel:'03 / 你的展品',placardTitle:'展品名称',titleHint:'安静广告胶囊',
 futureYear:'虚构年份',medium:'媒介',interactive:'互动',sound:'声音',archive:'档案',spatial:'空间',
 interpretation:'你的未来诠释',interpretationHint:'未来参观者如何解释这件物品？',
 createButton:'创建展品说明 ↗',export:'导出展品 .JSON ↓',republicLink:'ATTENTION REPUBLIC ↗',
 p1Title:'不伪造历史。',p1Text:'未来日期与展品明确标注为虚构。',
 p2Title:'重新思考广告。',p2Text:'展品提出关于注意力尊重和个人选择的问题。',
 p3Title:'你的创作。',p3Text:'创建虚构展品说明，保存到本地并加入讨论。',
 footerNote:'所有未来展品均为虚构 · 不将访客内容发送给 API',privacy:'数据与隐私 ↗',
 view:'查看展品 ↗',count:'所选年代展品数：',visitor:'访客展品 / 虚构',
 created:'展品说明已在本地生成，可下载。',failed:'请输入名称、虚构年份（2030–2099）和至少 20 字的描述。',
 exported:'虚构展品已保存为 JSON。',fictionDetail:'虚构展品，不是真实历史记录。'
}
};
let language='ru',current=null,placard=null;
const el=id=>document.getElementById(id);
const t=k=>translations[language][k]??translations.en[k]??k;
function node(tag,cls,s){const n=document.createElement(tag);if(cls)n.className=cls;if(s!==undefined)n.textContent=String(s);return n;}
function localize(){
 document.documentElement.lang=language==='zh'?'zh-CN':language;el('locale').value=language;
 for(const n of document.querySelectorAll('[data-i18n]'))n.textContent=t(n.dataset.i18n);
 for(const n of document.querySelectorAll('[data-placeholder]'))n.placeholder=t(n.dataset.placeholder);
 renderGallery();if(current)renderExhibit();if(placard)renderPlacard();
}
function renderGallery(){
 const items=listExhibits({era:el('era').value,language});
 const gallery=el('gallery');gallery.replaceChildren();
 for(const item of items){
  const card=node('article','record');
  const header=node('div','eyebrow',item.era+' / '+item.symbol+' / '+item.type.toUpperCase());
  const heading=node('h3','',item.title);
  const desc=node('p','',item.periodLabel);
  const button=node('button','button ghost small',t('view'));
  button.type='button';button.dataset.exhibitId=item.id;
  button.setAttribute('aria-pressed',String(item.id===current));
  card.append(header,heading,desc,button);
  gallery.append(card);
 }
 el('galleryCount').textContent=t('count')+items.length;
}
function renderExhibit(){
 const detail=listExhibits({language}).find(x=>x.id===current);
 if(!detail){el('exhibit').hidden=true;return;}
 el('empty').hidden=true;el('exhibit').hidden=false;
 el('exhibitPeriod').textContent=detail.periodLabel;
 el('exhibitTitle').textContent=detail.title;
 el('exhibitStory').textContent=detail.story;
 el('exhibitQuestion').textContent=detail.question;
}
function renderPlacard(){
 const view=el('myPlacard');view.replaceChildren();
 view.append(node('div','card-top',t('visitor')+' · '+placard.year),
   node('h3','',placard.title),
   node('p','quote',placard.interpretation),
   node('span','pill',t(placard.medium)),
   node('p','',t('fictionDetail')));
 view.hidden=false;el('exportPlacard').disabled=false;
}
el('gallery').addEventListener('click',e=>{
 const action=e.target.closest('[data-exhibit-id]');
 if(!action)return;
 current=action.dataset.exhibitId;renderExhibit();renderGallery();
 el('exhibit').scrollIntoView({behavior:'smooth',block:'nearest'});
});
el('era').addEventListener('change',renderGallery);
el('placardForm').addEventListener('submit',e=>{
 e.preventDefault();if(!e.target.reportValidity())return;
 try{
  placard=createPlacard({
    title:el('placardTitle').value,year:el('year').value,
    medium:el('medium').value,interpretation:el('interpretation').value
  });
  renderPlacard();el('formStatus').textContent=t('created');
 }catch{el('formStatus').textContent=t('failed');}
});
el('exportPlacard').addEventListener('click',()=>{
 if(!placard)return;
 const content=JSON.stringify(placard,null,2);
 const blob=new Blob([content],{type:'application/json;charset=utf-8'});
 const url=URL.createObjectURL(blob),link=node('a');
 link.href=url;link.download='museum-attention-visitor-placard.json';
 document.body.append(link);link.click();link.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
 el('formStatus').textContent=t('exported');
});
el('locale').addEventListener('change',()=>{
 language=Object.hasOwn(translations,el('locale').value)?el('locale').value:'ru';localize();
});
const q=new URLSearchParams(location.search).get('lang');
language=Object.hasOwn(translations,q)?q:'ru';localize();
