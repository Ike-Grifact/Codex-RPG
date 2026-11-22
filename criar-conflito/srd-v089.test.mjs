import test from "node:test";
import assert from "node:assert/strict";
import {CREATION_REFERENCE,MAGIC_GRADE_DIE,buildPool,naturalDE,xpLedger} from "./codex-rules.mjs";
import {blank,ledger,stats} from "./rules.mjs";

const human=()=>({
 monsterRules:false,xp:0,attributes:{inteligencia:2,agilidade:1,vigor:1,destreza:1},
 practices:{armas_conjuracao:1,atletismo:0},knowledges:{},skills:["fogo"]
});
const selection={base:{group:"practice",key:"armas_conjuracao"},attribute:{group:"attribute",key:"inteligencia"}};

test("v0.89: XP inicial, DE humana e monstros",()=>{
 assert.equal(CREATION_REFERENCE.total,15);
 assert.equal(xpLedger(human()).grant,15);
 assert.equal(naturalDE(human()),2);
 const npc=blank("humanoide");npc.attributes.agilidade=1;npc.attributes.vigor=1;npc.attributes.destreza=1;
 assert.equal(ledger(npc).grant,15);
 assert.equal(stats(npc).de,2);
 const monster=blank("monstro");monster.attributes.agilidade=1;monster.attributes.vigor=1;monster.attributes.destreza=1;
 assert.equal(stats(monster).de,1,"monstros não humanoides conservam fórmula própria");
});

test("v0.89: G1 d6, G2 d10, G3 d12; foco nunca acumula outro dado",()=>{
 assert.deepEqual(MAGIC_GRADE_DIE,{1:6,2:10,3:12});
 for(const [g,d] of [[1,6],[2,10],[3,12]]){
  const r=buildPool(human(),selection,{mode:"conjuracao",magicGrade:g,equipmentDie:12});
  assert.equal(r.ok,true,r.errors.join("; "));
  assert.equal(r.pool.find(x=>x.group==="magic")?.sides,d);
  assert.equal(r.pool.length,4);
  assert.equal(r.pool.filter(x=>x.group==="equipment").length,0);
 }
 assert.equal(buildPool(human(),selection,{mode:"conjuracao",magicGrade:4}).ok,false);
});
