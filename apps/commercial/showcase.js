const params=new URLSearchParams(location.search);
const id=params.get('id')||'';
const status=document.getElementById('showcaseStatus');
const title=document.getElementById('showcaseHeadline');
const body=document.getElementById('showcaseBody');
const offer=document.getElementById('showcaseOffer');
const venture=document.getElementById('showcaseVenture');
const cta=document.getElementById('showcaseCTA');
const panel=document.getElementById('showcasePanel');
const colors={'dead-drop':'#a2e8f6','appeal-2049':'#c6bdfb','anti-persona':'#ffb2b0','brief-theatre':'#ffe0a2','ad-biome':'#b4f5d5','museum-of-attention':'#ffb7ee','attention-republic':'#a4c6ff'};
async function load(){
  if(!/^[0-9a-f]{24}$/.test(id)){status.textContent='Неверная или отсутствующая ссылка на рекламный макет.';title.textContent='Макет не найден.';return}
  try{
    const response=await fetch('/api/v1/showcase/'+id,{cache:'no-store'});
    if(!response.ok || !response.headers.get('content-type')?.includes('application/json')) throw Error('Макет недоступен, не одобрен или снят с публикации.');
    const data=await response.json();
    const c=data.creative;
    if(!c||c.id!==id)throw Error('Некорректный ответ сервера.');
    venture.textContent='CREATIVE UNIVERSE / '+c.venture.toUpperCase();
    title.textContent=c.headline;
    body.textContent=c.body;
    offer.textContent=c.offer;
    cta.textContent=c.ctaLabel+' ↗';
    cta.hidden=false;
    panel.style.background='radial-gradient(ellipse at 78% 18%,'+(colors[c.venture]||'#b1e5ef')+'55,transparent 57%),linear-gradient(145deg,#182b47,#091625)';
    status.textContent='Одобренный публичный предпросмотр. Внешних рекламных показов и аналитики здесь нет.';
    document.title=c.title+' — Impossible Ventures preview';
  }catch(err){
    status.textContent=err.message||'Ошибка загрузки.';
    title.textContent='Макет недоступен.';
    body.textContent='Оператор мог отправить его в архив. Обратитесь за новым предпросмотром.';
    cta.hidden=true;
  }
}
load();
