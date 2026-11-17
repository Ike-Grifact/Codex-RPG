const {chromium}=require("playwright");
const assert=require("node:assert/strict");
const URL="http://127.0.0.1:8000/prototipo-ficha/";
const cases=[
 ["humano",[],[]],
 ["lucker_sangue",["attr:vigor","attr:agilidade"],["attr:influencia","practice:apresentacao"]],
 ["lucker_puro",["attr:inteligencia","attr:destreza"],["attr:forca","practice:atletismo"]],
 ["runa_espinhos",["attr:vigor","attr:forca"],["attr:agilidade","attr:destreza"]]
];
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:850}});
  const errors=[];page.on("pageerror",err=>errors.push(err.message));
  await page.goto(URL,{waitUntil:"domcontentloaded"});
  for(let k=0;k<cases.length;k++){
   const [race,discount,elevated]=cases[k];
   if(k)await page.locator("#start-wizard").click();
   if(race!=="humano")await page.locator("[data-race-select]").selectOption(race);
   await page.locator('[data-wizard-field="name"]').fill("Indicador "+race);
   await page.locator('#wizard-controls [data-action="wizard-next"]').click();
   // A tela inicial marca todos os Atributos reduzidos/elevados com seta e contorno.
   for(const [id] of [["forca"],["agilidade"],["destreza"],["inteligencia"],["influencia"],["vigor"]]){
    const card=page.locator('[data-action="wizard-starter-attr"][data-key="'+id+'"]');
    const band=discount.includes("attr:"+id)?"discount":elevated.includes("attr:"+id)?"elevated":"normal";
    assert.equal(await card.evaluate((el,b)=>el.classList.contains("is-xp-"+b),band),"Etapa 2: "+race+"/"+id+" contorno correto");
    const marker=card.locator(".fp-racial-xp-marker");
    assert.equal(await marker.count(),band==="normal"?0:1);
    if(band!=="normal")assert.match(await marker.textContent(),band==="discount"?/↓ XP reduzido/:/↑ XP aumentado/);
   }
   const startKey=discount[0]?.split(":")[1]||"forca";
   await page.locator('[data-action="wizard-starter-attr"][data-key="'+startKey+'"]').click();
   for(const id of ["atletismo","apresentacao"]){
    const card=page.locator('[data-action="wizard-starter-training"][data-group="practice"][data-key="'+id+'"]');
    const expected=elevated.includes("practice:"+id)?"elevated":"normal";
    assert.equal(await card.evaluate((el,b)=>el.classList.contains("is-xp-"+b),expected),race+" prática "+id);
    assert.equal(await card.locator(".fp-racial-xp-marker").count(),expected==="normal"?0:1);
   }
   await page.locator('[data-action="wizard-starter-training"][data-group="practice"][data-key="artesao"]').click();
   await page.locator('#wizard-controls [data-action="wizard-next"]').click();
   assert.equal(await page.locator('#gene-builder-map').isVisible(),true);
   const visible=await page.locator('#gene-builder-map .fp-gene-card[data-racial-xp]').evaluateAll(nodes=>({
    discount:nodes.filter(n=>n.getAttribute("data-racial-xp")==="discount").map(n=>n.getAttribute("data-gene-id")).sort(),
    elevated:nodes.filter(n=>n.getAttribute("data-racial-xp")==="elevated").map(n=>n.getAttribute("data-gene-id")).sort(),
    other:nodes.filter(n=>n.getAttribute("data-racial-xp")==="normal").length
   }));
   assert.deepEqual(visible.discount,discount.slice().sort(),race+" nós XP reduzido");
   assert.deepEqual(visible.elevated,elevated.slice().sort(),race+" nós XP aumentado");
   assert.equal(visible.other,18-discount.length-elevated.length,race+" nós normais");
   for(const [band,names] of [["discount",discount],["elevated",elevated]]){
    for(const id of names){
     const card=page.locator('#gene-builder-map .fp-gene-card[data-gene-id="'+id+'"]');
     assert.equal(await card.locator(".fp-gene-racial-mark").count(),1,id+" precisa de ícone visível");
     assert.match(await card.getAttribute("aria-label"),band==="discount"?/XP reduzido/:/XP aumentado/,id+" precisa de descrição acessível");
     assert.match(await card.locator("title").textContent(),band==="discount"?/XP reduzido/:/XP aumentado/);
     const stroke=await card.locator(".fp-gene-card-fill").evaluate(el=>parseFloat(getComputedStyle(el).strokeWidth));
     assert(stroke>=3.5,id+" precisa de contorno destacado, obtido "+stroke);
    }
   }
   assert.equal(await page.locator(".fp-racial-xp-legend .fp-racial-xp-marker").count(),2,"Mapa apresenta legenda textual");
   const summaryBefore=await page.locator("#wizard-summary").innerText();
   await page.locator('[data-action="wizard-mode"][data-mode="list"]').click();
   for(const group of ["attr","know","practice"]){
    await page.locator('[data-action="wizard-tab"][data-group="'+group+'"]').click();
    const source=await page.locator("#wizard-content .fp-wiz-source").evaluateAll(nodes=>({
     discount:nodes.filter(el=>el.classList.contains("is-xp-discount")).length,
     elevated:nodes.filter(el=>el.classList.contains("is-xp-elevated")).length,
     labels:nodes.filter(el=>el.querySelector(".fp-racial-xp-marker")).length
    }));
    const expectedDiscount=discount.filter(id=>id.startsWith(group+":")).length;
    const expectedElevated=elevated.filter(id=>id.startsWith(group+":")).length;
    assert.deepEqual(source,{discount:expectedDiscount,elevated:expectedElevated,labels:expectedDiscount+expectedElevated},
     race+" modo de listas ("+group+") consistente");
   }
   await page.locator('[data-action="wizard-mode"][data-mode="genetic"]').click();
   assert.equal(await page.locator("#wizard-summary").innerText(),summaryBefore,"Trocar visualização não altera XP");
   await page.reload({waitUntil:"domcontentloaded"});
   assert.equal(await page.locator('#gene-builder-map .fp-gene-card.is-xp-discount').count(),discount.length);
   assert.equal(await page.locator('#gene-builder-map .fp-gene-card.is-xp-elevated').count(),elevated.length);
  }
  await page.setViewportSize({width:390,height:840});
  assert.equal(await page.locator('#gene-builder-map .fp-gene-card.is-xp-elevated').count(),2,"Ícones persistem no celular");
  assert.equal(await page.locator(".fp-racial-xp-legend .fp-racial-xp-marker").count(),2);
  assert.deepEqual(errors,[],"Sem erros JavaScript");
  console.log("PASS: custos raciais visíveis nas quatro origens, mapa, listas, escolha inicial, recarga, celular e XP intacto");
 }finally{await browser.close();}
})().catch(err=>{console.error(err.stack||err);process.exitCode=1;});
