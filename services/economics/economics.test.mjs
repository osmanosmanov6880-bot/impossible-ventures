import test from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from '../dead-drop/server.mjs';
import {modelCampaignEconomics,toScenarioCSV,ECONOMICS_VERSION,CURRENCIES} from '../../apps/economics/engine.mjs';

const assumptions={
 currency:'EUR',monthlyMediaBudget:1000,cpm:10,ctrPercent:2,
 purchaseConversionPercent:5,averageOrderValue:50,grossMarginPercent:50,monthlyOperatingCost:200
};
test('numeric scenario formula produces exact break-even and cost accounting, not verified revenue',()=>{
 const r=modelCampaignEconomics(assumptions);
 assert.equal(r.kind,'iv-financial-what-if-v1');
 assert.equal(r.version,ECONOMICS_VERSION);
 assert.equal(r.verifiedRevenue,null);
 assert.equal(r.billedCustomers,null);
 assert.equal(r.verifiedOrders,0);
 assert.equal(r.scenarios.length,3);
 const b=r.scenarios[1];
 assert.equal(b.potentialImpressions,100000);
 assert.equal(b.modeledClicks,2000);
 assert.equal(b.modeledOrders,100);
 assert.equal(b.modeledRevenue,5000);
 assert.equal(b.modeledGrossContribution,2500);
 assert.equal(b.plannedMonthlyCost,1200);
 assert.equal(b.modeledNetContribution,1300);
 assert.equal(b.modeledAcquisitionCost,12);
 assert.equal(b.modeledRevenueToMediaSpendRatio,5);
 assert.equal(b.breakEvenOrders,48);
 assert.equal(b.breakEvenPurchaseConversionPercent,2.4);
 assert.equal(b.assumptionsNotVerified,true);
 assert.equal(b.resultsAreNotObserved,true);
 assert.ok(r.scenarios[0].modeledOrders<b.modeledOrders);
 assert.ok(r.scenarios[2].modeledOrders>b.modeledOrders);
});
test('break-even flags impossible scenarios and 0% conversion without invented orders',()=>{
 const r=modelCampaignEconomics({
  ...assumptions,ctrPercent:0.01,purchaseConversionPercent:0,
  averageOrderValue:20,grossMarginPercent:1
 });
 assert.ok(r.warnings.includes('zeroAssumedConversion'));
 assert.ok(r.warnings.includes('breakEvenImpossibleUnderAssumptions'));
 assert.equal(r.scenarios[1].modeledOrders,0);
 assert.equal(r.scenarios[1].modeledAcquisitionCost,null);
 const n=modelCampaignEconomics({...assumptions,ctrPercent:0,grossMarginPercent:0});
 assert.ok(n.warnings.includes('zeroAssumedClicks'));
 assert.ok(n.warnings.includes('zeroGrossMargin'));
 assert.equal(n.scenarios[1].breakEvenOrders,null);
 assert.equal(n.scenarios[1].breakEvenPurchaseConversionPercent,null);
});
test('reject currency, negative budgets, out-of-range percentages and ambiguous non-numeric values',()=>{
 assert.deepEqual(CURRENCIES,['EUR','USD','SEK','CNY']);
 assert.throws(()=>modelCampaignEconomics({...assumptions,currency:'BTC'}),/currency/);
 assert.throws(()=>modelCampaignEconomics({...assumptions,ctrPercent:Infinity}),/ctrPercent/);
 assert.throws(()=>modelCampaignEconomics({...assumptions,cpm:0}),/cpm/);
 assert.throws(()=>modelCampaignEconomics({...assumptions,purchaseConversionPercent:150}),/purchaseConversionPercent/);
 assert.throws(()=>modelCampaignEconomics({...assumptions,monthlyMediaBudget:'1000'}),/monthlyMediaBudget/);
 assert.throws(()=>modelCampaignEconomics(null),/object/);
});
test('safe CSV contains numeric modeled results without formulas, marketing claims or invented payments',()=>{
 const r=modelCampaignEconomics(assumptions);
 const csv=toScenarioCSV(r);
 assert.equal(csv.split('\n').length,5);
 assert.match(csv,/cautious,/);
 assert.match(csv,/base,100000,2000,100,5000,1200,1300,12,5,48/);
 assert.match(csv,/NOT real observed conversions/);
 assert.throws(()=>toScenarioCSV({}),/valid model report/);
});
test('economics website and module load as static CSP-protected source in Node',async t=>{
 const app=createApp({dbPath:':memory:'});
 await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));
 t.after(async()=>{await new Promise(resolve=>app.server.close(resolve));app.db.close();});
 const base='http://127.0.0.1:'+app.server.address().port;
 for(const path of ['/economics/','/economics/app.js','/economics/engine.mjs','/economics/style.css']){
   const response=await fetch(base+path);
   assert.equal(response.status,200,path);
   assert.match(response.headers.get('content-security-policy'),/script-src 'self'/);
 }
 assert.equal((await fetch(base+'/economics/revenue-payments.json')).status,404);
});
