const translations = {
  en: {
    topline:'THE NEW ADVERTISING EXPERIENCE',headline1:'Ads worth',headline2:'interacting with.',
    intro:'Design an interactive campaign as an experiment: define your audience, model your economics, generate a test plan, and request a real pilot. No account needed.',
    build:'BUILD PILOT PLAN ↗',demo:'TRY DEAD DROP DEMO →',worlds:'creative worlds proposed',demos:'browser demos in source',pilot:'pilot workflow in alpha',
    studio:'STRATEGY STUDIO / 01',design:'Design your first pilot.',designNote:'Every number is your assumption, not a promise. Adjust and see how the economics change.',
    parameters:'CAMPAIGN PARAMETERS',goal:'Primary goal',leadGoal:'Qualified leads',salesGoal:'Purchases',awarenessGoal:'Brand awareness',validationGoal:'Message validation',
    spend:'Total test media spend (USD)',cpm:'Estimated cost per thousand impressions (USD)',ctr:'Assumed click-through rate (%)',cvr:'Assumed conversion from visit (%)',value:'Gross value per conversion (USD)',
    modelCaveat:'Model excludes creative production, fees, returns, taxes and attribution uncertainty. This is not an ROI or sales forecast.',
    hypothesis:'MODELLED OUTCOMES / NOT ACTUAL',impressions:'Impressions',clicks:'Clicks',conversions:'Conversions',cpa:'Cost / conversion',estimate:'ESTIMATE',
    experiment:'EXPERIMENT STRUCTURE',split:'50 / 50 TRAFFIC SPLIT',control:'CONTROL / EXISTING CREATIVE',controlDesc:'Direct message, same offer and audience',
    variant:'VARIANT / INTERACTIVE STORY',variantDesc:'Narrative choice, same offer and audience',
    abNote:'This is a test design only. No uplift is assumed. Randomize assignment, keep measurement consistent, and evaluate qualified outcomes before selecting a winner.',
    export:'EXPORT EXPERIMENT PLAN ↓',commercial:'COMMERCIAL PILOT / 02',letsTest:'Ready to test with real people?',
    contactNote:'Submit a request. No payment is collected, and a submission is not a confirmed contract.',
    pilotTitle:'From concept to measurable evidence.',pilotExplain:'We propose a controlled creative pilot with baseline measurements, consent-aware data collection and a clear go/no-go decision.',
    contact1:'Agree on one outcome metric',contact2:'Prepare two comparable creatives',contact3:'Run a controlled, limited campaign',contact4:'Review genuine results together',
    privacyNote:'Please do not send confidential client information. Submitted contact details are stored on this server for up to 90 days and are accessible to an authorized operator. Keep your deletion token.',
    company:'COMPANY *',contact:'CONTACT PERSON *',email:'WORK EMAIL *',website:'WEBSITE (OPTIONAL, HTTPS)',pilotGoal:'GOAL',budget:'POTENTIAL MEDIA BUDGET',unsure:'Not decided',
    consent:'I agree to be contacted about this pilot, and to storage of the submitted details for up to 90 days. I understand I can delete the request using its deletion token.',
    request:'REQUEST PRIVATE PILOT ↗',next:'CONTINUE THE EXPERIENCE',worldHeadline:'Seven worlds. One measurable foundation.',appeal:'TRY APPEAL 2049 →',
    footer:'No payments, live AI, verified results or worldwide launch are claimed.',
    required:'Please check all required fields and consent.',unavailable:'The live pilot API is not available on this host. Use the full Node server instead of a static preview.',
    sent:'Request stored. Keep the request ID and deletion token somewhere private. These allow you to delete the request.',
    failed:'Request could not be saved. Please retry only after checking the live API.',invalid:'Enter valid model values to export the plan.',
    saving:'SENDING REQUEST…',attributedConfirmation:'The form was linked to the previous opt-in A/B experiment. This does not verify a sale.',deleteNote:'Delete your stored request via DELETE /api/v1/pilots/{ID} with Authorization: Bearer {DELETION TOKEN}.'
  },
  ru: {
    topline:'НОВОЕ ПОКОЛЕНИЕ РЕКЛАМЫ',headline1:'Реклама, с которой',headline2:'хочется взаимодействовать.',
    intro:'Спроектируйте интерактивную рекламную кампанию: определите цель, рассчитайте экономическую гипотезу, получите план эксперимента и отправьте заявку на реальный пилот. Без регистрации.',
    build:'СОЗДАТЬ ПЛАН ПИЛОТА ↗',demo:'ОТКРЫТЬ DEAD DROP →',worlds:'концепций рекламных миров',demos:'демонстрации в исходниках',pilot:'пилотный рабочий процесс',
    studio:'СТУДИЯ СТРАТЕГИИ / 01',design:'Спроектируйте первый пилот.',designNote:'Все числа — ваши предположения, не обещание. Изменяйте параметры и изучайте экономику.',
    parameters:'ПАРАМЕТРЫ КАМПАНИИ',goal:'Главная цель',leadGoal:'Качественные заявки',salesGoal:'Покупки',awarenessGoal:'Узнаваемость бренда',validationGoal:'Проверка рекламной идеи',
    spend:'Рекламный бюджет теста (USD)',cpm:'Предполагаемая цена 1000 показов (USD)',ctr:'Предполагаемый CTR (%)',cvr:'Конверсия посещений (%)',value:'Валовая ценность конверсии (USD)',
    modelCaveat:'Модель не включает производство креативов, комиссии, возвраты, налоги и неопределённость атрибуции. Это не прогноз продаж или окупаемости.',
    hypothesis:'РАСЧЁТНЫЕ ПОКАЗАТЕЛИ / НЕ ФАКТ',impressions:'Показы',clicks:'Клики',conversions:'Конверсии',cpa:'Стоимость конверсии',estimate:'ОЦЕНКА',
    experiment:'СТРУКТУРА ЭКСПЕРИМЕНТА',split:'50 / 50 РАСПРЕДЕЛЕНИЕ',control:'A / ОБЫЧНАЯ РЕКЛАМА',controlDesc:'Прямое предложение той же аудитории',
    variant:'B / ИНТЕРАКТИВНАЯ ИСТОРИЯ',variantDesc:'Сюжет и выбор с тем же предложением',
    abNote:'Это только план теста. Преимущество ни одного варианта не предполагается. Случайно распределяйте трафик и сравнивайте реальные целевые действия.',
    export:'СКАЧАТЬ ПЛАН ЭКСПЕРИМЕНТА ↓',commercial:'КОММЕРЧЕСКИЙ ПИЛОТ / 02',letsTest:'Готовы проверить на реальной аудитории?',
    contactNote:'Отправьте заявку. Оплаты нет, заявка не означает заключение договора.',
    pilotTitle:'От идеи к измеримым доказательствам.',pilotExplain:'Предлагаем ограниченный тест с исходными метриками, разумной обработкой данных и решением о дальнейшем развитии по результатам.',
    contact1:'Согласуем одну главную метрику',contact2:'Подготовим два сравнимых креатива',contact3:'Проведём контролируемый тест',contact4:'Вместе изучим реальные результаты',
    privacyNote:'Не отправляйте конфиденциальную информацию клиентов. Контактные сведения хранятся на этом сервере не более 90 дней и доступны уполномоченному оператору. Сохраните ключ удаления.',
    company:'КОМПАНИЯ *',contact:'КОНТАКТНОЕ ЛИЦО *',email:'РАБОЧАЯ ПОЧТА *',website:'САЙТ (НЕОБЯЗАТЕЛЬНО, HTTPS)',pilotGoal:'ЦЕЛЬ',budget:'ВОЗМОЖНЫЙ РЕКЛАМНЫЙ БЮДЖЕТ',unsure:'Пока не решили',
    consent:'Согласен на связь по поводу пилота и хранение указанных данных до 90 дней. Я могу удалить заявку с помощью выданного ключа.',
    request:'ОТПРАВИТЬ ЗАЯВКУ НА ПИЛОТ ↗',next:'ИССЛЕДУЙТЕ ДАЛЬШЕ',worldHeadline:'Семь миров. Единая измеримая основа.',appeal:'ОТКРЫТЬ APPEAL 2049 →',
    footer:'Оплата, реальный ИИ, подтверждённые результаты и глобальный запуск пока не заявлены.',
    required:'Проверьте обязательные поля и согласие.',unavailable:'На этом сайте сервер заявок недоступен. Для отправки запустите Node-сервер вместо статического просмотра.',
    sent:'Заявка сохранена. Сохраните ID и ключ удаления в приватном месте — они понадобятся для удаления.',
    failed:'Не удалось сохранить заявку. Проверьте подключение к API и попробуйте снова.',
    invalid:'Введите корректные параметры расчёта перед экспортом.',
    saving:'ОТПРАВКА…',attributedConfirmation:'Заявка связана с предыдущим добровольным A/B-экспериментом. Это ещё не продажа.',deleteNote:'Для удаления отправьте DELETE /api/v1/pilots/{ID} с заголовком Authorization: Bearer {КЛЮЧ УДАЛЕНИЯ}.'
  },
  zh: {
    topline:'新一代互动广告',headline1:'值得参与的',headline2:'广告体验。',
    intro:'设计互动广告实验：明确目标、估算经济模型、生成测试计划，并申请真实试点。无需注册。',
    build:'制定试点计划 ↗',demo:'体验 DEAD DROP →',worlds:'个广告世界创意',demos:'个浏览器演示',pilot:'个试点工作流程',
    studio:'战略工作室 / 01',design:'设计首个试点。',designNote:'所有数字均为您的假设，而非承诺。请调整参数。',
    parameters:'广告参数',goal:'主要目标',leadGoal:'有效线索',salesGoal:'购买',awarenessGoal:'品牌认知',validationGoal:'验证创意',
    spend:'测试广告预算 (USD)',cpm:'每千次展示预估成本 (USD)',ctr:'假设点击率 (%)',cvr:'假设访问转化率 (%)',value:'每次转化的总价值 (USD)',
    modelCaveat:'模型不包含制作费、平台费、退货、税费及归因误差。不是销售或投资回报预测。',
    hypothesis:'模型估算 / 非实际结果',impressions:'展示量',clicks:'点击量',conversions:'转化量',cpa:'单次转化成本',estimate:'估算',
    experiment:'实验结构',split:'流量 50 / 50',control:'A / 常规广告',controlDesc:'相同受众、相同产品',variant:'B / 互动故事',variantDesc:'相同受众与产品，加入互动情节',
    abNote:'仅为实验设计，不预设提升。随机分配流量并比较真实有效的结果。',
    export:'导出实验方案 ↓',commercial:'商业试点 / 02',letsTest:'准备好与真实用户测试了吗？',
    contactNote:'提交申请。无需付款，申请不代表合同。',
    pilotTitle:'从创意走向可衡量的证据。',pilotExplain:'制定受控试验，定义基线指标，审慎处理数据，并根据结果决定是否继续。',
    contact1:'确认一个核心指标',contact2:'准备两套可比较的广告',contact3:'进行有限的受控实验',contact4:'共同审查实际结果',
    privacyNote:'请勿提交客户机密信息。联系信息在服务器保存最多90天，仅授权运营者可访问。请保留删除密钥。',
    company:'公司 *',contact:'联系人 *',email:'工作邮箱 *',website:'网站（可选，HTTPS）',pilotGoal:'目标',budget:'潜在广告预算',unsure:'尚未确定',
    consent:'我同意就此试点与我联系，并允许保存提交信息最多90天。我可以使用删除密钥删除申请。',
    request:'申请私人试点 ↗',next:'继续探索',worldHeadline:'七个世界。一个可衡量的基础。',appeal:'体验 APPEAL 2049 →',
    footer:'目前不宣称具备支付、在线AI、已验证业绩或全球部署。',
    required:'请检查必填字段和同意项。',unavailable:'此站点未启用申请服务器。请使用Node服务而非静态预览。',
    sent:'申请已保存。请妥善保管申请编号和删除密钥。',failed:'无法保存申请。请检查API连接后重试。',
    invalid:'请填写有效的参数后导出。',saving:'发送中…',attributedConfirmation:'申请已关联至之前自愿参与的 A/B 实验，这不代表销售。',deleteNote:'如需删除，请向 DELETE /api/v1/pilots/{ID} 发送 Authorization: Bearer {删除密钥}。'
  }
};

const currency = new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2});
const count = new Intl.NumberFormat('en-US',{maximumFractionDigits:0});
const langSelect=document.getElementById('language');
const planForm=document.getElementById('planForm');
const leadForm=document.getElementById('leadForm');
const feedback=document.getElementById('leadResult');
const sendButton=document.getElementById('submitLead');
const labels=()=>translations[langSelect.value]||translations.en;
function translate(){
  document.documentElement.lang=langSelect.value==='zh'?'zh-CN':langSelect.value;
  for(const node of document.querySelectorAll('[data-i18n]')){
    const translated=labels()[node.dataset.i18n];
    if(translated)node.textContent=translated;
  }
  document.title='IMPOSSIBLE VENTURES — Pilot Studio';
}
function model(){
  if(!planForm.reportValidity())return null;
  const values=Object.fromEntries(new FormData(planForm));
  const spend=Number(values.spend),cpm=Number(values.cpm),ctr=Number(values.ctr),cvr=Number(values.cvr),value=Number(values.value);
  if(![spend,cpm,ctr,cvr,value].every(Number.isFinite)||spend<100||spend>1e7||cpm<1||cpm>500||ctr<.01||ctr>20||cvr<.01||cvr>100||value<0||value>1e6)return null;
  const impressions=spend/cpm*1000, clicks=impressions*ctr/100,conversions=clicks*cvr/100;
  return {values,impressions,clicks,conversions,cpa:conversions?spend/conversions:0};
}
function renderModel(){
  const result=model();
  for(const key of ['impressions','clicks','conversions','cpa']){
    document.getElementById(key).textContent=result?(key==='cpa'?currency.format(result[key]):count.format(result[key])):'—';
  }
}
planForm.addEventListener('input',renderModel);
langSelect.addEventListener('change',()=>{translate();renderModel()});
document.getElementById('downloadPlan').addEventListener('click',()=>{
  const result=model();
  if(!result){window.alert(labels().invalid);return}
  const text=[
    'IMPOSSIBLE VENTURES — CONTROLLED CREATIVE TEST',
    'MODEL / HYPOTHESIS ONLY — NOT ACTUAL PERFORMANCE',
    'DATE: '+new Date().toISOString().slice(0,10),
    ...Object.entries(result.values).map(([key,value])=>key.toUpperCase()+': '+value),
    'MODELLED IMPRESSIONS: '+count.format(result.impressions),
    'MODELLED CLICKS: '+count.format(result.clicks),
    'MODELLED CONVERSIONS: '+count.format(result.conversions),
    'MODELLED COST PER CONVERSION: '+currency.format(result.cpa),
    'A: Direct message / same audience / same offer',
    'B: Interactive narrative / same audience / same offer',
    'Assign users randomly. Use one pre-defined qualified primary metric.',
    'No uplift is assumed. Compare actual outcomes and stop for safety or poor performance.',
    'Excludes production costs, fees, returns, taxes and attribution uncertainty.'
  ].join('\n');
  const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download='impossible-ventures-pilot-plan.txt';document.body.appendChild(link);link.click();link.remove();URL.revokeObjectURL(url);
});
function showMessage(message,error=false){
  feedback.classList.toggle('error',error);
  feedback.replaceChildren();
  const first=document.createElement('span');first.textContent=message;feedback.appendChild(first);
}
leadForm.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!leadForm.reportValidity()||!leadForm.elements.consent.checked){showMessage(labels().required,true);return}
  const fields=Object.fromEntries(new FormData(leadForm));
  const body={
    company:fields.company,contact:fields.contact,email:fields.email,website:fields.website,
    goal:fields.goal,budget:fields.budget,locale:langSelect.value,
    consent:leadForm.elements.consent.checked,website_confirm:fields.website_confirm
  };
  // Optional one-time A/B proof: only attach it to a separately consented contact
  // submission. No experiment token is stored in URLs or sent to third parties.
  try {
    const raw=sessionStorage.getItem('iv_pilot_attribution');
    if(raw) {
      const data=JSON.parse(raw);
      if(data && typeof data.createdAt==='number' && Date.now()-data.createdAt<7*86400000 &&
         /^[a-f0-9]{32}$/.test(data.sessionId) && /^iva_[A-Za-z0-9_-]{32}$/.test(data.receipt)){
        body.attribution={sessionId:data.sessionId,receipt:data.receipt};
      } else {
        sessionStorage.removeItem('iv_pilot_attribution');
      }
    }
  } catch { /* Browser storage can be disabled; ordinary submission still works. */ }
  const oldText=sendButton.textContent;
  sendButton.disabled=true;sendButton.textContent=labels().saving;
  try{
    const response=await fetch('/api/v1/pilots',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    if(!response.headers.get('content-type')?.includes('application/json'))throw new Error(labels().unavailable);
    const result=await response.json();
    if(!response.ok)throw new Error(result.error||labels().failed);
    if(body.attribution) {
      try { sessionStorage.removeItem('iv_pilot_attribution'); } catch {}
    }
    showMessage(labels().sent);
    if(result.attributed) {
      const linked=document.createElement('span');
      linked.textContent=' '+labels().attributedConfirmation;
      feedback.appendChild(linked);
    }
    const receipt=document.createElement('code');
    receipt.textContent='ID: '+result.requestId+' | DELETE TOKEN: '+result.deleteToken;
    feedback.appendChild(receipt);
    const note=document.createElement('span');note.textContent=labels().deleteNote;feedback.appendChild(note);
    leadForm.reset();
  }catch(error){showMessage(error.message||labels().failed,true)}
  finally{sendButton.disabled=false;sendButton.textContent=labels().request}
});
translate();
renderModel();
