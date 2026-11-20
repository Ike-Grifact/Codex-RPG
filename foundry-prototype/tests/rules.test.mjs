import test from "node:test";
import assert from "node:assert/strict";
import {ATTRIBUTES,KNOWLEDGES,PRACTICES,SKILLS,faceSymbols,sourceDice,sourceLabel,
 buildPool,resolveRoll,compareKeptOptions,starterPurchasePlan,keepLimit,monsterCap,narratorCap,xpLedger,lifeMax,healthByLife,naturalDE,
 maxPP,CREATION_REFERENCE,FACES,SITUATIONS} from "../module/rules.mjs";
import {G1_CATALOG} from "../module/catalog.mjs";
import {faceLabels} from "../module/dice-so-nice.mjs";
import {equippedDie,skillPrerequisite,defenseDE,dodgeDE,dodgeBonus,defenseDisplay,effectiveWeaponRange} from "../module/equipment-logic.mjs";

function human(){return{
 monsterRules:false,level:1,xp:0,skills:["armas-leves"],
 attributes:{forca:1,agilidade:1,destreza:1,inteligencia:0,influencia:0,vigor:1},
 knowledges:{},practices:{armas_conjuracao:1,atletismo:0,artesao:0}
};}
test("catálogo principal não oferece Combat, Armas 1 nem Aprendiz de Conjurador",()=>{
 assert.equal(ATTRIBUTES.length,6);assert.equal(KNOWLEDGES.length,6);assert.equal(PRACTICES.length,6);

 assert.ok(!SKILLS.some(s=>!s.legacy&&["combate","armas","aprendiz"].includes(s.id)));
 assert.ok(SKILLS.some(s=>s.id==="criar-item-foco-magia"));
 assert.ok(!SKILLS.some(s=>s.id==="peritoconj"));
 assert.equal(SKILLS.find(s=>s.id==="conjuracao-equilibrada")?.name,"Conjuração Refinada");
 assert.match(SKILLS.find(s=>s.id==="armas-leves").detail,/1 Coragem/);
 assert.doesNotMatch(SKILLS.find(s=>s.id==="armas-pesadas").detail,/2 Coragens/);
});
test("Recuperação Vigorosa preserva o XP de fichas antigas e aguarda custo definitivo",()=>{
 const skill=SKILLS.find(s=>s.id==="recuperacao-vigorosa");
 assert.equal(skill?.cost,null);
 assert.equal(xpLedger({...human(),skills:[skill.id]}).skills,1);
 const actor=human();
 actor.attributes.vigor=2;
 assert.equal(skillPrerequisite(actor,"recuperacao-vigorosa"),false);
 actor.attributes.vigor=3;
 assert.equal(skillPrerequisite(actor,"recuperacao-vigorosa"),true);
 assert.equal(SKILLS.find(s=>s.id==="recuperacao-movimento").cost,null);
});
test("Runas 3D do d10 não exibem polígonos nem Pavor na face máxima",()=>{
 const labels=faceLabels(10);
 assert.equal(labels.length,10);
 assert.equal(labels[9],"ᛋᛋ ᚨ");
 assert.ok(!labels[9].includes("ᚦ"));
 assert.ok(labels.every(label=>!label.includes(".png")));
 assert.equal(faceLabels(4).length,4);
});
test("SRD v0.44: d10 máximo 2E + 1A sem Pavor em crítico",()=>{
 const dice=[{id:"a",group:"attribute",sides:6,face:1},
 {id:"b",group:"practice",sides:10,face:10},{id:"c",group:"practice",sides:10,face:10}];
 const result=resolveRoll(dice,["b","c"],{de:4});
 assert.equal(result.ok,true);assert.equal(result.critical,2);
 assert.equal(result.reached,4);assert.equal(result.p,0);
 assert.equal(result.aRemaining,2);assert.equal(result.damage,4);
});
test("Perícia revogada não consome XP e Conjuração Refinada mantém ID",()=>{
 const old=human();old.skills=["peritoconj"];
 assert.equal(xpLedger(old).skills,0);
 const renamed=human();renamed.skills=["conjuracao-equilibrada"];
 assert.equal(xpLedger(renamed).skills,1);
 assert.match(SKILLS.find(x=>x.id==="conjuracao-equilibrada").detail,/PENDENTE/i);
});
test("faces simbólicas mantêm a identidade do Codex",()=>{
 for(const n of [4,6,10,12,20])assert.equal(FACES[n].length,n);
 assert.deepEqual(faceSymbols(10,10),[2,1,0]);
 assert.deepEqual(faceSymbols(12,12),[0,0,2]);
 assert.deepEqual(faceSymbols(20,20),[8,0,0]);
});
test("Elevação comum sobe a categoria de um dado e impede ultrapassar d12",()=>{
 const s=human();s.attributes.inteligencia=2;s.knowledges.medicina=1;
 const p={base:{group:"knowledge",key:"medicina"},attribute:{group:"attribute",key:"inteligencia"}};
 const before=buildPool(s,p,{equipmentDie:6});
 const mod=buildPool(s,p,{step:true,stepDieId:"knowledge.medicina.0",equipmentDie:6});
 assert.ok(before.ok&&mod.ok);
 assert.equal(mod.pool.length,before.pool.length);
 assert.deepEqual(mod.pool[0],{id:"knowledge.medicina.0",group:"knowledge",key:"medicina",sides:12,elevated:true});
 const gear=buildPool(s,p,{step:true,stepDieId:"equipment.0",equipmentDie:6});
 assert.ok(gear.ok);
 assert.equal(gear.pool.at(-1).sides,10);
 assert.equal(buildPool(s,p,{step:true}).ok,false,"Não escolher dado automaticamente");
 const higher={...s,knowledges:{medicina:4}};
 const trained=buildPool(higher,p,{step:true,stepDieId:"knowledge.medicina.2"});
 assert.equal(trained.ok,false);
 assert.equal(trained.pool.filter(d=>d.sides===12).length,1);
});
test("Vantagens e Desvantagens são seleção da rolagem, crítico NÃO",()=>{
 assert.deepEqual(Object.keys(SITUATIONS),["superior","advantage","neutral","disadvantage","inferior","luck"]);
 assert.equal(SITUATIONS.superior.e,1);
 assert.equal(SITUATIONS.advantage.a,1);
 assert.equal(SITUATIONS.disadvantage.a,-1);
 assert.equal(SITUATIONS.inferior.e,-1);
 assert.equal(SITUATIONS.luck.e,-2);
});
test("crítico usa somente dados mantidos, sem obrigar Atributo mantido",()=>{
 const dice=[
 {id:"a",group:"attribute",sides:6,face:1},
 {id:"b",group:"practice",sides:10,face:10},
 {id:"c",group:"practice",sides:10,face:10},
 {id:"descartado",group:"equipment",sides:12,face:12}
 ];
 const r=resolveRoll(dice,["b","c"],{de:4,level:1});
 assert.equal(r.ok,true);assert.equal(r.critical,2);assert.equal(r.e,4);assert.equal(r.p,0);assert.equal(r.aRemaining,2);
 assert.equal(r.outcome,"Acerto sem Pavor");
 assert.equal(r.freeCharacteristics,1);assert.equal(r.criticalRefundCourage,1);
});
test("dado descartado não gera Êxito, Antecipar nem Pavor",()=>{
 const a={id:"a",group:"attribute",sides:6,face:6};
 const b={id:"b",group:"practice",sides:10,face:9};
 const discard={id:"c",group:"equipment",sides:12,face:12};
 const r=resolveRoll([a,b,discard],["a","b"],{de:3});
 assert.deepEqual(r.raw,{e:2,a:1,p:1});
 assert.equal(r.p,1);
});
test("crítico com dois d12 máxima pode acertar com Pavor predominante",()=>{
 const d=[
 {id:"a",group:"attribute",sides:12,face:12},
 {id:"b",group:"practice",sides:12,face:12}
 ];
 const r=resolveRoll(d,["a","b"],{de:4});
 assert.equal(r.critical,2);assert.equal(r.e,1);assert.equal(r.p,3);
 assert.equal(r.outcome,"Acerto com Pavor");
});
test("Conversão de Antecipar não reutiliza símbolos",()=>{
 const d=[{id:"a",group:"attribute",sides:10,face:8},{id:"b",group:"practice",sides:12,face:11}];
 const one=resolveRoll(d,["a","b"],{de:3,convertPairs:1,cancelP:1});
 assert.equal(one.ok,true);
 const illegal=resolveRoll(d,["a","b"],{de:3,convertPairs:2,cancelP:1});
 assert.equal(illegal.ok,false);
});
test("Retenção de jogadores e monstros e os tetos de Pavor",()=>{
 assert.equal(keepLimit(1),2);assert.equal(keepLimit(1,true),3);
 assert.equal(keepLimit(6),3);assert.equal(keepLimit(6,true),4);
 assert.equal(keepLimit(1,0,true),2);assert.equal(keepLimit(1,1,true),3);
 assert.equal(keepLimit(2,0,true),2);assert.equal(keepLimit(2,2,true),4);
 assert.equal(keepLimit(5,0,true),2);assert.equal(keepLimit(5,2,true),4);
 assert.equal(monsterCap(1),4);assert.equal(monsterCap(2),5);assert.equal(monsterCap(5),8);assert.equal(monsterCap(6),8);assert.equal(narratorCap(4),6);
});
test("Não cobrar manutenção extra se o jogador escolher menos dados que o teto",()=>{
 const rolled=[{id:"a",group:"attribute",sides:6,face:6},
  {id:"b",group:"practice",sides:10,face:7},
  {id:"c",group:"practice",sides:10,face:8}];
 const noExtra=resolveRoll(rolled,["a","b"],{level:1,extraKeep:true,courage:0,de:2});
 assert.equal(noExtra.ok,true,"Reservar +1 não cobra se não foi usado");
 const extra=resolveRoll(rolled,["a","b","c"],{level:1,extraKeep:true,courage:0,de:2});
 assert.equal(extra.ok,false,"3º dado pago exige Coragem");
});
test("Criatura não humanoide usa d4 no grau 0, d10 no G1, 2d10 no G2",()=>{
 const s={monsterRules:true,attributes:{forca:0,agilidade:1,vigor:2}};
 assert.deepEqual(sourceDice("attribute","forca",s),[4]);
 assert.deepEqual(sourceDice("attribute","agilidade",s),[10]);
 assert.deepEqual(sourceDice("attribute","vigor",s),[10,10]);
 const b=buildPool({...s,skills:[],threatGrade:1},{base:{group:"attribute",key:"vigor"},attribute:{group:"attribute",key:"agilidade"}});
 assert.equal(b.ok,true);assert.equal(b.pool.length,3);
});
test("Compra de XP usa progressões distintas e perícias sem custo inventado",()=>{
 const s=human();const xp=xpLedger(s);
 assert.equal(CREATION_REFERENCE.total,15);
 assert.equal(xp.attributes,4); // Força, Agilidade, Destreza, Vigor em grau 1
 assert.equal(xp.training,2);
 assert.equal(xp.skills,2);
 assert.equal(xp.grant,15);
 assert.equal(naturalDE(s),1); // AGI1 + VIG/2 arred.0 + DES/2 arred.0
 assert.equal(lifeMax(s),5);
 assert.equal(maxPP(1),0);assert.equal(maxPP(5),0);
 assert.equal(skillPrerequisite({...s,practices:{...s.practices,artesao:1}},"criar-item-foco-magia"),false);
});
test("Disciplina com arma habilitada adiciona dado extra, sem aumentar retenção",()=>{
 const s=human(),actor={system:s};
 const item={system:{kind:"weapon",category:"leve",equipped:true,die:6,properties:["Cortante"]}};
 assert.equal(equippedDie(actor,item,"armas"),6);
 const b=buildPool(s,{base:{group:"practice",key:"armas_conjuracao"},attribute:{group:"attribute",key:"forca"}},{mode:"armas",equipmentDie:6});
 assert.equal(b.ok,true);assert.equal(b.pool.length,3);assert.equal(keepLimit(1),2);
});
test("Criar Item de Foco e Magia exige Artesão 1",()=>{
 const s=human();s.skills=["criar-item-foco-magia"];s.attributes.inteligencia=1;
 assert.equal(skillPrerequisite(s,"criar-item-foco-magia"),false);
 s.practices.artesao=1;
 assert.equal(skillPrerequisite(s,"criar-item-foco-magia"),true);
});
test("Catálogo experimental contém arma mista e armaduras G1",()=>{
 const montante=G1_CATALOG.find(x=>x.name==="Montante");
 const rev=G1_CATALOG.find(x=>x.name==="Revólver");
 assert.deepEqual(montante.properties,["Cortante","Contundente","Longa"]);
 assert.deepEqual(rev.properties,["À Distância","Barulhenta"]);
 assert.equal(G1_CATALOG.find(x=>x.name==="Armadura Leve").integrity.max,7);
 assert.equal(G1_CATALOG.find(x=>x.name==="Armadura Média").integrity.max,12);
 assert.equal(G1_CATALOG.find(x=>x.name==="Armadura Pesada").integrity.max,17);
 assert.equal(G1_CATALOG.find(x=>x.name==="Escudo Pesado").integrity.max,4);
});
test("DE do alvo inclui o modificador de armadura em todas as defesas",()=>{
 const s=human();s.attributes.agilidade=2;s.attributes.destreza=2;s.attributes.vigor=2;
 const heavy={type:"equipment",system:{kind:"armor",equipped:true,category:"pesado"}};
 const light={type:"equipment",system:{kind:"armor",equipped:true,category:"leve"}};
 assert.equal(defenseDE({system:s,items:[heavy]}),3); // 2+1+1-1
 assert.equal(defenseDE({system:s,items:[light]}),5);
});

test("Armadura: Muito Leve +2 e Leve +1 na DE geral sem acumular peças",()=>{
 const s=human();s.attributes.agilidade=2;s.attributes.destreza=2;s.attributes.vigor=2;
 const make=(category,equipped=true)=>({type:"equipment",system:{kind:"armor",equipped,category}});
 const normal={system:s,items:[]},veryLight={system:s,items:[make("muito-leve")]},
       light={system:s,items:[make("leve")]},medium={system:s,items:[make("medio")]},
       heavy={system:s,items:[make("pesado")]},extreme={system:s,items:[make("muito-pesado")]},
       stored={system:s,items:[make("muito-leve",false)]};
 assert.equal(defenseDE(normal),4);assert.equal(dodgeDE(normal),4);
 assert.equal(defenseDE(veryLight),6);assert.equal(dodgeBonus(veryLight),2);assert.equal(dodgeDE(veryLight),6);
 assert.equal(defenseDE(light),5);assert.equal(dodgeBonus(light),1);assert.equal(dodgeDE(light),5);
 assert.equal(defenseDE(medium),4);assert.equal(dodgeDE(medium),4);
 assert.equal(defenseDE(heavy),3);assert.equal(dodgeDE(heavy),3);
 assert.equal(defenseDE(extreme),4);assert.equal(dodgeDE(extreme),4); // Vigor e Atletismo ainda não habilitam a peça.
 assert.equal(dodgeDE(stored),4);
 assert.equal(dodgeDE({system:s,items:[make("leve"),make("muito-leve")]}),5,"Não empilhar duas armaduras");
 const displayed=defenseDisplay(veryLight);
 assert.equal(displayed.de,6,"DE final única inclui bônus de Esquiva");
 assert.equal(displayed.calculation,"Natural 4 + 2 (Muito Leve) = 6");
 assert.match(displayed.condition,/todas as defesas/);
 assert.equal(defenseDisplay(light).de,5);
 assert.equal(defenseDisplay(heavy).de,3);
 assert.equal(defenseDisplay(normal).calculation,"Natural 4 · sem modificador = 4");
});
test("Orçamento monstruoso usa tabela da Formação e humanoide novo usa 15 XP compartilhados",()=>{
 const m={monsterRules:true,xp:20,attributes:{forca:1,agilidade:2},skills:[],knowledges:{},practices:{}};
 assert.equal(xpLedger(m).attributes,6); // d10 G1 = 2 XP; 2d10 G2 = 8 XP
 assert.equal(xpLedger(m).grant,20);
 assert.equal(xpLedger(human()).grant,15);
});
test("Capacidade de carga inclui Disciplina, Força, Vigor e Atletismo",async()=>{
 const {loadCapacity}=await import("../module/rules.mjs");
 const s=human();assert.equal(loadCapacity(s),1);
 s.attributes.forca=3;s.attributes.vigor=3;
 s.practices.armas_conjuracao=3;s.practices.atletismo=3;
 assert.equal(loadCapacity(s),5);
});

test("Comparativo de mantidos oferece alternativas sem modificar a rolagem",()=>{
 const dice=[
  {id:"forca",group:"attribute",sides:6,face:6},
  {id:"disciplina",group:"practice",sides:10,face:10},
  {id:"arma",group:"equipment",sides:6,face:3}
 ];
 const original=structuredClone(dice);
 const options=compareKeptOptions(dice,{de:3,level:1,monster:false},5);
 assert.equal(options.length,5);
 assert.ok(options.every(x=>x.ids.length<=2));
 assert.ok(options.some(x=>x.success===true));
 assert.ok(options.some(x=>x.success===false)); // comparador também exibe riscos de falha, não esconde opções
 assert.deepEqual(dice,original);
 assert.ok(options.some(x=>x.p>0));
});
test("Monstro precisa de orçamento informado antes de comprar graus",async()=>{
 const {canSpendXP}=await import("../module/equipment-logic.mjs");
 const monstro={monsterRules:true,xp:0,attributes:{forca:0},skills:[],knowledges:{},practices:{}};
 assert.equal(canSpendXP(monstro,2),false);
 monstro.xp=10;assert.equal(canSpendXP(monstro,2),true);
});

test("Compra inicial guiada cobra apenas os graus obrigatórios ainda ausentes",()=>{
 const fresh={monsterRules:false,xp:0,attributes:{},knowledges:{},practices:{},skills:[]};
 const plan=starterPurchasePlan(fresh,"forca","practice","atletismo");
 assert.equal(plan.ok,true);assert.equal(plan.cost,3);assert.equal(plan.remaining,12);
 assert.deepEqual(plan.changes,{"system.attributes.forca":1,"system.practices.atletismo":1});
 const partial={...fresh,attributes:{forca:1}};
 const middle=starterPurchasePlan(partial,"forca","knowledge","medicina");
 assert.equal(middle.ok,true);assert.equal(middle.cost,2);assert.equal(middle.remaining,12);
 assert.deepEqual(middle.changes,{"system.knowledges.medicina":1});
 const complete={...partial,practices:{atletismo:1}};
 const ready=starterPurchasePlan(complete,"forca","practice","atletismo");
 assert.equal(ready.ok,true);assert.equal(ready.cost,0);assert.equal(ready.complete,true);
 assert.deepEqual(ready.changes,{});
 const monster={...fresh,monsterRules:true};
 assert.equal(starterPurchasePlan(monster,"forca","practice","atletismo").ok,false);
});

test("Pilha aceita a ordem das categorias e exige Atributo entre as fontes",()=>{
 const pc={attributes:{forca:1},practices:{atletismo:1},knowledges:{medicina:1},skills:[]};
 const attribute={group:"attribute",key:"forca"}, practice={group:"practice",key:"atletismo"}, knowledge={group:"knowledge",key:"medicina"};
 for(const base of [attribute,practice,knowledge]){
  for(const second of [attribute,practice,knowledge]){
   const plan=buildPool(pc,{base,second});
   assert.equal(plan.ok,base.group!==second.group&&(base.group==="attribute"||second.group==="attribute"));
   if(plan.ok){
    const rolled=plan.pool.map(die=>({...die,face:die.sides}));
    assert.equal(resolveRoll(rolled,[rolled[0].id]).ok,true);
   }
  }
 }
 assert.equal(buildPool({...pc,monsterHumanoidRules:true},{base:practice,second:knowledge}).ok,false);
 assert.equal(buildPool({...pc,monsterRules:true},{base:practice,second:knowledge}).ok,false);
 assert.equal(buildPool({...pc,monsterRules:true,threatGrade:6},{base:attribute,second:{group:"attribute",key:"vigor"},complement:{group:"attribute",key:"agilidade"}},{contextApproved:true}).ok,false);
});

test("Disciplina Avançada permite um complemento e Manejo Duplo permite duas Disciplinas distintas na pilha",()=>{
 const practice={group:"practice",key:"atletismo"}, knowledge={group:"knowledge",key:"medicina"};
 const discipline={group:"practice",key:"armas_conjuracao"};
 const pc={attributes:{vigor:1},practices:{armas_conjuracao:2,atletismo:1},knowledges:{medicina:1},skills:["disciplina-avancada","armas-leves"]};
 const attribute={group:"attribute",key:"vigor"};
 const three={base:discipline,second:attribute,complement:knowledge};
 assert.equal(buildPool(pc,three,{mode:"armas",contextApproved:true}).ok,true);
 assert.equal(buildPool(pc,three,{mode:"normal",contextApproved:true}).ok,false);
 const duplicate={base:attribute,second:discipline,complement:discipline};
 assert.match(buildPool(pc,{base:discipline,second:{group:"knowledge",key:"alquimia"}},{mode:"armas"}).errors.join(" "),/Disciplina deve ser combinada com um Atributo/);
 assert.equal(buildPool(pc,{base:knowledge,second:discipline},{mode:"armas"}).ok,false);
 assert.equal(buildPool(pc,{base:practice,second:knowledge,complement:discipline},{mode:"armas",contextApproved:true}).ok,false);
 assert.equal(buildPool(pc,duplicate,{mode:"armas",contextApproved:true}).ok,false);
 const dual={...pc,skills:["maestria-manejo-duplo","criar-item-foco-magia"]};
 const plan=buildPool(dual,duplicate,{mode:"armas"});
 assert.equal(plan.ok,true);
 assert.equal(plan.pool.filter(d=>d.key===discipline.key).length,4);
 assert.equal(new Set(plan.pool.map(d=>d.id)).size,plan.pool.length);
 assert.equal(buildPool(dual,duplicate,{mode:"conjuracao"}).ok,false);
 assert.equal(buildPool(dual,{base:discipline,second:discipline},{mode:"armas"}).ok,false);
});

test("v0.46 usa d4 E/A/P/vazio e rolagens anteriores mantêm o d4 original",()=>{
 assert.deepEqual(FACES[4],[[1,0,0],[0,1,0],[0,0,1],[0,0,0]]);
 const die=[{id:"d",sides:4,face:4}];
 assert.equal(resolveRoll(die,["d"]).reached,0);
 assert.equal(resolveRoll(die,["d"],{legacyD4Faces:true}).reached,1);
 const crit=resolveRoll([...die,{id:"outro",sides:4,face:4}],["d","outro"]);
 assert.equal(crit.critical,2);
 assert.equal(crit.e,0);
});
test("Saúde distribui Vida e conta Pavor do estado para DE e anulação",()=>{
 const s=human();s.attributes.forca=2;s.attributes.vigor=2;
 assert.equal(lifeMax(s),7);
 assert.deepEqual(healthByLife(s,3).bands,[3,2,1,1]);
 assert.deepEqual([0,1,2,3,5].map(n=>healthByLife(s,n).id),["morto","inconsciente","incapacitado","ferido","saudavel"]);
 const health=healthByLife(s,2),die=[{id:"d",sides:4,face:2}];
 const risk=resolveRoll(die,["d"],{de:1,health});
 assert.deepEqual([risk.e,risk.p,risk.success,health.coragem],[0,1,true,1]);
 const safe=resolveRoll(die,["d"],{de:1,health,cancelP:1});
 assert.deepEqual([safe.p,safe.success],[0,false]);
});

test("Olhos de Águia amplia apenas alcance de arma elegível e habilitada",()=>{
 const bow={kind:"weapon",range:24,properties:["À Distância"]},shot={kind:"firearm",range:16};
 const s={skills:["olhos-de-aguia","armas-longo-alcance"]};
 assert.equal(effectiveWeaponRange(s,bow),32);
 assert.equal(effectiveWeaponRange(s,shot),16);
 s.skills=["olhos-de-aguia","armas-fogo"];
 assert.equal(effectiveWeaponRange(s,bow),24);
 assert.equal(effectiveWeaponRange(s,shot),24);
 assert.equal(effectiveWeaponRange(s,{kind:"weapon",range:8,properties:["Arremesso"]}),8);
 assert.equal(effectiveWeaponRange(s,{kind:"focus",range:8}),0);
});
test("Foco usa IDs de habilitações elementais sem liberar elementos por analogia",()=>{
 const actor={system:{skills:["criar-item-foco-magia","agua","vento"]}};
 const focus={system:{equipped:true,kind:"focus",die:6}};
 for(const element of ["Psique","Psíquico","Água","Ar","vento"]){
  focus.system.element=element;
  assert.equal(equippedDie(actor,focus,"conjuracao"),6);
 }
 focus.system.element="Terra";
 assert.equal(equippedDie(actor,focus,"conjuracao"),0);
});
