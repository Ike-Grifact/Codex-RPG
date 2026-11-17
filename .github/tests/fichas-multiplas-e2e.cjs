const {chromium}=require("playwright");
const assert=require("node:assert/strict");
const URL="http://127.0.0.1:8000/prototipo-ficha/";
const INDEX="codex-rpg-jogadores-index-v1";
const PREFIX="codex-rpg-jogador-ficha-v1:";
const LEGACY="codex-html-ficha-prototipo-v1";

(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const context=await browser.newContext({viewport:{width:1100,height:850}});
  const page=await context.newPage(),errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  await page.goto(URL,{waitUntil:"domcontentloaded"});
  const selector=page.locator("#player-sheet-select");
  assert.equal(await page.locator("#player-sheets").isVisible(),true);
  assert.equal(await selector.locator("option").count(),1,"uma ficha inicial");
  const firstId=await selector.inputValue();
  await page.locator('[data-wizard-field="name"]').fill("Herói Humano");
  await page.locator('#wizard-controls [data-action="wizard-next"]').click();
  await page.locator('[data-action="wizard-starter-attr"][data-key="forca"]').click();
  await page.locator('[data-action="wizard-starter-training"][data-group="practice"][data-key="atletismo"]').click();
  await page.locator('#wizard-controls [data-action="wizard-next"]').click();
  assert.match(await page.locator("#wizard-summary").innerText(),/15 XP/);
  await page.locator("#start-wizard").click();
  assert.equal(await selector.locator("option").count(),2);
  const secondId=await selector.inputValue();
  assert.notEqual(firstId,secondId);
  assert.equal(await page.locator('[data-wizard-field="name"]').inputValue(),"");
  assert.match(await page.locator("#wizard-summary").innerText(),/18 XP/);
  await page.locator('[data-race-select]').selectOption("lucker_sangue");
  await page.locator('[data-wizard-field="name"]').fill("Lucker de Teste");
  await page.locator('#wizard-controls [data-action="wizard-next"]').click();
  await page.locator('[data-action="wizard-starter-attr"][data-key="influencia"]').click();
  await page.locator('[data-action="wizard-starter-training"][data-group="practice"][data-key="apresentacao"]').click();
  await page.locator('#wizard-controls [data-action="wizard-next"]').click();
  const luckerSpent=await page.locator("#wizard-summary").innerText();
  assert.match(luckerSpent,/13 XP/,"orçamento racial de Influência e Apresentação elevadas");
  await selector.selectOption(firstId);
  assert.equal(await page.locator('[data-wizard-field="name"]').count(),0,"o rascunho humano restaura a etapa 3");
  assert.match(await page.locator("#wizard-summary").innerText(),/15 XP/);
  assert.match(await selector.locator('option:checked').innerText(),/Herói Humano.*Humano/);
  await page.reload({waitUntil:"domcontentloaded"});
  assert.equal(await selector.inputValue(),firstId,"recarregar mantém a ficha ativa");
  assert.equal(await selector.locator("option").count(),2);
  await selector.selectOption(secondId);
  assert.match(await selector.locator('option:checked').innerText(),/Lucker de Teste.*Lucker de Sangue/);
  assert.match(await page.locator("#wizard-summary").innerText(),/13 XP/);
  await page.locator("#player-sheet-duplicate").click();
  assert.equal(await selector.locator("option").count(),3);
  assert.match(await selector.locator('option:checked').innerText(),/Lucker de Teste \(cópia\)/);
  const duplicateId=await selector.inputValue();
  assert.notEqual(duplicateId,secondId);
  await selector.selectOption(firstId);
  assert.match(await page.locator("#wizard-summary").innerText(),/15 XP/,"duplicar não altera o original");

  const imported={schema:"codex-html-playtest-v1",character:{
   schema:"codex-html-playtest-v1",name:"Runa importada",race:"runa_espinhos",
   runeElements:["fogo","terra"],creationLocked:false,attributes:{vigor:1},practices:{atletismo:1}
  }};
  await page.locator("#import-json").setInputFiles({
   name:"runa.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(imported))
  });
  assert.equal(await selector.locator("option").count(),4,"importação deve adicionar e não substituir");
  assert.match(await selector.locator('option:checked').innerText(),/Runa importada.*Runa Espinhos/);
  const importedId=await selector.inputValue();
  await page.reload({waitUntil:"domcontentloaded"});
  assert.equal(await selector.inputValue(),importedId);
  assert.equal(await selector.locator("option").count(),4);
  assert.equal(await page.locator('[data-race-select]').inputValue(),"runa_espinhos");
  const saved=await page.evaluate(({index,prefix})=>{
   const directory=JSON.parse(localStorage.getItem(index));
   return directory.sheets.map(x=>({id:x.id,name:x.name,character:JSON.parse(localStorage.getItem(prefix+x.id))?.character}));
  },{index:INDEX,prefix:PREFIX});
  assert.equal(saved.length,4);
  assert.equal(saved.find(x=>x.id===firstId).character.race,"humano");
  assert.equal(saved.find(x=>x.id===secondId).character.race,"lucker_sangue");
  assert.equal(saved.find(x=>x.id===importedId).character.race,"runa_espinhos");
  assert.equal(saved.find(x=>x.id===secondId).character.attributes.influencia,1);
  assert.equal(saved.find(x=>x.id===firstId).character.attributes.forca,1);
  page.once("dialog",dialog=>dialog.accept());
  await page.locator("#player-sheet-delete").click();
  assert.equal(await selector.locator("option").count(),3);
  assert.notEqual(await selector.inputValue(),importedId);
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),PREFIX+importedId),null);
  await selector.selectOption(firstId);
  assert.match(await selector.locator('option:checked').innerText(),/Herói Humano/);
  assert.deepEqual(errors,[],"erros no console do navegador");
  console.log("PASS jogadores: 4 raças/slots, compras independentes, duplicação, troca, recarga, importação e exclusão");

  const legacy=await browser.newContext();
  await legacy.addInitScript(({key,index})=>{
   if(!localStorage.getItem(index)&&!localStorage.getItem(key)){
    localStorage.setItem(key,JSON.stringify({
     schema:"codex-html-playtest-v1",name:"Ficha histórica",race:"humano",
     attributes:{forca:1},practices:{atletismo:1},creationLocked:false
    }));
   }
  },{key:LEGACY,index:INDEX});
  const previous=await legacy.newPage();
  await previous.goto(URL,{waitUntil:"domcontentloaded"});
  assert.equal(await previous.locator("#player-sheet-select option").count(),1);
  assert.equal(await previous.locator('[data-wizard-field="name"]').inputValue(),"Ficha histórica");
  assert.ok(await previous.evaluate(key=>localStorage.getItem(key),LEGACY),"backup legado deve permanecer");
  await previous.locator("#start-wizard").click();
  const oldId=await previous.evaluate(index=>JSON.parse(localStorage.getItem(index)).sheets.find(x=>x.name==="Ficha histórica").id,INDEX);
  await previous.locator("#player-sheet-select").selectOption(oldId);
  // A seleção por texto deve retornar ao personagem migrado.
  assert.equal(await previous.locator('[data-wizard-field="name"]').inputValue(),"Ficha histórica");
  console.log("PASS migração da ficha histórica sem exclusão da chave original");
  const npc=await legacy.newPage();
  await npc.goto(URL+"?npc=1",{waitUntil:"domcontentloaded"});
  assert.equal(await npc.locator("#player-sheets").isHidden(),true,"NPC tem armazenamento separado");
  await legacy.close();
  await context.close();
 }finally{await browser.close();}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
