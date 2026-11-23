const {chromium}=require("playwright");
const assert=(ok,msg)=>{if(!ok)throw Error(msg);};
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1380,height:900}});
  const errors=[];page.on("pageerror",err=>errors.push(err.message));
  await page.goto("http://127.0.0.1:8000/criar-conflito/",{waitUntil:"domcontentloaded"});
  await page.locator("#add-human-basic").click();
  assert(await page.locator('#cf-skills .cf-skill-card').count()===104,"Perícias fictícias ou internas ainda aparecem na lista");
  assert(await page.locator('[data-skill="acao-em-conjunto-musical"]').count()===0,"Ação em Conjunto musical não é Perícia individual");
  assert(await page.locator('[data-skill="combate"]').count()===0,"Combate é identificador histórico, não Perícia");
  await page.locator('[data-enemy-skill-view="genetic"]').click();
  assert(await page.locator('#cf-enemy-gene-map .fp-gene-skill').count()===104,"Mapa genético deve mostrar só 104 Perícias ativas");
  for(const id of ["armas","combate","dueto-improvisado","acorde-de-protecao","harmonia-musical","solo-provocador"]){
   assert(await page.locator('#cf-enemy-gene-map [data-gene-id="'+id+'"]').count()===0,
    "Nó histórico ou efeito interno apareceu no mapa: "+id);
  }
  await page.locator('#cf-enemy-gene-map .fp-gene-skill[data-gene-id="golpe-furtivo"]').press("Enter");
  const inspector=page.locator("#cf-gene-inspector");
  assert(await inspector.isVisible(),"Selecionar Golpe Furtivo deve abrir o detalhe");
  assert(await inspector.locator('[data-enemy-skill-package="golpe-furtivo"]').isVisible(),
   "Com XP suficiente, oferecer comprar Golpe Furtivo + requisitos");
  const explanation=await inspector.innerText();
  assert(explanation.includes("Disciplina")&&explanation.includes("Furtividade"),
   "Plano de compra deve informar quais fontes serão desenvolvidas");
  page.once("dialog",dialog=>void dialog.accept());
  await inspector.locator('[data-enemy-skill-package="golpe-furtivo"]').click();
  await page.locator('[data-enemy-skill-view="list"]').click();
  assert(await page.locator('[data-skill="golpe-furtivo"]').isChecked(),"Compra conjunta não concedeu Golpe Furtivo");
  assert((await page.locator(".cf-stat-grid").innerText()).includes("10 / 15"),
   "Compra conjunta não debitou corretamente 7 XP após os 3 XP iniciais");
  await page.locator('[data-enemy-skill-open="golpe-furtivo"]').click();
  assert(await page.locator('#cf-gene-inspector').isVisible(),"Inspeção deve permanecer disponível depois da compra");
  await page.reload({waitUntil:"domcontentloaded"});
  assert(await page.locator('[data-skill="golpe-furtivo"]').isChecked(),"A Perícia comprada não persistiu");
  assert((await page.locator(".cf-stat-grid").innerText()).includes("10 / 15"),"XP após recarregar divergiu");
  assert(errors.length===0,"Erros JS: "+errors.join(" | "));
  console.log("PASS: catálogo canônico, efeitos internos ocultos, XP e compra atômica persistente");
 }finally{await browser.close();}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
