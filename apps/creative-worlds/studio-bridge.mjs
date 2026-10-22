/**
 * Premium studio -> Commercial Command. Pure browser-compatible conversion.
 *
 * This is an explicit user-reviewed local file bridge. Never interprets a
 * generated creative suggestion as true evidence, delivered impressions,
 * ROI or paid revenue. It ignores unrecognized metadata, auth tokens and
 * analytics fields and returns only whitelisted draft fields.
 */
import {renderGenome} from '../adbiome/engine.mjs';

export const PREMIUM_BRIDGE_VERSION='iv-premium-studio-bridge-v1';
export const ALLOWED_LOCALES=Object.freeze(['ru','en','zh']);
export const MAX_PREMIUM_IMPORT_BYTES=200_000;
export const ACCEPTED_KINDS=Object.freeze([
 'appeal-2049-editorial-report',
 'antipersona-debate-report',
 'brief-theatre-script',
 'adbiome-local-library',
 'dead-drop-agent-export',
 'iv-premium-campaign-handoff-v1'
]);
const LOCALE_COPY=Object.freeze({
 ru:Object.freeze({warning:'ТВОРЧЕСКАЯ ГИПОТЕЗА — НЕ ПОДТВЕРЖДЁННЫЙ ФАКТ. Проверьте все утверждения, согласие аудитории и право на публикацию.',action:'Обсудить пилот'}),
 en:Object.freeze({warning:'CREATIVE HYPOTHESIS, NOT VERIFIED FACT. Independently review claims, consent and publication rights.',action:'Discuss a pilot'}),
 zh:Object.freeze({warning:'创意假设，并非已验证事实。发布前请独立审查所有主张、同意和使用权。',action:'讨论试点项目'})
});
const BRANDS=Object.freeze({
 'appeal-2049-editorial-report':'appeal-2049',
 'antipersona-debate-report':'anti-persona',
 'brief-theatre-script':'brief-theatre',
 'adbiome-local-library':'ad-biome',
 'dead-drop-agent-export':'dead-drop'
});
const CHANNELS=new Set(['landing','social','video','email','display']);
const GOALS=new Set(['validation','awareness','leads','sales']);
const VENTURES=new Set(['dead-drop','appeal-2049','anti-persona','brief-theatre','ad-biome','museum-of-attention','attention-republic']);

function record(value){
 return value!==null && typeof value==='object' && !Array.isArray(value);
}
function field(value,name,min,max){
 if(typeof value!=='string')throw new TypeError(name+' must be text');
 const v=value.trim().replace(/\s+/gu,' ');
 if(v.length<min||v.length>max || /[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/u.test(v)){
   throw new RangeError(name+' must be '+min+'–'+max+' safe characters');
 }
 return v;
}
function safe(value,max,min=0){
 if(typeof value!=='string')return '';
 const clean=value.trim().replace(/\s+/gu,' ').replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/gu,'');
 return clean.length>=min?clean.slice(0,max):'';
}
function ensure(condition,message){if(!condition)throw new Error(message);}

function fromAppeal(artifact){
 const review=artifact.evaluation;
 ensure(record(review)&&record(review.input)&&review.evidenceVerified===false,'Invalid editorial evaluation');
 const i=review.input;
 return {
  kind:artifact.kind,venture:'appeal-2049',brand:field(i.product,'Product',3,160),
  audience:field(i.audience,'Audience',3,240),concept:field(i.idea,'Idea',3,1600),
  proof:safe(i.evidence,220),goal:GOALS.has(i.goal)?i.goal:'validation',channel:'landing'
 };
}
function fromAntiPersona(artifact){
 const debate=artifact.debate;
 ensure(record(debate)&&record(debate.brief)&&record(debate.disclosures)&&
   debate.disclosures.verifiedClaims===false && debate.disclosures.modelUsed===false,
   'Invalid AntiPersona editorial record');
 const b=debate.brief;
 return {
  kind:artifact.kind,venture:'anti-persona',brand:field(b.brand,'Brand',3,130),
  audience:field(b.audience,'Audience',3,240),concept:field(b.idea,'Idea',20,1200),
  proof:'',goal:'validation',channel:'landing'
 };
}
function fromTheatre(artifact){
 ensure(artifact.factualClaimsUnverified===true && artifact.noRealCampaignLaunched===true &&
   Array.isArray(artifact.scenes)&&artifact.scenes.length===3,
   'Expected a complete three-act unverified Brief Theatre script');
 const acts=['opening','evidence','conversion'];
 const scripts=artifact.scenes.map((s,i)=>{
  ensure(record(s)&&s.act===acts[i]&&s.verified===false,'Invalid scene order or verified claim');
  return field(s.draft,'Scene',20,1000);
 });
 return {
  kind:artifact.kind,venture:'brief-theatre',brand:field(artifact.brand,'Brand',3,120),
  audience:field(artifact.audience,'Audience',3,220),concept:scripts.join(' / '),
  proof:'',goal:'validation',channel:CHANNELS.has(artifact.channel)?artifact.channel:'landing'
 };
}
function fromBiome(artifact,locale){
 ensure(artifact.claimsUnverified===true && artifact.measuredBusinessOutcomes===false &&
   Array.isArray(artifact.genomes)&&artifact.genomes.length>=1&&artifact.genomes.length<=12,
   'Invalid AdBiome research library');
 const latest=artifact.genomes.at(-1);
 ensure(record(latest)&&latest.kind==='adbiome-genome'&&latest.assertionsVerified===false&&latest.actualPerformanceMeasured===false,
   'Invalid AdBiome selected genome');
 const rendered=renderGenome(latest,locale);
 const brand=field(latest.brand,'Brand',3,140);
 const audience=field(latest.audience,'Audience',3,240);
 ensure(brand===artifact.brand&&audience===artifact.audience,'Mixed-brand genome library is not importable');
 return {
  kind:artifact.kind,venture:'ad-biome',brand,audience,
  concept:[rendered.headline,rendered.tension,rendered.voiceDirection].join(' '),
  proof:rendered.proofInstruction,action:rendered.cta,goal:'validation',channel:'landing'
 };
}
function fromDeadDrop(artifact){
 ensure(record(artifact.mission)&&artifact.mission.status==='finalized'&&record(artifact.mission.dossier),
  'Only finalized Dead Drop agent exports are accepted');
 const d=artifact.mission.dossier;
 return {
  kind:artifact.kind,venture:'dead-drop',brand:field(d.brand,'Brand',3,160),
  audience:field(d.audience,'Audience',3,240),
  concept:field(d.concept,'Concept',3,1600),
  proof:safe(d.evidenceToVerify,200),
  action:safe(d.callToAction,60),goal:'validation',channel:'landing'
 };
}
function packageDraft(raw,locale){
 const warning=LOCALE_COPY[locale].warning;
 const bodyParts=[warning,raw.concept,raw.proof].filter(Boolean);
 return Object.freeze({
  title:safe(raw.brand+' / '+raw.venture,100,3),
  venture:raw.venture,
  goal:GOALS.has(raw.goal)?raw.goal:'validation',
  channel:CHANNELS.has(raw.channel)?raw.channel:'landing',
  audience:safe(raw.audience,300,3),
  offer:safe(raw.brand+' — editorial proposal for review',240,3),
  headline:safe(raw.concept,180,5),
  body:safe(bodyParts.join(' '),700,10),
  ctaLabel:safe(raw.action,60,3)||LOCALE_COPY[locale].action,
  _bridge:Object.freeze({
    version:PREMIUM_BRIDGE_VERSION,
    source:raw.kind,
    persisted:false,
    requiresEditorialReview:true,
    realCampaignLaunched:false,
    factsVerified:false,
    revenueMeasured:false
  })
 });
}
/** Import known artifact kinds without copying any unsolicited secret fields. */
export function toPremiumCampaignDraft(artifact,locale='ru'){
 if(!ALLOWED_LOCALES.includes(locale))throw new RangeError('Unsupported locale');
 if(!record(artifact))throw new TypeError('JSON object required');
 if(!ACCEPTED_KINDS.includes(artifact.kind))throw new RangeError('Unsupported premium studio artifact');
 if(artifact.kind==='iv-premium-campaign-handoff-v1'){
  ensure(artifact.version===PREMIUM_BRIDGE_VERSION&&record(artifact.draft)&&
    artifact.draft._bridge?.requiresEditorialReview===true&&
    artifact.draft._bridge?.factsVerified===false&&
    artifact.draft._bridge?.persisted===false,'Invalid unsaved premium handoff');
  const d=artifact.draft;
  ensure(VENTURES.has(d.venture)&&GOALS.has(d.goal)&&CHANNELS.has(d.channel),
    'Invalid premium handoff category');
  return Object.freeze({
    ...packageDraft({
      kind:'iv-premium-campaign-handoff-v1',venture:d.venture,
      brand:field(d.offer,'Offer',3,240),
      audience:field(d.audience,'Audience',3,300),
      concept:field(d.headline,'Headline',5,180),
      proof:safe(d.body,440,10),action:field(d.ctaLabel,'CTA',3,60),
      goal:d.goal,channel:d.channel
    },locale),
    title:safe(d.title,100,3),
    offer:safe(d.offer,240,3),
    headline:safe(d.headline,180,5),
    body:safe(LOCALE_COPY[locale].warning+' '+safe(d.body,550,10),700,10)
  });
 }
 let raw;
 if(artifact.kind==='appeal-2049-editorial-report')raw=fromAppeal(artifact);
 else if(artifact.kind==='antipersona-debate-report')raw=fromAntiPersona(artifact);
 else if(artifact.kind==='brief-theatre-script')raw=fromTheatre(artifact);
 else if(artifact.kind==='adbiome-local-library')raw=fromBiome(artifact,locale);
 else raw=fromDeadDrop(artifact);
 return packageDraft(raw,locale);
}
/** A portable, explicitly unsaved draft; Commercial Command requires manual Save. */
export function makePremiumHandoff(draft){
 ensure(record(draft)&&record(draft._bridge)&&draft._bridge.version===PREMIUM_BRIDGE_VERSION &&
   draft._bridge.persisted===false && draft._bridge.factsVerified===false,
   'Not a validated unsaved campaign');
 const allowed={};
 for(const key of ['title','venture','goal','channel','audience','offer','headline','body','ctaLabel'])allowed[key]=draft[key];
 allowed._bridge={...draft._bridge};
 return Object.freeze({
  kind:'iv-premium-campaign-handoff-v1',version:PREMIUM_BRIDGE_VERSION,
  draft:allowed,disclosure:'Local editorial draft only. Not published, verified or attributed to real customers.'
 });
}
