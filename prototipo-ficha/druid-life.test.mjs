import test from "node:test";
import assert from "node:assert/strict";
import {distribuirVidaEmQuatroFaixas,vidaAnimalAoTransformar,
  prepararVidaDruidica,simularGolpeDruidico} from "./druid-life.mjs";

test("Saúde preserva quatro faixas de Vida, com duas últimas fixas",()=>{
  const expected={4:[1,1,1,1],5:[2,1,1,1],6:[2,2,1,1],7:[3,2,1,1],8:[3,3,1,1]};
  for(const [n,parts] of Object.entries(expected))
    assert.deepEqual(distribuirVidaEmQuatroFaixas(+n),parts);
});

test("Forma pequena usa Vida reduzida por dano humano preexistente e não gera cura",()=>{
  const s=prepararVidaDruidica({vidaMaximaHumana:7,vidaAtualHumana:5,vidaMaximaAnimal:6});
  assert.equal(s.caso,"menor");
  assert.equal(s.vidaAnimalAtual,4);
  assert.equal(s.vidaHumanaReal,5);
  assert.equal(s.pvTemporarios,0);
  assert.deepEqual(vidaAnimalAoTransformar({vidaMaximaHumana:7,vidaAtualHumana:5,vidaMaximaAnimal:6}),
    {vidaAnimalMaxima:6,vidaAnimalAtual:4,danoPrevio:2,formaSemVida:false});
});

test("Forma menor: golpe letal cancela transformação e transmite DANO INTEGRAL, não só excesso",()=>{
  const s=prepararVidaDruidica({vidaMaximaHumana:7,vidaAtualHumana:5,vidaMaximaAnimal:6});
  const hit=simularGolpeDruidico({estado:s,dano:4});
  assert.equal(hit.formaCancelada,true);
  assert.equal(hit.danoNaVidaReal,4);
  assert.equal(hit.vidaHumanaReal,1);
  assert.equal(hit.morteHumana,false);
  const mortal=simularGolpeDruidico({estado:s,dano:6});
  assert.equal(mortal.formaCancelada,true);
  assert.equal(mortal.vidaHumanaReal,0);
  assert.equal(mortal.morteHumana,true);
});

test("Forma menor: dano não letal é contabilizado no animal sem inventar regra de retorno",()=>{
  const s=prepararVidaDruidica({vidaMaximaHumana:7,vidaAtualHumana:5,vidaMaximaAnimal:6});
  const hit=simularGolpeDruidico({estado:s,dano:2});
  assert.equal(hit.formaCancelada,false);
  assert.equal(hit.vidaAnimalAtual,2);
  assert.equal(hit.vidaHumanaReal,5);
  assert.equal(hit.propagacaoNaoLetalPendente,true);
});

test("Máximos iguais: recebe Vida atual, não recebe PV temporários, pode morrer",()=>{
  const s=prepararVidaDruidica({vidaMaximaHumana:6,vidaAtualHumana:4,vidaMaximaAnimal:6});
  assert.equal(s.caso,"igual");
  assert.equal(s.vidaAnimalAtual,4);
  assert.equal(s.pvTemporarios,0);
  const hit=simularGolpeDruidico({estado:s,dano:3});
  assert.equal(hit.vidaHumanaReal,1);
  assert.equal(hit.danoNaVidaReal,3);
  const mortal=simularGolpeDruidico({estado:hit,dano:1});
  assert.equal(mortal.morteHumana,true);
  assert.equal(mortal.vidaHumanaReal,0);
});

test("Máximo maior: somente diferença de máximos concede PVs temporários",()=>{
  const s=prepararVidaDruidica({vidaMaximaHumana:6,vidaAtualHumana:4,vidaMaximaAnimal:8});
  assert.equal(s.caso,"maior");
  assert.deepEqual([s.vidaHumanaReal,s.pvTemporarios,s.vidaAnimalAtual],[4,2,6]);
  const hit=simularGolpeDruidico({estado:s,dano:3});
  assert.deepEqual([hit.vidaHumanaReal,hit.pvTemporarios,hit.vidaAnimalAtual],[3,0,3]);
  assert.equal(hit.danoNaVidaReal,1);
  const fatal=simularGolpeDruidico({estado:hit,dano:3});
  assert.equal(fatal.morteHumana,true);
  assert.equal(fatal.vidaHumanaReal,0);
});

test("Proteção temporária é consumida antes de atingir a Vida real",()=>{
  const s=prepararVidaDruidica({vidaMaximaHumana:8,vidaAtualHumana:3,vidaMaximaAnimal:11});
  const hit=simularGolpeDruidico({estado:s,dano:2});
  assert.deepEqual([hit.vidaHumanaReal,hit.pvTemporarios],[3,1]);
  assert.equal(hit.danoNaVidaReal,0);
});

test("Validação de entradas não concede Vida incorreta",()=>{
  assert.throws(()=>prepararVidaDruidica({vidaMaximaHumana:6,vidaAtualHumana:7,vidaMaximaAnimal:8}),RangeError);
  assert.throws(()=>prepararVidaDruidica({vidaMaximaHumana:6,vidaAtualHumana:4,vidaMaximaAnimal:0}),RangeError);
  const s=prepararVidaDruidica({vidaMaximaHumana:6,vidaAtualHumana:4,vidaMaximaAnimal:8});
  assert.throws(()=>simularGolpeDruidico({estado:s,dano:-1}),RangeError);
  assert.throws(()=>simularGolpeDruidico({estado:s,dano:1.2}),RangeError);
});

test("XP: fórmula inicial não inventa gasto nem concede recuperação automática de Vida",()=>{
  for(let h=4;h<=16;h++)for(let a=1;a<=18;a++)for(let current=0;current<=h;current++){
    const s=prepararVidaDruidica({vidaMaximaHumana:h,vidaAtualHumana:current,vidaMaximaAnimal:a});
    assert.ok(s.vidaAnimalAtual>=0&&s.vidaAnimalAtual<=a);
    assert.equal(s.vidaHumanaReal,current);
    assert.equal(s.pvTemporarios,a>h?a-h:0);
    assert.equal(s.automatizacaoBloqueada,true);
  }
});
