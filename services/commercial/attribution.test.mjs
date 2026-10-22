import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { DatabaseSync } from 'node:sqlite';
import { createApp } from '../dead-drop/server.mjs';

const OP = 'operator-attribution-test-long-random-string-987654321';
const experiment = {
  title:'Attribution Pilot Experiment',
  audience:'Teams exploring creative marketing experiments',
  offer:'Explore an initial campaign strategy session',
  hypothesis:'Interactive choice will produce more CTA interest than static creative.',
  controlHeadline:'Improve your campaign with evidence',
  controlBody:'Compare creative approaches before spending your first test budget.',
  variantHeadline:'Choose the next chapter of your marketing',
  variantBody:'Each story opens a different path. Select a direction to reveal the next action.',
  decisionPrompt:'Which approach would you choose to improve this campaign?',
  choiceOneLabel:'A faster launch',
  choiceOneReveal:'You discover speed can help only when the hypothesis is clear.',
  choiceTwoLabel:'A more careful test',
  choiceTwoReveal:'You discover how transparent measurement can improve your planning.',
  ctaLabel:'Discuss a pilot'
};
const lead = {
  company:'Real Form Test Company',contact:'Ada Morgan',email:'ada@example.org',
  website:'https://example.org',goal:'leads',budget:'1k-5k',
  locale:'ru',consent:true,website_confirm:''
};
async function fixture(t,{path=':memory:',clock={now:Date.now()}}={}){
  const old=process.env.OPERATOR_TOKEN;process.env.OPERATOR_TOKEN=OP;
  t.after(()=>old===undefined?delete process.env.OPERATOR_TOKEN:process.env.OPERATOR_TOKEN=old);
  const app=createApp({dbPath:path,now:()=>clock.now});
  await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));
  t.after(async()=>{await new Promise(resolve=>app.server.close(resolve));app.db.close()});
  return {base:'http://127.0.0.1:'+app.server.address().port,app,clock};
}
async function api(base,url,{method='GET',token,body}={}){
  const headers={};
  if(token)headers.Authorization='Bearer '+token;
  if(body!==undefined)headers['Content-Type']='application/json';
  const r=await fetch(base+url,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
  return {status:r.status,data:await r.json()};
}
async function assigned(base){
  const created=await api(base,'/api/v1/operator/experiments',{method:'POST',token:OP,body:experiment});
  assert.equal(created.status,201);
  const id=created.data.id;
  const running=await api(base,'/api/v1/operator/experiments/'+id+'/status',{method:'POST',token:OP,body:{status:'running'}});
  assert.equal(running.status,200);
  const started=await api(base,'/api/v1/experiments/'+id+'/sessions',{method:'POST',body:{consent:true}});
  assert.equal(started.status,201);
  const click=await api(base,'/api/v1/experiments/'+id+'/sessions/'+started.data.sessionId+'/cta',{
    method:'POST',token:started.data.token
  });
  assert.equal(click.status,200);
  assert.equal(click.data.recorded,true);
  assert.match(click.data.attribution.receipt,/^iva_[A-Za-z0-9_-]{32}$/);
  return {id,arm:started.data.arm,click,session:started.data.sessionId};
}

test('WAVE 4: a real consented form receives one-time verified experiment attribution, no invented revenue',async t=>{
  const {base}=await fixture(t);
  const {id,arm,click,session}=await assigned(base);
  const receipt={sessionId:session,receipt:click.data.attribution.receipt};
  assert.equal((await api(base,'/api/v1/pilots',{method:'POST',body:{...lead,consent:false,attribution:receipt}})).status,422);
  const submitted=await api(base,'/api/v1/pilots',{method:'POST',body:{...lead,attribution:receipt}});
  assert.equal(submitted.status,201);
  assert.equal(submitted.data.attributed,true);
  const pilots=await api(base,'/api/v1/operator/pilots',{token:OP});
  assert.equal(pilots.status,200);
  assert.equal(pilots.data.items.length,1);
  assert.equal(pilots.data.items[0].experimentId,id);
  assert.equal(pilots.data.items[0].experimentArm,arm);
  assert.equal(JSON.stringify(pilots.data).includes(receipt.receipt),false);
  const metrics=(await api(base,'/api/v1/operator/experiments',{token:OP})).data.items[0].metrics;
  assert.equal(metrics.attributed[arm].submittedForms,1);
  assert.equal(metrics.attributed[arm].operatorQualified,0);
  assert.equal(metrics.totalCTA,1);
  assert.match(metrics.attributionNote,/not paid revenue/);
  const qualified=await api(base,'/api/v1/operator/pilots/'+submitted.data.requestId+'/status',{
    method:'POST',token:OP,body:{status:'qualified'}
  });
  assert.equal(qualified.status,200);
  const updated=(await api(base,'/api/v1/operator/experiments',{token:OP})).data.items[0].metrics;
  assert.equal(updated.attributed[arm].operatorQualified,1);
});

test('WAVE 4: invalid and duplicate attribution claims are denied, ordinary lead forms still work',async t=>{
  const {base}=await fixture(t);
  const {click,session}=await assigned(base);
  const receipt={sessionId:session,receipt:click.data.attribution.receipt};
  assert.equal((await api(base,'/api/v1/pilots',{method:'POST',body:{...lead,attribution:{...receipt,receipt:'iva_'+'z'.repeat(32)}}})).status,422);
  assert.equal((await api(base,'/api/v1/pilots',{method:'POST',body:{...lead,attribution:{sessionId:session,receipt:'x'}}})).status,422);
  assert.equal((await api(base,'/api/v1/pilots',{method:'POST',body:{...lead,attribution:receipt}})).status,201);
  assert.equal((await api(base,'/api/v1/pilots',{method:'POST',body:{...lead,attribution:receipt}})).status,422);
  assert.equal((await api(base,'/api/v1/pilots',{method:'POST',body:{...lead}})).status,201);
  const records=(await api(base,'/api/v1/operator/pilots',{token:OP})).data.items;
  assert.equal(records.filter(x=>x.experimentId).length,1);
  assert.equal(records.filter(x=>!x.experimentId).length,1);
});

test('WAVE 4: deletion retracts attributed lead from live reports without reopening proof',async t=>{
  const {base}=await fixture(t);
  const {id,arm,session,click}=await assigned(base);
  const receipt={sessionId:session,receipt:click.data.attribution.receipt};
  const saved=await api(base,'/api/v1/pilots',{method:'POST',body:{...lead,attribution:receipt}});
  assert.equal(saved.status,201);
  assert.equal((await api(base,'/api/v1/pilots/'+saved.data.requestId,{
    method:'DELETE',token:saved.data.deleteToken
  })).status,200);
  const metrics=(await api(base,'/api/v1/operator/experiments',{token:OP})).data.items[0].metrics;
  assert.equal(metrics.attributed[arm].submittedForms,0);
  assert.equal((await api(base,'/api/v1/pilots',{method:'POST',body:{...lead,attribution:receipt}})).status,422);
  const events=(await api(base,'/api/v1/operator/experiments',{token:OP})).data.items[0];
  assert.equal(events.id,id);
  assert.equal(events.metrics.totalCTA,1);
});

test('WAVE 4: a 7-day session expiry invalidates old CTA attribution receipts',async t=>{
  const clock={now:Date.parse('2026-10-01T12:00:00Z')};
  const {base}=await fixture(t,{clock});
  const {click,session}=await assigned(base);
  clock.now+=8*86_400_000;
  assert.equal((await api(base,'/api/v1/pilots',{method:'POST',body:{
    ...lead,attribution:{sessionId:session,receipt:click.data.attribution.receipt}
  }})).status,422);
});

test('WAVE 4: v0.7 existing tables migrate in place without dropping historical records',async t=>{
  const folder=mkdtempSync(join(tmpdir(),'iv-migration-'));
  t.after(()=>rmSync(folder,{recursive:true,force:true}));
  const path=join(folder,'legacy.sqlite');
  const legacy=new DatabaseSync(path);
  legacy.exec(
    'CREATE TABLE pilot_leads (id TEXT PRIMARY KEY, created_at INTEGER NOT NULL, company TEXT NOT NULL, contact TEXT NOT NULL, email TEXT NOT NULL, website TEXT NOT NULL, goal TEXT NOT NULL, budget TEXT NOT NULL, locale TEXT NOT NULL, status TEXT NOT NULL, consent_version TEXT NOT NULL, delete_token_hash TEXT NOT NULL);' +
    'CREATE TABLE ab_sessions (id TEXT PRIMARY KEY, experiment_id TEXT NOT NULL, arm TEXT NOT NULL, token_hash TEXT NOT NULL, created_at INTEGER NOT NULL, cohort_day INTEGER NOT NULL, cta_recorded INTEGER NOT NULL DEFAULT 0);'
  );
  legacy.close();
  const {base,app}=await fixture(t,{path});
  const leadCols=app.db.prepare('PRAGMA table_info(pilot_leads)').all().map(x=>x.name);
  const sessionCols=app.db.prepare('PRAGMA table_info(ab_sessions)').all().map(x=>x.name);
  for(const name of ['experiment_id','experiment_arm'])assert.ok(leadCols.includes(name));
  for(const name of ['receipt_hash','attributed_lead_id'])assert.ok(sessionCols.includes(name));
  assert.equal((await api(base,'/api/v1/health')).status,200);
});
