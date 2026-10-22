import test from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from '../dead-drop/server.mjs';
import {
  VERSION,GENE_KEYS,OPTIONS,createGenome,mutateGenome,crossbreedGenomes,renderGenome,genomeDistance
} from '../../apps/adbiome/engine.mjs';

const original={
 brand:'Aurora Studio',audience:'Small creative teams',
 genes:{promise:'clarity',proof:'demo',tension:'friction',voice:'direct',action:'explore'}
};
test('five real genes form a stable genome and render evidence-conscious copy in RU/EN/ZH',()=>{
 const genome=createGenome(original);
 assert.equal(genome.kind,'adbiome-genome');
 assert.equal(genome.version,VERSION);
 assert.match(genome.id,/^[a-f0-9]{8}$/);
 assert.equal(Object.keys(genome.genes).length,5);
 for(const language of ['ru','en','zh']){
   const result=renderGenome(genome,language);
   assert.equal(result.language,language);
   assert.ok(result.headline.length>5);
   assert.ok(result.proofInstruction.length>5);
   assert.ok(result.cta.length>3);
   assert.match(result.disclosure,/verify evidence/);
 }
 assert.equal(genome.assertionsVerified,false);
 assert.equal(genome.actualPerformanceMeasured,false);
});
test('mutating exactly one named gene cycles in order while preserving other traits',()=>{
 const base=createGenome(original);
 for(const gene of GENE_KEYS){
   const changed=mutateGenome(base,gene);
   assert.notEqual(changed.id,base.id);
   assert.equal(genomeDistance(base,changed),1);
   assert.equal(changed.lineage.at(-1).type,'mutation');
   assert.equal(changed.lineage.at(-1).gene,gene);
   assert.ok(OPTIONS[gene].includes(changed.genes[gene]));
 }
 assert.throws(()=>mutateGenome(base,'fantasy'),/Invalid gene/);
});
test('crossbreeding selects alternating genes, preserves provenance, rejects unrelated audiences',()=>{
 const base=createGenome(original);
 const left=mutateGenome(base,'promise');
 const right=mutateGenome(base,'proof');
 const hybrid=crossbreedGenomes(left,right);
 assert.equal(hybrid.genes.promise,left.genes.promise);
 assert.equal(hybrid.genes.proof,right.genes.proof);
 assert.equal(genomeDistance(base,hybrid),2);
 assert.equal(hybrid.lineage[0].type,'crossbreed');
 assert.deepEqual(hybrid.lineage[0].parents,[left.id,right.id]);
 assert.throws(()=>crossbreedGenomes(left,createGenome({...original,audience:'Different audience'})),/same brand\/audience/);
});
test('invalid traits and malformed user data are rejected',()=>{
 assert.throws(()=>createGenome({...original,genes:{...original.genes,proof:'invented'}}),/Invalid gene/);
 assert.throws(()=>createGenome({...original,brand:'x'}),/Brand/);
 assert.throws(()=>renderGenome(null),/genome/);
});
test('server delivers AdBiome static app, pure engine and shared styles with CSP',async t=>{
 const app=createApp({dbPath:':memory:'});
 await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));
 t.after(async()=>{await new Promise(resolve=>app.server.close(resolve));app.db.close();});
 const root='http://127.0.0.1:'+app.server.address().port;
 for(const path of ['/apps/adbiome/','/apps/adbiome/app.js','/apps/adbiome/engine.mjs','/apps/shared/studio.css']){
   const response=await fetch(root+path);
   assert.equal(response.status,200,path);
   assert.match(response.headers.get('content-security-policy'),/script-src 'self'/);
 }
 assert.equal((await fetch(root+'/apps/adbiome/private.json')).status,404);
});
