/**
 * Economics Studio — explicit-input financial scenario calculator.
 * Outputs are mathematical "what ifs", not real customer revenue,
 * campaign measurement, promises or investment advice.
 */
export const ECONOMICS_VERSION='iv-economics-v1';
export const CURRENCIES=Object.freeze(['EUR','USD','SEK','CNY']);
export const SCENARIO_FACTORS=Object.freeze({
 cautious:Object.freeze({ctr:0.7,conversion:0.65}),
 base:Object.freeze({ctr:1,conversion:1}),
 stretch:Object.freeze({ctr:1.3,conversion:1.35})
});
const PARAMETERS=Object.freeze({
 monthlyMediaBudget:[1,10_000_000],
 cpm:[0.01,100_000],
 ctrPercent:[0,100],
 purchaseConversionPercent:[0,100],
 averageOrderValue:[0,10_000_000],
 grossMarginPercent:[0,100],
 monthlyOperatingCost:[0,10_000_000]
});
const number=(value,label,minimum,maximum)=>{
 if(typeof value!=='number' || !Number.isFinite(value)||value<minimum||value>maximum)
   throw new RangeError(label+' must be '+minimum+'–'+maximum);
 return value;
};
function validate(input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw new TypeError('Scenario inputs must be an object');
 if(!CURRENCIES.includes(input.currency))throw new RangeError('Invalid currency');
 const result={currency:input.currency};
 for(const [key,[min,max]] of Object.entries(PARAMETERS)){
   result[key]=number(input[key],key,min,max);
 }
 return Object.freeze(result);
}
function round2(value){return Math.round((value+Number.EPSILON)*100)/100;}
function compute(input,factor,name){
 const impressions=input.monthlyMediaBudget/input.cpm*1000;
 const ctr=Math.min(100,input.ctrPercent*factor.ctr);
 const conversion=Math.min(100,input.purchaseConversionPercent*factor.conversion);
 const clicks=impressions*ctr/100;
 const expectedOrders=clicks*conversion/100;
 const forecastRevenue=expectedOrders*input.averageOrderValue;
 const grossContribution=forecastRevenue*input.grossMarginPercent/100;
 const monthlyCost=input.monthlyMediaBudget+input.monthlyOperatingCost;
 const modelContributionAfterCost=grossContribution-monthlyCost;
 const breakEvenOrders=input.averageOrderValue*input.grossMarginPercent>0
   ? monthlyCost/(input.averageOrderValue*input.grossMarginPercent/100):null;
 const breakEvenConversionPct=clicks>0&&breakEvenOrders!==null
   ? breakEvenOrders/clicks*100:null;
 const acquisitionCost=expectedOrders>0?monthlyCost/expectedOrders:null;
 const roas=input.monthlyMediaBudget>0?forecastRevenue/input.monthlyMediaBudget:null;
 return Object.freeze({
  scenario:name,
  assumedCtrPercent:round2(ctr),
  assumedPurchaseConversionPercent:round2(conversion),
  potentialImpressions:Math.round(impressions),
  modeledClicks:round2(clicks),
  modeledOrders:round2(expectedOrders),
  modeledRevenue:round2(forecastRevenue),
  modeledGrossContribution:round2(grossContribution),
  plannedMonthlyCost:round2(monthlyCost),
  modeledNetContribution:round2(modelContributionAfterCost),
  modeledAcquisitionCost:acquisitionCost===null?null:round2(acquisitionCost),
  modeledRevenueToMediaSpendRatio:roas===null?null:round2(roas),
  breakEvenOrders:breakEvenOrders===null?null:round2(breakEvenOrders),
  breakEvenPurchaseConversionPercent:breakEvenConversionPct===null?null:round2(breakEvenConversionPct),
  assumptionsNotVerified:true,
  resultsAreNotObserved:true
 });
}
export function modelCampaignEconomics(source){
 const inputs=validate(source);
 const scenarios=Object.freeze(Object.entries(SCENARIO_FACTORS).map(([name,factor])=>compute(inputs,factor,name)));
 const base=scenarios[1];
 const warnings=[];
 if(inputs.purchaseConversionPercent===0)warnings.push('zeroAssumedConversion');
 if(inputs.grossMarginPercent===0)warnings.push('zeroGrossMargin');
 if(base.breakEvenPurchaseConversionPercent!==null&&base.breakEvenPurchaseConversionPercent>100)warnings.push('breakEvenImpossibleUnderAssumptions');
 if(inputs.ctrPercent===0)warnings.push('zeroAssumedClicks');
 return Object.freeze({
  version:ECONOMICS_VERSION,
  kind:'iv-financial-what-if-v1',
  currency:inputs.currency,
  input:inputs,
  scenarios,
  warnings:Object.freeze(warnings),
  verifiedBookings:0,
  verifiedOrders:0,
  verifiedRevenue:null,
  billedCustomers:null,
  provenance:'user-entered assumptions only; no connected ad platform or payment processor'
 });
}
export function toScenarioCSV(report){
 if(!report||report.kind!=='iv-financial-what-if-v1'||!Array.isArray(report.scenarios))
   throw new TypeError('A valid model report is required');
 const header='scenario,impressions,clicks,orders,assumed_revenue,planned_cost,net_contribution,modeled_cac,modeled_roas,break_even_orders';
 const rows=report.scenarios.map(item=>[
  item.scenario,item.potentialImpressions,item.modeledClicks,item.modeledOrders,
  item.modeledRevenue,item.plannedMonthlyCost,item.modeledNetContribution,
  item.modeledAcquisitionCost??'',item.modeledRevenueToMediaSpendRatio??'',item.breakEvenOrders??''
 ].join(','));
 return [header,...rows,'# Planning assumptions, NOT real observed conversions or collected revenue'].join('\n');
}
