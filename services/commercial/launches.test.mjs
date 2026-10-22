import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../dead-drop/server.mjs';
import { SESSION_RETENTION_DAYS, AGGREGATE_RETENTION_DAYS } from './launches.mjs';

const SYS='secure-test-operator-token-2026-launch-workflow-1234567890';
const campaign={
  title:'Interstellar Coffee Encounter',venture:'ad-biome',goal:'validation',channel:'landing',
  audience:'Small independent B2B coffee makers',
  offer:'A transparent creative workshop for coffee producers',
  headline:'Choose the next chapter of your coffee project',
  body:'Explore an interactive example and decide whether a limited workshop could fit your team. No product results are guaranteed.',
  ctaLabel:'Discuss a small pilot'
};
const lead={
  company:'Northstar Coffee Lab',contact:'Ada Morgan',email:'ada@example.org',
  website:'https://example.org',goal:'validation',budget:'1k-5k',
  locale:'ru',consent:true,website_confirm:''
};

async function fixture(t,clock={now:Date.now()}){
  const old=process.env.OPERATOR_TOKEN;
  process.env.OPERATOR_TOKEN=SYS;
  t.after(()=>old===undefined?delete process.env.OPERATOR_TOKEN:process.env.OPERATOR_TOKEN=old);
  const app=createApp({dbPath:':memory:',now:()=>clock.now});
  await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));
  t.after(async()=>{await new Promise(resolve=>app.server.close(resolve));app.db.close()});
  return {base:'http://127.0.0.1:'+app.server.address().port,app,clock};
}
async function api(base,path,{method='GET',token,body,raw=false}={}){
  const headers={};
  if(token)headers.Authorization='Bearer '+token;
  if(body!==undefined)headers['Content-Type']='application/json';
  const r=await fetch(base+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
  return {status:r.status,headers:r.headers,data:raw?await r.text():await r.json()};
}
async function provision(base,name='First-Party Creative Group',creative=campaign){
  const created=await api(base,'/api/v1/operator/workspaces',{method:'POST',token:SYS,body:{name}});
  assert.equal(created.status,201);
  const ws={id:created.data.workspace.id,token:created.data.ownerCredential.token,name};
  const c=await api(base,'/api/v1/workspaces/'+ws.id+'/campaigns',{method:'POST',token:ws.token,body:creative});
  assert.equal(c.status,201);
  ws.campaignId=c.data.campaign.id;
  ws.campaignRevision=c.data.campaign.revision;
  return ws;
}
const baseOf=ws=>'/api/v1/workspaces/'+ws.id;
async function launch(base,ws,{activate=true,approve=true}={}){
  const root=baseOf(ws);
  if(approve){
    const approval=await api(base,root+'/campaigns/'+ws.campaignId+'/approve',{method:'POST',token:ws.token});
    assert.equal(approval.status,200);
  }
  const created=await api(base,root+'/launches',{method:'POST',token:ws.token,body:{campaignId:ws.campaignId}});
  assert.equal(created.status,201);
  const result={id:created.data.launch.id,...ws};
  if(activate){
    const active=await api(base,root+'/launches/'+result.id+'/activate',{method:'POST',token:ws.token});
    assert.equal(active.status,200);
    assert.equal(active.data.launch.status,'active');
  }
  return result;
}
async function session(base,id){
  const s=await api(base,'/api/v1/launches/'+id+'/sessions',{method:'POST',body:{consent:true}});
  assert.equal(s.status,201);
  assert.match(s.data.sessionToken,/^ivls_[A-Za-z0-9_-]{43}$/);
  assert.match(s.data.sessionId,/^[a-f0-9]{32}$/);
  return s.data;
}
const event=(base,id,s,kind,token=s.sessionToken)=>
  api(base,'/api/v1/launches/'+id+'/sessions/'+s.sessionId+'/'+kind,{
    method:'POST',token
  });

test('WAVE 11: explicit owner governance freezes one approved creative revision, allows pause/resume and irreversible retirement',async t=>{
  const {base}=await fixture(t),ws=await provision(base);
  const root=baseOf(ws);
  assert.equal((await api(base,root+'/launches',{method:'POST',token:ws.token,
    body:{campaignId:ws.campaignId}})).status,409,'Draft campaign must not launch');
  const approved=await api(base,root+'/campaigns/'+ws.campaignId+'/approve',{method:'POST',token:ws.token});
  assert.equal(approved.status,200);
  const created=await api(base,root+'/launches',{method:'POST',token:ws.token,body:{campaignId:ws.campaignId}});
  assert.equal(created.status,201);
  const id=created.data.launch.id;
  assert.equal(created.data.launch.sourceRevision,ws.campaignRevision);
  assert.equal(created.data.launch.creative.headline,campaign.headline);
  assert.match(created.data.notice,/not publicly accessible/);
  assert.equal((await api(base,'/api/v1/launches/'+id)).status,404);
  assert.equal((await api(base,root+'/launches',{method:'POST',token:ws.token,body:{campaignId:ws.campaignId}})).status,409);

  const activated=await api(base,root+'/launches/'+id+'/activate',{method:'POST',token:ws.token});
  assert.equal(activated.status,200);
  assert.match(activated.data.publicUrl,/^\/play\/\?id=/);
  assert.match(activated.data.embedSnippet,/iframe/);
  const live=await api(base,'/api/v1/launches/'+id);
  assert.equal(live.status,200);
  assert.equal(live.data.creative.headline,campaign.headline);
  assert.equal(live.data.creative.body,campaign.body);
  assert.equal(Object.hasOwn(live.data.creative,'audience'),false);
  assert.equal(Object.hasOwn(live.data.creative,'workspaceId'),false);
  assert.equal((await api(base,root+'/launches/'+id+'/activate',{method:'POST',token:ws.token})).status,409);

  assert.equal((await api(base,root+'/launches/'+id+'/pause',{method:'POST',token:ws.token})).status,200);
  assert.equal((await api(base,'/api/v1/launches/'+id)).status,404);
  assert.equal((await api(base,root+'/launches/'+id+'/resume',{method:'POST',token:ws.token})).status,200);
  assert.equal((await api(base,'/api/v1/launches/'+id)).status,200);
  assert.equal((await api(base,root+'/launches/'+id+'/retire',{method:'POST',token:ws.token})).status,200);
  assert.equal((await api(base,'/api/v1/launches/'+id)).status,404);
  assert.equal((await api(base,root+'/launches/'+id+'/resume',{method:'POST',token:ws.token})).status,409);
  assert.equal((await api(base,root+'/launches',{method:'POST',token:ws.token,body:{campaignId:ws.campaignId}})).status,201,
    'A permanently retired launch may be replaced only with a new explicit version');
});
test('WAVE 11: cross-tenant, editor and viewer tokens cannot publish or manage launch lifecycle',async t=>{
  const {base}=await fixture(t);
  const a=await provision(base,'Studio Alpha');
  const b=await provision(base,'Studio Beta');
  const root=baseOf(a);
  assert.equal((await api(base,root+'/campaigns/'+a.campaignId+'/approve',{method:'POST',token:a.token})).status,200);
  const editor=await api(base,root+'/tokens',{method:'POST',token:a.token,body:{label:'Copy author',role:'editor'}});
  const viewer=await api(base,root+'/tokens',{method:'POST',token:a.token,body:{label:'Business analyst',role:'viewer'}});
  assert.equal(editor.status,201);assert.equal(viewer.status,201);
  assert.equal((await api(base,root+'/launches',{method:'POST',token:editor.data.token,body:{campaignId:a.campaignId}})).status,403);
  assert.equal((await api(base,root+'/launches',{method:'POST',token:viewer.data.token,body:{campaignId:a.campaignId}})).status,403);
  const created=await launch(base,a,{approve:false,activate:false});
  const id=created.id;
  assert.equal((await api(base,root+'/launches/'+id+'/activate',{method:'POST',token:editor.data.token})).status,403);
  assert.equal((await api(base,root+'/launches/'+id+'/retire',{method:'POST',token:b.token})).status,403);
  assert.equal((await api(base,root+'/launches',{token:b.token})).status,403);
  assert.equal((await api(base,root+'/launches/'+id+'/metrics',{token:viewer.data.token})).status,200);
  assert.equal((await api(base,root+'/launches/'+id+'/activate',{method:'POST',token:a.token})).status,200);
  assert.equal((await api(base,root+'/launches/'+id+'/report.csv',{token:viewer.data.token,raw:true})).status,200);
});
test('WAVE 11/15: active launch becomes unavailable immediately when source campaign is archived',async t=>{
  const {base}=await fixture(t),ws=await provision(base);
  const activated=await launch(base,ws);
  const root=baseOf(ws);
  assert.equal((await api(base,root+'/campaigns/'+ws.campaignId+'/archive',{method:'POST',token:ws.token})).status,200);
  assert.equal((await api(base,'/api/v1/launches/'+activated.id)).status,404);
  assert.equal((await api(base,'/api/v1/launches/'+activated.id+'/sessions',{method:'POST',body:{consent:true}})).status,404);
  assert.equal((await api(base,root+'/launches/'+activated.id+'/pause',{method:'POST',token:ws.token})).status,200);
  assert.equal((await api(base,root+'/launches/'+activated.id+'/resume',{method:'POST',token:ws.token})).status,409);
});

test('WAVE 12/13: players can decline analytics entirely; unique opt-in session and events are idempotent',async t=>{
  const {base}=await fixture(t),ws=await provision(base);
  const {id}=await launch(base,ws);
  assert.equal((await api(base,'/api/v1/launches/'+id+'/sessions',{method:'POST',body:{consent:false}})).status,422);
  assert.equal((await api(base,'/api/v1/launches/'+id+'/sessions',{method:'POST',body:{}})).status,422);
  let m=(await api(base,baseOf(ws)+'/launches/'+id+'/metrics',{token:ws.token})).data;
  assert.deepEqual(m.totals,{sessions:0,completions:0,cta:0});
  const s=await session(base,id);
  assert.equal((await event(base,id,s,'cta')).status,409,'CTA requires explicit story-finished signal');
  assert.equal((await event(base,id,s,'complete','ivls_invalid')).status,403);
  const first=await event(base,id,s,'complete');
  assert.equal(first.status,200);assert.equal(first.data.recorded,true);
  const repeated=await event(base,id,s,'complete');
  assert.equal(repeated.status,200);assert.equal(repeated.data.recorded,false);
  const clicked=await event(base,id,s,'cta');
  assert.equal(clicked.status,200);assert.equal(clicked.data.recorded,true);
  assert.match(clicked.data.attribution.receipt,/^ivl_[A-Za-z0-9_-]{32}$/);
  assert.equal((await event(base,id,s,'cta')).data.recorded,false);
  m=(await api(base,baseOf(ws)+'/launches/'+id+'/metrics',{token:ws.token})).data;
  assert.deepEqual(m.totals,{sessions:1,completions:1,cta:1});
  assert.equal(m.leads.submittedForms,0);
  assert.match(m.note,/not impressions, unique real humans|Not impressions, unique real humans/i);
  assert.equal(m.daily.length,1);
});
test('WAVE 13: public sessions are rate-limited, never expose stored token hashes or lead contacts',async t=>{
  const {base}=await fixture(t),ws=await provision(base);
  const {id}=await launch(base,ws);
  let last;
  for(let i=0;i<25;i++){last=await api(base,'/api/v1/launches/'+id+'/sessions',{method:'POST',body:{consent:true}});assert.equal(last.status,201)}
  assert.equal((await api(base,'/api/v1/launches/'+id+'/sessions',{method:'POST',body:{consent:true}})).status,429);
  const publicData=await api(base,'/api/v1/launches/'+id);
  assert.equal(publicData.status,200);
  for(const key of ['token_hash','launch_sessions','contactEmail','workspaceId','sessionToken']){
    assert.equal(JSON.stringify(publicData.data).includes(key),false);
  }
  const internal=await api(base,baseOf(ws)+'/launches/'+id,{token:ws.token});
  assert.equal(internal.status,200);
  assert.equal(internal.data.metrics.totals.sessions,25);
  assert.equal(JSON.stringify(internal.data).includes('token_hash'),false);
});
test('WAVE 14: one-time CTA receipt correctly attributes a separately consented contact request and never implies payment',async t=>{
  const {base}=await fixture(t),ws=await provision(base);
  const {id}=await launch(base,ws);
  const s=await session(base,id);
  await event(base,id,s,'complete');
  const clicked=await event(base,id,s,'cta');
  const proof=clicked.data.attribution;
  assert.equal((await api(base,'/api/v1/pilots',{method:'POST',body:{
    ...lead,consent:false,launchAttribution:proof
  }})).status,422);
  assert.equal((await api(base,'/api/v1/pilots',{method:'POST',body:{
    ...lead,launchAttribution:{...proof,receipt:'ivl_'+'a'.repeat(32)}
  }})).status,422);
  const submitted=await api(base,'/api/v1/pilots',{method:'POST',body:{
    ...lead,launchAttribution:proof
  }});
  assert.equal(submitted.status,201);
  assert.equal(submitted.data.attributed,true);
  assert.equal(submitted.data.attributionSource,'first-party-launch');
  assert.match(submitted.data.note,/not a qualified lead or verified paid customer/);
  assert.equal((await api(base,'/api/v1/pilots',{method:'POST',body:{
    ...lead,launchAttribution:proof
  }})).status,422);
  const ownerM=(await api(base,baseOf(ws)+'/launches/'+id+'/metrics',{token:ws.token})).data;
  assert.equal(ownerM.leads.submittedForms,1);
  assert.equal(ownerM.leads.operatorQualified,0);
  const operator=await api(base,'/api/v1/operator/pilots',{token:SYS});
  assert.equal(operator.status,200);
  assert.equal(operator.data.items[0].launchId,id);
  const q=await api(base,'/api/v1/operator/pilots/'+submitted.data.requestId+'/status',{
    method:'POST',token:SYS,body:{status:'qualified'}
  });
  assert.equal(q.status,200);
  const later=(await api(base,baseOf(ws)+'/launches/'+id+'/metrics',{token:ws.token})).data;
  assert.equal(later.leads.operatorQualified,1);
  const csv=await api(base,baseOf(ws)+'/launches/'+id+'/report.csv',{token:ws.token,raw:true});
  assert.equal(csv.status,200);
  assert.match(csv.headers.get('content-type'),/text\/csv/);
  assert.match(csv.data,/utc_day,consented_session_starts,completion_signals,cta_signals/);
  assert.match(csv.data,/attributed_form_submissions,1/);
  assert.match(csv.data,/manually_qualified_forms,1/);
  assert.match(csv.data,/verified_payments,not_integrated/);
  assert.equal(csv.data.includes(lead.email),false);
  assert.equal((await api(base,baseOf(ws)+'/launches/'+id+'/report.csv',{raw:true})).status,401);
  assert.equal((await api(base,'/api/v1/pilots/'+submitted.data.requestId,{method:'DELETE',token:submitted.data.deleteToken})).status,200);
  const after=(await api(base,baseOf(ws)+'/launches/'+id+'/metrics',{token:ws.token})).data;
  assert.equal(after.leads.submittedForms,0);
  assert.equal(after.leads.operatorQualified,0);
  assert.equal((await api(base,'/api/v1/pilots',{method:'POST',body:{
    ...lead,launchAttribution:proof
  }})).status,422,'Deleted contact does not make attribution reusable');
});
test('WAVE 14: forged, simultaneous dual-source and expired one-time attribution are refused',async t=>{
  const clock={now:Date.parse('2026-10-01T10:00:00Z')};
  const {base}=await fixture(t,clock),ws=await provision(base);
  const {id}=await launch(base,ws);
  const s=await session(base,id);
  await event(base,id,s,'complete');
  const click=await event(base,id,s,'cta');
  const proof=click.data.attribution;
  assert.equal((await api(base,'/api/v1/pilots',{method:'POST',body:{
    ...lead,attribution:{sessionId:'a'.repeat(32),receipt:'iva_'+'a'.repeat(32)},launchAttribution:proof
  }})).status,422);
  assert.equal((await api(base,'/api/v1/pilots',{method:'POST',body:{
    ...lead,launchAttribution:{sessionId:s.sessionId,receipt:'wrong'}
  }})).status,422);
  clock.now+=8*86_400_000;
  assert.equal((await api(base,'/api/v1/pilots',{method:'POST',body:{
    ...lead,launchAttribution:proof
  }})).status,422);
  assert.equal((await event(base,id,s,'complete')).status,410);
});
test('WAVE 15: session data expires after 7 days, daily aggregates after 90 days',async t=>{
  const clock={now:Date.parse('2026-10-01T10:00:00Z')};
  const {base,app}=await fixture(t,clock),ws=await provision(base);
  const {id}=await launch(base,ws);
  const sess=await session(base,id);
  await event(base,id,sess,'complete');
  await event(base,id,sess,'cta');
  clock.now+=8*86_400_000;
  app.db.prepare('SELECT count(*) AS n FROM launch_sessions').get();
  const before=(await api(base,baseOf(ws)+'/launches/'+id+'/metrics',{token:ws.token})).data;
  assert.equal(before.totals.sessions,1);
  assert.equal((await event(base,id,sess,'complete')).status,410);
  clock.now+=90*86_400_000;
  const later=(await api(base,baseOf(ws)+'/launches/'+id+'/metrics',{token:ws.token})).data;
  assert.equal(later.totals.sessions,0);
  assert.equal(later.totals.cta,0);
});
test('WAVE 15: workspace export and deletion include and purge tenant launches but keep global lead consent intact',async t=>{
  const {base,app}=await fixture(t),ws=await provision(base);
  const {id}=await launch(base,ws);
  const sess=await session(base,id);
  await event(base,id,sess,'complete');
  const click=await event(base,id,sess,'cta');
  const added=await api(base,'/api/v1/pilots',{method:'POST',body:{
    ...lead,launchAttribution:click.data.attribution
  }});
  assert.equal(added.status,201);
  const exported=await api(base,baseOf(ws)+'/export',{token:ws.token});
  assert.equal(exported.status,200);
  assert.equal(exported.data.launches.length,1);
  assert.equal(exported.data.launchAggregates.length,1);
  assert.equal(JSON.stringify(exported.data).includes(sess.sessionToken),false);
  const removed=await api(base,baseOf(ws),{method:'DELETE',token:ws.token,body:{confirmName:ws.name}});
  assert.equal(removed.status,200);
  assert.equal((await api(base,'/api/v1/launches/'+id)).status,404);
  for(const table of ['commercial_launches','launch_sessions','launch_daily']){
    assert.equal(app.db.prepare('SELECT COUNT(*) AS n FROM '+table).get().n,0);
  }
  assert.equal(app.db.prepare('SELECT launch_id FROM pilot_leads WHERE id=?').get(added.data.requestId).launch_id,null);
  const pilot=await api(base,'/api/v1/operator/pilots',{token:SYS});
  assert.equal(pilot.data.items.length,1);
  assert.equal(pilot.data.items[0].launchId,null);
});

test('WAVE 12/15: all first-party story resources use strict CSP, correct ES module MIME and same-origin iframe restrictions',async t=>{
  const {base}=await fixture(t);
  for(const path of ['/play/','/play/index.html','/play/style.css','/play/app.mjs','/play/story.mjs']){
    const response=await fetch(base+path);
    assert.equal(response.status,200,path);
    assert.match(response.headers.get('content-security-policy'),/script-src 'self'/);
    assert.match(response.headers.get('content-security-policy'),/frame-ancestors 'self'/);
    assert.equal(response.headers.get('x-frame-options'),'SAMEORIGIN');
    if(path.endsWith('.mjs'))assert.match(response.headers.get('content-type'),/javascript/);
    assert.ok((await response.text()).length>80);
  }
  const proposal=await fetch(base+'/proposal/');
  assert.equal(proposal.headers.get('x-frame-options'),'DENY');
  const forbidden=await fetch(base+'/play/source.private');
  assert.equal(forbidden.status,404);
});
