import test from "node:test";
import assert from "node:assert/strict";
import {CREATION_REFERENCE,MAGIC_GRADE_DIE,buildPool,naturalDE,xpLedger} from "../module/rules.mjs";
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

test("v0.89: magia recebe somente um dado do Grau e nunca do foco",()=>{
 assert.deepEqual(MAGIC_GRADE_DIE,{1:6,2:10,3:12});
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
 const unresolved=buildPool(s,selection,{mode:"conjuracao",magicGrade:4});
 assert.equal(unresolved.ok,false,"não presumir dado do G4");
});

test("v0.89: Roupas Simples/Muito Leve dão +2 DE sem duplicação",()=>{
 const system=character();
 const armor={type:"equipment",system:{kind:"armor",equipped:true,category:"muito-leve"}};
 assert.equal(defenseDE({system,items:[armor]}),4);
 assert.equal(defenseDE({system,items:[]}),2);
});
