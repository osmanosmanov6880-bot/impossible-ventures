const form=document.getElementById('operatorLogin');
const tokenInput=document.getElementById('operatorToken');
const state=document.getElementById('operatorState');
const list=document.getElementById('operatorList');
const stats=document.getElementById('operatorStats');
const refresh=document.getElementById('refreshOperator');
let accessToken='';
const statuses=['new','contacted','qualified','won','lost'];

async function request(path,method='GET',body){
  const response=await fetch(path,{method,headers:{
    'Authorization':'Bearer '+accessToken,
    ...(body===undefined?{}:{'Content-Type':'application/json'})
  },body:body===undefined?undefined:JSON.stringify(body)});
  const data=await response.json();
  if(!response.ok)throw new Error(data.error||'Request failed');
  return data;
}
function node(tag,className,textValue){
  const el=document.createElement(tag);
  if(className)el.className=className;
  if(textValue!==undefined)el.textContent=String(textValue);
  return el;
}
function render(data){
  stats.replaceChildren();list.replaceChildren();
  for(const key of ['total',...statuses]){
    const metric=node('div','operator-stat');
    metric.append(node('span','',key.toUpperCase()),node('strong','',data.summary[key]??0));
    stats.appendChild(metric);
  }
  if(!data.items.length)list.appendChild(node('p','operator-empty','No real pilot requests have been received.'));
  for(const item of data.items){
    const card=node('article','operator-card');
    const top=node('div','operator-card-top');
    const heading=node('div');
    heading.append(node('h3','',item.company),node('span','operator-meta',item.id));
    const at=node('time','operator-meta',new Date(item.createdAt).toLocaleString());
    top.append(heading,at);
    const details=node('div','operator-details');
    for(const [label,value] of [
      ['CONTACT',item.contact],['EMAIL',item.email],['WEBSITE',item.website||'—'],
      ['GOAL',item.goal],['BUDGET',item.budget],['LANGUAGE',item.locale]
    ]){
      const block=node('div','');
      block.append(node('small','',label),node('span','',value));
      details.appendChild(block);
    }
    const controls=node('div','operator-controls');
    const label=node('label','','STATUS ');
    const select=node('select');
    for(const status of statuses){
      const option=node('option','',status.toUpperCase());option.value=status;
      select.appendChild(option);
    }
    select.value=item.status;
    const save=node('button','download','SAVE STATUS');
    save.type='button';
    save.addEventListener('click',async()=>{
      save.disabled=true;
      try{
        await request('/api/v1/operator/pilots/'+item.id+'/status','POST',{status:select.value});
        state.textContent='Updated '+item.id;
        await load();
      }catch(error){state.textContent=error.message}
      finally{save.disabled=false}
    });
    label.appendChild(select);controls.append(label,save);
    card.append(top,details,controls);list.appendChild(card);
  }
}
async function load(){
  const data=await request('/api/v1/operator/pilots');
  render(data);
  state.textContent='Showing real stored pilot requests. Last refreshed '+new Date().toLocaleTimeString()+'.';
}
form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  accessToken=tokenInput.value;tokenInput.value='';
  try{await load();refresh.disabled=false}
  catch(error){accessToken='';refresh.disabled=true;stats.replaceChildren();list.replaceChildren();state.textContent=error.message}
});
refresh.addEventListener('click',()=>load().catch(error=>state.textContent=error.message));