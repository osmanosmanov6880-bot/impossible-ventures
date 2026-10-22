import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../dead-drop/server.mjs';
import { SESSION_TTL_MS, AGGREGATE_TTL_DAYS } from './republic.mjs';

const operatorToken='republic-test-only-secret-with-at-least-32-characters';

async function setup(t, clock=Date.now) {
  const old=process.env.OPERATOR_TOKEN;
  process.env.OPERATOR_TOKEN=operatorToken;
  const app=createApp({dbPath:':memory:',now:clock});
  process.env.OPERATOR_TOKEN=old;
  t.after(async()=>{
    await new Promise(resolve=>app.server.close(resolve));
    app.db.close();
  });
  await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));
  return {app,base:'http://127.0.0.1:'+app.server.address().port};
}
async function req(base,path,method='GET',body,token) {
  const headers={Accept:'application/json'};
  if(body!==undefined)headers['Content-Type']='application/json';
  if(token)headers.Authorization='Bearer '+token;
  const response=await fetch(base+path,{
    method,headers,body:body===undefined?undefined:JSON.stringify(body)
  });
  return {status:response.status,data:await response.json()};
}
const draft={
  title:'Which ad respects attention?',
  question:'Would you prefer ads only on request, or ads you can instantly dismiss?',
  choiceA:'Only on request',choiceB:'Always dismissible',locale:'en'
};
async function createAndActivate(base) {
  const inserted=await req(base,'/api/v1/operator/republic/challenges','POST',draft,operatorToken);
  assert.equal(inserted.status,201);
  const id=inserted.data.challenge.id;
  const activated=await req(base,'/api/v1/operator/republic/challenges/'+id+'/status','POST',{status:'active'},operatorToken);
  assert.equal(activated.status,200);
  return id;
}

test('moderated questions start as private drafts; public catalog never fabricates results',async t=>{
  const {base}=await setup(t);
  const publicFirst=await req(base,'/api/v1/republic/challenges');
  assert.equal(publicFirst.status,200);
  assert.deepEqual(publicFirst.data.items,[]);
  assert.match(publicFirst.data.note,/not invented/);
  assert.equal((await req(base,'/api/v1/operator/republic/challenges')).status,401);
  assert.equal((await req(base,'/api/v1/operator/republic/challenges','POST',draft,'invalid-secret')).status,403);
  const draftResult=await req(base,'/api/v1/operator/republic/challenges','POST',draft,operatorToken);
  assert.equal(draftResult.status,201);
  assert.equal(draftResult.data.challenge.status,'draft');
  const id=draftResult.data.challenge.id;
  assert.match(id,/^[a-f0-9]{24}$/);
  assert.deepEqual((await req(base,'/api/v1/republic/challenges')).data.items,[]);
  assert.equal((await req(base,'/api/v1/republic/challenges/'+id)).status,404);
  const published=await req(base,'/api/v1/operator/republic/challenges/'+id+'/status','POST',{status:'active'},operatorToken);
  assert.equal(published.status,200);
  const catalog=await req(base,'/api/v1/republic/challenges');
  assert.equal(catalog.data.items.length,1);
  assert.equal(catalog.data.items[0].counts.total,0);
  assert.equal(catalog.data.items[0].counts.a,0);
  assert.equal(catalog.data.items[0].counts.b,0);
  assert.match(catalog.data.items[0].disclaimer,/not a verified distinct human/);
});
test('measured voting needs consent, bearer token and counts at most one ballot per session',async t=>{
  const {base,app}=await setup(t);
  const id=await createAndActivate(base);
  const path='/api/v1/republic/challenges/'+id;
  assert.equal((await req(base,path+'/sessions','POST',{consent:false})).status,422);
  const one=await req(base,path+'/sessions','POST',{consent:true});
  assert.equal(one.status,201);
  assert.match(one.data.sessionId,/^[a-f0-9]{32}$/);
  assert.ok(one.data.token.length>32);
  assert.equal(one.data.expiresAt>0,true);
  assert.equal((await req(base,path+'/votes','POST',{sessionId:one.data.sessionId,choice:'a'})).status,401);
  assert.equal((await req(base,path+'/votes','POST',{sessionId:one.data.sessionId,choice:'x'},one.data.token)).status,400);
  assert.equal((await req(base,path+'/votes','POST',{sessionId:one.data.sessionId,choice:'a'},'wrong-token')).status,403);
  const stored=app.db.prepare('SELECT * FROM republic_sessions WHERE id=?').get(one.data.sessionId);
  assert.equal(stored.token_hash.includes(one.data.token),false);
  const voteA=await req(base,path+'/votes','POST',{sessionId:one.data.sessionId,choice:'a'},one.data.token);
  assert.equal(voteA.status,201);
  assert.deepEqual({a:voteA.data.counts.a,b:voteA.data.counts.b,total:voteA.data.counts.total},{a:1,b:0,total:1});
  const repeat=await req(base,path+'/votes','POST',{sessionId:one.data.sessionId,choice:'b'},one.data.token);
  assert.equal(repeat.status,409);
  const two=await req(base,path+'/sessions','POST',{consent:true});
  const voteB=await req(base,path+'/votes','POST',{sessionId:two.data.sessionId,choice:'b'},two.data.token);
  assert.equal(voteB.status,201);
  assert.deepEqual({a:voteB.data.counts.a,b:voteB.data.counts.b,total:voteB.data.counts.total},{a:1,b:1,total:2});
  const latest=(await req(base,path)).data.challenge;
  assert.equal(latest.counts.total,2);
  assert.equal(app.db.prepare('SELECT COUNT(*) AS n FROM republic_daily').get().n,1);
});
test('operator can pause, resume and irreversibly close public challenge',async t=>{
  const {base}=await setup(t);
  const id=await createAndActivate(base);
  const path='/api/v1/republic/challenges/'+id;
  assert.equal((await req(base,path+'/sessions','POST',{consent:true})).status,201);
  assert.equal((await req(base,'/api/v1/operator/republic/challenges/'+id+'/status','POST',{status:'paused'},operatorToken)).status,200);
  assert.equal((await req(base,path+'/sessions','POST',{consent:true})).status,409);
  assert.equal((await req(base,'/api/v1/operator/republic/challenges/'+id+'/status','POST',{status:'active'},operatorToken)).status,200);
  assert.equal((await req(base,'/api/v1/operator/republic/challenges/'+id+'/status','POST',{status:'closed'},operatorToken)).status,200);
  assert.equal((await req(base,path)).status,404);
  assert.equal((await req(base,'/api/v1/operator/republic/challenges/'+id+'/status','POST',{status:'active'},operatorToken)).status,409);
  assert.deepEqual((await req(base,'/api/v1/republic/challenges')).data.items,[]);
});
test('input validation prevents identical options, unsupported locale and unauthorized publication',async t=>{
  const {base}=await setup(t);
  const p='/api/v1/operator/republic/challenges';
  assert.equal((await req(base,p,'POST',{...draft,choiceB:draft.choiceA},operatorToken)).status,400);
  assert.equal((await req(base,p,'POST',{...draft,locale:'unverified'},operatorToken)).status,400);
  assert.equal((await req(base,p,'POST',{...draft,title:'x'.repeat(121)},operatorToken)).status,400);
  assert.equal((await req(base,p,'POST',draft)).status,401);
  assert.equal((await req(base,p,'POST',draft,'wrong-secret')).status,403);
  assert.equal((await req(base,'/api/v1/republic/challenges/../../operator')).status,404);
});
test('session cleanup expires tokens and challenge TTL without fabricating replacement counts',async t=>{
  let time=1_800_000_000_000;
  const {base,app}=await setup(t,()=>time);
  const id=await createAndActivate(base);
  const path='/api/v1/republic/challenges/'+id;
  const session=(await req(base,path+'/sessions','POST',{consent:true})).data;
  time+=SESSION_TTL_MS+2;
  const expired=await req(base,path+'/votes','POST',{sessionId:session.sessionId,choice:'b'},session.token);
  assert.equal(expired.status,410);
  const id2=(await req(base,'/api/v1/operator/republic/challenges','POST',draft,operatorToken)).data.challenge.id;
  time+=AGGREGATE_TTL_DAYS*86_400_000;
  const listing=await req(base,'/api/v1/republic/challenges');
  assert.equal(listing.status,200);
  assert.deepEqual(listing.data.items,[]);
  const stored=app.db.prepare('SELECT status FROM republic_challenges WHERE id=?').get(id);
  assert.equal(stored.status,'closed');
  assert.equal(app.db.prepare('SELECT COUNT(*) AS n FROM republic_sessions').get().n,0);
  assert.equal(app.db.prepare('SELECT status FROM republic_challenges WHERE id=?').get(id2).status,'closed');
});
test('Republic is exposed through same-origin strict CSP; arbitrary private paths stay unavailable',async t=>{
  const {base}=await setup(t);
  for(const path of [
    '/apps/attention-republic/','/apps/attention-republic/app.js','/apps/attention-republic/operator/',
    '/apps/attention-republic/operator.js'
  ]){
    const response=await fetch(base+path);
    assert.equal(response.status,200,path);
    assert.match(response.headers.get('content-security-policy'),/script-src 'self'/);
  }
  assert.equal((await fetch(base+'/apps/attention-republic/private.sqlite')).status,404);
});
