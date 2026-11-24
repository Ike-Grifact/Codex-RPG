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
    concept:"Guardião da ponte",abilities:"Visão noturna",notes:"Guarda o portão.",
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
  await page.locator("#enemies [data-inspect]").click();
  assert(await page.locator("#combatant-sheet").evaluate(dialog=>dialog.open),
   "Ver ficha deve abrir um diálogo acessível.");
  const enemySheet=await page.locator("#combatant-sheet-content").innerText();
  assert(enemySheet.includes("Perícia em Armas Leves"),"A ficha deve mostrar a Perícia adquirida.");
  assert(enemySheet.includes("Disciplina Avançada:")&&enemySheet.includes("Não adquirida"),
   "A ficha deve declarar quando Disciplina Avançada não pertence ao inimigo.");
  assert(enemySheet.includes("Disciplina")&&enemySheet.includes("G1"),
   "A ficha deve mostrar o grau real da Prática Disciplina.");
  assert(enemySheet.includes("Roupas Simples")&&enemySheet.includes("2/2"),
   "O inventário e a Integridade devem constar na consulta.");
  assert(enemySheet.includes("Visão noturna")&&enemySheet.includes("Guarda o portão."),
   "Capacidades naturais e anotações importadas devem ser consultáveis.");
  await page.locator("#close-combatant-sheet").click();
  await page.locator('[data-inspect-selected="actor"]').click();
  assert((await page.locator("#combatant-sheet-title").innerText())==="Aprendiz de teste",
   "Atalho do atacante deve abrir a ficha do jogador.");
  await page.locator("#close-combatant-sheet").click();
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
  assert(snapshot.combatants.find(x=>x.id===enemy.id).items[0].integrity===1,
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
  assert(e.items[0].integrity===1,"Confirmar rolagem não deve aplicar dano de armadura automaticamente.");
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
  await page.locator("#enemies [data-inspect]").click();
  const savedSheet=await page.locator("#combatant-sheet-content").innerText();
  assert(savedSheet.includes("Visão noturna")&&savedSheet.includes("Guarda o portão."),
   "A ficha da criatura/humanoide importado deve persistir após recarregar.");
  assert(savedSheet.includes("1/2"),
   "A consulta recarregada deve refletir Integridade gasta no combate.");
  await page.locator("#close-combatant-sheet").click();
  assert((await page.locator("#last-action").innerText()).includes("Aprendiz de teste contra Saqueador de teste"),
   "A última rolagem confirmada deve continuar disponível após recarregar.");
  // Elevação de Grau no comparador: fonte inteira e custo real, sem alterar a ficha original.
  await page.evaluate(()=>{Math.random=()=>.7;});
  await page.locator("#step-source").selectOption("practice:armas_conjuracao");
  await page.locator("#active-skill").selectOption("armas-leves");
  await page.locator("#skill-courage").fill("1");
  await page.locator("#skill-approved").check();
  await page.locator("#roll").click();
  assert(await page.locator("#dice .cc-die").count()>=4,
   "Disciplina G1 elevada para G2 deve acrescentar o segundo d10, sem perder o dado de arma.");
  const trace=await page.locator("#roll-origins").innerText();
  const diceTrace=await page.locator("#dice").innerText();
  assert(trace.includes("Disciplina")&&trace.includes("Elevação")&&
   diceTrace.includes("Elevado")&&diceTrace.includes("Adaga"),
   "O rastreio deve identificar fontes mantidas, elevação e dado de arma rolado.");
  assert((await page.locator("#roll-result").innerText()).includes("2 Coragem"),
   "Elevação de fonte e Perícia declarada devem cobrar 2 Coragens juntas.");
  await page.locator("#confirm").click();
  let resources=await page.evaluate(()=>JSON.parse(localStorage.getItem("codex-rpg-comparador-v1")));
  assert(resources.history.some(x=>x.kind==="Perícia"&&x.message.includes("Armas Leves")),
   "Ativação da Perícia adquirida deve ser registrada no histórico.");
  assert(resources.combatants.find(x=>x.side==="jogadores").courage===7,
   "O gasto de 2 Coragens deve ser debitado uma única vez.");
  assert(resources.combatants.find(x=>x.side==="jogadores").practices.armas_conjuracao===1,
   "Elevação não compra Grau nem modifica a ficha em confronto.");
  await page.locator("#next-round").click();
  // Inimigo Ferido/Incapacitado: aplicar a mesma tabela de Saúde dos jogadores.
  const humanoid=resources.combatants.find(x=>x.side==="inimigos");
  const hero=resources.combatants.find(x=>x.side==="jogadores");
  await page.locator("#resource-actor").selectOption(humanoid.id);
  await page.locator("#resource-kind").selectOption("vida");
  await page.locator("#resource-amount").fill("3");
  await page.locator("#resource-minus").click();
  await page.locator("#actor").selectOption(humanoid.id);
  await page.locator("#target").selectOption(hero.id);
  assert((await page.locator("#health-info").innerText()).includes("incapacitado"),
   "Inimigo com 2 de Vida deve ser Incapacitado como um jogador.");
  await page.locator("#roll").click();
  assert((await page.locator("#roll-origins").innerText()).includes("Saúde incapacitado"),
   "Rastreio deve discriminar a penalidade de Saúde do inimigo.");
  assert((await page.locator("#roll-result").innerText()).includes("1 Pavor"),
   "Ação do inimigo humanoide Incapacitado exige 1 Pavor local.");
  assert(snapshot.combatants.find(x=>x.side==="inimigos").courage===0,
   "Inimigo humanoide jamais possui Coragem.");
  assert(await page.locator("#next-round").isDisabled(),
   "A declaração fica bloqueada até resolver a rolagem pendente.");
  await page.locator("#confirm").click();

  // Os dois Fulminantes são ativos pagos e alteram os dados ANTES da rolagem.
  await page.locator("#next-round").click();
  await page.locator("#actor").selectOption(hero.id);
  await page.locator("#target").selectOption(humanoid.id);
  await page.evaluate(()=>{
   const st=JSON.parse(localStorage.getItem("codex-rpg-comparador-v1"));
   const pc=st.combatants.find(x=>x.side==="jogadores");
   pc.attributes.forca=2;
   pc.practices.armas_conjuracao=2;
   pc.skills.push("golpe-fulminante","domar-criatura-pequena");
   pc.smallCompanion={present:true,name:"Naja",species:"serpente"};
   pc.courage=9;
   localStorage.setItem("codex-rpg-comparador-v1",JSON.stringify(st));
  });
  await page.reload({waitUntil:"domcontentloaded"});
  await page.locator("#actor").selectOption(hero.id);
  await page.locator("#target").selectOption(humanoid.id);
  await page.locator("#active-skill").selectOption("golpe-fulminante");
  await page.locator('#active-extra-skills [data-extra-skill="domar-criatura-pequena"]').check();
  await page.locator("#skill-approved").check();
  await page.locator("#roll").click();
  assert((await page.locator("#dice").innerText()).includes("Fulminante"),
   "Golpe Fulminante deve elevar um dado da arma antes do sorteio.");
  assert(await page.locator("#dice .cc-die").count()>=3,"Elevação não pode remover fontes.");
  assert((await page.locator("#roll-result").innerText()).includes("2 Coragem"),
   "Fulminante e Domar Pequena devem gastar exatamente duas Coragens na ativação.");
  assert((await page.locator("#roll-origins").innerText()).includes("Companheiro Pequeno"),
   "A ajuda da serpente deve ser identificada como fonte de Antecipar.");
  // Regressão: faces críticas douradas, crítico persistido, seleção ótima e Sangramento habilitado.
  await page.locator("#confirm").click();
  await page.locator("#next-round").click();
  await page.evaluate(()=>{
   const st=JSON.parse(localStorage.getItem("codex-rpg-comparador-v1"));
   const pc=st.combatants.find(x=>x.side==="jogadores");
   const enemy=st.combatants.find(x=>x.side==="inimigos");
   pc.items[0]={...pc.items[0],name:"Faca",kind:"weapon",category:"leve",die:6,properties:["Cortante"],equipped:true};
   pc.courage=10;pc.courageRoundSpent=0;pc.acted=false;enemy.acted=false;
   enemy.statuses={sangramento:false,envenenado:false,cravadas:[]};
   localStorage.setItem("codex-rpg-comparador-v1",JSON.stringify(st));
  });
  await page.reload({waitUntil:"domcontentloaded"});
  await page.locator("#actor").selectOption(hero.id);
  await page.locator("#target").selectOption(humanoid.id);
  await page.locator("#weapon-source").selectOption("adaga");
  assert(await page.locator('[data-weapon-property="Cortante"]').count()===1,
   "Características da Faca devem aparecer no comparador.");
  await page.locator('[data-weapon-property="Cortante"]').check();
  await page.locator("#difficulty").fill("1");
  // A pilha inicia com 2d10 de Disciplina, depois os dados do Atributo e da Faca (d6).
  await page.evaluate(()=>{let i=0;Math.random=()=>i++<2?.65:.999999;});
  await page.locator("#roll").click();
  assert(await page.locator(".cc-die.is-max").count()>=2,"Faces críticas devem ter destaque dourado.");
  assert(await page.locator(".cc-die.is-critical.kept").count()>=2,"Crítico necessita faces críticas mantidas.");
  await page.locator("#auto-goal").selectOption("balanced");
  await page.locator("#suggest").click();
  assert((await page.locator("#roll-result").innerText()).includes("CRÍTICO"),
   "Seleção automática deve preservar crítico real favorável.");
  assert((await page.locator("#roll-result").innerText()).includes("Gasto na ação: 1 Coragem"),
   "Coragem é debitada na tentativa mesmo quando o resultado é crítico.");
  assert(/recupera [12] Coragem/.test(await page.locator("#roll-origins").innerText()),
   "O crítico deve recuperar a Coragem pelo benefício normal, uma única vez.");
  await page.locator("#confirm").click();
  const effects=await page.evaluate(()=>JSON.parse(localStorage.getItem("codex-rpg-comparador-v1")));
  assert(effects.combatants.find(x=>x.side==="inimigos").statuses.sangramento===true,
   "Cortante habilitado aplica Sangramento ao acertar mesmo contra armadura.");
  assert(effects.lastResult.critical>=2&&effects.lastResult.keptFaces.includes("face"),
   "Crítico e faces devem ser persistidos no resultado.");
  await page.reload({waitUntil:"domcontentloaded"});
  assert((await page.locator("#last-action").innerText()).includes("CRÍTICO"),
   "Crítico deve continuar visível depois de recarregar.");
  assert(errs.length===0,"Erros JS no desktop: "+errs.join(" | "));
  console.log("PASS comparador desktop: fichas locais, alvo, DE, Integridade, Pavor, rodada e persistência");

  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const mobileErrors=[];mobile.on("pageerror",e=>mobileErrors.push(e.message));
  await mobile.goto("http://127.0.0.1:8000/simulador-combate/",{waitUntil:"domcontentloaded"});
  await mobile.locator("#demo").click();
  assert(await mobile.locator(".cc-card").count()===4,"Exemplo 2 × 2 deve abrir no celular.");
  const beast=await mobile.evaluate(()=>{
   const state=JSON.parse(localStorage.getItem("codex-rpg-comparador-v1"));
   return state.combatants.find(x=>x.kind==="monstro").id;
  });
  await mobile.locator("#actor").selectOption(beast);
  await mobile.locator("#monster-keep").selectOption("3");
  assert((await mobile.locator("#marco-info").innerText()).includes("Pavor local"),
   "Monstros devem exibir limite por Grau e custo de Pavor para reter dados.");
  const kept=await mobile.evaluate(()=>JSON.parse(localStorage.getItem("codex-rpg-comparador-v1"))
   .combatants.find(x=>x.kind==="monstro").keep);
  assert(kept===3,"Retenção escolhida do monstro deve persistir no confronto.");

  await mobile.locator("#enemies [data-inspect]").first().click();
  assert(await mobile.locator("#combatant-sheet").evaluate(dialog=>dialog.open),
   "Ficha da criatura deve ser acessível também no celular.");
  await mobile.locator("#close-combatant-sheet").click();
  const sizes=await mobile.evaluate(()=>({width:document.documentElement.scrollWidth,
   viewport:window.innerWidth,columns:getComputedStyle(document.querySelector(".cc-columns")).gridTemplateColumns}));
  assert(sizes.width<=sizes.viewport+5,"Layout extravasou celular: "+JSON.stringify(sizes));
  assert(!sizes.columns.includes(" "),"As colunas devem empilhar no celular: "+sizes.columns);
  assert(mobileErrors.length===0,"Erros JS mobile: "+mobileErrors.join(" | "));
  console.log("PASS comparador mobile: cards, controles e layout sem VTT");
 }finally{await browser.close();}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
