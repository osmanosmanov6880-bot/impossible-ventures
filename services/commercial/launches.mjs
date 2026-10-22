import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

/**
 * WAVE 11–15 / Launch Studio
 *
 * Every launch is a version-frozen, owner-authorized, FIRST-PARTY interactive
 * microsite. This is NOT paid ad inventory or a connected advertising network.
 * Events require participant opt-in and are only event signals, not people.
 */
export const SESSION_RETENTION_DAYS = 7;
export const AGGREGATE_RETENTION_DAYS = 90;
const DAY = 86_400_000;
const sha = value => createHash('sha256').update(value).digest('hex');
const newId = () => randomBytes(12).toString('hex');
const newSessionId = () => randomBytes(16).toString('hex');
const newToken = () => 'ivls_' + randomBytes(32).toString('base64url');
const newReceipt = () => 'ivl_' + randomBytes(24).toString('base64url');
const okHash = (value, expected) => {
  if (typeof value !== 'string' || value.length > 160 ||
      typeof expected !== 'string' || !/^[a-f0-9]{64}$/.test(expected)) return false;
  const a=Buffer.from(sha(value),'hex'), b=Buffer.from(expected,'hex');
  return a.length===b.length && timingSafeEqual(a,b);
};
const asDay = millis => Math.floor(millis / DAY);
const DATE_RE = /^[a-f0-9]{24}$/;
const SESSION_RE = /^[a-f0-9]{32}$/;
const SUM_NOTE = 'Only consented first-party session starts, client-reported completions, one-time CTA signals and submitted opt-in lead forms are counted. Not impressions, unique real humans, paid clicks, proven conversion lift or verified revenue.';

function launchPublic(row) {
  const creative = JSON.parse(row.creative_json);
  return {
    id:row.id,
    campaignId:row.campaign_id,
    status:row.status,
    sourceRevision:row.source_revision,
    creative,
    createdAt:row.created_at,
    updatedAt:row.updated_at,
    note:'First-party interactive microsite, not a paid ad placement, fact-checked product statement or verified impression.'
  };
}
function publicCreative(row) {
  const creative=JSON.parse(row.creative_json);
  return {
    id:row.id,
    title:creative.title,
    venture:creative.venture,
    goal:creative.goal,
    headline:creative.headline,
    body:creative.body,
    offer:creative.offer,
    ctaLabel:creative.ctaLabel,
    status:'active',
    disclaimer:'A first-party storytelling prototype, not a verified advertisement or paid third-party inventory. Participation and any analytics are optional.'
  };
}
const allowed = {
  draft:['activate','retire'],
  active:['pause','retire'],
  paused:['resume','retire'],
  retired:[]
};
function bearer(request) {
  const header=request.headers.authorization;
  if(typeof header!=='string'||header.length>180||!header.startsWith('Bearer '))return '';
  return header.slice(7);
}
function maybeJSONError(Err,status,message) {throw new Err(status,message)}
function assertCampaignApproves(campaign,Err) {
  if(!campaign || campaign.status!=='approved')maybeJSONError(Err,409,'Only owner-approved, non-archived campaigns may launch');
}
export function createLaunches({db,now=Date.now,workspaces,campaigns,ApiError,jsonBody,sendJSON}) {
  db.exec(
    'CREATE TABLE IF NOT EXISTS commercial_launches ('+
      'id TEXT PRIMARY KEY,workspace_id TEXT NOT NULL,campaign_id TEXT NOT NULL,'+
      'source_revision INTEGER NOT NULL,creative_json TEXT NOT NULL,status TEXT NOT NULL,'+
      'created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL);'+
    'CREATE INDEX IF NOT EXISTS launch_workspace ON commercial_launches(workspace_id,created_at);'+
    "CREATE UNIQUE INDEX IF NOT EXISTS launch_one_open_campaign ON commercial_launches(campaign_id) WHERE status IN ('draft','active','paused');"+
    'CREATE TABLE IF NOT EXISTS launch_sessions ('+
      'id TEXT PRIMARY KEY,launch_id TEXT NOT NULL,token_hash TEXT NOT NULL,'+
      'created_at INTEGER NOT NULL,day INTEGER NOT NULL,completed INTEGER NOT NULL DEFAULT 0,'+
      'cta_recorded INTEGER NOT NULL DEFAULT 0,receipt_hash TEXT,claimed_lead_id TEXT);'+
    'CREATE INDEX IF NOT EXISTS launch_session_expiry ON launch_sessions(created_at);'+
    'CREATE INDEX IF NOT EXISTS launch_session_owner ON launch_sessions(launch_id);'+
    'CREATE TABLE IF NOT EXISTS launch_daily ('+
      'launch_id TEXT NOT NULL,day INTEGER NOT NULL,starts INTEGER NOT NULL DEFAULT 0,'+
      'completions INTEGER NOT NULL DEFAULT 0,cta INTEGER NOT NULL DEFAULT 0,'+
      'PRIMARY KEY(launch_id,day));'
  );
  const requests=new Map();
  function cleanup(){
    db.prepare('DELETE FROM launch_sessions WHERE created_at < ?').run(now()-SESSION_RETENTION_DAYS*DAY);
    db.prepare('DELETE FROM launch_daily WHERE day < ?').run(asDay(now())-AGGREGATE_RETENTION_DAYS+1);
    const old=now()-60*60*1000;
    for(const [key,value] of requests)if(value.start<old)requests.delete(key);
  }
  cleanup();
  const timer=setInterval(cleanup,60*60*1000);timer.unref();
  function rateLimit(request){
    const ip=request.socket.remoteAddress || 'unknown';
    const current=now();
    const previous=requests.get(ip);
    const entry=previous && current-previous.start<60*60*1000?previous:{start:current,count:0};
    entry.count++;
    requests.set(ip,entry);
    if(requests.size>5000){for(const [key,value] of requests)if(current-value.start>=60*60*1000)requests.delete(key)}
    if(entry.count>25)throw new ApiError(429,'Too many new sessions from this address');
  }
  function get(ws,id){
    const row=db.prepare('SELECT * FROM commercial_launches WHERE workspace_id=? AND id=?').get(ws,id);
    if(!row)throw new ApiError(404,'Launch not found');
    return row;
  }
  function live(id){
    // Owner can retire/stop instantly; archived parent campaigns cannot leak.
    const row=db.prepare('SELECT l.* FROM commercial_launches l '+
      'JOIN commercial_campaigns c ON c.id=l.campaign_id AND c.workspace_id=l.workspace_id '+
      "WHERE l.id=? AND l.status='active' AND c.status='approved'").get(id);
    if(!row)throw new ApiError(404,'Live creative is not available');
    return row;
  }
  function metrics(id){
    const today=asDay(now()),start=today-AGGREGATE_RETENTION_DAYS+1;
    const daily=db.prepare(
      'SELECT day,starts,completions,cta FROM launch_daily WHERE launch_id=? AND day>=? ORDER BY day ASC'
    ).all(id,start).map(row=>({
      date:new Date(row.day*DAY).toISOString().slice(0,10),
      sessions:Number(row.starts),completions:Number(row.completions),cta:Number(row.cta)
    }));
    const totals=daily.reduce((all,row)=>({
      sessions:all.sessions+row.sessions,
      completions:all.completions+row.completions,
      cta:all.cta+row.cta
    }),{sessions:0,completions:0,cta:0});
    const leadStats=db.prepare(
      "SELECT COUNT(*) AS submitted,SUM(CASE WHEN status IN ('qualified','won') THEN 1 ELSE 0 END) AS qualified "+
      'FROM pilot_leads WHERE launch_id=? AND created_at>=?'
    ).get(id,start*DAY);
    const leads={
      submittedForms:Number(leadStats.submitted||0),
      operatorQualified:Number(leadStats.qualified||0)
    };
    return {
      period:'rolling-last-90-calendar-days',
      retentionDays:{sessions:SESSION_RETENTION_DAYS,aggregates:AGGREGATE_RETENTION_DAYS},
      totals, leads,daily, attribution:'verified-one-time-cta-receipt-then-separate-contact-consent',
      note:SUM_NOTE
    };
  }
  function sendCSV(response,id){
    const data=metrics(id);
    // No personal identifiers in the CSV. Lead totals are included only in
    // the summary row, not assigned to the wrong event date.
    const rows=['utc_day,consented_session_starts,completion_signals,cta_signals'];
    for(const row of data.daily)rows.push([row.date,row.sessions,row.completions,row.cta].join(','));
    rows.push('');
    rows.push('metric,count');
    rows.push('attributed_form_submissions,'+data.leads.submittedForms);
    rows.push('manually_qualified_forms,'+data.leads.operatorQualified);
    rows.push('verified_payments,not_integrated');
    rows.push('data_limitations,"Consented event signals only; no verified impressions, people or revenue"');
    const body=rows.join('\r\n')+'\r\n';
    response.writeHead(200,{
      'Content-Type':'text/csv; charset=utf-8',
      'Content-Disposition':'attachment; filename="iv-launch-'+id+'-metrics.csv"',
      'Cache-Control':'no-store',
      'X-Content-Type-Options':'nosniff',
      'Content-Length':Buffer.byteLength(body)
    });
    response.end(body);
  }
  function sessionAuth(req,launchId,sessionId){
    const session=db.prepare(
      'SELECT * FROM launch_sessions WHERE id=? AND launch_id=?'
    ).get(sessionId,launchId);
    if(!session)throw new ApiError(404,'Session not found');
    const token=bearer(req);
    if(!token)throw new ApiError(401,'Session credential required');
    if(!/^ivls_[A-Za-z0-9_-]{43}$/.test(token)||!okHash(token,session.token_hash))
      throw new ApiError(403,'Invalid session credential');
    const age=now()-session.created_at;
    if(age<0||age>SESSION_RETENTION_DAYS*DAY)throw new ApiError(410,'Session has expired');
    return session;
  }
  async function handle(request,response,path){
    const list=/^\/api\/v1\/workspaces\/([a-f0-9]{24})\/launches$/.exec(path);
    if(list&&request.method==='GET'){
      workspaces.requireRole(request,list[1]);
      const items=db.prepare('SELECT * FROM commercial_launches WHERE workspace_id=? ORDER BY created_at DESC,id DESC LIMIT 100')
        .all(list[1]).map(row=>({...launchPublic(row),metrics:metrics(row.id)}));
      sendJSON(response,200,{items,summary:{
        draft:items.filter(x=>x.status==='draft').length,
        active:items.filter(x=>x.status==='active').length,
        paused:items.filter(x=>x.status==='paused').length,
        retired:items.filter(x=>x.status==='retired').length
      },notice:SUM_NOTE});
      return true;
    }
    if(list&&request.method==='POST'){
      const actor=workspaces.requireRole(request,list[1],['owner']);
      const input=await jsonBody(request);
      if(!input||typeof input!=='object'||!DATE_RE.test(input.campaignId||''))throw new ApiError(400,'Campaign ID required');
      const source=campaigns.find(list[1],input.campaignId);
      assertCampaignApproves(source,ApiError);
      const snapshot={
        title:source.title,venture:source.venture,goal:source.goal,
        headline:source.headline,body:source.body,offer:source.offer,ctaLabel:source.cta_label
      };
      const at=now(),id=newId();
      try{
        db.prepare('INSERT INTO commercial_launches '+
          '(id,workspace_id,campaign_id,source_revision,creative_json,status,created_at,updated_at) '+
          'VALUES(?,?,?,?,?,?,?,?)')
          .run(id,list[1],source.id,source.revision,JSON.stringify(snapshot),'draft',at,at);
      }catch(error){
        if(/UNIQUE constraint failed/i.test(error.message||''))throw new ApiError(409,'A non-retired launch already exists for this campaign');
        throw error;
      }
      workspaces.audit(list[1],'launch.created',actor.token.id,id);
      sendJSON(response,201,{
        launch:launchPublic(get(list[1],id)),publicUrl:'/play/?id='+id,
        notice:'Draft microsite is not publicly accessible before owner activation.'
      });
      return true;
    }
    const member=/^\/api\/v1\/workspaces\/([a-f0-9]{24})\/launches\/([a-f0-9]{24})$/.exec(path);
    if(member&&request.method==='GET'){
      workspaces.requireRole(request,member[1]);
      const row=get(member[1],member[2]);
      sendJSON(response,200,{launch:launchPublic(row),metrics:metrics(row.id)});
      return true;
    }
    const stats=/^\/api\/v1\/workspaces\/([a-f0-9]{24})\/launches\/([a-f0-9]{24})\/(metrics|report.csv)$/.exec(path);
    if(stats&&request.method==='GET'){
      workspaces.requireRole(request,stats[1]);
      const row=get(stats[1],stats[2]);
      if(stats[3]==='report.csv')sendCSV(response,row.id);
      else sendJSON(response,200,{launchId:row.id,...metrics(row.id)});
      return true;
    }
    const transition=/^\/api\/v1\/workspaces\/([a-f0-9]{24})\/launches\/([a-f0-9]{24})\/(activate|pause|resume|retire)$/.exec(path);
    if(transition&&request.method==='POST'){
      const actor=workspaces.requireRole(request,transition[1],['owner']);
      const old=get(transition[1],transition[2]);
      const action=transition[3];
      if(!allowed[old.status].includes(action))throw new ApiError(409,'Invalid launch status transition');
      if(action==='activate'||action==='resume')assertCampaignApproves(
        campaigns.find(transition[1],old.campaign_id),ApiError
      );
      const next={activate:'active',pause:'paused',resume:'active',retire:'retired'}[action];
      const change=db.prepare(
        'UPDATE commercial_launches SET status=?,updated_at=? '+
        'WHERE workspace_id=? AND id=? AND status=?'
      ).run(next,now(),transition[1],transition[2],old.status);
      if(!change.changes)throw new ApiError(409,'Concurrent launch update');
      workspaces.audit(transition[1],'launch.'+next,actor.token.id,old.id);
      sendJSON(response,200,{
        launch:launchPublic(get(transition[1],old.id)),
        publicUrl:next==='active'?'/play/?id='+old.id:null,
        embedSnippet:next==='active'
          ? '<iframe src="/play/?id='+old.id+'" title="Interactive story" loading="lazy" referrerpolicy="no-referrer"></iframe>'
          : null,
        note:'First-party hosted story only; not a third-party paid advertising placement.'
      });
      return true;
    }
    const publicLaunch=/^\/api\/v1\/launches\/([a-f0-9]{24})$/.exec(path);
    if(publicLaunch&&request.method==='GET'){
      const row=live(publicLaunch[1]);
      sendJSON(response,200,{creative:publicCreative(row)});
      return true;
    }
    const sessionStart=/^\/api\/v1\/launches\/([a-f0-9]{24})\/sessions$/.exec(path);
    if(sessionStart&&request.method==='POST'){
      live(sessionStart[1]);
      const data=await jsonBody(request);
      if(!data||data.consent!==true)throw new ApiError(422,'Opt-in measurement consent required');
      rateLimit(request);
      const secret=newToken(),id=newSessionId(),timestamp=now(),day=asDay(timestamp);
      db.exec('BEGIN IMMEDIATE');
      try{
        db.prepare('INSERT INTO launch_sessions '+
          '(id,launch_id,token_hash,created_at,day) VALUES(?,?,?,?,?)')
          .run(id,sessionStart[1],sha(secret),timestamp,day);
        db.prepare('INSERT INTO launch_daily (launch_id,day,starts,completions,cta) '+
          'VALUES(?,?,1,0,0) ON CONFLICT(launch_id,day) DO UPDATE SET starts=starts+1')
          .run(sessionStart[1],day);
        db.exec('COMMIT');
      }catch(error){db.exec('ROLLBACK');throw error}
      sendJSON(response,201,{
        sessionId:id,sessionToken:secret,expiresAt:timestamp+SESSION_RETENTION_DAYS*DAY,
        events:'opt-in-only',notice:'A consented browser session is not verified as a unique human.'
      });
      return true;
    }
    const action=/^\/api\/v1\/launches\/([a-f0-9]{24})\/sessions\/([a-f0-9]{32})\/(complete|cta)$/.exec(path);
    if(action&&request.method==='POST'){
      live(action[1]);
      const session=sessionAuth(request,action[1],action[2]);
      const kind=action[3];
      if(kind==='cta'&&!session.completed)throw new ApiError(409,'Story completion signal required before CTA');
      const column=kind==='cta'?'cta_recorded':'completed',columnDaily=kind==='cta'?'cta':'completions';
      // Column identifiers are derived exclusively from the two fixed route names.
      let changed,receipt=null;
      db.exec('BEGIN IMMEDIATE');
      try{
        changed=db.prepare('UPDATE launch_sessions SET '+column+'=1 WHERE id=? AND launch_id=? AND '+column+'=0')
          .run(session.id,session.launch_id);
        if(changed.changes){
          if(kind==='cta'){
            receipt=newReceipt();
            db.prepare('UPDATE launch_sessions SET receipt_hash=? WHERE id=?').run(sha(receipt),session.id);
          }
          const dayResult=db.prepare('UPDATE launch_daily SET '+columnDaily+'='+columnDaily+'+1 WHERE launch_id=? AND day=?')
            .run(session.launch_id,session.day);
          if(!dayResult.changes)throw new ApiError(500,'Daily event aggregate was not initialized');
        }
        db.exec('COMMIT');
      }catch(error){db.exec('ROLLBACK');throw error}
      sendJSON(response,200,{
        event:kind==='cta'?'cta_clicked':'story_completed',
        recorded:Boolean(changed.changes),alreadyRecorded:!changed.changes,
        attribution:receipt?{sessionId:session.id,receipt}:null,
        notice:'A recorded technical event, not proof of a unique human or paid customer.'
      });
      return true;
    }
    // These endpoint families belong to this router, including misspellings.
    if(path.startsWith('/api/v1/launches/'))throw new ApiError(404,'Launch API route not found');
    return false;
  }
  return {handle,cleanup,stop:()=>clearInterval(timer),metrics};
}
