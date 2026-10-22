import test from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from '../dead-drop/server.mjs';
import {startPlay,advancePlay,currentAct,scriptSummary,ACTS,CHANNELS} from '../../apps/brief-theatre/engine.mjs';

const brief={brand:'Aurora Studio',audience:'Design agency partners',concept:'Tell the story of a team reducing rework with a transparent product demonstration',channel:'social'};
test('all channels perform exactly three sequential author-written acts',()=>{
 for(const channel of CHANNELS){
   let state=startPlay({...brief,channel});
   assert.equal(state.history.length,0);
   assert.equal(currentAct(state).act,'opening');
   for(let i=0;i<3;i++){
     state=advancePlay(state,{draft:'Audience first: show a documented demo, compare evidence, and request one pilot with 40 participants.',direction:i===1?'bold':'careful'});
     assert.equal(state.history.length,i+1);
     assert.equal(state.history[i].act,ACTS[i]);
     assert.equal(state.history[i].verified,false);
     if(i<2)assert.equal(state.status,'performing');
   }
   assert.equal(state.status,'complete');
   assert.equal(currentAct(state),null);
   const script=scriptSummary(state);
   assert.equal(script.scenes.length,3);
   assert.equal(script.factualClaimsUnverified,true);
   assert.equal(script.noRealCampaignLaunched,true);
   assert.equal(script.maxSignals,9);
   assert.ok(script.editorialSignals<=9);
   assert.throws(()=>advancePlay(state,{draft:'Another valid scene after finale',direction:'bold'}),/completed/);
 }
});
test('director choice changes the next act pressure',()=>{
 const careful=advancePlay(startPlay(brief),{draft:'A real audience begins the story and recognizes their operational problem.',direction:'careful'});
 const bold=advancePlay(startPlay(brief),{draft:'An unexpected opening sets up a conflict for agency teams to solve.',direction:'bold'});
 assert.equal(currentAct(careful).pressure,'challengeClarity');
 assert.equal(currentAct(bold).pressure,'challengeRisk');
});
test('invalid inputs and scene lengths cannot bypass the three-act protocol',()=>{
 assert.throws(()=>startPlay({...brief,concept:'short'}),/Concept/);
 assert.throws(()=>startPlay({...brief,channel:'telepathy'}),/channel/);
 let play=startPlay(brief);
 assert.throws(()=>advancePlay(play,{draft:'no',direction:'bold'}),/Scene draft/);
 assert.throws(()=>advancePlay(play,{draft:'A valid but constrained creative scene',direction:'hyper'}),/director/);
 assert.throws(()=>scriptSummary(play),/Three scenes/);
});
test('Node serves theatre module with same-origin CSP and rejects unknown files',async t=>{
 const app=createApp({dbPath:':memory:'});
 await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));
 t.after(async()=>{await new Promise(resolve=>app.server.close(resolve));app.db.close();});
 const base='http://127.0.0.1:'+app.server.address().port;
 for(const path of ['/apps/brief-theatre/','/apps/brief-theatre/app.js','/apps/brief-theatre/engine.mjs']){
   const res=await fetch(base+path);
   assert.equal(res.status,200);
   assert.match(res.headers.get('content-security-policy'),/script-src 'self'/);
 }
 assert.equal((await fetch(base+'/apps/brief-theatre/secret.ini')).status,404);
});
