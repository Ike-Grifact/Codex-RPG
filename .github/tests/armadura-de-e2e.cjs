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
   creationLocked:true,attributes:{agilidade:1,destreza:0,vigor:0},
   practices:{atletismo:0},items:[{
    name:"Armadura Leve",type:"armadura",weight:"leve",grade:1,
    qty:1,equipped:false,max:7,hp:7
   }]
  }};
  await page.locator("#import-json").setInputFiles({
   name:"aprendiz-defesa.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(imported))
  });
  await page.waitForSelector('#inventory-list [data-action="equip"]',{state:"attached"});
  const de=page.locator("#de-text"),label=page.locator("#de-label"),caption=page.locator("#de-caption");
  assert.equal(await de.textContent(),"1");
  await page.locator('#inventory-list [data-action="equip"]').first().evaluate(el=>el.click());
  assert.equal(await de.textContent(),"2","DE total com Armadura Leve equipada");
  assert.equal(await label.textContent(),"DE DEFENSIVA");
  assert.match(await caption.textContent(),/Natural 1 · armadura \+1/,"O cartão mostra só o resumo");
  assert.equal(await page.locator(".fp-vitals").evaluate(el=>getComputedStyle(el).display),"flex","Indicadores compactos");
  assert.equal(await caption.isVisible(),false,"Subtexto deixa de ocupar espaço visual");
  await page.locator('[data-vital-open="defense"]').click();
  const tooltip=page.locator("#fp-vital-tooltip");
  assert.equal(await tooltip.isVisible(),true,"O detalhe deve abrir ao toque");
  assert.match(await tooltip.textContent(),/todas as defesas/,"A explicação detalhada fica no tooltip");
  assert.match(await tooltip.textContent(),/Total = 2/,"O tooltip usa a defesa calculada e não um exemplo fixo");
  await page.keyboard.press("Escape");
  assert.equal(await tooltip.isVisible(),false,"Escape fecha a explicação");
  await page.setViewportSize({width:1200,height:900});
  const desktop=await page.evaluate(()=>{
   const pos=id=>document.querySelector(id).getBoundingClientRect();
   const apt=pos("#source-grid"),roll=pos("#composer-panel"),skills=pos("#play-talents");
   return{aptRight:apt.right,rollLeft:roll.left,skillsRight:skills.right,skillsVisible:skills.width>0};
  });
  assert.ok(desktop.rollLeft>=desktop.aptRight-3,"Rolador deve estar à direita das aptidões no desktop");
  assert.ok(desktop.skillsVisible&&desktop.rollLeft>=desktop.skillsRight-3,"Rolador deve ficar à direita das perícias adquiridas");
  await page.setViewportSize({width:390,height:844});
  const mobile=await page.evaluate(()=>{
   const apt=document.querySelector("#source-grid").getBoundingClientRect();
   const roll=document.querySelector("#composer-panel").getBoundingClientRect();
   const skills=document.querySelector("#play-talents").getBoundingClientRect();
   return{aptBottom:apt.bottom,rollTop:roll.top,rollBottom:roll.bottom,skillsTop:skills.top};
  });
  assert.ok(mobile.rollTop>=mobile.aptBottom-3,"No celular, rolador deve aparecer após as aptidões");
  assert.ok(mobile.skillsTop>=mobile.rollBottom-3,"No celular, repertório aparece depois do rolador");
  const indicators=await page.locator(".fp-vitals").evaluate(bar=>{
   const items=Array.from(bar.querySelectorAll(".fp-vital"));
   return{
    groups:[...bar.children].filter(el=>el.classList.contains("fp-vitals-primary")||el.classList.contains("fp-vitals-secondary")).map(el=>el.children.length),
    ids:items.filter(x=>x.querySelector("[data-vital-open]")).map(x=>x.querySelector("[data-vital-open]").dataset.vitalOpen),
    primaryIcon:parseFloat(getComputedStyle(items[0].querySelector(".fp-vital-label")).width),
    secondaryIcon:parseFloat(getComputedStyle(items[4].querySelector(".fp-vital-label")).width),
    hasLoadCard:!!bar.querySelector('[data-vital-open="load"]'),
    inventoryIsButton:items[6].tagName==="BUTTON"
   };
  });
  assert.deepEqual(indicators.groups,[4,3],"Quatro indicadores principais e três secundários");
  assert.deepEqual(indicators.ids,["life","integrity","defense","movement","courage","balance"]);
  assert.ok(indicators.primaryIcon>indicators.secondaryIcon,"Ícones de Vida, Integridade, DE e Movimento maiores");
  assert.equal(indicators.hasLoadCard,false,"Capacidade sai da barra superior");
  assert.ok(indicators.inventoryIsButton,"Inventário é um atalho real");
  await page.locator(".fp-vital-inventory").click();
  assert.equal(await page.locator('button[data-sheet-page="inventory"]').first().getAttribute("aria-current"),"page","O atalho abriu a aba Inventário");
  assert.equal(await page.locator("#equipamentos").isVisible(),true,"O inventário mostra equipamentos e carga");
  await page.locator('button[data-sheet-page="play"]').first().click();
  assert.equal(await page.locator(".fp-vital-inventory").isVisible(),true,"Indicadores continuam acessíveis após voltar a Jogar");

  assert.equal(await page.locator("#armor-integrity-text").textContent(),"7 / 7");
  await page.reload({waitUntil:"load"});
  assert.equal(await de.textContent(),"2","DE geral persiste após recarregar ficha equipada");
  await page.locator('#inventory-list [data-action="equip"]').first().evaluate(el=>el.click());
  assert.equal(await de.textContent(),"1","Desequipar elimina bônus");
  assert.deepEqual(errors,[],"Nenhum erro no navegador");
  console.log("PASS armadura: DE geral +1 Leve com recarga e retirada no navegador móvel");
 }finally{await browser.close();}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
