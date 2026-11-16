/**
 * Codex RPG — transferência de perda de Vida Druídica por três faixas.
 * Referência: SRD v0.47, seção 0-AG.1 (decisão autoral de 16/11/2026).
 *
 * Funções puras: não transformam a ficha, não curam dano humano anterior
 * e não automatizam Vida atual, estados, mudanças de forma ou recuperação.
 */
export function distribuirVidaEmTercos(vidaMaxima) {
  if (!Number.isSafeInteger(vidaMaxima) || vidaMaxima < 1) {
    throw new RangeError("Vida máxima deve ser um inteiro positivo.");
  }
  const base = Math.floor(vidaMaxima / 3);
  const excedentes = vidaMaxima % 3;
  return [0, 1, 2].map((faixa) => base + (faixa < excedentes ? 1 : 0));
}

/**
 * Converte o dano total SOFRIDO em forma animal em perda humana por faixas
 * integralmente consumidas, na ordem da maior faixa para a menor.
 *
 * Ex.: humano 4 [2,1,1], urso 6 [2,2,2]:
 * dano animal 2/3 -> perda humana 2; dano 4/5 -> perda humana 3;
 * dano >= 6 -> morte. Os resultados consideram humano inicialmente íntegro,
 * apenas para referência. Aplicação sobre ferimentos anteriores fica PENDENTE.
 */
export function converterPerdaDeVidaDruidica({ vidaMaximaHumana, vidaMaximaAnimal, danoAnimal }) {
  const faixasHumanas = distribuirVidaEmTercos(vidaMaximaHumana);
  const faixasAnimais = distribuirVidaEmTercos(vidaMaximaAnimal);
  if (!Number.isSafeInteger(danoAnimal) || danoAnimal < 0) {
    throw new RangeError("Dano animal deve ser um inteiro não negativo.");
  }
  const danoEfetivo = Math.min(danoAnimal, vidaMaximaAnimal);
  let acumuladoAnimal = 0;
  let faixasPerdidas = 0;
  for (const faixa of faixasAnimais) {
    acumuladoAnimal += faixa;
    if (danoEfetivo >= acumuladoAnimal) faixasPerdidas++;
    else break;
  }
  const danoHumanoCorrespondente = faixasHumanas
    .slice(0, faixasPerdidas)
    .reduce((acumulado, pontos) => acumulado + pontos, 0);
  return {
    faixasHumanas,
    faixasAnimais,
    faixasPerdidas,
    danoHumanoCorrespondente,
    vidaHumanaRestanteSeIntegro: vidaMaximaHumana - danoHumanoCorrespondente,
    morteAnimal: danoAnimal >= vidaMaximaAnimal
  };
}
