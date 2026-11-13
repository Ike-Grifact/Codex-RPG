import test from "node:test";
import assert from "node:assert/strict";
import {blank,normalize,stats,dice,ledger,encounterSummary,remainingKinds,WEIGHT,quickHumanoid} from "./rules.mjs";

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
 assert.equal(stats(m).life,5);
 assert.equal(stats(m).de,3);
 assert.equal(stats(m).limitLocal,4);
 assert.equal(stats(m).keepMax,3);
 m.keep=3;assert.equal(stats(m).keepCostP,1);
 m.threatGrade=5;assert.equal(stats(m).keepMax,4);
 m.keep=4;assert.equal(stats(m).keepCostP,2);
});
test("Pavor público é independente do local, teto 2 + jogadores",()=>{
 const m=blank("monstro");m.threatGrade=1;m.pavorLocal=8;
 const n=normalize(m);assert.equal(n.pavorLocal,1);
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
 assert.equal(t.pavorLocal,6);
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
 assert.equal(stats(monster).life,6);
 assert.equal(monster.life,3);
 monster.life=6;
 assert.equal(normalize(monster).life,6);
 assert.equal(stats(monster).life,6);
});
