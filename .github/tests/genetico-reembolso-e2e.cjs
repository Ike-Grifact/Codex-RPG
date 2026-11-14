const {chromium}=require("playwright");
const assert=(x,m)=>{if(!x)throw Error(m)};
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1365,height:880}});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  const quickKey="codex-html-humanoide-rapido-v1";
  const playerKey="codex-html-ficha-prototipo-v1";
  const stored=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),quickKey);
  const choose=async (id,root="#gene-builder-map")=>{
   await page.locator(root+' .fp-gene-skill[data-gene-id="'+id+'"]').dispatchEvent("click");
   const detail=root==="#gene-builder-map"?"#gene-builder-detail":"#gene-detail";
   await page.waitForSelector(detail+":not([hidden])");
   return detail;
  };
  const agree=(verify)=>page.once("dialog",d=>{
   assert(d.type()==="confirm","Operação não pediu confirmação");
   if(verify)verify(d.message());
   void d.accept();
  });
  const autoBuy=async id=>{
   const detail=await choose(id);
   const buy=page.locator(detail+' [data-action="gene-auto-buy"]');
   assert(await buy.isEnabled(),"Compra roxa indisponível para "+id);
   agree(message=>assert(message.includes("Comprar"),"Resumo de compra ausente"));
   await buy.click();
  };
  const reset=async()=>{
   const button=page.locator('[data-action="quick-human-reset"]');
   if((await stored()).skills.length)agree();
   await button.click();
   assert((await stored()).skills.length===0,"Reset não iniciou uma ficha limpa");
  };
  await page.goto("http://127.0.0.1:8000/prototipo-ficha/?modo=humanoide-rapido",{waitUntil:"domcontentloaded"});

  // Compra em pacote, persistência, recusa e reembolso confirmado.
  await autoBuy("armas-pesadas");
  let state=await stored();
  assert(state.skills.includes("armas-pesadas"),"A Perícia roxa não foi adquirida");
  assert(state.genePackages?.some(r=>r.root==="armas-pesadas"&&r.active),"Histórico do pacote não foi salvo");
  assert(state.attributes.forca===2&&state.practices.armas_conjuracao===2,"Graus do pacote incorretos");
  await page.reload({waitUntil:"domcontentloaded"});
  let detail=await choose("armas-pesadas");
  const remove=page.locator(detail+' [data-action="gene-remove-skill"]');
  assert(await remove.isEnabled(),"Perícia adquirida não permite remoção pela esfera");
  assert((await remove.innerText()).includes("10 XP"),"Reembolso do pacote não prevê 10 XP");
  page.once("dialog",d=>void d.dismiss());
  await remove.click();
  state=await stored();
  assert(state.skills.includes("armas-pesadas"),"Cancelar diálogo não preservou a compra");
  agree(message=>{
   assert(message.includes("Força G2 → G1")&&message.includes("Disciplina G2 → G1"),
    "Confirmação não apresenta os graus devolvidos");
   assert(message.includes("10 XP"),"Confirmação não apresenta o reembolso");
  });
  await remove.click();
  state=await stored();
  assert(!state.skills.includes("armas-pesadas"),"Perícia não foi removida");
  assert(state.attributes.forca===1&&state.practices.armas_conjuracao===1,
   "Graus comprados exclusivamente para o pacote não retornaram ao mínimo");
  assert(state.genePackages.find(r=>r.root==="armas-pesadas")?.active===false,
   "Histórico da compra cancelada não foi registrado como inativo");
  assert((await page.locator("#wizard-summary").innerText()).includes("17 XP"),
   "Reembolso não retornou o XP ao orçamento");

  // Compra compartilhada: manter requisito enquanto outra Perícia o exige.
  await reset();
  await autoBuy("armas-pesadas");
  detail=await choose("disciplina-avancada");
  assert(await page.locator(detail+' [data-action="gene-skill"]').isEnabled(),
   "Não habilitou Disciplina Avançada após adquirir Disciplina G2");
  await page.locator(detail+' [data-action="gene-skill"]').click();
  await page.locator('#gene-build-actions [data-action="gene-confirm"]').click();
  state=await stored();
  assert(state.skills.includes("disciplina-avancada"),"Perícia compartilhada não foi adquirida");
  detail=await choose("armas-pesadas");
  agree();
  await page.locator(detail+' [data-action="gene-remove-skill"]').click();
  state=await stored();
  assert(!state.skills.includes("armas-pesadas")&&state.skills.includes("disciplina-avancada"),
   "Ao remover um pacote, outra Perícia comprada foi eliminada");
  assert(state.attributes.forca===1&&state.practices.armas_conjuracao===2,
   "Não preservou o grau de Disciplina exigido pela outra Perícia");
  detail=await choose("disciplina-avancada");
  agree();
  await page.locator(detail+' [data-action="gene-remove-skill"]').click();
  state=await stored();
  assert(state.attributes.forca===1&&state.practices.armas_conjuracao===1,
   "Graus temporariamente compartilhados não foram devolvidos após última dependência");

  // Dependente estrito: impedir exclusão de especialização com Golpe Fulminante ativo.
  await reset();
  await autoBuy("armas-pesadas");
  detail=await choose("golpe-fulminante");
  assert(await page.locator(detail+' [data-action="gene-skill"]').isEnabled(),
   "Golpe Fulminante não habilitado pela Perícia de arma");
  await page.locator(detail+' [data-action="gene-skill"]').click();
  await page.locator('#gene-build-actions [data-action="gene-confirm"]').click();
  detail=await choose("armas-pesadas");
  assert(await page.locator(detail+' [data-action="gene-remove-skill"]').isDisabled(),
   "Permitiu remover Perícia necessária ao Golpe Fulminante");
  assert((await page.locator(detail).innerText()).includes("Golpe Fulminante"),
   "Bloqueio não explica qual Perícia depende da compra");

  // Modo edição de ficha finalizada: remoção indisponível fora da edição.
  await reset();
  await autoBuy("armas-pesadas");
  await page.evaluate(([q,k])=>{
   const data=JSON.parse(localStorage.getItem(q));
   data.creationLocked=true;data.name="Personagem finalizado";
   localStorage.setItem(k,JSON.stringify(data));
  },[quickKey,playerKey]);
  await page.goto("http://127.0.0.1:8000/prototipo-ficha/",{waitUntil:"domcontentloaded"});
  await page.locator('#sheet-navigation [data-sheet-page="genetic"]').click();
  detail=await choose("armas-pesadas","#gene-map");
  assert(await page.locator(detail+' [data-action="gene-remove-skill"]').isDisabled(),
   "Permitiu reembolso fora do modo edição");
  await page.locator("#edit-sheet").click();
  await page.locator('#sheet-navigation [data-sheet-page="genetic"]').click();
  detail=await choose("armas-pesadas","#gene-map");
  assert(await page.locator(detail+' [data-action="gene-remove-skill"]').isEnabled(),
   "A edição não habilitou a remoção pela esfera");
  agree();
  await page.locator(detail+' [data-action="gene-remove-skill"]').click();
  let player=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),playerKey);
  assert(player.creationLocked&&player.attributes.forca===1&&player.practices.armas_conjuracao===1&&
   !player.skills.includes("armas-pesadas"),"Correção de ficha finalizada falhou");
  assert(player.xpEarned===0,"Reembolso não pode conceder XP de campanha");

  // Ficha legada sem comprovante: só reembolso da Perícia, sem mexer em fontes antigas.
  player.attributes.forca=2;player.practices.armas_conjuracao=2;
  player.skills=["armas-pesadas"];player.genePackages=[];player.name="Legado";
  await page.evaluate(([k,v])=>localStorage.setItem(k,JSON.stringify(v)),[playerKey,player]);
  await page.reload({waitUntil:"domcontentloaded"});
  await page.locator("#edit-sheet").click();
  await page.locator('#sheet-navigation [data-sheet-page="genetic"]').click();
  detail=await choose("armas-pesadas","#gene-map");
  assert((await page.locator(detail).innerText()).includes("não há registro dos requisitos"),
   "Ficha antiga não sinalizou falta de histórico");
  agree();
  await page.locator(detail+' [data-action="gene-remove-skill"]').click();
  player=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),playerKey);
  assert(player.attributes.forca===2&&player.practices.armas_conjuracao===2,
   "Ficha antiga teve graus removidos sem comprovante da compra");
  assert(!player.skills.includes("armas-pesadas"),"Perícia antiga não foi removida");

  assert(errors.length===0,"Erros JS: "+errors.join(" | "));
  console.log("PASS: esfera roxa, reembolso, cancelamento, dependências, ficha finalizada e legado.");
 }finally{await browser.close();}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
