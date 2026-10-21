import test from 'node:test';
import assert from 'node:assert/strict';
import { refineDossier, validateCreativeResponse } from './creative-engine.mjs';

const mission = {
  host: {
    brand: 'Northstar Coffee',
    product: 'Subscription coffee',
    proof: 'A verified pilot has 20 recorded shipments',
    objective: 'leads'
  },
  guest: {
    audience: 'Time-poor founders',
    friction: 'Inconsistent morning routines',
    channel: 'video'
  },
  messages: [
    { role: 'product', text: 'Proof must be real.' },
    { role: 'audience', text: 'Make it relatable.' }
  ]
};

const draft = {
  campaign: 'THE SIGNAL',
  brand: mission.host.brand,
  audience: mission.guest.audience,
  openingHook: 'A regular creative opening',
  concept: 'An early concept for a targeted brand audience',
  execution: 'A video approach in three short beats',
  storyboard: [
    { beat: '01 / START', direction: 'Start a story' },
    { beat: '02 / MIDDLE', direction: 'Introduce product' },
    { beat: '03 / END', direction: 'Close with action' }
  ],
  callToAction: 'Request a sample',
  evidenceToVerify: mission.host.proof,
  interceptedSignals: {
    productAgent: mission.messages[0].text,
    audienceAgent: mission.messages[1].text
  },
  validation: 'Run an experiment',
  generationMethod: 'rules',
  disclosure: 'Not AI'
};

const result = {
  openingHook: 'Morning chaos is costing your focus',
  concept: 'A memorable mystery around a better everyday ritual',
  execution: 'Create a short-form story with an audience choice',
  storyboard: [
    { beat: 'INTRODUCE', direction: 'Lead with a morning question' },
    { beat: 'CHALLENGE', direction: 'Offer a surprising point of view' },
    { beat: 'REVEAL', direction: 'Show the product as one possible choice' }
  ],
  callToAction: 'See the experience',
  validation: 'Compare completed qualified actions against the control'
};

test('the AI request is server-side, small, not stored, with bounded structured JSON', async () => {
  let called = 0;
  const out = await refineDossier({
    mission, draft, language: 'ru',
    apiKey: 'test-only-secret', model: 'test-model',
    fetchImpl: async (url, options) => {
      called++;
      assert.equal(url, 'https://api.openai.com/v1/responses');
      assert.equal(options.headers.Authorization, 'Bearer test-only-secret');
      const body = JSON.parse(options.body);
      assert.equal(body.model, 'test-model');
      assert.equal(body.store, false);
      assert.equal(body.text.format.type, 'json_schema');
      assert.equal(body.text.format.strict, true);
      assert.equal(body.max_output_tokens, 1300);
      assert.equal(JSON.parse(body.input[0].content).outputLanguage, 'ru');
      assert.ok(!JSON.stringify(body).includes('test-only-secret'));
      return {
        ok: true, status: 200,
        json: async () => ({
          status: 'completed',
          output: [{ content: [{ type: 'output_text', text: JSON.stringify(result) }] }]
        })
      };
    }
  });
  assert.equal(called, 1);
  assert.equal(out.generationMethod, 'ai-assisted');
  assert.equal(out.brand, draft.brand);
  assert.equal(out.evidenceToVerify, draft.evidenceToVerify);
  assert.deepEqual(out.interceptedSignals, draft.interceptedSignals);
  assert.match(out.disclosure, /не проверены|unverified/);
  assert.equal(out.storyboard.length, 3);
});

test('malformed or oversized model fields are rejected', () => {
  assert.throws(() => validateCreativeResponse({
    ...result, concept: 'x'.repeat(1000)
  }, draft), /Invalid AI length/);
  assert.throws(() => validateCreativeResponse({
    ...result, storyboard: result.storyboard.slice(0, 2)
  }, draft), /three storyboard/);
  assert.throws(() => validateCreativeResponse(null, draft), /must be an object/);
});

test('non-completed model responses are rejected rather than represented as successful output', async () => {
  await assert.rejects(
    refineDossier({
      mission, draft, apiKey: 'test', model: 'test-model',
      fetchImpl: async () => ({
        ok: true,
        json: async () => ({ status: 'incomplete', output: [] })
      })
    }),
    /did not complete/
  );
});

test('an AI model cannot change the product evidence, brand or audience source fields', () => {
  const out = validateCreativeResponse({
    ...result,
    brand: 'EVIL PRODUCT',
    evidenceToVerify: 'All claims guaranteed',
    audience: 'Everyone',
    interceptedSignals: { productAgent: 'forged' }
  }, draft);
  assert.equal(out.brand, mission.host.brand);
  assert.equal(out.audience, mission.guest.audience);
  assert.equal(out.evidenceToVerify, mission.host.proof);
  assert.equal(out.interceptedSignals.productAgent, mission.messages[0].text);
});
