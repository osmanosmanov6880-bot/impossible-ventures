import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

const makeId = () => randomBytes(12).toString('hex');
const makeToken = () => 'ivp_' + randomBytes(32).toString('base64url');
const hash = value => createHash('sha256').update(value).digest('hex');
const CURRENCIES = ['USD','EUR'];
export const PROPOSAL_RETENTION_DAYS = 180;
const RETENTION_MS = PROPOSAL_RETENTION_DAYS * 86_400_000;
const STATUS = ['draft','sent','accepted','declined','cancelled'];

function textField(v,label,Err,{min=2,max=220}={}){
  if(typeof v!=='string')throw new Err(400,label+' is required');
  const clean=v.trim().replace(/\s+/g,' ');
  if(clean.length<min||clean.length>max||/[\u0000-\u001f\u007f-\u009f\u202a-\u202e]/.test(clean)){
    throw new Err(400,'Invalid '+label);
  }
  return clean;
}
function emailField(v,Err){
  if(typeof v!=='string'||v.length>160)throw new Err(400,'Valid contact email required');
  const e=v.trim().toLowerCase();
  if(!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(e))throw new Err(400,'Valid contact email required');
  return e;
}
function cents(value,label,Err){
  if(!Number.isSafeInteger(value)||value<0||value>500_000_000)throw new Err(400,'Invalid '+label+' in integer cents');
  return value;
}
function parseMoney(body,Err){
  const setupCents=cents(body.setupCents,'setupCents',Err);
  const monthlyCents=cents(body.monthlyCents,'monthlyCents',Err);
  const months=body.months;
  if(!Number.isInteger(months)||months<1||months>24)throw new Err(400,'Months must be 1–24');
  const currency=body.currency;
  if(!CURRENCIES.includes(currency))throw new Err(400,'Currency must be USD or EUR');
  const totalCents=setupCents+monthlyCents*months;
  if(!Number.isSafeInteger(totalCents))throw new Err(400,'Monetary total too large');
  return {setupCents,monthlyCents,months,currency,totalCents};
}
function publicRow(row){
  return {
    id:row.id,campaignId:row.campaign_id,
    clientName:row.client_name,description:row.description,
    currency:row.currency,setupCents:row.setup_cents,
    monthlyCents:row.monthly_cents,months:row.months,totalCents:row.total_cents,
    status:row.status,createdAt:row.created_at,updatedAt:row.updated_at,decidedAt:row.decided_at,
    statement:'This is a proposal, not an invoice, legal e-signature, booked revenue or verified payment.'
  };
}
function operatorRow(row){
  return {...publicRow(row),workspaceId:row.workspace_id,contactEmail:row.contact_email,revision:row.revision};
}
function bearer(request){
  const h=request.headers.authorization;
  if(typeof h!=='string'||h.length>256||!h.startsWith('Bearer '))return '';
  return h.slice(7);
}
function matches(value,stored){
  if(typeof value!=='string'||!/^ivp_[A-Za-z0-9_-]{43}$/.test(value)||!stored)return false;
  const actual=Buffer.from(hash(value),'hex');
  const expected=Buffer.from(stored,'hex');
  return actual.length===expected.length&&timingSafeEqual(actual,expected);
}

export function createProposals({db,now=Date.now,workspaces,campaigns,ApiError,jsonBody,sendJSON}){
  db.exec(
    'CREATE TABLE IF NOT EXISTS commercial_proposals ('+
    'id TEXT PRIMARY KEY, workspace_id TEXT NOT NULL, campaign_id TEXT NOT NULL, '+
    'client_name TEXT NOT NULL, contact_email TEXT NOT NULL, description TEXT NOT NULL, '+
    'currency TEXT NOT NULL, setup_cents INTEGER NOT NULL, monthly_cents INTEGER NOT NULL, '+
    'months INTEGER NOT NULL, total_cents INTEGER NOT NULL, status TEXT NOT NULL, '+
    'revision INTEGER NOT NULL, accept_token_hash TEXT, created_at INTEGER NOT NULL, '+
    'updated_at INTEGER NOT NULL, decided_at INTEGER);'+
    'CREATE INDEX IF NOT EXISTS commercial_proposals_ws ON commercial_proposals(workspace_id,created_at);'
  );
  function cleanup(){
    db.prepare('DELETE FROM commercial_proposals WHERE created_at < ?').run(now() - RETENTION_MS);
  }
  cleanup();
  const purgeTimer=setInterval(cleanup,3_600_000);
  purgeTimer.unref();
  function find(workspace,id){
    const row=db.prepare('SELECT * FROM commercial_proposals WHERE workspace_id = ? AND id = ?').get(workspace,id);
    if(!row)throw new ApiError(404,'Proposal not found');
    return row;
  }
  function authenticatedPublic(request,id){
    const row=db.prepare('SELECT * FROM commercial_proposals WHERE id = ?').get(id);
    if(!row || row.status==='draft')throw new ApiError(404,'Proposal not available');
    const secret=bearer(request);
    if(!secret)throw new ApiError(401,'Proposal access token required');
    if(!matches(secret,row.accept_token_hash))throw new ApiError(403,'Invalid proposal access token');
    return row;
  }
  function summarize(ws){
    const rows=db.prepare(
      'SELECT status,currency,COUNT(*) AS count,SUM(total_cents) AS nominal FROM commercial_proposals '+
      'WHERE workspace_id=? GROUP BY status,currency'
    ).all(ws);
    const byCurrency={USD:{},EUR:{}},count={draft:0,sent:0,accepted:0,declined:0,cancelled:0};
    for(const x of rows){
      if(!Object.hasOwn(byCurrency,x.currency)||!Object.hasOwn(count,x.status))continue;
      byCurrency[x.currency][x.status]={count:Number(x.count),nominalCents:Number(x.nominal)};
      count[x.status]+=Number(x.count);
    }
    return {
      count,byCurrency,
      paymentTracking:'not_integrated',
      warning:'Draft, sent and accepted amounts are potential contract values, not recognized or verified collected revenue.'
    };
  }
  async function handle(request,response,path){
    cleanup();
    const collection=/^\/api\/v1\/workspaces\/([a-f0-9]{24})\/proposals$/.exec(path);
    if(collection&&request.method==='GET'){
      workspaces.requireRole(request,collection[1]);
      const rows=db.prepare('SELECT * FROM commercial_proposals WHERE workspace_id=? ORDER BY created_at DESC,id DESC LIMIT 100').all(collection[1]);
      sendJSON(response,200,{items:rows.map(operatorRow),summary:summarize(collection[1])});
      return true;
    }
    if(collection&&request.method==='POST'){
      const actor=workspaces.requireRole(request,collection[1],['owner','editor']);
      const body=await jsonBody(request);
      const campaignId=body.campaignId;
      if(typeof campaignId!=='string'||!/^[a-f0-9]{24}$/.test(campaignId))throw new ApiError(400,'Valid campaign ID required');
      campaigns.find(collection[1],campaignId);
      const clientName=textField(body.clientName,'client name',ApiError,{max:120});
      const contactEmail=emailField(body.contactEmail,ApiError);
      const description=textField(body.description,'service description',ApiError,{min:10,max:650});
      const money=parseMoney(body,ApiError);
      const id=makeId(),timestamp=now();
      db.prepare(
        'INSERT INTO commercial_proposals ('+
        'id,workspace_id,campaign_id,client_name,contact_email,description,currency,setup_cents,monthly_cents,months,total_cents,'+
        'status,revision,accept_token_hash,created_at,updated_at,decided_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
      ).run(id,collection[1],campaignId,clientName,contactEmail,description,money.currency,
        money.setupCents,money.monthlyCents,money.months,money.totalCents,'draft',1,null,timestamp,timestamp,null);
      workspaces.audit(collection[1],'proposal.created',actor.token.id,id);
      sendJSON(response,201,{proposal:operatorRow(find(collection[1],id))});
      return true;
    }
    const single=/^\/api\/v1\/workspaces\/([a-f0-9]{24})\/proposals\/([a-f0-9]{24})$/.exec(path);
    if(single&&request.method==='GET'){
      workspaces.requireRole(request,single[1]);
      sendJSON(response,200,{proposal:operatorRow(find(single[1],single[2]))});
      return true;
    }
    if(single&&request.method==='PATCH'){
      const actor=workspaces.requireRole(request,single[1],['owner','editor']);
      const input=await jsonBody(request);
      const current=find(single[1],single[2]);
      if(current.status!=='draft')throw new ApiError(409,'Only proposal drafts can be revised');
      if(!Number.isInteger(input.expectedRevision)||input.expectedRevision<1)throw new ApiError(400,'Expected revision required');
      const value={
        clientName:textField(input.clientName??current.client_name,'client name',ApiError,{max:120}),
        contactEmail:emailField(input.contactEmail??current.contact_email,ApiError),
        description:textField(input.description??current.description,'service description',ApiError,{min:10,max:650}),
        ...parseMoney({
          setupCents:input.setupCents??current.setup_cents,monthlyCents:input.monthlyCents??current.monthly_cents,
          months:input.months??current.months,currency:input.currency??current.currency
        },ApiError)
      };
      const changed=db.prepare(
        'UPDATE commercial_proposals SET client_name=?,contact_email=?,description=?,currency=?,setup_cents=?,monthly_cents=?,'+
        'months=?,total_cents=?,revision=revision+1,updated_at=? WHERE workspace_id=? AND id=? AND status=? AND revision=?'
      ).run(value.clientName,value.contactEmail,value.description,value.currency,
        value.setupCents,value.monthlyCents,value.months,value.totalCents,now(),single[1],single[2],'draft',input.expectedRevision);
      if(!changed.changes)throw new ApiError(409,'Proposal has changed; reload before saving');
      workspaces.audit(single[1],'proposal.revised',actor.token.id,single[2]);
      sendJSON(response,200,{proposal:operatorRow(find(single[1],single[2]))});
      return true;
    }
    const action=/^\/api\/v1\/workspaces\/([a-f0-9]{24})\/proposals\/([a-f0-9]{24})\/(send|reissue|cancel)$/.exec(path);
    if(action&&request.method==='POST'){
      const actor=workspaces.requireRole(request,action[1],['owner']);
      const current=find(action[1],action[2]);
      const kind=action[3];
      if(kind==='send'&&current.status!=='draft')throw new ApiError(409,'Only a draft can be sent');
      if(kind==='reissue'&&current.status!=='sent')throw new ApiError(409,'Only sent proposal links may be rotated');
      if(kind==='cancel'&&current.status!=='sent')throw new ApiError(409,'Only a sent proposal may be cancelled');
      if(kind==='cancel'){
        db.prepare('UPDATE commercial_proposals SET status=?,updated_at=?,revision=revision+1 WHERE id=? AND workspace_id=? AND status=?')
          .run('cancelled',now(),current.id,current.workspace_id,'sent');
        workspaces.audit(action[1],'proposal.cancelled',actor.token.id,action[2]);
        sendJSON(response,200,{proposal:operatorRow(find(action[1],action[2]))});
        return true;
      }
      const secret=makeToken();
      const next=kind==='send'?'sent':'sent';
      const updated=db.prepare(
        'UPDATE commercial_proposals SET status=?,accept_token_hash=?,updated_at=?,revision=revision+1 '+
        'WHERE id=? AND workspace_id=? AND status=?'
      ).run(next,hash(secret),now(),current.id,current.workspace_id,current.status);
      if(!updated.changes)throw new ApiError(409,'Concurrent proposal update');
      workspaces.audit(action[1],kind==='send'?'proposal.sent':'proposal.link_rotated',actor.token.id,action[2]);
      sendJSON(response,200,{
        proposal:operatorRow(find(action[1],action[2])),
        secureShareFragment:'/proposal/?id='+action[2]+'#token='+secret,
        warning:'Copy the private link securely. The app does not send email, charge money or create an enforceable e-signature.'
      });
      return true;
    }
    const publicRoute=/^\/api\/v1\/proposals\/([a-f0-9]{24})$/.exec(path);
    if(publicRoute&&request.method==='GET'){
      const row=authenticatedPublic(request,publicRoute[1]);
      sendJSON(response,200,{proposal:publicRow(row)});
      return true;
    }
    const decision=/^\/api\/v1\/proposals\/([a-f0-9]{24})\/decision$/.exec(path);
    if(decision&&request.method==='POST'){
      const row=authenticatedPublic(request,decision[1]);
      const body=await jsonBody(request);
      if(!['accepted','declined'].includes(body.decision))throw new ApiError(400,'Decision must be accepted or declined');
      if(row.status!=='sent')throw new ApiError(409,'Proposal already decided or cancelled');
      const result=db.prepare(
        'UPDATE commercial_proposals SET status=?,updated_at=?,decided_at=?,revision=revision+1 '+
        'WHERE id=? AND status=?'
      ).run(body.decision,now(),now(),row.id,'sent');
      if(!result.changes)throw new ApiError(409,'Concurrent proposal decision');
      workspaces.audit(row.workspace_id,'proposal.'+body.decision,null,row.id);
      sendJSON(response,200,{
        recorded:true,status:body.decision,
        note:'A decision made by possession of a private link, not a legal identity signature, invoice or payment.'
      });
      return true;
    }
    if(path.startsWith('/api/v1/proposals/'))throw new ApiError(404,'Proposal API route not found');
    return false;
  }
  return {handle,summarize,stop:()=>clearInterval(purgeTimer),cleanup};
}
