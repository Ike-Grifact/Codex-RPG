const {chromium}=require("playwright");
const check=(ok,message)=>{if(!ok)throw Error(message);};
(async()=>{
 const browser=await chromium.launch({headless:true});
 try {
  const page=await browser.newPage({viewport:{width:1360,height:850}});
  const errors=[];page.on("pageerror",e=>errors.push(String(e)));
  await page.goto("http://127.0.0.1:8000/prototipo-ficha/",{waitUntil:"domcontentloaded"});
  await page.evaluate(()=>{
   localStorage.setItem("codex-html-ficha-prototipo-v1",JSON.stringify({
    name:"Teste de Integridade",level:1,creationLocked:true,attributes:{forca:1},practices:{armas_conjuracao:1},
    items:[{id:"armor-1",name:"Armadura Leve",type:"armadura",weight:"leve",grade:1,qty:1,max:10,hp:7,equipped:true,properties:[]}]
   }));
  });
  await page.reload({waitUntil:"domcontentloaded"});
  const armor=page.locator("#equipped-shortcuts .fp-owned-gear");
  check(await armor.count()===1,"Armadura equipada não aparece no painel Jogar");
  check((await armor.innerText()).includes("7 / 10"),"Integridade 7/10 não aparece na ficha");
  await armor.locator('button[data-action="integrity"][data-delta="-1"]').click();
  check((await armor.innerText()).includes("6 / 10"),"Redução de Integridade não atualizou o cartão");
  check((await page.locator("#inventory-list").innerText()).includes("6/10"),"Inventário não sincronizado");
  await page.reload({waitUntil:"domcontentloaded"});
  check((await page.locator("#equipped-shortcuts").innerText()).includes("6 / 10"),"Integridade não persistiu após recarregar");
  await page.locator("#equipped-shortcuts [data-action='integrity'][data-delta='1']").click();
  check((await page.locator("#equipped-shortcuts").innerText()).includes("7 / 10"),"Recuperação não atualizou o cartão");
  await page.goto("http://127.0.0.1:8000/criar-conflito/",{waitUntil:"domcontentloaded"});
  const button=page.locator('.cf-npc-launch #add-human-quick');
  check(await button.isVisible(),"Seção Criar NPC / Humanoide não aparece");
  check((await button.innerText()).includes("Criar NPC / Humanoide"),"Botão NPC não está identificado");
  await button.click();
  await page.waitForURL("**/prototipo-ficha/?modo=humanoide-rapido");
  check(await page.locator("#gene-builder-map").isVisible(),"Criar NPC não abriu o DNA");
  check(errors.length===0,"Erro de JavaScript: "+errors.join(" | "));
  console.log("PASS: Integridade de armadura no Jogar, sincronização, persistência e atalho NPC visível");
 }finally{await browser.close();}
})().catch(error=>{console.error(error.stack||error);process.exitCode=1;});
