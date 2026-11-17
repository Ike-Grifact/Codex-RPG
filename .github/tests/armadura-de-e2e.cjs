const {chromium}=require("playwright");
const assert=require("node:assert/strict");

(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  await page.goto("http://127.0.0.1:8000/prototipo-ficha/",{waitUntil:"load"});
  const imported={schema:"codex-html-playtest-v1",character:{
   schema:"codex-html-playtest-v1",name:"Aprendiz defesa",race:"humano",level:1,
   creationLocked:false,attributes:{agilidade:1,destreza:0,vigor:0},
   practices:{atletismo:0},items:[{
    name:"Armadura Leve",type:"armadura",weight:"leve",grade:1,
    qty:1,equipped:false,max:7,hp:7
   }]
  }};
  await page.locator("#import-json").setInputFiles({
   name:"aprendiz-defesa.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(imported))
  });
  await page.waitForSelector('#inventory-list [data-action="equip"]');
  const de=page.locator("#de-text"),label=page.locator("#de-label"),caption=page.locator("#de-caption");
  assert.equal(await de.textContent(),"1");
  await page.locator('#inventory-list [data-action="equip"]').first().evaluate(el=>el.click());
  assert.equal(await de.textContent(),"2","DE total com Armadura Leve equipada");
  assert.equal(await label.textContent(),"DE DEFENSIVA");
  assert.match(await caption.textContent(),/todas as defesas/);
  assert.equal(await page.locator("#armor-integrity-text").textContent(),"7 / 7");
  await page.reload({waitUntil:"load"});
  assert.equal(await de.textContent(),"2","DE geral persiste após recarregar ficha equipada");
  await page.locator('#inventory-list [data-action="equip"]').first().evaluate(el=>el.click());
  assert.equal(await de.textContent(),"1","Desequipar elimina bônus");
  assert.deepEqual(errors,[],"Nenhum erro no navegador");
  console.log("PASS armadura: DE geral +1 Leve com recarga e retirada no navegador móvel");
 }finally{await browser.close();}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
