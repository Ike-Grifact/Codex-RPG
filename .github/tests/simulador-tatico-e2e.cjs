/* E2E do Comparador de Combate: sem mapa VTT, com fichas locais e recursos separados. */
const {chromium}=require("playwright");
const assert=(condition,message)=>{if(!condition)throw Error(message);};
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1450,height:950}});
  const errs=[];page.on("pageerror",e=>errs.push(e.stack||e.message));
  await page.addInitScript(()=>{
   const player={
    name:"Aprendiz de teste",kind:"humanoide",level:1,
    attributes:{forca:1,agilidade:1,vigor:1,destreza:1},
    practices:{armas_conjuracao:1},
    skills:["armas-leves"],courage:9,
    items:[{id:"adaga",name:"Adaga",kind:"weapon",category:"leve",die:6,equipped:true}]
   };
   const opponent={
    name:"Saqueador de teste",kind:"humanoide",level:1,pavorLocal:1,
    attributes:{agilidade:1,destreza:1,vigor:1},
    practices:{armas_conjuracao:1},skills:["armas-leves"],
    items:[{id:"simples",name:"Roupas Simples",kind:"armor",category:"muito-leve",
     integrityMax:3,integrity:3,grade:1,equipped:true}]
   };
   localStorage.setItem("codex-rpg-jogadores-index-v1",JSON.stringify({
    version:1,activeId:"j1",sheets:[{id:"j1",name:player.name}]
   }));
   localStorage.setItem("codex-rpg-jogador-ficha-v1:j1",JSON.stringify({
    schema:"codex-jogador-ficha-v1",character:player,wizard:{}
   }));
   localStorage.setItem("codex-rpg-criar-conflito-v1",JSON.stringify({
    version:1,roster:[opponent]
   }));
  });
  await page.goto("http://127.0.0.1:8000/simulador-combate/",{waitUntil:"domcontentloaded"});
  assert(await page.locator("#board").count()===0,"O comparador não deve carregar mapa VTT");
  assert(await page.locator("#available option").count()===2,"Precisamos ler fichas de jogador e do Criar Conflito.");
  await page.locator("#available").selectOption("0");
  await page.locator("#add-ally").click();
  await page.locator("#available").selectOption("1");
  await page.locator("#add-enemy").click();
  assert(await page.locator("#allies .cc-card").count()===1,"Faltou jogador.");
  assert(await page.locator("#enemies .cc-card").count()===1,"Faltou inimigo.");
  assert((await page.locator("#target-info").innerText()).includes("DE 4"),
   "Roupas Simples fornecem +2 DE em qualquer defesa.");
  const before=await page.evaluate(()=>({
   comparison:JSON.parse(localStorage.getItem("codex-rpg-comparador-v1")),
   original:localStorage.getItem("codex-rpg-jogador-ficha-v1:j1")
  }));
  const enemy=before.comparison.combatants.find(x=>x.side==="inimigos");
  await page.locator("#resource-actor").selectOption(enemy.id);
  await page.locator("#resource-kind").selectOption("integridade");
  await page.locator("#resource-amount").fill("1");
  await page.locator("#resource-minus").click();
  let snapshot=await page.evaluate(()=>JSON.parse(localStorage.getItem("codex-rpg-comparador-v1")));
  assert(snapshot.combatants.find(x=>x.id===enemy.id).items[0].integrity===2,
   "Integridade deve diminuir sem alterar a Vida.");
  const life=snapshot.combatants.find(x=>x.id===enemy.id).life;
  assert(life===before.comparison.combatants.find(x=>x.id===enemy.id).life,
   "A Vida não pode mudar quando se registra dano à armadura.");

  await page.evaluate(()=>{Math.random=()=>.7;});
  await page.locator("#difficulty").fill("4");
  await page.locator("#roll").click();
  assert(await page.locator("#dice button.cc-die").count()>=2,"A rolagem deve exibir dados simbólicos.");
  assert((await page.locator("#roll-result").innerText()).includes("Pavor"),
   "O comparador deve mostrar o Pavor antes de confirmar.");
  await page.locator("#confirm").click();
  snapshot=await page.evaluate(()=>JSON.parse(localStorage.getItem("codex-rpg-comparador-v1")));
  const e=snapshot.combatants.find(x=>x.id===enemy.id);
  assert(e.pavorLocal===2,"Pavor não anulado deve passar ao alvo (1 → 2; d10 face 8 sem P, d6 face 5 com 1P).");
  assert(e.items[0].integrity===2,"Confirmar rolagem não deve aplicar dano de armadura automaticamente.");
  assert(snapshot.history[0].kind==="rolagem","Histórico deve registrar a resolução.");
  assert(snapshot.combatants.find(x=>x.side==="jogadores").acted===true,
   "Atacante consome a oportunidade de agir na rodada.");
  const originalAfter=await page.evaluate(()=>localStorage.getItem("codex-rpg-jogador-ficha-v1:j1"));
  assert(originalAfter===before.original,"O comparador não pode alterar a ficha salva no Criador.");
  await page.locator("#next-round").click();
  snapshot=await page.evaluate(()=>JSON.parse(localStorage.getItem("codex-rpg-comparador-v1")));
  assert(snapshot.round===2&&snapshot.combatants.every(x=>!x.acted),
   "Nova rodada deve restaurar oportunidades sem curar Integridade.");
  await page.reload({waitUntil:"domcontentloaded"});
  assert(await page.locator("#allies .cc-card").count()===1&&await page.locator("#enemies .cc-card").count()===1,
   "Confronto deve sobreviver a reload.");
  assert(errs.length===0,"Erros JS no desktop: "+errs.join(" | "));
  console.log("PASS comparador desktop: fichas locais, alvo, DE, Integridade, Pavor, rodada e persistência");

  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const mobileErrors=[];mobile.on("pageerror",e=>mobileErrors.push(e.message));
  await mobile.goto("http://127.0.0.1:8000/simulador-combate/",{waitUntil:"domcontentloaded"});
  await mobile.locator("#demo").click();
  assert(await mobile.locator(".cc-card").count()===4,"Exemplo 2 × 2 deve abrir no celular.");
  const sizes=await mobile.evaluate(()=>({width:document.documentElement.scrollWidth,
   viewport:window.innerWidth,columns:getComputedStyle(document.querySelector(".cc-columns")).gridTemplateColumns}));
  assert(sizes.width<=sizes.viewport+5,"Layout extravasou celular: "+JSON.stringify(sizes));
  assert(!sizes.columns.includes(" "),"As colunas devem empilhar no celular: "+sizes.columns);
  assert(mobileErrors.length===0,"Erros JS mobile: "+mobileErrors.join(" | "));
  console.log("PASS comparador mobile: cards, controles e layout sem VTT");
 }finally{await browser.close();}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
