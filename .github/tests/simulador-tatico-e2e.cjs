const {chromium}=require("playwright");
const assert=(v,m)=>{if(!v)throw Error(m);};
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1450,height:950}});
  const errs=[];page.on("pageerror",e=>errs.push(e.stack||e.message));
  await page.goto("http://127.0.0.1:8000/simulador-combate/",{waitUntil:"domcontentloaded"});
  assert(await page.locator("#board [data-x][data-y]").count()===240,"Mapa precisa exibir 20×12 células");
  await page.locator("#preset").click();
  assert(await page.locator(".tc-roster-item").count()===6,"Preset de seis fichas não foi carregado");
  assert((await page.locator("#actor-name").innerText())==="Mago","Primeira ação deve partir do Mago");
  assert((await page.locator("#actor-summary").innerText()).includes("Armadura Muito Leve"),"Mago precisa começar com Muito Leve");
  const snap=await page.evaluate(()=>JSON.parse(localStorage.getItem("codex-rpg-simulador-tatico-v1")));
  assert(snap.tokens.find(t=>t.name==="Lobo pesado").threatGrade===2,"Lobo pesado deve ser Grau 2");
  assert(snap.tokens.find(t=>t.name==="Lobo pesado").xp===40,"Lobo pesado deve possuir 40 XP");
  assert(snap.tokens.find(t=>t.name==="Mago").armor.integrity===0,"Muito Leve não possui Integridade");
  assert((await page.locator("#distance").innerText()).includes("m"),"Distância entre mago e atirador não foi medida");
  await page.locator("#range").fill("30");
  await page.locator("#roll").click();
  assert((await page.locator("#notice").innerText()).includes("Parede bloqueia"),"Parede deve impedir disparo");
  page.once("dialog",d=>void d.accept());
  await page.locator("#clear-map").click();
  await page.locator("#range").fill("12");
  await page.locator("#roll").click();
  assert((await page.locator("#notice").innerText()).includes("além do alcance"),"Alvo fora de alcance deve impedir ataque");
  await page.locator("#range").fill("30");
  await page.locator("#spell-grade").selectOption("1");
  await page.locator("#roll").click();
  assert(await page.locator("#dice button.tc-die").count()===4,"Mago de 20XP deveria rolar 2d10+2d6");
  assert((await page.locator("#roll-result").innerText()).includes("G1: somente efeitos"),"Magia G1 deve mostrar zero dano");
  await page.locator("#suggest").click();
  assert(await page.locator("#dice button.tc-die.picked").count()>0,"Seleção de dados sugeridos não funcionou");
  await page.locator("#confirm").click();
  const after=await page.evaluate(()=>JSON.parse(localStorage.getItem("codex-rpg-simulador-tatico-v1")));
  assert(after.history[0].kind==="rolagem","A ação não entrou no histórico");
  assert(after.history[0].damagePotential===0,"Magia G1 não pode aplicar dano");
  assert(after.tokens.find(t=>t.name==="Atirador").life===snap.tokens.find(t=>t.name==="Atirador").life,
   "O VTT não pode causar dano automático antes da decisão do Narrador");
  page.on("dialog",d=>{if(d.type()==="prompt")void d.accept("3");else void d.accept();});
  await page.locator("#arcane-shield").click();
  assert((await page.locator("#actor-summary").innerText()).includes("Escudo Arcano declarado"),"Escudo não foi registrado");
  const shield=await page.evaluate(()=>JSON.parse(localStorage.getItem("codex-rpg-simulador-tatico-v1")));
  assert(shield.tokens.find(t=>t.name==="Mago").armor.integrity===0,"Escudo não pode criar Integridade automática");
  assert(shield.history[0].kind==="escudo","Escudo precisa entrar no histórico");
  await page.locator("#next-round").click();
  assert(!(await page.locator("#actor-summary").innerText()).includes("Escudo Arcano declarado"),"Escudo deveria expirar em uma rodada");
  await page.locator("#roll-shield").click();
  assert(await page.locator("#dice button.tc-die").count()===4,"Conjuração de Escudo Arcano deveria usar Disciplina G2 + INT G2");
  await page.locator("#suggest").click();
  await page.locator("#confirm").click();
  const recast=await page.evaluate(()=>JSON.parse(localStorage.getItem("codex-rpg-simulador-tatico-v1")));
  assert(recast.history[0].kind==="escudo","Rolagem do Escudo não registrou a DE da barreira");
  assert(Number.isInteger(recast.history[0].barrierDe),"A DE de ruptura deve resultar dos dados");
  assert(await page.locator("#board .tc-cell.shield-area").count()>=4,"Área circular aproximada 3×3 deve ficar visível");
  assert(recast.tokens.find(t=>t.name==="Mago").armor.integrity===0,"Rolagem de Escudo não pode gerar Integridade automática");
  const shooterId=shield.tokens.find(t=>t.name==="Atirador").id;
  const mageId=shield.tokens.find(t=>t.name==="Mago").id;
  await page.locator('[data-select="'+shooterId+'"]').click();
  await page.locator('[data-target="'+mageId+'"]').click();
  await page.locator("#dodge").check();
  assert((await page.locator("#target-info").innerText()).includes("DE 2 (esquiva)"),
   "Armadura Muito Leve deve conceder +2 DE somente quando o Mago esquiva");
  await page.locator("#attribute-source").selectOption("destreza");
  await page.locator("#discipline-mode").selectOption("armas");
  await page.locator("#equipment-source").selectOption({label:"Revólver · d6"});
  await page.locator("#extra-source").selectOption("attribute:agilidade");
  await page.locator("#context-approved").check();
  await page.locator("#range").fill("30");
  await page.locator("#roll").click();
  assert(await page.locator("#dice button.tc-die").count()===7,
   "Atirador precisa rolar Disciplina G2 + Destreza G2 + Agilidade G2 pertinente + revólver G1");

  assert(errs.length===0,"Erros JS desktop: "+errs.join(" | "));
  console.log("PASS VTT desktop: fichas, LOS, alcance, magia G1, dados, escudo, histórico e duração");

  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const mobileErrors=[];mobile.on("pageerror",e=>mobileErrors.push(e.message));
  await mobile.goto("http://127.0.0.1:8000/simulador-combate/",{waitUntil:"domcontentloaded"});
  await mobile.locator("#preset").click();
  assert(await mobile.locator(".tc-roster-item").count()===6,"Celular sem fichas do confronto");
  assert(await mobile.locator("#board .tc-cell").count()===240,"Mapa incompleto no celular");
  const geometry=await mobile.evaluate(()=>({
   page:document.documentElement.scrollWidth,screen:window.innerWidth,
   map:document.querySelector(".tc-map-scroll").scrollWidth,
   viewport:document.querySelector(".tc-map-scroll").clientWidth
  }));
  assert(geometry.map>geometry.viewport,"Mapa deve poder rolar horizontalmente");
  assert(geometry.page<geometry.screen+5,"Layout extravasou o celular: "+JSON.stringify(geometry));
  assert(mobileErrors.length===0,"Erros JS mobile: "+mobileErrors.join(" | "));
  console.log("PASS VTT mobile: fichas, mapa rolável e layout");
 }finally{await browser.close();}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
