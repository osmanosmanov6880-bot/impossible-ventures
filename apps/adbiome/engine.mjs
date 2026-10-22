/**
 * AdBiome creative DNA. Deterministic recombination of five editorial
 * components. Text prompts are hypotheses, not verified claims or predicted
 * performance. No user content is stored remotely.
 */
export const VERSION='adbiome-v1';
export const GENE_KEYS=Object.freeze(['promise','proof','tension','voice','action']);
export const OPTIONS=Object.freeze({
  promise:Object.freeze(['clarity','control','time','trust']),
  proof:Object.freeze(['demo','case','audit','comparison']),
  tension:Object.freeze(['friction','waste','uncertainty','change']),
  voice:Object.freeze(['direct','warm','bold','quiet']),
  action:Object.freeze(['explore','request','test','compare'])
});
const vocabulary={
 ru:{
  promise:{clarity:'Сделайте сложное понятным.',control:'Верните себе контроль над процессом.',time:'Освободите время для важного.',trust:'Постройте доверие через прозрачность.'},
  tension:{friction:'Когда согласования мешают движению',waste:'Когда ресурсы уходят на повторную работу',uncertainty:'Когда следующий шаг неочевиден',change:'Когда привычный способ больше не подходит'},
  proof:{demo:'Продемонстрируйте сценарий и его ограничения.',case:'Представьте реальный кейс только с разрешением и проверяемыми фактами.',audit:'Покажите доступный для проверки отчёт или методологию.',comparison:'Сравните варианты по заранее выбранному честному критерию.'},
  voice:{direct:'Коротко. Проверяемо. Без лишних обещаний.',warm:'С заботой об опыте реальных людей.',bold:'Неожиданный вопрос вместо громкого превосходства.',quiet:'Спокойная история вместо давления.'},
  action:{explore:'Узнать подробнее',request:'Запросить демонстрацию',test:'Попробовать на своём примере',compare:'Сравнить решения'}
 },
 en:{
  promise:{clarity:'Make the complex understandable.',control:'Take control of your process.',time:'Make space for work that matters.',trust:'Build trust through transparency.'},
  tension:{friction:'When approvals get in the way',waste:'When valuable time goes to repeated work',uncertainty:'When the next step is unclear',change:'When old methods stop working'},
  proof:{demo:'Demonstrate the workflow and its limitations.',case:'Show a real case with permission and checkable evidence.',audit:'Publish a report or methodology people can verify.',comparison:'Compare alternatives against a fair, declared standard.'},
  voice:{direct:'Clear. Checkable. No inflated promises.',warm:'Built around the experience of real people.',bold:'An unexpected question instead of an unearned superlative.',quiet:'A calm story without pressure.'},
  action:{explore:'Explore the idea',request:'Request a demonstration',test:'Try it with your own example',compare:'Compare alternatives'}
 },
 zh:{
  promise:{clarity:'让复杂变得清晰。',control:'重新掌控工作流程。',time:'为重要工作留出时间。',trust:'用透明建立信任。'},
  tension:{friction:'当审批妨碍进展时',waste:'当时间被重复工作消耗时',uncertainty:'当下一步并不清晰时',change:'当旧方法不再适用时'},
  proof:{demo:'展示流程及其限制。',case:'仅在获得许可并核实事实后展示真实案例。',audit:'提供可供审查的报告或方法。',comparison:'以预先说明的公正标准比较方案。'},
  voice:{direct:'简洁、可核查、没有夸大。',warm:'关注真实用户的体验。',bold:'用意想不到的问题代替无依据的最高级表述。',quiet:'用平静的故事代替压力。'},
  action:{explore:'了解详情',request:'申请产品演示',test:'用自己的情况试一试',compare:'比较不同方案'}
 }
};
function norm(text,label,max){
 if(typeof text!=='string')throw new TypeError(label+' must be text');
 const val=text.trim().replace(/\s+/gu,' ');
 if(val.length<3||val.length>max)throw new RangeError(label+' must be 3–'+max+' characters');
 return val;
}
function validateGenes(source){
 if(!source||typeof source!=='object'||Array.isArray(source))throw new TypeError('Genes object required');
 const genes={};
 for(const key of GENE_KEYS){
   if(!OPTIONS[key].includes(source[key]))throw new RangeError('Invalid gene: '+key);
   genes[key]=source[key];
 }
 return Object.freeze(genes);
}
function hash(text){
 let h=2166136261>>>0;
 for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}
 return h.toString(16).padStart(8,'0');
}
function construct(brand,audience,genes,history){
 return Object.freeze({
   kind:'adbiome-genome',version:VERSION,brand,audience,
   genes:validateGenes(genes),
   id:hash(JSON.stringify([brand,audience,genes])),
   lineage:Object.freeze([...history]),
   assertionsVerified:false,
   actualPerformanceMeasured:false
 });
}
export function createGenome({brand,audience,genes}={}){
 return construct(norm(brand,'Brand',140),norm(audience,'Audience',240),genes,[{type:'origin'}]);
}
export function mutateGenome(genome,gene){
 if(!genome||genome.kind!=='adbiome-genome')throw new TypeError('Valid genome required');
 if(!GENE_KEYS.includes(gene))throw new RangeError('Invalid gene key');
 const options=OPTIONS[gene],index=options.indexOf(genome.genes[gene]);
 const next={...genome.genes,[gene]:options[(index+1)%options.length]};
 return construct(genome.brand,genome.audience,next,[...genome.lineage,{type:'mutation',gene,from:genome.id}]);
}
export function crossbreedGenomes(left,right){
 if(!left||!right||left.kind!=='adbiome-genome'||right.kind!=='adbiome-genome')throw new TypeError('Two genomes required');
 if(left.brand!==right.brand||left.audience!==right.audience)throw new RangeError('Genomes must belong to same brand/audience');
 const genes={};
 GENE_KEYS.forEach((key,index)=>{genes[key]=index%2===0?left.genes[key]:right.genes[key];});
 return construct(left.brand,left.audience,genes,[{type:'crossbreed',parents:[left.id,right.id]}]);
}
export function renderGenome(genome,language='ru'){
 if(!genome||genome.kind!=='adbiome-genome')throw new TypeError('Valid genome required');
 const lang=Object.hasOwn(vocabulary,language)?language:'ru';
 const dict=vocabulary[lang],g=genome.genes;
 return Object.freeze({
  language:lang,
  headline:dict.promise[g.promise],
  tension:dict.tension[g.tension],
  proofInstruction:dict.proof[g.proof],
  voiceDirection:dict.voice[g.voice],
  cta:dict.action[g.action],
  brand:genome.brand,
  audience:genome.audience,
  disclosure:'Creative component composition; user must independently verify evidence, legal claims and results.'
 });
}
export function genomeDistance(a,b) {
 if(!a||!b)return 0;
 return GENE_KEYS.filter(key=>a.genes[key]!==b.genes[key]).length;
}
