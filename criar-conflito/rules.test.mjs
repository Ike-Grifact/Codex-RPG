import test from "node:test";
import assert from "node:assert/strict";
import {blank,normalize,stats,dice,ledger,encounterSummary,remainingKinds,WEIGHT,quickHumanoid,KINDS,isHumanoidKind,SKILLS,canBuyDomarMedium,canBuyDomarGrande,normalizeCompanions,companionEncounterXP} from "./rules.mjs";

test("Criaturas comuns têm d6 por grau 1; extraordinários d10",()=>{
 const animal=blank("criatura"),monster=blank("monstro");
 animal.attributes.forca=1;monster.attributes.forca=1;
 animal.xp=10;monster.xp=10;
 assert.deepEqual(dice(animal,"forca"),[6]);
 assert.deepEqual(dice(monster,"forca"),[10]);
 assert.equal(ledger(animal).spent,1);assert.equal(ledger(monster).spent,2);
 monster.attributes.agilidade=2;
 assert.deepEqual(dice(monster,"agilidade"),[10,10]);
 assert.equal(ledger(monster).spent,10);
});
test("Humanoide utiliza 20 XP experimentais mais XP extra; Formação compartilhada",()=>{
 const h=blank("humanoide");
 h.attributes.forca=1;h.practices.atletismo=1;
 assert.deepEqual({spent:ledger(h).spent,grant:ledger(h).grant,remaining:ledger(h).remaining},
  {spent:3,grant:20,remaining:17});
 h.xp=4;assert.equal(ledger(h).grant,24);
});
test("Monstro tem Vida, DE e teto local por grau, retenção condicionada",()=>{
 const m=blank("monstro");m.attributes.forca=2;m.attributes.vigor=1;
 m.attributes.agilidade=2;m.attributes.destreza=2;
 m.threatGrade=4;
 assert.equal(stats(m).life,6);
 assert.equal(stats(m).de,3);
 assert.equal(stats(m).limitLocal,7);
 assert.equal(stats(m).keepMax,4); // Decisão posterior: quarto dado liberado desde G2.
 m.keep=3;assert.equal(stats(m).keepCostP,1);
 m.threatGrade=5;assert.equal(stats(m).keepMax,4);
 m.keep=4;assert.equal(stats(m).keepCostP,2);
});
test("Pavor público é independente do local, teto 2 + jogadores",()=>{
 const m=blank("monstro");m.threatGrade=1;m.pavorLocal=8;
 const n=normalize(m);assert.equal(n.pavorLocal,4);
 const data=encounterSummary([n],4);
 assert.equal(data.publicCap,6);assert.equal(data.count,1);
});
test("Carga informa quantidades alternativas leves, médias e pesadas",()=>{
 const h=blank("humanoide");
 assert.deepEqual(remainingKinds(h),{leve:8,medio:2,pesado:1});
 h.items.push({id:"x",name:"Espada",weight:WEIGHT.medio,qty:1});
 assert.deepEqual(remainingKinds(h),{leve:4,medio:1,pesado:0});
});
test("Importação saneia campos e impede grau/capacidade fora do limite",()=>{
 const t=normalize({kind:"monstro",name:"Dragão",threatGrade:99,
  attributes:{forca:20},keep:99,pavorLocal:99,items:[{name:"Pedra",weight:0.5,qty:1}]});
 assert.equal(t.threatGrade,6);
 assert.equal(t.attributes.forca,6);
 assert.equal(t.keep,4);
 assert.equal(t.pavorLocal,8);
 assert.equal(t.items.length,1);
});
test("Humano comum rápido começa com investimento mínimo, saldo livre e Perícias disponíveis",()=>{
 const t=quickHumanoid();
 assert.equal(t.kind,"humanoide");
 assert.equal(t.attributes.forca,1);
 assert.equal(t.practices.armas_conjuracao,1);
 assert.deepEqual({spent:ledger(t).spent,grant:ledger(t).grant,remaining:ledger(t).remaining},
  {spent:3,grant:20,remaining:17});
 assert.equal(t.life,stats(t).life);
 assert.deepEqual(t.skills,[]);
 t.skills.push("armas-leves");
 assert.equal(ledger(t).remaining,15);
 const restored=normalize(t);
 assert.equal(restored.skills.includes("armas-leves"),true);
 assert.equal(restored.practices.armas_conjuracao,1);
});
test("Vida atual pode ser inferior ao máximo calculado sem alterar os graus",()=>{
 const monster=blank("monstro");
 monster.attributes.forca=5;
 monster.attributes.vigor=1;
 assert.equal(stats(monster).life,7);
 assert.equal(monster.life,4);
 monster.life=6;
 assert.equal(normalize(monster).life,6);
 assert.equal(stats(monster).life,7);
});

test("NPC DNA conserva Combate e Armas 1 com XP oficial da Ficha",()=>{
 const n=quickHumanoid();n.skills=["combate","armas"];
 const copy=normalize(n);
 assert.deepEqual(copy.skills,["combate","armas"]);
 assert.equal(ledger(copy).skills,3);
 assert.equal(ledger(copy).spent,6);
 assert.equal(ledger(copy).remaining,14);
});


test("Os três tipos novos de ameaça possuem custos distintos sem alterar históricos",()=>{
 assert.deepEqual(Object.keys(KINDS),["humanoide","monstro","humanoide-monstro"]);
 const human=blank("humanoide"),beast=blank("monstro"),hybrid=blank("humanoide-monstro");
 for(const unit of [human,beast,hybrid])unit.attributes.forca=1;
 assert.equal(ledger(human).attrs,1);
 assert.equal(ledger(beast).attrs,2);
 assert.equal(ledger(hybrid).attrs,2);
 assert.deepEqual(dice(beast,"forca"),[10]);
 assert.deepEqual(dice(hybrid,"forca"),[6],"Tabela de XP não inventa dado extraordinário para Humanoide Monstro");
 assert.equal(ledger(human).grant,20);
 assert.equal(ledger(hybrid).grant,0,"Orçamento monstruoso é fornecido pelo Narrador, não gera 20 XP automáticos");
 assert.equal(ledger(beast).grant,0);
 human.practices.atletismo=1;hybrid.practices.atletismo=1;
 human.knowledges.protecao=1;hybrid.knowledges.protecao=1;
 assert.equal(ledger(hybrid).training,4);
 assert.equal(ledger(human).training,4);
 hybrid.skills=["montar"];hybrid.xp=20;hybrid.attributes.influencia=2;
 assert.equal(ledger(hybrid).attrs,10);
 assert.equal(ledger(hybrid).skills,2);
 assert.equal(ledger(hybrid).spent,16);
 assert.equal(ledger(hybrid).remaining,4);
 const saved=normalize(hybrid);
 assert.equal(saved.kind,"humanoide-monstro");
 assert.deepEqual(saved.skills,["montar"]);
 const legacy=normalize({...blank("criatura"),attributes:{forca:1}});
 assert.equal(legacy.kind,"criatura");
 assert.equal(ledger(legacy).attrs,1);
 assert.deepEqual(dice(legacy,"forca"),[6]);
 assert.equal(isHumanoidKind(saved.kind),true);
 assert.equal(isHumanoidKind(beast.kind),false);
});
test("Perito Conjurador não é mais comprável por qualquer tipo de ameaça",()=>{
 const npc=normalize({...blank("humanoide"),skills:["peritoconj"]});
 const hybrid=normalize({...blank("humanoide-monstro"),skills:["peritoconj"]});
 assert.deepEqual(npc.skills,[]);
 assert.deepEqual(hybrid.skills,[]);
 assert.equal(SKILLS.some(x=>x.id==="peritoconj"),false);
});
test("Retenção por Grau do inimigo: G1 até 3, G2+ até 4; custos P não gratuitos",()=>{
 const m=blank("monstro");
 assert.equal(stats(m).keepBase,2);
 assert.equal(stats(m).keepMax,3);
 m.keep=4;
 assert.equal(normalize(m).keep,3);
 m.threatGrade=2;
 assert.equal(stats(m).keepMax,4);
 assert.equal(stats(m).limitLocal,5);
 m.keep=4;
 assert.equal(stats(m).keepCostP,2);
 assert.equal(normalize(m).keep,4);
 for(const g of [3,4,5,6]){m.threatGrade=g;assert.equal(stats(m).keepMax,4);}
 const npc=blank("humanoide");
 npc.level=20; // O nível do personagem não adianta o Grau da ameaça.
 assert.equal(stats(npc).keepBase,2);
 assert.equal(stats(npc).keepMax,3);
 npc.level=1;npc.threatGrade=2;
 assert.equal(stats(npc).keepBase,3);
 assert.equal(stats(npc).keepMax,4);
 const mixed=blank("humanoide-monstro");
 mixed.threatGrade=2;
 assert.equal(stats(mixed).keepBase,3);
 assert.equal(stats(mixed).keepMax,4);
 assert.equal(stats(mixed).keepCostP,0);
});
test("Grau 2 equivale ao nível 5 de jogador como referência, sem modificar o nível ou XP",()=>{
 const npc=blank("humanoide-monstro");
 npc.threatGrade=2;npc.level=1;npc.xp=30;
 const st=stats(npc);
 assert.equal(st.playerEquivalentLevel,5);
 assert.equal(st.keepMax,4);
 assert.equal(npc.level,1);
 assert.equal(npc.xp,30);
 const high=normalize({...npc,level:20});
 assert.equal(stats(high).playerEquivalentLevel,5);
 assert.equal(stats(high).keepMax,4);
 for(const grade of [1,3,4,5,6]){
  npc.threatGrade=grade;
  assert.equal(stats(npc).playerEquivalentLevel,null);
 }
});

test("XP de companheiros domesticados preserva limites e valores pendentes",()=>{
 const given={pequena:{count:2,xpTotal:19},media:{count:1,xpTotal:""},grande:{count:7,xpTotal:44}};
 const x=companionEncounterXP(given,4);
 assert.deepEqual([x.count,x.xp],[7,63]);
 assert.deepEqual(x.missing,["media"]);
 assert.equal(x.normalized.grande.count,4);
 assert.equal(companionEncounterXP(given,0).count,0);
 assert.deepEqual(companionEncounterXP({pequena:{count:1,xpTotal:0}},2).missing,["pequena"]);
 assert.equal(SKILLS.find(s=>s.id==="domar-criatura-pequena")?.cost,1);
});
test("Domar Pequena, Média e Grande custam 1 XP cada",()=>{
 const names=["domar-criatura-pequena","domar-criatura-media","domar-criatura-grande"];
 for(const id of names)assert.equal(SKILLS.find(s=>s.id===id)?.cost,1);
 const humanoid=blank("humanoide");
 humanoid.skills=names;
 assert.equal(ledger(humanoid).skills,3);
});

test("Invocação Elemental comprável por 1 XP, sem compra de elementos ou Domar implícita",()=>{
 const summon=SKILLS.filter(s=>s.id==="invocacao-elemental");
 assert.equal(summon.length,1);
 assert.equal(summon[0].cost,1);
 const h=blank("humanoide");
 h.skills=["invocacao-elemental"];
 assert.equal(ledger(h).skills,1);
 // A elegibilidade é validada no criador e na ficha de Criar Conflito;
 // ledger apenas registra custo da Perícia existente.
});


test("Concentração Refinada custa 1 XP no catálogo de humanoides, sem nova compra de Antecipação",()=>{
 const item=SKILLS.filter(x=>x.id==="concentracao-refinada");
 assert.equal(item.length,1);
 assert.equal(item[0].cost,1);
 assert.ok(item[0].detail.includes("Disciplina 2"));
 assert.ok(item[0].detail.includes("8 metros"));
 assert.equal(SKILLS.some(x=>x.id==="antecipacao"),false);
 const npc=blank("humanoide");npc.practices.armas_conjuracao=2;
 npc.skills=["concentracao-refinada"];
 assert.equal(ledger(npc).skills,1);
 assert.equal(ledger(npc).spent,9); // Disciplina 2 (8 XP acumulados) + Perícia 1 XP.
 const restored=normalize(npc);
 assert.ok(restored.skills.includes("concentracao-refinada"));
});


test("Olhos de Águia: custo 1 XP e descrição exige Destreza 3, Disciplina 3 e especialização alternativa",()=>{
 const perks=SKILLS.filter(s=>s.id==="olhos-de-aguia");
 assert.equal(perks.length,1);
 assert.equal(perks[0].cost,1);
 assert.match(perks[0].detail,/Destreza 3/);
 assert.match(perks[0].detail,/Disciplina 3/);
 assert.match(perks[0].detail,/OU Armas de Fogo/);
 assert.match(perks[0].detail,/8 m/);
 const npc=blank("humanoide");
 npc.attributes.destreza=3;
 npc.practices.armas_conjuracao=3;
 npc.skills=["armas-fogo","olhos-de-aguia"];
 const actual=ledger(npc);
 assert.equal(actual.skills,4); // 3 XP em Armas de Fogo + 1 XP em Olhos de Águia.
 assert.equal(normalize(npc).skills.includes("olhos-de-aguia"),true);
});

test("Domar Média exige Domar Pequena e Influência 3, Inteligência 1, Apresentação 1",()=>{
 const t=blank("humanoide");
 t.attributes.influencia=3;t.attributes.inteligencia=1;t.practices.apresentacao=1;
 assert.equal(canBuyDomarMedium(t),false);
 t.skills=["domar-criatura-pequena"];
 assert.equal(canBuyDomarMedium(t),true);
 assert.equal(SKILLS.find(x=>x.id==="domar-criatura-media")?.cost,1);
 assert.match(SKILLS.find(x=>x.id==="domar-criatura-media")?.detail||"",/Domar Criatura Pequena/);
 t.attributes.influencia=2;assert.equal(canBuyDomarMedium(t),false);
 t.attributes.influencia=3;t.practices.apresentacao=0;assert.equal(canBuyDomarMedium(t),false);
});

test("Domar Grande exige explicitamente Pequena e Média, sem novas cobranças",()=>{
 const t=blank("humanoide");
 t.attributes.influencia=4;t.attributes.inteligencia=1;t.practices.apresentacao=1;
 assert.equal(canBuyDomarGrande(t),false,"não pode comprar Grande sem antecedente");
 t.skills=["domar-criatura-pequena"];
 assert.equal(canBuyDomarGrande(t),false,"falta Média");
 t.skills=["domar-criatura-media"];
 assert.equal(canBuyDomarGrande(t),false,"falta Pequena");
 t.skills=["domar-criatura-pequena","domar-criatura-media"];
 assert.equal(canBuyDomarGrande(t),true);
 assert.equal(SKILLS.find(x=>x.id==="domar-criatura-grande")?.cost,1);
 assert.match(SKILLS.find(x=>x.id==="domar-criatura-grande")?.detail||"",/Domar Criatura Pequena/);
 assert.match(SKILLS.find(x=>x.id==="domar-criatura-grande")?.detail||"",/Domar Criatura Média/);
 t.attributes.influencia=3;assert.equal(canBuyDomarGrande(t),false);
 t.attributes.influencia=4;t.practices.apresentacao=0;assert.equal(canBuyDomarGrande(t),false);
});
