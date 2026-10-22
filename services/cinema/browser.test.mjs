import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
import { createApp } from '../dead-drop/server.mjs';

async function setup(t, {width=1440,height=900,reduce=true}={}){
  const app=createApp({dbPath:':memory:'});
  await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({headless:true});
  const context=await browser.newContext({
    viewport:{width,height},
    reducedMotion:reduce?'reduce':'no-preference'
  });
  t.after(async()=>{
    await context.close();
    await browser.close();
    await new Promise(resolve=>app.server.close(resolve));
    app.db.close();
  });
  return {context,base:'http://127.0.0.1:'+app.server.address().port};
}
function monitor(page){
  const errors=[],remote=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{
    if(message.type()==='error')errors.push(message.text());
  });
  page.on('request',request=>{
    if(!request.url().startsWith('http://127.0.0.1:'))remote.push(request.url());
  });
  return {errors,remote};
}
async function gotoScene(page,id){
  await page.waitForFunction(id=>document.querySelector('#viewport')?.dataset.scene===id,id,{timeout:10_000});
}
async function decide(page,phrase,id){
  const button=page.locator('#choices .choice-button').filter({hasText:phrase}).first();
  await button.click();
  await gotoScene(page,id);
}
async function inspectDetail(page,title){
  const b=page.getByRole('button',{name:'Исследовать: '+title});
  await b.click();
  await page.locator('#discoveryDialog[open]').waitFor();
  await page.locator('#discoveryContinue').click();
  await page.locator('#discoveryDialog:not([open])').waitFor();
}
async function mobileFits(page,label){
  const result=await page.evaluate(()=>({
    width:innerWidth,content:document.documentElement.scrollWidth,
    brokenImages:[...document.images].filter(x=>x.complete&&!x.naturalWidth).map(x=>x.src)
  }));
  assert.ok(result.content<=result.width+2,label+': horizontal overflow '+JSON.stringify(result));
  assert.deepEqual(result.brokenImages,[],label+' visual load failure');
}
test('Three-scene PROTOTYPE: intro, real choices, distinct ending, journal, opt-in local progress and restart',async t=>{
  const {context,base}=await setup(t);
  const page=await context.newPage(),log=monitor(page);
  await page.goto(base+'/cinema/prototype/');
  await gotoScene(page,'s00');
  assert.equal(await page.locator('#qualityMode').inputValue(),'auto');
  assert.equal(await page.locator('body').getAttribute('data-effective-quality'),'lite');
  assert.equal(await page.locator('#soundToggle').getAttribute('aria-pressed'),'false');
  assert.equal(await page.locator('#remember').isChecked(),false);
  assert.equal(await page.locator('#sceneNumber').textContent(),'SCENE 01 / 03');
  assert.equal(await page.locator('#choices .choice-button').count(),2);
  await decide(page,'Перейти к развилке','s03');
  assert.equal(await page.locator('#choices .choice-button').count(),3);
  assert.equal(await page.locator('#sceneNumber').textContent(),'SCENE 02 / 03');
  await decide(page,'Путь истории','s14');
  assert.match(await page.locator('#sceneCaption').textContent(),/истории/);
  assert.equal(await page.locator('#sceneNumber').textContent(),'SCENE 03 / 03');
  await page.locator('#showWorlds').click();
  assert.equal(await page.locator('#worldList a').count(),7);
  assert.equal(await page.locator('#worldList a').first().getAttribute('href'),base+'/apps/dead-drop/');
  mkdirSync('artifacts',{recursive:true});
  await page.screenshot({path:'artifacts/cinema-prototype-desktop.png',fullPage:true});

  await page.locator('#goBack').click();
  await gotoScene(page,'s03');
  await decide(page,'Путь доказательств','s14');
  assert.match(await page.locator('#sceneCaption').textContent(),/доказательства/);

  await page.locator('#remember').check();
  assert.ok((await page.evaluate(()=>Object.keys(localStorage))).some(k=>k.includes('iv-cinema')));
  await page.reload();
  await gotoScene(page,'s14');
  assert.equal(await page.locator('#remember').isChecked(),true);
  await page.locator('#remember').uncheck();
  assert.equal(await page.evaluate(()=>Object.keys(localStorage).filter(x=>x.includes('iv-cinema')).length),0);
  await page.locator('#restart').click();
  await gotoScene(page,'s00');
  assert.equal(await page.locator('#goBack').isDisabled(),true);
  assert.deepEqual(log.remote,[]);
  assert.deepEqual(log.errors,[]);
});
test('15-scene director cut: authentic exploration unlocks the hidden archive, 7 real world links',async t=>{
  const {context,base}=await setup(t,{width:1440,height:900});
  const page=await context.newPage(),log=monitor(page);
  await page.goto(base+'/cinema/');
  await gotoScene(page,'s00');
  await decide(page,'Поймать сигнал','s01');
  await inspectDetail(page,'Маяк');
  assert.match(await page.locator('#discoveriesCount').textContent(),/^1 \/ 3/);
  await decide(page,'Следовать за сигналом','s02');
  await inspectDetail(page,'Тайная запись');
  await decide(page,'Пройти к перекрёстку','s03');
  await decide(page,'Понять человека','s04');
  await inspectDetail(page,'Личный архив');
  assert.match(await page.locator('#discoveriesCount').textContent(),/^3 \/ 3/);
  await decide(page,'Сначала спросить','s07');
  assert.match(await page.locator('#sceneTitle').textContent(),/Алгоритм ничего не решил/);
  await decide(page,'Открыть, что происходит','s08');
  await decide(page,'Выйти из музея','s09');
  await decide(page,'Открыто объяснять','s10');
  await decide(page,'Продолжить без обязательств','s12');
  const secret=page.locator('#choices .choice-button').filter({hasText:'Узнать, что скрывает архив'});
  assert.equal(await secret.isEnabled(),true);
  await decide(page,'Узнать, что скрывает архив','s13');
  await decide(page,'Сохранить смысл','s14');
  assert.equal(await page.locator('#finalCTA').isVisible(),true);
  assert.ok((await page.locator('#filmStill').evaluate(img=>img.naturalWidth))>0);
  await page.locator('#journalToggle').click();
  await page.locator('#archiveDialog[open]').waitFor();
  assert.equal(await page.locator('#fragmentList li').count(),3);
  assert.ok((await page.locator('#archivePath li').count())>=9);
  await page.locator('#archiveCloseAction').click();
  mkdirSync('artifacts',{recursive:true});
  await page.screenshot({path:'artifacts/cinema-finale-desktop.png',fullPage:true});
  await page.locator('#showWorlds').click();
  assert.equal(await page.locator('#worldList a').count(),7);
  assert.equal(await page.locator('#worldList a').nth(6).getAttribute('href'),base+'/apps/attention-republic-live/');
  assert.deepEqual(log.remote,[]);
  assert.deepEqual(log.errors,[]);
});
test('Alternative ethical branch remains real; hidden scene stays locked without discoveries on mobile',async t=>{
  const {context,base}=await setup(t,{width:390,height:844});
  const page=await context.newPage(),log=monitor(page);
  await page.goto(base+'/cinema/');
  await gotoScene(page,'s00');
  await mobileFits(page,'prologue');
  await decide(page,'Сразу к выбору','s03');
  await mobileFits(page,'fork');
  await decide(page,'Проверить идею','s06');
  await decide(page,'Назвать гипотезу доказанным успехом','s07');
  assert.match(await page.locator('#sceneCaption').textContent(),/соблазн заменить факты/);
  await decide(page,'Открыть, что происходит','s08');
  await decide(page,'Выйти из музея','s09');
  await decide(page,'Давить эмоциями','s11');
  assert.match(await page.locator('#sceneTitle').textContent(),/Шум не равен доверию/);
  await decide(page,'Увидеть цену шума','s12');
  assert.equal(await page.locator('#choices .choice-button[disabled]').count(),1);
  await decide(page,'Открыть следующую дверь','s14');
  await mobileFits(page,'finale');
  assert.equal(await page.locator('body').getAttribute('data-effective-quality'),'lite');
  await page.locator('#qualityMode').selectOption('balanced');
  assert.equal(await page.locator('body').getAttribute('data-effective-quality'),'balanced');
  await page.locator('#qualityMode').selectOption('lite');
  await page.locator('#journalToggle').click();
  await page.locator('#archiveDialog[open]').waitFor();
  await page.locator('#closeArchive').click();
  mkdirSync('artifacts',{recursive:true});
  await page.screenshot({path:'artifacts/cinema-branch-mobile-390.png',fullPage:true});
  assert.deepEqual(log.remote,[]);
  assert.deepEqual(log.errors,[]);
});
test('Audio is opt-in; volume and reduced-motion LITE controls remain usable',async t=>{
  const {context,base}=await setup(t,{width:1100,height:780,reduce:true});
  const page=await context.newPage(),log=monitor(page);
  await page.goto(base+'/cinema/');
  await gotoScene(page,'s00');
  assert.equal(await page.locator('#volume').isDisabled(),true);
  assert.equal(await page.locator('body').getAttribute('data-effective-quality'),'lite');
  await page.locator('#qualityMode').selectOption('cinematic');
  assert.equal(await page.locator('body').getAttribute('data-effective-quality'),'cinematic');
  await page.locator('#soundToggle').click();
  const flag=await page.locator('#soundToggle').getAttribute('aria-pressed');
  assert.ok(['true','false'].includes(flag));
  if(flag==='true'){
    assert.equal(await page.locator('#volume').isDisabled(),false);
    await page.locator('#volume').fill('18');
    await page.locator('#soundToggle').click();
    assert.equal(await page.locator('#soundToggle').getAttribute('aria-pressed'),'false');
  }
  assert.match(await page.locator('#sceneCaption').textContent(),/сигнал/);
  assert.deepEqual(log.remote,[]);
  assert.deepEqual(log.errors,[]);
});
