const {chromium}=require("playwright");
const assert=(ok,msg)=>{if(!ok)throw new Error(msg)};
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1230,height:900}}),errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  const units=[
   {name:"Aprendiz de teste",level:1,life:7,courage:10,attributes:{forca:2,agilidade:1,vigor:1,destreza:1},
    practices:{atletismo:1,armas_conjuracao:1},skills:["armas-leves"],items:[]},
   {name:"Defensor equipado",level:1,life:8,courage:10,attributes:{vigor:0,agilidade:0,destreza:0},
    practices:{atletismo:1},skills:[],items:[
     {id:"armor-1",name:"Roupas Simples",type:"armadura",weight:"muito_leve",max:3,hp:3,equipped:true}
    ]}
  ];
  await page.addInitScript((units)=>{
   localStorage.setItem("codex-rpg-jogadores-index-v1",JSON.stringify({sheets:[{id:"a",name:units[0].name},{id:"b",name:units[1].name}]}));
   for(let i=0;i<2;i++)localStorage.setItem("codex-rpg-jogador-ficha-v1:"+["a","b"][i],JSON.stringify({schema:"codex-jogador-ficha-v1",character:units[i]}));
   Math.random=()=>.99;
  },units);
  await page.goto("http://127.0.0.1:8000/criar-conflito/",{waitUntil:"domcontentloaded"});
  await page.locator("#combat-import-players").click();
  assert(await page.locator("#combat-attacker option").count()===2,"Não importou dois personagens.");
  assert((await page.locator("#combat-panel").innerText()).includes("Integridade"),"Sem resumo de Integridade.");
  await page.locator("#combat-base").selectOption("practice:atletismo");
  await page.locator("#combat-attribute").selectOption("forca");
  await page.locator("#combat-roll").click();
  assert(await page.locator("[data-combat-die]").count()>=2,"Rolagem simbólica ausente.");
  assert(await page.locator("#combat-confirm-roll").isEnabled(),"Prévia contra DE do defensor inválida.");
  await page.locator("#combat-confirm-roll").click();
  assert((await page.locator("#combat-panel").innerText()).includes("Último confronto"),"Resultado não foi registrado.");
  await page.locator("#combat-apply-damage").click();
  assert((await page.locator("#combat-panel").innerText()).includes("1/3")||(await page.locator("#combat-panel").innerText()).includes("1 / 3"),"Integridade não foi reduzida antes de Vida.");
  assert(await page.locator("#combat-apply-damage").isDisabled(),"Dano poderia ser aplicado duas vezes.");
  const persisted=JSON.parse(await page.evaluate(()=>localStorage.getItem("codex-rpg-jogador-ficha-v1:b")));
  assert(persisted.character.items[0].hp===3,"Ficha original foi modificada.");
  await page.reload({waitUntil:"domcontentloaded"});
  assert((await page.locator("#combat-panel").innerText()).includes("Integridade"),"Resumo não persiste no navegador.");
  await page.locator("#add-human-basic").click();
  assert(await page.locator(".cf-armor-panel").count()===1,"Painel de Integridade da PR99 foi perdido.");
  assert(await page.locator("#combat-target option").count()===2,"Ameaça nova não entrou no comparador.");
  assert(errors.length===0,"Erros JavaScript: "+errors.join("; "));
  console.log("PASS: importação múltipla, DE/rolagem, Integridade, dano único, persistência e PR99");
 }finally{await browser.close();}
})().catch(err=>{console.error(err);process.exitCode=1});
