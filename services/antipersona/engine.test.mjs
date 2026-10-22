import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../dead-drop/server.mjs';
import {openChallenge,assessDefense,validateBrief,VERSION,PERSONAS} from '../../apps/antipersona/engine.mjs';

const sample={
  brand:'Aurora Studio',audience:'Independent agencies with small budgets',
  idea:'A transparent product demonstration showing how designers can compare two workflows and request a pilot before purchasing.',
  persona:'skeptic',pressure:'focused'
};
test('four real editor personas each raise three distinct structured questions',()=>{
  for(const persona of PERSONAS){
    const result=openChallenge({...sample,persona});
    assert.equal(result.version,VERSION);
    assert.equal(result.brief.persona,persona);
    assert.equal(result.challenges.length,3);
    assert.equal(new Set(result.challenges.map(x=>x.id)).size,3);
    assert.equal(result.disclosures.modelUsed,false);
    assert.equal(result.disclosures.verifiedClaims,false);
    assert.equal(result.disclosures.predictsPerformance,false);
  }
});
test('strict validation rejects empty ideas, unknown adversaries and invalid challenge levels',()=>{
  assert.throws(()=>openChallenge({...sample,idea:'short'}),/Idea/);
  assert.throws(()=>openChallenge({...sample,persona:'real person'}),/adversary/);
  assert.throws(()=>openChallenge({...sample,pressure:'unbounded'}),/intensity/);
  assert.throws(()=>validateBrief(null),/Brief object/);
});
test('response critique counts argument structure, not evidence verification',()=>{
  const debate=openChallenge(sample);
  const weak=assessDefense({challenge:'claim',reply:'We will improve it.',debate});
  const stronger=assessDefense({challenge:'claim',reply:'We will run a 40-person comparative test and publish an audit report showing the actual workflow time.',debate});
  assert.ok(stronger.readiness>weak.readiness);
  assert.equal(stronger.maximum,3);
  assert.equal(stronger.evidenceIndependentlyVerified,false);
  assert.equal(stronger.commercialOutcomePredicted,false);
  assert.throws(()=>assessDefense({challenge:'unknown',reply:'A valid testing response',debate}),/Unknown/);
});
test('guarantees, superlatives and pressure tactics are flagged but never treated as truth',()=>{
  const debate=openChallenge({...sample,idea:'We are the best #1 guaranteed 100% success only today — sign up now!'});
  assert.deepEqual(debate.riskFlags.sort(),['guarantee','superlative','urgency'].sort());
});
test('Node serves strictly CSP-isolated AntiPersona app and does not expose unknown files',async t=>{
  const app=createApp({dbPath:':memory:'});
  await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));
  t.after(async()=>{await new Promise(resolve=>app.server.close(resolve));app.db.close();});
  const base='http://127.0.0.1:'+app.server.address().port;
  for(const path of ['/apps/antipersona/','/apps/antipersona/app.js','/apps/antipersona/engine.mjs','/apps/shared/studio.css']){
    const res=await fetch(base+path);
    assert.equal(res.status,200,path);
    assert.match(res.headers.get('content-security-policy'),/script-src 'self'/);
  }
  assert.equal((await fetch(base+'/apps/antipersona/admin.json')).status,404);
});
