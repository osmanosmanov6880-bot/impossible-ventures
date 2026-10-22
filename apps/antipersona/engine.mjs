/**
 * AntiPersona adversarial-creative research engine, fully deterministic.
 * It flags editorial questions and never impersonates a verified person or
 * uses actual LLM calls. Campaign facts are user-provided and unverified.
 */
export const VERSION = 'antipersona-v1';
export const PERSONAS = Object.freeze(['skeptic','finance','impatient','inclusion']);
export const PRESSURES = Object.freeze(['focused','intense']);
const personaChallenges = Object.freeze({
  skeptic:['claim','proof','trust'],
  finance:['roi','cost','measurement'],
  impatient:['clarity','time','action'],
  inclusion:['access','assumption','trust']
});
function text(input,label,max,min=3) {
  if(typeof input!=='string') throw new TypeError(label+' must be text');
  const value=input.trim().replace(/\s+/gu,' ');
  if(value.length<min || value.length>max)throw new RangeError(label+' must be '+min+'–'+max+' characters');
  return value;
}
export function validateBrief(source) {
  if(!source || typeof source!=='object'||Array.isArray(source))throw new TypeError('Brief object required');
  if(!PERSONAS.includes(source.persona))throw new RangeError('Invalid adversary');
  if(!PRESSURES.includes(source.pressure))throw new RangeError('Invalid challenge intensity');
  return Object.freeze({
    brand:text(source.brand,'Brand',130),
    audience:text(source.audience,'Audience',240),
    idea:text(source.idea,'Idea',1200,20),
    persona:source.persona,
    pressure:source.pressure
  });
}
function riskIdentifiers(idea) {
  const out=[];
  if(/гарант|guarantee|100\s*%|保证|保證/iu.test(idea))out.push('guarantee');
  if(/лучший|best|#\s*1|№\s*1|第一/iu.test(idea))out.push('superlative');
  if(/только\s*сегодня|last\s*chance|only\s*today|最后机会/iu.test(idea))out.push('urgency');
  return out;
}
export function openChallenge(data) {
  const brief=validateBrief(data);
  return Object.freeze({
    version:VERSION, brief,
    challenges:personaChallenges[brief.persona].map((id,i)=>Object.freeze({id,sequence:i+1,priority:i===0?'first':'followup'})),
    riskFlags:riskIdentifiers(brief.idea),
    disclosures:{
      modelUsed:false,
      verifiedClaims:false,
      predictsPerformance:false,
      privateToTab:true
    }
  });
}
export function assessDefense({challenge,reply,debate}) {
  if(!debate || typeof debate!=='object'||!Array.isArray(debate.challenges))throw new TypeError('Open debate required');
  if(!debate.challenges.some(x=>x.id===challenge))throw new RangeError('Unknown challenge');
  const response=text(reply,'Defense',900,12);
  const hasNumber=/\d/u.test(response);
  const hasSource=/https?:\/\/|исследован|отчет|аудит|провер|доказ|study|test|audit|source|report|研究|验证/iu.test(response);
  const hasAction=/провер|измер|запуст|сравн|покаж|measure|test|compare|show|validate|验证|测量/iu.test(response);
  // This is a transparent counterargument *structure* score only, not fact validation.
  const readiness=Math.min(3,Number(response.length>=45)+Number(hasNumber||hasSource)+Number(hasAction));
  return Object.freeze({
    challenge, response, readiness,
    maximum:3, nextStep:readiness<2?'needConcreteProof':'verifySupportingEvidence',
    evidenceIndependentlyVerified:false,
    commercialOutcomePredicted:false
  });
}
