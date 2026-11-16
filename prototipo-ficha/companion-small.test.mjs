import test from "node:test";
import assert from "node:assert/strict";
import {SMALL_ATTR_CUMULATIVE,SMALL_BASE_LIFE,independentSmallCost,independentSmallLife,smallCompanionBudget} from "./companion-small.mjs";

test("custo cumulativo de Força e Vigor dobra a tabela-base experimental de Atributos",()=>{
 for(let grade=0;grade<=6;grade++){
  assert.equal(independentSmallCost({forca:grade}),2*SMALL_ATTR_CUMULATIVE[grade]);
  assert.equal(independentSmallCost({vigor:grade}),2*SMALL_ATTR_CUMULATIVE[grade]);
  assert.equal(independentSmallCost({destreza:grade}),SMALL_ATTR_CUMULATIVE[grade]);
 }
});
test("o XP da Pequena é reserva própria igual ao XP total do domador; Vida aumenta pelos Atributos",()=>{
 const attrs={forca:2,vigor:1,agilidade:2};
 const r=smallCompanionBudget(20,attrs);
 assert.deepEqual([r.total,r.spent,r.remaining,r.valid,r.ownLife,r.lifeBonusToTamer],[20,11,9,true,3,1]);
 assert.deepEqual([smallCompanionBudget(10,attrs).valid,smallCompanionBudget(0,{}).ownLife],[false,1]);
});
test("compras inválidas não alteram ou aumentam orçamento",()=>{
 assert.throws(()=>independentSmallCost({forca:7}),RangeError);
 assert.throws(()=>independentSmallCost({vigor:-1}),RangeError);
 assert.throws(()=>smallCompanionBudget(-1),RangeError);
});

test("Vida base 1 + Vigor + piso(Força/2), mesmo para Grau 1",()=>{
 assert.equal(SMALL_BASE_LIFE,1);
 assert.equal(independentSmallLife({}),1);
 assert.equal(independentSmallCost({forca:1}),2);
 assert.equal(independentSmallLife({forca:1}),1);
 assert.equal(independentSmallCost({vigor:1}),2);
 assert.equal(independentSmallLife({vigor:1}),2);
 assert.equal(independentSmallCost({forca:2}),6);
 assert.equal(independentSmallLife({forca:2}),2);
 assert.equal(independentSmallLife({forca:4,vigor:3}),6);
 for(let f=0;f<=6;f++)for(let v=0;v<=6;v++){
  assert.equal(independentSmallLife({forca:f,vigor:v}),1+v+Math.floor(f/2));
 }
});
test("XP próprio acompanha crescimento do XP total do jogador sem liberar Vida gratuita",()=>{
 const a={forca:2,vigor:1};
 const early=smallCompanionBudget(8,a),late=smallCompanionBudget(20,a);
 assert.equal(early.ownLife,late.ownLife);
 assert.equal(early.spent,late.spent);
 assert.equal(late.remaining-early.remaining,12);
 assert.equal(early.valid,true);
 assert.throws(()=>independentSmallLife({forca:7}),RangeError);
});
