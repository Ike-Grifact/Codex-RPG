import test from "node:test";
import assert from "node:assert/strict";
import {ATTRIBUTES,KNOWLEDGES,PRACTICES,SKILLS,faceSymbols,sourceDice,sourceLabel,
 buildPool,resolveRoll,keepLimit,monsterCap,narratorCap,xpLedger,lifeMax,naturalDE,
 maxPP,CREATION_REFERENCE,FACES,SITUATIONS} from "../module/rules.mjs";
import {G1_CATALOG} from "../module/catalog.mjs";
import {equippedDie,skillPrerequisite,defenseDE} from "../module/equipment-logic.mjs";

function human(){return{
 monsterRules:false,level:1,xp:0,skills:["armas-leves"],
 attributes:{forca:1,agilidade:1,destreza:1,inteligencia:0,influencia:0,vigor:1},
 knowledges:{},practices:{armas_conjuracao:1,atletismo:0,artesao:0}
};}
test("catálogo principal não oferece Combat, Armas 1 nem Aprendiz de Conjurador",()=>{
 assert.equal(ATTRIBUTES.length,6);assert.equal(KNOWLEDGES.length,6);assert.equal(PRACTICES.length,6);
 assert.equal(SKILLS.length,39);
 assert.ok(!SKILLS.some(s=>["combate","armas","aprendiz"].includes(s.id)));
 assert.ok(SKILLS.some(s=>s.id==="criar-item-foco-magia"));
});
test("faces simbólicas mantêm a identidade do Codex",()=>{
 for(const n of [4,6,10,12,20])assert.equal(FACES[n].length,n);
 assert.deepEqual(faceSymbols(10,10),[2,0,1]);
 assert.deepEqual(faceSymbols(12,12),[0,0,2]);
 assert.deepEqual(faceSymbols(20,20),[8,0,0]);
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
 const r=resolveRoll(dice,["b","c"],{de:5,level:1});
 assert.equal(r.ok,true);assert.equal(r.critical,2);assert.equal(r.e,5);assert.equal(r.p,1);
 assert.equal(r.outcome,"Acerto neutro (com Pavor mantido)");
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
 assert.equal(keepLimit(5,0,true),2);assert.equal(keepLimit(5,2,true),4);
 assert.equal(monsterCap(1),1);assert.equal(monsterCap(6),6);assert.equal(narratorCap(4),6);
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
 assert.equal(CREATION_REFERENCE.total,20);
 assert.equal(xp.attributes,4); // Força, Agilidade, Destreza, Vigor em grau 1
 assert.equal(xp.training,2);
 assert.equal(xp.skills,2);
 assert.equal(xp.grant,20);
 assert.equal(naturalDE(s),1); // AGI1 + VIG/2 arred.0 + DES/2 arred.0
 assert.equal(lifeMax(s),4);
 assert.equal(maxPP(1),0);assert.equal(maxPP(5),1);
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
 assert.equal(G1_CATALOG.find(x=>x.name==="Armadura Pesada").integrity.max,20);
 assert.equal(G1_CATALOG.find(x=>x.name==="Escudo Pesado").integrity.max,12);
});
test("DE do alvo usa armadura pesada sem aplicar bônus de esquiva Leve automaticamente",()=>{
 const s=human();s.attributes.agilidade=2;s.attributes.destreza=2;s.attributes.vigor=2;
 const heavy={type:"equipment",system:{kind:"armor",equipped:true,category:"pesado"}};
 const light={type:"equipment",system:{kind:"armor",equipped:true,category:"leve"}};
 assert.equal(defenseDE({system:s,items:[heavy]}),3); // 2+1+1-1
 assert.equal(defenseDE({system:s,items:[light]}),4);
});

test("Orçamento monstruoso usa tabela da Formação e humanoide usa 20 XP compartilhados",()=>{
 const m={monsterRules:true,xp:20,attributes:{forca:1,agilidade:2},skills:[],knowledges:{},practices:{}};
 assert.equal(xpLedger(m).attributes,10); // d10 G1 = 2 XP; 2d10 G2 = 8 XP
 assert.equal(xpLedger(m).grant,20);
 assert.equal(xpLedger(human()).grant,20);
});
test("Capacidade de carga inclui Disciplina, Força, Vigor e Atletismo",async()=>{
 const {loadCapacity}=await import("../module/rules.mjs");
 const s=human();assert.equal(loadCapacity(s),1);
 s.attributes.forca=3;s.attributes.vigor=3;
 s.practices.armas_conjuracao=3;s.practices.atletismo=3;
 assert.equal(loadCapacity(s),5);
});
