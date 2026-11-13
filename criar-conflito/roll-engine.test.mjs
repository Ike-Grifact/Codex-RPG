import test from "node:test";
import assert from "node:assert/strict";
import {blank,stats} from "./rules.mjs";
import {creaturePool,rollCreatureFaces,previewCreatureRoll,settleCreatureRoll,
 publicJointCost,canDeclareJoint,faceSymbols} from "./roll-engine.mjs";

test("Monstro G1 utiliza d10 e d4, respeitando pool e fontes diferentes",()=>{
 const t=blank("monstro");t.attributes.forca=1;
 const r=creaturePool(t,"forca","vigor");assert.equal(r.ok,true);
 assert.deepEqual(r.pool.map(d=>d.sides),[10,4]);
 assert.equal(creaturePool(t,"forca","forca").ok,false);
 assert.equal(creaturePool(blank("humanoide"),"forca","vigor").ok,false);
});
test("Faces simbólicas corretas, descarte sem Pavor e máximo de dados",()=>{
 const t=blank("monstro");t.attributes.forca=2;t.keep=2;
 const rolled=creaturePool(t,"forca","vigor").pool.map((d,i)=>({...d,face:i===2?3:1}));
 assert.deepEqual(faceSymbols(4,3),[0,0,1]);
 const r=previewCreatureRoll(t,rolled,rolled.slice(0,2).map(d=>d.id),{de:1});
 assert.equal(r.ok,true);
 assert.equal(r.result.p,0,"Pavor do dado descartado não entra na leitura");
 const generated=rollCreatureFaces(rolled,()=>0.999);
 assert(generated.every(d=>d.face===d.sides));
});
test("Gasto local de retenção só acontece na confirmação",()=>{
 const t=blank("monstro");t.attributes.forca=2;t.keep=3;t.pavorLocal=1;
 const rolled=rollCreatureFaces(creaturePool(t,"forca","vigor").pool,()=>0);
 const ids=rolled.map(d=>d.id);
 const preview=previewCreatureRoll(t,rolled,ids,{de:2});
 assert.equal(preview.ok,true);assert.equal(preview.cost,1);
 assert.equal(t.pavorLocal,1,"prévia não debita Pavor");
 const saved=settleCreatureRoll(t,2,3,preview);
 assert.equal(saved.ok,true);assert.equal(saved.unit.pavorLocal,0);
 assert.equal(saved.publicPavor,2);
 assert.equal(preview.result.damage,0);
 assert.equal(preview.result.p,0);
 const insufficient={...t,pavorLocal:0};
 assert.equal(previewCreatureRoll(insufficient,rolled,ids,{de:2}).ok,false);
});
test("Crítico de monstro retém Pavor local, depois público, sem duplicar",()=>{
 const t=blank("monstro");t.attributes.forca=1;
 const rolled=rollCreatureFaces(creaturePool(t,"forca","vigor").pool,()=>0.99999);
 const p=previewCreatureRoll(t,rolled,rolled.map(d=>d.id),{de:1});
 assert.equal(p.ok,true);assert.equal(p.result.critical,2);
 assert.equal(p.criticalPavor,2);
 const out=settleCreatureRoll(t,2,3,p);
 assert.equal(out.unit.pavorLocal,1);
 assert.equal(out.publicPavor,3);
 assert.equal(out.localGain+out.publicGain+out.overflow,2);
 assert.equal(t.pavorLocal,0);
});
test("Pavor público de golpe conjunto segue 1P por aliado de Líder",()=>{
 const leader=blank("monstro"),ally=blank("criatura"),third=blank("monstro");
 leader.leader=true;
 assert.equal(publicJointCost(2),1);
 assert.equal(publicJointCost(3),2);
 assert.equal(publicJointCost(4),null);
 assert.equal(canDeclareJoint([leader,ally,third],2,3).ok,true);
 assert.equal(canDeclareJoint([leader,ally,third],1,3).ok,false);
 assert.equal(canDeclareJoint([ally,third],2,2).ok,false);
 leader.life=0;
 assert.equal(canDeclareJoint([leader,ally,third],2,2).ok,false);
});
test("Conversões de Antecipar não gastam o mesmo símbolo duas vezes",()=>{
 const t=blank("monstro");t.attributes.forca=2;
 const pool=creaturePool(t,"forca","vigor").pool;
 const dice=pool.map((d,i)=>({...d,face:i===0?8:1}));
 const ids=dice.slice(0,2).map(d=>d.id);
 const bad=previewCreatureRoll(t,dice,ids,{de:2,convertPairs:1,passA:true});
 assert.equal(bad.ok,false);
});
