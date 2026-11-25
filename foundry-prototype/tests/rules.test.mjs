import test from "node:test";
import assert from "node:assert/strict";
import {ATTRIBUTES,KNOWLEDGES,PRACTICES,SKILLS,faceSymbols,sourceDice,sourceLabel,
 buildPool,resolveRoll,keepLimit,monsterCap,narratorCap,xpLedger,lifeMax,healthBands,healthByLife,naturalDE,
 maxCourage,CREATION_REFERENCE,FACES,SITUATIONS,isCriticalFace} from "../module/rules.mjs";
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
 assert.deepEqual([1,2,3,4].map(n=>faceSymbols(4,n)),[[1,0,0],[0,1,0],[0,0,1],[0,0,0]]);
 assert.deepEqual(faceSymbols(10,10),[2,0,1]); // distribuição comum do d12
 assert.deepEqual(faceSymbols(12,11),[0,0,3]);
 assert.deepEqual(faceSymbols(20,11),[0,0,3]);
 assert.deepEqual(faceSymbols(20,15),[0,2,3]);
 assert.deepEqual(faceSymbols(12,12),[3,0,0]);
 for(let i=1;i<=12;i++){assert.deepEqual(faceSymbols(20,i),faceSymbols(12,i));if(i<=10)assert.deepEqual(faceSymbols(10,i),faceSymbols(12,i));}
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
 {id:"b",group:"practice",sides:10,face:7},
 {id:"c",group:"practice",sides:10,face:7},
 {id:"descartado",group:"equipment",sides:12,face:12}
 ];
 const r=resolveRoll(dice,["b","c"],{de:4,level:1});
 assert.equal(r.ok,true);assert.equal(r.critical,2);assert.equal(r.e,4);assert.equal(r.p,0);
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
test("crítico com dois d12 máximos gera seis Êxitos",()=>{
 const d=[
 {id:"a",group:"attribute",sides:12,face:12},
 {id:"b",group:"practice",sides:12,face:12}
 ];
 const r=resolveRoll(d,["a","b"],{de:4});
 assert.equal(r.critical,2);assert.equal(r.e,6);assert.equal(r.p,0);
 assert.equal(r.outcome,"Acerto sem Pavor");
});
test("Conversão de Antecipar não reutiliza símbolos",()=>{
 const d=[{id:"a",group:"attribute",sides:10,face:8},{id:"b",group:"practice",sides:12,face:11}];
 const one=resolveRoll(d,["a","b"],{de:3,bonusA:2,convertPairs:1,cancelP:1});
 assert.equal(one.ok,true);
 const illegal=resolveRoll(d,["a","b"],{de:3,bonusA:2,convertPairs:2,cancelP:1});
 assert.equal(illegal.ok,false);
});
test("Retenção de jogadores e monstros e os tetos de Pavor",()=>{
 assert.equal(keepLimit(1),2);assert.equal(keepLimit(1,true),3);
 assert.equal(keepLimit(9),2);assert.equal(keepLimit(9,true),3);
 assert.equal(keepLimit(10),3);assert.equal(keepLimit(10,true),4);
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
 assert.equal(CREATION_REFERENCE.total,15);
 assert.equal(xp.attributes,4); // Força, Agilidade, Destreza, Vigor em grau 1
 assert.equal(xp.training,2);
 assert.equal(xp.skills,2);
 assert.equal(xp.grant,15);
 assert.equal(naturalDE(s),2); // AGI1 + piso((VIG1 + DES1)/2)
 assert.equal(lifeMax(s),5);
 assert.equal(maxCourage(1),10);assert.equal(maxCourage(5),11);assert.equal(maxCourage(10),12);assert.equal(maxCourage(20),13);
 assert.equal(skillPrerequisite({...s,practices:{...s.practices,artesao:1}},"criar-item-foco-magia"),false);
});
test("Vida 4+Vigor+piso(Força/2) e quatro estados com Coragem/Pavor",()=>{
 const s=human();s.attributes.forca=2;s.attributes.vigor=3;
 assert.equal(lifeMax(s),8);
 assert.deepEqual(healthBands(s),[3,3,1,1]);
 assert.deepEqual(healthByLife(s,8),{id:"saudavel",e:0,a:0,p:0,coragem:0});
 assert.deepEqual(healthByLife(s,5),{id:"ferido",e:0,a:-1,p:0,coragem:0});
 assert.deepEqual(healthByLife(s,2),{id:"incapacitado",e:-1,a:0,p:1,coragem:1});
 assert.deepEqual(healthByLife(s,1),{id:"inconsciente",e:-2,a:0,p:2,coragem:2});
 assert.deepEqual(healthByLife(s,0),{id:"morto",e:0,a:0,p:0,coragem:null});
});

test("estado Inconsciente permite alcançar DE por +2P sem Êxito, sob custo de 2 Coragens",()=>{
 const s=human();const hp=healthByLife(s,1);
 assert.equal(hp.coragem,2);
 const rolled=[
  {id:"a",group:"attribute",key:"vigor",sides:4,face:4},
  {id:"t",group:"practice",key:"atletismo",sides:6,face:1}
 ];
 const base=resolveRoll(rolled,["a","t"],{de:2,level:1});
 const risky=resolveRoll(rolled,["a","t"],{
  de:2,level:1,courage:2,bonusP:hp.p,bonusA:hp.a,skillBonusE:hp.e
 });
 assert.equal(base.success,false);
 assert.equal(risky.ok,true);
 assert.equal(risky.success,true);
 assert.equal(risky.e,0);
 assert.equal(risky.p,2);
 assert.equal(risky.reached,2);
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
test("DE do alvo soma modificador de todas as armaduras e mantém teto 12",()=>{
 const s=human();s.attributes.agilidade=2;s.attributes.destreza=2;s.attributes.vigor=2;
 const heavy={type:"equipment",system:{kind:"armor",equipped:true,category:"pesado"}};
 const light={type:"equipment",system:{kind:"armor",equipped:true,category:"leve"}};
 assert.equal(defenseDE({system:s,items:[heavy]}),3); // base1+VIG2+DES/2=1-1
 assert.equal(defenseDE({system:s,items:[light]}),5); // base1+VIG2+DES/2=1+1 da armadura
});


test("Conjuração admite elementos sem comprar Criar Foco",()=>{
 const s=human();s.practices.armas_conjuracao=2;s.attributes.inteligencia=2;
 const sel={base:{group:"practice",key:"armas_conjuracao"},attribute:{group:"attribute",key:"inteligencia"}};
 for(const id of ["fogo","agua","vento","terra","sagrado","sangue","trevas","veneno"]){
  s.skills=[id];
  assert.deepEqual(buildPool(s,sel,{mode:"conjuracao"}).errors,[],id);
 }
});
test("Conjuração sem Perícia elemental e sem Psique permanece bloqueada",()=>{
 const s=human();s.attributes.inteligencia=1;s.skills=[];
 const sel={base:{group:"practice",key:"armas_conjuracao"},attribute:{group:"attribute",key:"inteligencia"}};
 assert.match(buildPool(s,sel,{mode:"conjuracao"}).errors.join(" "),/Perícia elemental ou Criar Item/);
 s.skills=["criar-item-foco-magia"];
 assert.deepEqual(buildPool(s,sel,{mode:"conjuracao"}).errors,[]);
});


test("Face 15 do d20 permite gastar os dois A uma única vez",()=>{
 const rolled=[{id:"a",group:"attribute",sides:20,face:15}];
 const cancelled=resolveRoll(rolled,["a"],{de:1,cancelP:2});
 assert.equal(cancelled.ok,true);assert.deepEqual(cancelled.raw,{e:0,a:2,p:3});
 assert.equal(cancelled.p,1);assert.equal(cancelled.aRemaining,0);
 const converted=resolveRoll(rolled,["a"],{de:4,convertPairs:1});
 assert.equal(converted.ok,true);assert.equal(converted.e,1);assert.equal(converted.p,3);
 assert.equal(converted.aRemaining,0);assert.equal(converted.success,true);
 assert.equal(resolveRoll(rolled,["a"],{de:1,cancelP:1,convertPairs:1}).ok,false);
});


test("Faces críticas por tipo, sem confundir d10/10 com d10/7",()=>{
 for(const [sides,critical] of [[4,4],[6,6],[10,7],[12,12],[20,20]]){
  for(let face=1;face<=sides;face++)assert.equal(isCriticalFace(sides,face),face===critical);
 }
 const dice=[{id:"a",group:"attribute",sides:10,face:10},{id:"b",group:"practice",sides:12,face:12}];
 assert.equal(resolveRoll(dice,["a","b"],{de:1}).critical,0);
 dice[0].face=7;const result=resolveRoll(dice,["a","b"],{de:5});
 assert.equal(result.critical,2);assert.equal(result.e,5);assert.equal(result.p,0);
});

 test("d4: 1 vazio, 2 Antecipar, 3 Temor e 4 Êxito crítico",()=>{
  assert.deepEqual([1,2,3,4].map(n=>faceSymbols(4,n)),[[0,0,0],[0,1,0],[0,0,1],[1,0,0]]);
  assert.equal(isCriticalFace(4,1),false);
  assert.equal(isCriticalFace(4,4),true);
 });
