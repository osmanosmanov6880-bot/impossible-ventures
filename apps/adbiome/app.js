import {createGenome,mutateGenome,crossbreedGenomes,renderGenome,genomeDistance,GENE_KEYS,VERSION} from './engine.mjs';

const translations={
ru:{
 alpha:'ДВИЖОК КОНЦЕПЦИЙ / RULE-BASED',theatreLink:'BRIEF THEATRE ↗',kicker:'ЭВОЛЮЦИЯ НЕ РАВНА ПОБЕДЕ. ОНА ДАЁТ ВАРИАНТЫ.',
 titleA:'У рекламы',titleB:'есть ДНК.',
 lead:'Соберите концепцию из пяти составляющих. Меняйте один ген, скрещивайте две версии и получите реальные отличающиеся сценарии — без выдуманных конверсий.',
 tagA:'05 ГЕНОВ',tagB:'01 МУТАЦИЯ ЗА ШАГ',tagC:'СРАВНЕНИЕ ДНК',
 labTitle:'01 / СОЗДАЙТЕ ГЕНОМ',createTitle:'Пять генов креатива.',createHint:'Каждый ген влияет на текст. Доказательство здесь — направление для проверки, не подтверждённый факт.',
 brand:'Продукт или бренд',brandHint:'Aurora Studio',audience:'Для кого предложение',audienceHint:'Команды небольших агентств',
 promise:'Обещание',proof:'Направление доказательства',tension:'Проблема аудитории',voice:'Тональность',action:'Призыв к действию',
 gClarity:'Ясность',gControl:'Контроль',gTime:'Время',gTrust:'Доверие',
 gDemo:'Демонстрация',gCase:'Кейс',gAudit:'Отчёт',gComparison:'Сравнение',
 gFriction:'Сложный процесс',gWaste:'Потери ресурсов',gUncertainty:'Неопределённость',gChange:'Перемены',
 gDirect:'Прямо',gWarm:'Тепло',gBold:'Смело',gQuiet:'Спокойно',
 gExplore:'Узнать',gRequest:'Запросить демо',gTest:'Попробовать',gCompare:'Сравнить',
 localNote:'Без AI и внешней обработки идей',create:'СОЗДАТЬ ПЕРВЫЙ ГЕНОМ ↗',
 evolutionLabel:'02 / ЭВОЛЮЦИЯ',mutateSource:'Геном-источник',mutationLabel:'Что изменить?',
 mutateButton:'МУТИРОВАТЬ ОДИН ГЕН ↗',mutateExplain:'Мутация меняет ровно один ген и сохраняет происхождение варианта.',
 breedLabel:'03 / СКРЕЩИВАНИЕ',parentA:'Геном A',parentB:'Геном B',crossbreedButton:'СОЗДАТЬ ГИБРИД ↗',
 resultsLabel:'ДНК / ЖИВАЯ БИБЛИОТЕКА',emptyTitle:'Пока нет геномов.',emptyDescription:'Выберите пять творческих признаков. Затем исследуйте их мутации и гибриды.',
 variantsTitle:'Библиотека вариантов.',variants:'ВАРИАНТОВ',unique:'УНИКАЛЬНЫХ ДНК',distance:'ОТЛИЧИЙ ОТ ОСНОВЫ',
 notMetrics:'Это реальные различия в пяти текстовых генах, а не статистика показов, CTR или продаж.',
 previewLabel:'ТЕКУЩАЯ КОНЦЕПЦИЯ',exportDNA:'СКАЧАТЬ ДНК .JSON ↓',reviewLink:'ПРОВЕРИТЬ ИДЕЮ ↗',
 p1Title:'Меняйте по одному.',p1Text:'Поймите, какая часть сообщения изменена и почему новая версия отличается.',
 p2Title:'Скрещивайте осмысленно.',p2Text:'Гибрид получает гены от двух уже существующих вариантов без подмены аудитории.',
 p3Title:'Эволюция не равна успеху.',p3Text:'Каждая версия — гипотеза. Сравнивайте её эффективность только после честного теста.',
 footerText:'Нет регистрации, модели и оплаченных рекламных показов',privacyLink:'Данные и приватность ↗',
 view:'ОТКРЫТЬ',origin:'ОРИГИНАЛ',mutation:'МУТАЦИЯ',crossbreed:'ГИБРИД',noVariants:'Создайте исходный геном.',
 duplicate:'Такой набор генов уже существует. Выберите другой ген или родителей.',
 limit:'Максимум 12 вариантов в одном локальном сеансе.',
 parentError:'Выберите два разных генома для скрещивания.',
 saved:'Библиотека генов экспортирована локально.',formError:'Введите корректный бренд, аудиторию и пять генов.',
 proofNote:'Направление доказательства',voiceNote:'Тональность',human:'Все фактические утверждения должны быть проверены человеком.',
 compareCaption:'СТРУКТУРНЫЕ ОТЛИЧИЯ ДНК',variantTitle:'ВАРИАНТ'
 },
en:{
 alpha:'RULE-BASED CREATIVE RESEARCH',theatreLink:'BRIEF THEATRE ↗',kicker:'EVOLUTION DOES NOT EQUAL SUCCESS. IT CREATES CHOICES.',
 titleA:'Advertising',titleB:'has DNA.',
 lead:'Combine five creative traits. Mutate a single gene, cross two variants and see genuinely different editorial directions — without invented conversions.',
 tagA:'05 GENES',tagB:'01 GENE PER MUTATION',tagC:'DNA COMPARISON',
 labTitle:'01 / CREATE A GENOME',createTitle:'Five genes of creative.',createHint:'Each gene changes the text. Evidence here is a prompt for investigation, never a verified fact.',
 brand:'Product or brand',brandHint:'Aurora Studio',audience:'Audience',audienceHint:'Independent agency teams',
 promise:'Promise',proof:'Evidence direction',tension:'Audience tension',voice:'Voice',action:'Call to action',
 gClarity:'Clarity',gControl:'Control',gTime:'Time',gTrust:'Trust',
 gDemo:'Demonstration',gCase:'Case study',gAudit:'Report',gComparison:'Comparison',
 gFriction:'Process friction',gWaste:'Resource waste',gUncertainty:'Uncertainty',gChange:'Change',
 gDirect:'Direct',gWarm:'Warm',gBold:'Bold',gQuiet:'Quiet',
 gExplore:'Explore',gRequest:'Request a demo',gTest:'Try it',gCompare:'Compare',
 localNote:'No model or external campaign processing',create:'CREATE FIRST GENOME ↗',
 evolutionLabel:'02 / EVOLUTION',mutateSource:'Source genome',mutationLabel:'Which gene?',
 mutateButton:'MUTATE ONE GENE ↗',mutateExplain:'A mutation changes exactly one gene and records its parent.',
 breedLabel:'03 / CROSSBREED',parentA:'Genome A',parentB:'Genome B',crossbreedButton:'CREATE A HYBRID ↗',
 resultsLabel:'DNA / LIVE LIBRARY',emptyTitle:'No genomes yet.',emptyDescription:'Choose five creative traits. Then explore mutations and hybrids.',
 variantsTitle:'Variant library.',variants:'VARIANTS',unique:'UNIQUE DNA',distance:'DIFFERENCES FROM ORIGINAL',
 notMetrics:'These are real differences between five text traits — not impressions, CTR or sales.',
 previewLabel:'CURRENT CREATIVE DIRECTION',exportDNA:'EXPORT DNA .JSON ↓',reviewLink:'REVIEW IN APPEAL ↗',
 p1Title:'Change one thing.',p1Text:'Understand precisely what changed and why.',
 p2Title:'Recombine intentionally.',p2Text:'A hybrid inherits genes from two existing variants without changing audience.',
 p3Title:'Evolution is not performance.',p3Text:'Each version is a hypothesis. Validate its effect only in a fair experiment.',
 footerText:'No registration, paid model calls or measured ad impressions',privacyLink:'Data and privacy ↗',
 view:'VIEW',origin:'ORIGINAL',mutation:'MUTATION',crossbreed:'HYBRID',noVariants:'Create a starting genome.',
 duplicate:'That exact DNA already exists. Try another gene or different parents.',
 limit:'Up to 12 variants per local session.',parentError:'Choose two different genomes to crossbreed.',
 saved:'DNA library exported locally.',formError:'Enter a valid brand, audience and five traits.',
 proofNote:'Evidence direction',voiceNote:'Voice direction',human:'Humans must independently verify all factual claims.',
 compareCaption:'STRUCTURAL DNA DIFFERENCES',variantTitle:'VARIANT'
 },
zh:{
 alpha:'规则驱动的创意研究',theatreLink:'BRIEF THEATRE ↗',kicker:'进化不代表成功，它带来更多选择。',
 titleA:'广告也有',titleB:'创意 DNA。',
 lead:'组合五个创意基因。一次改变一个基因，交叉两个版本，生成真正不同的编辑方向，不虚构转化数据。',
 tagA:'05 个基因',tagB:'每次突变 01 个基因',tagC:'DNA 比较',
 labTitle:'01 / 创建基因组',createTitle:'创意的五个基因。',createHint:'每个基因都影响文本。“证据”只是调查方向，并不代表已验证事实。',
 brand:'产品或品牌',brandHint:'Aurora Studio',audience:'目标受众',audienceHint:'小型创意公司团队',
 promise:'承诺',proof:'证据方向',tension:'受众痛点',voice:'语气',action:'行动号召',
 gClarity:'清晰',gControl:'掌控',gTime:'时间',gTrust:'信任',
 gDemo:'演示',gCase:'案例',gAudit:'报告',gComparison:'比较',
 gFriction:'流程阻力',gWaste:'资源浪费',gUncertainty:'不确定性',gChange:'变化',
 gDirect:'直接',gWarm:'温暖',gBold:'大胆',gQuiet:'平静',
 gExplore:'了解',gRequest:'申请演示',gTest:'尝试',gCompare:'比较',
 localNote:'无需 AI 或外部传输创意',create:'创建初始基因组 ↗',
 evolutionLabel:'02 / 进化',mutateSource:'来源基因组',mutationLabel:'修改哪个基因？',
 mutateButton:'突变一个基因 ↗',mutateExplain:'每次突变只改变一个基因，并记录来源。',
 breedLabel:'03 / 交叉',parentA:'基因组 A',parentB:'基因组 B',crossbreedButton:'创建混合变体 ↗',
 resultsLabel:'DNA / 变体库',emptyTitle:'还没有基因组。',emptyDescription:'选择五个创意特征，然后研究突变与交叉。',
 variantsTitle:'变体库。',variants:'变体数量',unique:'不同 DNA',distance:'与初始版本的差异',
 notMetrics:'这些只是五个文本基因的差异，不代表展示、点击率或销售。',
 previewLabel:'当前创意方向',exportDNA:'导出 DNA .JSON ↓',reviewLink:'在 APPEAL 中审核 ↗',
 p1Title:'每次只改变一项。',p1Text:'理解具体变化及其原因。',
 p2Title:'有意识地组合。',p2Text:'混合体继承两个现有变体的基因，不改变目标受众。',
 p3Title:'进化不代表业绩。',p3Text:'每个版本都是假设，需要公正实验才能验证效果。',
 footerText:'无需注册、付费模型或广告投放',privacyLink:'数据与隐私 ↗',
 view:'查看',origin:'原始版本',mutation:'突变',crossbreed:'混合',noVariants:'先创建初始基因组。',
 duplicate:'相同 DNA 已存在，请换一个基因或不同的父本。',
 limit:'本地会话最多 12 个变体。',parentError:'请选择两个不同的基因组。',
 saved:'DNA 库已导出到本地。',formError:'请填写有效的品牌、受众和五个基因。',
 proofNote:'证据方向',voiceNote:'语气方向',human:'所有事实性声明都需人工独立验证。',
 compareCaption:'DNA 结构差异',variantTitle:'变体'
 }
};
let language='ru';
let genomes=[];
let selected=-1;
const el=id=>document.getElementById(id);
const t=key=>translations[language][key]??translations.en[key]??key;
function create(tag,cls,text){
 const node=document.createElement(tag);
 if(cls)node.className=cls;
 if(text!==undefined)node.textContent=String(text);
 return node;
}
function setStatus(key,where='resultStatus'){
 el(where).textContent=t(key);
}
function prettyOrigin(genome){
 const type=genome.lineage.at(-1)?.type||'origin';
 return t(type);
}
function updateLanguage(){
 document.documentElement.lang=language==='zh'?'zh-CN':language;
 el('locale').value=language;
 for(const node of document.querySelectorAll('[data-i18n]'))node.textContent=t(node.dataset.i18n);
 for(const node of document.querySelectorAll('[data-placeholder]'))node.placeholder=t(node.dataset.placeholder);
 if(genomes.length)render();
}
function optionFor(genome,i){
 const option=create('option','',String(i+1).padStart(2,'0')+' / '+genome.id+' / '+prettyOrigin(genome));
 option.value=String(i);return option;
}
function setOptions(select,choice){
 select.replaceChildren();
 genomes.forEach((genome,i)=>select.append(optionFor(genome,i)));
 if(choice>=0&&choice<genomes.length)select.value=String(choice);
}
function render(){
 if(!genomes.length)return;
 el('empty').hidden=true;el('workspace').hidden=false;el('mutationLab').hidden=false;
 el('variantCount').textContent=String(genomes.length);
 el('uniqueCount').textContent=String(new Set(genomes.map(g=>g.id)).size);
 el('distanceCount').textContent=genomeDistance(genomes[0],genomes[selected])+'/5';
 setOptions(el('sourceGenome'),selected);
 setOptions(el('parentLeft'),Math.max(0,genomes.length-2));
 setOptions(el('parentRight'),genomes.length-1);
 el('crossbreed').disabled=genomes.length<2;
 const list=el('variantList');list.replaceChildren();
 genomes.forEach((genome,i)=>{
  const wrapper=create('article','card');
  const top=create('div','card-top','0'+(i+1)+' / '+prettyOrigin(genome));
  const heading=create('h3','',t('variantTitle')+' '+String(i+1).padStart(2,'0')+' · '+genome.id);
  const traitList=create('p','',GENE_KEYS.map(key=>t(key)+': '+genome.genes[key]).join(' · '));
  const btn=create('button','button ghost small',t('view'));
  btn.type='button';btn.dataset.viewGenome=String(i);
  if(i===selected)btn.setAttribute('aria-current','true');
  wrapper.append(top,heading,traitList,btn);
  list.append(wrapper);
 });
 const active=genomes[selected];
 const copy=renderGenome(active,language);
 const panel=el('creativePreview');panel.replaceChildren();
 panel.append(create('div','card-top',active.brand+' / '+active.id),
   create('h3','',copy.headline),
   create('p','quote',copy.tension),
   create('p','card-note',t('proofNote')+': '+copy.proofInstruction),
   create('p','',t('voiceNote')+': '+copy.voiceDirection),
   create('span','pill',copy.cta),
   create('p','',t('human')));
}
function append(genome){
 if(genomes.some(current=>current.id===genome.id)){setStatus('duplicate');return false;}
 if(genomes.length>=12){setStatus('limit');return false;}
 genomes.push(genome);selected=genomes.length-1;render();el('resultStatus').textContent='';return true;
}
el('genomeForm').addEventListener('submit',e=>{
 e.preventDefault();if(!e.target.reportValidity())return;
 try{
  const genes={};for(const key of GENE_KEYS)genes[key]=el(key).value;
  const genome=createGenome({brand:el('brand').value,audience:el('audience').value,genes});
  genomes=[];selected=-1;append(genome);el('formStatus').textContent='';
 }catch{setStatus('formError','formStatus')}
});
el('mutate').addEventListener('click',()=>{
 if(!genomes.length)return;
 const parent=genomes[Number(el('sourceGenome').value)];
 append(mutateGenome(parent,el('mutateGene').value));
});
el('crossbreed').addEventListener('click',()=>{
 if(genomes.length<2)return;
 const left=Number(el('parentLeft').value),right=Number(el('parentRight').value);
 if(left===right){setStatus('parentError');return}
 try{append(crossbreedGenomes(genomes[left],genomes[right]));}
 catch{setStatus('parentError')}
});
el('variantList').addEventListener('click',event=>{
 const btn=event.target.closest('[data-view-genome]');
 if(!btn)return;
 const index=Number(btn.dataset.viewGenome);
 if(Number.isInteger(index)&&genomes[index]){selected=index;render()}
});
el('exportDNA').addEventListener('click',()=>{
 if(!genomes.length)return;
 const data={kind:'adbiome-local-library',version:VERSION,brand:genomes[0].brand,audience:genomes[0].audience,
  genomes,claimsUnverified:true,measuredBusinessOutcomes:false};
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'});
 const url=URL.createObjectURL(blob),a=create('a');
 a.href=url;a.download='adbiome-dna-library.json';document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
 setStatus('saved');
});
el('locale').addEventListener('change',()=>{
 language=Object.hasOwn(translations,el('locale').value)?el('locale').value:'ru';
 updateLanguage();
});
const q=new URLSearchParams(location.search).get('lang');
language=Object.hasOwn(translations,q)?q:'ru';updateLanguage();
