import test from "node:test";
import assert from "node:assert/strict";
import {ATTRIBUTES,KNOWLEDGES,PRACTICES,faceSymbols,sourceDice,sourceLabel,buildPool,
  resolveRoll,keepLimit,naturalDE,lifeMax,maxPP,affinity,FACES} from "../module/rules.mjs";

const system={
 skills:["armas1","aprendiz","combinacao"],
 attributes:{forca:1,agilidade:4,destreza:3,inteligencia:0,influencia:0,vigor:2},
 knowledges:{alquimia:0,medicina:1},
 practices:{armas_conjuracao:1,apresentacao:0}
};
const attack={base:{group:"practice",key:"armas_conjuracao"},attribute:{group:"attribute",key:"forca"},complement:{group:"practice",key:"apresentacao"}};
const presentation={base:{group:"practice",key:"apresentacao"},attribute:{group:"attribute",key:"forca"},complement:{group:"practice",key:"armas_conjuracao"}};

test("fontes oficiais e Armas/Conjuração compartilhadas",()=>{
 assert.equal(ATTRIBUTES.length,6);assert.equal(KNOWLEDGES.length,6);assert.equal(PRACTICES.length,6);
 assert.equal(PRACTICES.filter(([key])=>key==="armas_conjuracao").length,1);
 assert.deepEqual(sourceDice("practice","armas_conjuracao",system),[10]);
 assert.equal(sourceLabel("practice","armas_conjuracao",system),"Armas / Conjuração");
});
test("faces simbólicas d4, d6, d10, d12 e d20 reforçado G",()=>{
 for(const sides of [4,6,10,12,20])assert.equal(FACES[sides].length,sides);
 assert.deepEqual(faceSymbols(6,5),[0,1,1]);
 assert.deepEqual(faceSymbols(10,9),[1,1,1]);
 assert.deepEqual(faceSymbols(12,11),[1,2,1]);
 assert.deepEqual(faceSymbols(20,16),[0,0,4]);
 assert.deepEqual(faceSymbols(20,20),[8,0,0]);
});
test("base obrigatória, segundo Atributo, terceiro sujeito à Perícia e contexto",()=>{
 assert.equal(buildPool(system,{},{}).ok,false);
 const noContext=buildPool(system,attack,{mode:"armas"});
 assert.ok(noContext.errors.some(e=>e.includes("pertinência")));
 assert.equal(buildPool(system,attack,{mode:"armas",contextApproved:true}).pool.length,3);
 const b=buildPool(system,presentation,{mode:"normal",contextApproved:true});
 assert.equal(b.ok,true);assert.equal(b.pool[0].key,"apresentacao");
 assert.equal(buildPool(system,{...attack,complement:attack.base},{mode:"armas",contextApproved:true}).ok,false);
 assert.equal(buildPool({...system,skills:["armas1"]},attack,{mode:"armas",contextApproved:true}).ok,false);
});
test("mesmo conjunto de dados, porém tipos de ação diferentes pela Base",()=>{
 const x=buildPool(system,attack,{mode:"armas",contextApproved:true});
 const y=buildPool(system,presentation,{mode:"normal",contextApproved:true});
 assert.equal(x.ok,true);assert.equal(y.ok,true);
 assert.deepEqual(x.pool.map(d=>d.sides).sort(),y.pool.map(d=>d.sides).sort());
 assert.notEqual(x.pool[0].key,y.pool[0].key);
});
test("habilitações de armas e magia independentes do grau compartilhado",()=>{
 const data={...system,skills:["aprendiz"]};
 assert.equal(buildPool(data,{base:attack.base,attribute:attack.attribute},{mode:"conjuracao"}).ok,true);
 assert.equal(buildPool(data,{base:attack.base,attribute:attack.attribute},{mode:"armas"}).ok,false);
});
test("limites de retenção por Marco, DE e Vida",()=>{
 assert.equal(keepLimit(1),2);assert.equal(keepLimit(1,true),3);
 assert.equal(keepLimit(6),3);assert.equal(keepLimit(6,true),4);
 assert.equal(naturalDE(system),5);assert.equal(lifeMax(system),5);
 assert.equal(maxPP(1),0);assert.equal(maxPP(5),1);assert.equal(maxPP(10),2);assert.equal(maxPP(20),3);
});
test("Pavor descartado não conta e converter Antecipar tem custo",()=>{
 const dice=[
  {id:"a",group:"attribute",sides:6,face:6},
  {id:"b",group:"practice",sides:10,face:9},
  {id:"c",group:"knowledge",sides:6,face:5}
 ];
 const two=resolveRoll(dice,["a","b"],{de:3,level:1});
 assert.equal(two.raw.p,1); // Pavor do dado descartado c é ignorado
 const all=resolveRoll(dice,["a","b","c"],{de:5,level:1,extraKeep:true,courage:1,convertPairs:1});
 assert.equal(all.ok,true);assert.equal(all.e,3);assert.equal(all.p,2);assert.equal(all.reached,5);
 const clean=resolveRoll(dice,["a","b","c"],{de:5,level:1,extraKeep:true,courage:1,cancelP:2});
 assert.equal(clean.ok,true);assert.equal(clean.p,0);assert.equal(clean.success,false);
 assert.equal(affinity("leve","medio"),1);
});
