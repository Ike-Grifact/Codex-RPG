const {chromium}=require("playwright");
const assert=(ok,msg)=>{if(!ok)throw Error(msg);};
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1380,height:900}}),errors=[];
  page.on("pageerror",e=>errors.push(e.stack||e.message));
  await page.goto("http://127.0.0.1:8000/criar-conflito/",{waitUntil:"domcontentloaded"});
  await page.locator("#add-human-basic").click();
  assert(await page.locator(".cf-stat-armor").isVisible(),"Resumo de Integridade ausente junto a Vida e DE");
  assert((await page.locator(".cf-stat-armor").innerText()).includes("Sem armadura equipada"),"Estado sem armadura não aparece");
  await page.locator('[data-enemy-skill-open="armas-leves"]').click();
  assert((await page.locator("#cf-gene-inspector").innerText()).includes("Perícia em Armas Leves"),"Detalhes clicáveis não abriram");
  assert((await page.locator("#cf-gene-inspector").innerText()).includes("Disciplina"),"Detalhes não mostram requisitos da Perícia");
  await page.locator('[data-enemy-skill-buy="armas-leves"]').click();
  assert(await page.locator('[data-skill="armas-leves"]').isChecked(),"Compra na aba de detalhes não foi registrada");
  assert((await page.locator(".cf-stat-grid").innerText()).includes("5 / 15"),"Compra não consumiu XP corretamente");
  await page.locator('[data-enemy-skill-view="genetic"]').click();
  const layout=await page.evaluate(()=>({
   viewport:window.innerWidth,
   main:document.querySelector(".cf-main").getBoundingClientRect().width,
   map:document.querySelector("#cf-enemy-gene-map").getBoundingClientRect().width,
   editor:document.querySelector(".cf-editor").getBoundingClientRect().width,
   detailsHidden:document.querySelector("#cf-gene-inspector").hidden,
   detailsLayout:getComputedStyle(document.querySelector(".cf-enemy-skill-layout")).display
  }));
  assert(layout.main>=layout.viewport*.92,"Página de inimigos continua muito estreita: "+JSON.stringify(layout));
  assert(layout.map>=layout.editor*.82,"Mapa não aproveitou a largura do editor: "+JSON.stringify(layout));
  assert(layout.map>650,"Mapa ficou espremido no desktop: "+JSON.stringify(layout));
  assert(layout.detailsLayout==="block"&&layout.detailsHidden===false,
   "Detalhes selecionados devem ficar contextualizados, não em coluna fixa");
  assert(await page.locator("#cf-enemy-gene-map .fp-gene-card").count()===18,"Codex Genético não mostrou as 18 fontes");
  assert(await page.locator("#cf-enemy-gene-map .fp-gene-skill").count()>=100,"Codex Genético não mostrou as Perícias");
  await page.locator('#cf-enemy-gene-map .fp-gene-card[data-gene-id="attr:forca"]').press("Enter");
  assert((await page.locator("#cf-gene-inspector").innerText()).includes("Força"),"Clicar no nó não abre detalhes da fonte");
  await page.locator('[data-enemy-gene-grade="attr"][data-key="forca"][data-delta="1"]').click();
  assert((await page.locator(".cf-stat-grid").innerText()).includes("7 / 15"),"Grau do DNA não usou o mesmo XP da ficha");
  await page.locator('[data-enemy-gene-grade="attr"][data-key="forca"][data-delta="-1"]').click();
  assert((await page.locator(".cf-stat-grid").innerText()).includes("5 / 15"),"Reduzir grau do DNA não restituiu o XP");
  assert(await page.locator("#cf-gene-inspector").isVisible(),"Detalhes da fonte não abriram");
  assert(await page.locator("#cf-gene-inspector").evaluate(node=>getComputedStyle(node).position)==="absolute",
   "Detalhes do DNA devem flutuar sem consumir largura do mapa");
  await page.locator("[data-enemy-inspector-close]").click();
  assert(await page.locator("#cf-gene-inspector").isHidden(),"Não foi possível fechar o painel de detalhes");
  await page.locator('[data-enemy-skill-view="list"]').click();
  assert(await page.locator('[data-skill="armas-leves"]').isChecked(),"A lista perdeu a compra feita antes do mapa");
  await page.locator("#catalog-choose").selectOption({index:0});
  await page.locator("[data-add-catalog]").click();
  const item=await page.locator(".cf-item").first().innerText();
  assert(item.includes("Armadura")||item.includes("Escudo"),"O primeiro item do catálogo não é proteção; ajustar cenário de teste");
  await page.locator(".cf-item [data-equip-item]").first().click();
  assert(!(await page.locator(".cf-stat-armor").innerText()).includes("Sem armadura equipada"),"Equipar armadura não atualizou resumo");
  const before=await page.locator(".cf-stat-armor strong").innerText();
  await page.locator(".cf-stat-armor [data-integrity][data-delta='-1']").click();
  const after=await page.locator(".cf-stat-armor strong").innerText();
  assert(before!==after,"Desgaste de Integridade não sincronizou com resumo");
  await page.reload({waitUntil:"domcontentloaded"});
  assert((await page.locator(".cf-stat-armor strong").innerText())===after,"Integridade não persistiu");
  assert(await page.locator('[data-skill="armas-leves"]').isChecked(),"Compra de Perícia não persistiu");
  assert(!errors.length,"Erros de navegador: "+errors.join(" | "));
  console.log("PASS Desktop: perícias clicáveis, Codex real, XP único e Integridade sincronizada");
  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const problems=[];mobile.on("pageerror",e=>problems.push(e.message));
  await mobile.goto("http://127.0.0.1:8000/criar-conflito/",{waitUntil:"domcontentloaded"});
  await mobile.locator("#add-human-basic").click();
  await mobile.locator('[data-enemy-skill-view="genetic"]').click();
  assert(await mobile.locator("#cf-enemy-gene-map .fp-gene-card").count()===18,"Mapa não apareceu no celular");
  await mobile.locator('#cf-enemy-gene-map .fp-gene-card[data-gene-id="attr:forca"]').press("Enter");
  assert(await mobile.locator("#cf-gene-inspector").isVisible(),"Detalhes da fonte não abriram no celular");
  assert(await mobile.locator("#cf-gene-inspector").evaluate(node=>getComputedStyle(node).position)==="static",
   "No celular os detalhes devem estar abaixo do mapa, não sobre os controles");
  const overflow=await mobile.evaluate(()=>[...document.querySelectorAll("body,.cf-layout,.cf-editor,.cf-enemy-skill-layout")].filter(e=>e.getBoundingClientRect().right>innerWidth+3).map(e=>e.className));
  assert(overflow.length===0,"Codex no celular estourou a largura: "+overflow);
  assert(!problems.length,"Erros no celular: "+problems.join(" | "));
  console.log("PASS Mobile: mapa genético responsivo");
  await mobile.close();
 }finally{await browser.close();}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
