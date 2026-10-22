import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EVALUATOR_VERSION, MAX_IMPORT_BYTES, CRITERIA,
  evaluateCase, validateCase, extractDeadDropDossier, csvSafe
} from '../../apps/appeal-2049-studio/tribunal-engine.mjs';
import { createApp } from '../dead-drop/server.mjs';

const sample = {
  product:'Aurora creative studio',
  idea:'Invite independent designers to compare two clearly documented team planning workflows and request a free onboarding session.',
  audience:'Independent designers and small creative agencies who need simple project visibility',
  evidence:'Internal test report covering 40 workflow trials; link to evidence pending independent review',
  goal:'leads'
};
test('clear honest campaign reports bounded writing signals and NEVER claims fact verification', () => {
  const report = evaluateCase(sample);
  assert.equal(report.version,EVALUATOR_VERSION);
  assert.equal(report.maximum,20);
  assert.ok(report.total >= 0 && report.total <= 20);
  assert.equal(report.humanVerificationRequired,true);
  assert.equal(report.evidenceVerified,false);
  assert.match(report.reliabilityNote,/not verified truth/);
  for(const key of CRITERIA){
    assert.ok(Number.isInteger(report.signals[key]));
    assert.ok(report.signals[key] >= 0 && report.signals[key] <= 4);
  }
  assert.equal(Object.keys(report.signals).length,5);
});
test('empty proof lowers editorial signals but cannot be treated as automatic fact-check', () => {
  const supported = evaluateCase(sample);
  const noEvidence = evaluateCase({ ...sample,evidence:'' });
  assert.ok(supported.signals.proof > noEvidence.signals.proof);
  assert.equal(noEvidence.signals.proof,0);
  assert.equal(supported.evidenceVerified,false);
  assert.equal(noEvidence.evidenceVerified,false);
});
test('potentially risky guarantee, superlative and scarcity language requires human verification', () => {
  const report=evaluateCase({
    ...sample,
    idea:'Best #1 guaranteed 100% success only today; book now for instant results!'
  });
  assert.ok(report.riskFlags.includes('guarantee'));
  assert.ok(report.riskFlags.includes('superlative'));
  assert.ok(report.riskFlags.includes('unsupportedUrgency'));
  assert.equal(report.humanVerificationRequired,true);
});
test('validation rejects malformed inputs, excessive text and unknown goals', () => {
  assert.throws(()=>evaluateCase({ ...sample,idea:'' }),/Campaign idea/);
  assert.throws(()=>evaluateCase({ ...sample,product:'a' }),/Product/);
  assert.throws(()=>evaluateCase({ ...sample,idea:'x'.repeat(1601) }),/Campaign idea/);
  assert.throws(()=>evaluateCase({ ...sample,goal:'financial returns' }),/goal/);
  assert.throws(()=>validateCase([]),/campaign object/);
  assert.ok(MAX_IMPORT_BYTES <= 256*1024);
});
test('final Dead Drop role-scoped dossier import cannot expose bearer tokens or private prefinalized fields', () => {
  const dossier={
    brand:sample.product,
    audience:sample.audience,
    openingHook:'Discover the real workflow tension',
    concept:sample.idea,
    evidenceToVerify:sample.evidence,
    callToAction:'Request a briefing',
    interceptedSignals:{ productAgent:'PRIVATE SIGNAL',audienceAgent:'PRIVATE AUDIENCE SIGNAL' },
    hostTokenHash:'SHA-SECRET',
    guestTokenHash:'OTHER-SHA'
  };
  const source={
    kind:'dead-drop-agent-export',
    mission:{
      code:'ABCDEFGH',role:'product',status:'finalized',dossier,
      ownIntel:{product:'VERY PRIVATE PRODUCT',proof:'PRIVATE PROOF'},
      token:'verysecret'
    }
  };
  const imported=extractDeadDropDossier(source);
  const text=JSON.stringify(imported);
  assert.equal(imported.goal,'leads');
  assert.equal(imported.product,sample.product);
  assert.ok(!text.includes('verysecret'));
  assert.ok(!text.includes('PRIVATE SIGNAL'));
  assert.ok(!text.includes('VERY PRIVATE PRODUCT'));
  assert.ok(!text.includes('SHA-SECRET'));
  assert.ok(!text.includes('ABCDEFGH'));
  assert.throws(()=>extractDeadDropDossier({
    kind:'dead-drop-agent-export',mission:{status:'active',dossier}
  }),/must be finalized/);
  assert.throws(()=>extractDeadDropDossier({ mission:{status:'finalized'} }),/compatible/);
});
test('future CSV export helper neutralizes formulas', () => {
  assert.equal(csvSafe('=1+1'),"''".slice(0,1)+'=1+1');
  assert.equal(csvSafe('+cmd'),"'+cmd");
  assert.equal(csvSafe('@sum'),"'@sum");
  assert.equal(csvSafe('ordinary'), 'ordinary');
});
test('Node serves Appeal modular assets with browser-safe CSP, no directory traversal', async t => {
  const app=createApp({dbPath:':memory:'});
  await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));
  t.after(async()=>{await new Promise(resolve=>app.server.close(resolve));app.db.close();});
  const base='http://127.0.0.1:'+app.server.address().port;
  for(const [path,mime] of [
    ['/apps/appeal-2049-studio/','text/html'],
    ['/apps/appeal-2049-studio/app.js','javascript'],
    ['/apps/appeal-2049-studio/style.css','text/css'],
    ['/apps/appeal-2049-studio/tribunal-engine.mjs','javascript']
  ]){
    const res=await fetch(base+path);
    assert.equal(res.status,200,path);
    assert.match(res.headers.get('content-type'),new RegExp(mime));
    assert.match(res.headers.get('content-security-policy'),/script-src 'self'/);
  }
  assert.equal((await fetch(base+'/apps/appeal-2049-studio/secrets.sqlite')).status,404);
});
