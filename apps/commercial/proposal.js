const translations={
 ru:{
  eyebrow:'ПРЕДЛОЖЕНИЕ / КОНФИДЕНЦИАЛЬНАЯ ССЫЛКА',
  headline:'Коммерческое предложение. Прозрачные условия.',
  explain:'Откройте расчёт по приватной ссылке, ознакомьтесь с описанием услуг и сообщите решение. Это не счёт на оплату, не электронная подпись и не подтверждение денежного перевода.',
  client:'ПОЛУЧАТЕЛЬ',description:'ОПИСАНИЕ УСЛУГ',setup:'РАЗОВАЯ РАБОТА',monthly:'ЕЖЕМЕСЯЧНАЯ УСЛУГА',months:'КОЛИЧЕСТВО МЕСЯЦЕВ',
  total:'ОБЩАЯ СУММА ПРЕДЛОЖЕНИЯ',status:'СТАТУС',
  ack:'Я ознакомился(лась) с предложением. Решение фиксируется по приватной ссылке и не заменяет юридическую подпись или оплату.',
  accept:'СОГЛАСЕН С ПРЕДЛОЖЕНИЕМ ↗',decline:'ОТКЛОНИТЬ',
  disclaimer:'Предложенная сумма — гипотеза о возможном договоре, а не фактическая выручка или оплаченные услуги.',
  loading:'Проверяем приватную ссылку…',learn:'УЗНАТЬ О ПИЛОТНОМ ПРОЕКТЕ →',
  footer:'ЭТО НЕ ПОДТВЕРЖДЁННЫЙ ПЛАТЁЖ И НЕ СЧЁТ-ФАКТУРА',privacy:'ПРИВАТНОСТЬ ↗',
  missing:'Приватный токен отсутствует или ссылка недействительна.',denied:'Предложение недоступно. Возможно, ссылка была перевыпущена.',
  accepted:'Решение принято и записано сервером. Договор и оплата требуют отдельного оформления.',
  declined:'Ваше решение отказаться от предложения записано.',failed:'Не удалось передать решение. Повторите попытку.',
  sent:'ОЖИДАЕТ РЕШЕНИЯ',acceptedStatus:'ПРИНЯТО',declinedStatus:'ОТКЛОНЕНО',cancelled:'ОТМЕНЕНО'
 },
 en:{
  eyebrow:'PRIVATE LINK / COMMERCIAL PROPOSAL',headline:'Commercial proposal. Transparent terms.',
  explain:'Review the proposed services and pricing via a private link. You may record your decision. This is not an invoice, legally binding e-signature, or confirmation of payment.',
  client:'PROPOSED CLIENT',description:'DESCRIPTION OF SERVICES',setup:'ONE-TIME FEE',monthly:'MONTHLY SERVICE',months:'MONTHS',
  total:'TOTAL PROPOSED VALUE',status:'STATUS',
  ack:'I have reviewed the proposal. My decision is recorded by possession of this private link and does not constitute a legal identity signature or payment.',
  accept:'ACCEPT THE PROPOSAL ↗',decline:'DECLINE',
  disclaimer:'This is proposed contract value, not verified revenue or paid services.',
  loading:'Verifying private link…',learn:'DISCUSS A PILOT →',
  footer:'THIS IS NOT AN INVOICE OR VERIFIED PAYMENT',privacy:'DATA HANDLING ↗',
  missing:'Private link token is missing or invalid.',denied:'Proposal unavailable. The link may have been rotated.',
  accepted:'Decision recorded. Contracts and payment must be handled separately.',
  declined:'Your decline decision has been recorded.',failed:'Unable to record decision. Please retry.',
  sent:'AWAITING DECISION',acceptedStatus:'ACCEPTED',declinedStatus:'DECLINED',cancelled:'CANCELLED'
 },
 zh:{
  eyebrow:'私人链接 / 商业报价',headline:'商业报价。条款透明。',
  explain:'通过私人链接查看服务和价格并记录决定。这不是账单、具有法律效力的电子签名或付款证明。',
  client:'客户名称',description:'服务说明',setup:'一次性费用',monthly:'每月服务',months:'月数',
  total:'报价总额',status:'状态',
  ack:'我已阅读报价。决定通过持有私人链接记录，不构成法律身份签名或付款。',
  accept:'接受报价 ↗',decline:'拒绝报价',
  disclaimer:'报价只是潜在合同金额，并非已核实的收入或已支付的服务。',
  loading:'正在检查私人链接…',learn:'了解试点项目 →',
  footer:'这不是发票或已验证付款',privacy:'数据处理 ↗',
  missing:'私人令牌缺失或无效。',denied:'报价不可用，链接可能已经更新。',
  accepted:'决定已记录，合同与付款需要另行处理。',declined:'拒绝决定已记录。',failed:'无法记录决定，请重试。',
  sent:'等待决定',acceptedStatus:'已接受',declinedStatus:'已拒绝',cancelled:'已取消'
 }};
const ui={
 language:document.getElementById('language'),card:document.getElementById('proposalCard'),
 client:document.getElementById('clientName'),description:document.getElementById('description'),
 setup:document.getElementById('setup'),monthly:document.getElementById('monthly'),months:document.getElementById('months'),
 total:document.getElementById('total'),status:document.getElementById('currentStatus'),
 form:document.getElementById('decisionForm'),ack:document.getElementById('acknowledge'),
 accept:document.getElementById('accept'),decline:document.getElementById('decline'),
 message:document.getElementById('message')
};
const t=key=>(translations[ui.language.value]||translations.ru)[key]||key;
const id=new URLSearchParams(location.search).get('id')||'';
let token='';
try{
  const fragment=new URLSearchParams(location.hash.slice(1));
  token=fragment.get('token')||'';
  // Fragment tokens are not sent in HTTP requests. Clear them from browser
  // navigation history immediately, retaining the secret in memory only.
  if(location.hash)history.replaceState(null,'',location.pathname+location.search);
}catch{}
let proposal=null;
function translate(){
 document.documentElement.lang=ui.language.value==='zh'?'zh-CN':ui.language.value;
 for(const el of document.querySelectorAll('[data-i18n]')){
   if(el.dataset.i18n==='headline'){
     const full=t('headline');
     const marker=full.indexOf('. ');
     if(marker!==-1){
       const span=document.createElement('span');span.className='gradient';span.textContent=' '+full.slice(marker+2);
       el.replaceChildren(document.createTextNode(full.slice(0,marker+1)),span);
     }else el.textContent=full;
   }else el.textContent=t(el.dataset.i18n);
 }
 if(proposal)render();
}
function money(cents,currency){return new Intl.NumberFormat(document.documentElement.lang,{style:'currency',currency}).format(cents/100)}
function render(){
 ui.client.textContent=proposal.clientName;
 ui.description.textContent=proposal.description;
 ui.setup.textContent=money(proposal.setupCents,proposal.currency);
 ui.monthly.textContent=money(proposal.monthlyCents,proposal.currency);
 ui.months.textContent=String(proposal.months);
 ui.total.textContent=money(proposal.totalCents,proposal.currency);
 ui.status.textContent=t(proposal.status==='accepted'?'acceptedStatus':proposal.status==='declined'?'declinedStatus':proposal.status);
 ui.card.hidden=false;
 ui.form.hidden=proposal.status!=='sent';
}
async function request(path,method='GET',body){
 const headers={Authorization:'Bearer '+token};
 if(body!==undefined)headers['Content-Type']='application/json';
 const response=await fetch(path,{method,headers,cache:'no-store',body:body===undefined?undefined:JSON.stringify(body)});
 if(!response.headers.get('content-type')?.includes('application/json'))throw Error('Private proposal API unavailable');
 const data=await response.json();
 if(!response.ok)throw Error(data.error||'HTTP '+response.status);
 return data;
}
async function init(){
 translate();
 if(!/^[0-9a-f]{24}$/.test(id)||!/^ivp_[A-Za-z0-9_-]{43}$/.test(token)){
   ui.message.textContent=t('missing');ui.message.classList.add('error');return;
 }
 try{
   const r=await request('/api/v1/proposals/'+id);
   proposal=r.proposal;render();ui.message.textContent=t('loading').replace('Проверяем приватную ссылку…','');ui.message.textContent='';
 }catch{ui.message.textContent=t('denied');ui.message.classList.add('error')}
}
ui.language.addEventListener('change',translate);
ui.ack.addEventListener('change',()=>{
 ui.accept.disabled=!ui.ack.checked;ui.decline.disabled=!ui.ack.checked;
});
async function decide(status){
 if(!proposal||proposal.status!=='sent'||!ui.ack.checked)return;
 ui.accept.disabled=true;ui.decline.disabled=true;
 try{
   const x=await request('/api/v1/proposals/'+id+'/decision','POST',{decision:status});
   if(!x.recorded)throw Error('No acknowledgement');
   proposal.status=x.status;
   render();
   ui.message.textContent=t(status);
 }catch(error){ui.message.textContent=error.message||t('failed');ui.message.classList.add('error');ui.accept.disabled=false;ui.decline.disabled=false}
}
ui.accept.addEventListener('click',()=>decide('accepted'));
ui.decline.addEventListener('click',()=>decide('declined'));
init();
