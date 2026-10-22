import { FILM, PROTOTYPE, UNIVERSES } from './story.mjs';
import {
  checkEditions,createSession,currentScene,availableChoices,inaccessibleChoices,
  inspect,choose,back,backTo,fragments,progress,nextPreload,narration,safeJournal,
  serialize,restore,isFinished
} from './engine.mjs';
import { FilmSound } from './audio.mjs';

checkEditions();
const edition=document.body.dataset.edition==='prototype'?'prototype':'full';
const film=edition==='prototype'?PROTOTYPE:FILM;
const savingKey='iv-cinema-the-signal-v2-'+edition;
const $=id=>document.getElementById(id);
const ui=Object.fromEntries([
  'viewport','filmStill','visualStack','particles','actLabel','sceneNumber','sceneMeta',
  'sceneTitle','sceneCaption','sceneDuration','hotspots','choices','progressFill',
  'discoveriesCount','decisionHint','goBack','skipIntro','finalCTA','showWorlds',
  'replayFinal','qualityMode','soundToggle','volume','journalToggle','fullscreenToggle',
  'remember','restart','endingWorlds','worldList','sceneLoader','discoveryDialog',
  'closeDiscovery','discoveryContinue','discoveryTitle','discoveryText',
  'discoveryStatus','archiveDialog','archivePath','fragmentList','closeArchive',
  'archiveCloseAction','toast'
].map(id=>[id,$(id)]));

const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const sound=new FilmSound();
let state=createSession(edition);
let busy=false, effectiveQuality='balanced', particles=[],raf=0;
let lastParticleFrame=0,lastPointerFrame=0,toastTimer=null;
let audioTouched=false,worldListBuilt=false,transitionToken=0;
const prefetched=new Set();
const $element=(name,className,text)=>{
  const result=document.createElement(name);
  if(className)result.className=className;
  if(text!==undefined)result.textContent=String(text);
  return result;
};
function safeStorage(action,value){
  try{
    if(action==='read')return localStorage.getItem(savingKey);
    if(action==='write')localStorage.setItem(savingKey,value);
    if(action==='delete')localStorage.removeItem(savingKey);
  }catch{/* private browsing or disabled local storage; the film is still playable */}
  return null;
}
function start(){
  const stored=safeStorage('read');
  if(stored){
    try{state=restore(stored,edition);ui.remember.checked=true}
    catch{safeStorage('delete');state=createSession(edition)}
  }
  ui.qualityMode.value='auto';
  qualityChanged();
  ui.volume.value='35';
  sound.setVolume(.35);
  bindEvents();
  render();
  if(state.sceneId!=='s00')notify('Локальная история восстановлена.');
}
function save(){
  if(ui.remember.checked)safeStorage('write',serialize(state));
}
function notify(text){
  ui.toast.textContent=text;
  ui.toast.classList.add('visible');
  if(toastTimer)clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>ui.toast.classList.remove('visible'),2800);
}
function resolveQuality(){
  if(ui.qualityMode.value!=='auto')return ui.qualityMode.value;
  if(reducedMotion.matches || navigator.connection?.saveData)return 'lite';
  if(innerWidth<=600 || (navigator.deviceMemory&&navigator.deviceMemory<=3))return 'lite';
  if(innerWidth<1100 || (navigator.deviceMemory&&navigator.deviceMemory<6))return 'balanced';
  return 'cinematic';
}
function qualityChanged(){
  effectiveQuality=resolveQuality();
  document.body.dataset.effectiveQuality=effectiveQuality;
  updateParticles();
}
function imageURL(scene){
  return new URL(scene.art,import.meta.url).href;
}
function prefetch(){
  if('requestIdleCallback' in window){
    window.requestIdleCallback(loadUpcoming,{timeout:1200});
  }else setTimeout(loadUpcoming,250);
}
function loadUpcoming(){
  for(const path of nextPreload(state)){
    const url=new URL(path,import.meta.url).href;
    if(prefetched.has(url))continue;
    prefetched.add(url);
    const img=new Image();
    img.decoding='async';
    img.src=url;
  }
}
function updateArtwork(scene){
  const next=imageURL(scene);
  ui.visualStack.classList.remove('art-fallback');
  ui.filmStill.alt='Иллюстрированная кинематографическая сцена: '+scene.composition;
  if(ui.filmStill.src!==next)ui.filmStill.src=next;
}
ui.filmStill.addEventListener('error',()=>{
  ui.visualStack.classList.add('art-fallback');
  ui.filmStill.alt='Кадр временно не загрузился. Повествование и кнопки доступны.';
  notify('Иллюстрация временно недоступна — история продолжает работать.');
});
function renderHotspots(scene){
  ui.hotspots.replaceChildren();
  for(const hotspot of scene.hotspots){
    const discovered=state.inspected.includes(scene.id+':'+hotspot.id);
    const button=$element('button','hotspot'+(discovered?' discovered':''),
      discovered?'✓':'+');
    button.type='button';
    button.setAttribute('aria-label','Исследовать: '+hotspot.label);
    button.title=hotspot.label;
    button.style.left=hotspot.x+'%';
    button.style.top=hotspot.y+'%';
    button.addEventListener('click',()=>revealHotspot(hotspot.id));
    ui.hotspots.appendChild(button);
  }
}
function renderChoices(){
  const selected=availableChoices(state);
  const hidden=inaccessibleChoices(state);
  ui.choices.replaceChildren();
  selected.forEach((item,index)=>{
    const btn=$element('button','choice-button');
    btn.type='button';
    const text=$element('span','',item.label);
    const arrow=$element('span','choice-arrow','↗');
    arrow.setAttribute('aria-hidden','true');
    const n=$element('strong','',String(index+1).padStart(2,'0'));
    btn.append(n,text,arrow);
    btn.setAttribute('aria-label',String(index+1)+'. '+item.label);
    btn.addEventListener('click',()=>advance(item.id));
    ui.choices.appendChild(btn);
  });
  hidden.forEach(item=>{
    const btn=$element('button','choice-button',
      item.label+' · Найдите три фрагмента');
    btn.type='button';btn.disabled=true;
    btn.setAttribute('aria-label',item.label+' заблокировано: исследуйте не менее трёх предметов');
    ui.choices.appendChild(btn);
  });
  ui.finalCTA.hidden=!isFinished(state);
  ui.decisionHint.textContent=hidden.length
    ? 'Тайная сцена откроется после трёх находок.'
    : 'Можно вернуться и выбрать другой путь.';
  if(!selected.length&&!isFinished(state))
    notify('В этой сцене нет доступного перехода. Вернитесь назад.');
}
function render(){
  const scene=currentScene(state);
  ui.viewport.dataset.scene=scene.id;
  ui.viewport.dataset.camera=scene.camera;
  ui.actLabel.textContent=scene.kicker;
  ui.sceneNumber.textContent='SCENE '+String(scene.number+1).padStart(2,'0')+' / '+String(film.storyLength).padStart(2,'0');
  ui.sceneMeta.textContent='IMPOSSIBLE VENTURES / '+(edition==='prototype'?'THREE-SCENE PROTOTYPE':'INTERACTIVE FILM');
  ui.sceneTitle.textContent=scene.title;
  ui.sceneCaption.textContent=narration(state);
  ui.sceneDuration.textContent='СЦЕНА · ~'+scene.seconds+' СЕК · УПРАВЛЯЕТ ЗРИТЕЛЬ';
  ui.progressFill.style.width=Math.round((scene.number+1)/15*100)+'%';
  ui.discoveriesCount.textContent=fragments(state).length+' / 3 ФРАГМЕНТА';
  ui.goBack.disabled=state.history.length===0;
  ui.skipIntro.hidden=scene.id!=='s00';
  ui.endingWorlds.hidden=scene.id!=='s14'||!worldListBuilt;
  updateArtwork(scene);
  renderHotspots(scene);
  renderChoices();
  sound.scene(scene.ambient);
  prefetch();
}
function revealHotspot(id){
  try{
    const data=inspect(state,id);
    state=data.state;
    save();
    renderHotspots(currentScene(state));
    ui.discoveriesCount.textContent=fragments(state).length+' / 3 ФРАГМЕНТА';
    ui.discoveryTitle.textContent=data.discovery.label;
    ui.discoveryText.textContent=data.discovery.detail;
    ui.discoveryStatus.textContent=data.newFragment
      ? 'НОВЫЙ ФРАГМЕНТ · '+fragments(state).length+' / 3'
      : 'ЗАПИСЬ ИЗУЧЕНА · ВЫ МОЖЕТЕ ВЕРНУТЬСЯ';
    sound.cue('fragment');
    if(typeof ui.discoveryDialog.showModal==='function')ui.discoveryDialog.showModal();
    else ui.discoveryDialog.setAttribute('open','');
    // A third fragment may reveal a new legitimate branch on scene 12.
    renderChoices();
  }catch(error){notify('Не удалось открыть объект: '+error.message)}
}
function closeDialog(dialog){
  if(dialog.open&&typeof dialog.close==='function')dialog.close();
  else dialog.removeAttribute('open');
}
async function transitionTo(next){
  if(busy)return;
  busy=true;
  const token=++transitionToken;
  const slow=effectiveQuality!=='lite'&&!reducedMotion.matches;
  if(slow){
    ui.viewport.classList.add('is-changing');
    await new Promise(resolve=>setTimeout(resolve,195));
  }
  state=next;save();
  ui.endingWorlds.hidden=true;
  worldListBuilt=false;
  render();
  if(slow){
    // Gives the new image an opportunity to decode; never block the user for
    // multiple seconds on a lost visual asset.
    const upcoming=ui.filmStill;
    if(!upcoming.complete && typeof upcoming.decode==='function'){
      await Promise.race([
        upcoming.decode().catch(()=>{}),
        new Promise(resolve=>setTimeout(resolve,650))
      ]);
    }
  }
  if(token===transitionToken){
    ui.viewport.classList.remove('is-changing');
    busy=false;
  }
}
async function advance(id){
  if(busy)return;
  try{
    const next=choose(state,id);
    sound.cue(next.sceneId==='s07'?'reveal':'choice');
    await transitionTo(next);
  }catch(error){notify(error.message)}
}
async function goBack(){
  if(busy || state.history.length===0)return;
  const prior=back(state);
  sound.cue('choice');
  await transitionTo(prior);
}
function resetStory(){
  if(busy)return;
  state=createSession(edition);
  if(ui.remember.checked)save();else safeStorage('delete');
  ui.endingWorlds.hidden=true;
  worldListBuilt=false;
  transitionTo(state).then(()=>notify('История начата заново.'));
}
function showArchive(){
  const path=[...state.history.map(x=>x.sceneId),state.sceneId];
  ui.archivePath.replaceChildren();
  path.forEach((id,index)=>{
    const scene=film.scenes.find(x=>x.id===id);
    if(!scene)return;
    const li=$element('li');
    const button=$element('button','',String(index+1).padStart(2,'0')+'  '+scene.title);
    button.type='button';
    if(index===path.length-1)button.disabled=true;
    else button.addEventListener('click',async()=>{
      closeDialog(ui.archiveDialog);
      await transitionTo(backTo(state,index));
    });
    li.appendChild(button);ui.archivePath.appendChild(li);
  });
  ui.fragmentList.replaceChildren();
  const found=fragments(state);
  if(found.length===0)ui.fragmentList.appendChild($element('li','', 'Пока нет находок'));
  else for(const item of found)ui.fragmentList.appendChild($element('li','',item.toUpperCase()));
  if(typeof ui.archiveDialog.showModal==='function')ui.archiveDialog.showModal();
  else ui.archiveDialog.setAttribute('open','');
}
function buildWorlds(){
  if(worldListBuilt)return;
  ui.worldList.replaceChildren();
  for(const [index,world] of UNIVERSES.entries()){
    const a=$element('a','world-card');
    a.href=new URL(world.href,import.meta.url).href;
    const no=$element('small','',String(index+1).padStart(2,'0')+' / CREATIVE WORLD');
    const title=$element('strong','',world.label);
    const arrow=$element('span','world-arrow','↗');
    arrow.setAttribute('aria-hidden','true');
    a.append(no,title,arrow);ui.worldList.appendChild(a);
  }
  worldListBuilt=true;
}
async function toggleAudio(){
  const on=await sound.toggle();
  audioTouched=true;
  ui.soundToggle.setAttribute('aria-pressed',String(on));
  ui.soundToggle.setAttribute('aria-label',on?'Выключить звук':'Включить звук');
  ui.volume.disabled=!on;
  notify(on?'Звук включён. Управляйте громкостью.':'Звук выключен.');
}
async function toggleFullscreen(){
  try{
    if(document.fullscreenElement)await document.exitFullscreen();
    else await document.querySelector('.cinema-root').requestFullscreen();
  }catch{notify('Полный экран не разрешён браузером.')}
}
function updateParticles(){
  const canvas=ui.particles;
  if(raf){cancelAnimationFrame(raf);raf=0}
  if(effectiveQuality==='lite'||document.hidden)return;
  const bounds=ui.viewport.getBoundingClientRect();
  if(bounds.width<5||bounds.height<5)return;
  const dpr=Math.min(devicePixelRatio||1,1.5);
  const width=Math.round(bounds.width*dpr),height=Math.round(bounds.height*dpr);
  canvas.width=width;canvas.height=height;
  const count=effectiveQuality==='cinematic'?42:17;
  particles=Array.from({length:count},(_,i)=>({
    x:(i*71+37)%width,y:(i*173+55)%height,
    radius:1+(i%4)*.55,velocity:.08+(i%6)*.052,seed:i
  }));
  lastParticleFrame=0;
  raf=requestAnimationFrame(paintParticles);
}
function paintParticles(ms){
  if(document.hidden || effectiveQuality==='lite'){raf=0;return}
  const canvas=ui.particles,ctx=canvas.getContext('2d',{alpha:true});
  if(!ctx){raf=0;return}
  if(ms-lastParticleFrame>=40){
    const delta=Math.min(45,(ms-lastParticleFrame)||16);
    lastParticleFrame=ms;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(const p of particles){
      p.y=(p.y-p.velocity*delta+canvas.height)%canvas.height;
      p.x+=(Math.sin((ms+p.seed*600)/8000)*.04);
      ctx.fillStyle=p.seed%5===0?'rgba(238,218,185,.30)':'rgba(196,234,243,.16)';
      ctx.beginPath();ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);ctx.fill();
    }
  }
  raf=requestAnimationFrame(paintParticles);
}
function pointerEffect(event){
  if(effectiveQuality!=='cinematic'||reducedMotion.matches)return;
  const ms=performance.now();
  if(ms-lastPointerFrame<35)return;
  lastPointerFrame=ms;
  const b=ui.viewport.getBoundingClientRect();
  const dx=((event.clientX-b.left)/b.width-.5)*10;
  const dy=((event.clientY-b.top)/b.height-.5)*7;
  ui.visualStack.style.setProperty('--pointer-x',dx.toFixed(2)+'px');
  ui.visualStack.style.setProperty('--pointer-y',dy.toFixed(2)+'px');
}
function bindEvents(){
  ui.goBack.addEventListener('click',goBack);
  ui.skipIntro.addEventListener('click',()=>advance('skip'));
  ui.restart.addEventListener('click',resetStory);
  ui.replayFinal.addEventListener('click',resetStory);
  ui.soundToggle.addEventListener('click',toggleAudio);
  ui.volume.addEventListener('input',()=>sound.setVolume(Number(ui.volume.value)/100));
  ui.qualityMode.addEventListener('change',()=>{qualityChanged();notify('Качество: '+effectiveQuality.toUpperCase())});
  ui.fullscreenToggle.addEventListener('click',toggleFullscreen);
  ui.journalToggle.addEventListener('click',showArchive);
  ui.closeArchive.addEventListener('click',()=>closeDialog(ui.archiveDialog));
  ui.archiveCloseAction.addEventListener('click',()=>closeDialog(ui.archiveDialog));
  ui.closeDiscovery.addEventListener('click',()=>closeDialog(ui.discoveryDialog));
  ui.discoveryContinue.addEventListener('click',()=>closeDialog(ui.discoveryDialog));
  ui.showWorlds.addEventListener('click',()=>{
    buildWorlds();ui.endingWorlds.hidden=false;
    ui.endingWorlds.scrollIntoView({behavior:reducedMotion.matches?'auto':'smooth'});
  });
  ui.remember.addEventListener('change',()=>{
    if(ui.remember.checked){save();notify('Прогресс сохранён только на этом устройстве.')}
    else{safeStorage('delete');notify('Локальный прогресс больше не хранится.')}
  });
  ui.viewport.addEventListener('pointermove',pointerEffect,{passive:true});
  document.addEventListener('keydown',event=>{
    if(event.altKey||event.ctrlKey||event.metaKey)return;
    if(event.target.closest('input,select,textarea,button,a'))return;
    if(ui.discoveryDialog.open||ui.archiveDialog.open)return;
    if(event.key==='ArrowLeft'){event.preventDefault();goBack()}
    else if(event.key.toLowerCase()==='i'){event.preventDefault();showArchive()}
    else if(/^[1-3]$/.test(event.key)){
      const items=availableChoices(state);
      const item=items[Number(event.key)-1];
      if(item){event.preventDefault();advance(item.id)}
    }
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){
      if(raf){cancelAnimationFrame(raf);raf=0}
      sound.context?.suspend?.().catch(()=>{});
    }else{
      updateParticles();
      if(sound.on)sound.context?.resume?.().catch(()=>{});
    }
  });
  window.addEventListener('resize',()=>{
    if(ui.qualityMode.value==='auto')qualityChanged();
    else updateParticles();
  },{passive:true});
  reducedMotion.addEventListener?.('change',()=>{
    if(ui.qualityMode.value==='auto')qualityChanged();
  });
  ui.discoveryDialog.addEventListener('click',event=>{
    if(event.target===ui.discoveryDialog)closeDialog(ui.discoveryDialog);
  });
  ui.archiveDialog.addEventListener('click',event=>{
    if(event.target===ui.archiveDialog)closeDialog(ui.archiveDialog);
  });
  document.addEventListener('fullscreenchange',()=>{
    ui.fullscreenToggle.setAttribute('aria-label',document.fullscreenElement?'Выйти из полного экрана':'Полный экран');
  });
  window.addEventListener('pagehide',()=>{
    if(sound.on)sound.stop();
    if(raf)cancelAnimationFrame(raf);
  });
}
start();
