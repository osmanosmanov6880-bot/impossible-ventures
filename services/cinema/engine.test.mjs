import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../dead-drop/server.mjs';
import { FILM,PROTOTYPE } from '../../apps/cinema/story.mjs';
import {
  checkEditions,validateFilm,storyboard,createSession,availableChoices,
  inaccessibleChoices,inspect,choose,back,backTo,fragments,progress,
  nextPreload,serialize,restore,currentScene,narration,isFinished,safeJournal,
  StoryError
} from '../../apps/cinema/engine.mjs';

const begin=(edition='full')=>createSession(edition);
const move=(state,id)=>choose(state,id);
const runToFork=()=>move(move(move(begin(),'wake'),'enter'),'walk');
const route=(which='human')=>move(runToFork(),which);

function reachCouncil(kind='human',policy='consent'){
  let state=route(kind);
  const routeAction=kind==='human'?'listen':kind==='story'?'truth':'test';
  state=move(state,routeAction);
  state=move(state,'understand');
  state=move(state,'leave');
  return move(state,policy);
}
test('15 film scenes and real 3-scene prototype validate with no unreachable graph targets',()=>{
  const [full,proto]=checkEditions();
  assert.equal(full.scenes,15);
  assert.equal(full.reachable,15);
  assert.ok(full.branches>=16);
  assert.ok(full.hotspots>=12);
  assert.equal(proto.scenes,3);
  assert.equal(proto.reachable,3);
  assert.equal(FILM.scenes.length,15);
  assert.equal(PROTOTYPE.scenes.length,3);
  assert.deepEqual(FILM.scenes.map(x=>x.id),Array.from({length:15},(_,i)=>'s'+String(i).padStart(2,'0')));
  assert.equal(validateFilm(FILM).scenes,15);
  assert.equal(storyboard('prototype').startingScene,'s00');
  assert.ok(FILM.scenes.every(x=>x.seconds>=5 && x.seconds<=45));
  assert.ok(FILM.scenes.every(x=>x.art.endsWith('.svg') && x.optionalPhotographic.endsWith('.webp')));
  assert.equal(FILM.scenes.some(x=>!x.camera||!x.composition),false);
});
test('The three-scene PROTOTYPE is fully playable and has distinct human/story/evidence endings',()=>{
  const intros=availableChoices(begin('prototype'));
  assert.deepEqual(intros.map(x=>x.id),['wake','skip']);
  const fork=move(begin('prototype'),'wake');
  assert.equal(currentScene(fork).id,'s03');
  const options=availableChoices(fork);
  assert.deepEqual(options.map(x=>x.id),['human','story','evidence']);
  for(const id of options.map(x=>x.id)){
    const end=move(fork,id);
    assert.equal(currentScene(end).id,'s14');
    assert.equal(end.flags.route,id);
    assert.equal(end.history.length,2);
    assert.equal(isFinished(end),true);
    assert.equal(progress(end).finished,true);
    assert.equal(progress(end).uniqueVisited,3);
    assert.match(narration(end),id==='human'?/человека/:id==='story'?/истории/:/доказательства/);
  }
  assert.equal(currentScene(move(begin('prototype'),'skip')).id,'s03');
});
test('Three real routes converge through distinct anti-persona, theatre, and evidence scenes',()=>{
  const out={
    human:['s04','listen'],story:['s05','truth'],evidence:['s06','test']
  };
  for(const [kind,[sceneId,decision]] of Object.entries(out)){
    const chosen=route(kind);
    assert.equal(currentScene(chosen).id,sceneId);
    assert.equal(chosen.flags.route,kind);
    const core=move(chosen,decision);
    assert.equal(core.sceneId,'s07');
    assert.equal(core.flags.ethics,'respect');
  }
  assert.equal(currentScene(runToFork()).id,'s03');
  assert.equal(availableChoices(runToFork()).length,3);
});
test('Ethical and spectacle choices lead to different full scenes and consequence flags',()=>{
  const gentle=reachCouncil('human','consent');
  assert.equal(gentle.sceneId,'s10');
  assert.equal(gentle.flags.policy,'consent');
  assert.equal(move(gentle,'follow').sceneId,'s12');
  const risk=reachCouncil('story','spectacle');
  assert.equal(risk.sceneId,'s11');
  assert.equal(risk.flags.policy,'spectacle');
  const repaired=move(risk,'repair');
  assert.equal(repaired.flags.policy,'consent');
  assert.equal(repaired.flags.repaired,true);
  const uncorrected=move(risk,'observe');
  assert.equal(uncorrected.flags.policy,'spectacle');
  assert.equal(uncorrected.flags.repaired,false);
  assert.match(narration(uncorrected),/шум не превращается в доверие/);
});
test('Three authentic optional details unlock the hidden room; locked button cannot be faked',()=>{
  let s=begin();
  s=move(s,'wake');
  s=inspect(s,'beacon').state;
  assert.equal(fragments(s).length,1);
  s=move(s,'enter');
  s=inspect(s,'first').state;
  assert.equal(fragments(s).length,2);
  s=move(s,'walk');
  s=move(s,'human');
  s=inspect(s,'interview').state;
  assert.equal(fragments(s).length,3);
  s=move(s,'listen');
  s=move(s,'understand');
  s=move(s,'leave');
  s=move(s,'consent');
  s=move(s,'follow');
  assert.equal(s.sceneId,'s12');
  assert.ok(availableChoices(s).some(x=>x.id==='secret'));
  assert.equal(inaccessibleChoices(s).length,0);
  const secret=move(s,'secret');
  assert.equal(secret.sceneId,'s13');
  const ending=move(secret,'remember');
  assert.equal(isFinished(ending),true);
  assert.equal(safeJournal(ending).fragments.length,3);
  assert.match(safeJournal(ending).disclaimer,/не являются просмотрами рекламы/);
  // A replay with no inspected hotspots must not be able to reach the room.
  let ordinary=reachCouncil('evidence','consent');
  ordinary=move(ordinary,'follow');
  assert.equal(ordinary.sceneId,'s12');
  assert.equal(inaccessibleChoices(ordinary)[0].id,'secret');
  assert.throws(()=>move(ordinary,'secret'),StoryError);
  assert.equal(move(ordinary,'final').sceneId,'s14');
});
test('Undo/rewrite is immutable; previously visited paths are not silently retained',()=>{
  const fork=runToFork();
  const old=move(move(fork,'human'),'assume');
  assert.equal(old.flags.ethics,'risk');
  const rewind=back(old);
  assert.equal(rewind.sceneId,'s04');
  assert.equal(rewind.flags.ethics,undefined);
  const corrected=move(rewind,'listen');
  assert.equal(corrected.flags.ethics,'respect');
  assert.equal(old.flags.ethics,'risk');
  const reset=backTo(corrected,3);
  assert.equal(reset.sceneId,'s03');
  assert.equal(reset.flags.route,undefined);
  assert.equal(reset.visited.includes('s04'),false);
  const next=move(reset,'evidence');
  assert.equal(next.sceneId,'s06');
  assert.equal(back(begin()).sceneId,'s00');
});
test('Opt-in serialized state supports restore without external credentials or analytics',()=>{
  let s=move(begin(),'wake');
  s=inspect(s,'beacon').state;
  s=move(s,'enter');
  const encoded=serialize(s);
  assert.equal(JSON.parse(encoded).schema,'iv-cinematic-signal-local-v2');
  assert.equal(encoded.includes('token'),false);
  const saved=restore(encoded,'full');
  assert.deepEqual(saved,s);
  assert.equal(fragments(saved)[0],'beacon');
  assert.throws(()=>restore(encoded,'prototype'),StoryError);
  assert.throws(()=>restore('{oops','full'),StoryError);
  assert.throws(()=>restore('x'.repeat(25001),'full'),StoryError);
  assert.throws(()=>restore('{}','full'),StoryError);
});
test('Scene assets preload only next reachable choices, without preloading all 15 scenes',()=>{
  const opening=nextPreload(begin());
  assert.equal(opening.length,2);
  assert.ok(opening.every(x=>x.endsWith('.svg')));
  const branching=nextPreload(runToFork());
  assert.equal(branching.length,2);
  assert.ok(branching[0].includes('scene_04.svg'));
  assert.ok(branching[1].includes('scene_05.svg'));
  const ending=move(reachCouncil('human'),'follow');
  assert.equal(nextPreload(ending).length,1);
});
test('A malformed graph or forged user choice fails fast, never advances to a missing scene',()=>{
  const invalid={...FILM,scenes:FILM.scenes.map(x=>({...x,choices:x.choices.map(c=>({...c}))}))};
  invalid.scenes[0].choices[0].next='missing';
  assert.throws(()=>validateFilm(invalid),StoryError);
  assert.throws(()=>storyboard('unknown'),StoryError);
  assert.throws(()=>move(begin(),'forged'),StoryError);
  assert.throws(()=>inspect(begin(),'beacon'),StoryError);
  assert.throws(()=>backTo(begin(),-1),StoryError);
  assert.throws(()=>backTo(begin(),999),StoryError);
  const copy=move(begin(),'skip');
  const fake={...copy,sceneId:'not-a-scene'};
  assert.throws(()=>currentScene(fake),StoryError);
});
test('All public film files and fifteen visual compositions load over the real server with strict CSP',async t=>{
  const app=createApp({dbPath:':memory:'});
  await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));
  t.after(async()=>{await new Promise(resolve=>app.server.close(resolve));app.db.close()});
  const base='http://127.0.0.1:'+app.server.address().port;
  const paths=[
    '/cinema/','/cinema/prototype/','/cinema/cinema.css',
    '/cinema/app.mjs','/cinema/story.mjs','/cinema/engine.mjs','/cinema/audio.mjs',
    ...Array.from({length:15},(_,i)=>'/cinema/assets/scenes/scene_'+String(i).padStart(2,'0')+'.svg')
  ];
  for(const path of paths){
    const r=await fetch(base+path);
    assert.equal(r.status,200,path);
    assert.match(r.headers.get('content-security-policy')||'',/default-src 'none'/);
    assert.match(r.headers.get('content-security-policy')||'',/script-src 'self'/);
    const source=await r.text();
    assert.ok(source.length>500,path);
    if(path.endsWith('.svg')){
      assert.match(r.headers.get('content-type')||'',/image\/svg/);
      assert.match(source,/<svg[^>]*viewBox="0 0 1600 900"/);
    }
    if(path.endsWith('.mjs'))assert.match(r.headers.get('content-type')||'',/javascript/);
    if(path.endsWith('/')){
      assert.match(source,/name="viewport"/);
      assert.match(source,/data-edition=/);
      assert.match(source,/id="soundToggle"/);
      assert.match(source,/id="qualityMode"/);
      assert.match(source,/id="remember"/);
    }
  }
  assert.equal((await fetch(base+'/cinema/unknown-private-file')).status,404);
  assert.equal((await fetch(base+'/cinema/../../.env')).status,404);
});
