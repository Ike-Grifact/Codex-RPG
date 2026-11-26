import test from "node:test";
import assert from "node:assert/strict";
import {resolveRoll as web} from "./codex-rules.mjs";
import {resolveRoll as foundry} from "../foundry-prototype/module/rules.mjs";

for (const [name,resolve] of [["web",web],["foundry",foundry]]) {
 test(name+" — recuperação de crítico 1/2/2 e dano ×2 em 4d20",()=>{
  for(const n of [2,3,4]){
   const dice=Array.from({length:n},(_,i)=>({id:String(i),group:i===0?"attribute":"practice",sides:20,face:20}));
   const ids=dice.map(d=>d.id);
   for(const hostile of [false,true]){
    const r=resolve(dice,ids,{de:1,level:10,extraKeep:n===4,hostile,enemyKeepLimit:4});
    assert.equal(r.ok,true);
    assert.equal(r.critical,n);
    const reward=n===2?1:2;
    assert.equal(r.criticalRefundCourage,hostile?0:reward);
    assert.equal(r.monsterCriticalPavor,hostile?reward:0);
    assert.equal(r.damage,(6*n+(n>=3?1:0))*(n===4?2:1));
   }
   const m=resolve(dice,ids,{de:1,monster:true,threatGrade:6,extraKeep:n===4?2:n===3?1:false});
   assert.equal(m.monsterCriticalPavor,n===2?1:2);
  }
  const dice=Array.from({length:4},(_,i)=>({id:String(i),group:i===0?"attribute":"practice",sides:20,face:20}));
  const r=resolve(dice,dice.map(d=>d.id),{de:1,level:10,extraKeep:true,convertPairs:4});
  assert.equal(r.ok,true);assert.equal(r.damage,58);assert.equal(r.aRemaining,1);
 });
}
