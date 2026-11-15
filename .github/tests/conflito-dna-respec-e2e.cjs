const { chromium } = require("playwright");
const assert=(yes,msg)=>{if(!yes)throw Error(msg);};
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1366,height:900}});
  const errors=[];page.on("pageerror",e=>errors.push(e.stack||e.message));
  await page.goto("http://127.0.0.1:8000/prototipo-ficha/",{waitUntil:"domcontentloaded"});
  await page.evaluate(()=>localStorage.setItem("codex-html-ficha-prototipo-v1",JSON.stringify({preservarJogador:"NUNCA_SUBSTITUIR"})));
  await page.goto("http://127.0.0.1:8000/criar-conflito/",{waitUntil:"domcontentloaded"});
  assert(await page.locator("#add-human-quick").isEnabled(),"Botão DNA continua desabilitado");
  await page.locator("#add-human-quick").click();
  await page.waitForURL("**/prototipo-ficha/?npc=1");
  assert(await page.locator("#send-to-conflito").isVisible(),"Falta comando de enviar NPC");
  await page.locator('input[data-wizard-field="name"]').fill("NPC Teste DNA");
  await page.locator('#wizard-controls [data-action="wizard-next"]').click();
  await page.locator('[data-action="wizard-starter-attr"][data-key="forca"]').click();
  await page.locator('[data-action="wizard-starter-training"][data-group="practice"][data-key="atletismo"]').click();
  await page.locator('#wizard-controls [data-action="wizard-next"]').click();
  await page.locator('#wizard-content [data-action="wizard-mode"][data-mode="genetic"]').click();
  assert(await page.locator("#gene-builder-map .fp-gene-card").count()===18,"O mapa DNA verdadeiro não apareceu");
  await page.locator('#gene-builder-map .fp-gene-skill.is-potential[data-gene-id="montar"]').press("Enter");
  page.once("dialog",d=>void d.accept());
  await page.locator('#gene-builder-detail [data-action="gene-auto-buy"][data-id="montar"]').click();
  await page.locator('#gene-builder-detail [data-action="gene-close-detail"]').click();
  const npcState=await page.evaluate(()=>JSON.parse(localStorage.getItem("codex-html-ficha-npc-dna-v1")));
  assert(npcState?.attributes?.forca===1&&npcState?.practices?.atletismo===1&&npcState?.attributes?.influencia===2&&npcState?.skills?.includes("montar"),
   "A ficha NPC não armazenou as compras mínimas do DNA");
  page.once("dialog",d=>void d.accept());
  await page.locator("#send-to-conflito").click();
  await page.waitForURL("**/criar-conflito/");
  await page.waitForSelector("#editor");
  assert((await page.locator("#editor").innerText()).includes("NPC Teste DNA"),
   "NPC não chegou ao Criar Conflito");
  const transferred=await page.evaluate(()=>({
   main:JSON.parse(localStorage.getItem("codex-html-ficha-prototipo-v1")),
   npc:JSON.parse(localStorage.getItem("codex-html-ficha-npc-dna-v1")),
   conflict:JSON.parse(localStorage.getItem("codex-rpg-criar-conflito-v1"))
  }));
  assert(transferred.main.preservarJogador==="NUNCA_SUBSTITUIR","O personagem do jogador foi sobrescrito");
  assert(transferred.npc.attributes.forca===1,"O NPC não permaneceu salvo separadamente");
  assert(transferred.conflict.roster.some(t=>t.name==="NPC Teste DNA"&&
    t.attributes.forca===1&&t.practices.atletismo===1&&t.attributes.influencia===2&&t.skills.includes("montar")&&t.xp===0),
   "A conversão de graus e XP para o Conflito está incorreta");
  await page.locator('[data-conflict-mode="roll"]').click();
  assert(await page.locator(".cf-roll-layout").count()===1,"Fontes e rolador não estão lado a lado");
  assert(await page.locator(".cf-roll-sources .cf-source-card svg").count()>=18,
   "O modo Rolagem precisa exibir os SVGs dos dados de todas as fontes");
  await page.locator('[data-action-tab="skills"]').click();
  assert(await page.locator('[data-conflict-action="skill"][data-action-skill="montar"]').count()===1,
   "A Perícia comprada não está disponível no rolador de Conflito");
  await page.locator('[data-conflict-action="skill"][data-action-skill="montar"]').click();
  assert((await page.locator(".cf-action-shortcuts").innerText()).includes("Montar Animal"),
   "A Perícia não foi declarada na ação");
  await page.locator("[data-roll-start]").click();
  assert(await page.locator(".cf-roll-die").count()===2,"Rolagem do NPC não usa as duas fontes");
  page.once("dialog",d=>void d.accept());
  await page.locator("[data-roll-confirm]").click();
  assert(await page.locator(".cf-history-entry").count()===1,"A rolagem não entrou no histórico");
  assert((await page.locator(".cf-history-entry").innerText()).includes("Montar Animal"),
   "Histórico não registrou a Perícia declarada");
  assert(errors.length===0,"Erros Javascript no fluxo DNA/Conflito: "+errors.join(" | "));
  console.log("PASS: NPC no DNA, isolamento de saves, ações por Perícia, dados SVG e histórico");

  const player=page; // reaproveita a mesma aba e seu localStorage
  await player.setViewportSize({width:1300,height:900});
  const playerErrors=[];player.on("pageerror",e=>playerErrors.push(e.stack||e.message));
  await player.goto("http://127.0.0.1:8000/prototipo-ficha/",{waitUntil:"domcontentloaded"});
  await player.evaluate(()=>{
   const s=JSON.parse(localStorage.getItem("codex-html-ficha-npc-dna-v1"));
   s.creationLocked=true;s.skills=["combate"];
   s.creationBudgetSnapshot={attr:1,training:2,skills:1};
   localStorage.setItem("codex-html-ficha-prototipo-v1",JSON.stringify(s));
  });
  await player.reload({waitUntil:"domcontentloaded"});
  await player.locator('#sheet-navigation button[data-sheet-page="evolution"]').click();
  assert(await player.locator('#respec-skills-list [data-action="respec-skill"][data-id="combate"]').count()===1,
   "A Perícia legada adquirida não oferece restituição no painel de evolução");
  const xpBefore=await player.evaluate(()=>{
   const s=JSON.parse(localStorage.getItem("codex-html-ficha-prototipo-v1"));
   return s.skills.length;
  });
  assert(xpBefore===1,"O cenário de XP de teste precisa ter uma Perícia");
  player.once("dialog",d=>void d.accept());
  await player.locator('#respec-skills-list [data-action="respec-skill"][data-id="combate"]').click();
  const xpAfter=await player.evaluate(()=>{
   const s=JSON.parse(localStorage.getItem("codex-html-ficha-prototipo-v1"));
   return {skills:s.skills,xpEarned:s.xpEarned,attrs:s.attributes.forca,practice:s.practices.atletismo};
  });
  assert(xpAfter.skills.length===0&&xpAfter.xpEarned===0&&xpAfter.attrs===1&&xpAfter.practice===1,
   "Restituição mexeu em XP concedido ou desfez requisitos em vez da Perícia");
  await player.reload({waitUntil:"domcontentloaded"});
  assert(await player.locator('#respec-skills-list [data-action="respec-skill"][data-id="combate"]').count()===0,
   "A restituição da Perícia não persistiu ao recarregar");
  assert(playerErrors.length===0,"Erros Javascript na restituição de XP: "+playerErrors.join(" | "));
  console.log("PASS: restituição de Perícia comprada após fechar criação, sem modificar fontes ou XP concedido");
 }finally{await browser.close();}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
