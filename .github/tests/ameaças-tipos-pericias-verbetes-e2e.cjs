const {chromium}=require("playwright");
const assert=(yes,message)=>{if(!yes)throw Error(message)};
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1366,height:900}});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  await page.goto("http://127.0.0.1:8000/criar-conflito/",{waitUntil:"domcontentloaded"});
  const values=await page.locator("#new-kind option").evaluateAll(nodes=>nodes.map(n=>n.value));
  assert(JSON.stringify(values)===JSON.stringify(["humanoide","monstro","humanoide-monstro"]),
   "Tipo de ameaça precisa apresentar exatamente os três tipos aprovados: "+values);
  await page.locator("#new-kind").selectOption("humanoide-monstro");
  await page.locator("#add-threat").click();
  assert((await page.locator("#editor").innerText()).includes("Humanoide Monstro"),"Ficha do híbrido não exibida");
  assert(await page.locator('#editor [data-grade="practice"][data-key="atletismo"]').count()===2,
   "Humanoide Monstro precisa de Práticas editáveis");
  await page.locator('#editor [data-field="xp"]').fill("20");
  await page.locator('#editor [data-field="xp"]').dispatchEvent("change");
  await page.locator('#editor [data-grade="attr"][data-key="forca"][data-delta="1"]').click();
  await page.locator('#editor [data-grade="attr"][data-key="influencia"][data-delta="1"]').click();
  await page.locator('#editor [data-grade="attr"][data-key="influencia"][data-delta="1"]').click();
  await page.locator('#editor [data-grade="practice"][data-key="atletismo"][data-delta="1"]').click();
  assert((await page.locator(".cf-stat-grid").innerText()).includes("12 / 20"),
   "Humanoide Monstro deve cobrar 2+8+2=12 XP antes de Perícias");
  await page.locator('#editor [data-skill="montar"]').check();
  assert((await page.locator(".cf-stat-grid").innerText()).includes("14 / 20"),
   "Humanoide Monstro deve pagar Perícias por seu custo normal");
  await page.locator('[data-conflict-mode="roll"]').click();
  assert(await page.locator(".cf-source-card").count()===18,"O rolador deve ter fontes humanoides completas");
  await page.locator('[data-action-tab="skills"]').click();
  assert(await page.locator('[data-conflict-action="skill"][data-action-skill="montar"]').count()===1,
   "Perícia adquirida ausente nas ações do Humanoide Monstro");
  await page.reload({waitUntil:"domcontentloaded"});
  assert((await page.locator(".cf-threat-card").first().innerText()).includes("Humanoide Monstro"),
   "Tipo de ameaça não persistiu");
  await page.locator("#new-kind").selectOption("monstro");
  await page.locator("#add-threat").click();
  await page.locator('#editor [data-field="xp"]').fill("20");
  await page.locator('#editor [data-field="xp"]').dispatchEvent("change");
  await page.locator('#editor [data-grade="attr"][data-key="forca"][data-delta="1"]').click();
  assert((await page.locator(".cf-stat-grid").innerText()).includes("2 / 20"),
   "Criatura/Monstro deve pagar 2 XP no Atributo G1");
  await page.locator("#new-kind").selectOption("humanoide");
  await page.locator("#add-threat").click();
  await page.locator('#editor [data-grade="attr"][data-key="forca"][data-delta="1"]').click();
  assert((await page.locator(".cf-stat-grid").innerText()).includes("1 / 15"),
   "Humanoide comum deve pagar 1 XP no Atributo G1");
  assert(!errors.length,"Erros JavaScript da Ficha de Conflito: "+errors.join(" | "));
  console.log("PASS ameaça: três tipos, XP, Perícias, fontes e persistência");

  const player=await browser.newPage({viewport:{width:1320,height:850}});
  const perrors=[];player.on("pageerror",e=>perrors.push(e.message));
  await player.goto("http://127.0.0.1:8000/prototipo-ficha/",{waitUntil:"domcontentloaded"});
  player.once("dialog",d=>void d.accept());
  await player.locator("#demo-load").click();
  await player.locator('#sheet-navigation button[data-sheet-page="genetic"]').click();
  assert(await player.locator("#gene-map .fp-gene-skill").count()>0,"DNA não exibe bolinhas de Perícias");
  // O Codex é um mapa com zoom e panorama: procurar um círculo visível,
  // sem clicar em elementos fora da viewport/cobertos pelo painel de XP.
  let skillId="";
  for(let attempt=0;attempt<9&&!skillId;attempt++){
   skillId=await player.locator("#gene-map").evaluate(root=>{
    const frame=root.getBoundingClientRect();
    for(const node of root.querySelectorAll(".fp-gene-skill")){
     const circle=node.querySelector("circle.fp-gene-dot"),r=circle?.getBoundingClientRect();
     if(!r)continue;
     const x=r.left+r.width/2,y=r.top+r.height/2;
     if(x<frame.left+28||x>frame.right-28||y<frame.top+28||y>frame.bottom-76)continue;
     if(document.elementFromPoint(x,y)?.closest(".fp-gene-skill")===node)return node.dataset.geneId;
    }
    return "";
   });
   if(!skillId)await player.locator('#gene-map [data-gene-nav="-1"]').click();
  }
  assert(!!skillId,"Nenhuma bolinha da Perícia ficou visível após ajustar o zoom no mapa");
  const node=player.locator('#gene-map .fp-gene-skill[data-gene-id="'+skillId+'"]');
  await node.locator("circle.fp-gene-dot").click();
  const link=player.locator('#gene-detail a.fp-gene-verbete');
  assert(await link.count()===1,"Clique na bolinha não oferece verbete completo. Nó: "+skillId+"; detalhe: "+(await player.locator("#gene-detail").innerText()).slice(0,240));
  assert((await link.getAttribute("href")||"").startsWith("../pericias/"),"Verbete deve apontar ao catálogo oficial");
  assert(await link.getAttribute("target")==="_blank","Verbete deve abrir sem interromper a edição no DNA");
  const slug=(await link.getAttribute("href")).replace("../","");
  const opened=await player.request.get("http://127.0.0.1:8000/"+slug);
  assert(opened.status()===200,"Verbete apontado não existe: "+slug);
  assert(await player.locator("#gene-detail button[data-action]").count()>=1,"O nó perdeu a ação de compra/evolução");
  assert(await player.locator('[data-gene-id="peritoconj"]').count()===0,"A Perícia removida aparece no DNA");
  await player.evaluate(()=>{
   const index=JSON.parse(localStorage.getItem("codex-rpg-jogadores-index-v1"));
   const key="codex-rpg-jogador-ficha-v1:"+index.activeId;
   const payload=JSON.parse(localStorage.getItem(key));
   payload.character.skills=[...new Set([...(payload.character.skills||[]),"peritoconj"])];
   localStorage.setItem(key,JSON.stringify(payload));
  });
  await player.reload({waitUntil:"domcontentloaded"});
  const persisted=await player.evaluate(()=>{
   const index=JSON.parse(localStorage.getItem("codex-rpg-jogadores-index-v1"));
   return JSON.parse(localStorage.getItem("codex-rpg-jogador-ficha-v1:"+index.activeId)).character;
  });
  assert(!persisted.skills.includes("peritoconj"),"A migração de Perito Conjurador na ficha ativa falhou");
  assert(!perrors.length,"Erros JavaScript no DNA: "+perrors.join(" | "));
  console.log("PASS DNA: compra preservada, verbete completo, Perito removido e migração de salvamentos");
  const skillPage=await browser.newPage({viewport:{width:1000,height:800}});
  const skillErrors=[];skillPage.on("pageerror",e=>skillErrors.push(e.message));
  const base="http://127.0.0.1:8000/pericias/";
  await skillPage.goto(base+"manejo-perfeito-armas-corpo-a-corpo.html");
  await skillPage.locator(".codex-skill-title-icon").waitFor();
  assert((await skillPage.locator(".skill-stats").innerText()).includes("Sem custo de ativação"),"Manejo Perfeito deve mostrar ativação gratuita separada do XP");
  assert(await skillPage.locator(".skill-article img[src$='exito.svg']").count()>=2,"Ícones de Êxito ausentes");
  assert((await skillPage.locator(".skill-related").innerText()).includes("Mecânicas relacionadas"),"Mecânicas precisam de grupo próprio");
  await skillPage.goto(base+"disciplina-avancada.html");
  await skillPage.locator(".codex-skill-title-icon").waitFor();
  assert(await skillPage.locator('.skill-related a[href="combate.html"],.skill-related a[href="armas-1.html"],.skill-related a[href="combinacao-de-fontes.html"]').count()===0,"Links legados ainda visíveis");
  await skillPage.goto(base+"pericia-em-armas-leves.html");
  await skillPage.locator(".codex-skill-title-icon").waitFor();
  assert((await skillPage.locator(".skill-stats").innerText()).includes("1 Coragem"),"Ativação paga precisa estar visível");
  assert(await skillPage.locator(".skill-article img[src$='antecipar.svg']").count()>0,"Ícone de Antecipar ausente");
  await skillPage.goto(base);
  await skillPage.locator(".codex-skill-card-icon").first().waitFor();
  assert(await skillPage.locator(".codex-skill-card-meta").count()===await skillPage.locator(".skill-catalog-card").count(),"Catálogo incompleto em tipos/custos");
  assert(!skillErrors.length,"Erros JS em verbetes: "+skillErrors.join(" | "));
  console.log("PASS verbetes: ícones, custos, tipos e referências atuais");
 }finally{await browser.close();}
})().catch(error=>{console.error(error.stack||error);process.exitCode=1;});
