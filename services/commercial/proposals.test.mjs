import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../dead-drop/server.mjs';

const SYS='system-operator-key-with-more-than-32-characters';
const creative={
  title:'AdBiome Experiment',venture:'ad-biome',goal:'validation',channel:'landing',
  audience:'Small B2B marketing departments',offer:'An experiment-planning service',
  headline:'Turn bold creative into research',body:'Compare a new story with a controlled creative alternative.',
  ctaLabel:'Talk to the team'
};
const quote={
  clientName:'Acme Pilot Client',contactEmail:'CFO@Example.Org',
  description:'Discovery workshop, two creative concepts and a time-boxed validation study; ad spend excluded.',
  currency:'USD',setupCents:125000,monthlyCents:35000,months:3
};
async function setup(t,clock={now:Date.now()}){
  const old=process.env.OPERATOR_TOKEN;process.env.OPERATOR_TOKEN=SYS;
  t.after(()=>old===undefined?delete process.env.OPERATOR_TOKEN:process.env.OPERATOR_TOKEN=old);
  const app=createApp({dbPath:':memory:',now:()=>clock.now});
  await new Promise(ok=>app.server.listen(0,'127.0.0.1',ok));
  t.after(async()=>{await new Promise(ok=>app.server.close(ok));app.db.close()});
  return 'http://127.0.0.1:'+app.server.address().port;
}
async function api(base,path,{method='GET',token,body}={}){
  const h={};if(token)h.Authorization='Bearer '+token;
  if(body!==undefined)h['Content-Type']='application/json';
  const r=await fetch(base+path,{method,headers:h,body:body===undefined?undefined:JSON.stringify(body)});
  return {status:r.status,data:await r.json()};
}
async function provision(base,name='Example Team'){
  const org=await api(base,'/api/v1/operator/workspaces',{method:'POST',token:SYS,body:{name}});
  assert.equal(org.status,201);
  const id=org.data.workspace.id, token=org.data.ownerCredential.token;
  const campaign=await api(base,'/api/v1/workspaces/'+id+'/campaigns',{method:'POST',token,body:creative});
  assert.equal(campaign.status,201);
  return {id,token,campaignId:campaign.data.campaign.id};
}
test('WAVE 5: actual proposal amount and currency are deterministic, never described as paid revenue',async t=>{
  const base=await setup(t),ws=await provision(base);
  const root='/api/v1/workspaces/'+ws.id+'/proposals';
  assert.equal((await api(base,root,{method:'POST',token:ws.token,
    body:{...quote,campaignId:ws.campaignId,setupCents:12.5}})).status,400);
  assert.equal((await api(base,root,{method:'POST',token:ws.token,
    body:{...quote,campaignId:ws.campaignId,months:25}})).status,400);
  const created=await api(base,root,{method:'POST',token:ws.token,body:{...quote,campaignId:ws.campaignId}});
  assert.equal(created.status,201);
  assert.equal(created.data.proposal.status,'draft');
  assert.equal(created.data.proposal.totalCents,230000);
  assert.equal(created.data.proposal.currency,'USD');
  assert.equal(created.data.proposal.contactEmail,'cfo@example.org');
  const report=await api(base,root,{token:ws.token});
  assert.equal(report.data.summary.paymentTracking,'not_integrated');
  assert.match(report.data.summary.warning,/not recognized or verified collected revenue/);
  assert.equal(report.data.summary.byCurrency.USD.draft.nominalCents,230000);
  assert.equal((await api(base,'/api/v1/proposals/'+created.data.proposal.id)).status,404);
  assert.equal((await api(base,root+'/'+created.data.proposal.id,{
    method:'PATCH',token:ws.token,body:{expectedRevision:1,monthlyCents:45000}
  })).data.proposal.totalCents,260000);
  assert.equal((await api(base,root+'/'+created.data.proposal.id,{
    method:'PATCH',token:ws.token,body:{expectedRevision:1,monthlyCents:45000}
  })).status,409);
});
test('WAVE 5: owner sends private customer proposal; possession-only decision is not e-signature',async t=>{
  const base=await setup(t),ws=await provision(base);
  const root='/api/v1/workspaces/'+ws.id+'/proposals';
  const created=await api(base,root,{method:'POST',token:ws.token,body:{...quote,campaignId:ws.campaignId}});
  const id=created.data.proposal.id;
  const sent=await api(base,root+'/'+id+'/send',{method:'POST',token:ws.token});
  assert.equal(sent.status,200);
  assert.equal(sent.data.proposal.status,'sent');
  assert.match(sent.data.secureShareFragment,/^\/proposal\/\?id=[a-f0-9]{24}#token=ivp_/);
  const secret=sent.data.secureShareFragment.split('#token=')[1];
  assert.equal((await api(base,'/api/v1/proposals/'+id)).status,401);
  assert.equal((await api(base,'/api/v1/proposals/'+id,{token:'ivp_invalid'})).status,403);
  const shared=await api(base,'/api/v1/proposals/'+id,{token:secret});
  assert.equal(shared.status,200);
  assert.equal(shared.data.proposal.totalCents,230000);
  assert.equal(Object.hasOwn(shared.data.proposal,'contactEmail'),false);
  assert.match(shared.data.proposal.statement,/not an invoice/);
  assert.equal((await api(base,'/api/v1/proposals/'+id+'/decision',{method:'POST',token:secret,body:{decision:'paid'}})).status,400);
  const accepted=await api(base,'/api/v1/proposals/'+id+'/decision',{
    method:'POST',token:secret,body:{decision:'accepted'}
  });
  assert.equal(accepted.status,200);
  assert.match(accepted.data.note,/not a legal identity signature/);
  assert.equal((await api(base,'/api/v1/proposals/'+id+'/decision',{
    method:'POST',token:secret,body:{decision:'accepted'}
  })).status,409);
  const report=await api(base,root,{token:ws.token});
  assert.equal(report.data.summary.byCurrency.USD.accepted.nominalCents,230000);
  assert.equal(report.data.summary.paymentTracking,'not_integrated');
});
test('WAVE 5: private link rotation invalidates leaked token; only owner may send or cancel',async t=>{
  const base=await setup(t),ws=await provision(base,'Agency Owner');
  const root='/api/v1/workspaces/'+ws.id;
  const issued=await api(base,root+'/tokens',{method:'POST',token:ws.token,body:{label:'Campaign author',role:'editor'}});
  assert.equal(issued.status,201);
  const editor=issued.data.token;
  const created=await api(base,root+'/proposals',{method:'POST',token:editor,body:{...quote,campaignId:ws.campaignId}});
  assert.equal(created.status,201);
  const id=created.data.proposal.id;
  assert.equal((await api(base,root+'/proposals/'+id+'/send',{method:'POST',token:editor})).status,403);
  const sent=await api(base,root+'/proposals/'+id+'/send',{method:'POST',token:ws.token});
  assert.equal(sent.status,200);
  const oldSecret=sent.data.secureShareFragment.split('#token=')[1];
  const rotated=await api(base,root+'/proposals/'+id+'/reissue',{method:'POST',token:ws.token});
  assert.equal(rotated.status,200);
  const newSecret=rotated.data.secureShareFragment.split('#token=')[1];
  assert.notEqual(newSecret,oldSecret);
  assert.equal((await api(base,'/api/v1/proposals/'+id,{token:oldSecret})).status,403);
  assert.equal((await api(base,'/api/v1/proposals/'+id,{token:newSecret})).status,200);
  assert.equal((await api(base,root+'/proposals/'+id+'/cancel',{method:'POST',token:ws.token})).status,200);
  assert.equal((await api(base,'/api/v1/proposals/'+id+'/decision',{
    method:'POST',token:newSecret,body:{decision:'accepted'}
  })).status,409);
});
test('WAVE 5: cross-organization finance access blocked; company-facing preview never reveals email',async t=>{
  const base=await setup(t);
  const A=await provision(base,'Separate Alpha Group'), B=await provision(base,'Separate Beta Group');
  const root='/api/v1/workspaces/'+A.id+'/proposals';
  assert.equal((await api(base,root,{method:'POST',token:A.token,
    body:{...quote,campaignId:B.campaignId}})).status,404);
  const one=await api(base,root,{method:'POST',token:A.token,body:{...quote,campaignId:A.campaignId}});
  assert.equal(one.status,201);
  assert.equal((await api(base,root,{token:B.token})).status,403);
  assert.equal((await api(base,root+'/'+one.data.proposal.id,{token:B.token})).status,403);
  assert.equal((await api(base,root+'/'+one.data.proposal.id+'/send',{method:'POST',token:B.token})).status,403);
});


test('WAVE 5: owner export contains private data without plaintext credentials; exact-name deletion removes all tenant records',async t=>{
  const base=await setup(t);
  const ws=await provision(base,'Deleting Creative Workspace');
  const root='/api/v1/workspaces/'+ws.id;
  const quoteCreated=await api(base,root+'/proposals',{
    method:'POST',token:ws.token,body:{...quote,campaignId:ws.campaignId}
  });
  assert.equal(quoteCreated.status,201);
  const sent=await api(base,root+'/proposals/'+quoteCreated.data.proposal.id+'/send',{
    method:'POST',token:ws.token
  });
  assert.equal(sent.status,200);
  const secret=sent.data.secureShareFragment.split('#token=')[1];
  const exported=await api(base,root+'/export',{token:ws.token});
  assert.equal(exported.status,200);
  assert.equal(exported.data.campaigns.length,1);
  assert.equal(exported.data.proposals.length,1);
  assert.equal(exported.data.proposals[0].contact_email,'cfo@example.org');
  assert.equal(JSON.stringify(exported.data).includes(ws.token),false);
  assert.equal(JSON.stringify(exported.data).includes(secret),false);
  assert.equal((await api(base,root,{method:'DELETE',token:ws.token,body:{confirmName:'wrong'}})).status,422);
  const deleted=await api(base,root,{method:'DELETE',token:ws.token,body:{confirmName:'Deleting Creative Workspace'}});
  assert.equal(deleted.status,200);
  assert.equal(deleted.data.deleted,true);
  assert.equal((await api(base,root,{token:ws.token})).status,403);
  assert.equal((await api(base,root+'/proposals',{token:ws.token})).status,403);
  assert.equal((await api(base,'/api/v1/proposals/'+quoteCreated.data.proposal.id,{token:secret})).status,404);
  assert.equal((await api(base,'/api/v1/operator/workspaces',{token:SYS})).data.total,0);
});

test('WAVE 5: proposal contact information is removed at 180-day alpha retention',async t=>{
  const clock={now:Date.parse('2026-10-22T12:00:00Z')};
  const base=await setup(t,clock),ws=await provision(base,'Time Limited Studio');
  const root='/api/v1/workspaces/'+ws.id+'/proposals';
  assert.equal((await api(base,root,{method:'POST',token:ws.token,
    body:{...quote,campaignId:ws.campaignId}})).status,201);
  assert.equal((await api(base,root,{token:ws.token})).data.items.length,1);
  clock.now+=181*86_400_000;
  // The initial owner credential also expires at 180 days. Rotate it using
  // the system operator before inspecting automatically expired proposal data.
  const rotated=await api(base,'/api/v1/operator/workspaces/'+ws.id+'/rotate-owner',{
    method:'POST',token:SYS
  });
  assert.equal(rotated.status,200);
  const report=await api(base,root,{token:rotated.data.ownerCredential.token});
  assert.equal(report.status,200);
  assert.equal(report.data.items.length,0);
  assert.equal(report.data.summary.count.draft,0);
});
