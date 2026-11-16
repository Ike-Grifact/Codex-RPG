import test from "node:test";
import assert from "node:assert/strict";
import { distribuirVidaEmTercos, converterPerdaDeVidaDruidica } from "./druid-life.mjs";

test("divide a Vida em três faixas com sobras concentradas à esquerda", () => {
  const esperado = {
    1: [1, 0, 0], 2: [1, 1, 0], 3: [1, 1, 1],
    4: [2, 1, 1], 5: [2, 2, 1], 6: [2, 2, 2],
    7: [3, 2, 2], 8: [3, 3, 2], 9: [3, 3, 3],
    10: [4, 3, 3]
  };
  for (const [vida, faixas] of Object.entries(esperado)) {
    assert.deepEqual(distribuirVidaEmTercos(Number(vida)), faixas);
  }
});

test("exemplo autoral: humano de 4 Vida e urso de 6 Vida", () => {
  const esperado = [4, 4, 2, 2, 1, 1, 0];
  for (let dano = 0; dano <= 6; dano++) {
    const resultado = converterPerdaDeVidaDruidica({
      vidaMaximaHumana: 4, vidaMaximaAnimal: 6, danoAnimal: dano
    });
    assert.deepEqual(resultado.faixasHumanas, [2, 1, 1]);
    assert.deepEqual(resultado.faixasAnimais, [2, 2, 2]);
    assert.equal(resultado.vidaHumanaRestanteSeIntegro, esperado[dano]);
    assert.equal(resultado.morteAnimal, dano === 6);
  }
});

test("exemplo independente: humano 5 e animal 7", () => {
  const esperado = [5, 5, 5, 3, 3, 1, 1, 0];
  for (let dano = 0; dano <= 7; dano++) {
    const r = converterPerdaDeVidaDruidica({
      vidaMaximaHumana: 5, vidaMaximaAnimal: 7, danoAnimal: dano
    });
    assert.equal(r.vidaHumanaRestanteSeIntegro, esperado[dano]);
  }
});

test("dano acima da Vida animal continua fatal", () => {
  const resultado = converterPerdaDeVidaDruidica({
    vidaMaximaHumana: 4, vidaMaximaAnimal: 6, danoAnimal: 10
  });
  assert.equal(resultado.vidaHumanaRestanteSeIntegro, 0);
  assert.equal(resultado.morteAnimal, true);
});

test("propriedades matemáticas preservadas para Vidas 1..30", () => {
  for (let humano = 1; humano <= 30; humano++) {
    const blocos = distribuirVidaEmTercos(humano);
    assert.equal(blocos.reduce((a, b) => a + b, 0), humano);
    assert.ok(blocos[0] >= blocos[1] && blocos[1] >= blocos[2]);
    assert.ok(blocos[0] - blocos[2] <= 1);
    for (let animal = 1; animal <= 30; animal++) {
      let restanteAnterior = humano;
      for (let dano = 0; dano <= animal; dano++) {
        const r = converterPerdaDeVidaDruidica({
          vidaMaximaHumana: humano, vidaMaximaAnimal: animal, danoAnimal: dano
        });
        assert.ok(r.vidaHumanaRestanteSeIntegro >= 0);
        assert.ok(r.vidaHumanaRestanteSeIntegro <= restanteAnterior);
        restanteAnterior = r.vidaHumanaRestanteSeIntegro;
        if (dano === animal) assert.equal(restanteAnterior, 0);
      }
    }
  }
});

test("não permite Vida ou dano fracionário/negativo", () => {
  for (const valor of [0, -1, 1.5, Number.NaN]) {
    assert.throws(() => distribuirVidaEmTercos(valor), RangeError);
  }
  assert.throws(() => converterPerdaDeVidaDruidica({
    vidaMaximaHumana: 4, vidaMaximaAnimal: 6, danoAnimal: -1
  }), RangeError);
  assert.throws(() => converterPerdaDeVidaDruidica({
    vidaMaximaHumana: 4, vidaMaximaAnimal: 6, danoAnimal: 1.25
  }), RangeError);
});
