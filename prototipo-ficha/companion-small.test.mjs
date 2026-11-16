import test from "node:test";
import assert from "node:assert/strict";
import {SMALL_ATTR_CUMULATIVE,independentSmallCost,smallCompanionBudget} from "./companion-small.mjs";

test("custo cumulativo de Força e Vigor dobra a tabela-base experimental de Atributos",()=>{
 for(let grade=0;grade<=6;grade++){
  assert.equal(independentSmallCost({forca:grade}),2*SMALL_ATTR_CUMULATIVE[grade]);
  assert.equal(independentSmallCost({vigor:grade}),2*SMALL_ATTR_CUMULATIVE[grade]);
  assert.equal(independentSmallCost({destreza:grade}),SMALL_ATTR_CUMULATIVE[grade]);
 }
});
test("o XP da Pequena é reserva própria igual ao XP total do domador; Vida própria fixa 1",()=>{
 const attrs={forca:2,vigor:1,agilidade:2};
 const r=smallCompanionBudget(20,attrs);
 assert.deepEqual([r.total,r.spent,r.remaining,r.valid,r.ownLife,r.lifeBonusToTamer],[20,11,9,true,1,1]);
 assert.deepEqual([smallCompanionBudget(10,attrs).valid,smallCompanionBudget(0,{}).ownLife],[false,1]);
});
test("compras inválidas não alteram ou aumentam orçamento",()=>{
 assert.throws(()=>independentSmallCost({forca:7}),RangeError);
 assert.throws(()=>independentSmallCost({vigor:-1}),RangeError);
 assert.throws(()=>smallCompanionBudget(-1),RangeError);
});
