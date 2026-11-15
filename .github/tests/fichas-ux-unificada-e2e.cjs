const {chromium}=require("playwright");
const assert=(ok,msg)=>{if(!ok)throw Error(msg);};
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const player=await browser.newPage({viewport:{width:1350,height:900}});
  const playerErrors=[];player.on("pageerror",e=>playerErrors.push(e.message));
  await player.goto("http://127.0.0.1:8000/prototipo-ficha/",{waitUntil:"domcontentloaded"});
  player.once("dialog",dialog=>void dialog.accept());
  await player.locator("#demo-load").click();
  assert(await player.locator("#fp-tactical-bar").isVisible(),"Painel tático do jogador não aparece");
  assert(await player.locator(".fp-quick-attribute").count()===6,"Jogador precisa de seis atalhos de Atributos");
  assert(await player.locator(".fp-nine-slot").count()===9,"Jogador precisa dos nove espaços de dados");
  assert(await player.locator(".fp-quick-attribute svg").count()>=6,"Ícones dos dados desapareceram do jogo");
  await player.locator('[data-action="quick-attribute"][data-key="forca"]').click();
  assert((await player.locator("#fp-tactical-status").innerText()).includes("Força"),
   "Clicar no Atributo não atualizou a preparação");
  await player.locator('[data-action="action-tab"][data-category="gear"]').click();
  assert(await player.locator("#equipped-shortcuts").isVisible(),"Armas não aparecem na aba Ações");
  assert(await player.locator('[data-action="prepare-equipped"]').count()>0,"Equipamento não possui atalho de uso");
  await player.locator('[data-action="prepare-equipped"]').first().click();
  assert((await player.locator("#fp-tactical-status").innerText()).includes("Disciplina"),
   "Atalho de arma não preparou Disciplina");
  await player.locator('[data-action="action-tab"][data-category="skills"]').click();
  assert(await player.locator('[data-action="prepare-skill"]').count()>0,"Perícia adquirida não tem botão Preparar");
  await player.locator('[data-action="prepare-skill"]').first().click();
  assert((await player.locator("#fp-tactical-status").innerText()).includes("Perícia declarada"),
   "Perícia não foi declarada na preparação");
  await player.locator("#edit-sheet").click();
  assert(await player.locator("#fp-tactical-bar").isVisible(),"Painel de dados desapareceu na Edição");
  assert((await player.locator("#fp-tactical-mode").innerText()).includes("Edição"),"Edição indistinguível de Rolagem");
  assert(await player.locator(".fp-nine-slot").count()===9,"Edição escondeu os nove espaços");
  await player.locator("#edit-sheet").click();
  assert(await player.locator("#fp-tactical-bar").isVisible(),"Rolagem não restaurou painel");
  assert(playerErrors.length===0,"Erros de Ficha do jogador: "+playerErrors.join(" | "));
  console.log("PASS Ficha do jogador: dados, Ações, Perícias, equipamento e alternância");

  const conflict=await browser.newPage({viewport:{width:1440,height:980}});
  const errors=[];conflict.on("pageerror",e=>errors.push(e.message));
  await conflict.goto("http://127.0.0.1:8000/criar-conflito/",{waitUntil:"domcontentloaded"});
  await conflict.locator("#add-human-basic").click();
  assert(await conflict.locator(".cf-tactical-strip").isVisible(),"Conflito sem barra tática na Edição");
  assert(await conflict.locator(".cf-quick-capacity").count()===6,"Faltam seis Atributos na barra");
  assert(await conflict.locator(".cf-nine-slot").count()===9,"Faltam nove espaços na barra");
  assert(await conflict.locator(".cf-quick-capacity svg").count()>=6,"Ícones dos dados sumiram na Edição");
  await conflict.locator('[data-conflict-mode="roll"]').click();
  assert(await conflict.locator(".cf-tactical-strip").isVisible(),"Barra desapareceu na Rolagem");
  assert(await conflict.locator(".cf-source-card svg").count()>=18,
   "As fontes da Rolagem precisam mostrar ícones de dados");
  assert(await conflict.locator(".cf-play-grid").count()===1,"Rolagem não está em painel compacto");
  assert(await conflict.locator(".cf-action-tabs button").count()===3,"Faltam Ações Armas/Elementos/Perícias");
  await conflict.locator('[data-action-tab="weapons"]').click();
  await conflict.locator('[data-threat-action="basic"]').click();
  assert((await conflict.locator(".cf-action-selected").innerText()).includes("Teste básico"),
   "Atalho de Ação básica não preparou a ação");
  await conflict.locator('[data-quick-attr="agilidade"]').click();
  assert((await conflict.locator(".cf-quick-capacity.is-selected").count())>=1,
   "Clicar no Atributo não selecionou a fonte para rolagem");
  const local=await conflict.evaluate(()=>{
   const key="codex-rpg-criar-conflito-v1",raw=JSON.parse(localStorage.getItem(key));
   raw.roster[0].skills=["marciais"];localStorage.setItem(key,JSON.stringify(raw));
   return raw.roster[0].id;
  });
  await conflict.reload({waitUntil:"domcontentloaded"});
  await conflict.locator('[data-conflict-mode="roll"]').click();
  await conflict.locator('[data-action-tab="skills"]').click();
  assert(await conflict.locator('[data-threat-action="skill"]').count()===1,"Perícia adquirida não aparece nas Ações");
  await conflict.locator('[data-threat-action="skill"]').click();
  assert((await conflict.locator(".cf-action-selected").innerText()).includes("Artes Marciais"),
   "Atalho da Perícia não registrou a ação");
  await conflict.locator('[data-roll-start]').click();
  assert(await conflict.locator(".cf-roll-die").count()>=2,"Ação declarada não chegou à pilha de dados");
  conflict.once("dialog",dialog=>void dialog.accept());
  await conflict.locator('[data-roll-confirm]').click();
  assert(await conflict.locator(".cf-history-entry").count()===1,"Ação não entrou no histórico");
  const name=await conflict.locator(".cf-history-entry").first().innerText();
  assert(name.includes("Artes Marciais"),"O histórico perdeu a Perícia declarada");
  assert(errors.length===0,"Erros de Conflito: "+errors.join(" | "));
  console.log("PASS Conflito: ícones em dois modos, Ações com Perícias e histórico");

  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const mobileErrors=[];mobile.on("pageerror",e=>mobileErrors.push(e.message));
  await mobile.goto("http://127.0.0.1:8000/criar-conflito/",{waitUntil:"domcontentloaded"});
  await mobile.locator("#add-human-basic").click();await mobile.locator('[data-conflict-mode="roll"]').click();
  assert(await mobile.locator(".cf-nine-slot").count()===9,"Celular escondeu slots");
  const overflow=await mobile.evaluate(()=>[...document.querySelectorAll(".cf-layout,.cf-editor,.cf-tactical-strip,.cf-play-grid")].filter(x=>x.getBoundingClientRect().right>window.innerWidth+3).map(x=>x.className));
  assert(!overflow.length,"Painel de conflito fora do celular: "+overflow.join(" | "));
  assert(!mobileErrors.length,"Erros JS no celular: "+mobileErrors.join(" | "));
  console.log("PASS mobile: painel de Ações e nove dados dentro da largura");
  await mobile.close();
 }finally{await browser.close();}
})().catch(error=>{console.error(error.stack||error);process.exitCode=1;});
