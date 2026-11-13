const {chromium}=require("playwright");
const assert=(condition,message)=>{if(!condition)throw Error(message);};
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const context=await browser.newContext({viewport:{width:1440,height:900}});
  const page=await context.newPage(),errors=[];
  page.on("pageerror",error=>errors.push(error.message));
  await page.goto("http://127.0.0.1:8000/criar-conflito/",{waitUntil:"domcontentloaded"});
  const originalHero=JSON.stringify({schema:"codex-html-playtest-v1",name:"Personagem do jogador - não alterar"});
  await page.evaluate(value=>localStorage.setItem("codex-html-ficha-prototipo-v1",value),originalHero);
  await page.locator("#add-human-quick").click();
  await page.waitForURL("**/prototipo-ficha/?modo=humanoide-rapido");
  assert(await page.locator(".fp-quick-human").isVisible(),"Criação rápida não abriu sem o assistente");
  assert(await page.locator("#gene-builder-map").count()===1,"Codex Genético não abriu diretamente");
  assert(await page.locator("#gene-builder-map .fp-gene-node.is-potential").count()>0,
   "Faltam bolinhas roxas com Perícias compráveis por pacote");
  assert((await page.locator("#wizard-summary").innerText()).includes("17 XP"),
   "Investimento inicial mínimo não preservou 17 XP livres");
  const purple=page.locator('#gene-builder-map .fp-gene-node[data-gene-id="armas-pesadas"]');
  assert(await purple.count()===1,"Perícia do teste não está no DNA");
  assert(await purple.getAttribute("class").then(s=>s.includes("is-potential")),
   "Perícia com requisitos acessíveis não está roxa");
  await purple.dispatchEvent("click");
  assert(await page.locator('#gene-builder-detail [data-action="gene-auto-buy"]').isVisible(),
   "Bolinha roxa não abriu o pacote de requisitos");
  page.once("dialog",dialog=>{
   assert(dialog.type()==="confirm","Compra de pacote sem confirmação");
   assert(dialog.message().includes("Armas Pesadas"),"Resumo de compra não identifica a Perícia");
   void dialog.accept();
  });
  await page.locator('#gene-builder-detail [data-action="gene-auto-buy"]').click();
  const summary=await page.locator("#wizard-summary").innerText();
  assert(summary.includes("13 XP")&&summary.includes("7 XP"),
   "Compra assistida não atualizou saldo e XP corretamente: "+summary);
  await page.locator('[data-action="quick-human-send"]').click();
  await page.waitForURL("**/criar-conflito/?adicionar-humanoide=1");
  assert(await page.locator(".cf-threat-card").count()===1,
   "Humanoide do DNA não foi adicionado ao encontro");
  assert(await page.locator('#editor [data-skill="armas-pesadas"]').isChecked(),
   "Perícia comprada no DNA não chegou ao conflito");
  assert((await page.locator("#editor .cf-stat-grid").innerText()).includes("13 / 20"),
   "XP investido não foi transferido ao encontro");
  assert((await page.locator("#editor").innerText()).includes("Grau 2"),
   "Os graus do pacote não foram mantidos no humanoide");
  assert((await page.evaluate(()=>localStorage.getItem("codex-html-ficha-prototipo-v1"))===originalHero),
   "Criador rápido sobrescreveu os dados do jogador");
  await page.reload({waitUntil:"domcontentloaded"});
  assert(await page.locator(".cf-threat-card").count()===1,
   "Envio duplicou o humanoide ao atualizar a página");
  assert(await page.locator('#editor [data-skill="armas-pesadas"]').isChecked(),
   "Perícia não foi persistida após recarregar o conflito");
  assert(errors.length===0,"Erros JS: "+errors.join(" | "));
  console.log("PASS: humanoide rápido, DNA roxo, pacote de requisitos, XP, conflito e isolamento da ficha do jogador.");
  await context.close();
 }finally{await browser.close();}
})().catch(error=>{console.error(error.stack||error);process.exitCode=1;});
