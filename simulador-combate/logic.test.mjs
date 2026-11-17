import test from "node:test";
import assert from "node:assert/strict";
import {WIDTH,HEIGHT,initialScenario,cellKey,lineOfSight,distance,movementAllowance,shortestPath,plannedMove,
 defenseWithStance,dodgeBonus,armorPenalty,validateTerrain} from "./logic.mjs";

test("Mapa 20×12: distância euclidiana mostrada sem arredondamento de regras",()=>{
 assert.equal(WIDTH,20);assert.equal(HEIGHT,12);assert.equal(distance({x:0,y:0},{x:3,y:4}),5);
});
test("Parede interrompe linha de visão; cobertura parcial só sinaliza Narrador",()=>{
 const start={x:1,y:2},end={x:8,y:2},terrain={};
 assert.deepEqual(lineOfSight(start,end,terrain),{clear:true,cover:false,reason:"Linha de visão desobstruída."});
 terrain[cellKey(3,2)]="cobertura";
 const partial=lineOfSight(start,end,terrain);
 assert.equal(partial.clear,true);assert.equal(partial.cover,true);
 terrain[cellKey(5,2)]="parede";
 const blocked=lineOfSight(start,end,terrain);
 assert.equal(blocked.clear,false);
 assert.match(blocked.reason,/Parede/);
});
test("Movimento ortogonal respeita paredes, casas ocupadas e limite por rodada",()=>{
 const unit={id:"u",x:1,y:1,moved:0,attributes:{agilidade:2},practices:{atletismo:3}};
 assert.equal(movementAllowance(unit),11);
 const terrain={[cellKey(2,1)]:"parede"};
 const route=shortestPath(unit,{x:4,y:1},terrain,[unit]);
 assert.equal(route.length-1,5);
 assert.equal(plannedMove(unit,{x:4,y:1},terrain,[unit]).ok,true);
 assert.equal(plannedMove(unit,{x:3,y:1},terrain,[unit,{id:"occupied",x:3,y:1}]).ok,false);
 unit.moved=8;assert.equal(plannedMove(unit,{x:4,y:1},terrain,[unit]).ok,false);
});
test("Armaduras alteram todas as defesas sem bônus duplicado na esquiva; teto absoluto 12",()=>{
 const veryLight={equipped:true,weight:"muito_leve",max:0,integrity:0};
 const light={equipped:true,weight:"leve",max:7,integrity:7};
 assert.equal(dodgeBonus(veryLight),2);
 assert.equal(defenseWithStance(0,veryLight,"normal"),2);
 assert.equal(defenseWithStance(0,veryLight,"esquiva"),2);
 assert.equal(defenseWithStance(0,light,"normal"),1);
 assert.equal(defenseWithStance(0,light,"esquiva"),1);
 assert.equal(defenseWithStance(30,veryLight,"normal"),11,"teto natural 9 antes da armadura");
 assert.ok(defenseWithStance(30,veryLight,"normal")<=12);
 assert.equal(armorPenalty({equipped:true,weight:"alto"}),1);
 assert.equal(defenseWithStance(5,{equipped:true,weight:"alto"},"normal"),4);
});
test("Cenário tem terreno importável, sem exigir combate automático",()=>{
 const s=initialScenario();assert.equal(s.version,1);assert.equal(s.tokens.length,0);
 const sanitized=validateTerrain({"-2,2":"parede","2,2":"cobertura","4,4":"runa","25,5":"parede"});
 assert.deepEqual(sanitized,{"2,2":"cobertura"});
});
