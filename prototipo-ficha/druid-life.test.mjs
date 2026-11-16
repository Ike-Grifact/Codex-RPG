import test from "node:test";
import assert from "node:assert/strict";
import {distribuirVidaEmQuatroFaixas, converterPerdaDeVidaDruidica} from "./druid-life.mjs";

test("Vida em quatro faixas, com duas últimas de um ponto fixo",()=>{
  const expected={
    4:[1,1,1,1],5:[2,1,1,1],6:[2,2,1,1],7:[3,2,1,1],
    8:[3,3,1,1],9:[4,3,1,1],10:[4,4,1,1]
  };
  for(const [v,parts] of Object.entries(expected)) assert.deepEqual(distribuirVidaEmQuatroFaixas(+v),parts);
});

test("hipótese de transformação entre humano 4 e animal 6 é distinta do exemplo revogado",()=>{
  // Vida humana 4 = 1/1/1/1; urso 6 = 2/2/1/1.
  const expected=[4,4,3,3,2,1,0];
  for(let dano=0;dano<=6;dano++){
    const result=converterPerdaDeVidaDruidica({vidaMaximaHumana:4,vidaMaximaAnimal:6,danoAnimal:dano});
    assert.equal(result.hipoteseNaoAprovada,true);
    assert.deepEqual(result.faixasHumanas,[1,1,1,1]);
    assert.deepEqual(result.faixasAnimais,[2,2,1,1]);
    assert.equal(result.vidaHumanaRestanteSeIntegro,expected[dano]);
    assert.equal(result.morteAnimal,dano===6);
  }
});

test("outro exemplo: humano 5 e animal 7",()=>{
  const expected=[5,5,5,3,3,2,1,0];
  for(let dano=0;dano<=7;dano++) assert.equal(converterPerdaDeVidaDruidica({
    vidaMaximaHumana:5,vidaMaximaAnimal:7,danoAnimal:dano
  }).vidaHumanaRestanteSeIntegro,expected[dano]);
});

test("propriedades de integralidade e não recuperação para Vidas 4..30",()=>{
  for(let h=4;h<=30;h++)for(let a=4;a<=30;a++){
    let before=h;
    for(let dano=0;dano<=a;dano++){
      const r=converterPerdaDeVidaDruidica({
        vidaMaximaHumana:h,vidaMaximaAnimal:a,danoAnimal:dano
      });
      assert.ok(r.vidaHumanaRestanteSeIntegro>=0 && r.vidaHumanaRestanteSeIntegro<=before);
      before=r.vidaHumanaRestanteSeIntegro;
      if(dano===a)assert.equal(before,0);
    }
  }
});

test("entradas inválidas não são interpretadas como Vida real",()=>{
  for(const n of [-1,0,2,3,4.3,NaN])assert.throws(()=>distribuirVidaEmQuatroFaixas(n),RangeError);
  for(const n of [-1,0.5,NaN])assert.throws(()=>converterPerdaDeVidaDruidica({
    vidaMaximaHumana:4,vidaMaximaAnimal:6,danoAnimal:n
  }),RangeError);
});
