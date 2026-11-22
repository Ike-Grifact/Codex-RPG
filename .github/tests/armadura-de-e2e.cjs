const {chromium}=require("playwright");
const assert=require("node:assert/strict");

(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  await page.goto("http://127.0.0.1:8000/prototipo-ficha/",{waitUntil:"load"});
  const imported={schema:"codex-html-playtest-v1",character:{
   schema:"codex-html-playtest-v1",name:"Aprendiz defesa",race:"humano",level:1,
   creationLocked:true,attributes:{agilidade:1,destreza:0,vigor:0},
   practices:{atletismo:0},items:[{
    name:"Armadura Leve",type:"armadura",weight:"leve",grade:1,
    qty:1,equipped:false,max:7,hp:7
   }]
  }};
  await page.locator("#import-json").setInputFiles({
   name:"aprendiz-defesa.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(imported))
  });
  await page.waitForSelector('#inventory-list [data-action="equip"]',{state:"attached"});
  const de=page.locator("#de-text"),label=page.locator("#de-label"),caption=page.locator("#de-caption");
  assert.equal(await de.textContent(),"1");
  await page.locator('#inventory-list [data-action="equip"]').first().evaluate(el=>el.click());
  assert.equal(await de.textContent(),"2","DE total com Armadura Leve equipada");
  assert.equal(await label.textContent(),"DE DEFENSIVA");
  assert.match(await caption.textContent(),/Base 1 · armadura \+1/,"O cartão mostra só o resumo");
  assert.equal(await page.locator(".fp-vitals").evaluate(el=>getComputedStyle(el).display),"flex","Indicadores compactos");
  assert.equal(await caption.isVisible(),false,"Subtexto deixa de ocupar espaço visual");
  await page.locator('[data-vital-open="defense"]').click();
  const tooltip=page.locator("#fp-vital-tooltip");
  assert.equal(await tooltip.isVisible(),true,"O detalhe deve abrir ao toque");
  assert.match(await tooltip.textContent(),/todas as defesas/,"A explicação detalhada fica no tooltip");
  assert.match(await tooltip.textContent(),/Total = 2/,"O tooltip usa a defesa calculada e não um exemplo fixo");
  await page.keyboard.press("Escape");
  assert.equal(await tooltip.isVisible(),false,"Escape fecha a explicação");
  await page.setViewportSize({width:1200,height:900});
  const desktop=await page.evaluate(()=>{
   const pos=id=>document.querySelector(id).getBoundingClientRect();
   const apt=pos("#source-grid"),roll=pos("#composer-panel"),skills=pos("#play-talents");
   return{aptRight:apt.right,rollLeft:roll.left,skillsRight:skills.right,skillsVisible:skills.width>0};
  });
  assert.ok(desktop.rollLeft>=desktop.aptRight-3,"Rolador deve estar à direita das aptidões no desktop");
  assert.ok(desktop.skillsVisible&&desktop.rollLeft>=desktop.skillsRight-3,"Rolador deve ficar à direita das perícias adquiridas");
  await page.setViewportSize({width:390,height:844});
  const mobile=await page.evaluate(()=>{
   const apt=document.querySelector("#source-grid").getBoundingClientRect();
   const roll=document.querySelector("#composer-panel").getBoundingClientRect();
   const skills=document.querySelector("#play-talents").getBoundingClientRect();
   return{aptTop:apt.top,aptBottom:apt.bottom,rollTop:roll.top,skillsBottom:skills.bottom};
  });
  assert.ok(mobile.skillsBottom<=mobile.aptTop+3,"No celular, Ações vêm antes das aptidões");
  assert.ok(mobile.rollTop>=mobile.aptBottom-3,"No celular, rolador aparece após aptidões");
  const indicators=await page.locator(".fp-vitals").evaluate(bar=>{
   const items=Array.from(bar.querySelectorAll(".fp-vital"));
   return{
    groups:[...bar.children].filter(el=>el.classList.contains("fp-vitals-primary")||el.classList.contains("fp-vitals-secondary")).map(el=>el.children.length),
    ids:items.filter(x=>x.querySelector("[data-vital-open]")).map(x=>x.querySelector("[data-vital-open]").dataset.vitalOpen),
    primaryIcon:parseFloat(getComputedStyle(items[0].querySelector(".fp-vital-label")).width),
    secondaryIcon:parseFloat(getComputedStyle(items[4].querySelector(".fp-vital-label")).width),
    hasLoadCard:!!bar.querySelector('[data-vital-open="load"]'),
    inventoryIsButton:items[6].tagName==="BUTTON"
   };
  });
  assert.deepEqual(indicators.groups,[4,3],"Quatro indicadores principais e três secundários");
  assert.deepEqual(indicators.ids,["life","integrity","defense","movement","courage","balance"]);
  assert.ok(indicators.primaryIcon>indicators.secondaryIcon,"Ícones de Vida, Integridade, DE e Movimento maiores");
  assert.equal(indicators.hasLoadCard,false,"Capacidade sai da barra superior");
  assert.ok(indicators.inventoryIsButton,"Inventário é um atalho real");
  await page.locator(".fp-vital-inventory").click();
  assert.equal(await page.locator('#sheet-navigation button[data-sheet-page="inventory"]').getAttribute("aria-current"),"page","O atalho abriu a aba Inventário");
  assert.equal(await page.locator("#equipamentos").isVisible(),true,"O inventário mostra equipamentos e carga");
  assert.equal(await page.locator("#inventory-list").isVisible(),true,"Mochila aparece ao abrir Inventário");
  assert.equal(await page.locator("#trade-panel").isVisible(),false,"Bolsa não se mistura com os itens");
  assert.equal(await page.locator("#inventory-shop-details").isVisible(),false,"Mercado não se mistura com os itens");
  await page.locator('[data-inventory-view="wallet"]').click();
  assert.equal(await page.locator("#trade-panel").isVisible(),true,"Bolsa de VT em subaba própria");
  assert.equal(await page.locator("#trade-total").isVisible(),true,"Saldo VT acompanha a Bolsa");
  assert.equal(await page.locator("#inventory-list").isVisible(),false,"Mochila oculta na Bolsa");
  await page.locator('[data-inventory-view="shop"]').click();
  assert.equal(await page.locator("#inventory-shop-details").isVisible(),true,"Mercado possui tela própria");
  assert.equal(await page.locator("#shop-items").isVisible(),true,"Equipamentos disponíveis ao entrar no Mercado");
  assert.equal(await page.locator("#inventory-list").isVisible(),false,"Itens possuídos não se confundem com catálogo de compras");
  await page.locator('[data-inventory-view="bag"]').click();
  assert.equal(await page.locator("#inventory-list").isVisible(),true,"Pode retornar à Mochila");
  await page.locator('button[data-sheet-page="play"]').first().click();
  assert.equal(await page.locator(".fp-vital-inventory").isVisible(),true,"Indicadores continuam acessíveis após voltar a Jogar");

  assert.equal(await page.locator("#armor-integrity-text").textContent(),"5 / 5");
  await page.reload({waitUntil:"load"});
  assert.equal(await de.textContent(),"2","DE geral persiste após recarregar ficha equipada");
  await page.locator('#inventory-list [data-action="equip"]').first().evaluate(el=>el.click());
  assert.equal(await de.textContent(),"1","Desequipar elimina bônus");

  // Conjuração: foco compatível apenas no inventário, G3 acelerado para 1 turno.
  const mage={schema:"codex-html-playtest-v1",character:{
   schema:"codex-html-playtest-v1",name:"Aprendiz conjurador",race:"humano",level:5,creationLocked:true,
   life:4,courage:11,
   attributes:{inteligencia:2,destreza:1},practices:{armas_conjuracao:2,artesao:1},
   skills:["criar-item-foco-magia","fogo"],items:[{
    id:"foco-fogo-e2e",name:"Foco de Fogo",type:"foco",weight:"leve",
    element:"fogo",grade:2,die:6,focusCharges:2,equipped:false,max:0,hp:0
   }]
  }};
  await page.locator("#import-json").setInputFiles({
   name:"conjurador.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(mage))
  });
  await page.setViewportSize({width:1200,height:900});
  const actionSize=await page.locator("#play-talents").boundingBox();
  assert.ok(actionSize.height<245,"Ações deve ser uma faixa compacta, sem formulário de Grau");
  assert.equal(await page.locator("#play-talents [data-magic-field]").count(),0,
   "Configuração do Grau não deve ficar na faixa Ações");
  assert.equal(await page.locator("#play-talents #owned-skills").count(),0,
   "A consulta de Perícias saiu da área Jogar");
  await page.locator('button[data-sheet-page="evolution"]').click();
  assert.equal(await page.locator("#evolution-skills").isVisible(),true,
   "Perícias adquiridas ficam em Evolução");
  await page.locator("#evolution-skills summary").first().click();
  assert.ok(await page.locator("#evolution-skills .fp-quick-skill").count()>0,
   "Perícias adquiridas são consultadas como cartões de consulta rápida");
  await page.locator('button[data-sheet-page="play"]').first().click();
  const psychicIcon=page.locator('[data-action="magic-element"][data-id="psiquico"] .fp-codex-icon');
  assert.ok((await psychicIcon.getAttribute("src")).endsWith("/elemento-psiquico.svg"),"Psíquico deve ter pictograma próprio");
  assert.equal(await psychicIcon.evaluate(img=>img.complete&&img.naturalWidth>0),true,
   "O SVG de Psíquico precisa carregar no navegador");
  await page.locator('[data-action="magic-element"][data-id="fogo"]').click();
  assert.match(await page.locator("#composer-content").textContent(),/Disciplina · Conjuração/);
  const selectedIcon=page.locator('#owned-elements [data-id="fogo"] .fp-codex-icon');
  assert.ok((await selectedIcon.getAttribute("src")).endsWith("/elemento-fogo.svg"),"Fogo no chip");
  assert.equal(await selectedIcon.evaluate(img=>img.complete&&img.naturalWidth>0),true);
  const compositorIcon=page.locator("#composer-content .fp-magic-heading .fp-codex-icon");
  assert.ok((await compositorIcon.getAttribute("src")).endsWith("/elemento-fogo.svg"),"Fogo no compositor");

  assert.equal(await page.locator('#composer-content [data-magic-field="magicGrade"]').count(),1,
   "O Grau é escolhido em Preparar ação");
  assert.equal(await page.locator('#composer-content [data-magic-field="magicFocusId"]').count(),1,
   "O foco é configurado ao lado do rolador");
  assert.equal(await page.locator('#composer-content [data-magic-field="magicEnvironmentConfirmed"]').count(),0,
   "Sem confirmação ambiental na interface");
  assert.equal(await page.locator('[data-magic-field="magicFocusId"]').inputValue(),"foco-fogo-e2e",
   "Foco do inventário é selecionado mesmo guardado");
  assert.match(await page.locator("#composer-content").textContent(),/Foco de Fogo/);
  await page.locator('[data-magic-field="magicGrade"]').selectOption("3");
  await page.locator('[data-magic-field="magicCharges"]').selectOption("2");
  assert.ok(!(await page.locator('[data-magic-field="magicTimeConfirmed"]').count()),
   "G3 acelerado com duas cargas não exige turnos adicionais");
  await page.locator('[data-magic-field="magicGradeConfirmed"]').check();
  const magicValidation=await page.locator("#composer-content .fp-alert.invalid").allTextContents();
  assert.equal(await page.locator("#composer-content [data-action='roll']").isDisabled(),false,
   "G3 confirmado pode rolar; mensagens: "+magicValidation.join(" | "));
  assert.match(await page.locator("#composer-content").textContent(),/1 turno\(s\)/);
  await page.locator("#composer-content [data-action='roll']").click();
  assert.equal(await page.locator('#composer-content .fp-roll-die').count(),5,
   "Disciplina G2 + Inteligência G2 + dado mágico G3 d12 (foco não fornece dado)");
  assert.match(await page.locator("#composer-content").textContent(),/2 carga\(s\) do foco reservadas/);
  await page.locator("#composer-content .fp-roll-die").first().click();
  await page.locator("#composer-content .fp-roll-die").nth(1).click();
  assert.equal(await page.locator("#composer-content [data-action='finalize']").isDisabled(),false);
  await page.locator("#composer-content [data-action='finalize']").click();
  await page.locator(".fp-vital-inventory").click();
  assert.equal(await page.locator('#inventory-list [data-item-field="focusCharges"]').getAttribute("value"),"0",
   "Duas cargas são gastas somente após finalizar; persiste no Inventário");
  assert.deepEqual(errors,[],"Nenhum erro no navegador");
  console.log("PASS armadura: DE geral +1 Leve com recarga e retirada no navegador móvel");
 }finally{await browser.close();}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
