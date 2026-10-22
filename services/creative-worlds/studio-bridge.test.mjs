import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../dead-drop/server.mjs';
import {evaluateCase} from '../../apps/appeal-2049-studio/tribunal-engine.mjs';
import {openChallenge} from '../../apps/antipersona/engine.mjs';
import {startPlay,advancePlay,scriptSummary} from '../../apps/brief-theatre-studio/engine.mjs';
import {createGenome,mutateGenome} from '../../apps/adbiome/engine.mjs';
import {
 toPremiumCampaignDraft,makePremiumHandoff,MAX_PREMIUM_IMPORT_BYTES,
 PREMIUM_BRIDGE_VERSION
} from '../../apps/creative-worlds/studio-bridge.mjs';

const brand='Aurora Studio';
const audience='Independent creative agencies with small teams';
const idea='Show a controlled creative workflow comparison, be transparent about limitations, and invite agencies to request an evidence-led demonstration.';
const attack='raw-private-role-token-dont-export';
const cases=[
 {
   kind:'appeal-2049-editorial-report',
   evaluation:evaluateCase({product:brand,audience,idea,evidence:'Demo pending verification',goal:'leads'}),
   token:attack,clientPassword:attack
 },
 {
   kind:'antipersona-debate-report',
   debate:openChallenge({brand,audience,idea,persona:'skeptic',pressure:'focused'}),
   token:attack
 },
 (()=>{
   let play=startPlay({brand,audience,concept:idea,channel:'social'});
   for(const act of ['opening','evidence','conversion']){
     play=advancePlay(play,{draft:act+' — Write honest campaign text, show demonstrable constraints and invite an opt-in trial.',direction:'careful'});
   }
   return {...scriptSummary(play),apiKey:attack};
 })(),
 (()=>{
   const original=createGenome({brand,audience,genes:{
     promise:'clarity',proof:'demo',tension:'friction',voice:'direct',action:'explore'
   }});
   const next=mutateGenome(original,'voice');
   return {kind:'adbiome-local-library',brand,audience,
     genomes:[original,next],claimsUnverified:true,measuredBusinessOutcomes:false,
     hostTokenHash:attack};
 })(),
 {kind:'dead-drop-agent-export',mission:{
   role:'product',status:'finalized',token:attack,roomCode:attack,
   dossier:{brand,audience,concept:idea,evidenceToVerify:'Documented but not verified',
     callToAction:'Request a pilot',rawPassword:attack},
   ownIntel:{secret:attack}
 }}
];
test('five real premium artifact formats convert to eligible unsaved drafts with no token leakage',()=>{
 const ventures=['appeal-2049','anti-persona','brief-theatre','ad-biome','dead-drop'];
 cases.forEach((item,index)=>{
   for(const locale of ['ru','en','zh']){
     const draft=toPremiumCampaignDraft(item,locale);
     assert.equal(draft.venture,ventures[index]);
     assert.equal(draft.goal,index===0?'leads':'validation');
     assert.equal(draft._bridge.persisted,false);
     assert.equal(draft._bridge.requiresEditorialReview,true);
     assert.equal(draft._bridge.revenueMeasured,false);
     assert.equal(draft._bridge.factsVerified,false);
     assert.ok(draft.body.length>=10&&draft.body.length<=700);
     assert.ok(draft.headline.length>=5&&draft.headline.length<=180);
     assert.ok(draft.offer.length>=3&&draft.offer.length<=240);
     assert.ok(draft.ctaLabel.length>=3&&draft.ctaLabel.length<=60);
     assert.equal(JSON.stringify(draft).includes(attack),false);
     assert.ok(draft.body.includes({
       ru:'ГИПОТЕЗА',en:'HYPOTHESIS',zh:'创意假设'
     }[locale]));
     const portable=makePremiumHandoff(draft);
     assert.equal(portable.version,PREMIUM_BRIDGE_VERSION);
     const roundtrip=toPremiumCampaignDraft(portable,locale);
     assert.equal(roundtrip.venture,draft.venture);
     assert.equal(roundtrip.headline,draft.headline);
     assert.equal(roundtrip._bridge.persisted,false);
     assert.equal(JSON.stringify(portable).includes(attack),false);
   }
 });
 assert.equal(MAX_PREMIUM_IMPORT_BYTES,200_000);
});
test('reject unrecognized, incomplete, falsely verified and wrong-brand exports',()=>{
 assert.throws(()=>toPremiumCampaignDraft({kind:'museum-attention-guest-placard'}),/Unsupported/);
 assert.throws(()=>toPremiumCampaignDraft({kind:'antipersona-debate-report',debate:{brief:{}}}),/Invalid/);
 assert.throws(()=>toPremiumCampaignDraft({
   kind:'appeal-2049-editorial-report',evaluation:{...cases[0].evaluation,evidenceVerified:true}
 }),/Invalid/);
 assert.throws(()=>toPremiumCampaignDraft({
   ...cases[3],brand:'Forged brand'
 }),/Mixed-brand/);
 assert.throws(()=>toPremiumCampaignDraft({
   ...cases[2],scenes:cases[2].scenes.slice(0,2)
 }),/complete/);
 assert.throws(()=>toPremiumCampaignDraft({
   kind:'dead-drop-agent-export',mission:{...cases[4].mission,status:'active'}
 }),/finalized/);
 assert.throws(()=>toPremiumCampaignDraft(cases[0],'xx'),/Unsupported locale/);
 assert.throws(()=>makePremiumHandoff({}),/validated/);
});
test('premium bridge cannot import forged handoff as verified published result',()=>{
 const draft=toPremiumCampaignDraft(cases[1],'en');
 const handoff=makePremiumHandoff(draft);
 assert.throws(()=>toPremiumCampaignDraft({...handoff,draft:{
   ...handoff.draft,_bridge:{...handoff.draft._bridge,factsVerified:true}
 }}),/Invalid unsaved/);
 assert.throws(()=>toPremiumCampaignDraft({...handoff,draft:{
   ...handoff.draft,_bridge:{...handoff.draft._bridge,persisted:true}
 }}),/Invalid unsaved/);
});
test('premium bridge module serves with same-origin CSP and the pipeline page has no private APIs',async t=>{
 const app=createApp({dbPath:':memory:'});
 await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));
 t.after(async()=>{await new Promise(resolve=>app.server.close(resolve));app.db.close();});
 const base='http://127.0.0.1:'+app.server.address().port;
 for(const path of [
   '/apps/creative-worlds/studio-bridge.mjs',
   '/apps/pipeline/',
   '/apps/pipeline/app.js'
 ]){
   const res=await fetch(base+path);
   assert.equal(res.status,200,path);
   assert.match(res.headers.get('content-security-policy'),/script-src 'self'/);
 }
});
