const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8000/pericias/ficha-criatura-pequena.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.getElementById('small-balance')?.textContent.includes('Gastos:'));
  assert.match(await page.locator('#small-balance').innerText(),/Gastos: 0 XP/);
  await page.locator('select[data-attr="forca"]').selectOption('2'); // 6 XP
  await page.locator('select[data-attr="vigor"]').selectOption('1'); // 2 XP
  await page.locator('select[data-attr="agilidade"]').selectOption('2'); // 3 XP
  assert.match(await page.locator('#small-balance').innerText(),/Gastos: 11 XP · Saldo: 9 XP · Vida própria: 1/);
  await page.locator('select[data-attr="forca"]').selectOption('6');
  assert.equal(await page.locator('select[data-attr="forca"]').inputValue(),'2');
  assert.match(await page.locator('#small-status').innerText(),/Sem XP/);
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.getElementById('small-balance')?.textContent.includes('Gastos:'));
  assert.equal(await page.locator('select[data-attr="vigor"]').inputValue(),'1');
  assert.match(await page.locator('#small-balance').innerText(),/Gastos: 11 XP/);
  assert.deepEqual(errors,[]);
  console.log('Ficha Pequena: XP, custo dobrado, 1 Vida, bloqueio de gastos, salvamento e viewport móvel OK');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
