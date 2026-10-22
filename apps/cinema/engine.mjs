import {SCENES,SCENE_ORDER,WORLDS,L,tr,ASSETS} from './scenes.mjs';

export const ENGINE_VERSION='cinema-2.0.0-alpha';
const LOCALES=new Set(['ru','en','zh']);
const VALID_SCENES=new Set(SCENE_ORDER);
const MAX_HISTORY=32;
export class NarrativeError extends Error{
 constructor(message){super(message);this.name='NarrativeError'}
}
const fail=(message)=>{throw new NarrativeError(message)};
const clone=(x)=>JSON.parse(JSON.stringify(x));
function assertLocale(locale){if(!LOCALES.has(locale))fail('Unsupported language');return locale}
export function createStory(locale='ru'){
 assertLocale(locale);
 return {version:ENGINE_VERSION,locale,sceneId:'s01',history:[],
   flags:{route:null,ethics:null},collected:[],visited:['s01'],selectedWorld:null,transitions:0};
}
function point(state){
 return {sceneId:state.sceneId,flags:clone(state.flags),
  collected:[...state.collected],visited:[...state.visited],
  selectedWorld:state.selectedWorld,transitions:state.transitions};
}
function validate(state){
 if(!state||typeof state!=='object'||Array.isArray(state)||state.version!==ENGINE_VERSION||
   !LOCALES.has(state.locale)||!VALID_SCENES.has(state.sceneId)||
   !state.flags||typeof state.flags!=='object'||
   ![null,'proof','wonder'].includes(state.flags.route)||
   ![null,'consent','extract'].includes(state.flags.ethics)||
   !Array.isArray(state.collected)||state.collected.length>16||
   !Array.isArray(state.visited)||state.visited.length>32||
   state.visited.some(id=>!VALID_SCENES.has(id))||
   !Array.isArray(state.history)||state.history.length>MAX_HISTORY||
   ![null,...WORLDS.map(w=>w.id)].includes(state.selectedWorld)||
   !Number.isSafeInteger(state.transitions)||state.transitions<0||state.transitions>1000){
  fail('Invalid cinematic save');
 }
 if(state.history.some(s=>!s||typeof s!=='object'||!VALID_SCENES.has(s.sceneId)||
   !s.flags||![null,'proof','wonder'].includes(s.flags.route)||
   ![null,'consent','extract'].includes(s.flags.ethics)||
   !Array.isArray(s.visited)||s.visited.length>32||s.visited.some(id=>!VALID_SCENES.has(id))||
   !Array.isArray(s.collected)||s.collected.length>16||
   ![null,...WORLDS.map(w=>w.id)].includes(s.selectedWorld)||
   !Number.isSafeInteger(s.transitions)))fail('Invalid cinematic history');
 const allHotspots=new Set(Object.values(SCENES).flatMap(scene=>(scene.hotspots||[]).map(h=>h.id)));
 if(state.collected.some(id=>!allHotspots.has(id)))fail('Unknown collectible');
 for(const snapshot of state.history)if(snapshot.collected.some(id=>!allHotspots.has(id)))fail('Unknown history collectible');
 return state;
}
export function getScene(state){validate(state);return SCENES[state.sceneId]}
export function getChoiceOptions(state,locale=state.locale){
 const scene=getScene(state);assertLocale(locale);
 return (scene.choices||[]).map(o=>({id:o.id,to:o.to,label:tr(o.label,locale),description:tr(o.description,locale)}));
}
export function getHotspots(state,locale=state.locale){
 const scene=getScene(state);assertLocale(locale);
 return (scene.hotspots||[]).map(h=>({id:h.id,symbol:h.symbol,x:h.x,y:h.y,found:state.collected.includes(h.id),
  title:tr(h.title,locale),body:tr(h.body,locale),opens:h.opens||null}));
}
function arrive(state,target,updates={}){
 if(!VALID_SCENES.has(target))fail('Unknown destination');
 const next=clone(state);
 next.history.push(point(state));
 if(next.history.length>MAX_HISTORY)next.history.shift();
 next.sceneId=target;
 next.visited.push(target);
 next.flags={...next.flags,...updates};
 next.transitions++;
 validate(next);
 return next;
}
export function advance(state){
 const scene=getScene(state);
 if(scene.choices?.length)fail('Choose a narrative branch before continuing');
 if(scene.needsWorld&&!state.selectedWorld)fail('Choose a creative world');
 if(!scene.next)fail('The story has reached its ending');
 return arrive(state,scene.next);
}
export function chooseRoute(state,choiceId){
 const scene=getScene(state);
 const choice=scene.choices?.find(x=>x.id===choiceId);
 if(!choice)fail('Unavailable narrative choice');
 const flags=scene.id==='s06'?{route:choiceId}:scene.id==='s11'?{ethics:choiceId}:null;
 if(!flags)fail('Not a branching scene');
 return arrive(state,choice.to,flags);
}
export function discover(state,hotspotId){
 const scene=getScene(state);
 const hotspot=scene.hotspots?.find(x=>x.id===hotspotId);
 if(!hotspot)fail('Unknown or unavailable discovery');
 if(state.collected.includes(hotspotId))return clone(state);
 const result=clone(state);
 result.collected.push(hotspotId);
 validate(result);
 return result;
}
export function openSecret(state){
 const scene=getScene(state);
 if(!['s07','s08'].includes(scene.id))fail('Secret cannot be opened here');
 const hotspot=scene.hotspots?.find(h=>h.opens==='s09');
 if(!hotspot||!state.collected.includes(hotspot.id))fail('Find the indicated object first');
 return arrive(state,'s09');
}
export function selectWorld(state,worldId){
 const scene=getScene(state);
 if(scene.id!=='s14')fail('World selection is available in the portal gallery');
 if(!WORLDS.some(w=>w.id===worldId))fail('Unknown creative world');
 const updated=clone(state);
 updated.selectedWorld=worldId;
 return updated;
}
export function goBack(state){
 validate(state);
 if(!state.history.length)return clone(state);
 const updated=clone(state);
 const prev=updated.history.pop();
 Object.assign(updated,clone(prev));
 updated.history=state.history.slice(0,-1).map(clone);
 updated.locale=state.locale; // changing language does not change past choices
 validate(updated);return updated;
}
export function skipPrologue(state){
 if(getScene(state).id!=='s01')fail('Prologue can only be skipped at the beginning');
 return arrive(state,'s05');
}
export function withLocale(state,locale){
 validate(state);assertLocale(locale);
 return {...clone(state),locale};
}
export function resetStory(locale='ru'){return createStory(locale)}
export function hasSavedNarrative(storage){
 try{return typeof storage?.getItem==='function'&&!!storage.getItem('iv_cinema_progress_v2')}
 catch{return false}
}
export function saveNarrative(state,storage){
 validate(state);
 if(!storage||typeof storage.setItem!=='function')fail('No local storage available');
 // No automatic writes and no identifying audience/marketing data.
 const payload=JSON.stringify(state);
 if(payload.length>15000)fail('Cinematic save is too large');
 storage.setItem('iv_cinema_progress_v2',payload);
 return payload.length;
}
export function restoreNarrative(storage){
 if(!storage||typeof storage.getItem!=='function')fail('No local storage available');
 const raw=storage.getItem('iv_cinema_progress_v2');
 if(!raw||raw.length>15000)fail('No valid cinematic save on this device');
 let item;try{item=JSON.parse(raw)}catch{fail('Saved story cannot be parsed')}
 return clone(validate(item));
}
export function clearNarrative(storage){
 if(!storage||typeof storage.removeItem!=='function')fail('No local storage available');
 storage.removeItem('iv_cinema_progress_v2');
}
export function progress(state){
 validate(state);
 const unique=new Set(state.visited);
 return {visited:unique.size,total:SCENE_ORDER.length,current:state.sceneId,
  complete:state.sceneId==='s16',collected:state.collected.length};
}
export function nextAssets(state){
 const scene=getScene(state);
 const ids=scene.choices?.length?scene.choices.map(c=>c.to):scene.next?[scene.next]:[];
 if(scene.id==='s07'||scene.id==='s08')ids.push('s09');
 return [...new Set(ids.map(id=>SCENES[id]?.asset).filter(Boolean))].map(id=>ASSETS[id]).filter(x=>x?.ready&&x?.file);
}
export function getEnding(state,locale=state.locale){
 validate(state);assertLocale(locale);
 const world=WORLDS.find(w=>w.id===state.selectedWorld)||WORLDS[0];
 const ethically=state.flags.ethics==='consent';
 const proof=state.flags.route==='proof';
 const hidden=state.collected.includes('hidden_tape');
 const routeLine=proof?
  L('Ты потребовал доказательств.','You asked for proof.','你选择了证据。'):
  L('Ты позволил истории удивить тебя.','You let the story surprise you.','你让故事带来惊喜。');
 const ethicLine=ethically?
  L('Ты оставил людям право отказаться.','You preserved the right to refuse.','你保留了拒绝的权利。'):
  L('Ты увидел, к чему приводит контроль без согласия.','You witnessed what control without consent can become.','你看到了缺乏同意的控制会带来什么。');
 const secret=hidden?
  L('И ты нашёл спрятанную запись Архитектора.','You also discovered the Architect’s hidden recording.','你还找到了建筑师隐藏的录音。'):
  L('Некоторые записи остались нераскрытыми.','Some recordings remain undiscovered.','有些录音仍未被发现。');
 return {
   world:{id:world.id,name:world.name,href:world.href,accent:world.accent,hook:tr(world.hook,locale),detail:tr(world.detail,locale)},
   route:tr(routeLine,locale),ethics:tr(ethicLine,locale),secret:tr(secret,locale),
   claim:L('Это финал художественной истории, а не прогноз рынка.','A fictional ending, not a market forecast.','这是虚构的结局，并非市场预测。')[locale],
   selectedExplicitly:state.selectedWorld!==null
 };
}
export function auditGraph(){
 const keys=Object.keys(SCENES);
 if(keys.length!==16||SCENE_ORDER.some(id=>!SCENES[id]))fail('Expected 16 complete cinematic scenes');
 const allEdges=new Map();
 let decisions=0,optionalSecrets=0;
 for(const id of SCENE_ORDER){
  const s=SCENES[id];
  if(!ASSETS[s.asset])fail('Missing scene asset descriptor '+id);
  if(!Number.isInteger(s.seconds)||s.seconds<7||s.seconds>65)fail('Invalid pacing '+id);
  for(const value of [s.title,s.headline,s.subtitle]){
   if(['ru','en','zh'].some(loc=>typeof value?.[loc]!=='string'||value[loc].length<4))
    fail('Missing scene translation '+id);
  }
  if(s.next&&s.choices)fail('Conflicting scene transition '+id);
  const next=[...(s.choices||[]).map(x=>x.to),...(s.next?[s.next]:[]),...(s.hotspots||[]).flatMap(h=>h.opens?[h.opens]:[])];
  if(next.some(t=>!VALID_SCENES.has(t)))fail('Invalid outgoing scene '+id);
  if(s.choices?.length){if(s.choices.length!==2)fail('Two options required '+id);decisions++}
  if(s.hotspots?.some(h=>h.opens))optionalSecrets++;
  allEdges.set(id,next);
 }
 if(decisions!==2||optionalSecrets!==2||WORLDS.length!==7)fail('Incomplete route and portfolio design');
 const reached=new Set();
 function visit(id){if(reached.has(id))return;reached.add(id);for(const to of allEdges.get(id)||[])visit(to)}
 visit('s01');
 if(reached.size!==16)fail('Unreachable cinematic scenes: '+keys.filter(id=>!reached.has(id)));
 if(allEdges.get('s16').length)fail('Final scene cannot auto-transition');
 if(WORLDS.some(w=>!w.href.startsWith('../apps/')||w.href.includes('..',3)))fail('Untrusted internal product link');
 return {scenes:keys.length,branches:decisions,optionalSecrets,products:WORLDS.length,reachable:reached.size};
}
