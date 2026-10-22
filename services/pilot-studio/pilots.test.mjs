import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from '../dead-drop/server.mjs';

const company = {
  company: 'Northern Growth Lab',
  contact: 'Alex Morgan',
  email: 'ALEx@Example.COM',
  website: 'https://example.com/',
  goal: 'validation',
  budget: '1k-5k',
  locale: 'ru',
  consent: true,
  website_confirm: ''
};
async function openFixture(t,dbPath=':memory:'){
  const app=createApp({dbPath});
  await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));
  t.after(async()=>{
    await new Promise(resolve=>app.server.close(resolve));
    app.db.close();
  });
  return 'http://127.0.0.1:'+app.server.address().port;
}
async function call(base,path,{method='GET',body,token}={}){
  const headers={};if(body!==undefined)headers['Content-Type']='application/json';
  if(token)headers.Authorization='Bearer '+token;
  const response=await fetch(base+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
  const type=response.headers.get('content-type')||'';
  return {status:response.status,contentType:type,data:type.includes('application/json')?await response.json():await response.text()};
}

test('pilot studio serves public pages and strict browser CSP',async t=>{
  const base=await openFixture(t);
  const response=await fetch(base+'/pilot/');
  const html=await response.text();
  assert.equal(response.status,200);
  assert.match(html,/id="planForm"/);
  assert.match(html,/id="leadForm"/);
  assert.match(response.headers.get('content-security-policy'),/script-src 'self'/);
  assert.equal((await call(base,'/pilot/app.js')).status,200);
  assert.equal((await call(base,'/pilot/style.css')).status,200);
});

test('explicit consent and validation are enforced; honeypot is discarded',async t=>{
  const base=await openFixture(t);
  assert.equal((await call(base,'/api/v1/pilots',{method:'POST',body:{...company,consent:false}})).status,422);
  assert.equal((await call(base,'/api/v1/pilots',{method:'POST',body:{...company,email:'bad'}})).status,400);
  assert.equal((await call(base,'/api/v1/pilots',{method:'POST',body:{...company,website:'http://example.com'}})).status,400);
  const trap=await call(base,'/api/v1/pilots',{method:'POST',body:{...company,website_confirm:'filled by bot'}});
  assert.equal(trap.status,202);
  assert.equal(trap.data.requestId,undefined);
  const lead=await call(base,'/api/v1/pilots',{method:'POST',body:company});
  assert.equal(lead.status,201);
  assert.match(lead.data.requestId,/^[a-f0-9]{24}$/);
  assert.ok(lead.data.deleteToken.length>32);
  assert.equal(lead.data.retentionDays,90);
});

test('operator cannot list without configured token; self-deletion works',async t=>{
  const previous=process.env.OPERATOR_TOKEN; delete process.env.OPERATOR_TOKEN;
  t.after(()=>{if(previous===undefined)delete process.env.OPERATOR_TOKEN;else process.env.OPERATOR_TOKEN=previous});
  const base=await openFixture(t);
  const lead=await call(base,'/api/v1/pilots',{method:'POST',body:company});
  const id=lead.data.requestId;
  assert.equal((await call(base,'/api/v1/operator/pilots')).status,503);
  assert.equal((await call(base,'/api/v1/pilots/'+id,{method:'DELETE',token:'invalid'})).status,403);
  assert.equal((await call(base,'/api/v1/pilots/'+id,{method:'DELETE',token:lead.data.deleteToken})).status,200);
  assert.equal((await call(base,'/api/v1/pilots/'+id,{method:'DELETE',token:lead.data.deleteToken})).status,404);
});

test('operator listing is authenticated, limited to 100, and never exposes deletion tokens',async t=>{
  const previous=process.env.OPERATOR_TOKEN;
  const token='operator-test-token-with-at-least-32-random-bytes';
  process.env.OPERATOR_TOKEN=token;
  t.after(()=>{if(previous===undefined)delete process.env.OPERATOR_TOKEN;else process.env.OPERATOR_TOKEN=previous});
  const base=await openFixture(t);
  const lead=await call(base,'/api/v1/pilots',{method:'POST',body:company});
  const id=lead.data.requestId;
  assert.equal((await call(base,'/api/v1/operator/pilots')).status,401);
  assert.equal((await call(base,'/api/v1/operator/pilots',{token:'wrong'})).status,403);
  let listing=await call(base,'/api/v1/operator/pilots',{token});
  assert.equal(listing.status,200);
  assert.equal(listing.data.summary.total,1);
  assert.equal(listing.data.items[0].email,'alex@example.com');
  assert.equal(listing.data.items[0].status,'new');
  assert.equal(JSON.stringify(listing.data).includes(lead.data.deleteToken),false);
  assert.equal((await call(base,'/api/v1/operator/pilots/'+id+'/status',{method:'POST',token,body:{status:'paid'}})).status,400);
  assert.equal((await call(base,'/api/v1/operator/pilots/'+id+'/status',{method:'POST',token,body:{status:'qualified'}})).status,200);
  listing=await call(base,'/api/v1/operator/pilots',{token});
  assert.equal(listing.data.summary.qualified,1);
  assert.equal(listing.data.summary.new,0);
  assert.match(listing.data.note,/not payment or revenue verification/);
});

test('pilot requests persist in SQLite and can be deleted after reopening',async t=>{
  const directory=mkdtempSync(join(tmpdir(),'pilot-studio-'));
  t.after(()=>rmSync(directory,{recursive:true,force:true}));
  const dbPath=join(directory,'leads.sqlite');
  const first=await openFixture(t,dbPath);
  const saved=await call(first,'/api/v1/pilots',{method:'POST',body:company});
  assert.equal(saved.status,201);
  const second=await openFixture(t,dbPath);
  assert.equal((await call(second,'/api/v1/pilots/'+saved.data.requestId,{method:'DELETE',token:saved.data.deleteToken})).status,200);
  assert.equal((await call(first,'/api/v1/pilots/'+saved.data.requestId,{method:'DELETE',token:saved.data.deleteToken})).status,404);
});

test('pilot submission rate limit prevents bursts',async t=>{
  const base=await openFixture(t);
  for(let i=0;i<5;i++){
    const x=await call(base,'/api/v1/pilots',{method:'POST',body:{...company,company:'Campaign '+i}});
    assert.equal(x.status,201);
  }
  assert.equal((await call(base,'/api/v1/pilots',{method:'POST',body:company})).status,429);
});


test('operator endpoint limits repeated unauthorized requests from one address', async t => {
  const previous = process.env.OPERATOR_TOKEN;
  process.env.OPERATOR_TOKEN = 'test-operator-token-at-least-thirty-two-characters-long';
  t.after(() => {
    if (previous === undefined) delete process.env.OPERATOR_TOKEN;
    else process.env.OPERATOR_TOKEN = previous;
  });
  const base = await openFixture(t);
  for (let i = 0; i < 30; i++) {
    const attempt = await call(base, '/api/v1/operator/pilots', { token: 'wrong-key' });
    assert.equal(attempt.status, 403, 'One of thirty bad requests must not bypass auth');
  }
  const limited = await call(base, '/api/v1/operator/pilots', { token: 'wrong-key' });
  assert.equal(limited.status, 429);
  const stillLimited = await call(base, '/api/v1/operator/pilots', {
    token: process.env.OPERATOR_TOKEN
  });
  assert.equal(stillLimited.status, 429, 'Staging IP throttle protects before authentication');
});
