/**
 * PROPOSTO — conversão Druídica na nova Vida de QUATRO faixas.
 * O autor aprovou a estrutura de quatro estados; ainda não aprovou
 * expressamente a equivalência de dano entre faixas animal/humana.
 * Portanto este utilitário É EXPERIMENTAL, não altera fichas reais.
 *
 * As vidas máximas desta hipótese partem de 4, com excedentes
 * alternando entre Saudável/Ferido; Incapacitado e Inconsciente têm 1.
 */
export function distribuirVidaEmQuatroFaixas(vidaMaxima) {
  if (!Number.isSafeInteger(vidaMaxima) || vidaMaxima < 4) {
    throw new RangeError("Vida máxima deste modelo deve ser inteiro >= 4.");
  }
  const pontosExtras = vidaMaxima - 4;
  return [1 + Math.ceil(pontosExtras / 2), 1 + Math.floor(pontosExtras / 2), 1, 1];
}

/**
 * HIPÓTESE (não aprovada): cada faixa animal INTEIRAMENTE perdida
 * transfere a perda da faixa humana na mesma posição.
 * A morte animal continua fatal. Não considera dano humano anterior.
 */
export function converterPerdaDeVidaDruidica({ vidaMaximaHumana, vidaMaximaAnimal, danoAnimal }) {
  const faixasHumanas = distribuirVidaEmQuatroFaixas(vidaMaximaHumana);
  const faixasAnimais = distribuirVidaEmQuatroFaixas(vidaMaximaAnimal);
  if (!Number.isSafeInteger(danoAnimal) || danoAnimal < 0) {
    throw new RangeError("Dano animal deve ser inteiro não negativo.");
  }
  const danoEfetivo = Math.min(danoAnimal, vidaMaximaAnimal);
  let acumuladoAnimal = 0, faixasPerdidas = 0;
  for (const faixa of faixasAnimais) {
    acumuladoAnimal += faixa;
    if (danoEfetivo >= acumuladoAnimal) faixasPerdidas++;
    else break;
  }
  const danoHumanoCorrespondente = faixasHumanas.slice(0,faixasPerdidas)
    .reduce((acc,x)=>acc+x,0);
  return {
    hipoteseNaoAprovada: true,
    faixasHumanas,faixasAnimais,faixasPerdidas,danoHumanoCorrespondente,
    vidaHumanaRestanteSeIntegro: vidaMaximaHumana - danoHumanoCorrespondente,
    morteAnimal: danoAnimal >= vidaMaximaAnimal
  };
}

/**
 * DEFINIDO no SRD v0.48: dano já sofrido na forma original se aplica ponto
 * por ponto à Vida atual inicial da forma animal. Não decide o dano de retorno.
 */
export function vidaAnimalAoTransformar({vidaMaximaHumana,vidaAtualHumana,vidaMaximaAnimal}){
 if(!Number.isSafeInteger(vidaMaximaHumana)||vidaMaximaHumana<4||
    !Number.isSafeInteger(vidaAtualHumana)||vidaAtualHumana<0||vidaAtualHumana>vidaMaximaHumana||
    !Number.isSafeInteger(vidaMaximaAnimal)||vidaMaximaAnimal<1)
  throw new RangeError("Valores de Vida inválidos para transformação");
 const danoPrevio=vidaMaximaHumana-vidaAtualHumana;
 const vidaAnimalAtual=Math.max(0,vidaMaximaAnimal-danoPrevio);
 return {vidaAnimalMaxima:vidaMaximaAnimal,vidaAnimalAtual,danoPrevio,formaSemVida:vidaAnimalAtual===0};
}
