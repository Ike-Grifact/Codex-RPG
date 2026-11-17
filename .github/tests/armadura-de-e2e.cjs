const {chromium}=require("playwright");
const assert=require("node:assert/strict");

(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  await page.goto("http://127.0.0.1:8000/prototipo-ficha/",{waitUntil:"load"});
  const id=await page.evaluate(()=>{
   state.attributes.agilidade=1;state.attributes.destreza=0;state.attributes.vigor=0;state.practices.atletismo=0;
   state.items=[normalizeItem({name:"Armadura Leve",type:"armadura",weight:"leve",grade:1,equipped:false,max:7,hp:7})];
   render();save();return state.items[0].id;
  });
  const de=page.locator("#de-text"),label=page.locator("#de-label"),caption=page.locator("#de-caption");
  assert.equal(await de.textContent(),"1");
  await page.locator('#inventory-list [data-action="equip"][data-id="'+id+'"]').evaluate(el=>el.click());
  assert.equal(await de.textContent(),"2","DE total com Armadura Leve equipada");
  assert.equal(await label.textContent(),"DE DEFENSIVA");
  assert.match(await caption.textContent(),/todas as defesas/);
  assert.equal(await page.locator("#armor-integrity-text").textContent(),"7 / 7");
  await page.reload({waitUntil:"load"});
  assert.equal(await de.textContent(),"2","DE geral persiste após recarregar ficha equipada");
  await page.locator('#inventory-list [data-action="equip"][data-id="'+id+'"]').evaluate(el=>el.click());
  assert.equal(await de.textContent(),"1","Desequipar elimina bônus");
  assert.deepEqual(errors,[],"Nenhum erro no navegador");
  console.log("PASS armadura: Leve atualiza DE total de 1 para 2; recarga e retirada no navegador móvel");
 }finally{await browser.close();}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
