import test from "node:test";
import assert from "node:assert/strict";
import {CREATION_REFERENCE,MAGIC_GRADE_DIE,MAGIC_GRADE_DICE,buildPool,naturalDE,xpLedger} from "../module/rules.mjs";
import {equippedDie,defenseDE} from "../module/equipment-logic.mjs";

const character=()=>({
 monsterRules:false,level:1,xp:0,
 attributes:{inteligencia:2,agilidade:1,vigor:1,destreza:1},
 practices:{armas_conjuracao:1,atletismo:0},knowledges:{},skills:["fogo"]
});
const selection={base:{group:"practice",key:"armas_conjuracao"},attribute:{group:"attribute",key:"inteligencia"}};

test("v0.89: 15 XP compartilhados; Vig+Des juntos na DE",()=>{
 assert.equal(CREATION_REFERENCE.total,15);
 assert.equal(xpLedger(character()).grant,15);
 assert.equal(naturalDE(character()),2);
 assert.equal(naturalDE({...character(),attributes:{agilidade:1,vigor:3,destreza:1}}),3);
});

test("v0.89: magia recebe dados do Grau e nunca do foco",()=>{
 assert.deepEqual(MAGIC_GRADE_DIE,{1:6,2:10,3:12});
 assert.deepEqual(MAGIC_GRADE_DICE,{1:[6],2:[10],3:[12],4:[12,12]});
 const s=character();
 const focus={type:"equipment",system:{kind:"focus",equipped:true,die:12,element:"fogo"}};
 assert.equal(equippedDie({system:s,items:[focus]},focus,"conjuracao"),0);
 for(const [grau,dado] of [[1,6],[2,10],[3,12]]){
  const r=buildPool(s,selection,{mode:"conjuracao",magicGrade:grau,equipmentDie:12});
  assert.equal(r.ok,true,r.errors.join("; "));
  assert.equal(r.pool.filter(d=>d.group==="magic").length,1);
  assert.equal(r.pool.find(d=>d.group==="magic").sides,dado);
  assert.equal(r.pool.length,4,"Disciplina 1 + Inteligência 2 + 1 dado de magia");
 }
 assert.equal(buildPool(s,selection,{mode:"conjuracao",magicGrade:4}).ok,false,"G4 sem segundo elemento é inválida");
 s.skills.push("terra");
 const g4=buildPool(s,selection,{mode:"conjuracao",magicGrade:4,magicElement:"fogo",magicSecondElement:"terra",equipmentDie:12});
 assert.equal(g4.ok,true,g4.errors.join("; "));
 assert.deepEqual(g4.pool.filter(x=>x.group==="magic").map(x=>x.sides),[12,12]);
 assert.equal(g4.pool.length,5,"Disciplina1 + Inteligência2 + 2d12");
 assert.equal(g4.pool.filter(x=>x.group==="equipment").length,0);
 assert.equal(buildPool(s,selection,{mode:"conjuracao",magicGrade:4,magicElement:"fogo",magicSecondElement:"fogo"}).ok,false,"G4 requer elementos distintos");
});

test("v0.89: Roupas Simples/Muito Leve dão +2 DE sem duplicação",()=>{
 const system=character();
 const armor={type:"equipment",system:{kind:"armor",equipped:true,category:"muito-leve"}};
 assert.equal(defenseDE({system,items:[armor]}),4);
 assert.equal(defenseDE({system,items:[]}),2);
});
