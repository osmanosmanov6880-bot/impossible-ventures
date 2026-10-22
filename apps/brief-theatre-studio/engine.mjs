/**
 * Brief Theatre: interactive three-act creative rehearsal.
 * A rule-based writing tool, not a dramatic AI actor or performance forecast.
 */
export const VERSION = 'brief-theatre-v1';
export const CHANNELS = Object.freeze(['social','video','landing']);
export const DIRECTIONS = Object.freeze(['bold','careful']);
export const ACTS = Object.freeze(['opening','evidence','conversion']);

function normalized(value,label,max,min=3) {
  if(typeof value!=='string') throw new TypeError(label+' must be text');
  const text=value.trim().replace(/\s+/gu,' ');
  if(text.length<min||text.length>max)throw new RangeError(label+' must be '+min+'–'+max+' characters');
  return text;
}

export function startPlay(data) {
  if(!data||typeof data!=='object'||Array.isArray(data))throw new TypeError('Brief object required');
  if(!CHANNELS.includes(data.channel))throw new RangeError('Invalid channel');
  const brief=Object.freeze({
    brand:normalized(data.brand,'Brand',120),
    audience:normalized(data.audience,'Audience',220),
    concept:normalized(data.concept,'Concept',900,20),
    channel:data.channel
  });
  return {
    version:VERSION, brief,
    actIndex:0, status:'performing', history:[],
    editorialOnly:true, realAudienceTested:false,
    claimEvidenceVerified:false
  };
}

export function currentAct(play) {
  if(!play||!Array.isArray(play.history))throw new TypeError('Invalid play state');
  if(play.actIndex===ACTS.length)return null;
  const previous=play.history.at(-1);
  return {
    act:ACTS[play.actIndex],
    number:play.actIndex+1,
    lastDirection:previous?.direction??null,
    pressure:previous?.direction==='bold'?'challengeRisk':'challengeClarity',
    channel:play.brief.channel
  };
}

export function advancePlay(play,{draft,direction}={}) {
  if(!play||play.status!=='performing'||play.actIndex>=ACTS.length)throw new RangeError('Play already completed');
  if(!DIRECTIONS.includes(direction))throw new RangeError('Invalid director choice');
  const text=normalized(draft,'Scene draft',1000,20);
  const act=ACTS[play.actIndex];
  const hasAction=/request|register|start|click|download|discover|buy|book|try|join|узна|попрос|куп|заяв|запис|скач|откр|申请|注册|点击|购买|下载/iu.test(text);
  const hasProof=/source|demo|audit|sample|study|report|evidence|review|провер|демо|пример|источник|отч[её]т|аудит|исслед|来源|报告|演示|核实/iu.test(text);
  const hasNumber=/\d/u.test(text);
  const signalCount = Math.min(3,
    Number(text.length>=55)+
    Number(act==='evidence'?(hasProof||hasNumber):act==='conversion'?hasAction:(text.length>=100))+
    Number(direction==='careful' ? (hasProof||hasAction) : text.length>=130)
  );
  const submission=Object.freeze({
    act, direction, draft:text,structureSignals:signalCount,maximum:3,
    verified:false, published:false
  });
  const history=[...play.history,submission];
  const next=history.length;
  return {
    ...play,history,actIndex:next,status:next===ACTS.length?'complete':'performing'
  };
}

export function scriptSummary(play) {
  if(!play||play.status!=='complete'||play.history.length!==ACTS.length)throw new RangeError('Three scenes must be completed');
  return Object.freeze({
    kind:'brief-theatre-script',
    version:VERSION,
    brand:play.brief.brand,
    audience:play.brief.audience,
    originalConcept:play.brief.concept,
    channel:play.brief.channel,
    scenes:play.history,
    editorialSignals:play.history.reduce((n,s)=>n+s.structureSignals,0),
    maxSignals:ACTS.length*3,
    factualClaimsUnverified:true,
    noRealCampaignLaunched:true,
    disclosure:'Rule-based writing rehearsal only. No model inference or verified campaign results.'
  });
}
