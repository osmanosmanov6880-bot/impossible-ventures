import {randomBytes,createHash,timingSafeEqual} from 'node:crypto';

/**
 * Attention Republic — operator-moderated, consent-gated voting ALPHA.
 * One ballot per anonymous session token, NOT per unique person. Counts
 * are authenticated sessions and cannot establish human reach or election
 * integrity. No payment, feed-ranking algorithm or marketing tracker.
 */
export const SESSION_TTL_MS=7*24*60*60*1000;
export const AGGREGATE_TTL_DAYS=90;
const CHALLENGE_TTL_MS=14*24*60*60*1000;
const LANGS=['ru','en','zh'];
const STATUSES=['draft','active','paused','closed'];
const CHOICES=['a','b'];

function digest(v){return createHash('sha256').update(String(v)).digest();}
function secureMatch(value,storedHex){
 if(typeof value!=='string'||value.length>256||!storedHex)return false;
 const expected=Buffer.from(storedHex,'hex'),actual=digest(value);
 return expected.length===actual.length&&timingSafeEqual(expected,actual);
}
function text(value,label,ApiError,max=180,min=3){
 if(typeof value!=='string')throw new ApiError(400,label+' is required');
 const v=value.trim().replace(/\s+/gu,' ');
 if(v.length<min||v.length>max||/[\u0000-\u001f\u007f]/u.test(v))throw new ApiError(400,label+' has invalid length or characters');
 return v;
}
function bearer(request){
 const h=request.headers.authorization||'';
 return h.startsWith('Bearer ')?h.slice(7):'';
}
export function createRepublicRouter({db,now,operatorToken='',ApiError,jsonBody,sendJSON}){
 db.exec(
  'CREATE TABLE IF NOT EXISTS republic_challenges ('+
  'id TEXT PRIMARY KEY,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL,expires_at INTEGER NOT NULL,'+
  'title TEXT NOT NULL,question TEXT NOT NULL,choice_a TEXT NOT NULL,choice_b TEXT NOT NULL,locale TEXT NOT NULL,status TEXT NOT NULL);'+
  'CREATE TABLE IF NOT EXISTS republic_sessions ('+
  'id TEXT PRIMARY KEY,challenge_id TEXT NOT NULL,token_hash TEXT NOT NULL,created_at INTEGER NOT NULL,voted TEXT);'+
  'CREATE INDEX IF NOT EXISTS republic_session_challenge ON republic_sessions(challenge_id,created_at);'+
  'CREATE TABLE IF NOT EXISTS republic_daily ('+
  'challenge_id TEXT NOT NULL,cohort_day INTEGER NOT NULL,a INTEGER NOT NULL DEFAULT 0,b INTEGER NOT NULL DEFAULT 0,'+
  'PRIMARY KEY(challenge_id,cohort_day));'
 );
 const publicIntake=new Map(),operatorAttempts=new Map();
 function limit(map,request,max,period){
  const ip=request.socket.remoteAddress||'unknown',current=now();
  const previous=map.get(ip);
  const entry=previous&&current-previous.start<period?previous:{start:current,count:0};
  entry.count++;map.set(ip,entry);
  if(map.size>3000)for(const [key,val]of map)if(current-val.start>=period)map.delete(key);
  if(entry.count>max)throw new ApiError(429,'Too many requests for this operation');
 }
 function requireOperator(request){
  limit(operatorAttempts,request,30,60_000);
  if(typeof operatorToken!=='string'||operatorToken.length<32)throw new ApiError(503,'Operator access unavailable');
  const token=bearer(request);
  if(!token)throw new ApiError(401,'Operator token required');
  const expected=digest(operatorToken).toString('hex');
  if(!secureMatch(token,expected))throw new ApiError(403,'Operator token invalid');
 }
 function cleanup(){
  db.prepare('DELETE FROM republic_sessions WHERE created_at < ?').run(now()-SESSION_TTL_MS);
  db.prepare('DELETE FROM republic_daily WHERE cohort_day < ?').run(Math.floor(now()/86_400_000)-AGGREGATE_TTL_DAYS);
  db.prepare("UPDATE republic_challenges SET status='closed',updated_at=? WHERE expires_at<=? AND status IN ('active','paused','draft')").run(now(),now());
 }
 cleanup();
 const timer=setInterval(cleanup,60*60*1000);timer.unref();
 const stmt=db.prepare('SELECT COALESCE(SUM(a),0) AS a,COALESCE(SUM(b),0) AS b FROM republic_daily WHERE challenge_id=?');
 function counts(id){
  const row=stmt.get(id);
  const a=Number(row.a),b=Number(row.b);
  return {a,b,total:a+b,units:'recorded anonymous session ballots'};
 }
 function publicChallenge(row){
  return {
   id:row.id,title:row.title,question:row.question,
   choices:{a:row.choice_a,b:row.choice_b},
   locale:row.locale,status:row.status,expiresAt:row.expires_at,
   counts:counts(row.id),
   disclaimer:'One recorded session ballot is not a verified distinct human or independent public opinion sample.'
  };
 }
 function load(id){
  const row=db.prepare('SELECT * FROM republic_challenges WHERE id=?').get(id);
  if(!row)throw new ApiError(404,'Challenge not found');
  return row;
 }
 function active(row){
  if(row.status!=='active'||row.expires_at<=now())throw new ApiError(409,'Challenge is not accepting sessions');
 }
 async function route(request,response,pathname){
  const method=request.method;
  if(pathname==='/api/v1/republic/challenges'&&method==='GET'){
   cleanup();
   const rows=db.prepare("SELECT * FROM republic_challenges WHERE status='active' AND expires_at>? ORDER BY created_at DESC LIMIT 30").all(now());
   sendJSON(response,200,{
    items:rows.map(publicChallenge),
    note:'No live challenge is invented or seeded. Only operator-activated challenges are listed.'
   });
   return true;
  }
  if(pathname==='/api/v1/operator/republic/challenges'&&method==='GET'){
   requireOperator(request);cleanup();
   const rows=db.prepare('SELECT * FROM republic_challenges ORDER BY created_at DESC LIMIT 100').all();
   sendJSON(response,200,{items:rows.map(publicChallenge),note:'Ballots are unverified anonymous sessions, not unique people.'});
   return true;
  }
  if(pathname==='/api/v1/operator/republic/challenges'&&method==='POST'){
   requireOperator(request);
   const body=await jsonBody(request);
   const title=text(body.title,'Title',ApiError,120);
   const question=text(body.question,'Question',ApiError,220);
   const a=text(body.choiceA,'Choice A',ApiError,130);
   const b=text(body.choiceB,'Choice B',ApiError,130);
   if(a.toLowerCase()===b.toLowerCase())throw new ApiError(400,'Choices must differ');
   if(!LANGS.includes(body.locale))throw new ApiError(400,'Invalid locale');
   const id=randomBytes(12).toString('hex'),current=now();
   db.prepare('INSERT INTO republic_challenges (id,created_at,updated_at,expires_at,title,question,choice_a,choice_b,locale,status) VALUES (?,?,?,?,?,?,?,?,?,?)')
    .run(id,current,current,current+CHALLENGE_TTL_MS,title,question,a,b,body.locale,'draft');
   sendJSON(response,201,{challenge:publicChallenge(load(id))});
   return true;
  }
  const operatorStatus=/^\/api\/v1\/operator\/republic\/challenges\/([a-f0-9]{24})\/status$/u.exec(pathname);
  if(operatorStatus&&method==='POST'){
   requireOperator(request);
   const body=await jsonBody(request);
   if(!STATUSES.includes(body.status)||body.status==='draft')throw new ApiError(400,'Invalid status');
   const row=load(operatorStatus[1]);
   if(row.status==='closed'&&body.status!=='closed')throw new ApiError(409,'Closed challenge cannot reopen');
   if(row.expires_at<=now()&&body.status==='active')throw new ApiError(409,'Expired challenge cannot reopen');
   db.prepare('UPDATE republic_challenges SET status=?,updated_at=? WHERE id=?').run(body.status,now(),row.id);
   sendJSON(response,200,{challenge:publicChallenge(load(row.id))});
   return true;
  }
  // A participant may revoke consent and erase an UNVOTED session with
  // their own capability. Successful ballots remain aggregate only and cannot
  // be subtracted safely by a caller who no longer has an active session.
  const revoke=/^\/api\/v1\/republic\/challenges\/([a-f0-9]{24})\/sessions\/([a-f0-9]{32})$/u.exec(pathname);
  if(revoke&&method==='DELETE'){
   const token=bearer(request);
   if(!token)throw new ApiError(401,'Session token required');
   const [id,sid]=revoke.slice(1);
   const row=db.prepare('SELECT * FROM republic_sessions WHERE id=? AND challenge_id=?').get(sid,id);
   if(!row||!secureMatch(token,row.token_hash))throw new ApiError(403,'Session token invalid');
   if(row.voted!==null)throw new ApiError(409,'Recorded ballots cannot be revoked using session deletion');
   const result=db.prepare('DELETE FROM republic_sessions WHERE id=? AND challenge_id=? AND voted IS NULL').run(sid,id);
   if(result.changes!==1)throw new ApiError(409,'Session is no longer unvoted');
   sendJSON(response,200,{revoked:true,ballotRecorded:false,sessionDeleted:true});
   return true;
  }
  const match=/^\/api\/v1\/republic\/challenges\/([a-f0-9]{24})(?:\/(sessions|votes))?$/u.exec(pathname);
  if(match){
   const id=match[1],action=match[2];
   if(!action&&method==='GET'){
    const row=load(id);
    if(row.status!=='active'||row.expires_at<=now())throw new ApiError(404,'Challenge is unavailable');
    sendJSON(response,200,{challenge:publicChallenge(row)});return true;
   }
   if(action==='sessions'&&method==='POST'){
    limit(publicIntake,request,12,60*60*1000);
    const body=await jsonBody(request);
    if(body.consent!==true)throw new ApiError(422,'Explicit consent required for measured participation');
    const row=load(id);active(row);cleanup();
    const token=randomBytes(32).toString('base64url'),sessionId=randomBytes(16).toString('hex');
    db.prepare('INSERT INTO republic_sessions (id,challenge_id,token_hash,created_at,voted) VALUES (?,?,?,?,NULL)')
      .run(sessionId,id,digest(token).toString('hex'),now());
    sendJSON(response,201,{sessionId,token,expiresAt:now()+SESSION_TTL_MS,
      note:'Anonymous temporary session token. No unique-person identity is verified.'});
    return true;
   }
   if(action==='votes'&&method==='POST'){
    const body=await jsonBody(request);
    if(!CHOICES.includes(body.choice))throw new ApiError(400,'Choice must be a or b');
    if(typeof body.sessionId!=='string'||!/^[a-f0-9]{32}$/u.test(body.sessionId))throw new ApiError(400,'Invalid session identifier');
    const token=bearer(request);
    if(!token)throw new ApiError(401,'Session token required');
    const row=db.prepare('SELECT * FROM republic_sessions WHERE id=? AND challenge_id=?').get(body.sessionId,id);
    if(!row||!secureMatch(token,row.token_hash))throw new ApiError(403,'Session token invalid');
    if(now()-row.created_at>SESSION_TTL_MS)throw new ApiError(410,'Session expired');
    active(load(id));
    if(row.voted!==null)throw new ApiError(409,'This session has already voted');
    // Synchronous SQLite transaction: one successful ballot update/aggregate per session.
    db.exec('BEGIN IMMEDIATE');
    try{
     const result=db.prepare('UPDATE republic_sessions SET voted=? WHERE id=? AND challenge_id=? AND voted IS NULL')
       .run(body.choice,body.sessionId,id);
     if(result.changes!==1)throw new ApiError(409,'This session has already voted');
     const cohortDay=Math.floor(now()/86_400_000);
     db.prepare('INSERT INTO republic_daily(challenge_id,cohort_day,a,b) VALUES(?,?,?,?) '+
       'ON CONFLICT(challenge_id,cohort_day) DO UPDATE SET a=a+excluded.a,b=b+excluded.b')
       .run(id,cohortDay,body.choice==='a'?1:0,body.choice==='b'?1:0);
     db.exec('COMMIT');
    }catch(error){db.exec('ROLLBACK');throw error;}
    sendJSON(response,201,{
     recorded:true,choice:body.choice,counts:counts(id),
     note:'A recorded anonymous session ballot, not one independently verified person.'
    });
    return true;
   }
   throw new ApiError(405,'Method not allowed');
  }
  if(pathname.startsWith('/api/v1/republic')||pathname.startsWith('/api/v1/operator/republic')){
   throw new ApiError(404,'Republic API route not found');
  }
  return false;
 }
 route.stop=()=>clearInterval(timer);
 return route;
}
