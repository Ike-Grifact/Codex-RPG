import test from "node:test";
import assert from "node:assert/strict";
import {protagonismoAposEscudoDruidico,REGRAS_ACAO_DRUIDICA} from "./druid-action.mjs";
test("Transformação e ação compartilham oportunidade com custos vigentes",()=>{
  assert.equal(REGRAS_ACAO_DRUIDICA.transformaEAgeNaMesmaOportunidade,true);
  assert.equal(REGRAS_ACAO_DRUIDICA.transformacaoExigeTeste,false);
  assert.deepEqual(REGRAS_ACAO_DRUIDICA.custoCoragemPorPorte,{pequena:0,media:1,grande:1});
  assert.equal(REGRAS_ACAO_DRUIDICA.escudoArcanoAdicionalCoragem,1);
});
test("Escudo com Pavor mantido não anulado passa o protagonismo ao inimigo",()=>{
  assert.deepEqual(protagonismoAposEscudoDruidico({pavorMantido:2,pavorAnulado:0}),{
    pavorResidual:2,proximo:"inimigo",podeContinuarProtagonismo:false
  });
});
test("Escudo sem Pavor mantido mantém protagonismo",()=>{
  assert.equal(protagonismoAposEscudoDruidico({pavorMantido:0}).proximo,"jogadores");
});
test("Antecipar anula Pavor antes da decisão",()=>{
  assert.equal(protagonismoAposEscudoDruidico({pavorMantido:1,pavorAnulado:1}).proximo,"jogadores");
  assert.equal(protagonismoAposEscudoDruidico({pavorMantido:2,pavorAnulado:1}).proximo,"inimigo");
});
test("Pavor descartado não conta como Pavor mantido residual",()=>{
  assert.equal(protagonismoAposEscudoDruidico({pavorMantido:0}).pavorResidual,0);
});
test("Pavor negativo, fracionário ou cancelamento excedente são inválidos",()=>{
  for(const value of [{pavorMantido:-1},{pavorMantido:0.5},{pavorMantido:1,pavorAnulado:2},{pavorMantido:1,pavorAnulado:-1}])
    assert.throws(()=>protagonismoAposEscudoDruidico(value),RangeError);
});
