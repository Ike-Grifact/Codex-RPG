import test from "node:test";
import assert from "node:assert/strict";
import {ATTRIBUTES,KNOWLEDGES,PRACTICES,SKILLS,faceSymbols,sourceDice,sourceLabel,
 buildPool,elevationChoices,resolveRoll,keepLimit,monsterCap,narratorCap,xpLedger,lifeMax,naturalDE,
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
 assert.equal(SKILLS.length,38); // catálogo existente na main: o fluxo de rolagem não altera Perícias
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
 assert.equal(CREATION_REFERENCE.total,19);
 assert.equal(xp.attributes,4); // Força, Agilidade, Destreza, Vigor em grau 1
 assert.equal(xp.training,2);
 assert.equal(xp.skills,2);
 assert.equal(xp.grant,19);
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

test("seleção livre: categorias diferentes nas duas fontes básicas",()=>{
 const s=human();
 for(const pair of [
  [{group:"attribute",key:"forca"},{group:"knowledge",key:"medicina"}],
  [{group:"knowledge",key:"medicina"},{group:"attribute",key:"forca"}],
  [{group:"attribute",key:"forca"},{group:"practice",key:"atletismo"}],
  [{group:"knowledge",key:"medicina"},{group:"practice",key:"atletismo"}],
  [{group:"practice",key:"atletismo"},{group:"knowledge",key:"medicina"}]
 ])assert.equal(buildPool(s,{base:pair[0],attribute:pair[1]}).ok,true);
 for(const pair of [
  [{group:"attribute",key:"forca"},{group:"attribute",key:"agilidade"}],
  [{group:"knowledge",key:"medicina"},{group:"knowledge",key:"protecao"}],
  [{group:"practice",key:"atletismo"},{group:"practice",key:"furtividade"}]
 ])assert.equal(buildPool(s,{base:pair[0],attribute:pair[1]}).ok,false);
 const noAttribute=buildPool(s,{base:{group:"knowledge",key:"medicina"},attribute:{group:"practice",key:"atletismo"}});
 const dice=noAttribute.pool.map(d=>({...d,face:1}));
 assert.equal(resolveRoll(dice,dice.map(d=>d.id),{de:0}).ok,true);
});
test("Disciplina Avançada habilita terceira fonte sem repetir Disciplina",()=>{
 const s=human();s.skills.push("disciplina-avancada");s.practices.armas_conjuracao=2;
 const discipline={group:"practice",key:"armas_conjuracao"};
 const strength={group:"attribute",key:"forca"};
 const knowledge={group:"knowledge",key:"medicina"};
 assert.equal(buildPool(s,{base:strength,attribute:discipline,complement:knowledge},{mode:"armas",contextApproved:true}).ok,true);
 assert.equal(buildPool(s,{base:discipline,attribute:strength,complement:strength},{mode:"armas",contextApproved:true}).ok,false);
 assert.equal(buildPool(s,{base:discipline,attribute:strength,complement:discipline},{mode:"armas",contextApproved:true}).ok,false);
 assert.equal(buildPool(s,{base:strength,attribute:knowledge,complement:{group:"practice",key:"furtividade"}},{mode:"normal",contextApproved:true}).ok,false);
});
test("Manejo Duplo é a exceção para exatamente duas Disciplina",()=>{
 const s=human();s.skills.push("maestria-manejo-duplo");
 const d={group:"practice",key:"armas_conjuracao"},a={group:"attribute",key:"forca"};
 const pair=buildPool(s,{base:d,attribute:d},{mode:"armas"});
 assert.equal(pair.ok,true);assert.equal(new Set(pair.pool.map(x=>x.id)).size,pair.pool.length);
 const triple=buildPool(s,{base:d,attribute:a,complement:d},{mode:"armas",contextApproved:true});
 assert.equal(triple.ok,true);assert.equal(new Set(triple.pool.map(x=>x.id)).size,triple.pool.length);
 assert.equal(buildPool(s,{base:d,attribute:d,complement:d},{mode:"armas",contextApproved:true}).ok,false);
});
test("criatura de Grau 1 pode compor três Atributos distintos",()=>{
 const s={monsterRules:true,threatGrade:1,skills:[],attributes:{forca:1,agilidade:1,vigor:1}};
 const pool=buildPool(s,{base:{group:"attribute",key:"forca"},attribute:{group:"attribute",key:"agilidade"},complement:{group:"attribute",key:"vigor"}},{contextApproved:true});
 assert.equal(pool.ok,true);assert.equal(pool.pool.length,3);
 assert.equal(buildPool(s,{base:{group:"attribute",key:"forca"},attribute:{group:"attribute",key:"agilidade"},complement:{group:"attribute",key:"forca"}},{contextApproved:true}).ok,false);
});

test("grau temporário na aptidão: sequência completa, sem alterar compras ou custo",()=>{
 const s=human(),a={group:"attribute",key:"forca"},p={group:"practice",key:"atletismo"};
 const sel={base:a,attribute:p};
 for(const [grade,expected] of [[0,[6]],[1,[6,6]],[2,[6,6,6]],[3,[6,6,10]],[4,[6,10,10]],[5,[10,10,10]]]){
  s.attributes.forca=grade;
  const r=buildPool(s,sel,{step:true,stepSourceId:"attribute.forca"});
  assert.equal(r.ok,true,r.errors.join(" "));
  assert.deepEqual(r.pool.slice(0,expected.length).map(x=>x.sides),expected);
  assert.equal(s.attributes.forca,grade);
 }
 for(const [grade,expected] of [[0,[10]],[1,[10,10]],[2,[10,10,10]],[3,[10,10,12]],[4,[10,12,12]],[5,[12,12,12]]]){
  s.practices.atletismo=grade;
  const r=buildPool(s,sel,{step:true,stepSourceId:"practice.atletismo"});
  assert.equal(r.ok,true,r.errors.join(" "));
  assert.deepEqual(r.pool.slice(-expected.length).map(x=>x.sides),expected);
  assert.equal(s.practices.atletismo,grade);
 }
 s.practices.atletismo=6;
 assert.equal(elevationChoices(s,sel).some(x=>x.id==="practice.atletismo"),false);
 assert.equal(buildPool(s,sel,{step:true,stepSourceId:"practice.atletismo"}).ok,false);
 assert.equal(buildPool(s,sel,{step:true}).ok,false);
});
test("terceira fonte habilitada não exige confirmação extra do narrador",()=>{
 const s=human();s.skills.push("disciplina-avancada");s.practices.armas_conjuracao=2;
 const sel={base:{group:"attribute",key:"forca"},attribute:{group:"practice",key:"armas_conjuracao"},
  complement:{group:"knowledge",key:"medicina"}};
 assert.equal(buildPool(s,sel,{mode:"armas"}).ok,true);
 s.skills=s.skills.filter(id=>id!=="disciplina-avancada");
 assert.equal(buildPool(s,sel,{mode:"armas"}).ok,false);
});
