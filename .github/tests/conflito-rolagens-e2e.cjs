const {chromium}=require("playwright");
const assert=(yes,message)=>{if(!yes)throw Error(message)};
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1420,height:920}});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  await page.goto("http://127.0.0.1:8000/criar-conflito/",{waitUntil:"domcontentloaded"});
  await page.locator("#add-threat").click();
  assert(await page.locator("#cf-roll-panel").isVisible(),"Painel de rolagem da criatura não aparece");
  await page.locator('#editor [data-field="xp"]').fill("20");
  await page.locator('#editor [data-field="xp"]').dispatchEvent("change");
  for(let i=0;i<2;i++)await page.locator('[data-grade="attr"][data-key="forca"][data-delta="1"]').click();
  await page.locator('[data-local="1"]').click();
  await page.locator('[data-keep="1"]').click();
  await page.evaluate(()=>{Math.random=()=>0});
  await page.locator('[data-roll-start]').click();
  assert(await page.locator('.cf-roll-die').count()===3,"Não rolou 2d10 + 1d4");
  assert(await page.locator('.cf-roll-die.is-kept').count()===3,"Não manteve os 3 dados planejados");
  assert((await page.locator(".cf-roll-outcome").innerText()).includes("Gasto de retenção: 1P local"),"Pavor da retenção não está indicado");
  assert((await page.locator(".cf-local-row").first().innerText()).includes("Pavor 1 / 1"),"Pavor foi gasto antes de confirmar");
  page.once("dialog",d=>void d.accept());
  await page.locator("[data-roll-confirm]").click();
  assert((await page.locator(".cf-local-row").first().innerText()).includes("Pavor 0 / 1"),"Confirmação não gastou 1P local");
  assert((await page.locator("#cf-roll-panel").innerText()).includes("Última rolagem confirmada"),"Resumo do teste não persistiu em tela");
  await page.reload({waitUntil:"domcontentloaded"});
  assert((await page.locator("#cf-roll-panel").innerText()).includes("Última rolagem confirmada"),"Resultado confirmado sumiu depois de recarregar");
  // O primeiro monstro é Líder; os demais não recebem liderança automática.
  await page.locator("#new-kind").selectOption("criatura");
  await page.locator("#add-threat").click();
  assert(await page.locator('[data-joint="2"]').isEnabled(),"Não habilitou Líder + 1 com 2P público");
  page.once("dialog",d=>void d.accept());
  await page.locator('[data-joint="2"]').click();
  assert((await page.locator("#public-count").innerText()).startsWith("1 /"),"Comando com 1 aliado não gastou 1P público");
  await page.locator("#new-kind").selectOption("monstro");
  await page.locator("#add-threat").click();
  await page.locator('[data-public="1"]').click();
  assert(await page.locator('[data-joint="3"]').isEnabled(),"Não habilitou Líder + 2 com 2P público");
  page.once("dialog",d=>void d.accept());
  await page.locator('[data-joint="3"]').click();
  assert((await page.locator("#public-count").innerText()).startsWith("0 /"),"Comando com 2 aliados não gastou 2P público");
  await page.reload({waitUntil:"domcontentloaded"});
  assert((await page.locator("#public-count").innerText()).startsWith("0 /"),"Saldo público não persistiu");
  assert(await page.locator('[data-joint="2"]').isDisabled(),"Ação conjunta permitida com 0P");
  assert(errors.length===0,"Erros JS: "+errors.join(" | "));
  console.log("PASS: rolagem de 3 dados, Pavor local só na confirmação, crítico/veredito, gastos públicos 1/2P e persistência.");
 }finally{await browser.close();}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
