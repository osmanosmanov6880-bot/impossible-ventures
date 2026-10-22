import {modelCampaignEconomics,toScenarioCSV,ECONOMICS_VERSION} from './engine.mjs';

const langs={
 ru:{
 commercial:'COMMERCIAL COMMAND ↗',overline:'КОММЕРЧЕСКАЯ МАТЕМАТИКА БЕЗ ВЫДУМАННЫХ ДОХОДОВ.',
 hero1:'Идея — это мало.',hero2:'Нужна экономика.',
 intro:'Сколько стоит один покупатель при заданных CPM, CTR, конверсии и марже? Изменяйте допущения и сравнивайте три сценария. Система считает, но не придумывает продажи.',
 tag1:'03 СЦЕНАРИЯ',tag2:'07 ПЕРЕМЕННЫХ',tag3:'0 ПОДТВЕРЖДЁННЫХ ПЛАТЕЖЕЙ',
 stage:'01 / ЗАДАЙТЕ ДОПУЩЕНИЯ',inputsTitle:'Параметры рекламной кампании.',
 inputsDesc:'Введите числа из собственного плана. CTR и конверсия в оплату — предположения, если у вас ещё нет измеренных данных.',
 currency:'Валюта',budget:'Рекламный бюджет / месяц',cpm:'CPM — цена 1000 показов',
 ctr:'CTR — доля кликов, %',conversion:'Конверсия клика в покупку, %',
 aov:'Средний оплаченный заказ',margin:'Валовая маржа, %',ops:'Прочие расходы / месяц',
 notice:'Модель предполагает один оплаченный заказ на конверсию и постоянную стоимость тысячи показов. Не включает налоги, возвраты, задержки платежей и влияние атрибуции. Не используется для реального списания средств.',
 calculate:'ПОСЧИТАТЬ 3 СЦЕНАРИЯ ↗',resultsLabel:'МОДЕЛЬ / 100% ДОПУЩЕНИЯ',
 emptyTitle:'Пока нет расчёта.',emptyText:'Нажмите «Посчитать», чтобы увидеть три сценария, условную стоимость покупателя и точку безубыточности.',
 threeTitle:'Три возможных сценария.',modelDisclaimer:'Все числа ниже — результаты формул при ваших допущениях. Это не реальные показы, конверсии, продажи и прибыль.',
 breakEven:'ТОЧКА БЕЗУБЫТОЧНОСТИ / БАЗА',distribution:'СРАВНЕНИЕ СЦЕНАРИЕВ',
 exportJson:'СКАЧАТЬ JSON ↓',exportCsv:'СКАЧАТЬ CSV ↓',
 p1Title:'Формула видна.',p1Text:'Показы = бюджет / CPM × 1000. Покупки = клики × конверсия. Доход = покупки × чек.',
 p2Title:'Сценарий — не прогноз.',p2Text:'Осторожный и оптимистичный варианты изменяют CTR и конверсию математическими множителями, а не реальными наблюдениями.',
 p3Title:'Проверяйте на пилотах.',p3Text:'Используйте рассчитанные пороги в настоящем A/B-эксперименте с согласием. Не выдавайте модель за прибыль.',
 openLab:'EXPERIMENT LAB ↗',footer:'Никакой финансовый результат не подтверждается без документов и платежей',privacy:'Обработка данных ↗',
 cautious:'ОСТОРОЖНЫЙ',base:'БАЗОВЫЙ',stretch:'ОПТИМИСТИЧНЫЙ',
 contribution:'Расчётный остаток после затрат',orders:'Условные заказы',revenue:'Условная выручка',
 cost:'Плановые общие затраты',cac:'Модельная стоимость заказа',ratio:'Выручка / рекламный бюджет',
 needOrders:'Заказов для безубыточности',needConversion:'Минимальная конверсия покупки при базовом CTR',
 never:'Не рассчитывается',incomeLabel:'УСЛОВНЫЙ ДЕНЕЖНЫЙ РЕЗУЛЬТАТ',
 warningTitle:'ВАЖНЫЕ ОГРАНИЧЕНИЯ',
 zeroAssumedConversion:'При нулевой предполагаемой конверсии не будет ни одной модельной покупки.',
 zeroGrossMargin:'При нулевой валовой марже безубыточность недостижима при положительных расходах.',
 breakEvenImpossibleUnderAssumptions:'Необходимая для безубыточности конверсия превышает 100%: текущая модель экономически невозможна.',
 zeroAssumedClicks:'При нулевом CTR отсутствуют условные клики и покупки.',
 noWarnings:'Нет специальных математических предупреждений. Это не означает, что кампания будет прибыльной.',
 inputError:'Проверьте введённые числа и ограничения полей.',
 saved:'Сценарии сохранены на ваше устройство. Это не фактическая отчётность.'
 },
 en:{
 commercial:'COMMERCIAL COMMAND ↗',overline:'COMMERCIAL MATH WITHOUT INVENTED SALES.',
 hero1:'Ideas need',hero2:'unit economics.',
 intro:'What would acquisition cost at the CPM, CTR, purchase conversion and margin you assume? Edit your assumptions and compare three mathematically distinct cases — no fabricated sales.',
 tag1:'03 SCENARIOS',tag2:'07 USER INPUTS',tag3:'0 VERIFIED PAYMENTS',
 stage:'01 / ENTER ASSUMPTIONS',inputsTitle:'Campaign planning variables.',
 inputsDesc:'Use your own input assumptions. CTR and paid-purchase conversions are not measured unless you independently establish them.',
 currency:'Currency',budget:'Monthly media budget',cpm:'CPM — cost per 1000 impressions',
 ctr:'Assumed CTR, %',conversion:'Click-to-purchase conversion, %',
 aov:'Average paid order value',margin:'Gross margin, %',ops:'Other monthly operating costs',
 notice:'Model assumes one paid order per conversion and constant CPM. Taxes, refunds, payment delays and attribution errors are excluded. No actual ad spend is initiated.',
 calculate:'MODEL 3 SCENARIOS ↗',resultsLabel:'MODEL / 100% ASSUMPTIONS',
 emptyTitle:'No forecast yet.',emptyText:'Click model to compare hypothetical acquisition, contribution and break-even scenarios.',
 threeTitle:'Three possible modeled cases.',modelDisclaimer:'All values below derive from your input assumptions; they are NOT observed impressions, purchases, payments or profit.',
 breakEven:'BREAK-EVEN THRESHOLD / BASE',distribution:'SCENARIO COMPARISON',
 exportJson:'EXPORT JSON ↓',exportCsv:'EXPORT CSV ↓',
 p1Title:'Transparent arithmetic.',p1Text:'Impressions = budget / CPM × 1000; orders = clicks × conversion; modeled revenue = orders × order value.',
 p2Title:'Scenarios ≠ forecasts.',p2Text:'Cautious and stretch cases adjust CTR and purchase rate by declared multipliers, not measured confidence intervals.',
 p3Title:'Validate with real pilots.',p3Text:'Take the modeled break-even threshold to a consent-based A/B experiment. Do not claim theoretical revenue as collected.',
 openLab:'EXPERIMENT LAB ↗',footer:'No financial outcome is verified without payment and campaign evidence',privacy:'Data handling ↗',
 cautious:'CAUTIOUS',base:'BASE',stretch:'STRETCH',
 contribution:'Modeled contribution after costs',orders:'Modeled orders',revenue:'Modeled revenue',
 cost:'Planned combined spend',cac:'Modeled cost per acquisition',ratio:'Revenue / media budget',
 needOrders:'Orders needed to break even',needConversion:'Purchase rate needed at base CTR',
 never:'Not calculable',incomeLabel:'HYPOTHETICAL FINANCIAL OUTCOME',
 warningTitle:'IMPORTANT MATHEMATICAL LIMITS',
 zeroAssumedConversion:'An assumed zero purchase conversion creates no modeled orders.',
 zeroGrossMargin:'With zero gross margin, break-even is unavailable under positive spending.',
 breakEvenImpossibleUnderAssumptions:'Break-even purchase conversion exceeds 100% and is impossible under these assumptions.',
 zeroAssumedClicks:'Zero assumed CTR means no modeled clicks or purchases.',
 noWarnings:'No special mathematical flags. This is not evidence that the campaign will be profitable.',
 inputError:'Check the numeric values and their allowed ranges.',
 saved:'Scenario file saved locally. It is not accounting or verified revenue.'
 },
 zh:{
 commercial:'COMMERCIAL COMMAND ↗',overline:'真实的数学，不虚构销售。',
 hero1:'创意之外，',hero2:'还需要经济模型。',
 intro:'根据假设的 CPM、CTR、购买转化率和毛利率，计算获取一个顾客的成本。比较三个纯数学场景，不虚构销售。',
 tag1:'03 种情景',tag2:'07 个输入参数',tag3:'0 笔已验证付款',
 stage:'01 / 输入假设',inputsTitle:'广告活动的经济参数。',
 inputsDesc:'请输入自己的假设。没有独立测量时，点击率和付费购买转化率都不是实际数据。',
 currency:'币种',budget:'每月广告预算',cpm:'千次展示费用 CPM',
 ctr:'假设点击率 CTR，%',conversion:'点击后购买转化率，%',
 aov:'平均付费订单金额',margin:'毛利率，%',ops:'其他每月运营支出',
 notice:'模型假设每次转化对应一笔付费订单且 CPM 不变。不包括税收、退款、支付延迟和归因误差，不会产生真实广告费用。',
 calculate:'计算 3 种情景 ↗',resultsLabel:'数学模型 / 完全基于假设',
 emptyTitle:'尚无计算结果。',emptyText:'输入参数并开始建模，查看获客成本、毛利贡献和收支平衡。',
 threeTitle:'三种可能的数学情景。',modelDisclaimer:'以下全部数字源自输入假设，并非实际展示、购买、付款或利润。',
 breakEven:'收支平衡门槛 / 基准',distribution:'情景对比',
 exportJson:'导出 JSON ↓',exportCsv:'导出 CSV ↓',
 p1Title:'透明的公式。',p1Text:'展示量 = 预算 ÷ CPM × 1000；订单 = 点击 × 转化率；收入模型 = 订单 × 客单价。',
 p2Title:'情景不是预测。',p2Text:'谨慎与乐观情景使用公开的倍率调整参数，并非基于统计置信区间。',
 p3Title:'用真实试点验证。',p3Text:'将门槛用于获得同意的 A/B 实验，不要把理论收入当成已收款。',
 openLab:'EXPERIMENT LAB ↗',footer:'没有付款与活动证据，不能确认任何金融成果',privacy:'数据处理说明 ↗',
 cautious:'谨慎',base:'基准',stretch:'乐观',
 contribution:'扣除支出后的模型贡献',orders:'模型订单数',revenue:'模型收入',
 cost:'计划总支出',cac:'模型获客成本',ratio:'模型收入 / 媒体预算',
 needOrders:'达到收支平衡所需订单',needConversion:'在基准 CTR 下所需购买转化率',
 never:'无法计算',incomeLabel:'假设的财务结果',
 warningTitle:'重要数学限制',
 zeroAssumedConversion:'假设的购买转化率为零，因此模型订单为零。',
 zeroGrossMargin:'毛利率为零且支出为正时无法收支平衡。',
 breakEvenImpossibleUnderAssumptions:'收支平衡所需购买转化率超过 100%，当前假设无法实现。',
 zeroAssumedClicks:'假设点击率为零，所以没有模型点击和订单。',
 noWarnings:'没有特殊数学警告，不代表广告活动一定有利润。',
 inputError:'请检查数值和输入范围。',
 saved:'情景文件已保存到本地，不代表真实账目或收入。'
 }
};
const el=id=>document.getElementById(id);
const inputKeys=['monthlyMediaBudget','cpm','ctrPercent','purchaseConversionPercent',
 'averageOrderValue','grossMarginPercent','monthlyOperatingCost'];
let language='ru',current=null;
const t=name=>langs[language][name]??langs.en[name]??name;
function make(tag,className,txt){
 const n=document.createElement(tag);if(className)n.className=className;
 if(txt!==undefined)n.textContent=String(txt);
 return n;
}
function fmtNumber(n,fraction=2){
 if(n===null||n===undefined)return t('never');
 return new Intl.NumberFormat(language==='zh'?'zh-CN':language,{
  maximumFractionDigits:fraction,minimumFractionDigits:0
 }).format(n);
}
function money(v){
 if(v===null||v===undefined)return t('never');
 try{
   return new Intl.NumberFormat(language==='zh'?'zh-CN':language,{
     style:'currency',currency:current.currency,maximumFractionDigits:2
   }).format(v);
 }catch{return fmtNumber(v)+' '+current.currency;}
}
function translate(){
 document.documentElement.lang=language==='zh'?'zh-CN':language;
 el('locale').value=language;
 for(const node of document.querySelectorAll('[data-i18n]'))node.textContent=t(node.dataset.i18n);
 if(current)render();
}
function row(label,value){
 const container=make('p','');
 container.append(make('span','metric-note',label+' · '),make('strong','',value));
 return container;
}
function render(){
 const report=current;if(!report)return;
 el('empty').hidden=true;el('results').hidden=false;
 const cards=el('scenarioCards');cards.replaceChildren();
 const compare=el('scenarioBars');compare.replaceChildren();
 const baseline=report.scenarios[1],absolute=Math.max(
  1,...report.scenarios.map(x=>Math.abs(x.modeledNetContribution))
 );
 for(const s of report.scenarios){
  const card=make('article','scenario-card');card.dataset.scenario=s.scenario;
  card.append(make('div','eyebrow',t(s.scenario)),make('strong','',money(s.modeledNetContribution)));
  card.append(row(t('orders'),fmtNumber(s.modeledOrders)));
  card.append(row(t('revenue'),money(s.modeledRevenue)));
  card.append(row(t('cac'),money(s.modeledAcquisitionCost)));
  card.append(row(t('ratio'),fmtNumber(s.modeledRevenueToMediaSpendRatio)+'×'));
  cards.append(card);
  const bar=make('div','bar');bar.style.width=(Math.abs(s.modeledNetContribution)/absolute*100)+'%';
  const track=make('div','bar-track');track.append(bar);
  const barRow=make('div','bar-row');
  barRow.append(make('span','',t(s.scenario)),track,make('strong','',money(s.modeledNetContribution)));
  compare.append(barRow);
 }
 const threshold=el('breakEvenCard');threshold.replaceChildren();
 threshold.append(make('div','eyebrow',t('needOrders')),
  make('div','large-number',baseline.breakEvenOrders===null?t('never'):fmtNumber(baseline.breakEvenOrders)),
  row(t('needConversion'),baseline.breakEvenPurchaseConversionPercent===null?t('never'):
    fmtNumber(baseline.breakEvenPurchaseConversionPercent)+'%'),
  row(t('cost'),money(baseline.plannedMonthlyCost)));
 const warnings=el('warnings');warnings.replaceChildren();
 warnings.append(make('strong','',t('warningTitle')));
 const list=make('ul','warning-list');
 const messages=report.warnings.length?report.warnings:['noWarnings'];
 for(const key of messages)list.append(make('li','',t(key)));
 warnings.append(list);
}
function download(text,filename,mime){
 const url=URL.createObjectURL(new Blob([text],{type:mime}));
 const a=make('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
 el('exportStatus').textContent=t('saved');
}
el('modelForm').addEventListener('submit',event=>{
 event.preventDefault();
 if(!event.target.reportValidity())return;
 const values={currency:el('currency').value};
 for(const key of inputKeys)values[key]=Number(el(key).value);
 try{
  current=modelCampaignEconomics(values);
  el('inputStatus').textContent='';el('exportStatus').textContent='';
  render();el('results').scrollIntoView({behavior:'smooth',block:'nearest'});
 }catch{el('inputStatus').textContent=t('inputError');}
});
el('jsonExport').addEventListener('click',()=>{
 if(current)download(JSON.stringify(current,null,2),'iv-campaign-economics-what-if.json','application/json;charset=utf-8');
});
el('csvExport').addEventListener('click',()=>{
 if(current)download(toScenarioCSV(current),'iv-campaign-economics-what-if.csv','text/csv;charset=utf-8');
});
el('locale').addEventListener('change',()=>{
 language=Object.hasOwn(langs,el('locale').value)?el('locale').value:'ru';translate();
});
const query=new URLSearchParams(location.search).get('lang');
language=Object.hasOwn(langs,query)?query:'ru';
translate();
// Render a transparent example on first load. Values are visibly editable assumptions.
el('modelForm').requestSubmit();
