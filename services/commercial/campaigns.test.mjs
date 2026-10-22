import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../dead-drop/server.mjs';

const SYS = 'system-master-credential-for-testing-2026-10-22';
const starter = {
  title: 'Mission Launch', venture: 'dead-drop', goal: 'leads', channel: 'landing',
  audience: 'Independent founders validating their marketing',
  offer: 'Complimentary creative strategy session',
  headline: 'Your first secret mission is waiting',
  body: 'Discover which decision can transform the launch of your next honest campaign.',
  ctaLabel: 'View the creative pilot'
};
async function fixture(t) {
  const old = process.env.OPERATOR_TOKEN;
  process.env.OPERATOR_TOKEN = SYS;
  t.after(() => old === undefined ? delete process.env.OPERATOR_TOKEN : process.env.OPERATOR_TOKEN = old);
  const app = createApp({ dbPath: ':memory:' });
  await new Promise(resolve => app.server.listen(0, '127.0.0.1', resolve));
  t.after(async () => { await new Promise(resolve => app.server.close(resolve)); app.db.close(); });
  return 'http://127.0.0.1:' + app.server.address().port;
}
async function req(base,path,{method='GET',token,body}={}) {
  const headers={};
  if(token)headers.Authorization='Bearer '+token;
  if(body!==undefined)headers['Content-Type']='application/json';
  const r=await fetch(base+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
  return {status:r.status,data:await r.json()};
}
async function owner(base,name) {
  const r=await req(base,'/api/v1/operator/workspaces',{method:'POST',token:SYS,body:{name}});
  assert.equal(r.status,201);
  return {id:r.data.workspace.id,token:r.data.ownerCredential.token};
}

test('WAVE 3: seven distinct world templates are public examples, not claimed launched ventures',async t=>{
  const base=await fixture(t);
  const r=await req(base,'/api/v1/commercial/ventures');
  assert.equal(r.status,200);
  assert.equal(r.data.items.length,7);
  assert.equal(new Set(r.data.items.map(x=>x.id)).size,7);
  assert.ok(r.data.items.every(x=>x.exampleHeadline && x.exampleBody && x.concept));
  assert.match(r.data.disclaimer,/not seven separately deployed/);
});

test('WAVE 3: campaigns are isolated by organization, readers cannot write, public only after owner approval',async t=>{
  const base=await fixture(t);
  const alice=await owner(base,'Alice Growth Team');
  const bob=await owner(base,'Bob Creative Group');
  const path='/api/v1/workspaces/'+alice.id+'/campaigns';
  const created=await req(base,path,{method:'POST',token:alice.token,body:starter});
  assert.equal(created.status,201);
  const campaign=created.data.campaign;
  assert.equal(campaign.status,'draft');
  assert.equal(campaign.revision,1);
  assert.equal((await req(base,path,{token:bob.token})).status,403);
  assert.equal((await req(base,path,{method:'POST',token:bob.token,body:starter})).status,403);
  assert.equal((await req(base,'/api/v1/showcase/'+campaign.id)).status,404);
  const view=await req(base,path,{token:alice.token});
  assert.equal(view.status,200);
  assert.equal(view.data.counts.draft,1);
  assert.equal(view.data.items.length,1);
  const createdViewer=await req(base,'/api/v1/workspaces/'+alice.id+'/tokens',{
    method:'POST',token:alice.token,body:{label:'Observer',role:'viewer'}
  });
  assert.equal(createdViewer.status,201);
  assert.equal((await req(base,path,{token:createdViewer.data.token})).status,200);
  assert.equal((await req(base,path,{method:'POST',token:createdViewer.data.token,body:starter})).status,403);
  assert.equal((await req(base,path+'/'+campaign.id+'/approve',{method:'POST',token:createdViewer.data.token})).status,403);
  const approved=await req(base,path+'/'+campaign.id+'/approve',{method:'POST',token:alice.token});
  assert.equal(approved.status,200);
  assert.equal(approved.data.campaign.status,'approved');
  assert.equal(approved.data.publicPreview,'/showcase/?id='+campaign.id);
  const publicView=await req(base,'/api/v1/showcase/'+campaign.id);
  assert.equal(publicView.status,200);
  assert.equal(publicView.data.creative.headline,starter.headline);
  assert.equal(Object.hasOwn(publicView.data.creative,'workspaceId'),false);
  assert.equal(Object.hasOwn(publicView.data.creative,'audience'),false);
  assert.equal(Object.hasOwn(publicView.data.creative,'revision'),false);
  assert.equal((await req(base,path+'/'+campaign.id,{method:'PATCH',token:alice.token,body:{expectedRevision:2,headline:'Update'}})).status,409);
  assert.equal((await req(base,path+'/'+campaign.id+'/archive',{method:'POST',token:alice.token})).status,200);
  assert.equal((await req(base,'/api/v1/showcase/'+campaign.id)).status,404);
});

test('WAVE 3: draft editing uses optimistic revision; malformed inputs and invalid venture are refused',async t=>{
  const base=await fixture(t);
  const ws=await owner(base,'Global Brand Studio');
  const path='/api/v1/workspaces/'+ws.id+'/campaigns';
  assert.equal((await req(base,path,{method:'POST',token:ws.token,body:{...starter,venture:'invented-venture'}})).status,400);
  assert.equal((await req(base,path,{method:'POST',token:ws.token,body:{...starter,body:'tiny'}})).status,400);
  const created=await req(base,path,{method:'POST',token:ws.token,body:starter});
  const id=created.data.campaign.id;
  const updated=await req(base,path+'/'+id,{
    method:'PATCH',token:ws.token,body:{expectedRevision:1,headline:'A revised headline supported by actual evidence'}
  });
  assert.equal(updated.status,200);
  assert.equal(updated.data.campaign.revision,2);
  assert.match(updated.data.campaign.headline,/revised/);
  assert.equal((await req(base,path+'/'+id,{
    method:'PATCH',token:ws.token,body:{expectedRevision:1,headline:'Stale edit'}
  })).status,409);
  const history=await req(base,'/api/v1/workspaces/'+ws.id+'/audit',{token:ws.token});
  assert.ok(history.data.items.some(a=>a.action==='campaign.created'));
  assert.ok(history.data.items.some(a=>a.action==='campaign.updated'));
  assert.equal((await req(base,path+'/'+id+'/approve',{method:'POST',token:ws.token})).status,200);
  assert.ok((await req(base,'/api/v1/showcase/'+id)).data.creative.disclaimer);
});

test('WAVE 3: editor can create but cannot approve; archived campaign is permanently unpublished',async t=>{
  const base=await fixture(t);
  const ws=await owner(base,'Marketing Editorial');
  const path='/api/v1/workspaces/'+ws.id;
  const editor=await req(base,path+'/tokens',{method:'POST',token:ws.token,body:{label:'Creative editor',role:'editor',ttlDays:2}});
  assert.equal(editor.status,201);
  const created=await req(base,path+'/campaigns',{method:'POST',token:editor.data.token,body:starter});
  assert.equal(created.status,201);
  const id=created.data.campaign.id;
  assert.equal((await req(base,path+'/campaigns/'+id+'/approve',{method:'POST',token:editor.data.token})).status,403);
  assert.equal((await req(base,path+'/campaigns/'+id+'/archive',{method:'POST',token:ws.token})).status,200);
  assert.equal((await req(base,path+'/campaigns/'+id+'/approve',{method:'POST',token:ws.token})).status,409);
  assert.equal((await req(base,'/api/v1/showcase/'+id)).status,404);
});
