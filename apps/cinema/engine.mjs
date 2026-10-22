import { FILM, PROTOTYPE } from './story.mjs';

const ACCEPTED_EDITION = Object.freeze({ full: FILM, prototype: PROTOTYPE });
const REQUIREMENTS = new Set([null,'fragments3']);
const FLAGS = new Set(['route','routeResult','ethics','policy','repaired','skippedIntro']);
const MAX_HISTORY = 30;
const STORE_SCHEMA = 'iv-cinematic-signal-local-v2';

export class StoryError extends Error {
  constructor(message){super(message);this.name='StoryError'}
}
export function storyboard(edition='full') {
  if (!Object.hasOwn(ACCEPTED_EDITION,edition)) throw new StoryError('Unknown film edition');
  return ACCEPTED_EDITION[edition];
}
function findScene(film,id) {
  const found=film.scenes.find(s=>s.id===id);
  if (!found) throw new StoryError('Unknown scene: '+id);
  return found;
}
export function validateFilm(film) {
  if (!film || !Array.isArray(film.scenes) || film.scenes.length<3 ||
      film.storyLength!==film.scenes.length)throw new StoryError('Invalid film structure');
  const ids=new Set(),map=new Map();
  for(const scene of film.scenes){
    if(!/^s\d{2}$/.test(scene.id)||ids.has(scene.id) ||
      !Number.isInteger(scene.seconds)||scene.seconds<5||scene.seconds>45 ||
      !/^assets\/scenes\/scene_\d{2}\.svg$/.test(scene.art) ||
      !scene.title || !scene.caption || !scene.camera || !Array.isArray(scene.choices) ||
      !Array.isArray(scene.hotspots))throw new StoryError('Invalid scene: '+scene.id);
    ids.add(scene.id);map.set(scene.id,scene);
    const optionIds=new Set();
    for(const option of scene.choices){
      if(optionIds.has(option.id)||typeof option.label!=='string'||
        !REQUIREMENTS.has(option.requirement)||
        typeof option.next!=='string'||!option.next ||
        !option.effects || Array.isArray(option.effects) ||
        Object.keys(option.effects).some(k=>!FLAGS.has(k)))
        throw new StoryError('Invalid branch in '+scene.id);
      optionIds.add(option.id);
    }
    const hotspots=new Set();
    for(const h of scene.hotspots){
      if(hotspots.has(h.id)||!Number.isFinite(h.x)||!Number.isFinite(h.y)||
        h.x<5||h.x>95||h.y<5||h.y>95||!h.detail||!h.label)
        throw new StoryError('Invalid discovery in '+scene.id);
      hotspots.add(h.id);
    }
  }
  if(!ids.has(film.startingScene))throw new StoryError('Missing prologue');
  for(const scene of film.scenes){
    for(const option of scene.choices)if(!ids.has(option.next))
      throw new StoryError('Broken branch '+scene.id+' -> '+option.next);
  }
  const reached=new Set(),toVisit=[film.startingScene];
  while(toVisit.length){
    const id=toVisit.pop();
    if(reached.has(id))continue;
    reached.add(id);
    for(const option of map.get(id).choices)toVisit.push(option.next);
  }
  for(const scene of film.scenes)if(!reached.has(scene.id))
    throw new StoryError('Unreachable scene '+scene.id);
  const endings=film.scenes.filter(scene=>!scene.choices.length);
  if(endings.length!==1 || endings[0].id!=='s14')
    throw new StoryError('Exactly one converging terminal scene is expected');
  return {
    edition:film.revision,
    scenes:film.scenes.length,
    reachable:reached.size,
    branches:film.scenes.reduce((sum,scene)=>sum+scene.choices.length,0),
    hotspots:film.scenes.reduce((sum,scene)=>sum+scene.hotspots.length,0)
  };
}
function snapshot(state){
  return {
    sceneId:state.sceneId,
    flags:{...state.flags},
    visited:[...state.visited],
    inspected:[...state.inspected],
    decisions:state.decisions.map(d=>({...d}))
  };
}
function clone(state){
  return { ...snapshot(state),history:state.history.map(x=>({
    ...x,flags:{...x.flags},visited:[...x.visited],
    inspected:[...x.inspected],decisions:x.decisions.map(d=>({...d}))
  })),edition:state.edition,schema:STORE_SCHEMA };
}
export function createSession(edition='full'){
  const film=storyboard(edition);
  return {schema:STORE_SCHEMA,edition,sceneId:film.startingScene,
    flags:{},visited:[film.startingScene],inspected:[],decisions:[],history:[]};
}
function validateSession(state){
  if(!state||typeof state!=='object'||state.schema!==STORE_SCHEMA||
    !Object.hasOwn(ACCEPTED_EDITION,state.edition)||
    !Array.isArray(state.history)||state.history.length>MAX_HISTORY||
    !Array.isArray(state.visited)||!Array.isArray(state.inspected)||
    !Array.isArray(state.decisions)||typeof state.flags!=='object'||!state.flags)
    throw new StoryError('Invalid or unsupported saved film');
  const film=storyboard(state.edition);
  findScene(film,state.sceneId);
  if(state.visited.some(id=>!film.scenes.some(x=>x.id===id)) ||
     state.inspected.length>60||state.visited.length>60||state.decisions.length>30)
    throw new StoryError('Corrupt scene progress');
  return film;
}
export function currentScene(state){
  return findScene(validateSession(state),state.sceneId);
}
export function fragments(state){
  const film=validateSession(state);
  const unique=new Set();
  for(const key of state.inspected){
    const [sceneId,hotspotId]=key.split(':');
    const h=findScene(film,sceneId).hotspots.find(x=>x.id===hotspotId);
    if(h?.fragment)unique.add(h.fragment);
  }
  return [...unique];
}
function unlocked(state,option){
  if(!option.requirement)return true;
  if(option.requirement==='fragments3')return fragments(state).length>=3;
  return false;
}
export function availableChoices(state){
  const scene=currentScene(state);
  return scene.choices.filter(option=>unlocked(state,option))
    .map(option=>({id:option.id,label:option.label,next:option.next,requirement:option.requirement}));
}
export function inaccessibleChoices(state){
  return currentScene(state).choices.filter(option=>!unlocked(state,option))
    .map(x=>({id:x.id,label:x.label,requirement:x.requirement}));
}
export function inspect(state,hotspotId){
  const scene=currentScene(state);
  const h=scene.hotspots.find(x=>x.id===hotspotId);
  if(!h)throw new StoryError('No such discoverable detail');
  const next=clone(state),key=scene.id+':'+h.id;
  if(!next.inspected.includes(key))next.inspected.push(key);
  return {state:next,discovery:{...h},newFragment:Boolean(h.fragment)&&!state.inspected.includes(key)};
}
export function choose(state,choiceId){
  const film=validateSession(state);
  const option=findScene(film,state.sceneId).choices.find(c=>c.id===choiceId);
  if(!option||!unlocked(state,option))throw new StoryError('Unavailable narrative choice');
  if(state.history.length>=MAX_HISTORY)throw new StoryError('Maximum chapter history exceeded');
  const next=clone(state);
  next.history.push(snapshot(state));
  Object.assign(next.flags,option.effects);
  next.decisions.push({from:state.sceneId,choice:option.id,to:option.next});
  next.sceneId=option.next;
  if(!next.visited.includes(option.next))next.visited.push(option.next);
  return next;
}
export function back(state){
  validateSession(state);
  if(!state.history.length)return clone(state);
  const next=clone(state),previous=next.history.pop();
  Object.assign(next,previous);
  return next;
}
export function backTo(state,index){
  validateSession(state);
  if(!Number.isInteger(index)||index<0||index>state.history.length)
    throw new StoryError('Invalid return point');
  let next=clone(state);
  while(next.history.length>index)next=back(next);
  return next;
}
export function isFinished(state){return currentScene(state).id==='s14'}
export function narration(state){
  const scene=currentScene(state);
  if(scene.id==='s07' && state.flags.ethics==='risk')
    return scene.caption+' Вы встретили соблазн заменить факты впечатлением — и можете выбрать иной путь.';
  if(scene.id==='s12' && state.flags.policy==='spectacle')
    return scene.caption+' Вы уже видели, почему шум не превращается в доверие.';
  if(scene.id==='s14'){
    if(state.flags.route==='human')return scene.caption+' Вы начали с человека — сохраните эту точку опоры.';
    if(state.flags.route==='story')return scene.caption+' Вы начали с истории — теперь можете дать ей честное продолжение.';
    if(state.flags.route==='evidence')return scene.caption+' Вы начали с доказательства — проверьте следующую гипотезу.';
  }
  return scene.caption;
}
export function progress(state){
  const film=validateSession(state);
  return {
    edition:state.edition,current:state.sceneId,
    uniqueVisited:state.visited.length,total:film.scenes.length,
    fragments:fragments(state).length,finished:isFinished(state)
  };
}
export function nextPreload(state){
  const film=validateSession(state);
  const choices=availableChoices(state);
  const used=new Set();
  return choices.map(c=>findScene(film,c.next).art).filter(path=>{
    if(used.has(path))return false;used.add(path);return true;
  }).slice(0,2);
}
export function safeJournal(state){
  const film=validateSession(state);
  return {
    title:film.title,
    disclaimer:'Художественная интерактивная история. Действия и находки не являются просмотрами рекламы, результатами продаж или мнениями реальных клиентов.',
    edition:state.edition,
    visited:state.visited.map(id=>({id,title:findScene(film,id).title})),
    choices:state.decisions.map(d=>({
      scene:d.from,choice:d.choice,next:d.to
    })),
    fragments:fragments(state),
    ending:state.flags.policy||null
  };
}
/** Deliberately opt-in local progress; no network, no identity, no telemetry. */
export function serialize(state){
  validateSession(state);
  return JSON.stringify(clone(state));
}
export function restore(raw, edition){
  if(typeof raw!=='string'||raw.length>25_000)throw new StoryError('Saved state too large');
  let state;
  try{state=JSON.parse(raw)}catch{throw new StoryError('Malformed local save')}
  validateSession(state);
  if(state.edition!==edition)throw new StoryError('Save belongs to a different film edition');
  for(const h of state.history){
    if(!h||typeof h!=='object'||typeof h.sceneId!=='string'||
      !Array.isArray(h.visited)||!Array.isArray(h.inspected)||!Array.isArray(h.decisions)||
      !h.flags||typeof h.flags!=='object')throw new StoryError('Corrupt save history');
  }
  return clone(state);
}
export function checkEditions(){
  return [validateFilm(FILM),validateFilm(PROTOTYPE)];
}
