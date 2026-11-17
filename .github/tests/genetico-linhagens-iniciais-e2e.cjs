const {chromium}=require("playwright");
const assert=require("node:assert/strict");
const URL="http://127.0.0.1:8000/prototipo-ficha/";
const INDEX="codex-rpg-jogadores-index-v1",PREFIX="codex-rpg-jogador-ficha-v1:";
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:850}});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  const read=()=>page.evaluate(({index,prefix})=>{
   const idx=JSON.parse(localStorage.getItem(index));
   return JSON.parse(localStorage.getItem(prefix+idx.activeId)).character;
  },{index:INDEX,prefix:PREFIX});
  const assertGrades=async(race,grades,free=18)=>{
   await page.locator("[data-race-select]").selectOption(race);
   const s=await read();
   assert.equal(s.race,race);
   for(const [name,grade] of Object.entries(grades))
    assert.equal(s.attributes[name]||0,grade,race+": "+name+" deve ser G"+grade);
   assert.match(await page.locator("#wizard-summary").innerText(),new RegExp("DISPONÍVEIS\\s*"+free+" XP"),race+" saldo");
   return s;
  };
  await page.goto(URL,{waitUntil:"domcontentloaded"});
  await assertGrades("lucker_sangue",{agilidade:1,vigor:1,forca:0,inteligencia:0});
  assert.deepEqual((await read()).racialInitialAttributes.sort(),["agilidade","vigor"]);
  await page.reload({waitUntil:"domcontentloaded"});
  assert.deepEqual((await read()).racialInitialAttributes.sort(),["agilidade","vigor"],"Graus gratuitos persistem");
  await assertGrades("lucker_puro",{agilidade:0,vigor:0,inteligencia:1,destreza:1,influencia:0});
  assert.deepEqual((await read()).racialInitialAttributes.sort(),["destreza","inteligencia"],"Puro tem somente Inteligência e Destreza grátis");
  await assertGrades("runa_espinhos",{vigor:1,forca:1,inteligencia:0,destreza:0,influencia:0,agilidade:0});
  await assertGrades("humano",{forca:0,vigor:0,agilidade:0});
  assert.deepEqual((await read()).racialInitialAttributes,[],"Humano não tem graus raciais gratuitos");

  // O clique "Começar com Agilidade" é uma compra real mesmo antes de
  // confirmar a formação; não pode esperar o próximo passo para o mapa.
  await page.locator('[data-wizard-field="name"]').fill("Iniciativa Humana");
  await page.locator('#wizard-controls [data-action="wizard-next"]').click();
  await page.locator('[data-action="wizard-starter-attr"][data-key="agilidade"]').click();
  assert.equal((await read()).attributes.agilidade,1,"A escolha inicial de Agilidade deve ser compra imediata");
  assert.match(await page.locator("#wizard-summary").innerText(),/17 XP/,"Humano gasta 1 XP ao escolher Agilidade");
  // Escolher outro Atributo inicial substitui a compra anterior, sem empilhar G1.
  await page.locator('[data-action="wizard-starter-back"]').click();
  await page.locator('[data-action="wizard-starter-attr"][data-key="forca"]').click();
  assert.equal((await read()).attributes.agilidade||0,0,"Agilidade deve ser devolvida ao trocar primeira escolha");
  assert.equal((await read()).attributes.forca,1,"Força deve ser o único G1 comprado");
  assert.match(await page.locator("#wizard-summary").innerText(),/17 XP/,"trocar não deve acumular custo");
  await page.locator('[data-action="wizard-starter-back"]').click();
  await page.locator('[data-action="wizard-starter-attr"][data-key="agilidade"]').click();
  assert.equal((await read()).attributes.forca||0,0,"Força antiga não pode ficar comprada involuntariamente");
  assert.equal((await read()).attributes.agilidade,1);
  await page.locator('[data-action="wizard-starter-training"][data-group="practice"][data-key="atletismo"]').click();
  await page.locator('#wizard-controls [data-action="wizard-next"]').click();
  assert.equal(await page.locator('#wizard-content [data-action="wizard-mode"][data-mode="genetic"]').getAttribute("aria-pressed"),"true","Codex Genético deve ser padrão");
  assert.equal(await page.locator("#gene-builder-map").isVisible(),true);
  assert.match(await page.locator('#gene-builder-map .fp-gene-card[data-gene-id="attr:agilidade"]').textContent(),/GRAU 1/);
  assert.match(await page.locator("#wizard-summary").innerText(),/15 XP/);
  await page.locator('[data-action="wizard-mode"][data-mode="list"]').click();
  assert.equal(await page.locator('#wizard-content [data-action="wizard-tab"]').count(),4,"Listas continuam acessíveis");
  await page.locator('[data-action="wizard-mode"][data-mode="genetic"]').click();
  assert.match(await page.locator('#gene-builder-map .fp-gene-card[data-gene-id="attr:agilidade"]').textContent(),/GRAU 1/);

  // Outra ficha: Lucker já tem seus G1 favorecidos sem gastar XP;
  // escolher Agilidade novamente não desconta XP e não duplica grau.
  await page.locator("#start-wizard").click();
  await page.locator("[data-race-select]").selectOption("lucker_sangue");
  await page.locator('[data-wizard-field="name"]').fill("Lucker Ágil");
  await page.locator('#wizard-controls [data-action="wizard-next"]').click();
  await page.locator('[data-action="wizard-starter-attr"][data-key="agilidade"]').click();
  assert.equal((await read()).attributes.agilidade,1);
  assert.equal((await read()).attributes.vigor,1);
  assert.match(await page.locator("#wizard-summary").innerText(),/18 XP/);
  await page.locator('[data-action="wizard-starter-training"][data-group="practice"][data-key="atletismo"]').click();
  await page.locator('#wizard-controls [data-action="wizard-next"]').click();
  assert.match(await page.locator("#wizard-summary").innerText(),/16 XP/);
  assert.equal(await page.locator('#wizard-content [data-action="wizard-mode"][data-mode="genetic"]').getAttribute("aria-pressed"),"true");
  for(const key of ["agilidade","vigor"]){
   const card=page.locator('#gene-builder-map .fp-gene-card[data-gene-id="attr:'+key+'"]');
   assert.match(await card.textContent(),/GRAU 1 · ORIGEM/);
   assert.equal(await page.locator('#gene-builder-map [data-gene-grade="-1"][data-gene-id="attr:'+key+'"]').getAttribute("aria-disabled"),"true","G1 de origem não pode diminuir");
  }

  // Quando se troca de raça antes de concluir, apenas G1 automático
  // anterior é removido; um G2 feito voluntariamente continua comprado.
  await page.locator('#wizard-steps button[data-action="wizard-go"][data-step="0"]').click();
  await page.locator("[data-race-select]").selectOption("lucker_puro");
  const changed=await read();
  assert.equal(changed.attributes.agilidade,1,"Agilidade escolhida pelo jogador permanece como compra normal após mudar de raça");
  assert.equal(changed.attributes.vigor||0,0,"Vigor automático da raça anterior removido");
  assert.equal(changed.attributes.inteligencia,1);
  assert.equal(changed.attributes.destreza,1);
  assert.equal(changed.attributes.influencia||0,0,"Influência não é favorecida pelo Puro");
  assert.deepEqual(changed.racialInitialAttributes.sort(),["destreza","inteligencia"]);
  assert.match(await page.locator("#wizard-summary").innerText(),/15 XP/,"Agilidade escolhida custa 1 XP + Atletismo custa 2 XP");
  // Uma ficha legada da v0.61 identificada pelo marcador de G1 racial
  // é corrigida sem apagar compras manuais de outros Atributos.
  await page.evaluate(({index,prefix})=>{
   const data=JSON.parse(localStorage.getItem(index));
   const key=prefix+data.activeId,payload=JSON.parse(localStorage.getItem(key));
   payload.character.attributes={inteligencia:1,influencia:1,forca:1};
   payload.character.racialInitialAttributes=["inteligencia","influencia"];
   localStorage.setItem(key,JSON.stringify(payload));
  },{index:INDEX,prefix:PREFIX});
  await page.reload({waitUntil:"domcontentloaded"});
  const migrated=await read();
  assert.equal(migrated.attributes.inteligencia,1);
  assert.equal(migrated.attributes.destreza,1,"Corrigir G1 automático antigo de Influência para Destreza");
  assert.equal(migrated.attributes.influencia||0,0,"Remover só Influência G1 marcada como benefício incorreto");
  assert.equal(migrated.attributes.forca,1,"Atributo comprado à parte deve permanecer");
  assert.deepEqual(migrated.racialInitialAttributes.sort(),["destreza","inteligencia"]);
  assert.match(await page.locator("#wizard-summary").innerText(),/15 XP/,"Força 1 + Atletismo 1 devem consumir 3 XP");
  // Um G2 de Influência feito manualmente deve sobreviver à correção.
  await page.evaluate(({index,prefix})=>{
   const idx=JSON.parse(localStorage.getItem(index));
   const key=prefix+idx.activeId,payload=JSON.parse(localStorage.getItem(key));
   payload.character.attributes.influencia=2;
   payload.character.racialInitialAttributes=["inteligencia","influencia"];
   localStorage.setItem(key,JSON.stringify(payload));
  },{index:INDEX,prefix:PREFIX});
  await page.reload({waitUntil:"domcontentloaded"});
  assert.equal((await read()).attributes.influencia,2,"Preservar Influência G2 comprado manualmente");
  assert.equal((await read()).attributes.destreza,1,"Destreza G1 continua concedida");
  assert.deepEqual(errors,[],"Sem erros JavaScript");
  console.log("PASS: pares únicos de G1 por raça, custo racial, substituição de escolha inicial, migração e mapa");
 }finally{await browser.close();}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
