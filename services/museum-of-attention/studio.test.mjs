import test from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from '../dead-drop/server.mjs';
import {listExhibits,createPlacard,ERAS,VERSION} from '../../apps/museum-of-attention-studio/engine.mjs';

test('exactly four invented future museum exhibits and three eras, no false historical provenance',()=>{
  const all=listExhibits({era:'all',language:'ru'});
  assert.equal(all.length,4);
  assert.equal(new Set(all.map(e=>e.id)).size,4);
  assert.equal(ERAS.length,4);
  for(const item of all){
    assert.equal(item.fictional,true);
    assert.match(item.source,/fiction/);
    assert.ok(item.story.length>20);
    assert.ok(item.question.length>10);
  }
  assert.equal(listExhibits({era:'2030s'}).length,1);
  assert.equal(listExhibits({era:'2040s'}).length,2);
  assert.equal(listExhibits({era:'2050s'}).length,1);
});
test('three languages present human-readable fiction without changing exhibit identity',()=>{
  const russian=listExhibits({language:'ru'});
  for(const language of ['en','zh']){
    const other=listExhibits({language});
    assert.deepEqual(other.map(e=>e.id),russian.map(e=>e.id));
    assert.ok(other.every(e=>e.title!==russian.find(r=>r.id===e.id).title));
  }
  assert.throws(()=>listExhibits({era:'1900s'}),/Invalid era/);
});
test('visitor-authored placards are fictional local assets and validate years',()=>{
  const item=createPlacard({
    year:2049,title:'Quiet Signal Capsule',medium:'interactive',
    interpretation:'A future imagined museum describes voluntary attention as a personal right.'
  });
  assert.equal(item.kind,'museum-attention-guest-placard');
  assert.equal(item.version,VERSION);
  assert.equal(item.fictional,true);
  assert.equal(item.humanAuthored,true);
  assert.equal(item.published,false);
  assert.equal(item.noVerificationClaim,true);
  assert.throws(()=>createPlacard({year:2029,title:item.title,medium:'interactive',interpretation:item.interpretation}),/2030 and 2099/);
  assert.throws(()=>createPlacard({year:2049,title:item.title,medium:'unverified',interpretation:item.interpretation}),/medium/);
});
test('public museum serves only known CSP-restricted files',async t=>{
  const app=createApp({dbPath:':memory:'});
  await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));
  t.after(async()=>{await new Promise(resolve=>app.server.close(resolve));app.db.close();});
  const base='http://127.0.0.1:'+app.server.address().port;
  for(const path of ['/apps/museum-of-attention-studio/','/apps/museum-of-attention-studio/engine.mjs','/apps/museum-of-attention-studio/app.js']){
    const response=await fetch(base+path);
    assert.equal(response.status,200);
    assert.match(response.headers.get('content-security-policy'),/script-src 'self'/);
  }
  assert.equal((await fetch(base+'/apps/museum-of-attention-studio/private.json')).status,404);
});
