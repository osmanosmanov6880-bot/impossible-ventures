import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../dead-drop/server.mjs';
import { WORLD_IDS, WORLDS } from '../../apps/creative-worlds/worlds.mjs';
import { toCampaignDraft } from '../../apps/creative-worlds/bridge.mjs';
import {
  EDITION, LANGUAGES, createRun, nextStage, choose, rewind,
  progress, heuristicScores, report, worldIntro, auditWorldDefinitions, CreativeInputError
} from '../../apps/creative-worlds/engine.mjs';

const sample = {
  brand: 'Open Creative Studio',
  product: 'Workshops for transparent advertising development',
  audience: 'Small marketing teams who want evidence-led ideas'
};

function finish(worldId, locale = 'ru', option = 0) {
  let run = createRun(worldId, sample, locale);
  while (!progress(run).finished) {
    const stage = nextStage(run);
    const note = stage.requiredNote ? 'An authored line with meaningful detail' : 'Audience research hypothesis';
    run = choose(run, stage.choices[option].id, note);
  }
  return run;
}

test('WAVE 6–10: every creative world has real separate mechanics, four or five chapters and full three-language authoring', () => {
  const structure = auditWorldDefinitions();
  assert.deepEqual(structure, { worlds: 5, languages: 3, chapters: 21 });
  assert.deepEqual(WORLD_IDS, [
    'anti-persona','brief-theatre','ad-biome','museum-of-attention','attention-republic'
  ]);
  const modes = WORLD_IDS.map(id => WORLDS[id].mode);
  assert.equal(new Set(modes).size, 5);
  assert.equal(WORLDS['brief-theatre'].turns.every(t => t.requiredNote), true);
  assert.equal(WORLDS['attention-republic'].turns.length, 5);
  for (const id of WORLD_IDS) {
    for (const locale of LANGUAGES) {
      const intro = worldIntro(id, locale);
      assert.equal(intro.id, id);
      assert.ok(intro.title.length > 5);
      assert.ok(intro.introduction.length > 20);
      assert.ok(intro.objective.length > 5);
      const run = createRun(id, sample, locale);
      const first = nextStage(run);
      assert.ok(first);
      assert.equal(first.index, 0);
      assert.equal(first.choices.length, 3);
      assert.equal(new Set(first.choices.map(x => x.id)).size, 3);
      assert.ok(heuristicScores(run).every(x => x.value >= 0 && x.value <= 100));
      assert.throws(() => report(run), CreativeInputError);
      const finished = finish(id, locale);
      assert.equal(progress(finished).finished, true);
      assert.equal(progress(finished).completed, intro.chapters);
      assert.equal(nextStage(finished), null);
      const artifact = report(finished);
      assert.equal(artifact.schema, 'iv-creative-deliverable-v1');
      assert.equal(artifact.version, EDITION);
      assert.equal(artifact.world.id, id);
      assert.equal(artifact.language, locale);
      assert.equal(artifact.decisions.length, intro.chapters);
      assert.equal(artifact.metricType, 'illustrative-design-heuristic-not-conversion-or-customer-data');
      assert.equal(artifact.provenance.mode, 'browser-only');
      assert.equal(artifact.provenance.tracking, 'none');
      assert.equal(artifact.provenance.externalAI, false);
      assert.equal(artifact.provenance.purchases, false);
      assert.equal(artifact.provenance.realParticipants, false);
      assert.equal(artifact.evidenceChecklist.length, 3);
      assert.ok(artifact.decisions.every(c => c.selectedChoice && c.decision && c.contribution));
      assert.ok(artifact.heuristics.every(x => Number.isInteger(x.value)));
      assert.equal(JSON.stringify(artifact).includes('actual conversion rate'), false);
    }
  }
});

test('WAVE 6: AntiPersona choices change both the counter-persona narrative and numerical heuristics', () => {
  const id = 'anti-persona';
  const a = finish(id, 'ru', 0);
  const b = finish(id, 'ru', 2);
  const reportA = report(a), reportB = report(b);
  assert.notDeepEqual(reportA.heuristics, reportB.heuristics);
  assert.notEqual(reportA.decisions[0].decision, reportB.decisions[0].decision);
  assert.notEqual(reportA.decisions[1].simulatedConsequence, reportB.decisions[1].simulatedConsequence);
  assert.equal(reportA.decisions[0].contribution, 'counterPersona');
  assert.equal(reportB.decisions[3].contribution, 'verification');
});

test('WAVE 7: Brief Theatre requires real authored script lines in each of four acts', () => {
  const original = createRun('brief-theatre', sample, 'en');
  const first = nextStage(original);
  assert.equal(first.requiredNote, true);
  assert.throws(() => choose(original, first.choices[0].id, ''), CreativeInputError);
  assert.throws(() => choose(original, first.choices[0].id, 'tiny'), CreativeInputError);
  const completed = finish('brief-theatre','en');
  const artifact = report(completed);
  assert.deepEqual(
    artifact.decisions.map(d => d.contribution),
    ['opening','obstacle','evidenceScene','ending']
  );
  assert.ok(artifact.decisions.every(d => d.authoredLine?.length >= 8));
});

test('WAVE 8: AdBiome evolves alternatives but cannot claim sales or empirical CTR', () => {
  const artifact = report(finish('ad-biome','ru',1));
  assert.deepEqual(
    artifact.decisions.map(x => x.contribution),
    ['hookMutation','valueMutation','proofMutation','testDesign']
  );
  assert.match(artifact.disclaimer, /не результаты кампании/);
  assert.match(artifact.ending, /эвристика/);
  assert.ok(!Object.hasOwn(artifact,'ctr'));
  assert.ok(!Object.hasOwn(artifact,'impressions'));
  assert.ok(!Object.hasOwn(artifact,'revenue'));
});

test('WAVE 9: Museum of Attention separates voluntary visitor engagement from tracked events', () => {
  const artifact = report(finish('museum-of-attention','zh',2));
  assert.equal(artifact.type, 'INTERACTIVE EXHIBITION');
  assert.deepEqual(artifact.decisions.map(x => x.contribution),
    ['exhibit','comparison','memory','exitRule']);
  assert.equal(artifact.provenance.tracking,'none');
  assert.equal(artifact.provenance.realParticipants,false);
});

test('WAVE 10: Attention Republic has five strategy decisions and diverging trust/inclusion/resource outcomes', () => {
  const safe = report(finish('attention-republic','en',0));
  const alternate = report(finish('attention-republic','en',1));
  assert.equal(safe.decisions.length, 5);
  assert.equal(alternate.decisions.length, 5);
  assert.notDeepEqual(safe.heuristics, alternate.heuristics);
  assert.equal(safe.provenance.realParticipants, false);
  assert.match(safe.ending, /modeled consequences/);
});

test('Undo is safe and immutable; replaying another branch produces a different report', () => {
  const run = createRun('brief-theatre', sample, 'ru');
  const initial = nextStage(run);
  const step1 = choose(run, initial.choices[0].id, 'Мой первый осмысленный кадр');
  const step2 = choose(step1, nextStage(step1).choices[0].id, 'Реальная реплика об ограничении');
  const rewound = rewind(step2);
  assert.equal(run.answers.length, 0);
  assert.equal(step1.answers.length, 1);
  assert.equal(step2.answers.length, 2);
  assert.equal(rewound.answers.length, 1);
  assert.equal(nextStage(rewound).id, nextStage(step1).id);
  const changed = choose(rewound, nextStage(rewound).choices[2].id, 'Мой другой творческий выбор');
  assert.notEqual(changed.answers[1].choiceId, step2.answers[1].choiceId);
  assert.equal(rewind(run).answers.length, 0);
});

test('Strict input rejects unknown worlds, wrong locales, forged decisions, excessive notes and incomplete briefs', () => {
  assert.throws(() => createRun('unknown',sample), CreativeInputError);
  assert.throws(() => createRun('anti-persona',sample,'fr'), CreativeInputError);
  assert.throws(() => createRun('anti-persona',{...sample,brand:'a'}), CreativeInputError);
  assert.throws(() => createRun('anti-persona',{...sample,product:'\u0001 bad'}), CreativeInputError);
  assert.throws(() => createRun('anti-persona',{...sample,audience:'X'.repeat(181)}), CreativeInputError);
  const run=createRun('anti-persona',sample);
  assert.throws(()=>choose(run,'not-a-choice'), CreativeInputError);
  assert.throws(()=>choose(run,nextStage(run).choices[0].id,'x'.repeat(601)),CreativeInputError);
  const corrupted={...run,answers:[{turnId:'not-real',choiceId:'skeptic',note:''}]};
  assert.throws(()=>nextStage(corrupted),CreativeInputError);
});

test('Untrusted authored inputs are preserved as text in exported JSON, never executed or transmitted', () => {
  const suspicious = {
    brand: '<img src=x onerror=alert(1)>',
    product: 'Research-only item with <script>alert(1)</script>',
    audience: 'People who value the ability to opt out'
  };
  let run = createRun('anti-persona', suspicious);
  while(!progress(run).finished) {
    const stage=nextStage(run);
    run=choose(run,stage.choices[0].id,
      stage.requiredNote ? '<svg onload=alert(1)> test content' : '');
  }
  const value=report(run);
  assert.equal(value.project.brand,suspicious.brand);
  assert.match(JSON.stringify(value),/<script>/);
  assert.equal(value.provenance.tracking,'none');
  assert.equal(value.provenance.externalAI,false);
});

test('HTTP serves five actual CSP-protected games, three shared ES modules and no secret API on static pages', async t => {
  const app=createApp({dbPath:':memory:'});
  await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));
  t.after(async()=>{await new Promise(resolve=>app.server.close(resolve));app.db.close()});
  const base='http://127.0.0.1:'+app.server.address().port;
  const assets=[
    ...WORLD_IDS.map(id=>'/apps/'+id+'/'),
    '/apps/creative-worlds/style.css',
    '/apps/creative-worlds/engine.mjs',
    '/apps/creative-worlds/worlds.mjs',
    '/apps/creative-worlds/runner.mjs',
    '/apps/creative-worlds/bridge.mjs'
  ];
  for (const path of assets) {
    const response=await fetch(base+path);
    assert.equal(response.status,200,path);
    const body=await response.text();
    assert.ok(body.length>50);
    assert.match(response.headers.get('content-security-policy'),/script-src 'self'/);
    if (path.endsWith('.mjs')) assert.match(response.headers.get('content-type'),/javascript/);
    if (path.endsWith('/')) {
      assert.match(response.headers.get('content-type'),/text\/html/);
      assert.match(body,/name="viewport"/);
      assert.ok(body.includes('creative-worlds/runner.mjs'));
      assert.equal(body.includes('src="http'),false);
    }
  }
  const notFound=await fetch(base+'/apps/creative-worlds/private-token.json');
  assert.equal(notFound.status,404);
});


test('WAVE 10: locally authored outcomes become editable, explicitly UNSAVED commercial drafts for all five worlds', () => {
  for(const world of WORLD_IDS) {
    for(const locale of LANGUAGES){
      const artifact=report(finish(world,locale,0));
      const campaign=toCampaignDraft(artifact,locale);
      assert.equal(campaign.venture,world);
      assert.equal(campaign.goal,'validation');
      assert.equal(campaign.channel,'landing');
      assert.equal(campaign.audience,sample.audience);
      assert.equal(campaign.offer,sample.product);
      assert.equal(campaign.headline,sample.product);
      assert.ok(campaign.title.startsWith(WORLDS[world].name));
      assert.ok(campaign.body.length>=10 && campaign.body.length<=700);
      assert.ok(campaign.title.length<=100);
      assert.equal(campaign._bridge.persisted,false);
      assert.equal(campaign._bridge.requiresEditorialReview,true);
      assert.equal(campaign._bridge.noRealPerformanceMetrics,true);
      assert.equal(campaign._bridge.steps,WORLDS[world].turns.length);
      assert.equal(JSON.stringify(campaign).includes('heuristics'),false);
      assert.equal(JSON.stringify(campaign).includes('totalCTA'),false);
    }
  }
});
test('WAVE 10: file bridge rejects forged metrics, incomplete reports, untrusted choices and invalid metadata',()=>{
 const valid=report(finish('anti-persona','ru'));
 assert.throws(()=>toCampaignDraft(null),/Not a compatible/);
 assert.throws(()=>toCampaignDraft({...valid,schema:'fake'}),/Not a compatible/);
 assert.throws(()=>toCampaignDraft({...valid,metricType:'actual-ad-conversion'}),/Not a compatible/);
 assert.throws(()=>toCampaignDraft({...valid,provenance:{...valid.provenance,realParticipants:true}}),/Not a compatible/);
 assert.throws(()=>toCampaignDraft({...valid,decisions:valid.decisions.slice(1)}),/incomplete/);
 assert.throws(()=>toCampaignDraft({...valid,decisions:[{...valid.decisions[0],selectedChoice:'fraud'},...valid.decisions.slice(1)]}),/Invalid creative decision/);
 assert.throws(()=>toCampaignDraft({...valid,project:{...valid.project,brand:'a'}}),/Invalid project metadata/);
 assert.throws(()=>toCampaignDraft(valid,'de'),/Unsupported language/);
 const short={...valid,project:{...valid.project,product:'Pen'}};
 const campaign=toCampaignDraft(short);
 assert.ok(campaign.headline.length>=5);
 assert.equal(campaign._bridge.persisted,false);
});
