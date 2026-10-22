/**
 * Museum of Attention: a speculative interactive exhibition.
 * All dates, objects and installations are FICTION, not real artifacts or
 * cultural history claims. Local guest placards are never uploaded.
 */
export const VERSION='museum-of-attention-v1';
const records=[
 {id:'the-last-banner',era:'2030s',type:'interactive',symbol:'◎'},
 {id:'quiet-signal',era:'2040s',type:'sound',symbol:'◈'},
 {id:'consent-archive',era:'2040s',type:'archive',symbol:'▦'},
 {id:'attention-garden',era:'2050s',type:'spatial',symbol:'✳'}
];
export const ERAS=Object.freeze(['all','2030s','2040s','2050s']);
export const MEDIUMS=Object.freeze(['interactive','sound','archive','spatial']);
export const EXHIBITS=Object.freeze(records.map(x=>Object.freeze({...x,fictional:true})));
const copy={
 ru:{
  'the-last-banner':['Последний баннер','2030-е / Воображаемый цифровой артефакт','Экспонат представляет мир, где каждое рекламное место превратилось в приглашение выбрать. Ничего здесь не основано на документированной истории.','Какую рекламу можно оставить без потери смысла?'],
  'quiet-signal':['Тихий сигнал','2040-е / Художественная гипотеза','В вымышленной экспозиции города отказались от громких кампаний. Вместо них — тихие символы, срабатывающие только по желанию посетителя.','Может ли ненавязчивое сообщение заслужить внимание?'],
  'consent-archive':['Архив согласия','2040-е / Спекулятивный архив','Этот будущий музей хранит невымышленные вопросы и вымышленные интерфейсы: кто выбирает момент контакта и кто может отказаться?','Как выглядела бы реклама, которая принимает «нет»?'],
  'attention-garden':['Сад внимания','2050-е / Фантастическая среда','Фантазийный сад реагирует на внимание не продажей, а новыми оттенками света. Он показывает альтернативу агрессивному захвату внимания.','Что изменится, если метрикой станет добровольное участие?']
 },
 en:{
  'the-last-banner':['The Last Banner','2030s / Imagined digital artifact','This exhibit imagines a world where every ad placement became an invitation to choose. It does not represent documented history.','What advertising could disappear without losing meaning?'],
  'quiet-signal':['The Quiet Signal','2040s / Artistic hypothesis','In this fictional city, campaigns no longer shout. Gentle symbols appear only when viewers want them.','Can a subtle message earn genuine attention?'],
  'consent-archive':['The Consent Archive','2040s / Speculative archive','A future museum displays imagined interfaces alongside real questions: who controls contact and how can someone say no?','What would advertising look like if it respected refusal?'],
  'attention-garden':['The Attention Garden','2050s / Fictional environment','An imagined garden responds to attention with color instead of purchases, offering a metaphor for voluntary participation.','What if the metric were willingly given attention?']
 },
 zh:{
  'the-last-banner':['最后一条横幅广告','2030 年代 / 虚构数字文物','这件作品想象了广告位变成自愿选择入口的未来，并非真实历史记录。','哪些广告可以消失，而信息本身仍然有意义？'],
  'quiet-signal':['安静的信号','2040 年代 / 艺术假设','在虚构的城市里，广告不再喧闹。温和的符号只在观众愿意时出现。','克制的信息能赢得真正的关注吗？'],
  'consent-archive':['同意档案馆','2040 年代 / 推想档案','未来博物馆展示虚构界面，并提出真实问题：谁决定接触时机？如何拒绝？','尊重拒绝的广告会是什么样？'],
  'attention-garden':['注意力花园','2050 年代 / 虚构环境','一座幻想花园以颜色而不是购买回应关注，象征自愿参与的另一种可能。','如果指标是自愿付出的关注，会怎样？']
 }
};
function clean(value,label,max,min=3) {
 if(typeof value!=='string')throw new TypeError(label+' must be text');
 const result=value.trim().replace(/\s+/gu,' ');
 if(result.length<min||result.length>max)throw new RangeError(label+' must be '+min+'–'+max+' characters');
 return result;
}
export function listExhibits({era='all',language='ru'}={}) {
 if(!ERAS.includes(era))throw new RangeError('Invalid era');
 const lang=Object.hasOwn(copy,language)?language:'ru';
 return EXHIBITS.filter(x=>era==='all'||x.era===era).map(x=>Object.freeze({
  ...x,title:copy[lang][x.id][0],periodLabel:copy[lang][x.id][1],
  story:copy[lang][x.id][2],question:copy[lang][x.id][3],
  source:'original speculative fiction'
 }));
}
export function createPlacard({year,title,medium,interpretation}={}) {
 const n=Number(year);
 if(!Number.isInteger(n)||n<2030||n>2099)throw new RangeError('Year must be between 2030 and 2099');
 if(!MEDIUMS.includes(medium))throw new RangeError('Invalid exhibit medium');
 return Object.freeze({
  kind:'museum-attention-guest-placard',version:VERSION,year:n,
  title:clean(title,'Title',140),
  medium,interpretation:clean(interpretation,'Interpretation',1200,20),
  fictional:true,humanAuthored:true,published:false,
  noVerificationClaim:true
 });
}
